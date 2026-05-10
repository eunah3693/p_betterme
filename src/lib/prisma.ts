import { PrismaClient } from '@prisma/client';

const rawUrl = process.env.DATABASE_URL ?? '';
const isPostgres = rawUrl.startsWith('postgresql://') || rawUrl.startsWith('postgres://');

const withSearchParams = (url: string, params: Record<string, string>) => {
  if (!url) {
    return url;
  }

  const parsedUrl = new URL(url);

  Object.entries(params).forEach(([key, value]) => {
    if (!parsedUrl.searchParams.has(key)) {
      parsedUrl.searchParams.set(key, value);
    }
  });

  return parsedUrl.toString();
};

// Vercel 서버리스는 인스턴스가 늘 때 Prisma connection pool도 함께 늘어납니다.
// Supabase session pooler의 낮은 max client 제한을 넘지 않도록 pool을 작게 유지합니다.
const databaseUrl = withSearchParams(
  rawUrl,
  isPostgres
    ? { sslmode: 'require', connection_limit: '1', pool_timeout: '20' }
    : { sslmode: 'disable' }
);

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

globalForPrisma.prisma = prisma;
