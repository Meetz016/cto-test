import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma client used throughout the application.
 */
export const prisma = new PrismaClient();

/**
 * Disconnects the Prisma client. Useful for graceful shutdown and testing.
 */
export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect();
};
