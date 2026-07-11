// api/send-email.js
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';

// ——— 1) Load & compile templates at startup ———
const templatesDirectory = join(process.cwd(), 'api', 'email-templates');
const messageSrc = readFileSync(join(templatesDirectory, 'message-to-me-email.html'), 'utf8');
const confirmationSrc = readFileSync(join(templatesDirectory, 'confirmation-email.html'), 'utf8');
const messageTpl     = Handlebars.compile(messageSrc);
const confirmationTpl = Handlebars.compile(confirmationSrc);

// ——— 2) Create reusable SMTP transporter ———
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  }
})

// ——— 3) Abuse protection ———
// Generous for real visitors, but stops megabyte payloads.
const FIELD_LIMITS = { name: 100, email: 254, subject: 150, message: 5000 };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Per-IP throttle. In-memory, so it only counts requests hitting the same
// warm serverless instance — enough to blunt bursts without extra infra.
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX_PER_WINDOW = 5;
const recentRequests = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (recentRequests.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  const limited = recent.length >= RATE_MAX_PER_WINDOW;
  if (!limited) recent.push(now);
  recentRequests.set(ip, recent);
  return limited;
}

// Handlebars escapes {{fields}}, but the message needs <br/> tags kept,
// so it goes through {{{message}}} pre-escaped here.
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validate({ name, email, subject, message }) {
  const fields = { name, email, subject, message };
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== 'string' || !value.trim()) {
      return `Missing or empty field: ${key}`;
    }
    if (value.length > FIELD_LIMITS[key]) {
      return `Field too long: ${key} (max ${FIELD_LIMITS[key]} characters)`;
    }
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Invalid email address';
  }
  return null;
}

export default async function handler(req, res) {
  // ——— 4) Only accept POST ———
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, subject, email, message, company } = req.body || {};

  // ——— 5) Honeypot: real visitors never see this field; bots fill it in.
  // Answer with success so they don't retry. ———
  if (company) {
    return res.status(200).json({ success: true });
  }

  // ——— 6) Rate limit per IP ———
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' && forwarded.split(',')[0].trim())
    || req.socket?.remoteAddress
    || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }

  // ——— 7) Validate body ———
  const validationError = validate({ name, email, subject, message });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const safeMessageHtml = escapeHtml(message).replace(/\n/g, '<br/>');

  try {
    // ——— 8a) Notify yourself ———
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.GMAIL_USER}>`,
      to:   process.env.CONTACT_EMAIL,
      subject: `New contact from ${name}: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: messageTpl({
        name,
        email,
        subject,
        message: safeMessageHtml,
      }),
    });

    // ——— 8b) Send confirmation to visitor ———
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.GMAIL_USER}>`,
      to:   email,
      subject: `Thanks for getting in touch, ${name}!`,
      text: `Hi ${name},\n\nThanks for your message! I’ll read it shortly and reply as soon as I can.\n\nCheers,\n${process.env.FROM_NAME}`,
      html: confirmationTpl({
        name,
        subject,
        message: safeMessageHtml,
        fromName: process.env.FROM_NAME,
      }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('✉️ Email error:', err);
    return res.status(500).json({ error: 'Failed to send emails' });
  }
}
