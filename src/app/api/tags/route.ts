import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { getAllTags, getPopularTags, getTagBySlug } from "@/actions/tags";

/**
 * GET /api/tags - Get all tags or popular tags
 */
async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get("slug");
  const popular = searchParams.get("popular") === "true";
  const limit = parseInt(searchParams.get("limit") || "20");

  if (slug) {
    const tag = await getTagBySlug(slug);
    if (!tag) {
      return NextResponse.json(
        { success: false, error: "Tag not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: tag,
    });
  }

  if (popular) {
    const tags = await getPopularTags(limit);
    return NextResponse.json({
      success: true,
      data: tags,
    });
  }

  const tags = await getAllTags();
  return NextResponse.json({
    success: true,
    data: tags,
  });
}

export const GETHandler = withErrorHandling(GET);

export { GETHandler as GET };
