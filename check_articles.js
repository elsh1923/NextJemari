const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
        slug: true,
      }
    });
    
    console.log(`Found ${articles.length} articles:`);
    articles.forEach(a => {
      console.log(`- [${a.published ? 'PUBLISHED' : 'DRAFT'}] "${a.title}" (slug: ${a.slug}, created: ${a.createdAt})`);
    });
    
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
