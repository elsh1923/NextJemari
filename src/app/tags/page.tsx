import { getAllTags, getPopularTags } from "@/actions/tags";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function TagsPage() {
  const [allTags, popularTags] = await Promise.all([
    getAllTags(),
    getPopularTags(20),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Tags</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Browse articles by topic
          </p>
        </div>

        <div className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            Popular Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                {tag.name}
                <span className="ml-2 text-xs">({tag._count.articles})</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            All Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-[#1A1A1C] dark:text-slate-300 dark:hover:bg-[#2A2A2C]"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

