"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function Navigation() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-[#1A1A1C] dark:bg-[#0A0A0C]/80 animate-[slide-in-down_0.5s_ease-out]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group/logo flex items-center space-x-2 transition-all duration-500 hover:scale-110 hover:drop-shadow-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 transition-all duration-500 hover:rotate-12 hover:scale-110 hover:shadow-lg dark:bg-white">
              <span className="text-lg font-bold text-white transition-all duration-300 dark:text-slate-900">N</span>
            </div>
            <span className="text-xl font-semibold text-slate-900 transition-all duration-300 dark:text-white">
              Nextjemari
            </span>
          </Link>

          {/* Desktop Navigation Links - Separated from logo */}
          <div className="hidden items-center space-x-8 md:flex md:ml-16">
            <Link
              href="/"
              className="relative text-sm font-medium text-slate-600 transition-all duration-300 hover:text-slate-900 hover:scale-110 dark:text-slate-400 dark:hover:text-slate-100 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
            <Link
              href="/articles"
              className="relative text-sm font-medium text-slate-600 transition-all duration-300 hover:text-slate-900 hover:scale-110 dark:text-slate-400 dark:hover:text-slate-100 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              Articles
            </Link>
            <Link
              href="/tags"
              className="relative text-sm font-medium text-slate-600 transition-all duration-300 hover:text-slate-900 hover:scale-110 dark:text-slate-400 dark:hover:text-slate-100 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              Tags
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 items-center justify-center px-4 lg:flex lg:px-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="group relative w-full max-w-md"
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-blue-500 group-focus-within:scale-110" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="group w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm placeholder-slate-400 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:scale-105 focus:shadow-lg dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400"
              />
            </form>
          </div>

          {/* Auth Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            {session ? (
              <>
                <Link href="/write">
                  <Button variant="ghost" size="sm">
                    Write
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => signIn()}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => signIn()}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-900 dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 text-slate-900 dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 py-4 dark:border-[#1A1A1C] md:hidden">
            {/* Mobile Search */}
            <div className="mb-4 px-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setMobileMenuOpen(false);
                  }
                }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100 dark:placeholder-slate-500"
                />
              </form>
            </div>
            <div className="space-y-4 px-4">
              <Link
                href="/"
                className="block text-sm font-medium text-slate-600 dark:text-slate-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/articles"
                className="block text-sm font-medium text-slate-600 dark:text-slate-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                href="/tags"
                className="block text-sm font-medium text-slate-600 dark:text-slate-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tags
              </Link>
              {session ? (
                <>
                  <Link
                    href="/write"
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Write
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      signIn();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      signIn();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

