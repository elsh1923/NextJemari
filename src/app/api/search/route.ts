import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { searchArticles } from "@/actions/search";

/**
 * GET /api/search - Search articles
 */
async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  
  const result = await searchArticles({
    query: searchParams.get("q") || undefined,
    tags: searchParams.get("tags")?.split(",").filter(Boolean),
    authorId: searchParams.get("authorId") || undefined,
    published: searchParams.get("published") === "true" ? true : searchParams.get("published") === "false" ? false : undefined,
    sortBy: (searchParams.get("sortBy") as any) || "newest",
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "20"),
  });

  return NextResponse.json({
    success: true,
    data: result,
  });
}

export const GETHandler = withErrorHandling(GET);

export { GETHandler as GET };
