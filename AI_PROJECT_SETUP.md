# Configuración de Azure AI para Generación de Proyectos

Este documento describe cómo configurar la integración con Azure AI Inference SDK para generar proyectos automáticamente.

## Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env`:

```bash
# Azure AI Inference SDK
AZURE_INFERENCE_SDK_ENDPOINT=https://your-azure-endpoint.services.ai.azure.com/models
AZURE_INFERENCE_SDK_KEY=your-azure-key-here
AZURE_DEPLOYMENT_NAME=DeepSeek-R1
```

## Configuración de Azure AI

1. **Crear recurso en Azure AI Studio**
   - Ve a [Azure AI Studio](https://ai.azure.com)
   - Crea un nuevo proyecto o usa uno existente
   - Despliega el modelo DeepSeek-R1 (o el que prefieras)

2. **Obtener credenciales**
   - Copia el endpoint de tu modelo desplegado
   - Genera una API key desde la sección de Keys and Endpoint
   - Anota el nombre del deployment

3. **Configurar variables**
   ```bash
   AZURE_INFERENCE_SDK_ENDPOINT=https://tu-endpoint.services.ai.azure.com/models
   AZURE_INFERENCE_SDK_KEY=tu-clave-aqui
   AZURE_DEPLOYMENT_NAME=DeepSeek-R1
   ```

## Uso de la Funcionalidad

### En la aplicación web

1. Ve a la página de **Startups** (`/modo/startups`)
2. Busca el botón flotante **"🤖 Generar Proyecto con IA"** en la esquina inferior derecha
3. Completa el formulario con:
   - Información básica del proyecto
   - Personal disponible
   - Tareas a resolver
   - Restricciones y prioridades

### Programáticamente

```typescript
import { api } from "~/trpc/react";

const generateProjectMutation = api.project.generateWithAI.useMutation({
  onSuccess: (data) => {
    console.log("Proyecto generado:", data);
  },
  onError: (error) => {
    console.error("Error:", error.message);
  },
});

// Llamar la mutación
generateProjectMutation.mutate({
  token: "tu-jwt-token",
  formData: {
    titulo_proyecto: "Mi Proyecto",
    descripcion_proyecto: "Descripción detallada...",
    fecha_inicio: "2025-01-27",
    semanas_requeridas: 8,
    personal_disponible: "1 PM, 2 Developers",
    rubro_laboral: "Tecnología",
    tareas_resolver: "Frontend, Backend, Testing",
    prioridad_tareas: "MVP primero",
    presupuesto: "$50,000",
    restricciones: "Equipo remoto"
  },
  calendarName: "Mi Proyecto IA",
  useExistingCalendar: false
});
```

## Estructura de la Respuesta de la IA

La IA genera un JSON estructurado que incluye:

- **Información básica**: título, descripción, fechas
- **Tareas detalladas**: con fechas específicas, responsables, prioridades
- **Cronograma diario**: distribución hora por hora
- **Eventos de calendario**: reuniones, milestones, deadlines
- **Asignación semanal**: carga de trabajo por persona
- **Riesgos identificados**: con probabilidad y mitigación
- **Estrategia de implementación**

## Funcionalidades Incluidas

- ✅ **Generación inteligente de tareas** con fechas específicas
- ✅ **Integración con Google Calendar** automática
- ✅ **Creación de proyectos en BD** con estructura completa
- ✅ **Análisis de riesgos** incluido en la planificación
- ✅ **Distribución equilibrada** de carga de trabajo
- ✅ **Interfaz intuitiva** para configuración
- ✅ **Validación de datos** de entrada y salida

## Troubleshooting

### Error: "No se recibió contenido de la IA"
- Verifica que tu Azure deployment esté activo
- Revisa los límites de tokens y rate limits
- Confirma que la API key sea válida

### Error: "JSON inválido"
- La IA a veces puede devolver texto adicional
- El sistema automáticamente limpia markdown y formato extra
- Si persiste, ajusta la temperatura del modelo (más baja = más consistente)

### Error: "Error en la respuesta de Azure AI"
- Revisa la configuración del endpoint
- Verifica que el modelo esté desplegado correctamente
- Checa los logs de Azure para más detalles

## Modelos Recomendados

- **DeepSeek-R1**: Excelente para planificación estructurada
- **GPT-4o**: Buena alternativa con gran capacidad de contexto
- **Claude-3.5-Sonnet**: Muy bueno para análisis de proyectos

## Notas Importantes

- La función requiere autenticación JWT válida
- Se crean automáticamente tareas, milestones y eventos de calendario
- La respuesta incluye validación de esquemas para garantizar consistencia
- Los proyectos se guardan en la base de datos con toda la estructura necesaria
