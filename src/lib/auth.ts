import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UnauthorizedError, ForbiddenError } from "@/types";
import { UserRole } from "@prisma/client";

/**
 * Get the current session user
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error: any) {
    // Handle JWT decryption errors
    if (error?.message?.includes("decryption") || error?.message?.includes("JWT")) {
      console.warn("Session error:", error.message);
      return null;
    }
    throw error;
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError("You must be logged in to perform this action");
  }
  return user;
}

/**
 * Require specific role - throws if user doesn't have required role
 */
export async function requireRole(requiredRole: UserRole) {
  const user = await requireAuth();
  const roleHierarchy: Record<UserRole, number> = {
    USER: 1,
    MODERATOR: 2,
    ADMIN: 3,
  };

  const userRoleLevel = roleHierarchy[user.role || "USER"];
  const requiredRoleLevel = roleHierarchy[requiredRole];

  if (userRoleLevel < requiredRoleLevel) {
    throw new ForbiddenError(
      `This action requires ${requiredRole} role or higher`
    );
  }

  return user;
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  try {
    const user = await requireAuth();
    return user.role === "ADMIN";
  } catch {
    return false;
  }
}

/**
 * Check if user is moderator or admin
 */
export async function isModerator() {
  try {
    const user = await requireAuth();
    return user.role === "MODERATOR" || user.role === "ADMIN";
  } catch {
    return false;
  }
}

/**
 * Check if user owns a resource
 */
export function isOwner(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId;
}

/**
 * Check if user can edit a resource (owner or admin/moderator)
 */
export async function canEdit(
  userId: string,
  resourceUserId: string
): Promise<boolean> {
  if (isOwner(userId, resourceUserId)) return true;
  const moderator = await isModerator();
  return moderator;
}

