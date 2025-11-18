"use server";

import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { NotFoundError, type Tag, type TagWithCount } from "@/types";

/**
 * Get all tags
 */
export async function getAllTags(): Promise<Tag[]> {
  try {
    return await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error: any) {
    // Handle database connection errors gracefully
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      console.error("Database connection error:", error.message);
      return [];
    }
    throw error;
  }
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string): Promise<TagWithCount | null> {
  try {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    return tag as TagWithCount | null;
  } catch (error: any) {
    // Handle database connection errors gracefully
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      console.error("Database connection error:", error.message);
      return null;
    }
    throw error;
  }
}

/**
 * Get tag by name
 */
export async function getTagByName(name: string): Promise<Tag | null> {
  return await prisma.tag.findUnique({
    where: { name: name.toLowerCase() },
  });
}

/**
 * Get popular tags with article counts
 */
export async function getPopularTags(limit: number = 20): Promise<TagWithCount[]> {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: true,
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

    return tags.filter((tag) => tag._count.articles > 0) as TagWithCount[];
  } catch (error: any) {
    // Handle database connection errors gracefully
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      console.error("Database connection error:", error.message);
      return [];
    }
    throw error;
  }
}

/**
 * Create a tag (admin only - typically tags are auto-created with articles)
 */
export async function createTag(name: string): Promise<Tag> {
  const existing = await prisma.tag.findUnique({
    where: { name: name.toLowerCase() },
  });

  if (existing) {
    return existing;
  }

  return await prisma.tag.create({
    data: {
      name: name.toLowerCase(),
      slug: generateSlug(name),
    },
  });
}

/**
 * Get tags for an article
 */
export async function getArticleTags(articleId: string): Promise<Tag[]> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!article) {
    throw new NotFoundError("Article");
  }

  return article.tags.map((at) => at.tag);
}

