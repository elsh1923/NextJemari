const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Count users
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      take: 5,
      select: { username: true, email: true, role: true }
    });

    // Count articles
    const articleCount = await prisma.article.count();
    const publishedCount = await prisma.article.count({ where: { published: true } });
    const articles = await prisma.article.findMany({
      take: 5,
      select: { title: true, published: true, author: { select: { username: true } } }
    });

    console.log('--- Database Statistics ---');
    console.log(`Total Users: ${userCount}`);
    console.log('Sample Users:');
    users.forEach(u => console.log(` - ${u.username} (${u.email}) [${u.role}]`));

    console.log(`\nTotal Articles: ${articleCount}`);
    console.log(`Published Articles: ${publishedCount}`);
    console.log('Sample Articles:');
    articles.forEach(a => console.log(` - "${a.title}" by ${a.author.username} [${a.published ? 'PUBLISHED' : 'DRAFT'}]`));

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
