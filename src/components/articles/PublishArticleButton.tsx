"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { publishArticle } from "@/actions/articles";

interface PublishArticleButtonProps {
  slug: string;
}

export function PublishArticleButton({ slug }: PublishArticleButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to publish this article?")) return;

    setLoading(true);

    try {
      await publishArticle(slug);
      setSuccess(true);
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error: any) {
      alert(error.message || "Failed to publish article");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
        ✓ Published!
      </div>
    );
  }

  return (
    <button
      onClick={handlePublish}
      disabled={loading}
      className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
    >
      <Upload className="h-4 w-4" />
      <span>{loading ? "Publishing..." : "Publish"}</span>
    </button>
  );
}
