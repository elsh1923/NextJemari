import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserArticlesById } from "@/actions/articles";
import { getBookmarkedArticles } from "@/actions/bookmarks";
import { getCurrentUserProfile } from "@/actions/users";
import { getFollowers, getFollowing, getFollowerCount, getFollowingCount } from "@/actions/follows";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let session;
  
  try {
    session = await getServerSession(authOptions);
  } catch (error: any) {
    // Handle JWT session errors - clear invalid session and redirect
    if (error?.message?.includes("decryption") || error?.message?.includes("JWT")) {
      // Clear the session cookie
      const cookieStore = await cookies();
      cookieStore.delete("next-auth.session-token");
      cookieStore.delete("__Secure-next-auth.session-token");
      redirect("/auth/signin");
    }
    // Re-throw other errors
    throw error;
  }

  if (!session || !session.user.id) {
    redirect("/auth/signin");
  }

  const [articles, bookmarks, profile, followers, following, followerCount, followingCount] = await Promise.all([
    getUserArticlesById(session.user.id, true).catch(() => []),
    getBookmarkedArticles().catch(() => []),
    getCurrentUserProfile().catch(() => null),
    getFollowers(session.user.id).catch(() => []),
    getFollowing(session.user.id).catch(() => []),
    getFollowerCount(session.user.id).catch(() => 0),
    getFollowingCount(session.user.id).catch(() => 0),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-indigo-950/20 bg-[length:200%_200%] animate-[gradient_3s_ease_infinite] pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardView
          user={session.user}
          articles={articles}
          bookmarks={bookmarks}
          profile={profile}
          followers={followers}
          following={following}
          followerCount={followerCount}
          followingCount={followingCount}
        />
      </div>
    </div>
  );
}
