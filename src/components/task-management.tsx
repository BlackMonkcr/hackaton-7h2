"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload, Filter, Search, Calendar, Clock, User, AlertTriangle, CheckCircle, Circle } from "lucide-react"

const sampleTasks = [
  {
    id: 1,
    area: "Mantenimiento",
    description: "Revisión mensual de equipos",
    priority: "Alta",
    deadline: "2024-01-15",
    responsible: "Juan Pérez",
    duration: "4h",
    status: "Pendiente",
  },
  {
    id: 2,
    area: "Logística",
    description: "Inventario de almacén",
    priority: "Media",
    deadline: "2024-01-20",
    responsible: "María García",
    duration: "6h",
    status: "En Progreso",
  },
  {
    id: 3,
    area: "Producción",
    description: "Control de calidad lote 001",
    priority: "Alta",
    deadline: "2024-01-12",
    responsible: "Carlos López",
    duration: "2h",
    status: "Completada",
  },
]

const areas = ["Mantenimiento", "Logística", "Producción", "Administración", "Comercial"]
const priorities = ["Baja", "Media", "Alta", "Crítica"]
const statuses = ["Pendiente", "En Progreso", "Completada", "Cancelada"]

export function TaskManagement() {
  const [tasks, setTasks] = useState(sampleTasks)
  const [filteredTasks, setFilteredTasks] = useState(sampleTasks)
  const [filterArea, setFilterArea] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    area: "",
    description: "",
    priority: "",
    deadline: "",
    responsible: "",
    duration: "",
    status: "Pendiente",
  })

  const applyFilters = () => {
    let filtered = tasks

    if (filterArea !== "all") {
      filtered = filtered.filter((task) => task.area === filterArea)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => task.status === filterStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.responsible.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredTasks(filtered)
  }

  const addTask = () => {
    if (newTask.area && newTask.description) {
      const task = {
        id: Date.now(),
        ...newTask,
      }
      setTasks([...tasks, task])
      setNewTask({
        area: "",
        description: "",
        priority: "",
        deadline: "",
        responsible: "",
        duration: "",
        status: "Pendiente",
      })
      setIsDialogOpen(false)
      applyFilters()
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Crítica":
        return "bg-red-100 text-red-800"
      case "Alta":
        return "bg-orange-100 text-orange-800"
      case "Media":
        return "bg-yellow-100 text-yellow-800"
      case "Baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completada":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "En Progreso":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "Cancelada":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tareas Operativas</h2>
          <p className="text-muted-foreground">Gestiona las tareas de tu empresa por sección</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Cargar Excel
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Tarea
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nueva Tarea</DialogTitle>
                <DialogDescription>Crea una nueva tarea operativa</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Área</Label>
                    <Select value={newTask.area} onValueChange={(value) => setNewTask({ ...newTask, area: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar área" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Describe la tarea..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Fecha límite</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible">Responsable</Label>
                    <Input
                      id="responsible"
                      value={newTask.responsible}
                      onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
                      placeholder="Nombre del responsable"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración</Label>
                    <Input
                      id="duration"
                      value={newTask.duration}
                      onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                      placeholder="Ej: 4h, 2d"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addTask}>Crear Tarea</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por descripción o responsable..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="area-filter">Área</Label>
              <Select value={filterArea} onValueChange={setFilterArea}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={applyFilters}>Aplicar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tareas</CardTitle>
          <CardDescription>{filteredTasks.length} tareas encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Fecha límite</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Duración</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="text-sm">{task.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.area}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">{task.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {task.deadline}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {task.responsible}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {task.duration}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
