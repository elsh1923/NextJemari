"use client";

import { useState } from "react";
import Link from "next/link";
import { SessionUser } from "@/types";
import { ArticleListItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { ArticleList } from "@/components/articles/ArticleList";
import { Plus, FileText, Bookmark, Settings, Users, X } from "lucide-react";
import { ProfileEditForm } from "@/components/users/ProfileEditForm";
import { UserProfile } from "@/types";
import { UserList } from "@/components/users/UserList";

interface UserListItem {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
}

interface DashboardViewProps {
  user: SessionUser;
  articles: ArticleListItem[];
  bookmarks: ArticleListItem[];
  profile?: UserProfile | null;
  followers?: UserListItem[];
  following?: UserListItem[];
  followerCount?: number;
  followingCount?: number;
}

export function DashboardView({ user, articles, bookmarks, profile, followers = [], following = [], followerCount = 0, followingCount = 0 }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"articles" | "drafts" | "bookmarks" | "social" | "settings">("articles");
  const [socialView, setSocialView] = useState<"followers" | "following">("followers");
  const [showBanner, setShowBanner] = useState(true);

  const publishedArticles = articles.filter(article => article.published);
  const draftArticles = articles.filter(article => !article.published);

  const needsProfileCompletion = !profile?.bio || profile.bio.trim() === "";

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Welcome back, {user.name || user.email}!
          </p>
        </div>
        <Link href="/write">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Write Article</span>
          </Button>
        </Link>
      </div>

      {needsProfileCompletion && showBanner && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                Complete your profile
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Add a bio to tell others about yourself and make your profile stand out.
              </p>
              <button
                onClick={() => setActiveTab("settings")}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              >
                Go to Settings →
              </button>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 border-b border-slate-200 dark:border-[#1A1A1C]">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("articles")}
            className={`whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-all duration-300 ${
              activeTab === "articles"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Published ({publishedArticles.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("drafts")}
            className={`whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-all duration-300 ${
              activeTab === "drafts"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Drafts ({draftArticles.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-all duration-300 ${
              activeTab === "bookmarks"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bookmark className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Bookmarks ({bookmarks.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-all duration-300 ${
              activeTab === "social"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Social</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`whitespace-nowrap border-b-2 py-4 text-sm font-medium transition-all duration-300 ${
              activeTab === "settings"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span>Settings</span>
            </div>
          </button>
        </nav>
      </div>

      <div>
        {activeTab === "articles" ? (
          publishedArticles.length > 0 ? (
            <ArticleList articles={publishedArticles} showDeleteButton={true} />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                No published articles
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Get started by writing your first article.
              </p>
              <Link href="/write" className="mt-4 inline-block">
                <Button>Write Article</Button>
              </Link>
            </div>
          )
        ) : activeTab === "drafts" ? (
          draftArticles.length > 0 ? (
            <ArticleList articles={draftArticles} showDeleteButton={true} showPublishButton={true} />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                No drafts
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Start writing an article and save it as a draft.
              </p>
              <Link href="/write" className="mt-4 inline-block">
                <Button>Write Article</Button>
              </Link>
            </div>
          )
        ) : activeTab === "bookmarks" ? (
          bookmarks.length > 0 ? (
            <ArticleList articles={bookmarks} />
          ) : (
            <div className="animate-[fade-in_0.5s_ease-out] rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
              <Bookmark className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                No bookmarks yet
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Articles you bookmark will appear here.
              </p>
            </div>
          )
        ) : activeTab === "social" ? (
          <div className="animate-[fade-in_0.5s_ease-out] space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1A1A1C] dark:bg-[#111113]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Social
                </h2>
                <div className="flex gap-2 text-sm">
                  <div className="rounded-lg bg-blue-50 px-4 py-2 dark:bg-blue-900/20">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{followerCount}</span>
                    <span className="ml-1 text-slate-600 dark:text-slate-400">Followers</span>
                  </div>
                  <div className="rounded-lg bg-blue-50 px-4 py-2 dark:bg-blue-900/20">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{followingCount}</span>
                    <span className="ml-1 text-slate-600 dark:text-slate-400">Following</span>
                  </div>
                </div>
              </div>
              <div className="mb-4 flex gap-4 border-b border-slate-200 dark:border-[#1A1A1C]">
                <button
                  onClick={() => setSocialView("followers")}
                  className={`border-b-2 pb-2 text-sm font-medium transition-all ${
                    socialView === "followers"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
                  }`}
                >
                  Followers ({followerCount})
                </button>
                <button
                  onClick={() => setSocialView("following")}
                  className={`border-b-2 pb-2 text-sm font-medium transition-all ${
                    socialView === "following"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
                  }`}
                >
                  Following ({followingCount})
                </button>
              </div>
              {socialView === "followers" ? (
                <UserList users={followers} currentUserId={user.id} showFollowButton={false} />
              ) : (
                <UserList users={following} currentUserId={user.id} showFollowButton={true} />
              )}
            </div>
          </div>
        ) : activeTab === "settings" ? (
          <div className="animate-[fade-in_0.5s_ease-out] rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1A1A1C] dark:bg-[#111113] sm:p-8">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
              Edit Profile
            </h2>
            {profile ? (
              <ProfileEditForm profile={profile} />
            ) : (
              <div className="text-center text-slate-600 dark:text-slate-400">
                Loading profile...
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
