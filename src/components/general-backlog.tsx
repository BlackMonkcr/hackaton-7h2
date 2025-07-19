"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Plus, Archive, Filter, Search, ArrowRight, User, AlertTriangle, Clock } from "lucide-react"

interface BacklogItem {
  id: string
  title: string
  description: string
  assignee?: string
  priority: "low" | "medium" | "high" | "critical"
  status: "ideas" | "todo" | "in-progress" | "done"
  isBlocking: boolean
  client?: string
  estimatedHours: number
  tags: string[]
}

export function GeneralBacklog() {
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>([
    {
      id: "1",
      title: "Implementar autenticación OAuth",
      description: "Integrar login con Google y GitHub",
      assignee: "Carlos López",
      priority: "high",
      status: "todo",
      isBlocking: true,
      estimatedHours: 8,
      tags: ["backend", "security"],
    },
    {
      id: "2",
      title: "Diseñar dashboard analytics",
      description: "Crear interfaz para métricas y KPIs",
      assignee: "Ana García",
      priority: "medium",
      status: "in-progress",
      isBlocking: false,
      client: "TechCorp",
      estimatedHours: 12,
      tags: ["frontend", "design"],
    },
    {
      id: "3",
      title: "Optimizar base de datos",
      description: "Mejorar queries y añadir índices",
      priority: "low",
      status: "ideas",
      isBlocking: false,
      estimatedHours: 6,
      tags: ["database", "performance"],
    },
  ])

  const [filters, setFilters] = useState({
    assignee: "",
    priority: "",
    client: "",
    blocking: false,
  })

  const [searchTerm, setSearchTerm] = useState("")

  const columns = [
    { id: "ideas", title: "Ideas", color: "bg-gray-100" },
    { id: "todo", title: "Por Hacer", color: "bg-blue-100" },
    { id: "in-progress", title: "En Proceso", color: "bg-yellow-100" },
    { id: "done", title: "Finalizadas", color: "bg-green-100" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const moveToSprint = (itemId: string) => {
    // Logic to move item to current sprint
    console.log("Moving item to sprint:", itemId)
  }

  const filteredItems = backlogItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAssignee = !filters.assignee || item.assignee?.includes(filters.assignee)
    const matchesPriority = !filters.priority || item.priority === filters.priority
    const matchesClient = !filters.client || item.client?.includes(filters.client)
    const matchesBlocking = !filters.blocking || item.isBlocking

    return matchesSearch && matchesAssignee && matchesPriority && matchesClient && matchesBlocking
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Archive className="h-5 w-5" />
              <span>Backlog General</span>
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>

            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Asignado
            </Button>

            <Button variant="outline" size="sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Bloqueantes
            </Button>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="space-y-4">
                <div className={`p-3 rounded-lg ${column.color}`}>
                  <h3 className="font-semibold text-center">{column.title}</h3>
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {filteredItems.filter((item) => item.status === column.id).length} tareas
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredItems
                    .filter((item) => item.status === column.id)
                    .map((item) => (
                      <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm leading-tight">{item.title}</h4>
                            {item.isBlocking && <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>

                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{item.estimatedHours}h</span>
                            </div>
                          </div>

                          {item.assignee && (
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {item.assignee
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-600">{item.assignee}</span>
                            </div>
                          )}

                          {item.client && <div className="text-xs text-blue-600">Cliente: {item.client}</div>}

                          <div className="flex space-x-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs bg-transparent"
                              onClick={() => moveToSprint(item.id)}
                            >
                              <ArrowRight className="h-3 w-3 mr-1" />A Sprint
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{backlogItems.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {backlogItems.filter((item) => item.isBlocking).length}
            </div>
            <div className="text-sm text-gray-600">Bloqueantes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {backlogItems.filter((item) => item.priority === "high" || item.priority === "critical").length}
            </div>
            <div className="text-sm text-gray-600">Alta Prioridad</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {backlogItems.reduce((acc, item) => acc + item.estimatedHours, 0)}h
            </div>
            <div className="text-sm text-gray-600">Horas Estimadas</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
