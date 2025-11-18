import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUserProfile } from "@/actions/users";
import { getFollowing } from "@/actions/follows";
import { User } from "lucide-react";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    username: string;
  };
}

export default async function FollowingPage({ params }: PageProps) {
  const profile = await getUserProfile(params.username);

  if (!profile) {
    notFound();
  }

  const following = await getFollowing(profile.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0A0C]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/u/${params.username}`}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            ← Back to profile
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            {profile.username} is following
          </h1>
        </div>

        {following.length > 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white dark:border-[#1A1A1C] dark:bg-[#111113]">
            <div className="divide-y divide-slate-200 dark:divide-[#1A1A1C]">
              {following.map((user) => (
                <Link
                  key={user.id}
                  href={`/u/${user.username}`}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-[#0A0A0C]"
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.username}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-[#1A1A1C]">
                      <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {user.username}
                    </div>
                    {user.bio && (
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {user.bio}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
            <p className="text-slate-600 dark:text-slate-400">
              {profile.username} is not following anyone yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

