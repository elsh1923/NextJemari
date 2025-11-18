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
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            // Variants
            "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100":
              variant === "default",
            "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-900 dark:border-[#1A1A1C] dark:bg-[#111113] dark:text-slate-300 dark:hover:bg-[#1A1A1C]":
              variant === "outline",
            "text-slate-700 hover:bg-slate-100 focus:ring-slate-900 dark:text-slate-300 dark:hover:bg-[#1A1A1C]":
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

