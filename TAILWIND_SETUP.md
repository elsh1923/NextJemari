# Tailwind CSS Setup - Nextjemari

## ✅ Tailwind CSS is Fully Configured

Your project is using **Tailwind CSS v4** with the following setup:

### Configuration Files

1. **`tailwind.config.ts`** - Tailwind configuration
   - Content paths configured for `src/` directory
   - Dark mode enabled with `class` strategy
   - Custom fonts (Geist Sans & Mono)
   - Extended color palette

2. **`postcss.config.mjs`** - PostCSS configuration
   - Uses `@tailwindcss/postcss` plugin for v4

3. **`src/app/globals.css`** - Global styles
   - Tailwind imports
   - Custom CSS variables
   - Dark mode support
   - Custom utilities (line-clamp, transitions, code blocks)

### Features

✅ **Dark Mode Support**
- Automatic dark mode with `dark:` prefix
- Custom dark theme colors (#0A0A0C background)

✅ **Custom Utilities**
- `.line-clamp-2` and `.line-clamp-3` for text truncation
- Smooth transitions on all elements
- Styled code blocks with JetBrains Mono font

✅ **Color Palette**
- Light mode: Slate colors (#F8FAFC background, #E2E8F0 borders)
- Dark mode: Deep blacks (#0A0A0C) with subtle gradients
- Accent: Blue (#3B82F6)

✅ **Typography**
- Inter/Geist Sans for UI text
- JetBrains Mono for code snippets
- Responsive font sizes

### Usage in Components

All components are already using Tailwind classes:

```tsx
// Example from ArticleCard
<div className="rounded-xl border border-slate-200 bg-white dark:bg-[#111113]">
  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
    Title
  </h3>
</div>
```

### Available Tailwind Classes

- **Spacing**: `p-4`, `m-2`, `gap-6`, `space-x-4`
- **Colors**: `bg-slate-50`, `text-slate-900`, `border-slate-200`
- **Dark Mode**: `dark:bg-[#0A0A0C]`, `dark:text-white`
- **Typography**: `text-xl`, `font-semibold`, `leading-relaxed`
- **Layout**: `flex`, `grid`, `grid-cols-3`, `gap-6`
- **Effects**: `rounded-xl`, `shadow-lg`, `hover:shadow-xl`
- **Transitions**: `transition-all`, `duration-200`

### Custom Colors

```css
/* Light Mode */
bg-slate-50        /* Background */
text-slate-900     /* Primary text */
border-slate-200   /* Borders */
bg-blue-600        /* Accent */

/* Dark Mode */
dark:bg-[#0A0A0C]  /* Background */
dark:text-white    /* Primary text */
dark:border-[#1A1A1C] /* Borders */
dark:bg-blue-400   /* Accent */
```

### Responsive Design

Tailwind's responsive breakpoints are available:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

### Next Steps

1. ✅ Tailwind is ready to use
2. ✅ All components use Tailwind classes
3. ✅ Dark mode is configured
4. ✅ Custom utilities are available

**You're all set!** Start building with Tailwind CSS. 🎨

