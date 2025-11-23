import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getArticleBySlug } from "@/actions/articles";
import { getArticleComments } from "@/actions/comments";
import { hasLiked } from "@/actions/likes";
import { hasBookmarked } from "@/actions/bookmarks";
import { isFollowing } from "@/actions/follows";
import { ArticleView } from "@/components/articles/ArticleView";
import { CommentSection } from "@/components/comments/CommentSection";
import { RelatedArticles } from "@/components/articles/RelatedArticles";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: PageProps) {
  // Handle params - can be Promise in Next.js 15+ or object in older versions
  const resolvedParams = params instanceof Promise ? await params : params;
  const { username, slug } = resolvedParams;
  
  let article;
  
  try {
    article = await getArticleBySlug(slug, true);
  } catch (error: any) {
    // Handle database connection errors gracefully
    if (error?.code === "P1001" || error?.message?.includes("Can't reach database")) {
      console.error("Database connection error:", error.message);
      notFound();
    }
    // Log other errors for debugging
    console.error("Error fetching article:", error);
    notFound();
  }

  if (!article || article.author.username !== username) {
    notFound();
  }

  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error: any) {
    // Silently handle session errors
    if (error?.message?.includes("decryption") || error?.message?.includes("JWT")) {
      console.warn("Session error:", error.message);
    }
  }
  
  // Check if user has liked/bookmarked/followed (only if logged in)
  const [comments, userLiked, userBookmarked, userFollowing] = await Promise.all([
    getArticleComments(article.id).catch(() => []),
    session?.user?.id ? hasLiked(article.id).catch(() => false) : Promise.resolve(false),
    session?.user?.id ? hasBookmarked(article.id).catch(() => false) : Promise.resolve(false),
    session?.user?.id && article.author.id !== session.user.id ? isFollowing(article.author.id).catch(() => false) : Promise.resolve(false),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ArticleView 
          article={article} 
          initialLiked={userLiked}
          initialBookmarked={userBookmarked}
          currentUserId={session?.user?.id}
          initialFollowing={userFollowing}
        />
        <CommentSection articleId={article.id} initialComments={comments} />
        <RelatedArticles currentArticleId={article.id} tags={article.tags.map(t => t.tag.slug)} />
      </div>
    </div>
  );
}
