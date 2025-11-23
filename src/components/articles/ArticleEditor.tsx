"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArticleWithRelations } from "@/types";
import { createArticle, updateArticle } from "@/actions/articles";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface ArticleEditorProps {
  article?: ArticleWithRelations;
}

export function ArticleEditor({ article }: ArticleEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: article?.title || "",
    description: article?.description || "",
    body: article?.body || "",
    coverImage: article?.coverImage || "",
    tagNames: article?.tags.map((t) => t.tag.name).join(", ") || "",
    published: article?.published ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const tagNames = formData.tagNames
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (article) {
        await updateArticle({
          slug: article.slug,
          ...formData,
          tagNames,
        });
        setSuccess(true);
        setTimeout(() => {
          router.push(`/u/${article.author.username}/${article.slug}`);
          router.refresh();
        }, 1500);
      } else {
        const newArticle = await createArticle({
          ...formData,
          tagNames,
        });
        setSuccess(true);
        setTimeout(() => {
          router.push(`/u/${newArticle.author.username}/${newArticle.slug}`);
          router.refresh();
        }, 1500);
      }
    } catch (error: any) {
      alert(error.message || "Failed to save article");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-[#1A1A1C] dark:bg-[#111113]">
      <div className="border-b border-slate-200 p-6 dark:border-[#1A1A1C]">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {article ? "Edit Article" : "Write New Article"}
        </h1>
      </div>

      {success && (
        <div className="mx-6 mb-4 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-950/30 dark:text-green-400">
          <p className="font-medium">
            ✓ {article ? "Article updated" : "Article published"} successfully! Redirecting...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#0A0A0C] dark:text-white"
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#0A0A0C] dark:text-white"
              placeholder="Brief description of your article"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Cover Image
            </label>
            <div className="mt-1">
              <ImageUpload
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
                folder="nextjemari/articles"
                type="cover"
                maxSize={10}
              />
            </div>
            {formData.coverImage && (
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#0A0A0C] dark:text-white"
                placeholder="Or paste image URL directly"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tagNames}
              onChange={(e) => setFormData({ ...formData, tagNames: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#0A0A0C] dark:text-white"
              placeholder="react, nextjs, tutorial"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Content (MDX) *
            </label>
            <textarea
              required
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={20}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#0A0A0C] dark:text-white"
              placeholder="# Your Article Title\n\nWrite your article content here using Markdown/MDX..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="published" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
              Publish immediately
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? "Saving..." 
                : article 
                  ? "Update Article" 
                  : formData.published 
                    ? "Publish Article" 
                    : "Save Draft"
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
