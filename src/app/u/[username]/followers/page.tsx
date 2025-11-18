import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUserProfile } from "@/actions/users";
import { getFollowers } from "@/actions/follows";
import { User } from "lucide-react";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    username: string;
  };
}

export default async function FollowersPage({ params }: PageProps) {
  const profile = await getUserProfile(params.username);

  if (!profile) {
    notFound();
  }

  const followers = await getFollowers(profile.id);

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
            Followers of {profile.username}
          </h1>
        </div>

        {followers.length > 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white dark:border-[#1A1A1C] dark:bg-[#111113]">
            <div className="divide-y divide-slate-200 dark:divide-[#1A1A1C]">
              {followers.map((follower) => (
                <Link
                  key={follower.id}
                  href={`/u/${follower.username}`}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-[#0A0A0C]"
                >
                  {follower.avatarUrl ? (
                    <Image
                      src={follower.avatarUrl}
                      alt={follower.username}
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
                      {follower.username}
                    </div>
                    {follower.bio && (
                      <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {follower.bio}
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
              {profile.username} has no followers yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

