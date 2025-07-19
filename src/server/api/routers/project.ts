import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { validateAuthToken } from "~/server/api/auth-utils";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { env } from "~/env";

// Schemas para validar el JSON de entrada
const TaskSchema = z.object({
  descripcion: z.string(),
  responsable: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
});

const FaseSchema = z.object({
  nombre: z.string(),
  duracion: z.string(),
  entregables: z.array(z.string()),
  tareas: z.array(TaskSchema),
});

const RevisionSchema = z.object({
  descripcion: z.string(),
  fecha: z.string(),
});

const RiesgoSchema = z.object({
  descripcion: z.string(),
  impacto: z.string(),
  mitigacion: z.string(),
});

const ProjectAISchema = z.object({
  proyecto: z.string(),
  fecha_inicio: z.string(),
  duracion_semanas: z.number(),
  equipo: z.record(z.union([z.string(), z.number()])),
  plan_trabajo: z.object({
    fases: z.array(FaseSchema),
    cronograma: z.object({
      revisiones: z.array(RevisionSchema),
    }),
  }),
  asignacion_recursos: z.object({
    presupuesto_distribucion: z.record(z.number()).optional(),
    horarios: z.record(z.array(z.string())).optional(),
  }),
  riesgos: z.array(RiesgoSchema),
});

// Helper para crear OAuth2 client
function createOAuth2Client() {
  return new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
  );
}

// Helper para configurar OAuth2 client con tokens del usuario
async function setupOAuth2ClientWithUserTokens(
  userId: string,
  ctx: any
): Promise<OAuth2Client> {
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
  oauth2Client.setCredentials({
    access_token: userWithTokens.googleAccessToken,
    refresh_token: userWithTokens.googleRefreshToken,
    expiry_date: userWithTokens.googleTokenExpiry?.getTime(),
  });

  // Verificar si el token necesita refresh
  const now = new Date();
  if (userWithTokens.googleTokenExpiry && userWithTokens.googleTokenExpiry <= now) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);

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

