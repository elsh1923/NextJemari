import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserArticlesById } from "@/actions/articles";
import { getBookmarkedArticles } from "@/actions/bookmarks";
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

  const [articles, bookmarks] = await Promise.all([
    getUserArticlesById(session.user.id, true).catch(() => []),
    getBookmarkedArticles().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardView
          user={session.user}
          articles={articles}
          bookmarks={bookmarks}
        />
      </div>
    </div>
  );
}
