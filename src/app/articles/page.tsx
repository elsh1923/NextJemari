import { getArticles } from "@/actions/articles";
import { ArticleList } from "@/components/articles/ArticleList";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
    tag?: string;
  }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  // Handle searchParams - can be Promise in Next.js 15+ or object in older versions
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const page = parseInt(resolvedParams.page || "1");
  const sortBy = (resolvedParams.sortBy as any) || "newest";
  const tagSlug = resolvedParams.tag;

  const { articles, total, totalPages } = await getArticles({
    published: true,
    tagSlug,
    sortBy,
    page,
    limit: 20,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-indigo-950/20 bg-[length:200%_200%] animate-[gradient_3s_ease_infinite] pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 animate-[slide-in-down_0.6s_ease-out_forwards]">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Articles</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Discover articles from our community
          </p>
        </div>

        <ArticleList articles={articles} />

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <a
                key={pageNum}
                href={`/articles?page=${pageNum}${tagSlug ? `&tag=${tagSlug}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}`}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  pageNum === page
                    ? "bg-blue-600 text-white scale-110 shadow-lg"
                    : "bg-white text-slate-700 hover:bg-slate-50 hover:scale-105 hover:shadow-md dark:bg-[#111113] dark:text-slate-300 dark:hover:bg-[#1A1A1C]"
                }`}
              >
                {pageNum}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
