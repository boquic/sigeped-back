// src/server.js
import dotenv from 'dotenv';
import { config } from './config/env.js';
import { logger } from './config/logger.js';
import app from './app.js';
import { seed } from './seed/index.js';

dotenv.config();

async function start() {
  try {
    await seed();
  } catch (e) {
    logger.warn({ err: e }, 'Seed failed (continuing)');
  }
  const port = config.port;
  app.listen(port, () => {
    logger.info({ port }, 'API listening');
  });
}

start();
