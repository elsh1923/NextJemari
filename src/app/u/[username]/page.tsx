import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserProfile } from "@/actions/users";
import { getUserArticles } from "@/actions/articles";
import { isFollowing, getFollowers, getFollowing } from "@/actions/follows";
import { UserProfileView } from "@/components/users/UserProfileView";
import { ArticleList } from "@/components/articles/ArticleList";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { username } = resolvedParams;
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const profile = await getUserProfile(username);

  if (!profile) {
    notFound();
  }

  const [articles, isUserFollowing, followers, following] = await Promise.all([
    getUserArticles(username, currentUserId === profile.id),
    currentUserId && currentUserId !== profile.id
      ? isFollowing(profile.id)
      : Promise.resolve(false),
    getFollowers(profile.id),
    getFollowing(profile.id),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-[#0A0A0C] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <UserProfileView
          profile={profile}
          currentUserId={currentUserId}
          initialFollowing={isUserFollowing}
          followerCount={profile._count?.followers || 0}
          followingCount={profile._count?.following || 0}
          articles={articles}
          followers={followers}
          following={following}
        />
      </div>
    </div>
  );
}
