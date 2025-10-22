// src/controllers/auth.controller.js
import { register, login, refresh, logout, me} from '../services/auth.service.js';
import { loginLimiter, forgotPasswordLimiter } from '../middlewares/rateLimit.js';

export async function registerHandler(req, res, next) {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (e) { next(e); }
}

export { loginLimiter };

export async function loginHandler(req, res, next) {
  try {
    const result = await login(req.body, req.headers['user-agent'], req.ip);
    if (result instanceof Error) return next(result);
    res.json(result);
  } catch (e) { next(e); }
}

export async function refreshHandler(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await refresh(refreshToken, req.headers['user-agent'], req.ip);
    if (result instanceof Error) return next(result);
    res.json(result);
  } catch (e) { next(e); }
}

export async function logoutHandler(req, res, next) {
  try {
    const { refreshToken } = req.body;
    await logout(refreshToken);
    res.status(204).send();
  } catch (e) { next(e); }
}

export async function meHandler(req, res, next) {
  try {
    const result = await me(req.user.id_usuario);
    res.json(result);
  } catch (e) { next(e); }
}

export { forgotPasswordLimiter };

export async function forgotPasswordHandler(req, res, next) {
  try {
    const { email } = req.body;
    await forgotPassword(email);
    res.status(204).send();
  } catch (e) { next(e); }
}

export async function resetPasswordHandler(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPassword(token, newPassword);
    if (result instanceof Error) return next(result);
    res.status(204).send();
  } catch (e) { next(e); }
}
