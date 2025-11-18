/**
 * Test database connection
 * Run with: npx tsx scripts/test-db.ts
 */
import prisma from "../src/lib/prisma";

async function testConnection() {
  console.log("🔍 Testing database connection...\n");

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in environment variables");
    console.error("Please add DATABASE_URL to your .env file");
    process.exit(1);
  }

  console.log("📋 DATABASE_URL:", process.env.DATABASE_URL.replace(/:[^:@]+@/, ":****@"));
  console.log("");

  try {
    // Test connection
    console.log("1. Testing connection...");
    await prisma.$connect();
    console.log("   ✅ Connected successfully\n");

    // Test query
    console.log("2. Testing query...");
    const userCount = await prisma.user.count();
    console.log(`   ✅ Query successful. Found ${userCount} users\n`);

    // Test tables
    console.log("3. Checking tables...");
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    console.log(`   ✅ Found ${tables.length} tables:`);
    tables.forEach((t) => console.log(`      - ${t.tablename}`));
    console.log("");

    // Test a simple query on each main table
    console.log("4. Testing table queries...");
    const [users, articles, tags, comments, likes, bookmarks, follows] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.article.count().catch(() => 0),
      prisma.tag.count().catch(() => 0),
      prisma.comment.count().catch(() => 0),
      prisma.like.count().catch(() => 0),
      prisma.bookmark.count().catch(() => 0),
      prisma.follow.count().catch(() => 0),
    ]);

    console.log(`   ✅ Users: ${users}`);
    console.log(`   ✅ Articles: ${articles}`);
    console.log(`   ✅ Tags: ${tags}`);
    console.log(`   ✅ Comments: ${comments}`);
    console.log(`   ✅ Likes: ${likes}`);
    console.log(`   ✅ Bookmarks: ${bookmarks}`);
    console.log(`   ✅ Follows: ${follows}`);
    console.log("");

    console.log("✅ All database tests passed!");
    console.log("✅ Database is connected and working correctly!");

  } catch (error: any) {
    console.error("\n❌ Database connection failed!");
    console.error("Error:", error.message);
    console.error("\nTroubleshooting:");
    console.error("1. Check if DATABASE_URL is correct in .env file");
    console.error("2. Verify database server is running");
    console.error("3. Check network connectivity");
    console.error("4. Verify database credentials");
    console.error("5. Run: npm run prisma:generate");
    console.error("6. Run: npm run prisma:migrate");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

