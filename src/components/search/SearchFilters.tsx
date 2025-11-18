"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface SearchFiltersProps {
  initialTags?: string[];
  initialSortBy?: string;
}

function SearchFiltersContent({ initialTags = [], initialSortBy = "newest" }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [sortBy, setSortBy] = useState(initialSortBy);

  useEffect(() => {
    // Fetch tags from API
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTags(data.data);
        }
      });
  }, []);

  const updateFilters = (newTags: string[], newSortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newTags.length > 0) {
      params.set("tags", newTags.join(","));
    } else {
      params.delete("tags");
    }
    
    params.set("sortBy", newSortBy);
    params.delete("page");
    
    router.push(`/search?${params.toString()}`);
  };

  const toggleTag = (tagName: string) => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter((t) => t !== tagName)
      : [...selectedTags, tagName];
    setSelectedTags(newTags);
    updateFilters(newTags, sortBy);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    updateFilters(selectedTags, newSortBy);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-white"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Popular</option>
          <option value="trending">Trending</option>
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 20).map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.name)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedTags.includes(tag.name)
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#1A1A1C] dark:text-slate-300 dark:hover:bg-[#2A2A2C]"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchFilters(props: SearchFiltersProps) {
  return (
    <Suspense fallback={<div className="space-y-6">Loading filters...</div>}>
      <SearchFiltersContent {...props} />
    </Suspense>
  );
}

