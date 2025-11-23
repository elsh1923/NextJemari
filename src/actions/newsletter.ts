"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Validate email
    const validated = subscribeSchema.parse({ email });

    // Check if email already exists
    const existing = await prisma.subscriber.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existing) {
      return {
        success: false,
        message: "This email is already subscribed!",
      };
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email: validated.email.toLowerCase(),
      },
    });

    return {
      success: true,
      message: "Successfully subscribed! Check your inbox for confirmation.",
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "Failed to subscribe. Please try again later.",
    };
  }
}
