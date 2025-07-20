import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { validateAuthToken } from "~/server/api/auth-utils";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { env } from "~/env";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

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

// Schema para el nuevo formato de IA
const TaskAISchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string(),
  prioridad: z.enum(["alta", "media", "baja"]),
  responsable_principal: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  hora_inicio: z.string(),
  hora_fin: z.string(),
  duracion_horas: z.number(),
  dependencias: z.array(z.string()),
  tipo_tarea: z.enum(["desarrollo", "diseño", "testing", "reunion", "investigacion"]),
  estado: z.string(),
});

const EventCalendarSchema = z.object({
  titulo: z.string(),
  descripcion: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  responsable: z.string(),
  tipo: z.enum(["tarea", "reunion", "milestone"]),
  tarea_relacionada: z.string().optional(),
});

const RiesgoAISchema = z.object({
  descripcion: z.string(),
  probabilidad: z.enum(["alta", "media", "baja"]),
  mitigacion: z.string(),
  responsable_seguimiento: z.string(),
});

const NewProjectAISchema = z.object({
  titulo: z.string(),
  descripcion: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  duracion_semanas: z.number(),
  personal_disponible: z.array(z.string()),
  rubro: z.string(),
  tareas: z.array(TaskAISchema),
  cronograma_diario: z.record(z.array(z.object({
    tarea_id: z.string(),
    responsable: z.string(),
    hora_inicio: z.string(),
    hora_fin: z.string(),
    actividad: z.string(),
  }))),
  eventos_calendar: z.array(EventCalendarSchema),
  asignacion_semanal: z.record(z.record(z.object({
    horas_totales: z.number(),
    tareas_asignadas: z.array(z.string()),
  }))),
  riesgos_identificados: z.array(RiesgoAISchema),
  resumen_estrategia: z.string(),
});

