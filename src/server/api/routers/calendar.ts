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

// Helper function to setup and refresh OAuth2 client with user tokens
async function setupOAuth2ClientWithUserTokens(
  userId: string,
  ctx: any
): Promise<OAuth2Client> {
  // Get user's Google tokens from database
  const userWithTokens = await ctx.db.user.findUnique({
    where: { id: userId },
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

  const oauth2Client = createOAuth2Client();

  // Set credentials
  oauth2Client.setCredentials({
    access_token: userWithTokens.googleAccessToken,
    refresh_token: userWithTokens.googleRefreshToken,
    expiry_date: userWithTokens.googleTokenExpiry?.getTime(),
  });

  // Check if token needs refresh
  const now = new Date();
  if (userWithTokens.googleTokenExpiry && userWithTokens.googleTokenExpiry <= now) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);

      // Update tokens in database
      await ctx.db.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: credentials.access_token,
          googleTokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
        },
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Error al renovar token de Google. Debe autenticarse nuevamente.",
      });
    }
  }

  return oauth2Client;
}

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

        // Store tokens in database
        await ctx.db.user.update({
          where: { id: user.id },
          data: {
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
        timeMin: z.string().optional(),
        timeMax: z.string().optional(),
        maxResults: z.number().int().min(1).max(2500).default(250),
        singleEvents: z.boolean().default(true),
        orderBy: z.enum(["startTime", "updated"]).default("startTime"),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      try {
        const oauth2Client = await setupOAuth2ClientWithUserTokens(user.id, ctx);
        const calendar = getCalendarClient(oauth2Client);

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
        if (error instanceof TRPCError) {
          throw error;
        }
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
        event: z.object({
          summary: z.string().min(1, "El título es requerido"),
          description: z.string().optional(),
          location: z.string().optional(),
          startDateTime: z.string(),
          endDateTime: z.string(),
          timezone: z.string().default("America/Lima"),
          attendees: z.array(z.string().email()).optional(),
          reminders: z.object({
            useDefault: z.boolean().default(false),
            overrides: z.array(z.object({
              method: z.enum(["email", "popup"]),
              minutes: z.number().int().min(0)
            })).optional()
          }).optional(),
          recurrence: z.array(z.string()).optional(),
          colorId: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      try {
        const oauth2Client = await setupOAuth2ClientWithUserTokens(user.id, ctx);
        const calendar = getCalendarClient(oauth2Client);

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
        if (error instanceof TRPCError) {
          throw error;
        }
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
        event: z.object({
          summary: z.string().min(1, "El título es requerido").optional(),
          description: z.string().optional(),
          location: z.string().optional(),
          startDateTime: z.string().optional(),
          endDateTime: z.string().optional(),
          timezone: z.string().default("America/Lima").optional(),
          attendees: z.array(z.string().email()).optional(),
          reminders: z.object({
            useDefault: z.boolean().default(false),
            overrides: z.array(z.object({
              method: z.enum(["email", "popup"]),
              minutes: z.number().int().min(0)
            })).optional()
          }).optional(),
          recurrence: z.array(z.string()).optional(),
          colorId: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      try {
        const oauth2Client = await setupOAuth2ClientWithUserTokens(user.id, ctx);
        const calendar = getCalendarClient(oauth2Client);

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
        if (error instanceof TRPCError) {
          throw error;
        }
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

      try {
        const oauth2Client = await setupOAuth2ClientWithUserTokens(user.id, ctx);
        const calendar = getCalendarClient(oauth2Client);

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
        if (error instanceof TRPCError) {
          throw error;
        }
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

      try {
        const oauth2Client = await setupOAuth2ClientWithUserTokens(user.id, ctx);
        const calendar = getCalendarClient(oauth2Client);

        const response = await calendar.calendarList.list();

        return {
          calendars: response.data.items || [],
          message: "Calendarios obtenidos exitosamente",
        };
      } catch (error) {
        console.error("Error getting Google Calendars:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al obtener calendarios de Google",
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

  // Check connection status
  getConnectionStatus: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      const dbUser = await ctx.db.user.findUnique({
        where: { id: user.id },
        select: {
          googleAccessToken: true,
          googleRefreshToken: true,
          googleTokenExpiry: true,
        },
      });

      const isConnected = !!dbUser?.googleAccessToken;
      const hasRefreshToken = !!dbUser?.googleRefreshToken;
      const tokenExpired = dbUser?.googleTokenExpiry
        ? new Date() > dbUser.googleTokenExpiry
        : false;

      return {
        isConnected,
        hasRefreshToken,
        tokenExpired,
        tokenExpiry: dbUser?.googleTokenExpiry,
      };
    }),

  // Extract all calendars with events in JSON format
  extractCalendarsWithEvents: publicProcedure
    .input(
      z.object({
        token: z.string(),
        timeMin: z.string().optional(),
        timeMax: z.string().optional(),
        maxResults: z.number().optional().default(100),
        includeSecondary: z.boolean().optional().default(true),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      try {
        const oauth2Client = await setupOAuth2ClientWithUserTokens(user.id, ctx);
        const calendar = getCalendarClient(oauth2Client);

        // Get all calendars
        const calendarsResponse = await calendar.calendarList.list();
        const calendars = calendarsResponse.data.items || [];

        const calendarData = [];

        for (const cal of calendars) {
          if (!cal.id) continue;

          // Skip secondary calendars if not requested
          if (!input.includeSecondary && cal.accessRole !== 'owner') {
            continue;
          }

          try {
            // Get events for this calendar
            const eventsResponse = await calendar.events.list({
              calendarId: cal.id,
              timeMin: input.timeMin || new Date().toISOString(),
              timeMax: input.timeMax,
              maxResults: input.maxResults,
              singleEvents: true,
              orderBy: 'startTime',
            });

            const events = (eventsResponse.data.items || []).map(event => ({
              id: event.id,
              summary: event.summary || 'Sin título',
              description: event.description || '',
              location: event.location || '',
              start: {
                dateTime: event.start?.dateTime,
                date: event.start?.date,
                timeZone: event.start?.timeZone,
              },
              end: {
                dateTime: event.end?.dateTime,
                date: event.end?.date,
                timeZone: event.end?.timeZone,
              },
              created: event.created,
              updated: event.updated,
              status: event.status,
              creator: {
                email: event.creator?.email,
                displayName: event.creator?.displayName,
              },
              organizer: {
                email: event.organizer?.email,
                displayName: event.organizer?.displayName,
              },
              attendees: event.attendees?.map(attendee => ({
                email: attendee.email,
                displayName: attendee.displayName,
                responseStatus: attendee.responseStatus,
              })) || [],
              recurrence: event.recurrence || [],
              reminders: {
                useDefault: event.reminders?.useDefault || false,
                overrides: event.reminders?.overrides || [],
              },
              visibility: event.visibility,
              transparency: event.transparency,
            }));

            calendarData.push({
              calendar: {
                id: cal.id,
                summary: cal.summary || 'Sin nombre',
                description: cal.description || '',
                primary: cal.primary || false,
                accessRole: cal.accessRole,
                timeZone: cal.timeZone,
                backgroundColor: cal.backgroundColor,
                foregroundColor: cal.foregroundColor,
                selected: cal.selected,
              },
              events: events,
              eventCount: events.length,
            });
          } catch (eventError) {
            console.error(`Error getting events for calendar ${cal.id}:`, eventError);
            // Continue with other calendars even if one fails
            calendarData.push({
              calendar: {
                id: cal.id,
                summary: cal.summary || 'Sin nombre',
                description: cal.description || '',
                primary: cal.primary || false,
                accessRole: cal.accessRole,
                timeZone: cal.timeZone,
                backgroundColor: cal.backgroundColor,
                foregroundColor: cal.foregroundColor,
                selected: cal.selected,
              },
              events: [],
              eventCount: 0,
              error: 'No se pudieron obtener los eventos para este calendario',
            });
          }
        }

        return {
          success: true,
          totalCalendars: calendarData.length,
          extractedAt: new Date().toISOString(),
          timeRange: {
            min: input.timeMin || new Date().toISOString(),
            max: input.timeMax || null,
          },
          calendars: calendarData,
        };
      } catch (error) {
        console.error("Error extracting calendars with events:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error al extraer calendarios: ${error instanceof Error ? error.message : "Error desconocido"}`,
        });
      }
    }),
});
