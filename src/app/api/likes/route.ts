import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { toggleLike, hasLiked, getLikeCount } from "@/actions/likes";

/**
 * POST /api/likes - Toggle like on an article
 */
async function POST(req: NextRequest) {
  const { articleId } = await req.json();

  if (!articleId) {
    return NextResponse.json(
      { success: false, error: "articleId is required" },
      { status: 400 }
    );
  }

  const result = await toggleLike(articleId);

  return NextResponse.json({
    success: true,
    data: result,
  });
}

/**
 * GET /api/likes?articleId=xxx - Check if user has liked and get count
 */
async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get("articleId");

  if (!articleId) {
    return NextResponse.json(
      { success: false, error: "articleId is required" },
      { status: 400 }
    );
  }

  const [liked, count] = await Promise.all([
    hasLiked(articleId),
    getLikeCount(articleId),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      liked,
      count,
    },
  });
}

export const GETHandler = withErrorHandling(GET);
export const POSTHandler = withErrorHandling(POST);

export { GETHandler as GET, POSTHandler as POST };
