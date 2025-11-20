"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:scale-[1.02] dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group/btn w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-slate-800 hover:scale-105 hover:shadow-lg disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
      >
        <span className="inline-block transition-transform duration-300 group-hover/btn:translate-y-[-1px]">
          {loading ? "Signing in..." : "Sign In"}
        </span>
      </button>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
          Sign up
        </Link>
      </div>
    </form>
  );
}

