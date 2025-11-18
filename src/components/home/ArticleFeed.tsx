import { ArticleListItem } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";

interface ArticleFeedProps {
  articles: ArticleListItem[];
}

export function ArticleFeed({ articles }: ArticleFeedProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
        <p className="text-slate-600 dark:text-slate-400">
          No articles yet. Be the first to write one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Latest Articles
        </h2>
        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="hidden sm:inline">Sort by:</span>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100">
            <option>Newest</option>
            <option>Popular</option>
            <option>Trending</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-4">
        <button className="rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-300 dark:hover:bg-[#1A1A1C]">
          Load More
        </button>
      </div>
    </div>
  );
}

