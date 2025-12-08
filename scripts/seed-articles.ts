const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SAMPLE_ARTICLES = [
  {
    title: "The Future of Web Development",
    body: "Web development is evolving rapidly. From AI-assisted coding to new frameworks like Next.js 14, the landscape is changing. In this article, we explore what's next for frontend developers...",
    description: "Exploring the latest trends in web development and what they mean for the future of the industry.",
    tags: ["tech", "web-dev", "future"],
  },
  {
    title: "Understanding React Server Components",
    body: "React Server Components (RSC) represent a paradigm shift in how we build React applications. By moving logic to the server, we can reduce bundle sizes and improve performance...",
    description: "A deep dive into RSCs and how they change the mental model of React applications.",
    tags: ["react", "javascript", "performance"],
  },
  {
    title: "Mastering Tailwind CSS",
    body: "Tailwind CSS has become the de-facto standard for styling modern web apps. Utility-first CSS might seem strange at first, but the productivity gains are undeniable...",
    description: "Tips and tricks for becoming proficient with Tailwind CSS utility classes.",
    tags: ["css", "design", "frontend"],
  },
  {
    title: "Why TypeScript is Essential in 2024",
    body: "Gone are the days of pure JavaScript for large scale apps. TypeScript provides the safety and tooling necessary for modern engineering teams...",
    description: "Making the case for TypeScript in modern web application development.",
    tags: ["typescript", "programming", "best-practices"],
  },
  {
    title: "Deploying to the Edge",
    body: "Edge computing brings computation closer to the user. With platforms like Vercel and Cloudflare, deploying globally distributed apps has never been easier...",
    description: "How edge functions and CDNs are revolutionizing application deployment.",
    tags: ["devops", "cloud", "deployment"],
  },
  {
    title: "The Art of Clean Code",
    body: "Writing code is easy. Writing clean, maintainable code is an art form. Let's discuss principles like DRY, SOLID, and how to write code for humans, not just machines...",
    description: "Principles and practices for writing maintainable and readable code.",
    tags: ["coding", "career", "clean-code"],
  },
];

async function main() {
  try {
    console.log('🌱 Starting seed...');

    // 1. Get or create a user
    let user = await prisma.user.findFirst();
    if (!user) {
      console.log('Creating demo user...');
      user = await prisma.user.create({
        data: {
          username: 'demo_user',
          email: 'demo@example.com',
          name: 'Demo User',
          image: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
          role: 'USER',
        }
      });
    }
    console.log(`Using user: ${user.username} (${user.id})`);

    // 2. Create articles
    console.log('Creating articles...');
    for (const data of SAMPLE_ARTICLES) {
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
      
      await prisma.article.create({
        data: {
          title: data.title,
          slug: slug,
          body: data.body,
          description: data.description,
          published: true, // IMPORTANT: Must be published to show on home page
          authorId: user.id,
          viewCount: Math.floor(Math.random() * 1000),
          readingTime: Math.ceil(data.body.length / 200),
          tags: {
            create: data.tags.map(tag => ({
              tag: {
                connectOrCreate: {
                  where: { name: tag },
                  create: { name: tag, slug: tag }
                }
              }
            }))
          }
        }
      });
      console.log(`Created article: "${data.title}"`);
    }

    console.log('✅ Seeding complete!');

  } catch (e) {
    console.error('❌ Seeding failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
