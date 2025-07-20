/**
 * Prompt mejorado para distribución automática de tareas con Azure OpenAI
 * Basado en el calendario del usuario y configuración de proyecto
 */

export interface TaskDistributionPromptData {
  proyecto: string;
  descripcion: string | null;
  tareas: Array<{
    id: string;
    titulo: string;
    descripcion: string | null;
    prioridad: string;
    fechaVencimiento: Date | null;
    estimadoHoras: number;
    tags: string[];
  }>;
  configuracion: {
    workingHoursStart: string;
    workingHoursEnd: string;
    includeSaturdays: boolean;
    includeSundays: boolean;
    maxTaskDurationHours: number;
    bufferMinutes: number;
  };
  fechaInicio: string;
  fechaFin: string;
}

export interface CalendarEventFormatted {
  inicio: string | undefined;
  fin: string | undefined;
  zonaHoraria: string | undefined;
}

export function createTaskDistributionPrompt(
  projectData: TaskDistributionPromptData,
  calendarEvents: CalendarEventFormatted[],
  config: TaskDistributionPromptData['configuracion']
): string {
  return `
Eres un asistente de planificación de proyectos especializado en distribución inteligente de tareas. Tu objetivo es organizar las tareas del proyecto en bloques de tiempo que NO interfieran con el calendario existente del usuario.

**DATOS DEL PROYECTO:**
${JSON.stringify({
  proyecto: projectData.proyecto,
  descripcion: projectData.descripcion,
  tareas_pendientes: projectData.tareas.map(tarea => ({
    id: tarea.id,
    titulo: tarea.titulo,
    descripcion: tarea.descripcion,
    prioridad: tarea.prioridad,
    fecha_vencimiento: tarea.fechaVencimiento,
    horas_estimadas: tarea.estimadoHoras,
    etiquetas: tarea.tags
  })),
  configuracion_horaria: {
    hora_inicio_trabajo: config.workingHoursStart,
    hora_fin_trabajo: config.workingHoursEnd,
    incluir_sabados: config.includeSaturdays,
    incluir_domingos: config.includeSundays,
    duracion_maxima_tarea_horas: config.maxTaskDurationHours,
    buffer_minutos: config.bufferMinutes
  },
  periodo_planificacion: {
    fecha_inicio: projectData.fechaInicio,
    fecha_fin: projectData.fechaFin
  }
}, null, 2)}

**CALENDARIO EXISTENTE DEL USUARIO:**
${JSON.stringify({
  eventos_ocupados: calendarEvents.filter(event => event.inicio && event.fin),
  total_eventos: calendarEvents.length,
  instruccion_critica: "IMPORTANTE: Las tareas programadas NO deben solaparse con estos eventos existentes. Debe haber al menos el buffer especificado entre eventos."
}, null, 2)}

**INSTRUCCIONES ESPECÍFICAS:**

1. **ANÁLISIS DE DISPONIBILIDAD:**
   - Analiza todos los eventos existentes en el calendario del usuario
   - Identifica bloques de tiempo libres que cumplan con el horario laboral configurado
   - Respeta los días de la semana permitidos (lunes a viernes + configuración weekend)
   - Considera la zona horaria del usuario

2. **DISTRIBUCIÓN INTELIGENTE:**
   - Asigna las tareas de mayor prioridad (URGENT > HIGH > MEDIUM > LOW) a los mejores bloques de tiempo disponibles
   - Divide tareas grandes en sesiones más pequeñas si exceden la duración máxima configurada
   - Mantiene el buffer de tiempo especificado entre cada tarea y eventos existentes
   - Considera dependencias implícitas entre tareas (ej: diseño antes de desarrollo)
   - Agrupa tareas relacionadas por etiquetas cuando sea posible

3. **OPTIMIZACIÓN DEL CALENDARIO:**
   - Agrupa tareas relacionadas en días consecutivos cuando sea posible
   - Evita fragmentación excesiva del tiempo (prefiere bloques más largos)
   - Balancea la carga de trabajo a lo largo del período de planificación
   - Prioriza bloques de tiempo más largos para tareas complejas
   - Respeta fechas límite si están especificadas

4. **VALIDACIÓN DE CONFLICTOS:**
   - Verifica que ninguna tarea programada se solape con eventos existentes
   - Identifica posibles conflictos o ajustes necesarios
   - Propone alternativas si no hay suficiente tiempo disponible en el período

5. **CONSIDERACIONES ESPECIALES:**
   - Si una tarea tiene etiquetas como "frontend", "backend", "diseño", agrupa tareas similares
   - Para tareas con prioridad URGENT, busca los primeros slots disponibles
   - Para tareas de más de 4 horas, considera dividirlas en sesiones de trabajo
   - Incluye tiempo de descanso natural entre sesiones largas

**FORMATO DE SALIDA REQUERIDO (JSON únicamente):**
\`\`\`json
{
  "success": true,
  "scheduled_tasks": [
    {
      "task_id": "string",
      "task_title": "string",
      "start_date_time": "YYYY-MM-DDTHH:MM:SS.000Z",
      "end_date_time": "YYYY-MM-DDTHH:MM:SS.000Z",
      "estimated_hours": number,
      "priority": "string",
      "assigned_to": "Usuario Principal",
      "session_number": number,
      "dependencies": ["array de task_ids que deben completarse antes"],
      "tags": ["array de etiquetas de la tarea"]
    }
  ],
  "conflicts": ["array de strings describiendo cualquier conflicto detectado"],
  "suggestions": ["array de strings con recomendaciones de optimización"],
  "total_hours": number,
  "time_blocks_used": [
    {
      "date": "YYYY-MM-DD",
      "start_time": "HH:MM",
      "end_time": "HH:MM",
      "available_hours": number,
      "tasks_scheduled": number
    }
  ],
  "distribution_summary": {
    "tasks_distributed": number,
    "total_time_allocated": number,
    "average_daily_hours": number,
    "peak_workday_hours": number,
    "conflicts_resolved": number
  }
}
\`\`\`

**CRÍTICO:**
- Responde ÚNICAMENTE con el JSON válido, sin comentarios adicionales
- Todas las fechas deben estar en formato ISO 8601 con zona horaria UTC
- Las horas programadas deben estar EXCLUSIVAMENTE dentro del horario de trabajo configurado
- NO debe haber solapamiento con eventos existentes del calendario
- Incluye el buffer de tiempo especificado entre eventos
- Si no es posible programar todas las tareas en el período dado, indica esto en "conflicts"

Procede con el análisis y genera el JSON de distribución de tareas.`;
}

