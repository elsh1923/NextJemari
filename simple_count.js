const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const articles = await prisma.article.count();
  console.log(`COUNTS: Users=${users}, Articles=${articles}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
