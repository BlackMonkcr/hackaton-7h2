"use client"

import { useState } from "react"
import { Settings, Plus, Search, Clock, CheckCircle, AlertTriangle, User, Calendar, MapPin } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
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

const operationsData = [
  {
    id: 1,
    title: "Mantenimiento Bomba Principal",
    type: "Mantenimiento",
    priority: "Alta",
    status: "Pendiente Aprobación",
    department: "Mantenimiento Norte",
    location: "Planta Norte - Sector A",
    assignedTo: "Carlos Ruiz",
    requestedBy: "Ana García",
    createdDate: "2024-01-20",
    dueDate: "2024-01-25",
    estimatedHours: 8,
    description: "Mantenimiento preventivo de bomba principal del sistema de refrigeración",
    approvalLevel: "Supervisor",
    materials: ["Filtros", "Aceite hidráulico", "Sellos"],
  },
  {
    id: 2,
    title: "Inspección Calidad Lote 2024-001",
    type: "Calidad",
    priority: "Media",
    status: "En Progreso",
    department: "Calidad Sur",
    location: "Planta Sur - Laboratorio",
    assignedTo: "María López",
    requestedBy: "Fernando Ramos",
    createdDate: "2024-01-18",
    dueDate: "2024-01-22",
    estimatedHours: 4,
    description: "Inspección de calidad del lote de producción 2024-001",
    approvalLevel: "Aprobado",
    materials: ["Kit de pruebas", "Reactivos"],
  },
  {
    id: 3,
    title: "Actualización Sistema ERP",
    type: "TI",
    priority: "Alta",
    status: "Programado",
    department: "TI Sur",
    location: "Centro de Datos",
    assignedTo: "Diego Herrera",
    requestedBy: "Patricia Morales",
    createdDate: "2024-01-19",
    dueDate: "2024-01-26",
    estimatedHours: 12,
    description: "Actualización del sistema ERP a la versión 2.1 con nuevas funcionalidades",
    approvalLevel: "Gerencia",
    materials: ["Licencias software", "Backup storage"],
  },
  {
    id: 4,
    title: "Capacitación Seguridad Industrial",
    type: "Capacitación",
    priority: "Media",
    status: "Completado",
    department: "Recursos Humanos",
    location: "Sala de Conferencias",
    assignedTo: "Isabel Guerrero",
    requestedBy: "Roberto Silva",
    createdDate: "2024-01-15",
    dueDate: "2024-01-20",
    estimatedHours: 6,
    description: "Capacitación trimestral en seguridad industrial para personal de producción",
    approvalLevel: "Aprobado",
    materials: ["Material didáctico", "Certificados"],
  },
]

type Operation = {
  id: number
  title: string
  type: string
  priority: string
  status: string
  department: string
  location: string
  assignedTo: string
  requestedBy: string
  createdDate: string
  dueDate: string
  estimatedHours: number
  description: string
  approvalLevel: string
  materials: string[]
}

