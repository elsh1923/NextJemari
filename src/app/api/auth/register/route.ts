import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { register } from "@/actions/auth";

/**
 * POST /api/auth/register - Register a new user
 */
async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await register(body);

  return NextResponse.json({
    success: true,
    data: user,
    message: "User registered successfully",
  });
}

export const POSTHandler = withErrorHandling(POST);

export { POSTHandler as POST };
