"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Progress } from "./ui/progress"
import { Zap, Clock, AlertTriangle, Calendar, BarChart3, Play, Pause, CheckCircle } from "lucide-react"

interface SprintTask {
  id: string
  title: string
  assignee: string
  estimatedHours: number
  completedHours: number
  priority: "low" | "medium" | "high" | "critical"
  status: "not-started" | "in-progress" | "completed"
  dueDate: string
  isBlocked: boolean
}

// Mock data for sprint tasks
const mockSprintTasks: SprintTask[] = [
  {
    id: "1",
    title: "Implementar autenticación OAuth",
    assignee: "Carlos López",
    estimatedHours: 8,
    completedHours: 5,
    priority: "high",
    status: "in-progress",
    dueDate: "2025-01-25",
    isBlocked: false,
  },
  {
    id: "2",
    title: "Diseñar dashboard analytics",
    assignee: "Ana García",
    estimatedHours: 12,
    completedHours: 8,
    priority: "medium",
    status: "in-progress",
    dueDate: "2025-01-28",
    isBlocked: false,
  },
  {
    id: "3",
    title: "Configurar CI/CD pipeline",
    assignee: "David Martín",
    estimatedHours: 6,
    completedHours: 6,
    priority: "high",
    status: "completed",
    dueDate: "2025-01-22",
    isBlocked: false,
  },
  {
    id: "4",
    title: "Testing automatizado E2E",
    assignee: "Miguel Torres",
    estimatedHours: 10,
    completedHours: 0,
    priority: "critical",
    status: "not-started",
    dueDate: "2025-01-30",
    isBlocked: true,
  },
  {
    id: "5",
    title: "Optimización de performance",
    assignee: "Sofia Ruiz",
    estimatedHours: 8,
    completedHours: 3,
    priority: "medium",
    status: "in-progress",
    dueDate: "2025-01-26",
    isBlocked: false,
  },
  {
    id: "6",
    title: "Documentación API",
    assignee: "Luis González",
    estimatedHours: 4,
    completedHours: 4,
    priority: "low",
    status: "completed",
    dueDate: "2025-01-21",
    isBlocked: false,
  }
]

export function CurrentSprint() {
  const [sprintTasks, setSprintTasks] = useState<SprintTask[]>(mockSprintTasks)

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
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "not-started":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Play className="h-4 w-4" />
      case "not-started":
        return <Pause className="h-4 w-4" />
      default:
        return <Pause className="h-4 w-4" />
    }
  }

  const updateTaskStatus = (taskId: string, newStatus: SprintTask["status"]) => {
    setSprintTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const updateTaskProgress = (taskId: string, completedHours: number) => {
    setSprintTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task

      const updatedCompletedHours = Math.min(completedHours, task.estimatedHours)
      let newStatus: SprintTask["status"]

      if (updatedCompletedHours >= task.estimatedHours) {
        newStatus = "completed"
      } else if (updatedCompletedHours > 0) {
        newStatus = "in-progress"
      } else {
        newStatus = "not-started"
      }

      return {
        ...task,
        completedHours: updatedCompletedHours,
        status: newStatus
      }
    }))
  }

  // Calculate sprint metrics
  const totalTasks = sprintTasks.length
  const completedTasks = sprintTasks.filter(task => task.status === "completed").length
  const inProgressTasks = sprintTasks.filter(task => task.status === "in-progress").length
  const blockedTasks = sprintTasks.filter(task => task.isBlocked).length

  const totalEstimatedHours = sprintTasks.reduce((acc, task) => acc + task.estimatedHours, 0)
  const totalCompletedHours = sprintTasks.reduce((acc, task) => acc + task.completedHours, 0)
  const sprintProgress = totalEstimatedHours > 0 ? (totalCompletedHours / totalEstimatedHours) * 100 : 0

  // Sprint dates (mock)
  const sprintStartDate = "2025-01-20"
  const sprintEndDate = "2025-01-31"
  const daysRemaining = Math.ceil((new Date(sprintEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="p-6 space-y-6">
      {/* Sprint Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Sprint #7 - Q1 2025</h1>
          <p className="text-gray-600">
            {sprintStartDate} - {sprintEndDate} • {daysRemaining} days remaining
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
            <Zap className="h-4 w-4 mr-1" />
            Active Sprint
          </Badge>
        </div>
      </div>

      {/* Sprint Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedTasks}/{totalTasks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
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
                <p className="text-sm text-gray-600">Blocked</p>
                <p className="text-2xl font-bold text-red-600">{blockedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hours</p>
                <p className="text-2xl font-bold">
                  {totalCompletedHours}h/{totalEstimatedHours}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sprint Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Sprint Progress</span>
            <Badge className="ml-2">
              {sprintProgress.toFixed(0)}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={sprintProgress} className="w-full h-2" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{totalCompletedHours} hours completed</span>
            <span>{totalEstimatedHours - totalCompletedHours} hours remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Task Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Not Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-700">
              <Pause className="h-5 w-5" />
              <span>Not Started</span>
              <Badge variant="outline">
                {sprintTasks.filter(task => task.status === "not-started").length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sprintTasks
              .filter(task => task.status === "not-started")
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={updateTaskStatus}
                  onProgressChange={updateTaskProgress}
                  getPriorityColor={getPriorityColor}
                />
              ))}
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <Play className="h-5 w-5" />
              <span>In Progress</span>
              <Badge variant="outline">
                {sprintTasks.filter(task => task.status === "in-progress").length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sprintTasks
              .filter(task => task.status === "in-progress")
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={updateTaskStatus}
                  onProgressChange={updateTaskProgress}
                  getPriorityColor={getPriorityColor}
                />
              ))}
          </CardContent>
        </Card>

        {/* Completed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span>Completed</span>
              <Badge variant="outline">
                {sprintTasks.filter(task => task.status === "completed").length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sprintTasks
              .filter(task => task.status === "completed")
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={updateTaskStatus}
                  onProgressChange={updateTaskProgress}
                  getPriorityColor={getPriorityColor}
                />
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface TaskCardProps {
  readonly task: SprintTask
  readonly onStatusChange: (taskId: string, status: SprintTask["status"]) => void
  readonly onProgressChange: (taskId: string, completedHours: number) => void
  readonly getPriorityColor: (priority: string) => string
}

function TaskCard({ task, onStatusChange, onProgressChange, getPriorityColor }: TaskCardProps) {
  const progress = task.estimatedHours > 0 ? (task.completedHours / task.estimatedHours) * 100 : 0
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed"

  const handleProgressUpdate = (increment: number) => {
    const newCompletedHours = Math.max(0, task.completedHours + increment)
    onProgressChange(task.id, newCompletedHours)
  }

  return (
    <Card className={`hover:shadow-md transition-shadow ${task.isBlocked ? 'border-red-300 bg-red-50' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
            {task.isBlocked && (
              <Badge variant="destructive" className="text-xs shrink-0 ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Blocked
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge className={getPriorityColor(task.priority)} variant="outline">
              {task.priority.toUpperCase()}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {task.assignee.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{task.assignee}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span>{task.completedHours}h / {task.estimatedHours}h</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-1">
            {task.status === "not-started" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(task.id, "in-progress")}
                className="text-xs"
              >
                Start
              </Button>
            )}

            {task.status === "in-progress" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleProgressUpdate(1)}
                  className="text-xs"
                >
                  +1h
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(task.id, "completed")}
                  className="text-xs"
                >
                  Complete
                </Button>
              </>
            )}

            {task.status === "completed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(task.id, "in-progress")}
                className="text-xs"
              >
                Reopen
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
