// src/services/email.service.js
// Minimal stub; integrate nodemailer if SMTP provided
import { config } from '../config/env.js';

export async function sendPasswordReset(email, token) {
  const link = `${config.frontendBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  console.log(`[email] Send reset link to ${email}: ${link}`);
}
