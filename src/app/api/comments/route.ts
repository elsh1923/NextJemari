import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { createComment, getArticleComments } from "@/actions/comments";

/**
 * GET /api/comments?articleId=xxx - Get comments for an article
 */
async function GET(req: NextRequest) {
  const articleId = req.nextUrl.searchParams.get("articleId");
  
  if (!articleId) {
    return NextResponse.json(
      { success: false, error: "articleId is required" },
      { status: 400 }
    );
  }

  const comments = await getArticleComments(articleId);

  return NextResponse.json({
    success: true,
    data: comments,
  });
}

/**
 * POST /api/comments - Create a new comment
 */
async function POST(req: NextRequest) {
  const body = await req.json();
  const comment = await createComment(body);

  return NextResponse.json({
    success: true,
    data: comment,
  });
}

export const GETHandler = withErrorHandling(GET);
export const POSTHandler = withErrorHandling(POST);

export { GETHandler as GET, POSTHandler as POST };
