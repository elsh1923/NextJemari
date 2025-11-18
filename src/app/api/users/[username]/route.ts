import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { getUserProfile } from "@/actions/users";
import { getUserArticles } from "@/actions/articles";

/**
 * GET /api/users/[username] - Get user profile
 */
async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const includeArticles = req.nextUrl.searchParams.get("articles") === "true";
  
  const profile = await getUserProfile(params.username);

  if (!profile) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  const data: any = { profile };

  if (includeArticles) {
    const articles = await getUserArticles(params.username, false);
    data.articles = articles;
  }

  return NextResponse.json({
    success: true,
    data,
  });
}

export const GETHandler = withErrorHandling(GET);

export { GETHandler as GET };

