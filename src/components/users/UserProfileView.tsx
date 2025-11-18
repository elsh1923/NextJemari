import Image from "next/image";
import Link from "next/link";
import { User, Calendar, FileText, MessageCircle, Heart, Bookmark, Users } from "lucide-react";
import { UserProfile } from "@/types";
import { formatDate } from "@/lib/utils";
import { FollowButton } from "./FollowButton";

interface UserProfileViewProps {
  profile: UserProfile;
  currentUserId?: string;
  initialFollowing?: boolean;
  followerCount?: number;
  followingCount?: number;
  onFollowChange?: (following: boolean, followerCount: number) => void;
}

export function UserProfileView({ 
  profile, 
  currentUserId,
  initialFollowing = false,
  followerCount = 0,
  followingCount = 0,
  onFollowChange
}: UserProfileViewProps) {
  const isOwnProfile = currentUserId === profile.id;

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-[#1A1A1C] dark:bg-[#111113]">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.username}
              width={120}
              height={120}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-30 w-30 items-center justify-center rounded-full bg-slate-200 dark:bg-[#1A1A1C]">
              <User className="h-16 w-16 text-slate-600 dark:text-slate-400" />
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {profile.username}
                </h1>
                {profile.bio && (
                  <p className="mt-2 text-slate-600 dark:text-slate-400">{profile.bio}</p>
                )}
              </div>
              {!isOwnProfile && (
                <FollowButton
                  userId={profile.id}
                  initialFollowing={initialFollowing}
                  initialFollowerCount={followerCount}
                  onFollowChange={onFollowChange}
                />
              )}
            </div>
            
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 sm:justify-start dark:text-slate-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(profile.createdAt)}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-6">
              <Link 
                href={`/u/${profile.username}/followers`}
                className="rounded-lg bg-slate-50 p-4 text-center transition-colors hover:bg-slate-100 dark:bg-[#0A0A0C] dark:hover:bg-[#1A1A1C]"
              >
                <Users className="mx-auto h-6 w-6 text-slate-600 dark:text-slate-400" />
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {followerCount}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Followers</div>
              </Link>
              <Link 
                href={`/u/${profile.username}/following`}
                className="rounded-lg bg-slate-50 p-4 text-center transition-colors hover:bg-slate-100 dark:bg-[#0A0A0C] dark:hover:bg-[#1A1A1C]"
              >
                <Users className="mx-auto h-6 w-6 text-slate-600 dark:text-slate-400" />
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {followingCount}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Following</div>
              </Link>
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-[#0A0A0C]">
                <FileText className="mx-auto h-6 w-6 text-slate-600 dark:text-slate-400" />
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {profile._count?.articles || 0}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Articles</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-[#0A0A0C]">
                <MessageCircle className="mx-auto h-6 w-6 text-slate-600 dark:text-slate-400" />
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {profile._count?.comments || 0}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Comments</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-[#0A0A0C]">
                <Heart className="mx-auto h-6 w-6 text-slate-600 dark:text-slate-400" />
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {profile._count?.likes || 0}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Likes</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-[#0A0A0C]">
                <Bookmark className="mx-auto h-6 w-6 text-slate-600 dark:text-slate-400" />
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {profile._count?.bookmarks || 0}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Bookmarks</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
