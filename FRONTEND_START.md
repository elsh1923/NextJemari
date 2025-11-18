# Frontend Development - Quick Start Guide

## ✅ Backend Status
- ✅ All API endpoints ready
- ✅ All Server Actions ready
- ✅ Authentication configured
- ✅ Database connected
- ✅ Types defined

## 🚀 Getting Started

### 1. Start Development Server
```bash
npm run dev
```

### 2. Recommended Frontend Structure

```
src/app/
├── (auth)/
│   ├── signin/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx
│   └── write/
│       └── page.tsx
├── u/
│   └── [username]/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
├── search/
│   └── page.tsx
├── tag/
│   └── [slug]/
│       └── page.tsx
└── page.tsx (home)
```

## 📦 Key Components to Build

### 1. Authentication Components
- `SignInForm` - Use NextAuth signIn
- `SignUpForm` - Use `/api/auth/register`
- `AuthButton` - Login/Logout button

### 2. Article Components
- `ArticleCard` - Display article preview
- `ArticleList` - List of articles
- `ArticleEditor` - MDX editor for creating/editing
- `ArticleView` - Display full article with MDX rendering
- `ArticleMeta` - Author, date, tags, etc.

### 3. Comment Components
- `CommentForm` - Add comment
- `CommentList` - Display comments
- `CommentItem` - Single comment with replies

### 4. UI Components
- `SearchBar` - Search input
- `TagList` - Display tags
- `LikeButton` - Like/unlike
- `BookmarkButton` - Bookmark toggle
- `UserAvatar` - User profile picture

## 🔧 Using Server Actions

### Example: Fetch Articles
```tsx
// In a Server Component
import { getArticles } from "@/actions/articles";

export default async function HomePage() {
  const { articles } = await getArticles({
    published: true,
    sortBy: "newest",
    limit: 10,
  });

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

### Example: Create Article (Client Component)
```tsx
'use client';

import { createArticle } from "@/actions/articles";
import { useState } from "react";

export function ArticleForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const article = await createArticle({
        title: formData.get('title') as string,
        body: formData.get('body') as string,
        published: formData.get('published') === 'on',
        tagNames: formData.get('tags')?.toString().split(','),
      });
      // Redirect or show success
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## 🔐 Using NextAuth

### Get Session in Server Component
```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div>Please sign in</div>;
  }

  return <div>Welcome {session.user.name}</div>;
}
```

### Get Session in Client Component
```tsx
'use client';

import { useSession } from "next-auth/react";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;

  return <div>Signed in as {session.user.email}</div>;
}
```

### Wrap App with SessionProvider
```tsx
// src/app/layout.tsx
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

## 🎨 Styling

You have Tailwind CSS configured. Use utility classes:

```tsx
<div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-4">Articles</h1>
  {/* Content */}
</div>
```

## 📝 Next Steps

1. **Create Layout with Navigation**
   - Header with logo, search, auth buttons
   - Footer

2. **Build Home Page**
   - Article feed
   - Popular tags sidebar
   - Search bar

3. **Create Article Pages**
   - Article detail page (`/u/[username]/[slug]`)
   - Article editor (`/write`)

4. **Add Authentication Pages**
   - Sign in page
   - Sign up page

5. **Build User Dashboard**
   - User's articles
   - Bookmarks
   - Profile settings

## 🔗 Useful Resources

- **Server Actions**: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
- **NextAuth**: https://next-auth.js.org/
- **MDX**: https://mdxjs.com/
- **Tailwind CSS**: https://tailwindcss.com/

## 💡 Tips

1. Use Server Components by default (faster, SEO-friendly)
2. Use Client Components only when needed (interactivity, hooks)
3. Use Server Actions for mutations (forms, buttons)
4. Use API routes for client-side fetching if needed
5. Leverage TypeScript types from `src/types/`

---

**Ready to build!** 🚀 Start with the home page and navigation, then build out features incrementally.

