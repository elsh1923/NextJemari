"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Calendar, FileText, MessageCircle, Heart, Bookmark, Users } from "lucide-react";
import { UserProfile, ArticleListItem } from "@/types";
import { formatDate } from "@/lib/utils";
import { FollowButton } from "./FollowButton";
import { ArticleList } from "@/components/articles/ArticleList";
import { UserList } from "@/components/users/UserList";

interface UserListItem {
  id: string;
  username: string;
  image: string | null;
  bio: string | null;
  isFollowing?: boolean;
}

interface UserProfileViewProps {
  profile: UserProfile;
  currentUserId?: string;
  initialFollowing?: boolean;
  followerCount?: number;
  followingCount?: number;
  onFollowChange?: (following: boolean, followerCount: number) => void;
  articles?: ArticleListItem[];
  followers?: UserListItem[];
  following?: UserListItem[];
}

export function UserProfileView({ 
  profile, 
  currentUserId,
  initialFollowing = false,
  followerCount: initialFollowerCount = 0,
  followingCount: initialFollowingCount = 0,
  onFollowChange,
  articles = [],
  followers = [],
  following = []
}: UserProfileViewProps) {
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [followingCount, setFollowingCount] = useState(initialFollowingCount);
  const [activeTab, setActiveTab] = useState<"articles" | "followers" | "following">("articles");
  const isOwnProfile = currentUserId === profile.id;

  const handleFollowChange = (following: boolean, newFollowerCount: number) => {
    setFollowerCount(newFollowerCount);
    if (onFollowChange) {
      onFollowChange(following, newFollowerCount);
    }
  };

  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    let classes = "rounded-lg p-4 text-center transition-colors ";
    if (isActive) {
      classes += "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20";
    } else {
      classes += "bg-slate-50 hover:bg-slate-100 dark:bg-[#0A0A0C] dark:hover:bg-[#1A1A1C]";
    }
    return classes;
  };

  const getIconClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return "mx-auto h-6 w-6 " + (isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400");
  };

  const getTextClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return "mt-2 text-2xl font-bold " + (isActive ? "text-blue-700 dark:text-blue-300" : "text-slate-900 dark:text-white");
  };

  const getLabelClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return "text-xs " + (isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white dark:border-[#1A1A1C] dark:bg-[#111113]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {profile.image ? (
              <Image
                src={profile.image}
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
                    onFollowChange={handleFollowChange}
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
                <button 
                  onClick={() => setActiveTab("followers")}
                  className={getTabClass("followers")}
                >
                  <Users className={getIconClass("followers")} />
                  <div className={getTextClass("followers")}>
                    {followerCount}
                  </div>
                  <div className={getLabelClass("followers")}>Followers</div>
                </button>
                <button 
                  onClick={() => setActiveTab("following")}
                  className={getTabClass("following")}
                >
                  <Users className={getIconClass("following")} />
                  <div className={getTextClass("following")}>
                    {followingCount}
                  </div>
                  <div className={getLabelClass("following")}>Following</div>
                </button>
                <button 
                  onClick={() => setActiveTab("articles")}
                  className={getTabClass("articles")}
                >
                  <FileText className={getIconClass("articles")} />
                  <div className={getTextClass("articles")}>
                    {profile._count?.articles || 0}
                  </div>
                  <div className={getLabelClass("articles")}>Articles</div>
                </button>
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

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1A1A1C] dark:bg-[#111113]">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-[#1A1A1C]">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
            {activeTab}
          </h2>
        </div>

        {activeTab === "articles" && (
          <ArticleList articles={articles} />
        )}

        {activeTab === "followers" && (
          <UserList users={followers} currentUserId={currentUserId} showFollowButton={true} />
        )}

        {activeTab === "following" && (
          <UserList users={following} currentUserId={currentUserId} showFollowButton={true} />
        )}
      </div>
    </div>
  );
}
