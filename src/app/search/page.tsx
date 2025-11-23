import { searchArticles } from "@/actions/search";
import { SearchBar } from "@/components/search/SearchBar";
import { ArticleList } from "@/components/articles/ArticleList";
import { SearchFilters } from "@/components/search/SearchFilters";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    tags?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  // Handle searchParams - can be Promise in Next.js 15+ or object in older versions
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const query = resolvedParams.q || "";
  const tags = resolvedParams.tags?.split(",").filter(Boolean);
  const sortBy = (resolvedParams.sortBy as any) || "newest";
  const page = parseInt(resolvedParams.page || "1");

  const results = await searchArticles({
    query,
    tags,
    sortBy,
    page,
    limit: 20,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
            Search Articles
          </h1>
          <SearchBar initialQuery={query} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <SearchFilters initialTags={tags} initialSortBy={sortBy} />
          </aside>

          <main>
            {results.articles.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Found {results.total} article{results.total !== 1 ? "s" : ""}
                  </p>
                </div>
                <ArticleList articles={results.articles} />
              </>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
                <p className="text-slate-600 dark:text-slate-400">
                  No articles found. Try different search terms.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