// Schema para los datos de entrada del formulario
const ProjectFormDataSchema = z.object({
  titulo_proyecto: z.string(),
  descripcion_proyecto: z.string(),
  fecha_inicio: z.string(),
  semanas_requeridas: z.number(),
  personal_disponible: z.string(),
  rubro_laboral: z.string(),
  tareas_resolver: z.string(),
  prioridad_tareas: z.string(),
  presupuesto: z.string(),
  restricciones: z.string().optional(),
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

// Función para crear proyecto fallback si la IA falla
function createFallbackProject(formData: z.infer<typeof ProjectFormDataSchema>): z.infer<typeof NewProjectAISchema> {
  const startDate = new Date(formData.fecha_inicio);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + (formData.semanas_requeridas * 7));

  // Crear tareas básicas basadas en las tareas a resolver
  const tareas = formData.tareas_resolver.split(',').map((tarea, index) => {
    const taskStartDate = new Date(startDate);
    taskStartDate.setDate(startDate.getDate() + (index * 3)); // 3 días entre tareas

    const taskEndDate = new Date(taskStartDate);
    taskEndDate.setDate(taskStartDate.getDate() + 2); // 2 días de duración

    return {
      id: `tarea_${String(index + 1).padStart(3, '0')}`,
      nombre: tarea.trim(),
      descripcion: `Desarrollo de ${tarea.trim().toLowerCase()}`,
      prioridad: index < 2 ? "alta" as const : "media" as const,
      responsable_principal: "Equipo de desarrollo",
      fecha_inicio: taskStartDate.toISOString().split('T')[0]!,
      fecha_fin: taskEndDate.toISOString().split('T')[0]!,
      hora_inicio: "09:00",
      hora_fin: "17:00",
      duracion_horas: 16,
      dependencias: index > 0 ? [`tarea_${String(index).padStart(3, '0')}`] : [],
      tipo_tarea: "desarrollo" as const,
      estado: "pendiente",
    };
  });

  return {
    titulo: formData.titulo_proyecto,
    descripcion: formData.descripcion_proyecto,
    fecha_inicio: formData.fecha_inicio,
    fecha_fin: endDate.toISOString().split('T')[0]!,
    duracion_semanas: formData.semanas_requeridas,
    personal_disponible: formData.personal_disponible.split(',').map(p => p.trim()),
    rubro: formData.rubro_laboral,
    tareas,
    cronograma_diario: tareas.reduce((acc, tarea) => {
      acc[tarea.fecha_inicio] = [{
        tarea_id: tarea.id,
        responsable: tarea.responsable_principal,
        hora_inicio: tarea.hora_inicio,
        hora_fin: tarea.hora_fin,
        actividad: tarea.descripcion,
      }];
      return acc;
    }, {} as Record<string, any[]>),
    eventos_calendar: [
      {
        titulo: "Inicio del proyecto",
        descripcion: `Inicio del proyecto: ${formData.titulo_proyecto}`,
        fecha_inicio: new Date(startDate.getTime() + 9 * 60 * 60 * 1000).toISOString(),
        fecha_fin: new Date(startDate.getTime() + 10 * 60 * 60 * 1000).toISOString(),
        responsable: "equipo@proyecto.com",
        tipo: "reunion" as const,
      },
      {
        titulo: "Entrega del proyecto",
        descripcion: `Entrega final del proyecto: ${formData.titulo_proyecto}`,
        fecha_inicio: new Date(endDate.getTime() + 14 * 60 * 60 * 1000).toISOString(),
        fecha_fin: new Date(endDate.getTime() + 16 * 60 * 60 * 1000).toISOString(),
        responsable: "equipo@proyecto.com",
        tipo: "milestone" as const,
      },
    ],
    asignacion_semanal: {
      semana_1: {
        "Equipo": { horas_totales: 40, tareas_asignadas: tareas.slice(0, 2).map(t => t.id) }
      }
    },
    riesgos_identificados: [
      {
        descripcion: "Retrasos en el desarrollo",
        probabilidad: "media" as const,
        mitigacion: "Seguimiento diario y revisiones regulares",
        responsable_seguimiento: "Project Manager",
      }
    ],
    resumen_estrategia: `Proyecto generado automáticamente con estructura básica. Se recomienda revisar y ajustar según las necesidades específicas del proyecto.`,
  };
}

// Función mejorada para generar proyecto con IA de Azure
async function generateProjectWithAzureAI(formData: z.infer<typeof ProjectFormDataSchema>): Promise<z.infer<typeof NewProjectAISchema>> {
  // Verificar configuración de Azure
  if (!env.AZURE_INFERENCE_SDK_ENDPOINT || !env.AZURE_INFERENCE_SDK_KEY) {
    console.warn("⚠️ Azure AI not configured, using fallback project");
    return createFallbackProject(formData);
  }

  try {
    const client = ModelClient(
      env.AZURE_INFERENCE_SDK_ENDPOINT,
      new AzureKeyCredential(env.AZURE_INFERENCE_SDK_KEY)
    );

    console.log("🚀 Generating project with Azure AI");
    console.log("📋 Project:", formData.titulo_proyecto);

    // Prompt más simple y directo
    const systemPrompt = `You are a project planner. Generate ONLY valid JSON for a project plan. Do not add any text, thinking tags, or explanations outside the JSON.`;

    const userPrompt = `Create a project plan for:
Title: ${formData.titulo_proyecto}
Description: ${formData.descripcion_proyecto}
Start: ${formData.fecha_inicio}
Duration: ${formData.semanas_requeridas} weeks
Team: ${formData.personal_disponible}
Industry: ${formData.rubro_laboral}
Tasks: ${formData.tareas_resolver}
Budget: ${formData.presupuesto}

Respond with this exact JSON structure (replace example values):
{
  "titulo": "${formData.titulo_proyecto}",
  "descripcion": "${formData.descripcion_proyecto}",
  "fecha_inicio": "${formData.fecha_inicio}",
  "fecha_fin": "CALCULATE_END_DATE",
  "duracion_semanas": ${formData.semanas_requeridas},
  "personal_disponible": ["Team Member 1", "Team Member 2"],
  "rubro": "${formData.rubro_laboral}",
  "tareas": [
    {
      "id": "tarea_001",
      "nombre": "Task Name",
      "descripcion": "Task Description",
      "prioridad": "alta",
      "responsable_principal": "Responsible Person",
      "fecha_inicio": "${formData.fecha_inicio}",
      "fecha_fin": "2025-02-03",
      "hora_inicio": "09:00",
      "hora_fin": "17:00",
      "duracion_horas": 8,
      "dependencias": [],
      "tipo_tarea": "desarrollo",
      "estado": "pendiente"
    }
  ],
  "cronograma_diario": {
    "${formData.fecha_inicio}": [
      {
        "tarea_id": "tarea_001",
        "responsable": "Team Member",
        "hora_inicio": "09:00",
        "hora_fin": "17:00",
        "actividad": "Specific activity"
      }
    ]
  },
  "eventos_calendar": [
    {
      "titulo": "Project Kickoff",
      "descripcion": "Project start meeting",
      "fecha_inicio": "${formData.fecha_inicio}T09:00:00",
      "fecha_fin": "${formData.fecha_inicio}T10:00:00",
      "responsable": "team@project.com",
      "tipo": "reunion"
    }
  ],
  "asignacion_semanal": {
    "semana_1": {
      "Team Member": {"horas_totales": 40, "tareas_asignadas": ["tarea_001"]}
    }
  },
  "riesgos_identificados": [
    {
      "descripcion": "Risk description",
      "probabilidad": "media",
      "mitigacion": "Mitigation plan",
      "responsable_seguimiento": "Risk owner"
    }
  ],
  "resumen_estrategia": "Project strategy summary"
}`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const response = await client.path("/chat/completions").post({
      body: {
        messages: messages,
        max_tokens: 3000,
        model: env.AZURE_DEPLOYMENT_NAME ?? "gpt-4",
        temperature: 0.1,
        top_p: 0.8,
      },
    });

    console.log("📡 Response status:", response.status);

    if (response.status !== "200") {
      console.error("❌ Azure AI error, status:", response.status);
      return createFallbackProject(formData);
    }

    const responseBody = response.body;

    // Type guard para verificar si es una respuesta exitosa
    if (response.status !== "200" || !responseBody || 'error' in responseBody) {
      console.error("❌ Error response from Azure AI:", responseBody);
      return createFallbackProject(formData);
    }

    const content = responseBody.choices?.[0]?.message?.content;

    console.log("📝 Content received:", !!content);
    console.log("📝 Content length:", content?.length || 0);

    if (!content?.trim()) {
      console.error("❌ Empty response from AI");
      return createFallbackProject(formData);
    }

    // Limpieza exhaustiva del contenido
    let cleanContent = content.trim();

    // Remover thinking tags
    cleanContent = cleanContent.replace(/<think>[\s\S]*?<\/think>/gi, '');
    cleanContent = cleanContent.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');

    // Remover markdown
    cleanContent = cleanContent.replace(/^```json\s*/gim, '');
    cleanContent = cleanContent.replace(/^```\s*/gim, '');
    cleanContent = cleanContent.replace(/```\s*$/gim, '');

    // Extraer JSON
    const jsonStart = cleanContent.indexOf('{');
    const jsonEnd = cleanContent.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("❌ No JSON found in response");
      console.error("📝 Content:", cleanContent.substring(0, 500));
      return createFallbackProject(formData);
    }

    cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);

    console.log("🧹 Cleaned content preview:", cleanContent.substring(0, 200));

    try {
      const parsedResponse = JSON.parse(cleanContent);
      const validatedResponse = NewProjectAISchema.parse(parsedResponse);
      console.log("✅ AI project generated successfully");
      return validatedResponse;
    } catch (parseError) {
      console.error("❌ JSON parse/validation error:", parseError);
      console.log("🔄 Using fallback project");
      return createFallbackProject(formData);
    }

  } catch (error) {
    console.error("❌ Azure AI error:", error);
    console.log("🔄 Using fallback project");
    return createFallbackProject(formData);
  }
}

// Función para generar proyecto con IA de Azure
async function generateProjectWithAI(formData: z.infer<typeof ProjectFormDataSchema>): Promise<z.infer<typeof NewProjectAISchema>> {
  const client = ModelClient(
    env.AZURE_INFERENCE_SDK_ENDPOINT ?? "https://testr14493970923.services.ai.azure.com/models",
    new AzureKeyCredential(env.AZURE_INFERENCE_SDK_KEY ?? "YOUR_KEY_HERE")
  );

  const systemPrompt = `Eres un planificador de proyectos experto especializado en Startup. Genera ÚNICAMENTE una respuesta JSON válida sin texto adicional, etiquetas de thinking, o explicaciones.

**Contexto del proyecto:**
- Título: ${formData.titulo_proyecto}
- Descripción: ${formData.descripcion_proyecto}
- Fecha inicio: ${formData.fecha_inicio}
- Semanas: ${formData.semanas_requeridas}
- Personal: ${formData.personal_disponible}
- Rubro: ${formData.rubro_laboral}
- Tareas: ${formData.tareas_resolver}
- Prioridades: ${formData.prioridad_tareas}
- Presupuesto: ${formData.presupuesto}
- Restricciones: ${formData.restricciones || "Ninguna"}

**Reglas obligatorias:**
- Fechas específicas (YYYY-MM-DD) basadas en ${formData.fecha_inicio}
- Horarios exactos (HH:MM)
- Máximo 8 horas por persona por día
- Distribuir tareas equilibradamente
- Identificar dependencias críticas
- Incluir análisis de riesgos

**CRÍTICO:** Responde SOLO con JSON válido. No uses <think>, <thinking>, explicaciones, o markdown.`;

  const userPrompt = `IMPORTANTE: Tu respuesta DEBE ser ÚNICAMENTE un JSON válido. No agregues texto adicional, explicaciones, bloques de código markdown, ni etiquetas de thinking. Solo el JSON estructurado.

NO uses <think>, <thinking>, o cualquier otra etiqueta.
NO agregues explicaciones antes o después del JSON.
NO uses bloques de código con \`\`\`.

Responde DIRECTAMENTE con este JSON (reemplaza los valores de ejemplo):

{
  "titulo": "${formData.titulo_proyecto}",
  "descripcion": "${formData.descripcion_proyecto}",
  "fecha_inicio": "${formData.fecha_inicio}",
  "fecha_fin": "YYYY-MM-DD",
  "duracion_semanas": ${formData.semanas_requeridas},
  "personal_disponible": ["${formData.personal_disponible.split(',').join('", "')}"],
  "rubro": "${formData.rubro_laboral}",
  "tareas": [
    {
      "id": "tarea_001",
      "nombre": "Nombre de la tarea",
      "descripcion": "Descripción detallada de la tarea",
      "prioridad": "alta",
      "responsable_principal": "Nombre del responsable",
      "fecha_inicio": "${formData.fecha_inicio}",
      "fecha_fin": "YYYY-MM-DD",
      "hora_inicio": "09:00",
      "hora_fin": "17:00",
      "duracion_horas": 8,
      "dependencias": [],
      "tipo_tarea": "desarrollo",
      "estado": "pendiente"
    }
  ],
  "cronograma_diario": {
    "${formData.fecha_inicio}": [
      {
        "tarea_id": "tarea_001",
        "responsable": "Nombre del responsable",
        "hora_inicio": "09:00",
        "hora_fin": "17:00",
        "actividad": "Descripción específica de la actividad"
      }
    ]
  },
  "eventos_calendar": [
    {
      "titulo": "Kick-off del proyecto",
      "descripcion": "Reunión inicial del proyecto",
      "fecha_inicio": "${formData.fecha_inicio}T09:00:00",
      "fecha_fin": "${formData.fecha_inicio}T10:00:00",
      "responsable": "project.manager@email.com",
      "tipo": "reunion",
      "tarea_relacionada": "tarea_001"
    }
  ],
  "asignacion_semanal": {
    "semana_1": {
      "Project Manager": {"horas_totales": 40, "tareas_asignadas": ["tarea_001"]}
    }
  },
  "riesgos_identificados": [
    {
      "descripcion": "Posible retraso en desarrollo",
      "probabilidad": "media",
      "mitigacion": "Revisiones semanales de progreso",
      "responsable_seguimiento": "Project Manager"
    }
  ],
  "resumen_estrategia": "Estrategia de implementación del proyecto"
}

Genera el JSON completo y detallado basado en los datos proporcionados. Recuerda: SOLO JSON, sin texto adicional.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  try {
    const response = await client.path("/chat/completions").post({
      body: {
        messages: messages,
        max_tokens: 4000,
        model: env.AZURE_DEPLOYMENT_NAME,
        temperature: 0.3, // Más bajo para mayor consistencia
        top_p: 0.8,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        stop: ["<think>", "<thinking>", "```"], // Parar si encuentra estas secuencias
      },
    });

    if (response.status !== "200") {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error en la respuesta de Azure AI",
      });
    }

    const responseBody = response.body as any;
    const content = responseBody?.choices?.[0]?.message?.content;

    console.log("Raw AI response status:", response.status);
    console.log("Raw AI response content (first 500 chars):", content?.substring(0, 500));

    if (!content) {
      console.error("Full response body:", JSON.stringify(responseBody, null, 2));
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No se recibió contenido de la IA",
      });
    }

    // Limpiar el contenido para asegurar que sea JSON válido
    let cleanContent = content.trim();

    // Remover bloques de código markdown
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.slice(7);
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith('```')) {
      cleanContent = cleanContent.slice(0, -3);
    }

    // Remover etiquetas de thinking de DeepSeek-R1
    cleanContent = cleanContent.replace(/<think>[\s\S]*?<\/think>/g, '');
    cleanContent = cleanContent.replace(/<thinking>[\s\S]*?<\/thinking>/g, '');

    // Remover texto antes y después del JSON
    const jsonStart = cleanContent.indexOf('{');
    const jsonEnd = cleanContent.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
      console.error("No se encontró JSON válido en la respuesta:", cleanContent.substring(0, 500));
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "La respuesta de la IA no contiene JSON válido",
      });
    }

    cleanContent = cleanContent.substring(jsonStart, jsonEnd + 1);
    cleanContent = cleanContent.trim();

    console.log("Contenido limpio para parsear:", cleanContent.substring(0, 200) + "...");

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Error parsing JSON, using fallback:", parseError);
      // Fallback con estructura básica
      const endDate = new Date(formData.fecha_inicio);
      endDate.setDate(endDate.getDate() + (formData.semanas_requeridas * 7));

      parsedResponse = {
        titulo: formData.titulo_proyecto,
        descripcion: formData.descripcion_proyecto,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: endDate.toISOString().split('T')[0],
        duracion_semanas: formData.semanas_requeridas,
        personal_disponible: formData.personal_disponible.split(',').map(p => p.trim()),
        rubro: formData.rubro_laboral,
        tareas: [
          {
            id: "tarea_001",
            nombre: "Planificación inicial del proyecto",
            descripcion: "Definir alcance y objetivos del proyecto",
            prioridad: "alta",
            responsable_principal: "Project Manager",
            fecha_inicio: formData.fecha_inicio,
            fecha_fin: formData.fecha_inicio,
            hora_inicio: "09:00",
            hora_fin: "17:00",
            duracion_horas: 8,
            dependencias: [],
            tipo_tarea: "reunion",
            estado: "pendiente"
          }
        ],
        cronograma_diario: {
          [formData.fecha_inicio]: [
            {
              tarea_id: "tarea_001",
              responsable: "Project Manager",
              hora_inicio: "09:00",
              hora_fin: "17:00",
              actividad: "Planificación inicial del proyecto"
            }
          ]
        },
        eventos_calendar: [
          {
            titulo: "Kick-off del proyecto",
            descripcion: `Reunión inicial para ${formData.titulo_proyecto}`,
            fecha_inicio: `${formData.fecha_inicio}T09:00:00`,
            fecha_fin: `${formData.fecha_inicio}T10:00:00`,
            responsable: "project.manager@email.com",
            tipo: "reunion",
            tarea_relacionada: "tarea_001"
          }
        ],
        asignacion_semanal: {
          semana_1: {
            "Project Manager": { horas_totales: 40, tareas_asignadas: ["tarea_001"] }
          }
        },
        riesgos_identificados: [
          {
            descripcion: "Posibles retrasos en la planificación inicial",
            probabilidad: "media",
            mitigacion: "Revisiones diarias de progreso",
            responsable_seguimiento: "Project Manager"
          }
        ],
        resumen_estrategia: `Proyecto ${formData.titulo_proyecto} generado con estructura básica. Se recomienda revisar y ajustar según necesidades específicas.`
      };
    }

    return NewProjectAISchema.parse(parsedResponse);

  } catch (error) {
    console.error("Error calling Azure AI:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Error generando proyecto con IA: ${error instanceof Error ? error.message : "Error desconocido"}`,
    });
  }
}