function OperationCard({
  operation,
  onView,
  onEdit,
  onApprove,
}: {
  operation: Operation
  onView: (operation: Operation) => void
  onEdit: (operation: Operation) => void
  onApprove: (operation: Operation) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800"
      case "En Progreso":
        return "bg-blue-100 text-blue-800"
      case "Programado":
        return "bg-yellow-100 text-yellow-800"
      case "Pendiente Aprobación":
        return "bg-orange-100 text-orange-800"
      case "Cancelado":
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Mantenimiento":
        return <Settings className="h-4 w-4" />
      case "Calidad":
        return <CheckCircle className="h-4 w-4" />
      case "TI":
        return <Settings className="h-4 w-4" />
      case "Capacitación":
        return <User className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">{getTypeIcon(operation.type)}</div>
            <div>
              <CardTitle className="text-lg">{operation.title}</CardTitle>
              <CardDescription className="mt-1">{operation.description}</CardDescription>
            </div>
          </div>
          <Badge variant={getPriorityColor(operation.priority)}>{operation.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{operation.location}</span>
          </div>
          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(operation.status)}`}>
            {operation.status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Asignado a:</span>
            <p className="font-medium">{operation.assignedTo}</p>
          </div>
          <div>
            <span className="text-gray-600">Solicitado por:</span>
            <p className="font-medium">{operation.requestedBy}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Vence: {new Date(operation.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{operation.estimatedHours}h estimadas</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onView(operation)}>
            Ver Detalles
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(operation)}>
            Editar
          </Button>
          {operation.status === "Pendiente Aprobación" && (
            <Button size="sm" onClick={() => onApprove(operation)}>
              Aprobar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function OperationForm({
  operation,
  onSave,
  onCancel,
}: {
  operation?: Operation
  onSave: (formData: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: operation?.title || "",
    type: operation?.type || "Mantenimiento",
    priority: operation?.priority || "Media",
    department: operation?.department || "",
    location: operation?.location || "",
    assignedTo: operation?.assignedTo || "",
    dueDate: operation?.dueDate || "",
    estimatedHours: operation?.estimatedHours || "",
    description: operation?.description || "",
    materials: operation?.materials?.join(", ") || "",
  })

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título de la Operación</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ej: Mantenimiento Bomba Principal"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
              <SelectItem value="Producción">Producción</SelectItem>
              <SelectItem value="Calidad">Calidad</SelectItem>
              <SelectItem value="TI">TI</SelectItem>
              <SelectItem value="Capacitación">Capacitación</SelectItem>
              <SelectItem value="Administrativo">Administrativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Prioridad</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
              <SelectItem value="Baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="department">Departamento</Label>
        <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mantenimiento Norte">Mantenimiento Norte</SelectItem>
            <SelectItem value="Producción Norte">Producción Norte</SelectItem>
            <SelectItem value="Calidad Sur">Calidad Sur</SelectItem>
            <SelectItem value="TI Sur">TI Sur</SelectItem>
            <SelectItem value="Logística Norte">Logística Norte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="location">Ubicación</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Ej: Planta Norte - Sector A"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assignedTo">Asignado a</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="Nombre del responsable"
          />
        </div>
        <div>
          <Label htmlFor="estimatedHours">Horas Estimadas</Label>
          <Input
            id="estimatedHours"
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
            placeholder="8"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="dueDate">Fecha Límite</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción detallada de la operación"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="materials">Materiales Necesarios</Label>
        <Input
          id="materials"
          value={formData.materials}
          onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
          placeholder="Separar con comas: Filtros, Aceite, Sellos"
        />
      </div>
    </div>
  )
}

export default function OperationsPage() {
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleView = (operation: Operation) => {
    setSelectedOperation(operation)
    setShowDetails(true)
  }

  const handleEdit = (operation: Operation) => {
    setEditingOperation(operation)
    setShowForm(true)
  }

  const handleApprove = (operation: Operation) => {
    console.log("Aprobar operación:", operation)
  }

  const handleSave = (formData: any) => {
    console.log("Guardar operación:", formData)
    setShowForm(false)
    setEditingOperation(null)
  }

  const filteredOperations = operationsData.filter((operation) => {
    const matchesType = filterType === "all" || operation.type === filterType
    const matchesStatus = filterStatus === "all" || operation.status === filterStatus
    const matchesDepartment = filterDepartment === "all" || operation.department.includes(filterDepartment)
    const matchesSearch =
      operation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesStatus && matchesDepartment && matchesSearch
  })

  const pendingApproval = operationsData.filter((op) => op.status === "Pendiente Aprobación").length
  const inProgress = operationsData.filter((op) => op.status === "En Progreso").length
  const completed = operationsData.filter((op) => op.status === "Completado").length
  const totalHours = operationsData.reduce((sum, op) => sum + op.estimatedHours, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Operaciones</h1>
          <p className="text-gray-600">Control y seguimiento de todas las operaciones corporativas</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Operación
        </Button>
      </div>

      {/* Estadísticas de Operaciones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{pendingApproval}</p>
                <p className="text-sm text-gray-600">Pendientes Aprobación</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{inProgress}</p>
                <p className="text-sm text-gray-600">En Progreso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completed}</p>
                <p className="text-sm text-gray-600">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{totalHours}h</p>
                <p className="text-sm text-gray-600">Horas Planificadas</p>
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
                placeholder="Buscar operaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="Producción">Producción</SelectItem>
                <SelectItem value="Calidad">Calidad</SelectItem>
                <SelectItem value="TI">TI</SelectItem>
                <SelectItem value="Capacitación">Capacitación</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Pendiente Aprobación">Pendiente Aprobación</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Programado">Programado</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
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
                <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="Calidad">Calidad</SelectItem>
                <SelectItem value="TI">TI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Operaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOperations.map((operation) => (
          <OperationCard
            key={operation.id}
            operation={operation}
            onView={handleView}
            onEdit={handleEdit}
            onApprove={handleApprove}
          />
        ))}
      </div>

      {/* Dialog de Detalles */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Operación</DialogTitle>
          </DialogHeader>
          {selectedOperation && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedOperation.title}</h3>
                <p className="text-gray-600">{selectedOperation.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p>{selectedOperation.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Prioridad</Label>
                  <Badge variant={selectedOperation.priority === "Alta" ? "destructive" : "default"}>
                    {selectedOperation.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Departamento</Label>
                  <p>{selectedOperation.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ubicación</Label>
                  <p>{selectedOperation.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Asignado a</Label>
                  <p>{selectedOperation.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Solicitado por</Label>
                  <p>{selectedOperation.requestedBy}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha límite</Label>
                  <p>{new Date(selectedOperation.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Horas estimadas</Label>
                  <p>{selectedOperation.estimatedHours}h</p>
                </div>
              </div>
              {selectedOperation.materials && (
                <div>
                  <Label className="text-sm font-medium">Materiales necesarios</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedOperation.materials.map((material, index) => (
                      <Badge key={index} variant="outline">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Formulario */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOperation ? "Editar Operación" : "Nueva Operación"}</DialogTitle>
            <DialogDescription>Configure los detalles de la operación y asigne recursos necesarios.</DialogDescription>
          </DialogHeader>
          <OperationForm operation={editingOperation ?? undefined} onSave={handleSave} onCancel={() => setShowForm(false)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={() => handleSave({})}>{editingOperation ? "Actualizar" : "Crear"} Operación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
