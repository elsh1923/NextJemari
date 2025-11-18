"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NotFoundError } from "@/types";

/**
 * Toggle like on an article
 */
export async function toggleLike(articleId: string): Promise<{
  liked: boolean;
  likeCount: number;
}> {
  const user = await requireAuth();

  // Verify article exists
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new NotFoundError("Article");
  }

  // Check if like already exists
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_articleId: {
        userId: user.id,
        articleId,
      },
    },
  });

  if (existingLike) {
    // Unlike
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    // Like
    await prisma.like.create({
      data: {
        userId: user.id,
        articleId,
      },
    });
  }

  // Get updated like count
  const likeCount = await prisma.like.count({
    where: { articleId },
  });

  return {
    liked: !existingLike,
    likeCount,
  };
}

/**
 * Check if user has liked an article
 */
export async function hasLiked(articleId: string): Promise<boolean> {
  try {
    const user = await requireAuth();
    const like = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
    });
    return !!like;
  } catch {
    return false;
  }
}

/**
 * Get like count for an article
 */
export async function getLikeCount(articleId: string): Promise<number> {
  return await prisma.like.count({
    where: { articleId },
  });
}

/**
 * Get articles liked by user
 */
export async function getLikedArticles(userId: string): Promise<string[]> {
  const likes = await prisma.like.findMany({
    where: { userId },
    select: { articleId: true },
  });

  return likes.map((like) => like.articleId);
}

