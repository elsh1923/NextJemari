"use client";

import { ArticleListItem } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";

interface ArticleFeedProps {
  articles: ArticleListItem[];
}

export function ArticleFeed({ articles }: ArticleFeedProps) {

  if (articles.length === 0) {
    return (
      <div className="animate-[fade-in_0.6s_ease-out_forwards] rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
        <p className="text-slate-600 dark:text-slate-400">
          No articles yet. Be the first to write one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-[slide-in-down_0.6s_ease-out_forwards] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Latest Articles
        </h2>
        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="hidden sm:inline">Sort by:</span>
          <select 
            title="Sort articles by"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:scale-105 focus:shadow-md hover:border-blue-300 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100 dark:hover:border-blue-500/50"
          >
            <option>Newest</option>
            <option>Popular</option>
            <option>Trending</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className="opacity-0"
            style={{ 
              animation: `slide-in-up 0.6s ease-out ${(index + 1) * 0.05}s forwards`
            }}
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-4">
        <button className="group/btn animate-[scale-in_0.5s_ease-out_forwards] rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 hover:scale-110 hover:shadow-xl dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-300 dark:hover:bg-[#1A1A1C] dark:hover:border-blue-500/50 dark:hover:text-blue-400">
          <span className="inline-block transition-transform duration-300 group-hover/btn:translate-y-[-2px]">Load More</span>
        </button>
      </div>
    </div>
  );
}

