"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NotFoundError, type ArticleListItem } from "@/types";

/**
 * Toggle bookmark on an article
 */
export async function toggleBookmark(articleId: string): Promise<{
  bookmarked: boolean;
}> {
  const user = await requireAuth();

  // Verify article exists
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new NotFoundError("Article");
  }

  // Check if bookmark already exists
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_articleId: {
        userId: user.id,
        articleId,
      },
    },
  });

  if (existingBookmark) {
    // Remove bookmark
    await prisma.bookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });
    return { bookmarked: false };
  } else {
    // Add bookmark
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        articleId,
      },
    });
    return { bookmarked: true };
  }
}

/**
 * Check if user has bookmarked an article
 */
export async function hasBookmarked(articleId: string): Promise<boolean> {
  try {
    const user = await requireAuth();
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
    });
    return !!bookmark;
  } catch {
    return false;
  }
}

/**
 * Get bookmarked articles for user
 */
export async function getBookmarkedArticles(): Promise<ArticleListItem[]> {
  try {
    const user = await requireAuth();

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        article: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookmarks.map((bookmark) => bookmark.article) as ArticleListItem[];
  } catch (error: any) {
    // Handle database connection errors gracefully
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      console.error("Database connection error:", error.message);
      return [];
    }
    // If user is not authenticated, return empty array instead of throwing
    if (error?.message?.includes("Unauthorized") || error?.message?.includes("authentication")) {
      return [];
    }
    throw error;
  }
}

/**
 * Get bookmark count for an article
 */
export async function getBookmarkCount(articleId: string): Promise<number> {
  return await prisma.bookmark.count({
    where: { articleId },
  });
}

