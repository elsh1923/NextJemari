import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserProfile } from "@/actions/users";
import { getUserArticles } from "@/actions/articles";
import { isFollowing } from "@/actions/follows";
import { UserProfileView } from "@/components/users/UserProfileView";
import { ArticleList } from "@/components/articles/ArticleList";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    username: string;
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const profile = await getUserProfile(params.username);

  if (!profile) {
    notFound();
  }

  const session = await getServerSession(authOptions).catch(() => null);
  
  const [articles, userFollowing] = await Promise.all([
    getUserArticles(params.username, false),
    session?.user?.id ? isFollowing(profile.id).catch(() => false) : Promise.resolve(false),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-indigo-950/20 bg-[length:200%_200%] animate-[gradient_3s_ease_infinite] pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <UserProfileView 
          profile={profile}
          currentUserId={session?.user?.id}
          initialFollowing={userFollowing}
          followerCount={profile._count?.followers || 0}
          followingCount={profile._count?.following || 0}
        />
        <div className="mt-8 animate-[fade-in_0.6s_ease-out_0.3s_forwards] opacity-0">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            Articles ({articles.length})
          </h2>
          <ArticleList articles={articles} />
        </div>
      </div>
    </div>
  );
}
