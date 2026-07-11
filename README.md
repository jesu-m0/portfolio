# jmoreno.dev

Personal portfolio of Jesús Moreno Durán — [jmoreno.dev](https://jmoreno.dev). Built with Angular and Tailwind CSS, installable as a PWA, with a serverless contact-form API.

## Stack

- **Frontend:** Angular 21 (standalone components), Tailwind CSS 4, self-hosted [Rethink Sans](https://fontsource.org/fonts/rethink-sans)
- **PWA:** Angular service worker (`ngsw-config.json`)
- **Contact API:** serverless function in [`api/send-email.js`](api/send-email.js) using Nodemailer (Gmail SMTP) and Handlebars email templates

## Development

```bash
npm install
npm start          # dev server at http://localhost:4200
```

The contact form posts to `/api/send-email`, which only exists on the deployment platform — locally the form will fail unless you run the function through your platform's CLI (e.g. `vercel dev`).

## Contact-form API

`api/send-email.js` sends two emails per submission (a notification to me, a confirmation to the visitor). It validates and length-caps all fields, escapes HTML in the message, drops submissions that fill the hidden honeypot field, and rate-limits per IP.

Required environment variables:

| Variable | Purpose |
| --- | --- |
| `GMAIL_USER` | Gmail address used to send mail |
| `GMAIL_APP_PASS` | Gmail [app password](https://support.google.com/accounts/answer/185833) |
| `FROM_NAME` | Display name for outgoing mail |
| `CONTACT_EMAIL` | Address that receives contact notifications |

## Testing & building

```bash
npm test                                        # Karma/Jasmine, watch mode
npx ng test --watch=false --browsers=ChromeHeadless   # single run
npm run build                                   # production build to dist/
```
