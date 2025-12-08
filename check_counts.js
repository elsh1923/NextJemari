const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking consistency between User _count and Follow table...");
    
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { followers: true, following: true }
        }
      }
    });

    for (const user of users) {
      const actualFollowers = await prisma.follow.count({
        where: { followingId: user.id }
      });
      
      const actualFollowing = await prisma.follow.count({
        where: { followerId: user.id }
      });

      const followersMatch = user._count.followers === actualFollowers;
      const followingMatch = user._count.following === actualFollowing;

      if (!followersMatch || !followingMatch) {
        console.log(`MISMATCH for USER: ${user.username}`);
        if (!followersMatch) {
          console.log(`  Followers: _count=${user._count.followers}, Actual=${actualFollowers}`);
        }
        if (!followingMatch) {
          console.log(`  Following: _count=${user._count.following}, Actual=${actualFollowing}`);
        }
      }
    }

  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
