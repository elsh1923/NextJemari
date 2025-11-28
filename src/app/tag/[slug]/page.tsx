import { notFound } from "next/navigation";
import { getTagBySlug } from "@/actions/tags";
import { getArticles } from "@/actions/articles";
import { ArticleList } from "@/components/articles/ArticleList";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const page = parseInt(pageParam || "1");
  const { articles } = await getArticles({
    published: true,
    tagSlug: slug,
    sortBy: "newest",
    page,
    limit: 20,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {tag.name}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            Articles tagged "{tag.name}"
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {tag._count.articles} article{tag._count.articles !== 1 ? "s" : ""}
          </p>
        </div>

        <ArticleList articles={articles} />
      </div>
    </div>
  );
}
