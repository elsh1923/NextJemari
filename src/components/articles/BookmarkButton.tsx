"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Bookmark } from "lucide-react";
import { toggleBookmark } from "@/actions/bookmarks";

interface BookmarkButtonProps {
  articleId: string;
  initialBookmarked?: boolean;
}

export function BookmarkButton({ articleId, initialBookmarked = false }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  async function handleBookmark() {
    if (!session) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    setLoading(true);
    try {
      const result = await toggleBookmark(articleId);
      setBookmarked(result.bookmarked);
    } catch (error: any) {
      if (error?.message?.includes("Unauthorized") || error?.message?.includes("login")) {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      } else {
        console.error("Failed to toggle bookmark:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleBookmark}
        disabled={loading}
        className={`transition-colors ${
          bookmarked
            ? "text-blue-600 dark:text-blue-400"
            : "text-slate-600 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400"
        }`}
      >
        <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
      </button>
      {showMessage && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-slate-800">
          Please login first
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
}

