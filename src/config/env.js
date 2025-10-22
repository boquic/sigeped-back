// src/config/env.js
const required = [
  'PORT',
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'ACCESS_TOKEN_TTL',
  'REFRESH_TOKEN_TTL',
  'CORS_ORIGINS',
  'FRONTEND_BASE_URL',
  'DEFAULT_ROLE_NAME',
];

for (const key of required) {
  if (!process.env[key]) {
    // Do not throw here to allow docker-compose envs; warn instead
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing ${key}. Ensure it's set in environment/.env`);
  }
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  dbUrl: process.env.DATABASE_URL,
  // Enable when running behind a reverse proxy (e.g., Nginx/Traefik). Set TRUST_PROXY=true
  // Defaults to true in production, false otherwise.
  trustProxy: process.env.TRUST_PROXY ? process.env.TRUST_PROXY === 'true' : (process.env.NODE_ENV === 'production'),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.ACCESS_TOKEN_TTL || '15m',
    refreshTtl: process.env.REFRESH_TOKEN_TTL || '7d',
  },
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  frontendBaseUrl: process.env.FRONTEND_BASE_URL || 'http://localhost:3000',
  defaultRoleName: process.env.DEFAULT_ROLE_NAME || 'operario',
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
  seed: {
    adminEmail: process.env.SEED_ADMIN_EMAIL,
    adminPassword: process.env.SEED_ADMIN_PASSWORD,
    adminUsername: process.env.SEED_ADMIN_USERNAME,
  },
};
