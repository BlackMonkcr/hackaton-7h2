import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { db } from "~/server/db";

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
}

export async function validateAuthToken(token: string): Promise<AuthenticatedUser> {
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      email: string;
    };

    // Check if session exists and is not expired
    const session = await db.userSession.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    if (!session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Token inválido o expirado",
      });
    }

    return session.user;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Token inválido",
      });
    }
    throw error;
  }
}
