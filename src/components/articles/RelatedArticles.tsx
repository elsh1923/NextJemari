import { getArticles } from "@/actions/articles";
import { ArticleCard } from "./ArticleCard";

interface RelatedArticlesProps {
  currentArticleId: string;
  tags: string[];
}

export async function RelatedArticles({ currentArticleId, tags }: RelatedArticlesProps) {
  if (tags.length === 0) return null;

  try {
    const { articles } = await getArticles({
      published: true,
      tagSlug: tags[0],
      sortBy: "newest",
      limit: 3,
    });

    const related = articles.filter((a) => a.id !== currentArticleId).slice(0, 3);

    if (related.length === 0) return null;

    return (
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
          Related Articles
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    // Silently fail if related articles can't be loaded
    return null;
  }
}

