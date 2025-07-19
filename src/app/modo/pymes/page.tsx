"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import {
  Building2,
  Users,
  Calendar,
  BarChart3,
  Settings,
  User,
  Upload,
  Eye,
  Puzzle,
  FileText,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { CompanySections } from "~/components/company-sections"
import { TaskManagement } from "~/components/task-management"
import { Collaborators } from "~/components/collaborators"
import { AutomaticPlanner } from "~/components/automatic-planner"
import { ReportsIndicators } from "~/components/reports-indicators"

export default function PlannerB() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const quickAccessItems = [
    { icon: Puzzle, label: "Crear / editar secciones", action: () => setActiveTab("sections") },
    { icon: Upload, label: "Cargar tareas", action: () => setActiveTab("tasks") },
    { icon: Eye, label: "Ver planificación", action: () => setActiveTab("planner") },
    { icon: User, label: "Perfil", action: () => {} },
    { icon: Settings, label: "Configuración", action: () => {} },
  ]

  const dashboardStats = [
    { title: "Tareas Activas", value: "47", change: "+12%", icon: CheckCircle, color: "text-green-600" },
    { title: "Colaboradores", value: "23", change: "+2", icon: Users, color: "text-blue-600" },
    { title: "Secciones", value: "5", change: "0", icon: Building2, color: "text-purple-600" },
    { title: "Productividad", value: "87%", change: "+5%", icon: TrendingUp, color: "text-orange-600" },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        {/* Fixed Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold">Planner B</h1>
              </div>
              <Badge variant="secondary" className="ml-2">
                Modo PyMEs
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {quickAccessItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={item.action}
                  className="hidden md:flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <Sidebar className="w-64">
            <SidebarHeader>
              <div className="p-4">
                <h2 className="text-lg font-semibold">Navegación</h2>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <nav className="space-y-2 p-4">
                <Button
                  variant={activeTab === "dashboard" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("dashboard")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === "sections" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("sections")}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Secciones de la empresa
                </Button>
                <Button
                  variant={activeTab === "tasks" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("tasks")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Tareas operativas
                </Button>
                <Button
                  variant={activeTab === "collaborators" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("collaborators")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Colaboradores
                </Button>
                <Button
                  variant={activeTab === "planner" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("planner")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Planificador automático
                </Button>
                <Button
                  variant={activeTab === "reports" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("reports")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Reportes e indicadores
                </Button>
              </nav>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                  <p className="text-muted-foreground">Resumen general de tu empresa</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {dashboardStats.map((stat, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.change} desde el mes pasado</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setActiveTab("sections")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Puzzle className="h-5 w-5" />
                        Gestionar Secciones
                      </CardTitle>
                      <CardDescription>Organiza tu empresa por áreas de trabajo</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setActiveTab("tasks")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Cargar Tareas
                      </CardTitle>
                      <CardDescription>Añade tareas manualmente o desde Excel</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setActiveTab("planner")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Planificación
                      </CardTitle>
                      <CardDescription>Visualiza y optimiza la programación</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Tarea completada en Mantenimiento</p>
                          <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Nuevo colaborador asignado a Logística</p>
                          <p className="text-xs text-muted-foreground">Hace 4 horas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Alerta: Sobrecarga en Producción</p>
                          <p className="text-xs text-muted-foreground">Hace 6 horas</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "sections" && <CompanySections />}
            {activeTab === "tasks" && <TaskManagement />}
            {activeTab === "collaborators" && <Collaborators />}
            {activeTab === "planner" && <AutomaticPlanner />}
            {activeTab === "reports" && <ReportsIndicators />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
