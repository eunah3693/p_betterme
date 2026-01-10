import { PrismaClient } from '@prisma/client';

// DATABASE_URL 확인용 로그
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// DATABASE_URL에 SSL 비활성화 옵션 강제 추가
const databaseUrl = process.env.DATABASE_URL?.includes('?')
  ? `${process.env.DATABASE_URL}&sslmode=disable`
  : `${process.env.DATABASE_URL}?sslmode=disable`;

console.log('Modified DATABASE_URL:', databaseUrl);

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

