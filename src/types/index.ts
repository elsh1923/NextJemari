import { UserRole } from "@prisma/client";

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string | null;
  image?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends Omit<User, "email"> {
  _count?: {
    articles: number;
    comments: number;
    likes: number;
    bookmarks: number;
    followers: number;
    following: number;
  };
}

// Article Types
export interface Article {
  id: string;
  title: string;
  slug: string;
  body: string;
  description?: string | null;
  coverImage?: string | null;
  published: boolean;
  viewCount: number;
  readingTime?: number | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleWithRelations extends Article {
  author: {
    id: string;
    username: string;
    image?: string | null;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  comments: CommentWithAuthor[];
  likes: Like[];
  bookmarks: Bookmark[];
  _count?: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
}

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  published: boolean;
  viewCount: number;
  readingTime?: number | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    image?: string | null;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  _count: {
    comments: number;
    likes: number;
  };
}

// Comment Types
export interface Comment {
  id: string;
  body: string;
  articleId: string;
  authorId: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    username: string;
    image?: string | null;
  };
  replies?: CommentWithAuthor[];
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface TagWithCount extends Tag {
  _count: {
    articles: number;
  };
}

// Like & Bookmark Types
export interface Like {
  id: string;
  userId: string;
  articleId: string;
  createdAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: Date;
}

// Form Types
export interface CreateArticleInput {
  title: string;
  body: string;
  description?: string;
  coverImage?: string;
  tagNames?: string[];
  published?: boolean;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {
  slug: string;
}

export interface CreateCommentInput {
  articleId: string;
  body: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  id: string;
  body: string;
}

export interface UpdateProfileInput {
  bio?: string;
  image?: string;
}

// Search Types
export interface SearchResult {
  articles: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  authorId?: string;
  published?: boolean;
  sortBy?: "newest" | "oldest" | "popular" | "trending";
  page?: number;
  limit?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Session Types
export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  role?: UserRole | string;
}

// Error Types
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

