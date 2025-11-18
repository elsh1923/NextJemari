"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/actions/likes";

interface LikeButtonProps {
  articleId: string;
  initialCount: number;
  initialLiked?: boolean;
}

export function LikeButton({ articleId, initialCount, initialLiked = false }: LikeButtonProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  async function handleLike() {
    if (!session) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    setLoading(true);
    try {
      const result = await toggleLike(articleId);
      setLiked(result.liked);
      setCount(result.likeCount);
    } catch (error: any) {
      if (error?.message?.includes("Unauthorized") || error?.message?.includes("login")) {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      } else {
        console.error("Failed to toggle like:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center space-x-1.5 transition-colors ${
          liked
            ? "text-red-600 dark:text-red-400"
            : "text-slate-600 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
        }`}
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        <span>{count}</span>
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

