export interface Contact {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot field — always empty for real visitors. */
  company?: string;
}
