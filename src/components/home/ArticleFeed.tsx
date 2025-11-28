"use client";

import { useState, useTransition } from "react";
import { ArticleListItem } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { getArticles } from "@/actions/articles";
import { Loader2 } from "lucide-react";

interface ArticleFeedProps {
  articles: ArticleListItem[];
  totalPages: number;
  total: number;
}

export function ArticleFeed({ articles: initialArticles, totalPages, total }: ArticleFeedProps) {
  const [articles, setArticles] = useState<ArticleListItem[]>(initialArticles);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "trending">("newest");
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(totalPages > 1);

  const handleLoadMore = async () => {
    startTransition(async () => {
      const nextPage = currentPage + 1;
      const result = await getArticles({
        published: true,
        sortBy,
        page: nextPage,
        limit: 6,
      });

      if (result.articles.length > 0) {
        setArticles((prev) => [...prev, ...result.articles]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < result.totalPages);
      } else {
        setHasMore(false);
      }
    });
  };

  const handleSortChange = (newSortBy: "newest" | "popular" | "trending") => {
    if (newSortBy === sortBy) return;

    startTransition(async () => {
      setSortBy(newSortBy);
      const result = await getArticles({
        published: true,
        sortBy: newSortBy,
        page: 1,
        limit: 12,
      });

      setArticles(result.articles);
      setCurrentPage(1);
      setHasMore(result.totalPages > 1);
    });
  };

  if (articles.length === 0 && !isPending) {
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
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as "newest" | "popular" | "trending")}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:scale-105 focus:shadow-md hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100 dark:hover:border-blue-500/50"
          >
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="trending">Trending</option>
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
      {hasMore && (
        <div className="flex flex-col items-center gap-2 pt-4">
          <button 
            onClick={handleLoadMore}
            disabled={isPending}
            className="group/btn animate-[scale-in_0.5s_ease-out_forwards] rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 ease-in-out hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-700 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-300 dark:hover:bg-[#1A1A1C] dark:hover:border-blue-500/50 dark:hover:text-blue-400"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : (
              <span className="inline-block transition-transform duration-300 ease-in-out group-hover/btn:translate-y-[-2px]">
                Load More
              </span>
            )}
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {articles.length} of {total} articles
          </p>
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <div className="flex justify-center pt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You've reached the end • {articles.length} articles
          </p>
        </div>
      )}
    </div>
  );
}
