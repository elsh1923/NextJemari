import { TagWithCount, ArticleListItem } from "@/types";
import { ArticleCard } from "@/components/articles/ArticleCard";

interface TagPageProps {
  tag: TagWithCount;
  articles: ArticleListItem[];
}

export function TagPage({ tag, articles }: TagPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
          #{tag.name}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {tag._count.articles} {tag._count.articles === 1 ? "article" : "articles"}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
          <p className="text-slate-600 dark:text-slate-400">No articles with this tag yet.</p>
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

