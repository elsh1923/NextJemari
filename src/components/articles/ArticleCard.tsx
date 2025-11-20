import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Heart, MessageCircle, User } from "lucide-react";
import { ArticleListItem } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface ArticleCardProps {
  article: ArticleListItem;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/u/${article.author.username}/${article.slug}`}
      className="group block"
    >
      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-500 hover:border-blue-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] dark:border-[#1A1A1C] dark:bg-[#111113] dark:hover:border-blue-500/50">
        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map(({ tag }, tagIndex) => (
                  <span
                    key={tag.id}
                    className="inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:scale-110 group-hover:shadow-md dark:bg-[#1A1A1C] dark:text-slate-300 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-300"
                    style={{ transitionDelay: `${tagIndex * 50}ms` }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <h3 className="mb-2 text-xl font-semibold text-slate-900 line-clamp-2 transition-all duration-300 group-hover:text-blue-600 group-hover:translate-x-1 dark:text-white dark:group-hover:text-blue-400">
                {article.title}
              </h3>

              {article.description && (
                <p className="mb-4 text-sm leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
                  {article.description}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-500 sm:gap-4">
                  <div className="flex items-center space-x-1.5">
                    {article.author.avatarUrl ? (
                      <Image
                        src={article.author.avatarUrl}
                        alt={article.author.username}
                        width={20}
                        height={20}
                        className="rounded-full transition-all duration-300 group-hover:scale-125 group-hover:ring-2 group-hover:ring-blue-500"
                      />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 transition-all duration-300 group-hover:scale-125 group-hover:bg-blue-100 dark:bg-[#1A1A1C] dark:group-hover:bg-blue-900/30">
                        <User className="h-3 w-3 text-slate-600 transition-all duration-300 dark:text-slate-400" />
                      </div>
                    )}
                    <span className="font-medium transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{article.author.username}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatRelativeTime(article.createdAt)}</span>
                  </div>
                  {article.readingTime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.readingTime} min read</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-500">
                  <div className="flex items-center space-x-1 transition-all duration-300 group-hover:text-red-500 group-hover:scale-110">
                    <Heart className="h-4 w-4 transition-all duration-300 group-hover:fill-red-500 group-hover:animate-pulse" />
                    <span className="font-medium">{article._count.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 transition-all duration-300 group-hover:text-blue-500 group-hover:scale-110">
                    <MessageCircle className="h-4 w-4 transition-all duration-300 group-hover:fill-blue-500" />
                    <span className="font-medium">{article._count.comments}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="w-full flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-32 dark:bg-[#0A0A0C]">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="aspect-video h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:aspect-square"
                />
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