export const projectRouter = createTRPCRouter({
  // Crear proyecto desde JSON de IA y sincronizar con Google Calendar
  createFromAI: publicProcedure
    .input(
      z.object({
        token: z.string(),
        projectData: ProjectAISchema,
        calendarName: z.string().optional(),
        useExistingCalendar: z.boolean().default(false),
        existingCalendarId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Validar autenticación
      const user = await validateAuthToken(input.token);

      try {
        // 1. Crear el proyecto en la base de datos
        const startDate = new Date(input.projectData.fecha_inicio);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (input.projectData.duracion_semanas * 7));

        const project = await ctx.db.project.create({
          data: {
            name: input.projectData.proyecto,
            description: `Proyecto generado por IA - ${input.projectData.duracion_semanas} semanas`,
            projectType: "STARTUP", // Asumimos startup por el ejemplo
            category: "STARTUP_PRODUCT",
            startDate,
            endDate,
            ownerId: user.id,
            workflowType: "SIMPLE_DEADLINES",
            usesSprints: false,
            usesKanban: true,
            allowsSubtasks: true,
          },
        });

        // 2. Crear configuración del proyecto
        await ctx.db.projectConfiguration.create({
          data: {
            projectId: project.id,
            projectTitle: input.projectData.proyecto,
            projectDescription: input.projectData.proyecto,
            requiredWeeks: input.projectData.duracion_semanas,
            availablePersonnel: input.projectData.equipo,
            workSector: "Tecnología", // Valor por defecto
            tasksToResolve: "Tareas generadas por IA",
            tasksPriority: "Según cronograma de IA",
            availableBudget: Object.values(input.projectData.asignacion_recursos.presupuesto_distribucion || {}).reduce((a, b) => a + b, 0),
            projectStartDate: startDate,
            projectEndDate: endDate,
            isComplete: true,
            generatedTasks: input.projectData,
            lastAIGeneration: new Date(),
          },
        });

        // 3. Crear tareas desde las fases
        const tasks = [];
        for (const fase of input.projectData.plan_trabajo.fases) {
          for (const tarea of fase.tareas) {
            const task = await ctx.db.task.create({
              data: {
                title: tarea.descripcion,
                description: `Fase: ${fase.nombre}\nResponsable: ${tarea.responsable}`,
                status: "PENDING",
                priority: "MEDIUM",
                taskType: "PROJECT",
                startDate: new Date(tarea.fecha_inicio),
                dueDate: new Date(tarea.fecha_fin),
                projectId: project.id,
                createdById: user.id,
                tags: [fase.nombre, tarea.responsable],
              },
            });
            tasks.push(task);
          }
        }

        // 4. Crear milestones desde las revisiones
        for (const revision of input.projectData.plan_trabajo.cronograma.revisiones) {
          await ctx.db.milestone.create({
            data: {
              title: revision.descripcion,
              description: `Milestone generado por IA`,
              dueDate: new Date(revision.fecha),
              projectId: project.id,
            },
          });
        }

        // 5. Crear o usar calendario de Google
        let calendarId = input.existingCalendarId || "primary";

        if (!input.useExistingCalendar) {
          try {
            const oauth2Client = await setupOAuth2ClientWithUserTokens(user.id, ctx);
            const calendar = google.calendar({ version: "v3", auth: oauth2Client });

            // Crear nuevo calendario
            const calendarName = input.calendarName || `📋 ${input.projectData.proyecto}`;
            const newCalendar = await calendar.calendars.insert({
              requestBody: {
                summary: calendarName,
                description: `Calendario del proyecto: ${input.projectData.proyecto}`,
                timeZone: "America/Lima",
              },
            });

            calendarId = newCalendar.data.id!;
          } catch (error) {
            console.warn("No se pudo crear calendario, usando calendar principal:", error);
            calendarId = "primary";
          }
        }

        // 6. Sincronizar tareas con Google Calendar
        let eventsCreated = 0;
        try {
          const oauth2Client = await setupOAuth2ClientWithUserTokens(user.id, ctx);
          const calendar = google.calendar({ version: "v3", auth: oauth2Client });

          for (const task of tasks) {
            if (task.startDate && task.dueDate) {
              try {
                await calendar.events.insert({
                  calendarId,
                  requestBody: {
                    summary: task.title,
                    description: task.description || "",
                    start: {
                      dateTime: task.startDate.toISOString(),
                      timeZone: "America/Lima",
                    },
                    end: {
                      dateTime: task.dueDate.toISOString(),
                      timeZone: "America/Lima",
                    },
                    colorId: "2", // Verde para tareas del proyecto
                  },
                });
                eventsCreated++;
              } catch (eventError) {
                console.warn(`Error creando evento para tarea ${task.id}:`, eventError);
              }
            }
          }

          // Crear eventos para milestones
          for (const revision of input.projectData.plan_trabajo.cronograma.revisiones) {
            try {
              const revisionDate = new Date(revision.fecha);
              await calendar.events.insert({
                calendarId,
                requestBody: {
                  summary: `🎯 ${revision.descripcion}`,
                  description: `Milestone del proyecto: ${input.projectData.proyecto}`,
                  start: {
                    dateTime: revisionDate.toISOString(),
                    timeZone: "America/Lima",
                  },
                  end: {
                    dateTime: new Date(revisionDate.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas
                    timeZone: "America/Lima",
                  },
                  colorId: "11", // Rojo para milestones
                },
              });
              eventsCreated++;
            } catch (eventError) {
              console.warn(`Error creando evento para revisión:`, eventError);
            }
          }
        } catch (calendarError) {
          console.warn("Error sincronizando con Google Calendar:", calendarError);
        }

        return {
          success: true,
          message: `Proyecto "${input.projectData.proyecto}" creado exitosamente`,
          project: {
            id: project.id,
            name: project.name,
            tasksCreated: tasks.length,
            milestonesCreated: input.projectData.plan_trabajo.cronograma.revisiones.length,
            calendarEventsCreated: eventsCreated,
            calendarId,
          },
        };

      } catch (error) {
        console.error("Error creating project from AI:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error creando proyecto: ${error instanceof Error ? error.message : "Error desconocido"}`,
        });
      }
    }),

  // Listar proyectos del usuario
  getProjects: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      const projects = await ctx.db.project.findMany({
        where: { ownerId: user.id },
        include: {
          _count: {
            select: {
              tasks: true,
              milestones: true,
              members: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return {
        projects: projects.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
          projectType: project.projectType,
          category: project.category,
          tasksCount: project._count.tasks,
          milestonesCount: project._count.milestones,
          membersCount: project._count.members,
          createdAt: project.createdAt,
        })),
      };
    }),

  // Obtener detalles de un proyecto
  getProjectDetails: publicProcedure
    .input(
      z.object({
        token: z.string(),
        projectId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId },
        include: {
          tasks: {
            orderBy: { createdAt: "asc" },
          },
          milestones: {
            orderBy: { dueDate: "asc" },
          },
          configuration: true,
          members: {
            include: {
              user: {
                select: { firstName: true, lastName: true, email: true },
              },
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Proyecto no encontrado",
        });
      }

      // Verificar permisos
      const isMember = project.ownerId === user.id ||
        project.members.some(member => member.userId === user.id);

      if (!isMember) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No tienes permisos para ver este proyecto",
        });
      }

      return {
        project: {
          ...project,
          tasks: project.tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            dueDate: task.dueDate,
            tags: task.tags,
            completedAt: task.completedAt,
          })),
          milestones: project.milestones.map(milestone => ({
            id: milestone.id,
            title: milestone.title,
            description: milestone.description,
            dueDate: milestone.dueDate,
            isCompleted: milestone.isCompleted,
            completedAt: milestone.completedAt,
          })),
        },
      };
    }),
});
