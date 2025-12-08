# Nextjemari - Knowledge Hub Platform

A professional, open-source Next.js knowledge hub where users can write, share, and version technical articles or tutorials.

## 🚀 Features

- **User Authentication**: Email/password and GitHub OAuth
- **Article Management**: Create, edit, and manage MDX articles
- **Dynamic Routing**: Clean URLs like `/u/username/article-slug`
- **Tagging System**: Organize articles with tags
- **Comments**: Nested comment threads
- **Engagement**: Like and bookmark articles
- **Search**: Full-text search with Postgres
- **User Profiles**: Public profiles with statistics
- **MDX Support**: Rich content with code highlighting

## 📋 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Content**: MDX
- **Language**: TypeScript

## 🏗️ Project Status

✅ **Backend Complete** - All backend functionality is implemented and ready for frontend development.

### What's Included

- ✅ Complete database schema with indexes
- ✅ Server Actions for all operations
- ✅ RESTful API endpoints
- ✅ Authentication and authorization
- ✅ Input validation
- ✅ Error handling
- ✅ TypeScript types
- ✅ Utility functions
- ✅ MDX processing
- ✅ Full-text search

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Installation and setup guide
- **[BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)** - Complete API documentation
- **[FEATURES.md](./FEATURES.md)** - Detailed feature list

## 🚦 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your database URL and secrets
   ```

3. **Run database migrations:**

   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## 📁 Project Structure

```
nextjemari/
├── prisma/                  # Database schema and migrations
│   └── schema.prisma        # Prisma schema definition
├── public/                  # Static assets (images, icons)
├── src/
│   ├── actions/             # Server Actions (11 modules)
│   │   ├── articles.ts      # Article CRUD operations
│   │   ├── auth.ts          # Authentication (register, login)
│   │   ├── bookmarks.ts     # Bookmark management
│   │   ├── comments.ts      # Comment operations
│   │   ├── follows.ts       # Follow/unfollow users
│   │   ├── likes.ts         # Like/unlike articles
│   │   ├── newsletter.ts    # Newsletter subscriptions
│   │   ├── reports.ts       # Content reporting
│   │   ├── search.ts        # Full-text search
│   │   ├── tags.ts          # Tag management
│   │   └── users.ts         # User profile operations
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes (REST endpoints)
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # User dashboard
│   │   ├── article/         # Article view/edit pages
│   │   ├── search/          # Search page
│   │   ├── tag/[slug]/      # Tag-filtered articles
│   │   ├── u/[username]/    # User profiles & articles
│   │   ├── write/           # Article editor
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── articles/        # Article cards, lists, editor
│   │   ├── auth/            # Login/register forms
│   │   ├── comments/        # Comment section
│   │   ├── dashboard/       # Dashboard views
│   │   ├── home/            # Homepage sections
│   │   ├── interactions/    # Like/bookmark buttons
│   │   ├── layout/          # Header, footer, navigation
│   │   ├── mdx/             # MDX rendering
│   │   ├── search/          # Search components
│   │   ├── tags/            # Tag components
│   │   ├── ui/              # Reusable UI primitives
│   │   └── users/           # User cards, profiles
│   ├── lib/                 # Utilities and helpers
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── cloudinary.ts    # Image upload
│   │   ├── mdx.ts           # MDX processing
│   │   ├── prisma.ts        # Database client
│   │   ├── utils.ts         # Helper functions
│   │   └── validation.ts    # Zod schemas
│   └── types/               # TypeScript type definitions
│       └── index.ts         # Shared types
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript config
└── tailwind.config.ts       # Tailwind CSS config
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Articles

- `GET /api/articles` - List articles
- `POST /api/articles` - Create article
- `GET /api/articles/[slug]` - Get article
- `PUT /api/articles/[slug]` - Update article
- `DELETE /api/articles/[slug]` - Delete article

### Comments

- `GET /api/comments?articleId=xxx` - Get comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/[id]` - Update comment
- `DELETE /api/comments/[id]` - Delete comment

### Likes & Bookmarks

- `POST /api/likes` - Toggle like
- `GET /api/likes?articleId=xxx` - Get like status
- `POST /api/bookmarks` - Toggle bookmark
- `GET /api/bookmarks` - Get bookmarks

### Search & Tags

- `GET /api/search` - Search articles
- `GET /api/tags` - Get tags

### Users

- `GET /api/users/[username]` - Get user profile
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile

See [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md) for complete API documentation.

## 🎯 Server Actions

All server actions are available in `src/actions/`:

- **Articles**: `createArticle`, `updateArticle`, `deleteArticle`, `getArticleBySlug`, `getArticles`
- **Comments**: `createComment`, `updateComment`, `deleteComment`, `getArticleComments`
- **Likes**: `toggleLike`, `hasLiked`, `getLikeCount`
- **Bookmarks**: `toggleBookmark`, `hasBookmarked`, `getBookmarkedArticles`
- **Search**: `searchArticles`, `getPopularTags`
- **Tags**: `getAllTags`, `getTagBySlug`, `getPopularTags`
- **Auth**: `register`, `login`, `changePassword`
- **Users**: `getUserProfile`, `updateProfile`, `getCurrentUserProfile`

## 🔒 Security

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection
- CSRF protection (NextAuth.js)

## 🚀 Next Steps

1. ✅ Backend is complete
2. 🎨 Start building the frontend
3. Use Server Actions in Server Components
4. Use API routes for client-side fetching
5. Implement UI components

## 📝 License

This project is open-source and available under the [MIT License](./LICENSE).

You are free to:

- ✅ Use the software for any purpose
- ✅ Modify the software
- ✅ Distribute the software
- ✅ Use it commercially

See the [LICENSE](./LICENSE) file for full details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js, Prisma, and PostgreSQL**
