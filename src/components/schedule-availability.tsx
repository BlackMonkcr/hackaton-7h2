"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Calendar, Clock, Users, Plus, ChevronLeft, ChevronRight, Video, Coffee, Briefcase, Brain } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  type: "meeting" | "work-block" | "break" | "focus-time"
  start: string
  end: string
  attendees?: string[]
  color: string
}

interface TeamMember {
  id: string
  name: string
  avatar: string
  availability: "available" | "busy" | "away"
  workingHours: string
}

export function ScheduleAvailability() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedView, setSelectedView] = useState<"week" | "day">("week")

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Ana García",
      avatar: "AG",
      availability: "available",
      workingHours: "9:00 - 18:00",
    },
    {
      id: "2",
      name: "Carlos López",
      avatar: "CL",
      availability: "busy",
      workingHours: "8:00 - 17:00",
    },
    {
      id: "3",
      name: "María Rodríguez",
      avatar: "MR",
      availability: "available",
      workingHours: "10:00 - 19:00",
    },
    {
      id: "4",
      name: "David Martín",
      avatar: "DM",
      availability: "away",
      workingHours: "9:00 - 18:00",
    },
  ])

  const [events] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Daily Standup",
      type: "meeting",
      start: "09:00",
      end: "09:30",
      attendees: ["Ana García", "Carlos López", "María Rodríguez"],
      color: "bg-blue-500",
    },
    {
      id: "2",
      title: "Desarrollo Frontend",
      type: "work-block",
      start: "10:00",
      end: "12:00",
      color: "bg-green-500",
    },
    {
      id: "3",
      title: "Revisión de Código",
      type: "meeting",
      start: "14:00",
      end: "15:00",
      attendees: ["Carlos López", "David Martín"],
      color: "bg-purple-500",
    },
    {
      id: "4",
      title: "Focus Time - Design",
      type: "focus-time",
      start: "15:30",
      end: "17:30",
      color: "bg-orange-500",
    },
  ])

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`)

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-red-100 text-red-800"
      case "away":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Video className="h-3 w-3" />
      case "work-block":
        return <Briefcase className="h-3 w-3" />
      case "break":
        return <Coffee className="h-3 w-3" />
      case "focus-time":
        return <Brain className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Team Availability Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Disponibilidad</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{member.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.workingHours}</p>
                    <Badge className={getAvailabilityColor(member.availability)} variant="secondary">
                      {member.availability === "available"
                        ? "Disponible"
                        : member.availability === "busy"
                          ? "Ocupado"
                          : "Ausente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Sugerencias IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Mejor momento para reunión</h4>
                <p className="text-sm text-blue-800">Martes 10:00-11:00 AM - Todos disponibles con menor conflicto</p>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Bloques de foco</h4>
                <p className="text-sm text-green-800">
                  Desarrollo: 9:00-12:00
                  <br />
                  Diseño: 14:00-17:00
                  <br />
                  Marketing: 15:00-18:00
                </p>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Optimización</h4>
                <p className="text-sm text-orange-800">
                  Reagrupar 3 reuniones cortas en una sesión de 1.5h para mayor eficiencia
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Main View */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Agenda del Equipo</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={selectedView === "week" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedView("week")}
                    >
                      Semana
                    </Button>
                    <Button
                      variant={selectedView === "day" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedView("day")}
                    >
                      Día
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">Enero 15-21, 2024</span>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Evento
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week View */}
              {selectedView === "week" && (
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Header with days */}
                    <div className="grid grid-cols-8 gap-1 mb-4">
                      <div className="p-2"></div>
                      {weekDays.map((day, index) => (
                        <div key={day} className="p-2 text-center">
                          <div className="font-medium">{day}</div>
                          <div className="text-sm text-gray-600">{15 + index}</div>
                        </div>
                      ))}
                    </div>

                    {/* Time slots */}
                    <div className="space-y-1">
                      {timeSlots.map((time) => (
                        <div key={time} className="grid grid-cols-8 gap-1">
                          <div className="p-2 text-sm text-gray-600 text-right">{time}</div>
                          {weekDays.map((day) => (
                            <div key={`${day}-${time}`} className="p-1 border border-gray-100 min-h-12 relative">
                              {/* Sample events */}
                              {time === "9:00" && day === "Lun" && (
                                <div className="absolute inset-1 bg-blue-500 text-white text-xs p-1 rounded flex items-center space-x-1">
                                  <Video className="h-3 w-3" />
                                  <span>Daily</span>
                                </div>
                              )}
                              {time === "10:00" && day === "Mar" && (
                                <div className="absolute inset-1 bg-green-500 text-white text-xs p-1 rounded flex items-center space-x-1">
                                  <Briefcase className="h-3 w-3" />
                                  <span>Dev</span>
                                </div>
                              )}
                              {time === "14:00" && day === "Mié" && (
                                <div className="absolute inset-1 bg-purple-500 text-white text-xs p-1 rounded flex items-center space-x-1">
                                  <Video className="h-3 w-3" />
                                  <span>Review</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Day View */}
              {selectedView === "day" && (
                <div className="space-y-2">
                  <h3 className="font-medium mb-4">Lunes, 15 Enero 2024</h3>
                  {events.map((event) => (
                    <Card key={event.id} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${event.color} text-white`}>{getEventIcon(event.type)}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-600">
                            {event.start} - {event.end}
                          </p>
                          {event.attendees && (
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex -space-x-2">
                                {event.attendees.slice(0, 3).map((attendee, index) => (
                                  <Avatar key={index} className="h-6 w-6 border-2 border-white">
                                    <AvatarFallback className="text-xs">
                                      {attendee
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{event.attendees.length} participantes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">8</div>
                <div className="text-sm text-gray-600">Reuniones esta semana</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">32h</div>
                <div className="text-sm text-gray-600">Tiempo de foco disponible</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">85%</div>
                <div className="text-sm text-gray-600">Utilización del equipo</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
