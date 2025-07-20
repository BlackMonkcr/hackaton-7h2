"use client"

import { useState, useEffect } from "react"
import { api } from "~/trpc/react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Target,
  Lightbulb,
  Table,
  CalendarDays,
  BarChart3,
  CheckSquare,
  Loader2,
  User,
} from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  taskType: "PERSONAL" | "PROJECT" | "MILESTONE" | "RECURRING"
  startDate: Date | null
  dueDate: Date | null
  tags: string[]
  projectId: string | null
  assigneeId: string | null
  createdById: string
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

interface NewTask {
  title: string
  description: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  dueDate: string
  tags: string
}

export function PersonalTasks() {
  const [token, setToken] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [showNewTaskForm, setShowNewTaskForm] = useState<boolean>(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    tags: "",
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
  const mockTasks: Task[] = [
    {
      id: "mock-1",
      title: "Desarrollar MVP del producto",
      description: "Crear la primera versión funcional con features básicas",
      status: "IN_PROGRESS",
      priority: "HIGH",
      taskType: "PERSONAL",
      startDate: new Date("2025-07-15"),
      dueDate: new Date("2025-08-15"),
      tags: ["desarrollo", "mvp", "producto"],
      projectId: null,
      assigneeId: "user-1",
      createdById: "user-1",
      completedAt: null,
      createdAt: new Date("2025-07-10"),
      updatedAt: new Date("2025-07-19"),
    },
    {
      id: "mock-2",
      title: "Análisis de mercado y competencia",
      description: "Investigar 10 competidores principales y definir propuesta de valor",
      status: "PENDING",
      priority: "MEDIUM",
      taskType: "PERSONAL",
      startDate: new Date("2025-07-20"),
      dueDate: new Date("2025-07-30"),
      tags: ["investigación", "mercado", "competencia"],
      projectId: null,
      assigneeId: "user-1",
      createdById: "user-1",
      completedAt: null,
      createdAt: new Date("2025-07-10"),
      updatedAt: new Date("2025-07-19"),
    },
    {
      id: "mock-3",
      title: "Definir estrategia de pricing",
      description: "Establecer modelos de precios para diferentes segmentos",
      status: "COMPLETED",
      priority: "HIGH",
      taskType: "PERSONAL",
      startDate: new Date("2025-07-01"),
      dueDate: new Date("2025-07-15"),
      tags: ["pricing", "estrategia", "negocio"],
      projectId: null,
      assigneeId: "user-1",
      createdById: "user-1",
      completedAt: new Date("2025-07-14"),
      createdAt: new Date("2025-07-01"),
      updatedAt: new Date("2025-07-14"),
    }
  ]

  // Real API calls (only when authenticated)
  const { data: projects, isLoading: projectsLoading } = api.project.getProjects.useQuery(
    { token },
    { enabled: isAuthenticated && !!token, retry: false }
  )

  const { data: projectDetails, refetch: refetchTasks } = api.project.getProjectDetails.useQuery(
    { token, projectId: projects?.projects[0]?.id || "" },
    { enabled: isAuthenticated && !!token && !!projects?.projects[0]?.id, retry: false }
  )

  const createProjectMutation = api.project.createFromAI.useMutation({
    onSuccess: (data) => {
      console.log("✅ Proyecto creado:", data)
      refetchTasks()
    },
    onError: (error) => {
      console.error("❌ Error creando proyecto:", error)
      alert(`Error: ${error.message}`)
    },
  })

  // Get tasks - either from API or mock data
  const tasks = isAuthenticated && projectDetails ?
    projectDetails.project.tasks.filter(task => task.taskType === "PERSONAL") :
    mockTasks

  const handleLogin = () => {
    const inputToken = prompt("Ingresa tu token de autenticación:")
    if (inputToken) {
      setToken(inputToken)
      setIsAuthenticated(true)
      localStorage.setItem("auth_token", inputToken)
    }
  }

  const handleCreateTask = () => {
    if (!isAuthenticated) {
      // Mock creation for demo
      const newMockTask: Task = {
        id: `mock-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        status: "PENDING",
        priority: newTask.priority,
        taskType: "PERSONAL",
        startDate: new Date(),
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
        tags: newTask.tags.split(",").map(t => t.trim()).filter(Boolean),
        projectId: null,
        assigneeId: "user-1",
        createdById: "user-1",
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockTasks.unshift(newMockTask)
      setShowNewTaskForm(false)
      setNewTask({ title: "", description: "", priority: "MEDIUM", dueDate: "", tags: "" })
      return
    }

    // Real API call would go here
    console.log("Creating task:", newTask)
    setShowNewTaskForm(false)
    setNewTask({ title: "", description: "", priority: "MEDIUM", dueDate: "", tags: "" })
  }

  const getStatusColor = (status: Task['status']) => {
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

  const getPriorityColor = (priority: Task['priority']) => {
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
            <h2 className="text-2xl font-bold text-gray-900">Tareas Personales</h2>
            <p className="text-gray-600">Gestiona tus tareas individuales y objetivos personales</p>
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
            <Button onClick={() => setShowNewTaskForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === "PENDING").length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === "IN_PROGRESS").length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold">{tasks.filter(t => t.status === "COMPLETED").length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Task Form */}
      {showNewTaskForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nueva Tarea Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input
                  placeholder="Ej: Desarrollar funcionalidad X"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha límite</label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <Textarea
                  placeholder="Describe los detalles de la tarea..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prioridad</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (separados por comas)</label>
                <Input
                  placeholder="desarrollo, urgente, cliente"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowNewTaskForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTask}>
                Crear Tarea
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
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
                  </div>

                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {task.dueDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(task.dueDate)}
                      </div>
                    )}
                    {task.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Lightbulb className="h-4 w-4" />
                        {task.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{task.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {tasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas pendientes</h3>
              <p className="text-gray-600 mb-4">¡Felicidades! Has completado todas tus tareas personales.</p>
              <Button onClick={() => setShowNewTaskForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear primera tarea
              </Button>
            </CardContent>
          </Card>
        )}
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
