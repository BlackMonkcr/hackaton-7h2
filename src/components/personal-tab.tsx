"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { TodoList } from "./todo-list"
import { ScheduleVisualization } from "./schedule-visualization"

export function PersonalTab() {
  const [viewMode, setViewMode] = useState<"table" | "gantt" | "calendar">("table")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side - To-Do List */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mis actividades</span>
              <Badge variant="secondary">5 pendientes</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TodoList />
          </CardContent>
        </Card>

        {/* Automatic Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle>Programación automática</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="priority">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar algoritmo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priorizar por fecha límite</SelectItem>
                <SelectItem value="workload">Priorizar por carga de trabajo</SelectItem>
                <SelectItem value="difficulty">Priorizar por dificultad</SelectItem>
                <SelectItem value="balanced">Enfoque balanceado</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">✨ Generar programación automática</Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Schedule Visualization */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Visualización de programación</span>
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
            <ScheduleVisualization mode={viewMode} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
