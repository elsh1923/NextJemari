"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Mail, ArrowRight } from "lucide-react";
import { TagWithCount } from "@/types";
import { subscribeToNewsletter } from "@/actions/newsletter";

interface SidebarProps {
  popularTags: TagWithCount[];
}

export function Sidebar({ popularTags }: SidebarProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await subscribeToNewsletter(email);
    
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
    
    if (result.success) {
      setEmail("");
    }
    
    setLoading(false);
  };

  return (
    <aside className="space-y-4 sm:space-y-6">
      {/* Trending Tags */}
      <div className="group/tags opacity-0 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] hover:border-blue-200 dark:border-[#1A1A1C] dark:bg-[#111113] dark:hover:border-blue-500/30 sm:p-6" style={{ animation: 'slide-in-right 0.6s ease-out 0.2s forwards' }}>
        <div className="mb-3 flex items-center space-x-2 sm:mb-4">
          <TrendingUp className="h-4 w-4 text-blue-600 transition-all duration-300 animate-[float_3s_ease-in-out_infinite] sm:h-5 sm:w-5 dark:text-blue-400" />
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
            Trending Tags
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {popularTags.slice(0, 10).map((tag, index) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="inline-block rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 hover:scale-110 hover:shadow-lg hover:-translate-y-0.5 dark:bg-[#1A1A1C] dark:text-slate-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
              style={{ animation: `slide-in-up 0.4s ease-out ${index * 0.05}s forwards`, opacity: 0 }}
            >
              {tag.name}
              <span className="ml-1.5 text-xs text-slate-500 transition-all duration-300 dark:text-slate-500">
                {tag._count.articles}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Subscribe */}
      <div className="group/newsletter opacity-0 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] hover:border-blue-200 dark:border-[#1A1A1C] dark:from-[#111113] dark:to-[#0A0A0C] dark:hover:border-blue-500/30 sm:p-6" style={{ animation: 'slide-in-right 0.6s ease-out 0.3s forwards' }}>
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg sm:mb-4 sm:h-12 sm:w-12 dark:bg-blue-500">
          <Mail className="h-5 w-5 text-white transition-all duration-300 sm:h-6 sm:w-6" />
        </div>
        <h3 className="mb-2 text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
          Stay Updated
        </h3>
        <p className="mb-3 text-xs text-slate-600 sm:mb-4 sm:text-sm dark:text-slate-400">
          Get the latest articles and tutorials delivered to your inbox.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100 dark:placeholder-slate-500"
          />
          {message && (
            <div className={`rounded-lg p-3 text-sm ${
              message.type === "success" 
                ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-400" 
                : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400"
            }`}>
              {message.text}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="group/btn flex w-full items-center justify-center space-x-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-slate-800 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <span>{loading ? "Subscribing..." : "Subscribe"}</span>
            {!loading && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />}
          </button>
        </form>
      </div>

      {/* Popular Authors (Placeholder) */}
      <div className="opacity-0 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] hover:border-blue-200 dark:border-[#1A1A1C] dark:bg-[#111113] dark:hover:border-blue-500/30 sm:p-6" style={{ animation: 'slide-in-right 0.6s ease-out 0.4s forwards' }}>
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

