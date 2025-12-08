"use server";

import prisma from "@/lib/prisma";
import { requireAuth, canEdit } from "@/lib/auth";
import {
  validateOrThrow,
  createArticleSchema,
  updateArticleSchema,
} from "@/lib/validation";
import {
  generateSlug,
  generateUniqueSlug,
  calculateReadingTime,
  generateDescription,
} from "@/lib/utils";
import { validateMDX } from "@/lib/mdx";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
  type CreateArticleInput,
  type UpdateArticleInput,
  type ArticleWithRelations,
  type ArticleListItem,
} from "@/types";

/**
 * Create a new article
 */
export async function createArticle(
  input: CreateArticleInput
): Promise<ArticleWithRelations> {
  const user = await requireAuth();

  // Validate input
  const validated = validateOrThrow(createArticleSchema, input);

  // Validate MDX content
  const mdxValidation = validateMDX(validated.body);
  if (!mdxValidation.valid) {
    throw new ValidationError(
      `MDX validation failed: ${mdxValidation.errors.join(", ")}`
    );
  }

  // Generate slug
  const baseSlug = generateSlug(validated.title);
  const slug = await generateUniqueSlug(
    baseSlug,
    async (s) => {
      const exists = await prisma.article.findUnique({ where: { slug: s } });
      return !!exists;
    }
  );

  // Calculate reading time
  const readingTime = calculateReadingTime(validated.body);

  // Generate description if not provided
  const description =
    validated.description || generateDescription(validated.body);

  // Create article with tags
  const article = await prisma.article.create({
    data: {
      title: validated.title,
      slug,
      body: validated.body,
      description,
      coverImage: validated.coverImage || null,
      published: validated.published || false,
      readingTime,
      authorId: user.id,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      likes: true,
      bookmarks: true,
    },
  });

  return article as ArticleWithRelations;
}

/**
 * Update an existing article
 */
export async function updateArticle(
  input: UpdateArticleInput
): Promise<ArticleWithRelations> {
  const user = await requireAuth();

  // Validate input
  const validated = validateOrThrow(updateArticleSchema, input);

  // Find existing article
  const existing = await prisma.article.findUnique({
    where: { slug: validated.slug },
  });

  if (!existing) {
    throw new NotFoundError("Article");
  }

  // Check permissions
  const canEditArticle = await canEdit(user.id, existing.authorId);
  if (!canEditArticle) {
    throw new ForbiddenError("You don't have permission to edit this article");
  }

  // Validate MDX if body is being updated
  if (validated.body) {
    const mdxValidation = validateMDX(validated.body);
    if (!mdxValidation.valid) {
      throw new ValidationError(
        `MDX validation failed: ${mdxValidation.errors.join(", ")}`
      );
    }
  }

  // Prepare update data
  const updateData: any = {};
  if (validated.title) updateData.title = validated.title;
  if (validated.body) {
    updateData.body = validated.body;
    updateData.readingTime = calculateReadingTime(validated.body);
  }
  if (validated.description !== undefined)
    updateData.description = validated.description;
  if (validated.coverImage !== undefined)
    updateData.coverImage = validated.coverImage || null;
  if (validated.published !== undefined)
    updateData.published = validated.published;

  // Update tags if provided
  if (validated.tagNames) {
    updateData.tags = {
      set: [],
      create: validated.tagNames.map((tagName) => ({
        tag: {
          connectOrCreate: {
            where: { name: tagName.toLowerCase() },
            create: {
              name: tagName.toLowerCase(),
              slug: generateSlug(tagName),
            },
          },
        },
      })),
    };
  }

  // Update article
  const article = await prisma.article.update({
    where: { slug: validated.slug },
    data: updateData,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      likes: true,
      bookmarks: true,
    },
  });

  return article as ArticleWithRelations;
}

/**
 * Delete an article
 */
export async function deleteArticle(slug: string): Promise<void> {
  const user = await requireAuth();

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article) {
    throw new NotFoundError("Article");
  }

  const canEditArticle = await canEdit(user.id, article.authorId);
  if (!canEditArticle) {
    throw new ForbiddenError("You don't have permission to delete this article");
  }

  // Delete all related records in a transaction to avoid foreign key constraint violations
  await prisma.$transaction([
    // Delete article tags
    prisma.articleTag.deleteMany({
      where: { articleId: article.id },
    }),
    // Delete comments
    prisma.comment.deleteMany({
      where: { articleId: article.id },
    }),
    // Delete likes
    prisma.like.deleteMany({
      where: { articleId: article.id },
    }),
    // Delete bookmarks
    prisma.bookmark.deleteMany({
      where: { articleId: article.id },
    }),
    // Finally delete the article
    prisma.article.delete({
      where: { slug },
    }),
  ]);
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(
  slug: string,
  incrementViews: boolean = false
): Promise<ArticleWithRelations | null> {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          where: {
            parentId: null, // Only top-level comments
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: true,
        bookmarks: true,
        _count: {
          select: {
            comments: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!article) {
      return null;
    }

    // Increment view count if requested
    if (incrementViews && article.published) {
      try {
        await prisma.article.update({
          where: { slug },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        });
      } catch (error) {
        // Silently fail view count increment if database is unavailable
        console.warn("Failed to increment view count:", error);
      }
    }

    return article as ArticleWithRelations;
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
 * Get articles list with filters
 */
export async function getArticles(filters: {
  published?: boolean;
  authorId?: string;
  tagSlug?: string;
  sortBy?: "newest" | "oldest" | "popular" | "trending";
  page?: number;
  limit?: number;
}): Promise<{
  articles: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  if (filters.published !== undefined) {
    where.published = filters.published;
  }
  if (filters.authorId) {
    where.authorId = filters.authorId;
  }
  if (filters.tagSlug) {
    where.tags = {
      some: {
        tag: {
          slug: filters.tagSlug,
        },
      },
    };
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: "desc" };
  if (filters.sortBy === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (filters.sortBy === "popular") {
    orderBy = { viewCount: "desc" };
  } else if (filters.sortBy === "trending") {
    // Trending = recent articles with high engagement
    // Sort by view count and recency as Prisma doesn't support ordering by relation counts
    orderBy = [
      { viewCount: "desc" },
      { createdAt: "desc" },
    ];
  }

  // Get articles and total count
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
              image: true,
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
      totalPages: Math.ceil(total / limit),
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
        totalPages: 0,
      };
    }
    throw error;
  }
}

/**
 * Get user's articles by user ID
 */
export async function getUserArticlesById(
  userId: string,
  includeDrafts: boolean = false
): Promise<ArticleListItem[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        authorId: userId,
        published: includeDrafts ? undefined : true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true,
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
    });

    return articles as ArticleListItem[];
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
 * Get user's articles by username
 */
export async function getUserArticles(
  username: string,
  includeDrafts: boolean = false
): Promise<ArticleListItem[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return [];
    }

    return getUserArticlesById(user.id, includeDrafts);
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
 * Publish a draft article
 */
export async function publishArticle(slug: string): Promise<ArticleWithRelations> {
  const user = await requireAuth();

  // Find the article
  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article) {
    throw new NotFoundError("Article");
  }

  // Check permissions
  const canEditArticle = await canEdit(user.id, article.authorId);
  if (!canEditArticle) {
    throw new ForbiddenError("You don't have permission to publish this article");
  }

  // Check if already published
  if (article.published) {
    throw new ValidationError("Article is already published");
  }

  // Update article to published
  const updatedArticle = await prisma.article.update({
    where: { slug },
    data: { published: true },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      likes: true,
      bookmarks: true,
    },
  });

  return updatedArticle as ArticleWithRelations;
}
