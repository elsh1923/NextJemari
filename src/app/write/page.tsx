import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ArticleEditor } from "@/components/articles/ArticleEditor";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export default async function WritePage() {
  let session;
  
  try {
    session = await getServerSession(authOptions);
  } catch (error: any) {
    // Handle JWT session errors - clear invalid session and redirect
    if (error?.message?.includes("decryption") || error?.message?.includes("JWT")) {
      const cookieStore = await cookies();
      cookieStore.delete("next-auth.session-token");
      cookieStore.delete("__Secure-next-auth.session-token");
      redirect("/auth/signin");
    }
    throw error;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ArticleEditor />
      </div>
    </div>
  );
}
