"use server";

import { hash, compare } from "bcrypt";
import prisma from "@/lib/prisma";
import { validateOrThrow, registerSchema, loginSchema } from "@/lib/validation";
import { ValidationError } from "@/types";
// Note: signIn should be called from client components using next-auth/react

/**
 * Register a new user
 */
export async function register(input: {
  email: string;
  username: string;
  password: string;
}): Promise<{ id: string; username: string; email: string }> {
  // Validate input
  const validated = validateOrThrow(registerSchema, input);

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: validated.email },
        { username: validated.username },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.email === validated.email) {
      throw new ValidationError("Email already registered");
    }
    if (existingUser.username === validated.username) {
      throw new ValidationError("Username already taken");
    }
  }

  // Hash password
  const passwordHash = await hash(validated.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: validated.email,
      username: validated.username,
      passwordHash,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

/**
 * Login user (returns session token)
 * Note: This is a server action wrapper - actual login should use NextAuth
 */
export async function login(input: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  // Validate input
  const validated = validateOrThrow(loginSchema, input);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (!user || !user.passwordHash) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  // Verify password
  const isValid = await compare(validated.password, user.passwordHash);
  if (!isValid) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  // Note: Actual authentication should be handled by NextAuth
  // This is just a validation helper
  return {
    success: true,
  };
}

/**
 * Verify password (for password changes, etc.)
 */
export async function verifyPassword(
  userId: string,
  password: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  if (!user || !user.passwordHash) {
    return false;
  }

  return await compare(password, user.passwordHash);
}

/**
 * Change password
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  // Verify current password
  const isValid = await verifyPassword(userId, currentPassword);
  if (!isValid) {
    return {
      success: false,
      error: "Current password is incorrect",
    };
  }

  // Validate new password
  if (newPassword.length < 8) {
    return {
      success: false,
      error: "New password must be at least 8 characters",
    };
  }

  // Hash new password
  const passwordHash = await hash(newPassword, 10);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return {
    success: true,
  };
}

/**
 * Check if email is available
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return !user;
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return !user;
}

