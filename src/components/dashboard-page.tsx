"use client"

import { Building2, Brain, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Collapsible, CollapsibleContent } from "./ui/collapsible"

const departments = [
  {
    id: 1,
    name: "Corporación X",
    children: [
      {
        id: 2,
        name: "Planta Norte",
        children: [
          { id: 3, name: "Producción", users: 45, projects: 8 },
          { id: 4, name: "Mantenimiento", users: 23, projects: 12 },
          { id: 5, name: "Logística", users: 18, projects: 5 },
        ],
      },
      {
        id: 6,
        name: "Planta Sur",
        children: [
          { id: 7, name: "Producción", users: 52, projects: 10 },
          { id: 8, name: "Calidad", users: 15, projects: 6 },
          { id: 9, name: "TI", users: 12, projects: 15 },
        ],
      },
    ],
  },
]

const projects = [
  {
    id: 1,
    name: "Optimización Línea A",
    department: "Producción Norte",
    progress: 75,
    status: "En progreso",
    priority: "Alta",
  },
  {
    id: 2,
    name: "Mantenimiento Preventivo Q1",
    department: "Mantenimiento Norte",
    progress: 45,
    status: "En progreso",
    priority: "Media",
  },
  { id: 3, name: "Implementación ERP", department: "TI Sur", progress: 90, status: "Casi completo", priority: "Alta" },
  { id: 4, name: "Certificación ISO", department: "Calidad Sur", progress: 30, status: "Iniciado", priority: "Media" },
]

const kpis = [
  { name: "Cumplimiento General", value: 87, target: 90, unit: "%" },
  { name: "Productividad", value: 94, target: 95, unit: "%" },
  { name: "Proyectos a Tiempo", value: 78, target: 85, unit: "%" },
  { name: "Utilización Recursos", value: 82, target: 80, unit: "%" },
]

function DepartmentTree({ departments, level = 0 }) {
  return (
    <div className={`${level > 0 ? "ml-4 border-l pl-4" : ""}`}>
      {departments.map((dept) => (
        <div key={dept.id} className="mb-2">
          <Collapsible defaultOpen>
            <CollapsibleContent>
              <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">{dept.name}</span>
                {dept.users && (
                  <div className="ml-auto flex gap-2">
                    <Badge variant="outline">{dept.users} usuarios</Badge>
                    <Badge variant="outline">{dept.projects} proyectos</Badge>
                  </div>
                )}
              </div>
              {dept.children && <DepartmentTree departments={dept.children} level={level + 1} />}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel Corporativo</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.value}
                {kpi.unit}
              </div>
              <Progress value={kpi.value} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Meta: {kpi.target}
                {kpi.unit}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Estructura Organizacional</CardTitle>
            <CardDescription>Vista jerárquica de departamentos y áreas</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentTree departments={departments} />
          </CardContent>
        </Card>

        {/* Proyectos Activos */}
        <Card>
          <CardHeader>
            <CardTitle>Proyectos Activos</CardTitle>
            <CardDescription>Estado actual del portafolio de proyectos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant={project.priority === "Alta" ? "destructive" : "secondary"}>
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.department}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="flex-1" />
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{project.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planificador Inteligente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Planificador Inteligente
          </CardTitle>
          <CardDescription>Sugerencias y alertas del sistema de IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-yellow-800">Sobrecarga detectada en Producción Norte</p>
                <p className="text-sm text-yellow-700">
                  Se recomienda reasignar 3 tareas al turno nocturno para optimizar recursos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-800">Oportunidad de optimización</p>
                <p className="text-sm text-blue-700">
                  El proyecto "Implementación ERP" puede completarse 2 días antes si se asignan recursos adicionales de
                  TI.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-800">Rendimiento óptimo</p>
                <p className="text-sm text-green-700">
                  Planta Sur mantiene un 94% de eficiencia, superando la meta mensual.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
