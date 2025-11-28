const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Listing all users and follower counts:");
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { followers: true }
        }
      }
    });
    
    users.forEach(u => {
      console.log(`- ${u.username} (ID: ${u.id}): ${u._count.followers} followers`);
    });

    const fita = users.find(u => u.username === 'fita');
    if (fita) {
      console.log(`\nDetailed check for fita (${fita.id}):`);
      console.log(`Followers count (_count): ${fita._count.followers}`);
      console.log(`Following count (_count): ${fita._count.following}`);
      
      const followers = await prisma.follow.findMany({
        where: { followingId: fita.id },
        include: { follower: true }
      });
      console.log(`Actual followers in table: ${followers.length}`);

      const following = await prisma.follow.findMany({
        where: { followerId: fita.id },
        include: { following: true }
      });
      console.log(`Actual following in table: ${following.length}`);
    }

  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
