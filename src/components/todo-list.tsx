"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"

interface Task {
  id: string
  name: string
  deadline: string
  status: "pending" | "in-progress" | "completed"
  description: string
  subtasks: string[]
}

export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "Informe de Física",
      deadline: "2024-01-25",
      status: "pending",
      description: "Completar informe sobre mecánica cuántica",
      subtasks: ["Investigación", "Redacción", "Revisión"],
    },
    {
      id: "2",
      name: "Proyecto de Programación",
      deadline: "2024-01-30",
      status: "in-progress",
      description: "Desarrollar aplicación web con React",
      subtasks: ["Frontend", "Backend", "Testing"],
    },
    {
      id: "3",
      name: "Examen de Matemáticas",
      deadline: "2024-01-28",
      status: "pending",
      description: "Estudiar cálculo diferencial e integral",
      subtasks: ["Repasar teoría", "Ejercicios prácticos"],
    },
  ])

  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    name: "",
    deadline: "",
    description: "",
    subtasks: "",
  })

  const filteredTasks = tasks.filter((task) => filter === "all" || task.status === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "destructive"
      case "in-progress":
        return "default"
      case "completed":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "in-progress":
        return "En curso"
      case "completed":
        return "Completado"
      default:
        return status
    }
  }

  const addTask = () => {
    if (newTask.name && newTask.deadline) {
      const task: Task = {
        id: Date.now().toString(),
        name: newTask.name,
        deadline: newTask.deadline,
        status: "pending",
        description: newTask.description,
        subtasks: newTask.subtasks
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      }
      setTasks([...tasks, task])
      setNewTask({ name: "", deadline: "", description: "", subtasks: "" })
      setIsAddingTask(false)
    }
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const updateTaskStatus = (id: string, status: Task["status"]) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)))
  }

  return (
    <div className="space-y-4">
      {/* Filter and Add Button */}
      <div className="flex items-center justify-between">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="in-progress">En curso</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva actividad</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del proyecto</Label>
                <Input
                  id="name"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  placeholder="Nombre de la actividad"
                />
              </div>
              <div>
                <Label htmlFor="deadline">Fecha límite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Descripción corta"
                />
              </div>
              <div>
                <Label htmlFor="subtasks">Subtareas (separadas por comas)</Label>
                <Input
                  id="subtasks"
                  value={newTask.subtasks}
                  onChange={(e) => setNewTask({ ...newTask, subtasks: e.target.value })}
                  placeholder="Subtarea 1, Subtarea 2, ..."
                />
              </div>
              <Button onClick={addTask} className="w-full">
                Agregar actividad
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div key={task.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{task.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusColor(task.status)}>{getStatusText(task.status)}</Badge>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(task.deadline).toLocaleDateString("es-ES")}
              </div>
              <Select value={task.status} onValueChange={(value: any) => updateTaskStatus(task.id, value)}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En curso</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {task.subtasks.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Subtareas:</p>
                <div className="flex flex-wrap gap-1">
                  {task.subtasks.map((subtask, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {subtask}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