export const projectRouter = createTRPCRouter({
  // Generar proyecto con IA de Azure
  generateWithAI: publicProcedure
    .input(
      z.object({
        token: z.string(),
        formData: ProjectFormDataSchema,
        calendarName: z.string().optional(),
        useExistingCalendar: z.boolean().default(false),
        existingCalendarId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await validateAuthToken(input.token);

      try {
        // 1. Generar proyecto con IA
        const aiResponse = await generateProjectWithAzureAI(input.formData);

        // 2. Crear el proyecto en la base de datos
        const startDate = new Date(aiResponse.fecha_inicio);
        const endDate = new Date(aiResponse.fecha_fin);

        const project = await ctx.db.project.create({
          data: {
            name: aiResponse.titulo,
            description: aiResponse.descripcion,
            projectType: "STARTUP",
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

        // 3. Crear configuración del proyecto
        await ctx.db.projectConfiguration.create({
          data: {
            projectId: project.id,
            projectTitle: aiResponse.titulo,
            projectDescription: aiResponse.descripcion,
            requiredWeeks: aiResponse.duracion_semanas,
            availablePersonnel: aiResponse.personal_disponible.reduce((acc, person) => ({
              ...acc,
              [person]: 1
            }), {}),
            workSector: aiResponse.rubro,
            tasksToResolve: input.formData.tareas_resolver,
            tasksPriority: input.formData.prioridad_tareas,
            availableBudget: parseFloat(input.formData.presupuesto.replace(/[^0-9.-]+/g, "")) || 0,
            projectStartDate: startDate,
            projectEndDate: endDate,
            isComplete: true,
            generatedTasks: aiResponse,
            lastAIGeneration: new Date(),
          },
        });

        // 4. Crear tareas desde la respuesta de la IA
        const tasks = [];
        for (const tarea of aiResponse.tareas) {
          const task = await ctx.db.task.create({
            data: {
              title: tarea.nombre,
              description: tarea.descripcion,
              status: tarea.estado === "pendiente" ? "PENDING" : "PENDING",
              priority: tarea.prioridad === "alta" ? "HIGH" : tarea.prioridad === "media" ? "MEDIUM" : "LOW",
              taskType: "PROJECT",
              startDate: new Date(tarea.fecha_inicio),
              dueDate: new Date(tarea.fecha_fin),
              projectId: project.id,
              createdById: user.id,
              tags: [tarea.tipo_tarea, tarea.responsable_principal],
            },
          });
          tasks.push(task);
        }

        // 5. Crear milestones desde eventos de tipo milestone
        const milestones = [];
        for (const evento of aiResponse.eventos_calendar.filter(e => e.tipo === "milestone")) {
          const milestone = await ctx.db.milestone.create({
            data: {
              title: evento.titulo,
              description: evento.descripcion,
              dueDate: new Date(evento.fecha_inicio),
              projectId: project.id,
            },
          });
          milestones.push(milestone);
        }

        // 6. Crear o usar calendario de Google
        let calendarId = input.existingCalendarId || "primary";
        let eventsCreated = 0;

        if (!input.useExistingCalendar) {
          try {
            const oauth2Client = await setupOAuth2ClientWithUserTokens(user.id, ctx);
            const calendar = google.calendar({ version: "v3", auth: oauth2Client });

            const calendarName = input.calendarName || `📋 ${aiResponse.titulo}`;
            const newCalendar = await calendar.calendars.insert({
              requestBody: {
                summary: calendarName,
                description: `Calendario del proyecto: ${aiResponse.titulo}`,
                timeZone: "America/Lima",
              },
            });

            calendarId = newCalendar.data.id!;
          } catch (error) {
            console.warn("No se pudo crear calendario, usando principal:", error);
            calendarId = "primary";
          }
        }

        // 7. Sincronizar eventos con Google Calendar
        try {
          const oauth2Client = await setupOAuth2ClientWithUserTokens(user.id, ctx);
          const calendar = google.calendar({ version: "v3", auth: oauth2Client });

          for (const evento of aiResponse.eventos_calendar) {
            try {
              await calendar.events.insert({
                calendarId,
                requestBody: {
                  summary: evento.titulo,
                  description: evento.descripcion,
                  start: {
                    dateTime: evento.fecha_inicio,
                    timeZone: "America/Lima",
                  },
                  end: {
                    dateTime: evento.fecha_fin,
                    timeZone: "America/Lima",
                  },
                  colorId: evento.tipo === "tarea" ? "2" : evento.tipo === "reunion" ? "4" : "11",
                },
              });
              eventsCreated++;
            } catch (eventError) {
              console.warn(`Error creando evento ${evento.titulo}:`, eventError);
            }
          }
        } catch (calendarError) {
          console.warn("Error sincronizando con Google Calendar:", calendarError);
        }

        return {
          success: true,
          message: `Proyecto "${aiResponse.titulo}" generado y creado exitosamente`,
          project: {
            id: project.id,
            name: project.name,
            tasksCreated: tasks.length,
            milestonesCreated: milestones.length,
            calendarEventsCreated: eventsCreated,
            calendarId,
            aiResponse,
          },
        };

      } catch (error) {
        console.error("Error generating project with AI:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error generando proyecto: ${error instanceof Error ? error.message : "Error desconocido"}`,
        });
      }
    }),
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
