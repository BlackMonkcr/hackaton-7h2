"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Progress } from "./ui/progress"
import { Plus, Users, Clock, CheckCircle, AlertTriangle, Mail, Phone } from "lucide-react"

const sampleCollaborators = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    phone: "+34 600 123 456",
    section: "Mantenimiento",
    weeklyHours: 40,
    assignedHours: 32,
    availability: "Disponible",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "María García",
    email: "maria.garcia@empresa.com",
    phone: "+34 600 234 567",
    section: "Logística",
    weeklyHours: 40,
    assignedHours: 40,
    availability: "Ocupado",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Carlos López",
    email: "carlos.lopez@empresa.com",
    phone: "+34 600 345 678",
    section: "Producción",
    weeklyHours: 40,
    assignedHours: 25,
    availability: "Disponible",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const sections = ["Mantenimiento", "Logística", "Producción", "Administración", "Comercial"]

export function Collaborators() {
  const [collaborators, setCollaborators] = useState(sampleCollaborators)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCollaborator, setNewCollaborator] = useState({
    name: "",
    email: "",
    phone: "",
    section: "",
    weeklyHours: 40,
    assignedHours: 0,
    availability: "Disponible",
  })

  const addCollaborator = () => {
    if (newCollaborator.name && newCollaborator.email && newCollaborator.section) {
      const collaborator = {
        id: Date.now(),
        ...newCollaborator,
        avatar: "/placeholder.svg?height=40&width=40",
      }
      setCollaborators([...collaborators, collaborator])
      setNewCollaborator({
        name: "",
        email: "",
        phone: "",
        section: "",
        weeklyHours: 40,
        assignedHours: 0,
        availability: "Disponible",
      })
      setIsDialogOpen(false)
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Disponible":
        return "bg-green-100 text-green-800"
      case "Ocupado":
        return "bg-red-100 text-red-800"
      case "Parcialmente disponible":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getWorkloadPercentage = (assigned: number, total: number) => {
    return Math.round((assigned / total) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Colaboradores</h2>
          <p className="text-muted-foreground">Gestiona tu equipo y asignaciones por sección</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nuevo Colaborador</DialogTitle>
              <DialogDescription>Añade un nuevo miembro al equipo</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={newCollaborator.name}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, name: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Sección</Label>
                  <Select
                    value={newCollaborator.section}
                    onValueChange={(value) => setNewCollaborator({ ...newCollaborator, section: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sección" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCollaborator.email}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}
                    placeholder="juan@empresa.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={newCollaborator.phone}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, phone: e.target.value })}
                    placeholder="+34 600 123 456"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weeklyHours">Horas semanales</Label>
                  <Input
                    id="weeklyHours"
                    type="number"
                    value={newCollaborator.weeklyHours}
                    onChange={(e) =>
                      setNewCollaborator({ ...newCollaborator, weeklyHours: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedHours">Horas asignadas</Label>
                  <Input
                    id="assignedHours"
                    type="number"
                    value={newCollaborator.assignedHours}
                    onChange={(e) =>
                      setNewCollaborator({ ...newCollaborator, assignedHours: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addCollaborator}>Añadir Colaborador</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collaborators.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collaborators.filter((c) => c.availability === "Disponible").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collaborators.filter((c) => c.availability === "Ocupado").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carga Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                collaborators.reduce((acc, c) => acc + getWorkloadPercentage(c.assignedHours, c.weeklyHours), 0) /
                  collaborators.length,
              )}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collaborators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Colaboradores</CardTitle>
          <CardDescription>Gestiona la información y asignaciones de tu equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Disponibilidad</TableHead>
                <TableHead>Carga de trabajo</TableHead>
                <TableHead>Horas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collaborators.map((collaborator) => (
                <TableRow key={collaborator.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {collaborator.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{collaborator.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{collaborator.section}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {collaborator.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {collaborator.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getAvailabilityColor(collaborator.availability)}>
                      {collaborator.availability}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Progress
                        value={getWorkloadPercentage(collaborator.assignedHours, collaborator.weeklyHours)}
                        className="w-20"
                      />
                      <div className="text-xs text-muted-foreground">
                        {getWorkloadPercentage(collaborator.assignedHours, collaborator.weeklyHours)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>
                        {collaborator.assignedHours}h / {collaborator.weeklyHours}h
                      </div>
                      <div className="text-muted-foreground">
                        {collaborator.weeklyHours - collaborator.assignedHours}h libres
                      </div>
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
