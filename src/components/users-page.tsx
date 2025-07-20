"use client"

import { useState } from "react"
import { Users, Plus, Edit, Trash2, Shield, Search, UserCheck, UserX } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const usersData = [
  {
    id: 1,
    name: "Ana García",
    email: "ana.garcia@plannerb.com",
    role: "Jefe de Producción",
    department: "Producción Norte",
    permissions: ["Ver Proyectos", "Editar Tareas", "Aprobar Operaciones"],
    status: "Activo",
    lastLogin: "2024-01-20T10:30:00",
    avatar: "/placeholder.svg?height=40&width=40&text=AG",
    phone: "+1234567890",
    location: "Planta Norte",
  },
  {
    id: 2,
    name: "Roberto Silva",
    email: "roberto.silva@plannerb.com",
    role: "Supervisor Mantenimiento",
    department: "Mantenimiento Norte",
    permissions: ["Ver Proyectos", "Editar Operaciones"],
    status: "Activo",
    lastLogin: "2024-01-20T09:15:00",
    avatar: "/placeholder.svg?height=40&width=40&text=RS",
    phone: "+1234567891",
    location: "Planta Norte",
  },
  {
    id: 3,
    name: "Patricia Morales",
    email: "patricia.morales@plannerb.com",
    role: "Administrador TI",
    department: "TI Sur",
    permissions: ["Administrador Completo", "Gestión Usuarios", "Configuración Sistema"],
    status: "Activo",
    lastLogin: "2024-01-20T11:45:00",
    avatar: "/placeholder.svg?height=40&width=40&text=PM",
    phone: "+1234567892",
    location: "Planta Sur",
  },
  {
    id: 4,
    name: "Fernando Ramos",
    email: "fernando.ramos@plannerb.com",
    role: "Jefe de Calidad",
    department: "Calidad Sur",
    permissions: ["Ver Proyectos", "Gestión Calidad", "Reportes"],
    status: "Activo",
    lastLogin: "2024-01-19T16:20:00",
    avatar: "/placeholder.svg?height=40&width=40&text=FR",
    phone: "+1234567893",
    location: "Planta Sur",
  },
  {
    id: 5,
    name: "Carlos Ruiz",
    email: "carlos.ruiz@plannerb.com",
    role: "Técnico",
    department: "Mantenimiento Norte",
    permissions: ["Ver Tareas", "Actualizar Estado"],
    status: "Inactivo",
    lastLogin: "2024-01-18T14:30:00",
    avatar: "/placeholder.svg?height=40&width=40&text=CR",
    phone: "+1234567894",
    location: "Planta Norte",
  },
]

const rolesData = [
  {
    id: 1,
    name: "Administrador Corporativo",
    description: "Acceso completo a todas las funciones del sistema",
    permissions: [
      "Gestión de usuarios",
      "Configuración del sistema",
      "Acceso a todos los departamentos",
      "Reportes ejecutivos",
      "Gestión de roles",
    ],
    userCount: 2,
  },
  {
    id: 2,
    name: "Jefe de Área",
    description: "Gestión completa de su departamento",
    permissions: [
      "Gestión de proyectos del área",
      "Aprobación de operaciones",
      "Gestión de equipo",
      "Reportes departamentales",
    ],
    userCount: 4,
  },
  {
    id: 3,
    name: "Supervisor",
    description: "Supervisión de operaciones y tareas",
    permissions: [
      "Asignación de tareas",
      "Seguimiento de operaciones",
      "Aprobación de nivel básico",
      "Reportes operativos",
    ],
    userCount: 8,
  },
  {
    id: 4,
    name: "Técnico",
    description: "Ejecución de tareas y actualización de estados",
    permissions: [
      "Ver tareas asignadas",
      "Actualizar estado de tareas",
      "Registrar tiempo trabajado",
      "Acceso a documentación técnica",
    ],
    userCount: 15,
  },
  {
    id: 5,
    name: "Observador",
    description: "Solo lectura de información relevante",
    permissions: ["Ver proyectos", "Ver reportes básicos", "Acceso a dashboard"],
    userCount: 5,
  },
]


type UserFormProps = {
  user?: {
    name?: string
    email?: string
    role?: string
    department?: string
    phone?: string
    location?: string
    status?: string
  }
  onSave: (formData: any) => void
  onCancel: () => void
}

