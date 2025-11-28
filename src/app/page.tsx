import { getArticles } from "@/actions/articles";
import { getPopularTags } from "@/actions/tags";
import { getPopularAuthors } from "@/actions/users";
import { HeroSection } from "@/components/home/HeroSection";
import { ArticleFeed } from "@/components/home/ArticleFeed";
import { Sidebar } from "@/components/home/Sidebar";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch featured articles (most popular/recent)
  const { articles: featuredArticles } = await getArticles({
    published: true,
    sortBy: "trending",
    limit: 3,
  });

  // Fetch recent articles for feed with pagination
  const { articles: recentArticles, totalPages, total } = await getArticles({
    published: true,
    sortBy: "newest",
    page: 1,
    limit: 12,
  });

  // Fetch popular tags
  const popularTags = await getPopularTags(10);

  // Fetch popular authors
  const popularAuthors = await getPopularAuthors(5);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-indigo-950/20 bg-[length:200%_200%] animate-[gradient_3s_ease_infinite] pointer-events-none" />
      
      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Hero Section with Featured Articles */}
        <HeroSection articles={featuredArticles} />

        {/* Main Content Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 lg:mt-12 lg:grid-cols-[1fr_320px] lg:gap-8">
          {/* Article Feed */}
          <ArticleFeed articles={recentArticles} totalPages={totalPages} total={total} />

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <Sidebar popularTags={popularTags} popularAuthors={popularAuthors} />
          </aside>
        </div>
      </main>
    </div>
  );
}
