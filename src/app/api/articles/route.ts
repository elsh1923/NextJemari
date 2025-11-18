import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { getArticles, createArticle } from "@/actions/articles";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/articles - Get list of articles
 */
async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  
  const articles = await getArticles({
    published: searchParams.get("published") === "true" ? true : searchParams.get("published") === "false" ? false : undefined,
    authorId: searchParams.get("authorId") || undefined,
    tagSlug: searchParams.get("tag") || undefined,
    sortBy: (searchParams.get("sortBy") as any) || "newest",
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "20"),
  });

  return NextResponse.json({
    success: true,
    data: articles,
  });
}

/**
 * POST /api/articles - Create a new article
 */
async function POST(req: NextRequest) {
  await requireAuth();
  const body = await req.json();
  const article = await createArticle(body);
  
  return NextResponse.json({
    success: true,
    data: article,
  });
}

export const GETHandler = withErrorHandling(GET);
export const POSTHandler = withErrorHandling(POST);

export { GETHandler as GET, POSTHandler as POST };
