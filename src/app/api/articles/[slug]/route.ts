import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { getArticleBySlug, updateArticle, deleteArticle } from "@/actions/articles";

/**
 * GET /api/articles/[slug] - Get article by slug
 */
async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const incrementViews = req.nextUrl.searchParams.get("incrementViews") === "true";
  const article = await getArticleBySlug(params.slug, incrementViews);

  if (!article) {
    return NextResponse.json(
      { success: false, error: "Article not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: article,
  });
}

/**
 * PUT /api/articles/[slug] - Update article
 */
async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const body = await req.json();
  const article = await updateArticle({ ...body, slug: params.slug });

  return NextResponse.json({
    success: true,
    data: article,
  });
}

/**
 * DELETE /api/articles/[slug] - Delete article
 */
async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  await deleteArticle(params.slug);

  return NextResponse.json({
    success: true,
    message: "Article deleted successfully",
  });
}

export const GETHandler = withErrorHandling(GET);
export const PUTHandler = withErrorHandling(PUT);
export const DELETEHandler = withErrorHandling(DELETE);

export { GETHandler as GET, PUTHandler as PUT, DELETEHandler as DELETE };

