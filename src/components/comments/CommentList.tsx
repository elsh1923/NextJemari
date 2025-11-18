"use client";

import { CommentWithAuthor } from "@/types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: CommentWithAuthor[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="py-8 text-center text-slate-600 dark:text-slate-400">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
