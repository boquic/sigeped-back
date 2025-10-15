// src/services/email.service.js
// Minimal stub; integrate nodemailer if SMTP provided
const { config } = require('../config/env');

async function sendPasswordReset(email, token) {
  const link = `${config.frontendBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  // eslint-disable-next-line no-console
  console.log(`[email] Send reset link to ${email}: ${link}`);
}

module.exports = { sendPasswordReset };
