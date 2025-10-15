// src/db/prismaClient.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }, 'warn', 'error'],
});

module.exports = { prisma };
