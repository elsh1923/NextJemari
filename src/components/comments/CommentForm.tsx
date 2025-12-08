"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createComment } from "@/actions/comments";
import { CommentWithAuthor } from "@/types";
import { Button } from "@/components/ui/Button";

interface CommentFormProps {
  articleId: string;
  parentId?: string;
  onCommentAdded: (comment: CommentWithAuthor) => void;
  onCancel?: () => void;
}

export function CommentForm({ articleId, parentId, onCommentAdded, onCancel }: CommentFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    if (!session) {
      setError("Please login first to post a comment");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const comment = await createComment({
        articleId,
        body: body.trim(),
        parentId,
      });
      onCommentAdded(comment);
      router.refresh(); // Refresh server components to update counts
      setBody("");
    } catch (error: any) {
      if (error?.message?.includes("Unauthorized") || error?.message?.includes("login")) {
        setError("Please login first to post a comment");
      } else {
        setError(error.message || "Failed to post comment");
      }
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Write a comment..."
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#0A0A0C] dark:text-white dark:placeholder-slate-500"
        required
      />
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || !body.trim()}>
          {loading ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}
