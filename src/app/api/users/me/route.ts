import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { getCurrentUserProfile, updateProfile } from "@/actions/users";

/**
 * GET /api/users/me - Get current user profile
 */
async function GET(req: NextRequest) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: profile,
  });
}

/**
 * PUT /api/users/me - Update current user profile
 */
async function PUT(req: NextRequest) {
  const body = await req.json();
  const profile = await updateProfile(body);

  return NextResponse.json({
    success: true,
    data: profile,
  });
}

export const GETHandler = withErrorHandling(GET);
export const PUTHandler = withErrorHandling(PUT);

export { GETHandler as GET, PUTHandler as PUT };

