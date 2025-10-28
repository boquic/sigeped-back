// src/services/email.service.js
import nodemailer from 'nodemailer';
import { config } from '../config/env.js';
import { logger } from '../config/logger.js';

let cachedTransport = null;

function getTransporter() {
  if (cachedTransport) return cachedTransport;
  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
    logger.warn({ module: 'email' }, '[email] SMTP not configured; emails will be skipped');
    return null;
  }
  const tls = /brevo\.com$/i.test(String(config.smtp.host))
    ? { servername: 'smtp-relay.sendinblue.com' }
    : undefined;
  cachedTransport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port || 587,
    secure: false,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
    tls,
  });
  return cachedTransport;
}

function baseHtml({ title, greeting, bodyLines, ctaText, ctaUrl, footer }) {
  const body = bodyLines.map((l) => `<p style="margin:0 0 12px">${l}</p>`).join('');
  const cta = ctaText && ctaUrl
    ? `<p style="margin:24px 0"><a href="${ctaUrl}" style="background:#111827;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;display:inline-block">${ctaText}</a></p>`
    : '';
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title></head>
  <body style="background:#f3f4f6;margin:0;padding:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
    <div style="max-width:600px;margin:32px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="padding:20px 24px;border-bottom:1px solid #e5e7eb">
        <h1 style="margin:0;font-size:18px;color:#111827">${title}</h1>
      </div>
      <div style="padding:24px">
        <p style="margin:0 0 12px;color:#111827">${greeting}</p>
        ${body}
        ${cta}
        <p style="margin-top:24px;color:#6b7280;font-size:12px">${footer || 'Si no solicitaste este correo, puedes ignorarlo.'}</p>
      </div>
    </div>
    <div style="text-align:center;color:#9ca3af;font-size:12px;margin:12px 0">${new Date().getFullYear()} · ${config.frontendBaseUrl}</div>
  </body></html>`;
}

export async function sendNewAccountEmail(to, username, tempPassword) {
  const transport = getTransporter();
  const subject = 'Tu nueva cuenta';
  const text = `Hola ${username},\n\nTu cuenta ha sido creada. Contraseña temporal: ${tempPassword}.\nPor favor inicia sesión y cámbiala.`;
  const html = baseHtml({
    title: 'Bienvenido a la plataforma',
    greeting: `Hola ${username},`,
    bodyLines: [
      'Tu cuenta ha sido creada correctamente.',
      `Contraseña temporal: <strong>${tempPassword}</strong>`,
      'Por favor inicia sesión y cambia tu contraseña por seguridad.',
    ],
    ctaText: 'Ir al login',
    ctaUrl: `${config.frontendBaseUrl}/login`,
  });
  if (!transport) {
    logger.warn({ module: 'email', to, subject }, '[email] transport unavailable; skipped');
    return;
  }
  const from = config.smtp.from || config.smtp.user;
  try {
    const info = await transport.sendMail({ from, to, subject, text, html });
    logger.info({ module: 'email', to, messageId: info.messageId }, '[email] sent new account');
  } catch (e) {
    logger.warn({ module: 'email', to, err: e?.message }, '[email] send new account failed');
  }
}

export async function sendPasswordResetEmail(to, username, tempPassword) {
  const transport = getTransporter();
  const subject = 'Contraseña restablecida';
  const text = `Hola ${username},\n\nTu contraseña ha sido restablecida. Nueva contraseña temporal: ${tempPassword}.\nPor favor inicia sesión y cámbiala.`;
  const html = baseHtml({
    title: 'Contraseña restablecida',
    greeting: `Hola ${username},`,
    bodyLines: [
      'Tu contraseña ha sido restablecida correctamente.',
      `Nueva contraseña temporal: <strong>${tempPassword}</strong>`,
      'Por favor inicia sesión y cámbiala por seguridad.',
    ],
    ctaText: 'Ir al login',
    ctaUrl: `${config.frontendBaseUrl}/login`,
  });
  if (!transport) {
    logger.warn({ module: 'email', to, subject }, '[email] transport unavailable; skipped');
    return;
  }
  const from = config.smtp.from || config.smtp.user;
  try {
    const info = await transport.sendMail({ from, to, subject, text, html });
    logger.info({ module: 'email', to, messageId: info.messageId }, '[email] sent password reset');
  } catch (e) {
    logger.warn({ module: 'email', to, err: e?.message }, '[email] send password reset failed');
  }
}

export async function sendPasswordReset(email, token) {
  const link = `${config.frontendBaseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const transport = getTransporter();
  const subject = 'Restablecer contraseña';
  const text = `Para restablecer tu contraseña, visita: ${link}`;
  const html = baseHtml({
    title: 'Restablece tu contraseña',
    greeting: 'Hola,',
    bodyLines: ['Solicitaste restablecer tu contraseña.', 'Haz clic en el botón para continuar.'],
    ctaText: 'Restablecer contraseña',
    ctaUrl: link,
  });
  if (!transport) {
    logger.warn({ module: 'email', to: email, subject }, '[email] transport unavailable; skipped');
    return;
  }
  const from = config.smtp.from || config.smtp.user;
  try {
    const info = await transport.sendMail({ from, to: email, subject, text, html });
    logger.info({ module: 'email', to: email, messageId: info.messageId }, '[email] sent reset link');
  } catch (e) {
    logger.warn({ module: 'email', to: email, err: e?.message }, '[email] send reset link failed');
  }
}
