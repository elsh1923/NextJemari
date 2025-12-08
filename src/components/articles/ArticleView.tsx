import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Heart, MessageCircle, Bookmark, User } from "lucide-react";
import { ArticleWithRelations } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { LikeButton } from "@/components/articles/LikeButton";
import { BookmarkButton } from "@/components/articles/BookmarkButton";
import { DeleteArticleButton } from "@/components/articles/DeleteArticleButton";
import { FollowButton } from "@/components/users/FollowButton";
import { MDXContent } from "@/components/mdx/MDXContent";
import { ReportButton } from "@/components/articles/ReportButton";

interface ArticleViewProps {
  article: ArticleWithRelations;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
  currentUserId?: string;
  initialFollowing?: boolean;
}

export function ArticleView({ article, initialLiked = false, initialBookmarked = false, currentUserId, initialFollowing = false }: ArticleViewProps) {
  const isAuthor = currentUserId === article.author.id;
  const canFollow = currentUserId && !isAuthor;
  return (
    <article className="rounded-xl border border-slate-200 bg-white dark:border-[#1A1A1C] dark:bg-[#111113]">
      {/* Header */}
      <header className="border-b border-slate-200 p-6 dark:border-[#1A1A1C] sm:p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {article.tags.map(({ tag }) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-[#1A1A1C] dark:text-slate-300 dark:hover:bg-[#2A2A2C]"
            >
              {tag.name}
            </Link>
          ))}
        </div>

        <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {article.title}
        </h1>

        {article.description && (
          <p className="mb-6 text-lg text-slate-600 dark:text-slate-400">
            {article.description}
          </p>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href={`/u/${article.author.username}`}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              {article.author.image ? (
                <Image
                  src={article.author.image}
                  alt={article.author.username}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-[#1A1A1C]">
                  <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
              )}
              <div>
                <div className="font-medium text-slate-900 dark:text-white">
                  {article.author.username}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:gap-3 sm:text-sm dark:text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="hidden sm:inline">{formatRelativeTime(article.createdAt)}</span>
                    <span className="sm:hidden">{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  {article.readingTime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{article.readingTime} min</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <span>{article.viewCount} views</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>



          <div className="flex items-center space-x-2 sm:space-x-3">
            <LikeButton 
              articleId={article.id} 
              initialCount={article._count?.likes || 0}
              initialLiked={initialLiked}
            />
            <BookmarkButton 
              articleId={article.id}
              initialBookmarked={initialBookmarked}
            />
            {article._count?.comments !== undefined && (
              <div className="flex items-center space-x-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 sm:px-3 sm:text-sm dark:border-[#1A1A1C] dark:text-slate-400">
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{article._count.comments}</span>
              </div>
            )}
            {canFollow && (
              <FollowButton 
                userId={article.author.id}
                initialFollowing={initialFollowing}
              />
            )}
            {isAuthor && (
              <DeleteArticleButton 
                slug={article.slug}
                authorUsername={article.author.username}
              />
            )}
            {!isAuthor && (
              <ReportButton articleId={article.id} />
            )}
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-[#0A0A0C]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-slate max-w-none p-4 dark:prose-invert sm:p-6 sm:prose-base lg:p-8 lg:prose-lg">
        <MDXContent content={article.body} />
      </div>
    </article>
  );
}
