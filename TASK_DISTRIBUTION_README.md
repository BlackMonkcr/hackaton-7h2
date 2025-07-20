# Distribución Automática de Tareas con IA

Este componente implementa una función avanzada de distribución automática de tareas que utiliza Azure OpenAI para organizar las tareas de un proyecto en el calendario del usuario, evitando conflictos con eventos existentes.

## Características

- **Integración con Google Calendar**: Extrae eventos existentes del calendario del usuario
- **Distribución Inteligente con IA**: Utiliza Azure OpenAI para organizar tareas optimizando el tiempo disponible
- **Configuración Personalizable**: Permite ajustar horarios de trabajo, días laborales, duración máxima de tareas, etc.
- **Gestión de Conflictos**: Identifica y evita solapamientos con eventos existentes
- **Creación Automática de Eventos**: Inserta las tareas distribuidas como eventos en Google Calendar

## Cómo Funciona

### 1. Extracción de Calendario
El componente utiliza la API `calendar.extractCalendarsWithEvents` para obtener todos los eventos del usuario en un rango de 30 días.

### 2. Configuración de Distribución
Los usuarios pueden configurar:
- Horario laboral (inicio y fin)
- Días de la semana laborales
- Duración máxima por tarea
- Buffer de tiempo entre eventos

### 3. Procesamiento con IA
Se envía un prompt estructurado a Azure OpenAI que incluye:
- Información del proyecto y tareas pendientes
- Eventos existentes del calendario
- Configuración de horarios
- Instrucciones específicas para distribución inteligente

### 4. Validación y Creación
Las tareas distribuidas se validan y luego se crean como eventos en Google Calendar.

## Estructura del Prompt de IA

El prompt está diseñado para:
- Analizar disponibilidad horaria
- Priorizar tareas según importancia
- Evitar conflictos con eventos existentes
- Optimizar la distribución de carga de trabajo
- Proporcionar recomendaciones

## Integración con Azure OpenAI

### Variables de Entorno Requeridas
```bash
ENDPOINT_URL=https://your-openai-instance.openai.azure.com/
DEPLOYMENT_NAME=your-model-deployment-name
AZURE_OPENAI_API_KEY=your-api-key
```

### Script Python para Azure OpenAI
El archivo `task-distribution-prompt.ts` incluye un script de ejemplo para integrar con Azure OpenAI desde el backend.

### Implementación Completa
Para una implementación completa, necesitarás:

1. **Backend endpoint** que reciba el prompt y se comunique con Azure OpenAI
2. **Validación de respuesta** usando la función `validateAIResponse`
3. **Manejo de errores** para casos donde la IA no pueda distribuir todas las tareas
4. **Cache de calendario** para evitar llamadas excesivas a Google Calendar API

## Ejemplo de Uso

```typescript
// 1. Usuario selecciona un proyecto
// 2. Sistema extrae eventos del calendar
const calendarEvents = await handleGetCalendarData()

// 3. Se configura la distribución
const config = {
  workingHoursStart: "09:00",
  workingHoursEnd: "17:00",
  includeSaturdays: false,
  includeSundays: false,
  maxTaskDurationHours: 4,
  bufferMinutes: 30
}

// 4. IA distribuye las tareas
const result = await handleDistributeTasks()

// 5. Se crean eventos en Google Calendar
await handleCreateCalendarEvents()
```

## Respuesta de la IA

La IA devuelve un JSON estructurado con:
- `scheduled_tasks`: Tareas programadas con fechas/horas específicas
- `conflicts`: Conflictos detectados
- `suggestions`: Recomendaciones de optimización
- `total_hours`: Total de horas asignadas
- `time_blocks_used`: Bloques de tiempo utilizados

## Beneficios

1. **Automatización Completa**: Elimina la planificación manual de tareas
2. **Optimización Inteligente**: La IA considera múltiples factores para la distribución
3. **Prevención de Conflictos**: Evita solapamientos automáticamente
4. **Flexibilidad**: Configuración personalizable según necesidades del usuario
5. **Integración Nativa**: Funciona directamente con Google Calendar

## Próximas Mejoras

- [ ] Integración con diferentes calendarios (Outlook, Apple Calendar)
- [ ] Soporte para tareas recurrentes
- [ ] Notificaciones automáticas de tareas próximas
- [ ] Analytics de productividad
- [ ] Reprogramación automática en caso de cambios
- [ ] Colaboración multi-usuario para equipos
