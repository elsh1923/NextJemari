import { getArticles } from "@/actions/articles";
import { getPopularTags } from "@/actions/tags";
import { Navigation } from "@/components/layout/Navigation";
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

  // Fetch recent articles for feed
  const { articles: recentArticles } = await getArticles({
    published: true,
    sortBy: "newest",
    limit: 12,
  });

  // Fetch popular tags
  const popularTags = await getPopularTags(10);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C]">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Hero Section with Featured Articles */}
        <HeroSection articles={featuredArticles} />

        {/* Main Content Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 lg:mt-12 lg:grid-cols-[1fr_320px] lg:gap-8">
          {/* Article Feed */}
          <ArticleFeed articles={recentArticles} />

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <Sidebar popularTags={popularTags} />
          </aside>
        </div>
      </main>
    </div>
  );
}
