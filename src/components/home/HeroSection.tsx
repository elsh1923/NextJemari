"use client";

import Link from "next/link";
import { Calendar, Clock, User, Sparkles } from "lucide-react";
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
      <div className="mb-6 flex items-center justify-between animate-[slide-in-down_0.6s_ease-out_forwards]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500 animate-[float_3s_ease-in-out_infinite]" />
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Featured Articles
          </h2>
        </div>
        <Link
          href="/articles"
          className="group/arrow flex items-center gap-1 text-sm font-medium text-blue-600 transition-all duration-300 hover:text-blue-700 hover:translate-x-1 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span>View all</span>
          <span className="transition-transform duration-300 group-hover/arrow:translate-x-1">→</span>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article, index) => (
          <Link
            key={article.id}
            href={`/u/${article.author.username}/${article.slug}`}
            className="group opacity-0"
            style={{ 
              animation: `slide-in-up 0.6s ease-out ${(index + 1) * 0.1}s forwards`
            }}
          >
            <article className="group/card h-full overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-500 hover:border-blue-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] dark:border-[#1A1A1C] dark:bg-[#111113] dark:hover:border-blue-500/50">
              {article.coverImage && (
                <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-[#0A0A0C]">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-125 group-hover/card:rotate-1"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {article.tags.slice(0, 2).map(({ tag }, tagIndex) => (
                    <span
                      key={tag.id}
                      className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:scale-110 group-hover:shadow-md dark:bg-[#1A1A1C] dark:text-slate-300 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-300"
                      style={{ transitionDelay: `${tagIndex * 100}ms` }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
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

