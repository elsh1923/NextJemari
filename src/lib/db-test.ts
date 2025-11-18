/**
 * Database connectivity test utility
 * Run this to verify database connection
 */
import prisma from "./prisma";

export async function testDatabaseConnection() {
  try {
    // Test basic connection
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Test query
    const userCount = await prisma.user.count();
    console.log(`✅ Database query successful. Users in database: ${userCount}`);

    // Test if tables exist
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `;
    console.log(`✅ Found ${tables.length} tables in database`);
    console.log("Tables:", tables.map((t) => t.tablename).join(", "));

    return {
      success: true,
      userCount,
      tableCount: tables.length,
      tables: tables.map((t) => t.tablename),
    };
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    return {
      success: false,
      error: error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  testDatabaseConnection()
    .then((result) => {
      if (result.success) {
        console.log("\n✅ All database tests passed!");
        process.exit(0);
      } else {
        console.log("\n❌ Database test failed!");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("❌ Unexpected error:", error);
      process.exit(1);
    });
}

