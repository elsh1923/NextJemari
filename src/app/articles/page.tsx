import { getArticles } from "@/actions/articles";
import { ArticleList } from "@/components/articles/ArticleList";

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: {
    page?: string;
    sortBy?: string;
    tag?: string;
  };
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");
  const sortBy = (searchParams.sortBy as any) || "newest";
  const tagSlug = searchParams.tag;

  const { articles, total, totalPages } = await getArticles({
    published: true,
    tagSlug,
    sortBy,
    page,
    limit: 20,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
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
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  pageNum === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-[#111113] dark:text-slate-300 dark:hover:bg-[#1A1A1C]"
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
