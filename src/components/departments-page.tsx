"use client"

import { useState } from "react"
import { Building2, Plus, Edit, Trash2, Users, FolderOpen, ChevronRight } from "lucide-react"
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
  DialogTrigger,
} from "./ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

const departmentsData = [
  {
    id: 1,
    name: "Corporación X",
    type: "Corporación",
    manager: "CEO Principal",
    users: 185,
    projects: 56,
    children: [
      {
        id: 2,
        name: "Planta Norte",
        type: "Planta",
        manager: "Director Norte",
        users: 86,
        projects: 25,
        children: [
          { id: 3, name: "Producción", type: "Departamento", manager: "Jefe Producción", users: 45, projects: 8 },
          {
            id: 4,
            name: "Mantenimiento",
            type: "Departamento",
            manager: "Jefe Mantenimiento",
            users: 23,
            projects: 12,
          },
          { id: 5, name: "Logística", type: "Departamento", manager: "Jefe Logística", users: 18, projects: 5 },
        ],
      },
      {
        id: 6,
        name: "Planta Sur",
        type: "Planta",
        manager: "Director Sur",
        users: 99,
        projects: 31,
        children: [
          { id: 7, name: "Producción", type: "Departamento", manager: "Jefe Producción Sur", users: 52, projects: 10 },
          { id: 8, name: "Calidad", type: "Departamento", manager: "Jefe Calidad", users: 15, projects: 6 },
          { id: 9, name: "TI", type: "Departamento", manager: "Jefe TI", users: 12, projects: 15 },
        ],
      },
    ],
  },
]

function DepartmentTreeView({ departments, level = 0, onEdit, onDelete }) {
  return (
    <div className={`${level > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}`}>
      {departments.map((dept) => (
        <div key={dept.id} className="mb-4">
          <Collapsible defaultOpen>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                {dept.children && (
                  <CollapsibleTrigger>
                    <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                )}
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg">{dept.name}</h3>
                  <p className="text-sm text-gray-600">
                    {dept.type} • {dept.manager}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {dept.users}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <FolderOpen className="h-3 w-3" />
                  {dept.projects}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => onEdit(dept)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(dept)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {dept.children && (
              <CollapsibleContent className="mt-2">
                <DepartmentTreeView departments={dept.children} level={level + 1} onEdit={onEdit} onDelete={onDelete} />
              </CollapsibleContent>
            )}
          </Collapsible>
        </div>
      ))}
    </div>
  )
}

function DepartmentForm({ department, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: department?.name || "",
    type: department?.type || "Departamento",
    manager: department?.manager || "",
    parent: department?.parent || "",
  })

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Departamento</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Producción Norte"
        />
      </div>
      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Corporación">Corporación</SelectItem>
            <SelectItem value="Planta">Planta</SelectItem>
            <SelectItem value="Departamento">Departamento</SelectItem>
            <SelectItem value="Área">Área</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="manager">Responsable</Label>
        <Input
          id="manager"
          value={formData.manager}
          onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
          placeholder="Nombre del responsable"
        />
      </div>
      <div>
        <Label htmlFor="parent">Departamento Padre</Label>
        <Select value={formData.parent} onValueChange={(value) => setFormData({ ...formData, parent: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar departamento padre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="corporacion-x">Corporación X</SelectItem>
            <SelectItem value="planta-norte">Planta Norte</SelectItem>
            <SelectItem value="planta-sur">Planta Sur</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default function DepartmentsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [viewMode, setViewMode] = useState("tree") // tree, table

  const handleEdit = (department) => {
    setEditingDepartment(department)
    setShowForm(true)
  }

  const handleDelete = (department) => {
    // Implementar lógica de eliminación
    console.log("Eliminar departamento:", department)
  }

  const handleSave = (formData) => {
    // Implementar lógica de guardado
    console.log("Guardar departamento:", formData)
    setShowForm(false)
    setEditingDepartment(null)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departamentos y Jerarquías</h1>
          <p className="text-gray-600">Gestión completa de la estructura organizacional</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "tree" ? "table" : "tree")}>
            {viewMode === "tree" ? "Vista Tabla" : "Vista Árbol"}
          </Button>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Departamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDepartment ? "Editar Departamento" : "Crear Nuevo Departamento"}</DialogTitle>
                <DialogDescription>
                  Configure los detalles del departamento y su ubicación en la jerarquía organizacional.
                </DialogDescription>
              </DialogHeader>
              <DepartmentForm department={editingDepartment} onSave={handleSave} onCancel={() => setShowForm(false)} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => handleSave({})}>{editingDepartment ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Departamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">185</p>
                <p className="text-sm text-gray-600">Usuarios Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">56</p>
                <p className="text-sm text-gray-600">Proyectos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-gray-600">Plantas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vista Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Estructura Organizacional</CardTitle>
          <CardDescription>Vista completa de la jerarquía de departamentos con capacidades de edición</CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "tree" ? (
            <DepartmentTreeView departments={departmentsData} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead>Proyectos</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentsData
                  .flatMap((dept) => [
                    dept,
                    ...(dept.children || []).flatMap((child) => [child, ...(child.children || [])]),
                  ])
                  .map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{dept.type}</Badge>
                      </TableCell>
                      <TableCell>{dept.manager}</TableCell>
                      <TableCell>{dept.users}</TableCell>
                      <TableCell>{dept.projects}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(dept)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
