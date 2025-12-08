# Contributing to Nextjemari

Thank you for your interest in contributing to Nextjemari! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Architecture](#project-architecture)
- [Code Style Guidelines](#code-style-guidelines)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

Be respectful and inclusive. We welcome contributors of all experience levels.

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **PostgreSQL** database (we recommend [Neon](https://neon.tech))
- **Git**

### Local Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/NextJemari.git
   cd NextJemari
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database URL and secrets.

4. **Run database migrations**

   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Available Scripts

| Command                  | Description              |
| ------------------------ | ------------------------ |
| `npm run dev`            | Start development server |
| `npm run build`          | Build for production     |
| `npm run lint`           | Run ESLint               |
| `npm run prisma:studio`  | Open Prisma Studio       |
| `npm run prisma:migrate` | Run database migrations  |
| `npm run db:test`        | Test database connection |

## Project Architecture

### Directory Structure

```
src/
├── actions/      # Server Actions (business logic)
├── app/          # Next.js App Router (pages & API)
├── components/   # React components
├── lib/          # Utilities & configurations
└── types/        # TypeScript type definitions
```

### Key Technologies

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| **Next.js 16**     | React framework with App Router |
| **Prisma 5**       | Database ORM                    |
| **NextAuth.js**    | Authentication                  |
| **Tailwind CSS 4** | Styling                         |
| **Zod**            | Validation                      |
| **TypeScript 5**   | Type safety                     |

### Server Actions

All database operations use Server Actions in `src/actions/`:

| Module         | Operations                            |
| -------------- | ------------------------------------- |
| `articles.ts`  | Create, read, update, delete articles |
| `auth.ts`      | Register, login, password management  |
| `comments.ts`  | Comment CRUD with nested replies      |
| `follows.ts`   | User follow/unfollow system           |
| `likes.ts`     | Article like/unlike                   |
| `bookmarks.ts` | Bookmark management                   |
| `search.ts`    | Full-text search                      |
| `tags.ts`      | Tag management                        |
| `users.ts`     | Profile operations                    |

### Components Organization

Components are organized by feature in `src/components/`:

- **`ui/`** - Reusable primitives (Button, Input, Card)
- **`layout/`** - Header, Footer, Navigation
- **`articles/`** - Article cards, lists, editor
- **`auth/`** - Login/register forms
- **`users/`** - User profiles, cards

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define types in `src/types/index.ts`
- Avoid `any` type - use proper types or `unknown`

### React Components

```tsx
// ✅ Good: Typed functional component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
```

### Server Actions

```tsx
// ✅ Good: Use "use server" directive
"use server";

import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function createArticle(data: CreateArticleInput) {
  const user = await requireAuth();
  // ... implementation
}
```

### Naming Conventions

| Type       | Convention              | Example           |
| ---------- | ----------------------- | ----------------- |
| Components | PascalCase              | `ArticleCard.tsx` |
| Utilities  | camelCase               | `formatDate.ts`   |
| Types      | PascalCase              | `ArticleListItem` |
| Files      | kebab-case or camelCase | `auth-client.ts`  |

### Imports

```tsx
// Order: React → External → Internal → Types → Styles
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Article } from "@/types";
```

## Submitting Changes

### Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**

   - Write clean, documented code
   - Add/update tests if applicable
   - Update documentation

3. **Test your changes**

   ```bash
   npm run build
   npm run lint
   ```

4. **Commit with clear messages**

   ```bash
   git commit -m "feat: add article sharing functionality"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Commit Message Format

```
<type>: <description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing

How was this tested?

## Screenshots (if applicable)
```

## Reporting Issues

### Bug Reports

Include:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

### Feature Requests

Include:

- Clear description
- Use case / motivation
- Proposed solution (optional)

## Questions?

Feel free to open an issue for any questions or discussions!

---

**Thank you for contributing! 🙏**
