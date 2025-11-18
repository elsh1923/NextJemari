import { z } from "zod";
import { isValidEmail, isValidUsername } from "./utils";

/**
 * Validation schemas using Zod
 */

export const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  body: z
    .string()
    .min(1, "Article body is required")
    .max(100000, "Article is too long"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  coverImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
  tagNames: z.array(z.string().min(1).max(30)).optional(),
  published: z.boolean().optional(),
});

export const updateArticleSchema = createArticleSchema.partial().extend({
  slug: z.string().min(1, "Slug is required"),
});

export const createCommentSchema = z.object({
  articleId: z.string().uuid("Invalid article ID"),
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment is too long"),
  parentId: z.string().uuid("Invalid parent comment ID").optional(),
});

export const updateCommentSchema = z.object({
  id: z.string().uuid("Invalid comment ID"),
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment is too long"),
});

export const updateProfileSchema = z.object({
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
  avatarUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export const searchSchema = z.object({
  query: z.string().max(200).optional(),
  tags: z.array(z.string()).optional(),
  authorId: z.string().uuid().optional(),
  published: z.boolean().optional(),
  sortBy: z.enum(["newest", "oldest", "popular", "trending"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Validate data against a schema
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Validate and throw if invalid
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

