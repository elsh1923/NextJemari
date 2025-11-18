# Components Directory

Create your React components here. Suggested structure:

```
components/
├── ui/              # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── ...
├── auth/            # Authentication components
│   ├── SignInForm.tsx
│   ├── SignUpForm.tsx
│   └── AuthButton.tsx
├── articles/        # Article-related components
│   ├── ArticleCard.tsx
│   ├── ArticleList.tsx
│   ├── ArticleEditor.tsx
│   └── ArticleView.tsx
├── comments/        # Comment components
│   ├── CommentForm.tsx
│   ├── CommentList.tsx
│   └── CommentItem.tsx
└── layout/          # Layout components
    ├── Header.tsx
    ├── Footer.tsx
    └── Navigation.tsx
```

## Example Component

```tsx
// components/articles/ArticleCard.tsx
import Link from "next/link";
import { ArticleListItem } from "@/types";

interface ArticleCardProps {
  article: ArticleListItem;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="border rounded-lg p-6 hover:shadow-lg transition">
      <Link href={`/u/${article.author.username}/${article.slug}`}>
        <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
      </Link>
      <p className="text-gray-600 mb-4">{article.description}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>By {article.author.username}</span>
        <span>{article.readingTime} min read</span>
        <span>{article._count.likes} likes</span>
      </div>
    </article>
  );
}
```

