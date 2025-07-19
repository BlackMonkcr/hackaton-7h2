"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { Plus, Clock, BookOpen, Users, Lightbulb } from "lucide-react"

interface ScheduleEvent {
  id: string
  title: string
  type: "class" | "extracurricular" | "available"
  day: string
  startTime: string
  endTime: string
  description?: string
}

export function PersonalScheduleTab() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: "1",
      title: "Cálculo Diferencial",
      type: "class",
      day: "monday",
      startTime: "08:00",
      endTime: "10:00",
      description: "Aula 201",
    },
    {
      id: "2",
      title: "Física Cuántica",
      type: "class",
      day: "monday",
      startTime: "10:30",
      endTime: "12:30",
      description: "Laboratorio A",
    },
    {
      id: "3",
      title: "Programación Web",
      type: "class",
      day: "tuesday",
      startTime: "14:00",
      endTime: "16:00",
      description: "Sala de Cómputo",
    },
    {
      id: "4",
      title: "Fútbol Universitario",
      type: "extracurricular",
      day: "wednesday",
      startTime: "17:00",
      endTime: "19:00",
      description: "Campo deportivo",
    },
    {
      id: "5",
      title: "Tiempo libre para estudiar",
      type: "available",
      day: "thursday",
      startTime: "15:00",
      endTime: "18:00",
      description: "Biblioteca",
    },
  ])

  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "class" as const,
    day: "monday",
    startTime: "",
    endTime: "",
    description: "",
  })

  const days = [
    { value: "monday", label: "Lunes" },
    { value: "tuesday", label: "Martes" },
    { value: "wednesday", label: "Miércoles" },
    { value: "thursday", label: "Jueves" },
    { value: "friday", label: "Viernes" },
    { value: "saturday", label: "Sábado" },
    { value: "sunday", label: "Domingo" },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "class":
        return <BookOpen className="h-4 w-4" />
      case "extracurricular":
        return <Users className="h-4 w-4" />
      case "available":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-500"
      case "extracurricular":
        return "bg-green-500"
      case "available":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "class":
        return "Clase"
      case "extracurricular":
        return "Extracurricular"
      case "available":
        return "Tiempo libre"
      default:
        return type
    }
  }

  const addEvent = () => {
    if (newEvent.title && newEvent.startTime && newEvent.endTime) {
      const event: ScheduleEvent = {
        id: Date.now().toString(),
        ...newEvent,
      }
      setEvents([...events, event])
      setNewEvent({
        title: "",
        type: "class",
        day: "monday",
        startTime: "",
        endTime: "",
        description: "",
      })
      setIsAddingEvent(false)
    }
  }

  const groupedEvents = events.reduce(
    (acc, event) => {
      if (!acc[event.day]) {
        acc[event.day] = []
      }
   //   acc[event.day].push(event)
      return acc
    },
    {} as Record<string, ScheduleEvent[]>,
  )

  // Sort events by start time
  Object.keys(groupedEvents).forEach((day) => {
  //  groupedEvents[day].sort((a, b) => a.startTime.localeCompare(b.startTime))
  })

  const availableSlots = events.filter((e) => e.type === "available").length
  const suggestions = [
    "Tienes clase de Física Cuántica el lunes. ¿Te gustaría programar tiempo de estudio después?",
    "Detectamos 3 horas libres el jueves. Perfecto para trabajar en tu proyecto de programación.",
    "Tu horario está más libre por las tardes. Considera programar actividades de estudio entonces.",
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Side - Calendar and Add Event */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendario Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Agregar Evento</span>
              <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo evento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Nombre del evento"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(value: any) => setNewEvent({ ...newEvent, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class">Clase</SelectItem>
                          <SelectItem value="extracurricular">Extracurricular</SelectItem>
                          <SelectItem value="available">Tiempo libre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="day">Día</Label>
                      <Select value={newEvent.day} onValueChange={(value) => setNewEvent({ ...newEvent, day: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day.value} value={day.value}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">Hora inicio</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newEvent.startTime}
                          onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">Hora fin</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newEvent.endTime}
                          onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Input
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Ubicación o detalles adicionales"
                      />
                    </div>
                    <Button onClick={addEvent} className="w-full">
                      Agregar evento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Middle - Weekly Schedule */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Horario Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {days.map((day) => (
                <div key={day.value}>
                  <h3 className="font-medium text-sm mb-2">{day.label}</h3>
                  <div className="space-y-2">
                    {groupedEvents[day.value]?.map((event) => (
                      <div key={event.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getEventIcon(event.type)}
                            <span className="text-sm font-medium">{event.title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {event.startTime} - {event.endTime}
                            {event.description && ` • ${event.description}`}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                    )) || <div className="text-sm text-muted-foreground italic p-2">Sin eventos programados</div>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - AI Analysis and Suggestions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>Análisis Inteligente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{events.filter((e) => e.type === "class").length}</div>
                <div className="text-xs text-muted-foreground">Clases semanales</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{availableSlots}</div>
                <div className="text-xs text-muted-foreground">Bloques libres</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Ventanas de tiempo libre detectadas:</h4>
              <div className="space-y-1">
                {events
                  .filter((e) => e.type === "available")
                  .map((slot) => (
                    <div key={slot.id} className="text-xs p-2 bg-orange-50 border border-orange-200 rounded">
                      <strong>{days.find((d) => d.value === slot.day)?.label}:</strong> {slot.startTime} -{" "}
                      {slot.endTime}
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>💡</span>
              <span>Sugerencias Contextuales</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm">{suggestion}</p>
                  <Button size="sm" variant="outline" className="mt-2 text-xs bg-transparent">
                    Programar automáticamente
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
