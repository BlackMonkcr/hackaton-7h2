"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"

interface ScheduleVisualizationProps {
  mode: "table" | "gantt" | "calendar"
}

export function ScheduleVisualization({ mode }: ScheduleVisualizationProps) {
  const scheduleData = [
    {
      task: "Informe de Física",
      date: "2024-01-22",
      duration: "3 horas",
      progress: 0,
      timeSlot: "14:00 - 17:00",
    },
    {
      task: "Proyecto de Programación",
      date: "2024-01-23",
      duration: "4 horas",
      progress: 40,
      timeSlot: "09:00 - 13:00",
    },
    {
      task: "Estudio Matemáticas",
      date: "2024-01-24",
      duration: "2 horas",
      progress: 0,
      timeSlot: "16:00 - 18:00",
    },
    {
      task: "Revisión Informe",
      date: "2024-01-25",
      duration: "1 hora",
      progress: 0,
      timeSlot: "10:00 - 11:00",
    },
  ]

  if (mode === "table") {
    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarea</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Progreso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.task}</TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString("es-ES")}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress value={item.progress} className="w-16" />
                    <span className="text-sm">{item.progress}%</span>
                  </div>
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
        <div className="text-sm text-muted-foreground mb-4">Diagrama de Gantt - Enero 2024</div>
        <div className="space-y-3">
          {scheduleData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.task}</span>
                <span className="text-xs text-muted-foreground">{item.duration}</span>
              </div>
              <div className="relative">
                <div className="w-full bg-muted rounded-full h-6">
                  <div
                    className="bg-primary rounded-full h-6 flex items-center justify-center text-xs text-primary-foreground"
                    style={{ width: `${Math.max(20, (index + 1) * 20)}%` }}
                  >
                    {new Date(item.date).getDate()}/01
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (mode === "calendar") {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">Agenda Personal - Esta Semana</div>
        <div className="grid gap-3">
          {scheduleData.map((item, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">
                  {new Date(item.date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric" })}
                </Badge>
                <span className="text-sm text-muted-foreground">{item.timeSlot}</span>
              </div>
              <div className="font-medium text-sm">{item.task}</div>
              <div className="text-xs text-muted-foreground mt-1">Duración estimada: {item.duration}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