function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    department: user?.department || "",
    phone: user?.phone || "",
    location: user?.location || "",
    status: user?.status || "Activo",
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre Completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Ana García"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ana.garcia@plannerb.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Rol</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Administrador Corporativo">Administrador Corporativo</SelectItem>
              <SelectItem value="Jefe de Área">Jefe de Área</SelectItem>
              <SelectItem value="Supervisor">Supervisor</SelectItem>
              <SelectItem value="Técnico">Técnico</SelectItem>
              <SelectItem value="Observador">Observador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="department">Departamento</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Producción Norte">Producción Norte</SelectItem>
              <SelectItem value="Producción Sur">Producción Sur</SelectItem>
              <SelectItem value="Mantenimiento Norte">Mantenimiento Norte</SelectItem>
              <SelectItem value="TI Sur">TI Sur</SelectItem>
              <SelectItem value="Calidad Sur">Calidad Sur</SelectItem>
              <SelectItem value="Logística Norte">Logística Norte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1234567890"
          />
        </div>
        <div>
          <Label htmlFor="location">Ubicación</Label>
          <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar ubicación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planta Norte">Planta Norte</SelectItem>
              <SelectItem value="Planta Sur">Planta Sur</SelectItem>
              <SelectItem value="Oficina Central">Oficina Central</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="status">Estado</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
            <SelectItem value="Suspendido">Suspendido</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

type RoleCardProps = {
  role: {
    id: number
    name: string
    description: string
    permissions: string[]
    userCount: number
  }
  onEdit: (role: any) => void
  onDelete: (role: any) => void
}

function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{role.name}</CardTitle>
            <CardDescription className="mt-1">{role.description}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(role)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(role)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Permisos</Label>
          <div className="space-y-1">
            {role.permissions.map((permission, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Shield className="h-3 w-3 text-green-600" />
                <span>{permission}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Usuarios asignados</span>
            <Badge variant="outline">{role.userCount} usuarios</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface IUser {
  id: number
  name: string
  email: string
  role: string
  department: string
  permissions: string[]
  status: string
  lastLogin: string
  avatar: string
  phone: string
  location: string
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("users")
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<IUser | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const handleEditUser = (user: IUser) => {
    setEditingUser(user)
    setShowUserForm(true)
  }

  const handleDeleteUser = (user: IUser) => {
    console.log("Eliminar usuario:", user)
  }

  const handleSaveUser = (formData: {
    name?: string
    email?: string
    role?: string
    department?: string
    phone?: string
    location?: string
    status?: string
  }) => {
    console.log("Guardar usuario:", formData)
    setShowUserForm(false)
    setEditingUser(null)
  }

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role.includes(filterRole)
    const matchesDepartment = filterDepartment === "all" || user.department.includes(filterDepartment)
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus
  })

  const activeUsers = usersData.filter((user) => user.status === "Activo").length
  const inactiveUsers = usersData.filter((user) => user.status === "Inactivo").length
  const totalRoles = rolesData.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios y Roles</h1>
          <p className="text-gray-600">Gestión completa de usuarios y control de accesos</p>
        </div>
        <Button onClick={() => setShowUserForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{usersData.length}</p>
                <p className="text-sm text-gray-600">Usuarios Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-sm text-gray-600">Usuarios Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{inactiveUsers}</p>
                <p className="text-sm text-gray-600">Usuarios Inactivos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{totalRoles}</p>
                <p className="text-sm text-gray-600">Roles Definidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="flex space-x-1 border-b">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "users" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Usuarios
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "roles" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("roles")}
          >
            Roles y Permisos
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Filtros */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      <Input
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los roles</SelectItem>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Jefe">Jefe</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Técnico">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
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
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                        <SelectItem value="Suspendido">Suspendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tabla de Usuarios */}
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Usuarios</CardTitle>
                  <CardDescription>Gestión de todos los usuarios del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Último Acceso</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Activo" ? "default" : "secondary"}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Roles y Permisos</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Rol
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rolesData.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    onEdit={(role) => console.log("Editar rol:", role)}
                    onDelete={(role) => console.log("Eliminar rol:", role)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog de Formulario de Usuario */}
      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            <DialogDescription>Configure los detalles del usuario y asigne roles y permisos.</DialogDescription>
          </DialogHeader>
          <UserForm user={editingUser ?? undefined} onSave={handleSaveUser} onCancel={() => setShowUserForm(false)} />
         <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserForm(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSaveUser({})}>{editingUser ? "Actualizar" : "Crear"} Usuario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
