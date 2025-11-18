# Nextjemari - Backend Documentation

## Overview

Nextjemari is a professional, open-source Next.js knowledge hub where users can write, share, and version technical articles or tutorials. This document provides comprehensive information about the backend architecture, API endpoints, and functionality.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Content Processing**: MDX
- **Language**: TypeScript

## Database Schema

### Models

#### User
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `username`: String (Unique)
- `passwordHash`: String (Optional, for OAuth users)
- `bio`: String (Optional)
- `avatarUrl`: String (Optional)
- `role`: Enum (USER, MODERATOR, ADMIN)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Article
- `id`: UUID (Primary Key)
- `title`: String
- `slug`: String (Unique)
- `body`: String (MDX content)
- `description`: String (Optional)
- `coverImage`: String (Optional)
- `published`: Boolean (Default: false)
- `viewCount`: Integer (Default: 0)
- `readingTime`: Integer (Optional, in minutes)
- `authorId`: String (Foreign Key → User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Tag
- `id`: UUID (Primary Key)
- `name`: String (Unique, lowercase)
- `slug`: String (Unique)
- `createdAt`: DateTime

#### ArticleTag (Many-to-Many)
- `articleId`: String (Foreign Key → Article)
- `tagId`: String (Foreign Key → Tag)

#### Comment
- `id`: UUID (Primary Key)
- `body`: String
- `articleId`: String (Foreign Key → Article)
- `authorId`: String (Foreign Key → User)
- `parentId`: String (Optional, Foreign Key → Comment, for nested comments)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Like
- `id`: UUID (Primary Key)
- `userId`: String (Foreign Key → User)
- `articleId`: String (Foreign Key → Article)
- `createdAt`: DateTime
- Unique constraint on (userId, articleId)

#### Bookmark
- `id`: UUID (Primary Key)
- `userId`: String (Foreign Key → User)
- `articleId`: String (Foreign Key → Article)
- `createdAt`: DateTime
- Unique constraint on (userId, articleId)

## Database Indexes

The schema includes optimized indexes for:
- Article: slug, authorId, published+createdAt, published+updatedAt, full-text search (title, description, body)
- User: username, email
- Tag: slug, name
- Comment: articleId, authorId, parentId
- Like: articleId, userId
- Bookmark: userId, articleId

## API Endpoints

### Authentication

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "username",
    "email": "user@example.com"
  }
}
```

#### `POST /api/auth/[...nextauth]`
NextAuth.js authentication endpoint (handles login, OAuth, session management).

### Articles

#### `GET /api/articles`
Get list of articles with filters.

**Query Parameters:**
- `published`: boolean (filter by published status)
- `authorId`: string (filter by author)
- `tag`: string (filter by tag slug)
- `sortBy`: "newest" | "oldest" | "popular" | "trending"
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [...],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### `POST /api/articles`
Create a new article (requires authentication).

**Request Body:**
```json
{
  "title": "Article Title",
  "body": "# MDX Content",
  "description": "Optional description",
  "coverImage": "https://example.com/image.jpg",
  "tagNames": ["react", "nextjs"],
  "published": false
}
```

#### `GET /api/articles/[slug]`
Get article by slug.

**Query Parameters:**
- `incrementViews`: boolean (increment view count)

#### `PUT /api/articles/[slug]`
Update article (requires authentication, author or admin only).

#### `DELETE /api/articles/[slug]`
Delete article (requires authentication, author or admin only).

### Comments

#### `GET /api/comments?articleId=xxx`
Get comments for an article.

#### `POST /api/comments`
Create a new comment (requires authentication).

**Request Body:**
```json
{
  "articleId": "uuid",
  "body": "Comment text",
  "parentId": "uuid" // Optional, for replies
}
```

#### `GET /api/comments/[id]`
Get comment by ID.

#### `PUT /api/comments/[id]`
Update comment (requires authentication, author or moderator only).

#### `DELETE /api/comments/[id]`
Delete comment (requires authentication, author or moderator only).

### Likes

#### `POST /api/likes`
Toggle like on an article (requires authentication).

**Request Body:**
```json
{
  "articleId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likeCount": 42
  }
}
```

#### `GET /api/likes?articleId=xxx`
Check if user has liked and get like count.

### Bookmarks

#### `GET /api/bookmarks`
Get user's bookmarked articles (requires authentication).

#### `GET /api/bookmarks?articleId=xxx`
Check if article is bookmarked and get bookmark count.

#### `POST /api/bookmarks`
Toggle bookmark on an article (requires authentication).

**Request Body:**
```json
{
  "articleId": "uuid"
}
```

### Search

#### `GET /api/search`
Search articles using full-text search.

**Query Parameters:**
- `q`: string (search query)
- `tags`: string (comma-separated tag names)
- `authorId`: string
- `published`: boolean
- `sortBy`: "newest" | "oldest" | "popular" | "trending"
- `page`: number
- `limit`: number

### Tags

#### `GET /api/tags`
Get all tags.

**Query Parameters:**
- `popular`: boolean (get popular tags)
- `limit`: number (for popular tags)
- `slug`: string (get tag by slug)

### Users

#### `GET /api/users/[username]`
Get user profile.

**Query Parameters:**
- `articles`: boolean (include user's articles)

#### `GET /api/users/me`
Get current user profile (requires authentication).

#### `PUT /api/users/me`
Update current user profile (requires authentication).

**Request Body:**
```json
{
  "bio": "User bio",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

## Server Actions

All server actions are located in `src/actions/` and can be called directly from Server Components or Client Components.

### Articles (`src/actions/articles.ts`)
- `createArticle(input)`: Create a new article
- `updateArticle(input)`: Update an article
- `deleteArticle(slug)`: Delete an article
- `getArticleBySlug(slug, incrementViews)`: Get article by slug
- `getArticles(filters)`: Get articles with filters
- `getUserArticles(username, includeDrafts)`: Get user's articles

### Comments (`src/actions/comments.ts`)
- `createComment(input)`: Create a comment
- `updateComment(input)`: Update a comment
- `deleteComment(commentId)`: Delete a comment
- `getArticleComments(articleId)`: Get comments for an article
- `getCommentById(commentId)`: Get comment by ID

### Likes (`src/actions/likes.ts`)
- `toggleLike(articleId)`: Toggle like on an article
- `hasLiked(articleId)`: Check if user has liked
- `getLikeCount(articleId)`: Get like count
- `getLikedArticles(userId)`: Get articles liked by user

### Bookmarks (`src/actions/bookmarks.ts`)
- `toggleBookmark(articleId)`: Toggle bookmark
- `hasBookmarked(articleId)`: Check if bookmarked
- `getBookmarkedArticles()`: Get user's bookmarked articles
- `getBookmarkCount(articleId)`: Get bookmark count

### Search (`src/actions/search.ts`)
- `searchArticles(filters)`: Search articles
- `advancedSearch(query, filters)`: Advanced full-text search
- `getPopularTags(limit)`: Get popular tags
- `getSuggestedTags(articleId)`: Get suggested tags

### Tags (`src/actions/tags.ts`)
- `getAllTags()`: Get all tags
- `getTagBySlug(slug)`: Get tag by slug
- `getTagByName(name)`: Get tag by name
- `getPopularTags(limit)`: Get popular tags
- `createTag(name)`: Create a tag
- `getArticleTags(articleId)`: Get tags for an article

### Authentication (`src/actions/auth.ts`)
- `register(input)`: Register a new user
- `login(input)`: Validate login credentials
- `verifyPassword(userId, password)`: Verify password
- `changePassword(userId, currentPassword, newPassword)`: Change password
- `isEmailAvailable(email)`: Check if email is available
- `isUsernameAvailable(username)`: Check if username is available

### Users (`src/actions/users.ts`)
- `getUserProfile(username)`: Get user profile
- `getUserProfileById(userId)`: Get user profile by ID
- `updateProfile(input)`: Update user profile
- `getCurrentUserProfile()`: Get current user profile

## Utility Functions

### `src/lib/utils.ts`
- `generateSlug(text)`: Generate URL-friendly slug
- `generateUniqueSlug(baseSlug, checkExists)`: Generate unique slug
- `calculateReadingTime(content)`: Calculate reading time
- `truncate(text, length)`: Truncate text
- `formatRelativeTime(date)`: Format relative time
- `formatDate(date)`: Format date
- `isValidEmail(email)`: Validate email
- `isValidUsername(username)`: Validate username
- `extractTextFromMarkdown(markdown)`: Extract text from markdown
- `generateDescription(content)`: Generate description from content

### `src/lib/auth.ts`
- `getCurrentUser()`: Get current session user
- `requireAuth()`: Require authentication (throws if not authenticated)
- `requireRole(role)`: Require specific role
- `isAdmin()`: Check if user is admin
- `isModerator()`: Check if user is moderator
- `isOwner(userId, resourceUserId)`: Check if user owns resource
- `canEdit(userId, resourceUserId)`: Check if user can edit resource

### `src/lib/validation.ts`
Zod schemas for validation:
- `registerSchema`
- `loginSchema`
- `createArticleSchema`
- `updateArticleSchema`
- `createCommentSchema`
- `updateCommentSchema`
- `updateProfileSchema`
- `searchSchema`

### `src/lib/mdx.ts`
- `processMDX(content)`: Process MDX content
- `extractHeadings(content)`: Extract headings from MDX
- `extractCodeBlocks(content)`: Extract code blocks
- `extractImages(content)`: Extract images
- `validateMDX(content)`: Validate MDX structure

### `src/lib/errors.ts`
- `handleError(error)`: Handle errors and return HTTP response
- `withErrorHandling(handler)`: Wrap route handlers with error handling

## Features

### Core Features
1. **User Authentication**
   - Email/password registration and login
   - GitHub OAuth integration
   - JWT-based sessions
   - Role-based access control (USER, MODERATOR, ADMIN)

2. **Article Management**
   - Create, read, update, delete articles
   - MDX content support with syntax highlighting
   - Draft/published status
   - Automatic slug generation
   - Reading time calculation
   - View count tracking
   - Cover images
   - Article descriptions

3. **Tagging System**
   - Multiple tags per article
   - Tag slugs for SEO-friendly URLs
   - Popular tags tracking
   - Tag suggestions

4. **Comments System**
   - Nested comments (replies)
   - Edit and delete comments
   - Comment threading

5. **Engagement Features**
   - Like articles
   - Bookmark articles
   - View counts

6. **Search**
   - Full-text search using Postgres
   - Filter by tags, author, published status
   - Sort by newest, oldest, popular, trending

7. **User Profiles**
   - Public profiles with username
   - Bio and avatar
   - Article count, comment count, etc.

### Advanced Features
- Incremental Static Regeneration (ISR) ready
- Server-side rendering (SSR)
- Server Actions for mutations
- Optimistic UI updates ready
- Database indexes for performance
- Cascading deletes for data integrity
- Input validation with Zod
- Error handling with custom error types
- Type-safe API with TypeScript

## Environment Variables

See `.env.example` for required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: Secret for JWT signing
- `GITHUB_CLIENT_ID`: GitHub OAuth client ID (optional)
- `GITHUB_CLIENT_SECRET`: GitHub OAuth client secret (optional)

## Database Migrations

Run migrations:
```bash
npm run prisma:migrate
```

Generate Prisma Client:
```bash
npm run prisma:generate
```

Open Prisma Studio:
```bash
npm run prisma:studio
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection (MDX sanitization)
- CSRF protection (NextAuth.js)

## Performance Optimizations

- Database indexes on frequently queried fields
- Full-text search indexes
- Efficient query patterns with Prisma
- Pagination for large datasets
- Optimized includes for related data

## Next Steps

The backend is complete and ready for frontend development. All API endpoints are functional, server actions are implemented, and the database schema is optimized.

To start frontend development:
1. Set up environment variables
2. Run database migrations
3. Start the development server: `npm run dev`
4. Begin building UI components using the server actions and API endpoints

