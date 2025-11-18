import Link from "next/link";
import { TrendingUp, Mail, ArrowRight } from "lucide-react";
import { TagWithCount } from "@/types";

interface SidebarProps {
  popularTags: TagWithCount[];
}

export function Sidebar({ popularTags }: SidebarProps) {
  return (
    <aside className="space-y-4 sm:space-y-6">
      {/* Trending Tags */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#1A1A1C] dark:bg-[#111113] sm:p-6">
        <div className="mb-3 flex items-center space-x-2 sm:mb-4">
          <TrendingUp className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
            Trending Tags
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {popularTags.slice(0, 10).map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-[#1A1A1C] dark:text-slate-300 dark:hover:bg-[#2A2A2C] dark:hover:text-white"
            >
              {tag.name}
              <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-500">
                {tag._count.articles}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Subscribe */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:border-[#1A1A1C] dark:from-[#111113] dark:to-[#0A0A0C] sm:p-6">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 sm:mb-4 sm:h-12 sm:w-12 dark:bg-blue-500">
          <Mail className="h-5 w-5 text-white sm:h-6 sm:w-6" />
        </div>
        <h3 className="mb-2 text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
          Stay Updated
        </h3>
        <p className="mb-3 text-xs text-slate-600 sm:mb-4 sm:text-sm dark:text-slate-400">
          Get the latest articles and tutorials delivered to your inbox.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <span>Subscribe</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Popular Authors (Placeholder) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#1A1A1C] dark:bg-[#111113] sm:p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-900 sm:mb-4 sm:text-lg dark:text-white">
          Popular Authors
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-[#1A1A1C]" />
              <div className="flex-1">
                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-[#1A1A1C]" />
                <div className="mt-1.5 h-2 w-16 rounded bg-slate-100 dark:bg-[#0A0A0C]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

