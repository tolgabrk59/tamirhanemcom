import { PrismaClient } from '@prisma/client';
import { createLogger } from '../utils/logger';

const logger = createLogger('prisma');

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export async function connectDB() {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed: ' + String(error));
    process.exit(1);
  }
}

export async function disconnectDB() {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}
