import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { updateComment, deleteComment, getCommentById } from "@/actions/comments";

/**
 * GET /api/comments/[id] - Get comment by ID
 */
async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const comment = await getCommentById(params.id);

  if (!comment) {
    return NextResponse.json(
      { success: false, error: "Comment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: comment,
  });
}

/**
 * PUT /api/comments/[id] - Update comment
 */
async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const comment = await updateComment({ ...body, id: params.id });

  return NextResponse.json({
    success: true,
    data: comment,
  });
}

/**
 * DELETE /api/comments/[id] - Delete comment
 */
async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await deleteComment(params.id);

  return NextResponse.json({
    success: true,
    message: "Comment deleted successfully",
  });
}

export const GETHandler = withErrorHandling(GET);
export const PUTHandler = withErrorHandling(PUT);
export const DELETEHandler = withErrorHandling(DELETE);

export { GETHandler as GET, PUTHandler as PUT, DELETEHandler as DELETE };

