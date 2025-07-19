"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Progress } from "./ui/progress"
import { Zap, Clock, AlertTriangle, TrendingUp, Calendar, User, BarChart3 } from "lucide-react"

interface SprintTask {
  id: string
  title: string
  assignee: string
  estimatedHours: number
  completedHours: number
  priority: "low" | "medium" | "high" | "critical"
  status: "not-started" | "in-progress" | "completed"
  dueDate: string
  isBlocked: boolean
}

export function CurrentSprint() {
  const [sprintTasks, setSprintTasks] = useState<SprintTask[]>([
    {
      id: "1",
      title: "Implementar autenticación OAuth",
      assignee: "Carlos López",
      estimatedHours: 8,
      completedHours: 5,
      priority: "high",
      status: "in-progress",
      dueDate: "2024-01-18",
      isBlocked: false,
    },
    {
      id: "2",
      title: "Diseñar dashboard analytics",
      assignee: "Ana García",
      estimatedHours: 12,
      completedHours: 8,
      priority: "medium",
      status: "in-progress",
      dueDate: "2024-01-20",
      isBlocked: false,
    },
    {
      id: "3",
      title: "Configurar CI/CD pipeline",
      assignee: "David Martín",
      estimatedHours: 6,
      completedHours: 0,
      priority: "high",
      status: "not-started",
      dueDate: "2024-01-19",
      isBlocked: true,
    },
  ])

  const [sprintPeriod] = useState({
    start: "2024-01-15",
    end: "2024-01-21",
    name: "Sprint 3 - Semana 3 Enero",
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500 text-white"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "not-started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalEstimatedHours = sprintTasks.reduce((acc, task) => acc + task.estimatedHours, 0)
  const totalCompletedHours = sprintTasks.reduce((acc, task) => acc + task.completedHours, 0)
  const sprintProgress = (totalCompletedHours / totalEstimatedHours) * 100

  const teamMembers = [...new Set(sprintTasks.map((task) => task.assignee))]

  const getTeamMemberLoad = (member: string) => {
    const memberTasks = sprintTasks.filter((task) => task.assignee === member)
    const totalHours = memberTasks.reduce((acc, task) => acc + task.estimatedHours, 0)
    const completedHours = memberTasks.reduce((acc, task) => acc + task.completedHours, 0)
    return { totalHours, completedHours, progress: (completedHours / totalHours) * 100 }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Sprint Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>{sprintPeriod.name}</span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {sprintPeriod.start} - {sprintPeriod.end}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(sprintProgress)}%</div>
                <div className="text-xs text-gray-600">Completado</div>
              </div>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Replanificar IA
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={sprintProgress} className="w-full" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{totalCompletedHours}h completadas</span>
            <span>{totalEstimatedHours}h totales</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprint Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tareas Priorizadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sprintTasks.map((task) => (
                <Card key={task.id} className={`p-4 ${task.isBlocked ? "border-red-200 bg-red-50" : ""}`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        {task.isBlocked && (
                          <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Bloqueada</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === "not-started"
                            ? "No iniciada"
                            : task.status === "in-progress"
                              ? "En curso"
                              : "Completada"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {task.assignee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">{task.assignee}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>
                          {task.completedHours}h / {task.estimatedHours}h
                        </span>
                      </div>
                      <Progress value={(task.completedHours / task.estimatedHours) * 100} />
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Team Load and AI Suggestions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Carga por Usuario</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.map((member) => {
                const load = getTeamMemberLoad(member)
                return (
                  <div key={member} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {member
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{member}</span>
                      </div>
                      <span className="text-sm text-gray-600">{load.totalHours}h</span>
                    </div>
                    <Progress value={load.progress} />
                    <div className="text-xs text-gray-500">
                      {load.completedHours}h / {load.totalHours}h ({Math.round(load.progress)}%)
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Alertas IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">Riesgo de Retraso</span>
                </div>
                <p className="text-sm text-red-700">
                  La tarea "CI/CD pipeline" está bloqueada y puede afectar el sprint.
                </p>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Sobrecarga</span>
                </div>
                <p className="text-sm text-orange-700">Carlos López tiene 8h más que el promedio del equipo.</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Sugerencia</span>
                </div>
                <p className="text-sm text-blue-700">Reasignar 2h de OAuth a Ana García para balancear carga.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métricas Sprint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {sprintTasks.filter((t) => t.status === "completed").length}
                  </div>
                  <div className="text-xs text-gray-600">Completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {sprintTasks.filter((t) => t.status === "in-progress").length}
                  </div>
                  <div className="text-xs text-gray-600">En Curso</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-red-600">{sprintTasks.filter((t) => t.isBlocked).length}</div>
                <div className="text-xs text-gray-600">Bloqueadas</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
