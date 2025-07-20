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

// Mock data for when user is not authenticated
const mockBacklogItems: BacklogItem[] = [
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
    description: "Mejorar queries y índices para mejor rendimiento",
    priority: "low",
    status: "ideas",
    isBlocking: false,
    estimatedHours: 16,
    tags: ["database", "performance"],
  },
  {
    id: "4",
    title: "Testing automatizado",
    description: "Configurar CI/CD con pruebas unitarias y e2e",
    assignee: "Miguel Torres",
    priority: "critical",
    status: "todo",
    isBlocking: true,
    estimatedHours: 20,
    tags: ["testing", "devops"],
  },
  {
    id: "5",
    title: "API documentation",
    description: "Documentar endpoints con Swagger/OpenAPI",
    priority: "medium",
    status: "done",
    isBlocking: false,
    client: "Internal",
    estimatedHours: 6,
    tags: ["documentation", "api"],
  }
]

export function GeneralBacklog() {
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>(mockBacklogItems)
  const [newItem, setNewItem] = useState("")
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "todo":
        return "bg-purple-100 text-purple-800"
      case "ideas":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddItem = () => {
    if (!newItem.trim()) return

    // For demo purposes, create item locally
    // In production, this would make an API call to create the item
    const mockNewItem: BacklogItem = {
      id: Date.now().toString(),
      title: newItem,
      description: `Auto-generated description for ${newItem}`,
      priority: "medium",
      status: "ideas",
      isBlocking: false,
      estimatedHours: 4,
      tags: ["new"],
    }

    setBacklogItems(prev => [mockNewItem, ...prev])
    setNewItem("")
  }

  const filteredItems = backlogItems.filter(item => {
    if (filter !== "all" && item.status !== filter) return false
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const statusCounts = {
    ideas: backlogItems.filter(item => item.status === "ideas").length,
    todo: backlogItems.filter(item => item.status === "todo").length,
    "in-progress": backlogItems.filter(item => item.status === "in-progress").length,
    done: backlogItems.filter(item => item.status === "done").length,
  }

  const totalEstimatedHours = backlogItems.reduce((acc, item) => acc + item.estimatedHours, 0)
  const blockingItems = backlogItems.filter(item => item.isBlocking).length

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Archive className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{backlogItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Blocking Issues</p>
                <p className="text-2xl font-bold text-red-600">{blockingItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Est. Hours</p>
                <p className="text-2xl font-bold">{totalEstimatedHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ArrowRight className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{statusCounts["in-progress"]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Backlog Item</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter backlog item title..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              className="flex-1"
            />
            <Button onClick={handleAddItem}>Add Item</Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Items ({backlogItems.length})</option>
            <option value="ideas">Ideas ({statusCounts.ideas})</option>
            <option value="todo">To Do ({statusCounts.todo})</option>
            <option value="in-progress">In Progress ({statusCounts["in-progress"]})</option>
            <option value="done">Done ({statusCounts.done})</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search backlog items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Backlog Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium">{item.title}</h3>
                    {item.isBlocking && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Blocking
                      </Badge>
                    )}
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {item.assignee && (
                      <div className="flex items-center space-x-1">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {item.assignee.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{item.assignee}</span>
                      </div>
                    )}

                    {item.client && (
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{item.client}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.estimatedHours}h</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <Archive className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-600">
            {searchTerm || filter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Add your first backlog item to get started."
            }
          </p>
        </div>
      )}
    </div>
  )
}
