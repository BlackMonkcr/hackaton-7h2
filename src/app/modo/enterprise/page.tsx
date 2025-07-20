"use client"

import { useState } from "react"
import {
  Building2,
  Users,
  FolderOpen,
  Settings,
  BarChart3,
  Brain,
  ChevronDown,
  Search,
  Bell,
  LogOut,
  Puzzle,
  User,
  RotateCcw,
  Cog,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

// Import page components
import DashboardPage from "~/components/dashboard-page"
import DepartmentsPage from "~/components/departments-page"
import PortfolioPage from "~/components/portfolio-page"
import OperationsPage from "~/components/operations-page"
import UsersPage from "~/components/users-page"
import PlannerPage from "~/components/planner-page"
import ReportsPage from "~/components/reports-page"

function AppSidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "dashboard", label: "Panel Corporativo", icon: BarChart3 },
    { id: "departments", label: "Departamentos y jerarquías", icon: Building2 },
    { id: "portfolio", label: "Portafolio de proyectos", icon: FolderOpen },
    { id: "operations", label: "Gestión de operaciones", icon: Settings },
    { id: "users", label: "Usuarios y roles", icon: Users },
    { id: "planner", label: "Planificador inteligente", icon: Brain },
    { id: "reports", label: "Indicadores clave y reportes", icon: BarChart3 },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold">PB</div>
          <div>
            <h2 className="text-lg font-semibold">Planner B</h2>
            <Badge variant="secondary" className="text-xs">
              Modo Corporativo
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={activeSection === item.id} onClick={() => setActiveSection(item.id)}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User className="h-4 w-4" />
                  <span>Admin Corporativo</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function TopBar() {
  return (
    <div className="border-b bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input placeholder="Buscar proyectos, tareas, usuarios..." className="w-80" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Puzzle className="h-4 w-4 mr-2" />
            Gestión de áreas
          </Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Usuarios y roles
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Flujos integrados
          </Button>
          <Button variant="outline" size="sm">
            <Cog className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PlannerBCorporate() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderPage = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardPage />
      case "departments":
        return <DepartmentsPage />
      case "portfolio":
        return <PortfolioPage />
      case "operations":
        return <OperationsPage />
      case "users":
        return <UsersPage />
      case "planner":
        return <PlannerPage />
      case "reports":
        return <ReportsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1">
          <TopBar />
          <main className="flex-1 overflow-auto">{renderPage()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
