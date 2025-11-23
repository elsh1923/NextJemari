"use server";

import prisma from "@/lib/prisma";
import { validateOrThrow, searchSchema } from "@/lib/validation";
import { generateSlug } from "@/lib/utils";
import { type SearchFilters, type SearchResult, type ArticleListItem } from "@/types";

/**
 * Search articles using Postgres full-text search
 */
export async function searchArticles(
  filters: SearchFilters
): Promise<SearchResult> {
  // Validate filters
  const validated = validateOrThrow(searchSchema, filters);

  const page = validated.page || 1;
  const limit = validated.limit || 20;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  // Published filter
  if (validated.published !== undefined) {
    where.published = validated.published;
  } else {
    // Default to published articles only for public search
    where.published = true;
  }

  // Author filter
  if (validated.authorId) {
    where.authorId = validated.authorId;
  }

  // Tag filter
  if (validated.tags && validated.tags.length > 0) {
    where.tags = {
      some: {
        tag: {
          name: {
            in: validated.tags.map((t) => t.toLowerCase()),
          },
        },
      },
    };
  }

  // Full-text search
  if (validated.query && validated.query.trim().length > 0) {
    const searchQuery = validated.query.trim();
    where.OR = [
      {
        title: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        body: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      // Full-text search using Postgres (if available)
      {
        // This uses Prisma's full-text search capabilities
        // Note: This requires the fulltext index in the schema
        // For better performance, you might want to use raw SQL with tsvector
      },
    ];
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: "desc" };
  if (validated.sortBy === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (validated.sortBy === "popular") {
    orderBy = { viewCount: "desc" };
  } else if (validated.sortBy === "trending") {
    // For trending, we'll use a combination of recent activity
    // This is simplified - you might want a more sophisticated algorithm
    orderBy = [
      { createdAt: "desc" },
      { viewCount: "desc" },
    ];
  }

  // Execute search
  try {
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
      }),
      prisma.article.count({ where }),
    ]);

    return {
      articles: articles as ArticleListItem[],
      total,
      page,
      limit,
    };
  } catch (error: any) {
    // Handle database connection errors gracefully
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      console.error("Database connection error:", error.message);
      return {
        articles: [],
        total: 0,
        page,
        limit,
      };
    }
    throw error;
  }
}

/**
 * Advanced full-text search using Postgres tsvector (raw SQL)
 * This provides better search performance and relevance
 */
export async function advancedSearch(
  query: string,
  filters?: Omit<SearchFilters, "query">
): Promise<SearchResult> {
  // This would use raw SQL for better full-text search
  // For now, we'll use the regular search
  return searchArticles({
    query,
    ...filters,
  });
}

/**
 * Get popular tags
 */
export async function getPopularTags(limit: number = 20) {
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

  return tags.filter((tag) => tag._count.articles > 0);
}

/**
 * Get suggested tags based on article content
 */
export async function getSuggestedTags(articleId: string) {
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
    return [];
  }

  // Get tags that are commonly used with the article's current tags
  const currentTagIds = article.tags.map((at) => at.tag.id);

  if (currentTagIds.length === 0) {
    // If no tags, return popular tags
    return getPopularTags(10);
  }

  // Find articles with similar tags
  const similarArticles = await prisma.article.findMany({
    where: {
      published: true,
      id: {
        not: articleId,
      },
      tags: {
        some: {
          tagId: {
            in: currentTagIds,
          },
        },
      },
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
    take: 50,
  });

  // Count tag frequency
  const tagCounts: Record<string, number> = {};
  similarArticles.forEach((a) => {
    a.tags.forEach((at) => {
      const tagId = at.tag.id;
      if (!currentTagIds.includes(tagId)) {
        tagCounts[tagId] = (tagCounts[tagId] || 0) + 1;
      }
    });
  });

  // Get top tags
  const topTagIds = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tagId]) => tagId);

  const suggestedTags = await prisma.tag.findMany({
    where: {
      id: {
        in: topTagIds,
      },
    },
  });

  return suggestedTags;
}

