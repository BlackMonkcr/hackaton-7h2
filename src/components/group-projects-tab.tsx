"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Input } from "./ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Plus, Users, Calendar, UserMinus, Settings } from "lucide-react"
import { GroupScheduleVisualization } from "./group-schedule-visualization"

interface Project {
  id: string
  name: string
  description: string
  deadline: string
  participants: Array<{
    id: string
    name: string
    role: string
    avatar?: string
  }>
  tasks: Array<{
    id: string
    name: string
    assignee: string
    deadline: string
    status: "pending" | "in-progress" | "completed"
    dependencies: string[]
  }>
  myRole: string
}

export function GroupProjectsTab() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "gantt" | "calendar">("table")
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Sistema de Gestión Universitaria",
      description: "Desarrollo de una plataforma web para gestión académica",
      deadline: "2024-02-15",
      myRole: "Coordinador",
      participants: [
        { id: "1", name: "Juan Pérez", role: "Coordinador" },
        { id: "2", name: "María García", role: "Frontend Developer" },
        { id: "3", name: "Carlos López", role: "Backend Developer" },
        { id: "4", name: "Ana Martínez", role: "UI/UX Designer" },
      ],
      tasks: [
        {
          id: "1",
          name: "Diseño de interfaz",
          assignee: "Ana Martínez",
          deadline: "2024-01-30",
          status: "in-progress",
          dependencies: [],
        },
        {
          id: "2",
          name: "API Backend",
          assignee: "Carlos López",
          deadline: "2024-02-05",
          status: "pending",
          dependencies: [],
        },
        {
          id: "3",
          name: "Frontend Components",
          assignee: "María García",
          deadline: "2024-02-10",
          status: "pending",
          dependencies: ["1"],
        },
      ],
    },
    {
      id: "2",
      name: "Investigación de Energías Renovables",
      description: "Proyecto de investigación sobre paneles solares",
      deadline: "2024-03-01",
      myRole: "Investigador",
      participants: [
        { id: "1", name: "Juan Pérez", role: "Investigador" },
        { id: "5", name: "Pedro Sánchez", role: "Coordinador" },
        { id: "6", name: "Laura Rodríguez", role: "Analista de Datos" },
      ],
      tasks: [
        {
          id: "4",
          name: "Revisión bibliográfica",
          assignee: "Juan Pérez",
          deadline: "2024-02-01",
          status: "completed",
          dependencies: [],
        },
        {
          id: "5",
          name: "Análisis de datos",
          assignee: "Laura Rodríguez",
          deadline: "2024-02-15",
          status: "in-progress",
          dependencies: ["4"],
        },
      ],
    },
  ])

  const selectedProjectData = projects.find((p) => p.id === selectedProject)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side - Projects List */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Proyectos Grupales</span>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Unirse
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Unirse a proyecto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Código de invitación" />
                      <Button className="w-full">Unirse al proyecto</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedProject === project.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{project.name}</h3>
                    <Badge variant="outline">{project.myRole}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{project.participants.length} miembros</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(project.deadline).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        {selectedProjectData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Detalles del Proyecto</span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <UserMinus className="h-4 w-4 mr-2" />
                    Salir
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Participantes</h4>
                <div className="space-y-2">
                  {selectedProjectData.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{participant.name}</div>
                        <div className="text-xs text-muted-foreground">{participant.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tareas del Proyecto</h4>
                <div className="space-y-2">
                  {selectedProjectData.tasks.map((task) => (
                    <div key={task.id} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{task.name}</span>
                        <Badge
                          variant={
                            task.status === "completed"
                              ? "secondary"
                              : task.status === "in-progress"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {task.status === "completed"
                            ? "Completado"
                            : task.status === "in-progress"
                              ? "En curso"
                              : "Pendiente"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Asignado a: {task.assignee} • Fecha límite:{" "}
                        {new Date(task.deadline).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full">✨ Generar programación automática grupal</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Side - Group Schedule Visualization */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Programación Grupal</span>
              <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">📄 Modo tabla</SelectItem>
                  <SelectItem value="gantt">📊 Modo Gantt</SelectItem>
                  <SelectItem value="calendar">📆 Modo horario</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProjectData ? (
              <GroupScheduleVisualization mode={viewMode} project={selectedProjectData} />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Selecciona un proyecto para ver la programación grupal
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
