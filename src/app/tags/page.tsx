import { getAllTags, getPopularTags } from "@/actions/tags";
import Link from "next/link";
import { Tag, TagWithCount } from "@/types";

export const dynamic = 'force-dynamic';

export default async function TagsPage() {
  let allTags: Tag[] = [];
  let popularTags: TagWithCount[] = [];

  try {
    [allTags, popularTags] = await Promise.all([
      getAllTags(),
      getPopularTags(20),
    ]);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    // Fallback to empty arrays is already handled by initialization
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-indigo-950/20 bg-[length:200%_200%] animate-[gradient_3s_ease_infinite] pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 animate-[slide-in-down_0.6s_ease-out_forwards]">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Tags</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Browse articles by topic
          </p>
        </div>

        <div className="mb-12 animate-[fade-in_0.6s_ease-out_0.2s_forwards] opacity-0">
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            Popular Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag, index) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 transition-all duration-300 hover:bg-blue-200 hover:scale-110 hover:shadow-md hover:-translate-y-0.5 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                style={{ animation: `scale-in 0.3s ease-out ${index * 0.05}s forwards` }}
              >
                {tag.name}
                <span className="ml-2 text-xs">({tag._count.articles})</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="animate-[fade-in_0.6s_ease-out_0.4s_forwards] opacity-0">
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            All Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="inline-block rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-200 hover:scale-110 hover:shadow-md hover:-translate-y-0.5 dark:bg-[#1A1A1C] dark:text-slate-300 dark:hover:bg-[#2A2A2C]"
                style={{ animation: `scale-in 0.3s ease-out ${index * 0.03}s forwards` }}
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

