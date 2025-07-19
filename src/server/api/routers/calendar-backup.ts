import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import { validateAuthToken } from "~/server/api/auth-utils";

// Helper function to create OAuth2 client with environment variables
function createOAuth2Client() {
  return new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
  );
}

// Helper function to get calendar client with oauth2 client
function getCalendarClient(oauth2Client: OAuth2Client) {
  return google.calendar({ version: "v3", auth: oauth2Client });
}

// Schemas for validation
const eventSchema = z.object({
  summary: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  location: z.string().optional(),
  startDateTime: z.string().datetime("Formato de fecha inválido"),
  endDateTime: z.string().datetime("Formato de fecha inválido"),
  timezone: z.string().default("America/Lima"),
  attendees: z.array(z.string().email()).optional(),
  reminders: z.object({
    useDefault: z.boolean().default(false),
    overrides: z.array(z.object({
      method: z.enum(["email", "popup"]),
      minutes: z.number().int().min(0)
    })).optional()
  }).optional(),
  recurrence: z.array(z.string()).optional(), // RRULE format
  colorId: z.string().optional(),
});

export const calendarRouter = createTRPCRouter({
  // Get Google OAuth URL for authorization
  getAuthUrl: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input }) => {
      // Validate user authentication
      await validateAuthToken(input.token);

      // Create OAuth2 client with environment variables
      const oauth2Client = createOAuth2Client();

      const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ];

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
      });

      return {
        authUrl,
        message: "URL de autorización generada exitosamente",
      };
    }),

  // Exchange authorization code for access token
  exchangeCodeForTokens: publicProcedure
    .input(
      z.object({
        token: z.string(),
        code: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      try {
        const oauth2Client = createOAuth2Client();
        const { tokens } = await oauth2Client.getToken(input.code);
        
        if (!tokens.access_token || !tokens.refresh_token) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No se pudieron obtener los tokens de Google",
          });
        }

        // Store tokens in database (you might want to encrypt these)
        await ctx.db.user.update({
          where: { id: user.id },
          data: {
            // Add these fields to your User model if not present
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token,
            googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
          },
        });

        return {
          message: "Autenticación con Google Calendar exitosa",
        };
      } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al autenticar con Google Calendar",
        });
      }
    }),

  // Get user's Google Calendar events
  getEvents: publicProcedure
    .input(
      z.object({
        token: z.string(),
        calendarId: z.string().default("primary"),
        timeMin: z.string().datetime().optional(),
        timeMax: z.string().datetime().optional(),
        maxResults: z.number().int().min(1).max(2500).default(250),
        singleEvents: z.boolean().default(true),
        orderBy: z.enum(["startTime", "updated"]).default("startTime"),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      // Get user's Google tokens from database
      const userWithTokens = await ctx.db.user.findUnique({
        where: { id: user.id },
        select: {
          googleAccessToken: true,
          googleRefreshToken: true,
          googleTokenExpiry: true,
        },
      });

      if (!userWithTokens?.googleAccessToken || !userWithTokens?.googleRefreshToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No hay tokens de Google Calendar. Debe autenticarse primero.",
        });
      }

      try {
        // Set credentials
        oauth2Client.setCredentials({
          access_token: userWithTokens.googleAccessToken,
          refresh_token: userWithTokens.googleRefreshToken,
          expiry_date: userWithTokens.googleTokenExpiry?.getTime(),
        });

        // Check if token needs refresh
        const now = new Date();
        if (userWithTokens.googleTokenExpiry && userWithTokens.googleTokenExpiry <= now) {
          const { credentials } = await oauth2Client.refreshAccessToken();
          oauth2Client.setCredentials(credentials);
          
          // Update tokens in database
          await ctx.db.user.update({
            where: { id: user.id },
            data: {
              googleAccessToken: credentials.access_token,
              googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
            },
          });
        }

        const response = await calendar.events.list({
          calendarId: input.calendarId,
          timeMin: input.timeMin,
          timeMax: input.timeMax,
          maxResults: input.maxResults,
          singleEvents: input.singleEvents,
          orderBy: input.orderBy,
        });

        return {
          events: response.data.items || [],
          message: "Eventos obtenidos exitosamente",
        };
      } catch (error) {
        console.error("Error getting Google Calendar events:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al obtener eventos de Google Calendar",
        });
      }
    }),

  // Create a new event in Google Calendar
  createEvent: publicProcedure
    .input(
      z.object({
        token: z.string(),
        calendarId: z.string().default("primary"),
        event: eventSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      // Get user's Google tokens
      const userWithTokens = await ctx.db.user.findUnique({
        where: { id: user.id },
        select: {
          googleAccessToken: true,
          googleRefreshToken: true,
          googleTokenExpiry: true,
        },
      });

      if (!userWithTokens?.googleAccessToken || !userWithTokens?.googleRefreshToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No hay tokens de Google Calendar. Debe autenticarse primero.",
        });
      }

      try {
        // Set credentials
        oauth2Client.setCredentials({
          access_token: userWithTokens.googleAccessToken,
          refresh_token: userWithTokens.googleRefreshToken,
          expiry_date: userWithTokens.googleTokenExpiry?.getTime(),
        });

        // Refresh token if needed
        const now = new Date();
        if (userWithTokens.googleTokenExpiry && userWithTokens.googleTokenExpiry <= now) {
          const { credentials } = await oauth2Client.refreshAccessToken();
          oauth2Client.setCredentials(credentials);
          
          await ctx.db.user.update({
            where: { id: user.id },
            data: {
              googleAccessToken: credentials.access_token,
              googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
            },
          });
        }

        const eventData = {
          summary: input.event.summary,
          description: input.event.description,
          location: input.event.location,
          start: {
            dateTime: input.event.startDateTime,
            timeZone: input.event.timezone,
          },
          end: {
            dateTime: input.event.endDateTime,
            timeZone: input.event.timezone,
          },
          attendees: input.event.attendees?.map(email => ({ email })),
          reminders: input.event.reminders,
          recurrence: input.event.recurrence,
          colorId: input.event.colorId,
        };

        const response = await calendar.events.insert({
          calendarId: input.calendarId,
          requestBody: eventData,
        });

        return {
          event: response.data,
          message: "Evento creado exitosamente",
        };
      } catch (error) {
        console.error("Error creating Google Calendar event:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al crear evento en Google Calendar",
        });
      }
    }),

  // Update an existing event in Google Calendar
  updateEvent: publicProcedure
    .input(
      z.object({
        token: z.string(),
        calendarId: z.string().default("primary"),
        eventId: z.string(),
        event: eventSchema.partial(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      // Get user's Google tokens
      const userWithTokens = await ctx.db.user.findUnique({
        where: { id: user.id },
        select: {
          googleAccessToken: true,
          googleRefreshToken: true,
          googleTokenExpiry: true,
        },
      });

      if (!userWithTokens?.googleAccessToken || !userWithTokens?.googleRefreshToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No hay tokens de Google Calendar. Debe autenticarse primero.",
        });
      }

      try {
        oauth2Client.setCredentials({
          access_token: userWithTokens.googleAccessToken,
          refresh_token: userWithTokens.googleRefreshToken,
          expiry_date: userWithTokens.googleTokenExpiry?.getTime(),
        });

        // Refresh token if needed
        const now = new Date();
        if (userWithTokens.googleTokenExpiry && userWithTokens.googleTokenExpiry <= now) {
          const { credentials } = await oauth2Client.refreshAccessToken();
          oauth2Client.setCredentials(credentials);
          
          await ctx.db.user.update({
            where: { id: user.id },
            data: {
              googleAccessToken: credentials.access_token,
              googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
            },
          });
        }

        // Get existing event first
        const existingEvent = await calendar.events.get({
          calendarId: input.calendarId,
          eventId: input.eventId,
        });

        // Merge with updates
        const eventData = {
          ...existingEvent.data,
          ...(input.event.summary && { summary: input.event.summary }),
          ...(input.event.description !== undefined && { description: input.event.description }),
          ...(input.event.location !== undefined && { location: input.event.location }),
          ...(input.event.startDateTime && {
            start: {
              dateTime: input.event.startDateTime,
              timeZone: input.event.timezone || existingEvent.data.start?.timeZone,
            },
          }),
          ...(input.event.endDateTime && {
            end: {
              dateTime: input.event.endDateTime,
              timeZone: input.event.timezone || existingEvent.data.end?.timeZone,
            },
          }),
          ...(input.event.attendees && {
            attendees: input.event.attendees.map(email => ({ email })),
          }),
          ...(input.event.reminders && { reminders: input.event.reminders }),
          ...(input.event.recurrence && { recurrence: input.event.recurrence }),
          ...(input.event.colorId && { colorId: input.event.colorId }),
        };

        const response = await calendar.events.update({
          calendarId: input.calendarId,
          eventId: input.eventId,
          requestBody: eventData,
        });

        return {
          event: response.data,
          message: "Evento actualizado exitosamente",
        };
      } catch (error) {
        console.error("Error updating Google Calendar event:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al actualizar evento en Google Calendar",
        });
      }
    }),

  // Delete an event from Google Calendar
  deleteEvent: publicProcedure
    .input(
      z.object({
        token: z.string(),
        calendarId: z.string().default("primary"),
        eventId: z.string(),
        sendUpdates: z.enum(["all", "externalOnly", "none"]).default("all"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      // Get user's Google tokens
      const userWithTokens = await ctx.db.user.findUnique({
        where: { id: user.id },
        select: {
          googleAccessToken: true,
          googleRefreshToken: true,
          googleTokenExpiry: true,
        },
      });

      if (!userWithTokens?.googleAccessToken || !userWithTokens?.googleRefreshToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No hay tokens de Google Calendar. Debe autenticarse primero.",
        });
      }

      try {
        oauth2Client.setCredentials({
          access_token: userWithTokens.googleAccessToken,
          refresh_token: userWithTokens.googleRefreshToken,
          expiry_date: userWithTokens.googleTokenExpiry?.getTime(),
        });

        // Refresh token if needed
        const now = new Date();
        if (userWithTokens.googleTokenExpiry && userWithTokens.googleTokenExpiry <= now) {
          const { credentials } = await oauth2Client.refreshAccessToken();
          oauth2Client.setCredentials(credentials);
          
          await ctx.db.user.update({
            where: { id: user.id },
            data: {
              googleAccessToken: credentials.access_token,
              googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
            },
          });
        }

        await calendar.events.delete({
          calendarId: input.calendarId,
          eventId: input.eventId,
          sendUpdates: input.sendUpdates,
        });

        return {
          message: "Evento eliminado exitosamente",
        };
      } catch (error) {
        console.error("Error deleting Google Calendar event:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al eliminar evento de Google Calendar",
        });
      }
    }),

  // Get list of user's calendars
  getCalendars: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      const userWithTokens = await ctx.db.user.findUnique({
        where: { id: user.id },
        select: {
          googleAccessToken: true,
          googleRefreshToken: true,
          googleTokenExpiry: true,
        },
      });

      if (!userWithTokens?.googleAccessToken || !userWithTokens?.googleRefreshToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No hay tokens de Google Calendar. Debe autenticarse primero.",
        });
      }

      try {
        oauth2Client.setCredentials({
          access_token: userWithTokens.googleAccessToken,
          refresh_token: userWithTokens.googleRefreshToken,
          expiry_date: userWithTokens.googleTokenExpiry?.getTime(),
        });

        // Refresh token if needed
        const now = new Date();
        if (userWithTokens.googleTokenExpiry && userWithTokens.googleTokenExpiry <= now) {
          const { credentials } = await oauth2Client.refreshAccessToken();
          oauth2Client.setCredentials(credentials);
          
          await ctx.db.user.update({
            where: { id: user.id },
            data: {
              googleAccessToken: credentials.access_token,
              googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
            },
          });
        }

        const response = await calendar.calendarList.list();

        return {
          calendars: response.data.items || [],
          message: "Calendarios obtenidos exitosamente",
        };
      } catch (error) {
        console.error("Error getting Google Calendars:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al obtener calendarios de Google",
        });
      }
    }),

  // Sync Google Calendar events with local tasks
  syncWithTasks: publicProcedure
    .input(
      z.object({
        token: z.string(),
        projectId: z.string(),
        calendarId: z.string().default("primary"),
        timeMin: z.string().datetime().optional(),
        timeMax: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      // Verify user has access to the project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          OR: [
            { ownerId: user.id },
            { members: { some: { userId: user.id } } },
          ],
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes acceso a este proyecto",
        });
      }

      try {
        // Get Google Calendar events
        const eventsResponse = await calendar.events.list({
          calendarId: input.calendarId,
          timeMin: input.timeMin,
          timeMax: input.timeMax,
          singleEvents: true,
          orderBy: "startTime",
        });

        const events = eventsResponse.data.items || [];
        const syncedTasks = [];

        // Create tasks from calendar events
        for (const event of events) {
          if (event.summary && event.start?.dateTime && event.end?.dateTime) {
            // Check if task already exists (by checking if summary contains event ID)
            const existingTask = await ctx.db.task.findFirst({
              where: {
                projectId: input.projectId,
                description: { contains: `[GoogleCalendar:${event.id}]` },
              },
            });

            if (!existingTask) {
              const task = await ctx.db.task.create({
                data: {
                  title: event.summary,
                  description: `${event.description || ""}\n[GoogleCalendar:${event.id}]`,
                  projectId: input.projectId,
                  createdById: user.id,
                  startDate: new Date(event.start.dateTime),
                  dueDate: new Date(event.end.dateTime),
                  status: "PENDING",
                  taskType: "PROJECT",
                },
              });
              syncedTasks.push(task);
            }
          }
        }

        return {
          syncedTasks,
          message: `Se sincronizaron ${syncedTasks.length} eventos como tareas`,
        };
      } catch (error) {
        console.error("Error syncing Google Calendar with tasks:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al sincronizar calendario con tareas",
        });
      }
    }),

  // Disconnect Google Calendar
  disconnectGoogle: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      try {
        // Remove Google tokens from database
        await ctx.db.user.update({
          where: { id: user.id },
          data: {
            googleAccessToken: null,
            googleRefreshToken: null,
            googleTokenExpiry: null,
          },
        });

        return {
          message: "Desconectado de Google Calendar exitosamente",
        };
      } catch (error) {
        console.error("Error disconnecting Google Calendar:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al desconectar Google Calendar",
        });
      }
    }),
});
