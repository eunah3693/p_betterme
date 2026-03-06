import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL?.includes('?')
  ? `${process.env.DATABASE_URL}&sslmode=disable`
  : `${process.env.DATABASE_URL}?sslmode=disable`;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

