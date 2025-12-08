import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UnauthorizedError } from "@/types";


// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      role: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    username: string;
    role: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
  }
}


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          role: "USER",
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {

        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

/**
 * Get the current authenticated user from the session
 * Throws UnauthorizedError if not authenticated
 */
export async function requireAuth() {
  const { getServerSession } = await import("next-auth");
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new UnauthorizedError("You must be logged in to perform this action");
  }

  return session.user;
}

/**
 * Get the current session (may be null)
 */
export async function getSession() {
  const { getServerSession } = await import("next-auth");
  return await getServerSession(authOptions);
}

/**
 * Get current user from session (may be null)
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Check if the current user can edit a resource
 * @param userId - The ID of the current user
 * @param resourceOwnerId - The ID of the resource owner
 * @returns true if the user can edit the resource
 */
export async function canEdit(
  userId: string,
  resourceOwnerId: string
): Promise<boolean> {
  // User can edit their own resources
  if (userId === resourceOwnerId) {
    return true;
  }

  // Check if user is admin or moderator
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "ADMIN" || user?.role === "MODERATOR";
}

/**
 * Check if the current user is an admin
 */
export async function requireAdmin() {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "ADMIN") {
    throw new UnauthorizedError("Admin access required");
  }

  return user;
}
