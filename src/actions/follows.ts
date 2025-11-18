"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NotFoundError, ForbiddenError } from "@/types";

/**
 * Toggle follow on a user
 */
export async function toggleFollow(followingId: string): Promise<{
  following: boolean;
  followerCount: number;
  followingCount: number;
}> {
  const user = await requireAuth();

  // Can't follow yourself
  if (user.id === followingId) {
    throw new ForbiddenError("You cannot follow yourself");
  }

  // Verify user exists
  const targetUser = await prisma.user.findUnique({
    where: { id: followingId },
  });

  if (!targetUser) {
    throw new NotFoundError("User");
  }

  // Check if follow already exists
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId,
      },
    },
  });

  if (existingFollow) {
    // Unfollow
    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });
  } else {
    // Follow
    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId,
      },
    });
  }

  // Get updated counts
  const [followerCount, followingCount] = await Promise.all([
    prisma.follow.count({
      where: { followingId },
    }),
    prisma.follow.count({
      where: { followerId: followingId },
    }),
  ]);

  return {
    following: !existingFollow,
    followerCount,
    followingCount,
  };
}

/**
 * Check if user is following another user
 */
export async function isFollowing(followingId: string): Promise<boolean> {
  try {
    const user = await requireAuth();
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId,
        },
      },
    });
    return !!follow;
  } catch {
    return false;
  }
}

/**
 * Get follower count for a user
 */
export async function getFollowerCount(userId: string): Promise<number> {
  try {
    return await prisma.follow.count({
      where: { followingId: userId },
    });
  } catch {
    return 0;
  }
}

/**
 * Get following count for a user
 */
export async function getFollowingCount(userId: string): Promise<number> {
  try {
    return await prisma.follow.count({
      where: { followerId: userId },
    });
  } catch {
    return 0;
  }
}

/**
 * Get followers list for a user
 */
export async function getFollowers(userId: string, limit: number = 50): Promise<Array<{
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
}>> {
  try {
    const follows = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return follows.map((follow) => follow.follower);
  } catch {
    return [];
  }
}

/**
 * Get following list for a user
 */
export async function getFollowing(userId: string, limit: number = 50): Promise<Array<{
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
}>> {
  try {
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return follows.map((follow) => follow.following);
  } catch {
    return [];
  }
}

