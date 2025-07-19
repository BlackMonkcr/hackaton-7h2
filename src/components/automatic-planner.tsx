"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Calendar } from "./ui/calendar"
import { CalendarIcon, TableIcon, BarChart3, Users, Building2, Zap, RefreshCw, Download } from "lucide-react"

const planningModes = [
  { value: "general", label: "Modo General", description: "Toda la empresa" },
  { value: "section", label: "Por Sección", description: "Área específica" },
  { value: "worker", label: "Por Trabajador", description: "Individual" },
]


export class PlanningTask {
  id: number
  task: string
  worker: string
  section: string
  startDate: string
  endDate: string
  duration: string
  priority: string
  status: string

  constructor(
    id: number,
    task: string,
    worker: string,
    section: string,
    startDate: string,
    endDate: string,
    duration: string,
    priority: string,
    status: string
  ) {
    this.id = id
    this.task = task
    this.worker = worker
    this.section = section
    this.startDate = startDate
    this.endDate = endDate
    this.duration = duration
    this.priority = priority
    this.status = status
  }
}

const samplePlanningData: PlanningTask[] = [
  new PlanningTask(1, "Revisión mensual de equipos", "Juan Pérez", "Mantenimiento", "2024-01-15", "2024-01-15", "4h", "Alta", "Programada"),
  new PlanningTask(2, "Inventario de almacén", "María García", "Logística", "2024-01-16", "2024-01-16", "6h", "Media", "Programada"),
  new PlanningTask(3, "Control de calidad lote 001", "Carlos López", "Producción", "2024-01-17", "2024-01-17", "2h", "Alta", "Programada"),
]


export function AutomaticPlanner() {
  const [planningMode, setPlanningMode] = useState("general")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedWorker, setSelectedWorker] = useState("")
  const [viewMode, setViewMode] = useState("table")
  const [planningData, setPlanningData] = useState<PlanningTask[]>(samplePlanningData)
  const [date, setDate] = useState(new Date())

  const generatePlanning = () => {
    // Simulate AI planning generation
    console.log("Generando planificación automática...")
    // In a real app, this would call an AI service
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Media":
        return "bg-yellow-100 text-yellow-800"
      case "Baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Programada":
        return "bg-blue-100 text-blue-800"
      case "En Progreso":
        return "bg-orange-100 text-orange-800"
      case "Completada":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planificador Automático</h2>
          <p className="text-muted-foreground">Optimización inteligente de recursos y tareas</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={generatePlanning}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerar
          </Button>
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Planificar con IA
          </Button>
        </div>
      </div>

      {/* Planning Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Planificación</CardTitle>
          <CardDescription>Selecciona el modo y parámetros de planificación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Modo de Planificación</label>
              <Select value={planningMode} onValueChange={setPlanningMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {planningModes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      <div>
                        <div className="font-medium">{mode.label}</div>
                        <div className="text-xs text-muted-foreground">{mode.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {planningMode === "section" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Sección</label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="logistica">Logística</SelectItem>
                    <SelectItem value="produccion">Producción</SelectItem>
                    <SelectItem value="administracion">Administración</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {planningMode === "worker" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Trabajador</label>
                <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar trabajador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="juan">Juan Pérez</SelectItem>
                    <SelectItem value="maria">María García</SelectItem>
                    <SelectItem value="carlos">Carlos López</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Vista</label>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">
                    <div className="flex items-center gap-2">
                      <TableIcon className="h-4 w-4" />
                      Tabla
                    </div>
                  </SelectItem>
                  <SelectItem value="gantt">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Gantt
                    </div>
                  </SelectItem>
                  <SelectItem value="calendar">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Calendario
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimización IA</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Eficiencia de planificación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conflictos</CardTitle>
            <Building2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carga Balanceada</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Distribución equitativa</p>
          </CardContent>
        </Card>
      </div>

      {/* Planning Views */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Planificación Generada</CardTitle>
              <CardDescription>Vista {viewMode} de la programación optimizada</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Trabajador</TableHead>
                  <TableHead>Sección</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planningData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.task}</TableCell>
                    <TableCell>{item.worker}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.section}</Badge>
                    </TableCell>
                    <TableCell>{item.startDate}</TableCell>
                    <TableCell>{item.duration}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {viewMode === "gantt" && (
            <div className="space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Vista Gantt</h3>
                <p>Diagrama de Gantt interactivo con cronograma de tareas</p>
              </div>
            </div>
          )}

          {viewMode === "calendar" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Tareas programadas para {date?.toLocaleDateString()}</h4>
                <div className="space-y-2">
                  {planningData
                    .filter((item) => new Date(item.startDate).toDateString() === date?.toDateString())
                    .map((item) => (
                      <div key={item.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{item.task}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.worker} - {item.section} - {item.duration}
                        </div>
                      </div>
                    ))}
                  {planningData.filter((item) => new Date(item.startDate).toDateString() === date?.toDateString())
                    .length === 0 && (
                      <div className="text-muted-foreground text-center py-4">
                        No hay tareas programadas para esta fecha
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Recomendaciones de IA
          </CardTitle>
          <CardDescription>Sugerencias inteligentes para optimizar la planificación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">Redistribución sugerida</p>
                <p className="text-sm text-blue-700">
                  La sección de Producción está sobrecargada. Considera mover 2 tareas de baja prioridad a
                  Mantenimiento.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-orange-900">Alerta de capacidad</p>
                <p className="text-sm text-orange-700">
                  María García tiene el 100% de su tiempo asignado. Considera redistribuir algunas tareas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-900">Optimización detectada</p>
                <p className="text-sm text-green-700">
                  Se pueden agrupar 3 tareas de Mantenimiento para mejorar la eficiencia en un 15%.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
