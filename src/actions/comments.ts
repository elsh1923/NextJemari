"use server";

import prisma from "@/lib/prisma";
import { requireAuth, canEdit } from "@/lib/auth";
import {
  validateOrThrow,
  createCommentSchema,
  updateCommentSchema,
} from "@/lib/validation";
import {
  NotFoundError,
  ForbiddenError,
  type CreateCommentInput,
  type UpdateCommentInput,
  type CommentWithAuthor,
} from "@/types";

/**
 * Create a new comment
 */
export async function createComment(
  input: CreateCommentInput
): Promise<CommentWithAuthor> {
  const user = await requireAuth();

  // Validate input
  const validated = validateOrThrow(createCommentSchema, input);

  // Verify article exists
  const article = await prisma.article.findUnique({
    where: { id: validated.articleId },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!article) {
    throw new NotFoundError("Article");
  }

  // If parent comment, verify it exists and belongs to the same article
  if (validated.parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: validated.parentId },
    });

    if (!parentComment) {
      throw new NotFoundError("Parent comment");
    }

    if (parentComment.articleId !== validated.articleId) {
      throw new ForbiddenError("Parent comment must belong to the same article");
    }
  }

  // Create comment
  const comment = await prisma.comment.create({
    data: {
      body: validated.body,
      articleId: validated.articleId,
      authorId: user.id,
      parentId: validated.parentId || null,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath(`/u/${article.author.username}/${article.slug}`);

  return comment as CommentWithAuthor;
}

/**
 * Update a comment
 */
export async function updateComment(
  input: UpdateCommentInput
): Promise<CommentWithAuthor> {
  const user = await requireAuth();

  // Validate input
  const validated = validateOrThrow(updateCommentSchema, input);

  // Find existing comment
  const existing = await prisma.comment.findUnique({
    where: { id: validated.id },
  });

  if (!existing) {
    throw new NotFoundError("Comment");
  }

  // Check permissions
  const canEditComment = await canEdit(user.id, existing.authorId);
  if (!canEditComment) {
    throw new ForbiddenError("You don't have permission to edit this comment");
  }

  // Update comment
  const comment = await prisma.comment.update({
    where: { id: validated.id },
    data: {
      body: validated.body,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });

  return comment as CommentWithAuthor;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<void> {
  const user = await requireAuth();

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new NotFoundError("Comment");
  }

  const canEditComment = await canEdit(user.id, comment.authorId);
  if (!canEditComment) {
    throw new ForbiddenError("You don't have permission to delete this comment");
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });
}

/**
 * Get comments for an article
 */
export async function getArticleComments(
  articleId: string
): Promise<CommentWithAuthor[]> {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        articleId,
        parentId: null, // Only top-level comments
      },
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
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return comments as CommentWithAuthor[];
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
 * Get comment by ID
 */
export async function getCommentById(
  commentId: string
): Promise<CommentWithAuthor | null> {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });

  return comment as CommentWithAuthor | null;
}

