"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { validateOrThrow, updateProfileSchema } from "@/lib/validation";
import { NotFoundError, type UserProfile, type UpdateProfileInput } from "@/types";

/**
 * Get user profile by username
 */
export async function getUserProfile(username: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      bio: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          articles: true,
          comments: true,
          likes: true,
          bookmarks: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) return null;

  // Manually fetch counts to ensure accuracy
  const [followerCount, followingCount, articleStats] = await Promise.all([
    prisma.follow.count({ where: { followingId: user.id } }),
    prisma.follow.count({ where: { followerId: user.id } }),
    prisma.article.findMany({
      where: { authorId: user.id },
      select: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    }),
  ]);

  const totalCommentsReceived = articleStats.reduce((acc, curr) => acc + curr._count.comments, 0);
  const totalLikesReceived = articleStats.reduce((acc, curr) => acc + curr._count.likes, 0);

  return {
    ...user,
    _count: {
      ...user._count,
      followers: followerCount,
      following: followingCount,
      comments: totalCommentsReceived,
      likes: totalLikesReceived,
    },
  } as UserProfile;
}

/**
 * Get user profile by ID
 */
export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      bio: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          articles: true,
          comments: true,
          likes: true,
          bookmarks: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) return null;

  // Manually fetch counts to ensure accuracy
  const [followerCount, followingCount, articleStats] = await Promise.all([
    prisma.follow.count({ where: { followingId: user.id } }),
    prisma.follow.count({ where: { followerId: user.id } }),
    prisma.article.findMany({
      where: { authorId: user.id },
      select: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    }),
  ]);

  const totalCommentsReceived = articleStats.reduce((acc, curr) => acc + curr._count.comments, 0);
  const totalLikesReceived = articleStats.reduce((acc, curr) => acc + curr._count.likes, 0);

  return {
    ...user,
    _count: {
      ...user._count,
      followers: followerCount,
      following: followingCount,
      comments: totalCommentsReceived,
      likes: totalLikesReceived,
    },
  } as UserProfile;
}

/**
 * Update user profile
 */
export async function updateProfile(
  input: UpdateProfileInput
): Promise<UserProfile> {
  const user = await requireAuth();

  // Validate input
  const validated = validateOrThrow(updateProfileSchema, input);

  // Update profile
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      bio: validated.bio,
      image: validated.image || null,
    },
    select: {
      id: true,
      username: true,
      bio: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          articles: true,
          comments: true,
          likes: true,
          bookmarks: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  // Manually fetch counts to ensure accuracy
  const [followerCount, followingCount] = await Promise.all([
    prisma.follow.count({ where: { followingId: updated.id } }),
    prisma.follow.count({ where: { followerId: updated.id } }),
  ]);

  return {
    ...updated,
    _count: {
      ...updated._count,
      followers: followerCount,
      following: followingCount,
    },
  } as UserProfile;
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await requireAuth();
    return getUserProfileById(user.id);
  } catch {
    return null;
  }
}

/**
 * Get popular authors by article count
 */
export async function getPopularAuthors(limit: number = 5) {
  try {
    const authors = await prisma.user.findMany({
      where: {
        articles: {
          some: {
            published: true,
          },
        },
      },
      select: {
        id: true,
        username: true,
        image: true,
        bio: true,
        _count: {
          select: {
            articles: {
              where: {
                published: true,
              },
            },
            followers: true,
          },
        },
      },
      orderBy: {
        articles: {
          _count: "desc",
        },
      },
      take: limit,
    });

    return authors;
  } catch (error: any) {
    // Handle database connection errors gracefully
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      console.error("Database connection error:", error.message);
      return [];
    }
    throw error;
  }
}

