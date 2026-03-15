import { PrismaClient } from '@prisma/client';

const rawUrl = process.env.DATABASE_URL ?? '';
const isPostgres = rawUrl.startsWith('postgresql://') || rawUrl.startsWith('postgres://');
const databaseUrl = isPostgres
  ? rawUrl
  : rawUrl.includes('?')
    ? `${rawUrl}&sslmode=disable`
    : `${rawUrl}?sslmode=disable`;

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