/**
 * Función auxiliar para estimar horas según prioridad de tarea
 */
export function getPriorityHours(priority: string): number {
  switch (priority.toUpperCase()) {
    case 'URGENT':
      return 6;
    case 'HIGH':
      return 4;
    case 'MEDIUM':
      return 3;
    case 'LOW':
      return 2;
    default:
      return 3;
  }
}

/**
 * Función para validar la respuesta de la IA
 */
export function validateAIResponse(response: any): boolean {
  if (!response || typeof response !== 'object') {
    return false;
  }

  const requiredFields = ['success', 'scheduled_tasks', 'conflicts', 'suggestions', 'total_hours'];
  for (const field of requiredFields) {
    if (!(field in response)) {
      return false;
    }
  }

  if (!Array.isArray(response.scheduled_tasks)) {
    return false;
  }

  // Validar estructura de cada tarea programada
  for (const task of response.scheduled_tasks) {
    const taskRequiredFields = ['task_id', 'task_title', 'start_date_time', 'end_date_time', 'estimated_hours'];
    for (const field of taskRequiredFields) {
      if (!(field in task)) {
        return false;
      }
    }

    // Validar formato de fechas
    try {
      new Date(task.start_date_time);
      new Date(task.end_date_time);
    } catch {
      return false;
    }
  }

  return true;
}

/**
 * Script de ejemplo para Azure OpenAI (Python)
 * Este sería el código para integrar con la API de Azure
 */
export const azureOpenAIScript = `
import os
import json
from openai import AzureOpenAI

def distribute_tasks_with_ai(prompt_content):
    endpoint = os.getenv("ENDPOINT_URL", "https://testr14493970923.openai.azure.com/")
    deployment = os.getenv("DEPLOYMENT_NAME", "o4-mini")
    subscription_key = os.getenv("AZURE_OPENAI_API_KEY", "REPLACE_WITH_YOUR_KEY_VALUE_HERE")

    # Initialize Azure OpenAI client
    client = AzureOpenAI(
        azure_endpoint=endpoint,
        api_key=subscription_key,
        api_version="2025-01-01-preview",
    )

    # Prepare the chat prompt
    chat_prompt = [
        {
            "role": "developer",
            "content": [
                {
                    "type": "text",
                    "text": prompt_content
                }
            ]
        }
    ]

    try:
        # Generate the completion
        completion = client.chat.completions.create(
            model=deployment,
            messages=chat_prompt,
            max_completion_tokens=100000,
            stop=None,
            stream=False,
            temperature=0.1,  # Baja temperatura para respuestas más deterministas
            top_p=0.1
        )

        # Parse response
        response_text = completion.choices[0].message.content

        # Try to parse JSON from response
        try:
            # Find JSON in response if there's additional text
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            json_text = response_text[json_start:json_end]

            return json.loads(json_text)
        except json.JSONDecodeError:
            return {
                "success": false,
                "error": "Failed to parse AI response as JSON",
                "raw_response": response_text
            }

    except Exception as e:
        return {
            "success": false,
            "error": str(e)
        }

# Ejemplo de uso:
# result = distribute_tasks_with_ai(prompt_from_frontend)
# print(json.dumps(result, indent=2))
`;
