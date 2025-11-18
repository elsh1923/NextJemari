import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/db-test - Test database connection
 */
export async function GET() {
  const result: any = {
    connected: false,
    error: null,
    details: {},
  };

  try {
    // Test 1: Basic connection
    await prisma.$connect();
    result.connected = true;
    result.details.connection = "✅ Connected";

    // Test 2: Simple query
    const userCount = await prisma.user.count();
    result.details.userCount = userCount;
    result.details.query = "✅ Query successful";

    // Test 3: Check tables
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    result.details.tables = tables.map((t) => t.tablename);
    result.details.tableCount = tables.length;

    // Test 4: Count records in main tables
    const [articles, tags, comments, likes, bookmarks, follows] = await Promise.all([
      prisma.article.count().catch(() => 0),
      prisma.tag.count().catch(() => 0),
      prisma.comment.count().catch(() => 0),
      prisma.like.count().catch(() => 0),
      prisma.bookmark.count().catch(() => 0),
      prisma.follow.count().catch(() => 0),
    ]);

    result.details.counts = {
      users: userCount,
      articles,
      tags,
      comments,
      likes,
      bookmarks,
      follows,
    };

    return NextResponse.json({
      success: true,
      message: "Database is connected and working!",
      ...result,
    });
  } catch (error: any) {
    result.connected = false;
    result.error = error.message;
    result.details.errorCode = error.code;
    result.details.errorName = error.name;

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        ...result,
        troubleshooting: {
          checkEnv: "Verify DATABASE_URL is set in .env file",
          checkConnection: "Verify database server is running",
          checkCredentials: "Verify database credentials are correct",
          checkNetwork: "Check network connectivity",
          runMigrations: "Run: npm run prisma:migrate",
          generateClient: "Run: npm run prisma:generate",
        },
      },
      { status: 503 }
    );
  } finally {
    // Don't disconnect - keep connection for app use
  }
}

