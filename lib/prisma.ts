import { PrismaClient } from "@/app/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const rawConnectionString = process.env.DATABASE_URL;

function ensureSslModeVerifyFull(conn?: string | null) {
  if (!conn) return conn;

  try {
    // If the connection string contains sslmode with weaker aliases, normalize to verify-full
    const lower = conn.toLowerCase();
    const hasSslMode = /[?&]sslmode=[a-z0-9_-]+/.test(lower);

    if (hasSslMode) {
      // Replace occurrences of sslmode=prefer|require|verify-ca with sslmode=verify-full
      return conn.replace(/([?&]sslmode=)(prefer|require|verify-ca)/i, "$1verify-full");
    }

    // No sslmode present — append sslmode=verify-full to preserve current strict behavior
    return conn.includes("?") ? `${conn}&sslmode=verify-full` : `${conn}?sslmode=verify-full`;
  } catch (err) {
    return conn;
  }
}

const connectionString = ensureSslModeVerifyFull(rawConnectionString);

const createPrismaClient = () => {
  if (!connectionString) {
    return new PrismaClient({
      datasourceUrl: "postgresql://localhost:5432/dummy",
    } as any);
  }

  if (connectionString.startsWith("prisma+postgres://")) {
    return new PrismaClient({
      datasourceUrl: connectionString,
    } as any);
  } else {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter } as any);
  }
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;