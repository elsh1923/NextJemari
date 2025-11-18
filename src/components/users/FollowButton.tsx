"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { UserPlus, UserCheck } from "lucide-react";
import { toggleFollow } from "@/actions/follows";
import { Button } from "@/components/ui/Button";

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  initialFollowerCount?: number;
  onFollowChange?: (following: boolean, followerCount: number) => void;
}

export function FollowButton({ 
  userId, 
  initialFollowing = false,
  initialFollowerCount = 0,
  onFollowChange
}: FollowButtonProps) {
  const { data: session } = useSession();
  const [following, setFollowing] = useState(initialFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
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
      const result = await toggleFollow(userId);
      setFollowing(result.following);
      setFollowerCount(result.followerCount);
      if (onFollowChange) {
        onFollowChange(result.following, result.followerCount);
      }
    } catch (error: any) {
      if (error?.message?.includes("Unauthorized") || error?.message?.includes("login")) {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      } else {
        console.error("Failed to toggle follow:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          onClick={handleClick}
          className="flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Follow</span>
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

  return (
    <div className="relative">
      <Button
        variant={following ? "outline" : "default"}
        onClick={handleClick}
        disabled={loading}
        className="flex items-center space-x-2"
      >
        {following ? (
          <>
            <UserCheck className="h-4 w-4" />
            <span>Following</span>
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            <span>Follow</span>
          </>
        )}
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

