import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL is not set in environment variables.\n" +
    "Please add DATABASE_URL to your .env file.\n" +
    "Example: DATABASE_URL=\"postgresql://user:password@localhost:5432/dbname?schema=public\""
  );
}

// Use DATABASE_URL as-is (connection pooling is handled by Prisma)
const databaseUrl = process.env.DATABASE_URL || "";

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  errorFormat: "pretty",
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Connection middleware to handle errors gracefully
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error: any) {
    // Log connection errors
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      console.error("Database connection error:", error.message);
    }
    throw error;
  }
});

export default prisma;
