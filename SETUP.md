# Nextjemari - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Git
- Cloudinary account (for image uploads)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextjemari?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# GitHub OAuth (Optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Get Cloudinary Credentials:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret

### 3. Set Up Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL
2. Create a database:
```sql
CREATE DATABASE nextjemari;
```
3. Update `DATABASE_URL` in `.env`

#### Option B: Neon Database (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in `.env`

### 4. Run Database Migrations

```bash
npm run prisma:migrate
```

This will:
- Create all database tables
- Set up indexes
- Create relationships

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. (Optional) Open Prisma Studio

To view and manage your database:

```bash
npm run prisma:studio
```

### 7. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
nextjemari/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── actions/               # Server Actions
│   │   ├── articles.ts
│   │   ├── comments.ts
│   │   ├── likes.ts
│   │   ├── bookmarks.ts
│   │   ├── search.ts
│   │   ├── tags.ts
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   └── follows.ts
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   └── [pages]/          # Pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts        # Prisma client
│   │   ├── auth.ts          # Auth helpers
│   │   ├── cloudinary.ts    # Cloudinary config
│   │   └── utils.ts         # General utilities
│   └── types/               # TypeScript types
└── public/                  # Static files
```

## Features

### Image Upload with Cloudinary

- **Article Cover Images**: Upload cover images when creating/editing articles
- **User Avatars**: Upload profile pictures
- **Automatic Optimization**: Images are automatically optimized for web
- **Format Conversion**: Automatic format conversion (WebP, etc.)
- **Responsive Images**: Different sizes for different use cases

### Usage

1. **Upload Article Cover Image**:
   - Go to `/write` or edit an article
   - Click "Choose Image" in the Cover Image section
   - Select an image file
   - Image will be uploaded to Cloudinary automatically

2. **Upload Avatar** (when implemented):
   - Go to profile settings
   - Click on avatar
   - Select an image file
   - Image will be uploaded to Cloudinary automatically

## Common Issues

### Database Connection Error

- Check `DATABASE_URL` in `.env`
- Ensure database is running
- Verify credentials

### Prisma Client Not Generated

```bash
npm run prisma:generate
```

### Migration Errors

```bash
npm run prisma:migrate reset  # WARNING: This deletes all data
```

### NextAuth Secret Missing

Generate a new secret:
```bash
openssl rand -base64 32
```

### Cloudinary Upload Not Working

- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set in `.env`
- Check Cloudinary dashboard for upload limits
- Verify your Cloudinary account is active

## Development Tips

1. Use Prisma Studio to inspect database: `npm run prisma:studio`
2. Check API routes at `/api/*`
3. Server Actions can be imported directly in Server Components
4. Use `requireAuth()` in Server Actions for protected operations
5. All validation is handled with Zod schemas
6. Images are automatically optimized by Cloudinary

## Production Deployment

1. Set up production database
2. Update `DATABASE_URL` with production connection string
3. Set `NEXTAUTH_URL` to production domain
4. Generate new `NEXTAUTH_SECRET` for production
5. Set Cloudinary credentials in production environment
6. Run migrations: `npm run prisma:migrate deploy`
7. Build: `npm run build`
8. Start: `npm start`

## Support

For issues or questions, refer to:
- `BACKEND_DOCUMENTATION.md` - Complete API documentation
- `FEATURES.md` - Feature list
- Prisma docs: https://www.prisma.io/docs
- Next.js docs: https://nextjs.org/docs
- Cloudinary docs: https://cloudinary.com/documentation
