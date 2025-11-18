import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";
import { ArticleListItem } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface HeroSectionProps {
  articles: ArticleListItem[];
}

export function HeroSection({ articles }: HeroSectionProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Featured Articles
        </h2>
        <Link
          href="/articles"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View all →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <Link
            key={article.id}
            href={`/u/${article.author.username}/${article.slug}`}
            className="group"
          >
            <article className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-lg dark:border-[#1A1A1C] dark:bg-[#111113] dark:hover:border-[#2A2A2C]">
              {article.coverImage && (
                <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-[#0A0A0C]">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {article.tags.slice(0, 2).map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-[#1A1A1C] dark:text-slate-300"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {article.title}
                </h3>
                <p className="mb-4 text-sm text-slate-600 line-clamp-2 dark:text-slate-400">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span className="font-medium">{article.author.username}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatRelativeTime(article.createdAt)}</span>
                    </div>
                  </div>
                  {article.readingTime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readingTime} min</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

