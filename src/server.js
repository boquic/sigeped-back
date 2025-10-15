// src/server.js
require('dotenv').config();
const { config } = require('./config/env');
const { logger } = require('./config/logger');
const app = require('./app');
const { seed } = require('./seed');

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
