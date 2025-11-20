import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:scale-105 active:scale-95",
          {
            // Variants
            "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg focus:ring-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100":
              variant === "default",
            "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-blue-300 hover:shadow-md focus:ring-slate-900 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-300 dark:hover:bg-[#1A1A1C] dark:hover:border-blue-500/50":
              variant === "outline",
            "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-900 dark:text-slate-300 dark:hover:bg-[#1A1A1C] dark:hover:text-white":
              variant === "ghost",
            // Sizes
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

