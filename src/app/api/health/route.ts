import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/health - Health check endpoint with database status
 */
export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      error: null as string | null,
    },
  };

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    health.database.connected = true;
  } catch (error: any) {
    health.database.connected = false;
    health.database.error = error.message;
    health.status = "degraded";
  }

  return NextResponse.json(health, {
    status: health.status === "ok" ? 200 : 503,
  });
}

