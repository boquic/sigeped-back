// src/db/prismaClient.js
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }, 'warn', 'error'],
});
