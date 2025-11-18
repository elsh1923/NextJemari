import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/users - Not implemented
 * Use /api/users/[username] or /api/users/me instead
 */
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { success: false, error: "Use /api/users/[username] or /api/users/me" },
    { status: 404 }
  );
}

