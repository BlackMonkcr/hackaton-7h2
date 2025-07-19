import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

const JWT_SECRET = env.JWT_SECRET;

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        firstName: z.string().min(1, "El nombre es requerido"),
        lastName: z.string().min(1, "El apellido es requerido"),
        username: z.string().min(3, "El username debe tener al menos 3 caracteres").optional(),
        // University specific fields (optional)
        university: z.string().optional(),
        studentId: z.string().optional(),
        career: z.string().optional(),
        semester: z.number().int().min(1).max(20).optional(),
        // Company specific fields (optional)
        companyName: z.string().optional(),
        position: z.string().optional(),
        industry: z.string().optional(),
        companySize: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user already exists
      const existingUser = await ctx.db.user.findFirst({
        where: {
          OR: [
            { email: input.email },
            { username: input.username ?? "" },
          ],
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "El usuario ya existe con ese email o username",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 12);

      // Create user
      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          firstName: input.firstName,
          lastName: input.lastName,
          username: input.username,
          university: input.university,
          studentId: input.studentId,
          career: input.career,
          semester: input.semester,
          companyName: input.companyName,
          position: input.position,
          industry: input.industry,
          companySize: input.companySize,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          university: true,
          career: true,
          companyName: true,
          position: true,
          createdAt: true,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Create session
      await ctx.db.userSession.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return {
        user,
        token,
        message: "Usuario registrado exitosamente",
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(1, "La contraseña es requerida"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Find user by email
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email o contraseña incorrectos",
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(input.password, user.password);

      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email o contraseña incorrectos",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Create session
      await ctx.db.userSession.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Update last login
      await ctx.db.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      const userResponse = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        university: user.university,
        career: user.career,
        companyName: user.companyName,
        position: user.position,
        createdAt: user.createdAt,
        lastLoginAt: new Date(),
      };

      return {
        user: userResponse,
        token,
        message: "Login exitoso",
      };
    }),

  logout: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Find and delete the session
      const session = await ctx.db.userSession.findUnique({
        where: { token: input.token },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sesión no encontrada",
        });
      }

      // Delete the session
      await ctx.db.userSession.delete({
        where: { token: input.token },
      });

      return {
        message: "Logout exitoso",
      };
    }),

  me: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Verify JWT token
        const decoded = jwt.verify(input.token, JWT_SECRET) as {
          userId: string;
          email: string;
        };

        // Check if session exists and is not expired
        const session = await ctx.db.userSession.findFirst({
          where: {
            token: input.token,
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
                profileImage: true,
                university: true,
                studentId: true,
                career: true,
                semester: true,
                companyName: true,
                position: true,
                industry: true,
                companySize: true,
                timezone: true,
                language: true,
                createdAt: true,
                lastLoginAt: true,
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

        return {
          user: session.user,
          message: "Usuario autenticado",
        };
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token inválido",
          });
        }
        throw error;
      }
    }),

  refreshToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify current token
        const decoded = jwt.verify(input.token, JWT_SECRET) as {
          userId: string;
          email: string;
        };

        // Find current session
        const currentSession = await ctx.db.userSession.findUnique({
          where: { token: input.token },
        });

        if (!currentSession) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Sesión no encontrada",
          });
        }

        // Generate new token
        const newToken = jwt.sign(
          { userId: decoded.userId, email: decoded.email },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        // Update session with new token
        await ctx.db.userSession.update({
          where: { token: input.token },
          data: {
            token: newToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        });

        return {
          token: newToken,
          message: "Token renovado exitosamente",
        };
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token inválido",
          });
        }
        throw error;
      }
    }),

  updateProfile: publicProcedure
    .input(
      z.object({
        token: z.string(),
        firstName: z.string().min(1, "El nombre es requerido").optional(),
        lastName: z.string().min(1, "El apellido es requerido").optional(),
        username: z.string().min(3, "El username debe tener al menos 3 caracteres").optional(),
        profileImage: z.string().url().optional(),
        university: z.string().optional(),
        studentId: z.string().optional(),
        career: z.string().optional(),
        semester: z.number().int().min(1).max(20).optional(),
        companyName: z.string().optional(),
        position: z.string().optional(),
        industry: z.string().optional(),
        companySize: z.number().int().positive().optional(),
        timezone: z.string().optional(),
        language: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify JWT token
        const decoded = jwt.verify(input.token, JWT_SECRET) as {
          userId: string;
          email: string;
        };

        // Check if session exists
        const session = await ctx.db.userSession.findFirst({
          where: {
            token: input.token,
            userId: decoded.userId,
            expiresAt: {
              gt: new Date(),
            },
          },
        });

        if (!session) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token inválido o expirado",
          });
        }

        // Check if username is already taken (if provided)
        if (input.username) {
          const existingUser = await ctx.db.user.findFirst({
            where: {
              username: input.username,
              NOT: { id: decoded.userId },
            },
          });

          if (existingUser) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "El username ya está en uso",
            });
          }
        }

        // Update user profile
        const updatedUser = await ctx.db.user.update({
          where: { id: decoded.userId },
          data: {
            ...(input.firstName && { firstName: input.firstName }),
            ...(input.lastName && { lastName: input.lastName }),
            ...(input.username && { username: input.username }),
            ...(input.profileImage && { profileImage: input.profileImage }),
            ...(input.university !== undefined && { university: input.university }),
            ...(input.studentId !== undefined && { studentId: input.studentId }),
            ...(input.career !== undefined && { career: input.career }),
            ...(input.semester !== undefined && { semester: input.semester }),
            ...(input.companyName !== undefined && { companyName: input.companyName }),
            ...(input.position !== undefined && { position: input.position }),
            ...(input.industry !== undefined && { industry: input.industry }),
            ...(input.companySize !== undefined && { companySize: input.companySize }),
            ...(input.timezone && { timezone: input.timezone }),
            ...(input.language && { language: input.language }),
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
            university: true,
            studentId: true,
            career: true,
            semester: true,
            companyName: true,
            position: true,
            industry: true,
            companySize: true,
            timezone: true,
            language: true,
            createdAt: true,
            lastLoginAt: true,
          },
        });

        return {
          user: updatedUser,
          message: "Perfil actualizado exitosamente",
        };
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token inválido",
          });
        }
        throw error;
      }
    }),

  changePassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        currentPassword: z.string().min(1, "La contraseña actual es requerida"),
        newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify JWT token
        const decoded = jwt.verify(input.token, JWT_SECRET) as {
          userId: string;
          email: string;
        };

        // Check if session exists
        const session = await ctx.db.userSession.findFirst({
          where: {
            token: input.token,
            userId: decoded.userId,
            expiresAt: {
              gt: new Date(),
            },
          },
        });

        if (!session) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token inválido o expirado",
          });
        }

        // Get user with password
        const user = await ctx.db.user.findUnique({
          where: { id: decoded.userId },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Usuario no encontrado",
          });
        }

        // Verify current password
        const isValidCurrentPassword = await bcrypt.compare(
          input.currentPassword,
          user.password
        );

        if (!isValidCurrentPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "La contraseña actual es incorrecta",
          });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(input.newPassword, 12);

        // Update password
        await ctx.db.user.update({
          where: { id: decoded.userId },
          data: { password: hashedNewPassword },
        });

        return {
          message: "Contraseña actualizada exitosamente",
        };
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token inválido",
          });
        }
        throw error;
      }
    }),
});
