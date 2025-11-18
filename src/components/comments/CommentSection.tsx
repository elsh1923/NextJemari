"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { CommentWithAuthor } from "@/types";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";

interface CommentSectionProps {
  articleId: string;
  initialComments: CommentWithAuthor[];
}

export function CommentSection({ articleId, initialComments }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);

  const handleCommentAdded = (newComment: CommentWithAuthor) => {
    setComments([...comments, newComment]);
  };

  return (
    <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1A1A1C] dark:bg-[#111113] sm:p-8">
      <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
        Comments ({comments.length})
      </h2>

      {session ? (
        <CommentForm articleId={articleId} onCommentAdded={handleCommentAdded} />
      ) : (
        <div className="mb-6 rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-600 dark:bg-[#0A0A0C] dark:text-slate-400">
          <a
            href="/auth/signin"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign in
          </a>{" "}
          to leave a comment
        </div>
      )}

      <div className="mt-8">
        <CommentList comments={comments} />
      </div>
    </div>
  );
}
