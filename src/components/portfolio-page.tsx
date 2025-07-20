"use client"

import { useState } from "react"
import { FolderOpen, Plus, Calendar, Users, Target, TrendingUp, Search, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

const projectsData = [
  {
    id: 1,
    name: "Optimización Línea A",
    description: "Mejora de eficiencia en línea de producción principal",
    department: "Producción Norte",
    manager: "Ana García",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    progress: 75,
    status: "En progreso",
    priority: "Alta",
    budget: 150000,
    spent: 112500,
    team: ["Juan Pérez", "María López", "Carlos Ruiz"],
    kpis: [
      { name: "Eficiencia", current: 78, target: 85, unit: "%" },
      { name: "Reducción Costos", current: 12, target: 15, unit: "%" },
    ],
  },
  {
    id: 2,
    name: "Mantenimiento Preventivo Q1",
    description: "Programa de mantenimiento preventivo primer trimestre",
    department: "Mantenimiento Norte",
    manager: "Roberto Silva",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    progress: 45,
    status: "En progreso",
    priority: "Media",
    budget: 80000,
    spent: 36000,
    team: ["Luis Martín", "Carmen Vega"],
    kpis: [
      { name: "Equipos Revisados", current: 45, target: 100, unit: "unidades" },
      { name: "Tiempo Inactividad", current: 2.3, target: 2.0, unit: "horas" },
    ],
  },
  {
    id: 3,
    name: "Implementación ERP",
    description: "Implementación sistema ERP corporativo",
    department: "TI Sur",
    manager: "Patricia Morales",
    startDate: "2023-09-01",
    endDate: "2024-02-28",
    progress: 90,
    status: "Casi completo",
    priority: "Alta",
    budget: 300000,
    spent: 270000,
    team: ["Diego Herrera", "Sofía Castro", "Miguel Torres", "Elena Jiménez"],
    kpis: [
      { name: "Módulos Implementados", current: 9, target: 10, unit: "módulos" },
      { name: "Usuarios Capacitados", current: 85, target: 100, unit: "%" },
    ],
  },
  {
    id: 4,
    name: "Certificación ISO 9001",
    description: "Proceso de certificación ISO 9001 para planta sur",
    department: "Calidad Sur",
    manager: "Fernando Ramos",
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    progress: 30,
    status: "Iniciado",
    priority: "Media",
    budget: 50000,
    spent: 15000,
    team: ["Isabel Guerrero", "Andrés Mendoza"],
    kpis: [
      { name: "Procesos Documentados", current: 30, target: 100, unit: "%" },
      { name: "Auditorías Internas", current: 2, target: 6, unit: "auditorías" },
    ],
  },
]

type Project = {
  id: number
  name: string
  description: string
  department: string
  manager: string
  startDate: string
  endDate: string
  progress: number
  status: string
  priority: string
  budget: number
  spent: number
  team: string[]
  kpis: { name: string; current: number; target: number; unit: string }[]
}

function ProjectCard({
  project,
  onView,
  onEdit,
  onDelete,
}: {
  project: Project
  onView: (project: Project) => void
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800"
      case "En progreso":
        return "bg-blue-100 text-blue-800"
      case "Casi completo":
        return "bg-yellow-100 text-yellow-800"
      case "Pausado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "destructive"
      case "Media":
        return "default"
      case "Baja":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="mt-1">{project.description}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onView(project)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(project)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(project)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{project.department}</span>
          <Badge variant={getPriorityColor(project.priority)}>{project.priority}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progreso</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{project.team.length} miembros</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(project.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span>Presupuesto</span>
            <span className="font-medium">
              ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
            </span>
          </div>
          <Progress value={(project.spent / project.budget) * 100} className="mt-1" />
        </div>

        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectDetails({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{project.name}</h2>
        <p className="text-gray-600 mt-1">{project.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Departamento</Label>
          <p>{project.department}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Responsable</Label>
          <p>{project.manager}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Fecha Inicio</Label>
          <p>{new Date(project.startDate).toLocaleDateString()}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Fecha Fin</Label>
          <p>{new Date(project.endDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Progreso General</Label>
        <div className="flex items-center gap-2">
          <Progress value={project.progress} className="flex-1" />
          <span className="font-medium">{project.progress}%</span>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Equipo de Trabajo</Label>
        <div className="flex flex-wrap gap-2">
          {project.team.map((member, index) => (
            <Badge key={index} variant="outline">
              {member}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">KPIs del Proyecto</Label>
        <div className="space-y-3">
          {project.kpis.map((kpi, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{kpi.name}</span>
                <span className="text-sm text-gray-600">
                  {kpi.current} / {kpi.target} {kpi.unit}
                </span>
              </div>
              <Progress value={(kpi.current / kpi.target) * 100} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleView = (project: Project) => {
    setSelectedProject(project)
    setShowDetails(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleDelete = (project: Project) => {
    console.log("Eliminar proyecto:", project)
  }

  const filteredProjects = projectsData.filter((project) => {
    const matchesDepartment = filterDepartment === "all" || project.department.includes(filterDepartment)
    const matchesStatus = filterStatus === "all" || project.status === filterStatus
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesDepartment && matchesStatus && matchesSearch
  })

  const totalBudget = projectsData.reduce((sum, project) => sum + project.budget, 0)
  const totalSpent = projectsData.reduce((sum, project) => sum + project.spent, 0)
  const avgProgress = projectsData.reduce((sum, project) => sum + project.progress, 0) / projectsData.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portafolio de Proyectos</h1>
          <p className="text-gray-600">Gestión integral de todos los proyectos corporativos</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Estadísticas del Portafolio */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{projectsData.length}</p>
                <p className="text-sm text-gray-600">Proyectos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(avgProgress)}%</p>
                <p className="text-sm text-gray-600">Progreso Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Presupuesto Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {projectsData.reduce((sum, project) => sum + project.team.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Recursos Asignados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                <SelectItem value="Norte">Planta Norte</SelectItem>
                <SelectItem value="Sur">Planta Sur</SelectItem>
                <SelectItem value="Producción">Producción</SelectItem>
                <SelectItem value="TI">TI</SelectItem>
                <SelectItem value="Calidad">Calidad</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="En progreso">En progreso</SelectItem>
                <SelectItem value="Casi completo">Casi completo</SelectItem>
                <SelectItem value="Iniciado">Iniciado</SelectItem>
                <SelectItem value="Pausado">Pausado</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Dialog de Detalles */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del Proyecto</DialogTitle>
          </DialogHeader>
          <ProjectDetails project={selectedProject} onClose={() => setShowDetails(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog de Formulario */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
            <DialogDescription>Configure los detalles del proyecto y asigne recursos necesarios.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">Nombre del Proyecto</Label>
              <Input id="projectName" placeholder="Ej: Optimización Línea A" />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" placeholder="Descripción detallada del proyecto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Departamento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="produccion-norte">Producción Norte</SelectItem>
                    <SelectItem value="produccion-sur">Producción Sur</SelectItem>
                    <SelectItem value="ti-sur">TI Sur</SelectItem>
                    <SelectItem value="calidad-sur">Calidad Sur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha de Inicio</Label>
                <Input id="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha de Fin</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="budget">Presupuesto</Label>
              <Input id="budget" type="number" placeholder="150000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowForm(false)}>{editingProject ? "Actualizar" : "Crear"} Proyecto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
