import dotenv from 'dotenv';
import app from './src/app.js';
import { seed } from './src/seed/index.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await seed();
  } catch (e) {
    console.warn('Seed failed (continuing):', e?.message || e);
  }
  app.listen(PORT, () => {
    console.log(`🚀 Backend SIGEPED corriendo en http://localhost:${PORT}`);
  });
}

start();