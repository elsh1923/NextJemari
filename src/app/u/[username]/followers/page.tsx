import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserProfile } from "@/actions/users";
import { getFollowers } from "@/actions/follows";
import { UserList } from "@/components/users/UserList";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function FollowersPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { username } = resolvedParams;
  const profile = await getUserProfile(username);

  if (!profile) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const followers = await getFollowers(profile.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/u/${username}`}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            ← Back to profile
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            {profile.username} is followed by
          </h1>
        </div>

        <UserList 
          users={followers} 
          currentUserId={currentUserId}
          showFollowButton={true}
        />
      </div>
    </div>
  );
}
