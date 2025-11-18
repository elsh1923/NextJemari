"use client";

import { useState } from "react";
import Link from "next/link";
import { SessionUser } from "@/types";
import { ArticleListItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { ArticleList } from "@/components/articles/ArticleList";
import { Plus, FileText, Bookmark } from "lucide-react";

interface DashboardViewProps {
  user: SessionUser;
  articles: ArticleListItem[];
  bookmarks: ArticleListItem[];
}

export function DashboardView({ user, articles, bookmarks }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"articles" | "bookmarks">("articles");

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

      <div className="mb-6 border-b border-slate-200 dark:border-[#1A1A1C]">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("articles")}
            className={`border-b-2 py-4 text-sm font-medium ${
              activeTab === "articles"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>My Articles ({articles.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`border-b-2 py-4 text-sm font-medium ${
              activeTab === "bookmarks"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bookmark className="h-4 w-4" />
              <span>Bookmarks ({bookmarks.length})</span>
            </div>
          </button>
        </nav>
      </div>

      <div>
        {activeTab === "articles" ? (
          articles.length > 0 ? (
            <ArticleList articles={articles} />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                No articles yet
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Get started by writing your first article.
              </p>
              <Link href="/write" className="mt-4 inline-block">
                <Button>Write Article</Button>
              </Link>
            </div>
          )
        ) : bookmarks.length > 0 ? (
          <ArticleList articles={bookmarks} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-[#1A1A1C] dark:bg-[#111113]">
            <Bookmark className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
              No bookmarks yet
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Articles you bookmark will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
