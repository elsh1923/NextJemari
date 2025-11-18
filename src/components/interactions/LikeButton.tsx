"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/actions/likes";
import { Button } from "@/components/ui/Button";

interface LikeButtonProps {
  articleId: string;
  initialCount: number;
  initialLiked?: boolean;
}

export function LikeButton({ articleId, initialCount, initialLiked }: LikeButtonProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked || false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = async () => {
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
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={loading}
        className="flex items-center space-x-2"
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
        <span>{count}</span>
      </Button>
      {showMessage && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-slate-800">
          Please login first
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
}

