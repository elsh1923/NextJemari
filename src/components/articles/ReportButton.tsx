"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Flag, X } from "lucide-react";
import { reportArticle } from "@/actions/reports";
import { Button } from "@/components/ui/Button";

interface ReportButtonProps {
  articleId: string;
}

export function ReportButton({ articleId }: ReportButtonProps) {
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!session) {
      setError("Please sign in to report articles");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await reportArticle(articleId, reason);
      setSuccess(true);
      setTimeout(() => {
        setShowDialog(false);
        setSuccess(false);
        setReason("");
      }, 2000);
    } catch (err) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center space-x-1 text-slate-600 transition-colors hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
        title="Report article"
      >
        <Flag className="h-4 w-4" />
      </button>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#111113]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Report Article
              </h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {success ? (
              <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Report submitted successfully. Thank you!
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="reason"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Reason for reporting
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please explain why you're reporting this article..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#0A0A0C] dark:text-slate-100 dark:placeholder-slate-500"
                    maxLength={500}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {reason.length}/500 characters
                  </p>
                </div>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowDialog(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || !reason.trim()}>
                    {loading ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
