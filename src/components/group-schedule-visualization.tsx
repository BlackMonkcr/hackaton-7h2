"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"

interface Project {
  id: string
  name: string
  participants: Array<{
    id: string
    name: string
    role: string
  }>
  tasks: Array<{
    id: string
    name: string
    assignee: string
    deadline: string
    status: "pending" | "in-progress" | "completed"
  }>
}

interface GroupScheduleVisualizationProps {
  mode: "table" | "gantt" | "calendar"
  project: Project
}

export function GroupScheduleVisualization({ mode, project }: GroupScheduleVisualizationProps) {
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"]

  if (mode === "table") {
    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarea</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {task.assignee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(task.deadline).toLocaleDateString("es-ES")}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (mode === "gantt") {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">Diagrama de Gantt Grupal - {project.name}</div>
        <div className="space-y-3">
          {project.tasks.map((task, index) => {
            const assigneeIndex = project.participants.findIndex((p) => p.name === task.assignee)
            const color = colors[assigneeIndex % colors.length]

            return (
              <div key={task.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{task.name}</span>
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className={`text-xs text-white ${color}`}>
                        {task.assignee
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-xs text-muted-foreground">{task.assignee}</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-6">
                    <div
                      className={`${color} rounded-full h-6 flex items-center justify-center text-xs text-white`}
                      style={{ width: `${Math.max(20, (index + 1) * 25)}%` }}
                    >
                      {new Date(task.deadline).getDate()}/{new Date(task.deadline).getMonth() + 1}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (mode === "calendar") {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">Horario Multiusuario - {project.name}</div>
        <div className="grid gap-3">
          {project.participants.map((participant, participantIndex) => {
            const participantTasks = project.tasks.filter((task) => task.assignee === participant.name)
            const color = colors[participantIndex % colors.length]

            return (
              <div key={participant.id} className="border rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={`text-xs text-white ${color}`}>
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{participant.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {participant.role}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {participantTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`${color} bg-opacity-10 border-l-4 border-opacity-100 pl-3 py-2 rounded`}
             //         style={{ borderLeftColor: color.replace("bg-", "").replace("-500", "") }}
                    >
                      <div className="text-sm font-medium">{task.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Fecha límite: {new Date(task.deadline).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                  ))}
                  {participantTasks.length === 0 && (
                    <div className="text-xs text-muted-foreground italic">Sin tareas asignadas</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}
