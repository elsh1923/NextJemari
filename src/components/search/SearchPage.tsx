"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchArticles } from "@/actions/search";
import { ArticleListItem } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  async function performSearch(searchTerm?: string) {
    const searchQuery = searchTerm || query;
    if (!searchQuery.trim()) {
      setArticles([]);
      return;
    }

    setLoading(true);
    try {
      const result = await searchArticles({
        query: searchQuery.trim(),
        published: true,
        sortBy: "newest",
        limit: 20,
      });
      setArticles(result.articles);
      setTotal(result.total);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      performSearch(query.trim());
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">Search Articles</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100 dark:placeholder-slate-500"
          />
        </form>

        {query && (
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            {loading ? "Searching..." : `${total} results found`}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center text-slate-600 dark:text-slate-400">Loading...</div>
      ) : articles.length === 0 && query ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
          <p className="text-slate-600 dark:text-slate-400">No articles found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}

