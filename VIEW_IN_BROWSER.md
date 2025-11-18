# How to View Your Homepage in Browser

## Quick Start

### 1. Start the Development Server

Open your terminal in the project directory and run:

```bash
npm run dev
```

You should see output like:
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
- Ready in 2.3s
```

### 2. Open in Browser

Once the server is running, open your browser and go to:

```
http://localhost:3000
```

## What You'll See

The homepage includes:

✅ **Navigation Bar**
- Logo and site name
- Search bar
- Navigation links (Home, Articles, Tags)
- Authentication buttons

✅ **Hero Section**
- 3 featured articles in a grid
- Article cards with images, tags, and metadata

✅ **Article Feed**
- Latest articles list
- Article cards with:
  - Title and description
  - Author avatar and name
  - Publish date
  - Reading time
  - Like and comment counts
  - Tags

✅ **Sidebar**
- Trending tags
- Newsletter subscribe form
- Popular authors

## Testing Dark Mode

To test dark mode:

1. **Automatic**: If your system is set to dark mode, the site will automatically use dark theme
2. **Manual**: Add `dark` class to the `<html>` tag in browser DevTools

Or add a theme toggle button (we can add this later).

## Troubleshooting

### Server Won't Start

1. **Check if port 3000 is in use:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Kill the process if needed, or use a different port:
   npm run dev -- -p 3001
   ```

2. **Check for errors:**
   - Look at the terminal output
   - Check browser console (F12)

### Database Connection Error

If you see database errors:
1. Make sure your `.env` file has `DATABASE_URL`
2. Run: `npm run prisma:generate`
3. Check database is accessible

### No Articles Showing

This is normal if your database is empty! The homepage will show:
- Empty state messages
- "No articles yet" message

To test with data:
1. Create a test user via `/api/auth/register`
2. Create articles via `/api/articles` (POST)
3. Or use Prisma Studio: `npm run prisma:studio`

### Styling Issues

If Tailwind styles aren't working:
1. Make sure `globals.css` is imported in `layout.tsx` ✅ (already done)
2. Restart the dev server
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

## Browser DevTools

Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac) to:
- Inspect elements
- Check console for errors
- Test responsive design
- View network requests

## Next Steps

Once you see the homepage:

1. **Test Navigation** - Click links to see if they work
2. **Test Search** - Try searching (backend ready, may need frontend connection)
3. **Test Authentication** - Click "Sign In" or "Get Started"
4. **Create Test Data** - Add some articles to see them displayed

## Quick Test Commands

```bash
# Start dev server
npm run dev

# In another terminal, test API
curl http://localhost:3000/api/articles

# Open Prisma Studio to view database
npm run prisma:studio
```

---

**Your homepage is ready!** 🎉

Open `http://localhost:3000` in your browser to see it.

