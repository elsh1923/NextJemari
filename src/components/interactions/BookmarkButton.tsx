"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmark, hasBookmarked } from "@/actions/bookmarks";
import { Button } from "@/components/ui/Button";

interface BookmarkButtonProps {
  articleId: string;
}

export function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    hasBookmarked(articleId).then((result) => {
      setBookmarked(result);
      setChecking(false);
    });
  }, [articleId]);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await toggleBookmark(articleId);
      setBookmarked(result.bookmarked);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className="flex items-center space-x-2"
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-blue-500 text-blue-500" : ""}`} />
    </Button>
  );
}

