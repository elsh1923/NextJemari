import { ArticleListItem } from "@/types";
import { ArticleCard } from "./ArticleCard";

interface ArticleListProps {
  articles: ArticleListItem[];
  showDeleteButton?: boolean;
}

export function ArticleList({ articles, showDeleteButton = false }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
        <p className="text-slate-600 dark:text-slate-400">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} showDeleteButton={showDeleteButton} />
      ))}
    </div>
  );
}

