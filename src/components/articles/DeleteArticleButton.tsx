"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteArticle } from "@/actions/articles";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";

interface DeleteArticleButtonProps {
  slug: string;
  authorUsername: string;
}

export function DeleteArticleButton({ slug, authorUsername }: DeleteArticleButtonProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteArticle(slug);
      setSuccess(true);
      
      // Check if we're on the dashboard
      const isDashboard = typeof window !== 'undefined' && window.location.pathname.includes('/dashboard');
      
      // Show success message for 1.5 seconds before closing dialog and refreshing
      setTimeout(() => {
        setShowDialog(false);
        
        if (isDashboard) {
          // On dashboard, reload the page smoothly after dialog closes
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } else {
          // On article page, redirect to user profile
          window.location.href = `/u/${authorUsername}`;
        }
      }, 1500);
    } catch (err: any) {
      console.error("Failed to delete article:", err);
      setError(err?.message || "Failed to delete article. Please try again.");
      setLoading(false);
      setSuccess(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowDialog(true)}
        className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {success ? (
              <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-950/30 dark:text-green-400">
                <p className="font-medium">
                  ✓ Article deleted successfully!
                </p>
              </div>
            ) : (
              <>
                <p className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete this article? This action cannot be undone.
                </p>
                {error && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            {!success && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  {loading ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
