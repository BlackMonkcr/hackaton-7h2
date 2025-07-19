"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  Users,
  FileText,
  Wrench,
  Truck,
  Cog,
  FileSpreadsheet,
  Briefcase,
  Building,
} from "lucide-react"

const defaultSections = [
  { id: 1, name: "Mantenimiento", icon: Wrench, color: "bg-red-100 text-red-700", tasks: 12, workers: 5 },
  { id: 2, name: "Logística", icon: Truck, color: "bg-blue-100 text-blue-700", tasks: 8, workers: 3 },
  { id: 3, name: "Producción", icon: Cog, color: "bg-green-100 text-green-700", tasks: 15, workers: 8 },
  {
    id: 4,
    name: "Administración",
    icon: FileSpreadsheet,
    color: "bg-purple-100 text-purple-700",
    tasks: 6,
    workers: 2,
  },
  { id: 5, name: "Comercial", icon: Briefcase, color: "bg-orange-100 text-orange-700", tasks: 9, workers: 4 },
]

export function CompanySections() {
  const [sections, setSections] = useState(defaultSections)
  const [newSectionName, setNewSectionName] = useState("")
  const [editingSection, setEditingSection] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addSection = () => {
    if (newSectionName.trim()) {
      const newSection = {
        id: Date.now(),
        name: newSectionName,
        icon: Building,
        color: "bg-gray-100 text-gray-700",
        tasks: 0,
        workers: 0,
      }
      setSections([...sections, newSection])
      setNewSectionName("")
      setIsDialogOpen(false)
    }
  }

  const deleteSection = (id) => {
    setSections(sections.filter((section) => section.id !== id))
  }

  const editSection = (section) => {
    setEditingSection(section)
    setNewSectionName(section.name)
    setIsDialogOpen(true)
  }

  const updateSection = () => {
    if (editingSection && newSectionName.trim()) {
      setSections(
        sections.map((section) => (section.id === editingSection.id ? { ...section, name: newSectionName } : section)),
      )
      setEditingSection(null)
      setNewSectionName("")
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Secciones de la Empresa</h2>
          <p className="text-muted-foreground">Organiza tu empresa por áreas de trabajo</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingSection(null)
                setNewSectionName("")
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Sección
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSection ? "Editar Sección" : "Nueva Sección"}</DialogTitle>
              <DialogDescription>
                {editingSection
                  ? "Modifica el nombre de la sección"
                  : "Crea una nueva sección para organizar tu empresa"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="col-span-3"
                  placeholder="Ej: Marketing, Ventas, IT..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={editingSection ? updateSection : addSection}>
                {editingSection ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${section.color}`}>
                  <section.icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">{section.name}</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => editSection(section)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteSection(section.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Tareas</span>
                  </div>
                  <Badge variant="secondary">{section.tasks}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Trabajadores</span>
                  </div>
                  <Badge variant="secondary">{section.workers}</Badge>
                </div>

                <Tabs defaultValue="tasks" className="w-full mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tasks">Tareas</TabsTrigger>
                    <TabsTrigger value="resources">Recursos</TabsTrigger>
                    <TabsTrigger value="calendar">Calendario</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tasks" className="mt-2">
                    <div className="text-sm text-muted-foreground">
                      {section.tasks > 0 ? `${section.tasks} tareas activas` : "Sin tareas asignadas"}
                    </div>
                  </TabsContent>
                  <TabsContent value="resources" className="mt-2">
                    <div className="text-sm text-muted-foreground">
                      {section.workers > 0 ? `${section.workers} trabajadores asignados` : "Sin recursos asignados"}
                    </div>
                  </TabsContent>
                  <TabsContent value="calendar" className="mt-2">
                    <div className="text-sm text-muted-foreground">Ver programación de esta sección</div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sections.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay secciones creadas</h3>
            <p className="text-muted-foreground mb-4">Comienza creando secciones para organizar tu empresa</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Sección
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
