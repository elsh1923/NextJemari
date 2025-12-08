"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";
import { randomBytes } from "crypto";

const reportSchema = z.object({
  articleId: z.string(),
  reason: z.string().min(1, "Reason is required").max(500, "Reason is too long"),
});

export async function reportArticle(articleId: string, reason: string) {
  try {
    const user = await requireAuth();

    const validated = reportSchema.parse({ articleId, reason });

    await prisma.report.create({
      data: {
        id: randomBytes(16).toString("hex"),
        articleId: validated.articleId,
        reason: validated.reason,
        reporterId: (user as any).id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to report article:", error);
    throw new Error("Failed to submit report");
  }
}
