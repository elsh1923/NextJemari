import { NextRequest, NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";
import { requireAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

/**
 * POST /api/upload - Upload image to Cloudinary
 */
async function POST(req: NextRequest) {
  await requireAuth();

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string || "nextjemari";
  const type = formData.get("type") as string || "general";

  if (!file) {
    return NextResponse.json(
      { success: false, error: "No file provided" },
      { status: 400 }
    );
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { success: false, error: "File must be an image" },
      { status: 400 }
    );
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { success: false, error: "File size must be less than 10MB" },
      { status: 400 }
    );
  }

  try {
    const uploadFolder = `${folder}/${type}`;
    let options: any = {};

    // Optimize based on type
    if (type === "avatar") {
      options = {
        width: 400,
        height: 400,
        quality: 80,
        format: "auto",
      };
    } else if (type === "cover") {
      options = {
        width: 1200,
        height: 630,
        quality: 85,
        format: "auto",
      };
    } else {
      options = {
        quality: 85,
        format: "auto",
      };
    }

    const url = await uploadImage(file, uploadFolder, options);

    return NextResponse.json({
      success: true,
      data: {
        url,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload image",
      },
      { status: 500 }
    );
  }
}

export const POSTHandler = withErrorHandling(POST);

export { POSTHandler as POST };

