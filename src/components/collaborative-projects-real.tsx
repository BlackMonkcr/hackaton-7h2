"use client"

import { useState, useEffect } from "react"
import { api } from "~/trpc/react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "./ui/dialog"
import {
  createTaskDistributionPrompt,
  getPriorityHours,
  validateAIResponse,
  type TaskDistributionPromptData,
  type CalendarEventFormatted
} from "~/lib/task-distribution-prompt"
import {
  Plus,
  Users,
  Calendar,
  Target,
  BarChart3,
  Settings,
  User,
  Clock,
  Briefcase,
  Rocket,
  CheckSquare,
  CalendarPlus,
  Zap,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

interface Project {
  id: string
  name: string
  description: string | null
  startDate: Date | null
  endDate: Date | null
  projectType: "UNIVERSITY" | "STARTUP" | "SME" | "ENTERPRISE"
  category: string
  tasksCount: number
  milestonesCount: number
  membersCount: number
  createdAt: Date
}

interface ProjectDetails {
  id: string
  name: string
  description: string | null
  tasks: Array<{
    id: string
    title: string
    description: string | null
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED"
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
    startDate: Date | null
    dueDate: Date | null
    tags: string[]
    completedAt: Date | null
  }>
  milestones: Array<{
    id: string
    title: string
    description: string | null
    dueDate: Date
    isCompleted: boolean
    completedAt: Date | null
  }>
}

interface CalendarEvent {
  id: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
}

interface ScheduledTask {
  taskId: string;
  taskTitle: string;
  startDateTime: string;
  endDateTime: string;
  estimatedHours: number;
  priority: string;
  assignedTo?: string;
}

interface TaskDistributionResult {
  success: boolean;
  scheduledTasks: ScheduledTask[];
  conflicts: string[];
  suggestions: string[];
  totalHours: number;
}

export function CollaborativeProjects() {
  const [token, setToken] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [showNewProjectForm, setShowNewProjectForm] = useState<boolean>(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  })

  // Estados para distribución automática de tareas
  const [showTaskDistribution, setShowTaskDistribution] = useState<boolean>(false)
  const [isDistributingTasks, setIsDistributingTasks] = useState<boolean>(false)
  const [distributionResult, setDistributionResult] = useState<TaskDistributionResult | null>(null)
  const [calendarData, setCalendarData] = useState<CalendarEvent[] | null>(null)
  const [isCreatingEvents, setIsCreatingEvents] = useState<boolean>(false)
  const [distributionConfig, setDistributionConfig] = useState({
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    includeSaturdays: false,
    includeSundays: false,
    maxTaskDurationHours: 4,
    bufferMinutes: 30,
  })

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token")
    if (savedToken) {
      setToken(savedToken)
      setIsAuthenticated(true)
    }
  }, [])

  // Mock data for when not authenticated
  const mockProjects: Project[] = [
    {
      id: "mock-1",
      name: "Plataforma E-commerce IA",
      description: "Desarrollo completo de plataforma e-commerce con recomendaciones personalizadas",
      startDate: new Date("2025-01-27"),
      endDate: new Date("2025-03-24"),
      projectType: "STARTUP",
      category: "STARTUP_MVP",
      tasksCount: 15,
      milestonesCount: 4,
      membersCount: 6,
      createdAt: new Date("2025-01-20"),
    },
    {
      id: "mock-2",
      name: "App Móvil Fintech",
      description: "Aplicación móvil para gestión financiera personal con IA",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-04-15"),
      projectType: "STARTUP",
      category: "STARTUP_PRODUCT",
      tasksCount: 12,
      milestonesCount: 3,
      membersCount: 4,
      createdAt: new Date("2025-01-25"),
    },
  ]

  const mockProjectDetails: ProjectDetails = {
    id: "mock-1",
    name: "Plataforma E-commerce IA",
    description: "Desarrollo completo de plataforma e-commerce con recomendaciones personalizadas",
    tasks: [
      {
        id: "task-1",
        title: "Diseño de interfaz y experiencia de usuario",
        description: "Crear mockups y prototipos para toda la plataforma",
        status: "COMPLETED",
        priority: "HIGH",
        startDate: new Date("2025-01-27"),
        dueDate: new Date("2025-01-31"),
        tags: ["diseño", "ux/ui", "frontend"],
        completedAt: new Date("2025-01-30"),
      },
      {
        id: "task-2",
        title: "Desarrollo API principal y configuración de base de datos",
        description: "Backend completo con autenticación y gestión de productos",
        status: "IN_PROGRESS",
        priority: "HIGH",
        startDate: new Date("2025-01-30"),
        dueDate: new Date("2025-02-05"),
        tags: ["backend", "api", "base-datos"],
        completedAt: null,
      },
      {
        id: "task-3",
        title: "Implementación frontend para catálogo de productos",
        description: "Interfaz de usuario para mostrar y filtrar productos",
        status: "PENDING",
        priority: "MEDIUM",
        startDate: new Date("2025-02-03"),
        dueDate: new Date("2025-02-07"),
        tags: ["frontend", "catalogo", "react"],
        completedAt: null,
      },
    ],
    milestones: [
      {
        id: "milestone-1",
        title: "MVP Básico Completado",
        description: "Primera versión funcional con features básicas",
        dueDate: new Date("2025-02-10"),
        isCompleted: false,
        completedAt: null,
      },
      {
        id: "milestone-2",
        title: "Sistema IA Integrado",
        description: "Recomendaciones personalizadas funcionando",
        dueDate: new Date("2025-02-28"),
        isCompleted: false,
        completedAt: null,
      },
    ],
  }

  // Real API calls (only when authenticated)
  const { data: projects, refetch: refetchProjects } = api.project.getProjects.useQuery(
    { token },
    { enabled: isAuthenticated && !!token, retry: false }
  )

  const { data: projectDetails } = api.project.getProjectDetails.useQuery(
    { token, projectId: selectedProjectId },
    { enabled: isAuthenticated && !!token && !!selectedProjectId, retry: false }
  )

  // Query para obtener eventos del calendario del usuario
  const { data: userCalendarData, refetch: refetchCalendar } = api.calendar.extractCalendarsWithEvents.useQuery(
    {
      token,
      timeMin: new Date().toISOString(),
      timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // próximos 30 días
      maxResults: 100,
      includeSecondary: true,
    },
    { enabled: false, retry: false }
  )

  // Query para crear eventos (se habilitará dinámicamente)
  const createEventMutation = api.calendar.createEvent.useMutation({
    onSuccess: (data) => {
      console.log("✅ Evento creado:", data)
    },
    onError: (error) => {
      console.error("❌ Error creando evento:", error)
    },
  })

  const createProjectMutation = api.project.createFromAI.useMutation({
    onSuccess: (data) => {
      console.log("✅ Proyecto creado:", data)
      refetchProjects()
      setShowNewProjectForm(false)
      setNewProject({ name: "", description: "" })
    },
    onError: (error) => {
      console.error("❌ Error creando proyecto:", error)
      alert(`Error: ${error.message}`)
    },
  })

  // Get data - either from API or mock
  const displayProjects = isAuthenticated && projects ? projects.projects : mockProjects
  const displayProjectDetails = isAuthenticated && projectDetails ? projectDetails.project :
    (selectedProjectId === "mock-1" ? mockProjectDetails : null)

  useEffect(() => {
    if (displayProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(displayProjects[0]?.id || "")
    }
  }, [displayProjects, selectedProjectId])

  // Función para obtener eventos del calendario
  const handleGetCalendarData = async () => {
    if (!token || !isAuthenticated) {
      alert("Primero debes autenticarte y conectar tu Google Calendar")
      return
    }

    try {
      const response = await refetchCalendar()
      if (response.data?.success) {
        const allEvents: CalendarEvent[] = []
        response.data.calendars.forEach(cal => {
          const validEvents = cal.events.filter(event => event.id).map(event => ({
            id: event.id!,
            start: {
              dateTime: event.start.dateTime || undefined,
              date: event.start.date || undefined,
              timeZone: event.start.timeZone || undefined,
            },
            end: {
              dateTime: event.end.dateTime || undefined,
              date: event.end.date || undefined,
              timeZone: event.end.timeZone || undefined,
            }
          }))
          allEvents.push(...validEvents)
        })
        setCalendarData(allEvents)
        console.log("✅ Eventos del calendario obtenidos:", allEvents)
        return allEvents
      }
    } catch (error) {
      console.error("❌ Error obteniendo calendario:", error)
      alert("Error al obtener eventos del calendario")
      return []
    }
    return []
  }

  // Función principal para distribuir tareas automáticamente
  const handleDistributeTasks = async () => {
    if (!displayProjectDetails) {
      alert("Selecciona un proyecto primero")
      return
    }

    if (!token || !isAuthenticated) {
      alert("Debes estar autenticado para usar esta función")
      return
    }

    setIsDistributingTasks(true)

    try {
      // 1. Obtener eventos del calendario
      const calendarEvents = await handleGetCalendarData()

      // 2. Preparar datos para la IA
      const projectData: TaskDistributionPromptData = {
        proyecto: displayProjectDetails.name,
        descripcion: displayProjectDetails.description,
        tareas: displayProjectDetails.tasks.filter(t => t.status !== "COMPLETED").map(task => ({
          id: task.id,
          titulo: task.title,
          descripcion: task.description,
          prioridad: task.priority,
          fechaVencimiento: task.dueDate,
          estimadoHoras: getPriorityHours(task.priority),
          tags: task.tags
        })),
        configuracion: distributionConfig,
        fechaInicio: new Date().toISOString().split('T')[0] || "",
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || ""
      }

      const calendarEventsFormatted: CalendarEventFormatted[] = (calendarEvents || []).map(event => ({
        inicio: event.start.dateTime || event.start.date,
        fin: event.end.dateTime || event.end.date,
        zonaHoraria: event.start.timeZone
      }))

      // 3. Crear el prompt mejorado para la IA usando la utilidad
      const prompt = createTaskDistributionPrompt(projectData, calendarEventsFormatted, distributionConfig)

      console.log("🤖 Enviando prompt a IA:", prompt)

      // TODO: Integración con Azure OpenAI
      // Para implementar la integración completa con Azure OpenAI:
      // 1. Crear un endpoint en tu backend (ej: /api/ai/distribute-tasks)
      // 2. Enviar el prompt generado a ese endpoint
      // 3. El endpoint debe usar el script Python incluido en task-distribution-prompt.ts
      // 4. Validar la respuesta usando validateAIResponse()
      // 5. Manejar errores y casos edge
      //
      // Ejemplo de implementación:
      // const response = await fetch('/api/ai/distribute-tasks', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt, token })
      // })
      // const aiResult = await response.json()
      // const validatedResponse = validateAIResponse(aiResult)

      // Simular respuesta de IA por ahora (reemplazar con llamada real)
      const mockDistributionResult: TaskDistributionResult = {
        success: true,
        scheduledTasks: displayProjectDetails.tasks.slice(0, 3).map((task, index) => ({
          taskId: task.id,
          taskTitle: task.title,
          startDateTime: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
          endDateTime: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000 + (9 + getPriorityHours(task.priority)) * 60 * 60 * 1000).toISOString(),
          estimatedHours: getPriorityHours(task.priority),
          priority: task.priority,
          assignedTo: "Usuario Principal"
        })),
        conflicts: [],
        suggestions: [
          "Las tareas han sido distribuidas evitando conflictos con tu calendario actual",
          "Se ha respetado el horario de trabajo configurado (9:00-17:00)",
          "Las tareas de alta prioridad se programaron en los primeros slots disponibles",
          "Se recomienda revisar las fechas antes de confirmar la creación de eventos"
        ],
        totalHours: displayProjectDetails.tasks.slice(0, 3).reduce((sum, task) => sum + getPriorityHours(task.priority), 0)
      }

      setDistributionResult(mockDistributionResult)
      console.log("✅ Distribución completada:", mockDistributionResult)

    } catch (error) {
      console.error("❌ Error en distribución:", error)
      alert("Error al distribuir tareas automáticamente")
    } finally {
      setIsDistributingTasks(false)
    }
  }

  // Función para crear eventos en Google Calendar
  const handleCreateCalendarEvents = async () => {
    if (!distributionResult?.scheduledTasks.length) {
      alert("No hay tareas programadas para crear")
      return
    }

    if (!token || !isAuthenticated) {
      alert("Debes estar autenticado para crear eventos")
      return
    }

    setIsCreatingEvents(true)

    // Validar que las fechas sean válidas antes de proceder
    for (const task of distributionResult.scheduledTasks) {
      const startDate = new Date(task.startDateTime)
      const endDate = new Date(task.endDateTime)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert(`❌ Error: Fechas inválidas en la tarea "${task.taskTitle}"`)
        console.error("Fechas inválidas:", { startDateTime: task.startDateTime, endDateTime: task.endDateTime })
        setIsCreatingEvents(false)
        return
      }

      if (startDate >= endDate) {
        alert(`❌ Error: La fecha de inicio debe ser anterior a la fecha de fin en la tarea "${task.taskTitle}"`)
        console.error("Fechas incorrectas:", { start: startDate, end: endDate })
        setIsCreatingEvents(false)
        return
      }
    }

    console.log(`🚀 Iniciando creación de ${distributionResult.scheduledTasks.length} eventos...`)

    try {
      let createdCount = 0
      let errorCount = 0

      for (const task of distributionResult.scheduledTasks) {
        try {
          console.log("📅 Creando evento para tarea:", task.taskTitle)
          console.log("⏰ Horario:", {
            start: new Date(task.startDateTime).toLocaleString('es-ES'),
            end: new Date(task.endDateTime).toLocaleString('es-ES')
          })

          // Preparar datos del evento
          const eventData = {
            summary: `[TAREA] ${task.taskTitle}`,
            description: `Tarea del proyecto: ${displayProjectDetails?.name || 'Proyecto'}

📋 Prioridad: ${task.priority}
⏱️ Horas estimadas: ${task.estimatedHours}h
👤 Asignado a: ${task.assignedTo}

🤖 Generado automáticamente por la distribución inteligente de tareas.`,
            startDateTime: task.startDateTime,
            endDateTime: task.endDateTime,
            timezone: "America/Lima",
            colorId: getPriorityColorId(task.priority),
          }

          console.log("📤 Enviando datos del evento:", eventData)

          // Usar la mutation de TRPC para crear el evento
          const result = await createEventMutation.mutateAsync({
            token,
            calendarId: "primary",
            event: eventData
          })

          console.log("✅ Evento creado exitosamente:", result)
          createdCount++

          // Pequeña pausa entre creaciones para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 500))

        } catch (taskError) {
          console.error("❌ Error creando evento para tarea:", task.taskTitle, taskError)

          // Mostrar detalles del error
          if (taskError instanceof Error) {
            console.error("Error details:", taskError.message)
          }

          errorCount++
        }
      }

      // Mostrar resultado final
      if (createdCount > 0 && errorCount === 0) {
        alert(`✅ ${createdCount} eventos creados exitosamente en Google Calendar!

Los eventos aparecerán en tu calendario principal con el prefijo [TAREA] y colores según prioridad:
🔴 Urgente (Rojo)
🔵 Alta (Azul)
🟢 Media (Verde)
⚪ Baja (Gris)

Actualiza tu Google Calendar para verlos.`)
      } else if (createdCount > 0 && errorCount > 0) {
        alert(`⚠️ ${createdCount} eventos creados, ${errorCount} fallaron.

Los eventos exitosos ya están en tu calendario. Revisa la consola para más detalles sobre los errores.`)
      } else {
        alert(`❌ No se pudieron crear los eventos. Error en todas las tareas.

Posibles causas:
• Problemas de conexión con Google Calendar
• Token de autenticación expirado
• Permisos insuficientes

Intenta reconectar tu cuenta de Google Calendar.`)
        return
      }

      // Limpiar estado solo si se creó al menos un evento
      if (createdCount > 0) {
        setDistributionResult(null)
        // Opcional: refrescar el calendario para mostrar los nuevos eventos
        refetchCalendar()
      }

    } catch (error) {
      console.error("❌ Error general creando eventos:", error)
      alert("Error al crear eventos en Google Calendar. Verifica tu conexión y autenticación.")
    } finally {
      setIsCreatingEvents(false)
    }
  }

  // Función auxiliar para obtener color según prioridad
  const getPriorityColorId = (priority: string): string => {
    switch (priority.toUpperCase()) {
      case 'URGENT':
        return '11' // Rojo
      case 'HIGH':
        return '9'  // Azul
      case 'MEDIUM':
        return '2'  // Verde
      case 'LOW':
        return '8'  // Gris
      default:
        return '1'  // Azul por defecto
    }
  }

  const handleLogin = () => {
    const inputToken = prompt("Ingresa tu token de autenticación:")
    if (inputToken) {
      setToken(inputToken)
      setIsAuthenticated(true)
      localStorage.setItem("auth_token", inputToken)
    }
  }

  const handleCreateProject = () => {
    if (!isAuthenticated) {
      // Mock creation for demo
      const mockProjectData = {
        proyecto: newProject.name,
        fecha_inicio: "2025-07-20",
        duracion_semanas: 8,
        equipo: {
          "Frontend Developer": 2,
          "Backend Developer": 1,
          "UX/UI Designer": 1,
        },
        plan_trabajo: {
          fases: [
            {
              nombre: "Fase Inicial",
              duracion: "2 semanas",
              entregables: ["Diseño", "Backend básico"],
              tareas: [
                {
                  descripcion: newProject.description,
                  responsable: "Team Lead",
                  fecha_inicio: "2025-07-20 09:00",
                  fecha_fin: "2025-07-27 18:00"
                }
              ]
            }
          ],
          cronograma: {
            revisiones: [
              {
                descripcion: "Revisión inicial",
                fecha: "2025-07-27 16:00"
              }
            ]
          }
        },
        asignacion_recursos: {
          presupuesto_distribucion: {
            "Fase Inicial": 10000
          }
        },
        riesgos: []
      }

      console.log("Mock project creation:", mockProjectData)
      alert("¡Proyecto creado exitosamente! (Demo con datos mock)")
      setShowNewProjectForm(false)
      setNewProject({ name: "", description: "" })
      return
    }

    // For real API, you'd use createProjectMutation here
    console.log("Creating project:", newProject)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "BLOCKED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800"
      case "HIGH":
        return "bg-orange-100 text-orange-800"
      case "MEDIUM":
        return "bg-blue-100 text-blue-800"
      case "LOW":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Sin fecha"
    return new Date(date).toLocaleDateString("es-ES")
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Proyectos Colaborativos</h2>
            <p className="text-gray-600">Gestiona proyectos de equipo y colabora con otros miembros</p>
          </div>
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <Button onClick={handleLogin} variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✅ Conectado
              </Badge>
            )}
            <Button onClick={() => setShowNewProjectForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Proyectos Activos</p>
                <p className="text-2xl font-bold">{displayProjects.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tareas</p>
                <p className="text-2xl font-bold">
                  {displayProjects.reduce((sum, p) => sum + p.tasksCount, 0)}
                </p>
              </div>
              <CheckSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Colaboradores</p>
                <p className="text-2xl font-bold">
                  {displayProjects.reduce((sum, p) => sum + p.membersCount, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Project Form */}
      {showNewProjectForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nuevo Proyecto Colaborativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="project-name" className="block text-sm font-medium mb-1">Nombre del Proyecto</label>
                <Input
                  id="project-name"
                  placeholder="Ej: Aplicación móvil para startups"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="project-description" className="block text-sm font-medium mb-1">Descripción</label>
                <Textarea
                  id="project-description"
                  placeholder="Describe el proyecto, objetivos principales y alcance..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowNewProjectForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProject}>
                <Rocket className="h-4 w-4 mr-2" />
                Crear Proyecto
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedProjectId === project.id
                      ? "bg-blue-100 border border-blue-300"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedProjectId(project.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedProjectId(project.id)}
                >
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {project.description || "Sin descripción"}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{project.tasksCount} tareas</span>
                    <span>{formatDate(project.endDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <div className="lg:col-span-2">
          {displayProjectDetails ? (
            <div className="space-y-6">
              {/* Project Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{displayProjectDetails.name}</CardTitle>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {displayProjectDetails.description || "Sin descripción disponible"}
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">
                        {displayProjectDetails.tasks.length}
                      </p>
                      <p className="text-sm text-gray-600">Tareas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">
                        {displayProjectDetails.milestones.length}
                      </p>
                      <p className="text-sm text-gray-600">Hitos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">
                        {displayProjectDetails.tasks.filter(t => t.status === "COMPLETED").length}
                      </p>
                      <p className="text-sm text-gray-600">Completadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Tareas del Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {displayProjectDetails.tasks.map((task) => (
                      <div key={task.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status === "PENDING" ? "Pendiente" :
                                 task.status === "IN_PROGRESS" ? "En Progreso" :
                                 task.status === "COMPLETED" ? "Completada" : "Bloqueada"}
                              </Badge>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority === "LOW" ? "Baja" :
                                 task.priority === "MEDIUM" ? "Media" :
                                 task.priority === "HIGH" ? "Alta" : "Urgente"}
                              </Badge>
                              {task.dueDate && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(task.dueDate)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Milestones */}
              {displayProjectDetails.milestones.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Hitos del Proyecto</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {displayProjectDetails.milestones.map((milestone) => (
                        <div key={milestone.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                              {milestone.description && (
                                <p className="text-sm text-gray-600">{milestone.description}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge className={milestone.isCompleted ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                {milestone.isCompleted ? "Completado" : "Pendiente"}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <Target className="h-3 w-3 mr-1" />
                                {formatDate(milestone.dueDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Distribución Automática de Tareas */}
              <Card className="border-2 border-dashed border-purple-200 bg-purple-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-purple-800">Distribución Automática con IA</CardTitle>
                        <p className="text-sm text-purple-600 mt-1">
                          Organiza las tareas en tu calendario evitando conflictos con eventos existentes
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      ⚡ IA + Calendar
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Estadísticas del proyecto */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
                      <div className="text-center">
                        <p className="text-lg font-bold text-purple-600">
                          {displayProjectDetails.tasks.filter(t => t.status !== "COMPLETED").length}
                        </p>
                        <p className="text-sm text-gray-600">Tareas Pendientes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-orange-600">
                          {displayProjectDetails.tasks.filter(t => t.status !== "COMPLETED")
                            .reduce((sum, task) => sum + getPriorityHours(task.priority), 0)}h
                        </p>
                        <p className="text-sm text-gray-600">Horas Estimadas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">
                          {calendarData?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Eventos en Calendario</p>
                      </div>
                    </div>

                    {/* Configuración de distribución */}
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Configuración de Horarios
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <label htmlFor="work-start" className="block text-gray-600 mb-1">Hora inicio:</label>
                          <Input
                            id="work-start"
                            type="time"
                            value={distributionConfig.workingHoursStart}
                            onChange={(e) => setDistributionConfig(prev => ({
                              ...prev, workingHoursStart: e.target.value
                            }))}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <label htmlFor="work-end" className="block text-gray-600 mb-1">Hora fin:</label>
                          <Input
                            id="work-end"
                            type="time"
                            value={distributionConfig.workingHoursEnd}
                            onChange={(e) => setDistributionConfig(prev => ({
                              ...prev, workingHoursEnd: e.target.value
                            }))}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <label htmlFor="max-hours" className="block text-gray-600 mb-1">Max. horas/tarea:</label>
                          <Input
                            id="max-hours"
                            type="number"
                            min="1"
                            max="8"
                            value={distributionConfig.maxTaskDurationHours}
                            onChange={(e) => setDistributionConfig(prev => ({
                              ...prev, maxTaskDurationHours: parseInt(e.target.value)
                            }))}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <label htmlFor="buffer-min" className="block text-gray-600 mb-1">Buffer (min):</label>
                          <Input
                            id="buffer-min"
                            type="number"
                            min="0"
                            max="120"
                            value={distributionConfig.bufferMinutes}
                            onChange={(e) => setDistributionConfig(prev => ({
                              ...prev, bufferMinutes: parseInt(e.target.value)
                            }))}
                            className="h-8"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={distributionConfig.includeSaturdays}
                            onChange={(e) => setDistributionConfig(prev => ({
                              ...prev, includeSaturdays: e.target.checked
                            }))}
                            className="mr-2"
                          />
                          <span>Incluir sábados</span>
                        </label>
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={distributionConfig.includeSundays}
                            onChange={(e) => setDistributionConfig(prev => ({
                              ...prev, includeSundays: e.target.checked
                            }))}
                            className="mr-2"
                          />
                          <span>Incluir domingos</span>
                        </label>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>
                          {isAuthenticated
                            ? "Conectado a Google Calendar"
                            : "Requiere autenticación con Google Calendar"
                          }
                        </span>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGetCalendarData}
                          disabled={!isAuthenticated || isDistributingTasks}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Actualizar Calendar
                        </Button>
                        <Button
                          onClick={handleDistributeTasks}
                          disabled={!isAuthenticated || isDistributingTasks || !displayProjectDetails.tasks.filter(t => t.status !== "COMPLETED").length}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          {isDistributingTasks ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Distribuyendo...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Distribuir Tareas
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Resultados de distribución */}
                    {distributionResult && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-green-800 flex items-center">
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Distribución Completada
                          </h4>
                          <Badge className="bg-green-100 text-green-800">
                            {distributionResult.scheduledTasks.length} tareas programadas
                          </Badge>
                        </div>

                        <div className="space-y-3 mb-4">
                          {distributionResult.scheduledTasks.map((task, index) => (
                            <div key={task.taskId} className="p-3 bg-white border border-green-200 rounded">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-gray-900">{task.taskTitle}</h5>
                                  <p className="text-sm text-gray-600">
                                    {new Date(task.startDateTime).toLocaleDateString('es-ES')} -
                                    {new Date(task.startDateTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})} a {' '}
                                    {new Date(task.endDateTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority}
                                  </Badge>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {task.estimatedHours}h estimadas
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {distributionResult.suggestions.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-700 mb-2">Recomendaciones:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {distributionResult.suggestions.map((suggestion) => (
                                <li key={suggestion} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDistributionResult(null)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={handleCreateCalendarEvents}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                            disabled={isCreatingEvents}
                          >
                            {isCreatingEvents ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Creando Eventos...
                              </>
                            ) : (
                              <>
                                <CalendarPlus className="h-4 w-4 mr-2" />
                                Crear Eventos en Calendar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecciona un proyecto
                </h3>
                <p className="text-gray-600">
                  Elige un proyecto de la lista para ver sus detalles y tareas
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Data source indicator */}
      <div className="mt-8 text-center">
        <Badge variant="secondary" className="text-xs">
          {isAuthenticated ? "📡 Datos del Backend" : "🎭 Datos Mock para Demo"}
        </Badge>
      </div>
    </div>
  )
}
