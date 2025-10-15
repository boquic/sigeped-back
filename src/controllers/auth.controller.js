// src/controllers/auth.controller.js
const { register, login, refresh, logout, me, forgotPassword, resetPassword } = require('../services/auth.service');
const { loginLimiter, forgotPasswordLimiter } = require('../middlewares/rateLimit');

module.exports = {
  registerHandler: async (req, res, next) => {
    try {
      const result = await register(req.body);
      res.status(201).json(result);
    } catch (e) { next(e); }
  },
  loginLimiter,
  loginHandler: async (req, res, next) => {
    try {
      const result = await login(req.body, req.headers['user-agent'], req.ip);
      if (result instanceof Error) return next(result);
      res.json(result);
    } catch (e) { next(e); }
  },
  refreshHandler: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const result = await refresh(refreshToken, req.headers['user-agent'], req.ip);
      if (result instanceof Error) return next(result);
      res.json(result);
    } catch (e) { next(e); }
  },
  logoutHandler: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      await logout(refreshToken);
      res.status(204).send();
    } catch (e) { next(e); }
  },
  meHandler: async (req, res, next) => {
    try {
      const result = await me(req.user.id_usuario);
      res.json(result);
    } catch (e) { next(e); }
  },
  forgotPasswordLimiter,
  forgotPasswordHandler: async (req, res, next) => {
    try {
      const { email } = req.body;
      await forgotPassword(email);
      res.status(204).send();
    } catch (e) { next(e); }
  },
  resetPasswordHandler: async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const result = await resetPassword(token, newPassword);
      if (result instanceof Error) return next(result);
      res.status(204).send();
    } catch (e) { next(e); }
  },
};
