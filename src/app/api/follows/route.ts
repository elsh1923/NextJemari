import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { toggleFollow, isFollowing, getFollowerCount, getFollowingCount } from "@/actions/follows";

/**
 * POST /api/follows - Toggle follow on a user
 */
async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "userId is required" },
      { status: 400 }
    );
  }

  const result = await toggleFollow(userId);

  return NextResponse.json({
    success: true,
    data: result,
  });
}

/**
 * GET /api/follows?userId=xxx&action=check|count
 */
async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const action = req.nextUrl.searchParams.get("action") || "check";

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "userId is required" },
      { status: 400 }
    );
  }

  if (action === "check") {
    const following = await isFollowing(userId);
    return NextResponse.json({
      success: true,
      data: { following },
    });
  }

  if (action === "count") {
    const [followerCount, followingCount] = await Promise.all([
      getFollowerCount(userId),
      getFollowingCount(userId),
    ]);
    return NextResponse.json({
      success: true,
      data: { followerCount, followingCount },
    });
  }

  return NextResponse.json(
    { success: false, error: "Invalid action" },
    { status: 400 }
  );
}

export const POSTHandler = withErrorHandling(POST);
export const GETHandler = withErrorHandling(GET);

export { POSTHandler as POST, GETHandler as GET };

