"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  Plus,
  Users,
  Calendar,
  Target,
  Code,
  Table,
  BarChart3,
  Crown,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface Project {
  id: string
  name: string
  objective: string
  client?: string
  deadline: string
  status: "active" | "completed" | "paused"
  members: Array<{
    id: string
    name: string
    role: "leader" | "executor" | "validator" | "support"
    avatar: string
  }>
  progress: number
}

export function CollaborativeProjects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "App Mobile MVP",
      objective: "Desarrollar MVP de aplicación móvil",
      client: "TechCorp",
      deadline: "2024-02-15",
      status: "active",
      progress: 65,
      members: [
        { id: "1", name: "Ana García", role: "leader", avatar: "AG" },
        { id: "2", name: "Carlos López", role: "executor", avatar: "CL" },
        { id: "3", name: "María Rodríguez", role: "validator", avatar: "MR" },
      ],
    },
    {
      id: "2",
      name: "Campaña Marketing Q1",
      objective: "Lanzar campaña digital para Q1",
      deadline: "2024-01-30",
      status: "active",
      progress: 30,
      members: [
        { id: "4", name: "David Martín", role: "leader", avatar: "DM" },
        { id: "5", name: "Laura Sánchez", role: "executor", avatar: "LS" },
      ],
    },
  ])

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "gantt" | "calendar">("table")

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "leader":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "executor":
        return <User className="h-4 w-4 text-blue-600" />
      case "validator":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "support":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "leader":
        return "bg-yellow-100 text-yellow-800"
      case "executor":
        return "bg-blue-100 text-blue-800"
      case "validator":
        return "bg-green-100 text-green-800"
      case "support":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Projects Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Proyectos</span>
                </CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Plus className="h-4 w-4 mr-1" />
                  Crear
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Code className="h-4 w-4 mr-1" />
                  Unirse
                </Button>
              </div>

              <div className="space-y-3">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className={`cursor-pointer transition-colors ${
                      selectedProject?.id === project.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{project.name}</h4>
                          <Badge variant={project.status === "active" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>

                        <p className="text-xs text-gray-600">{project.objective}</p>

                        {project.client && <p className="text-xs text-blue-600">Cliente: {project.client}</p>}

                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {project.members.slice(0, 3).map((member) => (
                              <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                                <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                              </Avatar>
                            ))}
                            {project.members.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs">+{project.members.length - 3}</span>
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-gray-500">{project.progress}%</div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Project Details and Team Planning */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProject ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedProject.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === "table" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                      >
                        <Table className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "gantt" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("gantt")}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "calendar" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("calendar")}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Project Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Información General</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Objetivo:</strong> {selectedProject.objective}
                        </p>
                        {selectedProject.client && (
                          <p>
                            <strong>Cliente:</strong> {selectedProject.client}
                          </p>
                        )}
                        <p>
                          <strong>Deadline:</strong> {selectedProject.deadline}
                        </p>
                        <p>
                          <strong>Progreso:</strong> {selectedProject.progress}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Equipo</h4>
                      <div className="space-y-2">
                        {selectedProject.members.map((member) => (
                          <div key={member.id} className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{member.name}</p>
                              <div className="flex items-center space-x-1">
                                {getRoleIcon(member.role)}
                                <Badge className={getRoleColor(member.role)} variant="secondary">
                                  {member.role}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Team Tasks */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Tareas por Integrante</h4>
                      <Button size="sm" variant="outline">
                        <Target className="h-4 w-4 mr-2" />
                        Generar Planificación IA
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {selectedProject.members.map((member) => (
                        <Card key={member.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{member.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <Badge className={getRoleColor(member.role)} variant="secondary">
                                    {member.role}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">3 tareas activas</div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">Diseño de interfaz</span>
                                <Badge variant="outline">En curso</Badge>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">Revisión de código</span>
                                <Badge variant="outline">Pendiente</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un proyecto</h3>
                <p className="text-gray-500">
                  Elige un proyecto de la lista para ver sus detalles y gestionar el equipo.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
