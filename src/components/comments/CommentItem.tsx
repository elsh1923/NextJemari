"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Calendar, Reply, Trash2 } from "lucide-react";
import { CommentWithAuthor } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { deleteComment } from "@/actions/comments";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: CommentWithAuthor;
  depth?: number;
}

export function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const { data: session } = useSession();
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [deleted, setDeleted] = useState(false);
  
  const maxDepth = 3;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment(comment.id);
      setDeleted(true);
    } catch (error) {
      alert("Failed to delete comment");
    }
  };

  const handleReplyAdded = (newReply: CommentWithAuthor) => {
    setReplies([...replies, newReply]);
    setShowReply(false);
  };

  if (deleted) return null;

  const canDelete = session?.user?.id === comment.authorId;
  const canReply = session && depth < maxDepth;

  return (
    <div className="border-b border-slate-200 pb-6 last:border-0 dark:border-[#1A1A1C]">
      <div className="flex gap-4">
        {comment.author.image ? (
          <Image
            src={comment.author.image}
            alt={comment.author.username}
            width={40}
            height={40}
            className="h-10 w-10 flex-shrink-0 rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-[#1A1A1C]">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {comment.author.username[0].toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                href={`/u/${comment.author.username}`}
                className="font-medium text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                {comment.author.username}
              </Link>
              <span 
                className="text-sm text-slate-500 dark:text-slate-500"
                suppressHydrationWarning
              >
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            {canDelete && (
              <button
                onClick={handleDelete}
                className="text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="mb-3 whitespace-pre-wrap text-slate-700 dark:text-slate-300">
            {comment.body}
          </p>

          {canReply && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center space-x-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
          )}

          {showReply && (
            <div className="mt-4">
              <CommentForm
                articleId={comment.articleId}
                parentId={comment.id}
                onCommentAdded={handleReplyAdded}
                onCancel={() => setShowReply(false)}
              />
            </div>
          )}

          {replies.length > 0 && depth < maxDepth && (
            <div className="mt-4 space-y-4 border-l-2 border-slate-200 pl-4 dark:border-[#1A1A1C]">
              {replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
