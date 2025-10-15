// src/schemas/auth.schemas.js
const { z } = require('zod');

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  telefono: z.string().optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(3).max(255),
  password: z.string().min(8).max(128),
});

const refreshSchema = z.object({ refreshToken: z.string().min(10) });
const forgotSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({ token: z.string().min(10), newPassword: z.string().min(8).max(128) });

function validate(schema) {
  return (req, res, next) => {
    const r = schema.safeParse(req.body);
    if (!r.success) return res.status(400).json({ error: { code: 'BadRequest', message: 'Validation error', details: r.error.flatten() } });
    req.body = r.data; // sanitized
    next();
  };
}

module.exports = { registerSchema, loginSchema, refreshSchema, forgotSchema, resetSchema, validate };
