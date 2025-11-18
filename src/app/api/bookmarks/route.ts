import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { toggleBookmark, hasBookmarked, getBookmarkedArticles, getBookmarkCount } from "@/actions/bookmarks";

/**
 * GET /api/bookmarks - Get user's bookmarked articles
 */
async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get("articleId");

  if (articleId) {
    // Check if specific article is bookmarked
    const bookmarked = await hasBookmarked(articleId);
    const count = await getBookmarkCount(articleId);

    return NextResponse.json({
      success: true,
      data: {
        bookmarked,
        count,
      },
    });
  }

  // Get all bookmarked articles
  const articles = await getBookmarkedArticles();

  return NextResponse.json({
    success: true,
    data: articles,
  });
}

/**
 * POST /api/bookmarks - Toggle bookmark on an article
 */
async function POST(req: NextRequest) {
  const { articleId } = await req.json();

  if (!articleId) {
    return NextResponse.json(
      { success: false, error: "articleId is required" },
      { status: 400 }
    );
  }

  const result = await toggleBookmark(articleId);

  return NextResponse.json({
    success: true,
    data: result,
  });
}

export const GETHandler = withErrorHandling(GET);
export const POSTHandler = withErrorHandling(POST);

export { GETHandler as GET, POSTHandler as POST };

