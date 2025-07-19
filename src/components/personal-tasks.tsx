"use client"

import { useState } from "react"
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
} from "lucide-react"

interface Task {
  id: string
  title: string
  project: string
  deadline: any
  status: "pending" | "in-progress" | "completed"
  description: string
  priority: "low" | "medium" | "high"
}

export function PersonalTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Diseñar landing page",
      project: "Web Corporativa",
      deadline: "2024-01-15",
      status: "in-progress",
      description: "Crear mockups y prototipos",
      priority: "high",
    },
    {
      id: "2",
      title: "Investigar competencia",
      project: "Market Research",
      deadline: "2024-01-20",
      status: "pending",
      description: "Análisis de 5 competidores principales",
      priority: "medium",
    },
  ])

  const [viewMode, setViewMode] = useState<"kanban" | "table" | "calendar">("kanban")
  const [newTask, setNewTask] = useState("")
  const [notes, setNotes] = useState("")

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        project: "General",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "pending",
        description: "",
        priority: "medium",
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Tasks and Notes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <CheckSquare className="h-5 w-5" />
                  <span>Mis Tareas</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "kanban" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("kanban")}
                  >
                    <Target className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    <Table className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "calendar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                  >
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add new task */}
              <div className="flex space-x-2 mb-6">
                <Input
                  placeholder="Nueva tarea..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                />
                <Button onClick={addTask}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Kanban view */}
              {viewMode === "kanban" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["pending", "in-progress", "completed"].map((status) => (
                    <div key={status} className="space-y-3">
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500">
                        {status === "pending" ? "Pendiente" : status === "in-progress" ? "En Curso" : "Completado"}
                      </h3>
                      {tasks
                        .filter((task) => task.status === status)
                        .map((task) => (
                          <Card key={task.id} className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                <div className="flex space-x-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600">{task.project}</p>
                              <div className="flex items-center justify-between">
                                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>{task.deadline}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Table view */}
              {viewMode === "table" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Tarea</th>
                        <th className="text-left p-2">Proyecto</th>
                        <th className="text-left p-2">Estado</th>
                        <th className="text-left p-2">Prioridad</th>
                        <th className="text-left p-2">Deadline</th>
                        <th className="text-left p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="border-b">
                          <td className="p-2 font-medium">{task.title}</td>
                          <td className="p-2">{task.project}</td>
                          <td className="p-2">
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                          </td>
                          <td className="p-2">
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          </td>
                          <td className="p-2">{task.deadline}</td>
                          <td className="p-2">
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Ideas Rápidas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Anota ideas, recordatorios o pensamientos rápidos..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right side - AI Scheduling */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Programación Automática</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Sugerencia IA</h4>
                <p className="text-sm text-blue-800">
                  Basado en tu disponibilidad, te recomiendo trabajar en "Diseñar landing page" mañana de 9:00-11:00 AM
                  para máximo foco.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Próximas tareas programadas:</h4>
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-gray-600">Sugerido: Mañana 9:00 AM</p>
                    </div>
                    <Badge variant="outline">2h</Badge>
                  </div>
                ))}
              </div>

              <Button className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Gantt Personal
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métricas Personales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-xs text-gray-600">Completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-600">Esta semana</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Productividad</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
