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
      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-[#1A1A1C] dark:bg-[#111113] dark:hover:border-[#2A2A2C]">
        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors group-hover:bg-slate-200 dark:bg-[#1A1A1C] dark:text-slate-300 dark:group-hover:bg-[#2A2A2C]"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <h3 className="mb-2 text-xl font-semibold text-slate-900 line-clamp-2 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
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
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-[#1A1A1C]">
                        <User className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                      </div>
                    )}
                    <span className="font-medium">{article.author.username}</span>
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
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{article._count.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{article._count.comments}</span>
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
                  className="aspect-video h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 sm:aspect-square"
                />
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

