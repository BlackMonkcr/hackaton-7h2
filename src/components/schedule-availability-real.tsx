"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Calendar, Clock, Users, MapPin, Video, Phone, AlertCircle } from "lucide-react"

interface ScheduleEvent {
  id: string
  title: string
  type: "meeting" | "focus-time" | "break" | "deadline" | "call"
  start: string
  end: string
  attendees?: string[]
  location?: string
  description?: string
  isUrgent?: boolean
  color: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  availability: "available" | "busy" | "away" | "focus"
  currentTask?: string
  nextAvailable?: string
}

// Mock data for today's schedule
const mockTodaySchedule: ScheduleEvent[] = [
  {
    id: "1",
    title: "Daily Standup",
    type: "meeting",
    start: "09:00",
    end: "09:30",
    attendees: ["Carlos López", "Ana García", "David Martín"],
    location: "Conference Room A",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "2",
    title: "Focus Time - OAuth Implementation",
    type: "focus-time",
    start: "09:30",
    end: "12:00",
    description: "Deep work on authentication system",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "3",
    title: "Lunch Break",
    type: "break",
    start: "12:00",
    end: "13:00",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "4",
    title: "Client Call - TechCorp",
    type: "call",
    start: "14:00",
    end: "15:00",
    attendees: ["Ana García", "Project Manager"],
    description: "Project milestone review",
    isUrgent: true,
    color: "bg-red-100 text-red-800",
  },
  {
    id: "5",
    title: "Code Review Session",
    type: "meeting",
    start: "15:30",
    end: "16:30",
    attendees: ["Miguel Torres", "Sofia Ruiz"],
    location: "Virtual - Zoom",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "6",
    title: "Sprint Planning Prep",
    type: "focus-time",
    start: "16:30",
    end: "18:00",
    description: "Prepare for next sprint planning",
    color: "bg-purple-100 text-purple-800",
  },
]

// Mock data for team availability
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Carlos López",
    role: "Backend Developer",
    availability: "busy",
    currentTask: "OAuth Implementation",
    nextAvailable: "12:00",
  },
  {
    id: "2",
    name: "Ana García",
    role: "Frontend Developer",
    availability: "available",
    currentTask: undefined,
    nextAvailable: undefined,
  },
  {
    id: "3",
    name: "David Martín",
    role: "DevOps Engineer",
    availability: "focus",
    currentTask: "CI/CD Pipeline",
    nextAvailable: "15:00",
  },
  {
    id: "4",
    name: "Miguel Torres",
    role: "QA Engineer",
    availability: "available",
    currentTask: undefined,
    nextAvailable: undefined,
  },
  {
    id: "5",
    name: "Sofia Ruiz",
    role: "Full Stack Developer",
    availability: "busy",
    currentTask: "Performance Optimization",
    nextAvailable: "11:30",
  },
  {
    id: "6",
    name: "Luis González",
    role: "Technical Writer",
    availability: "away",
    currentTask: undefined,
    nextAvailable: "14:00",
  },
]

export function ScheduleAvailability() {
  const [todaySchedule] = useState<ScheduleEvent[]>(mockTodaySchedule)
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  const getAvailabilityColor = (availability: TeamMember["availability"]) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-red-100 text-red-800"
      case "focus":
        return "bg-purple-100 text-purple-800"
      case "away":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAvailabilityIcon = (availability: TeamMember["availability"]) => {
    switch (availability) {
      case "available":
        return "🟢"
      case "busy":
        return "🔴"
      case "focus":
        return "🟣"
      case "away":
        return "⚫"
      default:
        return "⚫"
    }
  }

  const getEventIcon = (type: ScheduleEvent["type"]) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />
      case "call":
        return <Phone className="h-4 w-4" />
      case "focus-time":
        return <Clock className="h-4 w-4" />
      case "break":
        return <Clock className="h-4 w-4" />
      case "deadline":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const availableNow = teamMembers.filter(member => member.availability === "available").length
  const totalMembers = teamMembers.length
  const busyMembers = teamMembers.filter(member => member.availability === "busy").length
  const focusMembers = teamMembers.filter(member => member.availability === "focus").length

  // Generate time slots for scheduling
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const isBooked = todaySchedule.some(event => {
          const eventStart = event.start
          const eventEnd = event.end
          return timeString >= eventStart && timeString < eventEnd
        })
        slots.push({
          time: timeString,
          available: !isBooked,
        })
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Schedule & Availability</h1>
          <p className="text-gray-600">
            Today, {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* Team Availability Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Now</p>
                <p className="text-2xl font-bold text-green-600">
                  {availableNow}/{totalMembers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Meetings</p>
                <p className="text-2xl font-bold text-red-600">{busyMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertCircle className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Focus Time</p>
                <p className="text-2xl font-bold text-purple-600">{focusMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Events Today</p>
                <p className="text-2xl font-bold text-blue-600">{todaySchedule.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySchedule.map((event) => (
              <div
                key={event.id}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="flex-shrink-0 mt-1">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium truncate">{event.title}</h4>
                    {event.isUrgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                    <Badge className={event.color} variant="outline">
                      {event.type.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.start} - {event.end}</span>
                    </div>

                    {event.location && (
                      <div className="flex items-center space-x-1">
                        {event.location.includes('Virtual') || event.location.includes('Zoom') ? (
                          <Video className="h-3 w-3" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex -space-x-1">
                        {event.attendees.slice(0, 3).map((attendee) => (
                          <Avatar key={attendee} className="h-5 w-5 border-2 border-white">
                            <AvatarFallback className="text-xs">
                              {attendee.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {event.attendees.length > 3 && (
                          <div className="h-5 w-5 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{event.attendees.length - 3}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-600">
                        {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {event.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Team Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Team Availability</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm">{getAvailabilityIcon(member.availability)}</span>
                    <Badge className={getAvailabilityColor(member.availability)} variant="outline">
                      {member.availability.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>

                  {member.currentTask && (
                    <p className="text-xs text-gray-600 mb-1">
                      Working on: {member.currentTask}
                    </p>
                  )}

                  {member.nextAvailable && (
                    <p className="text-xs text-gray-600">
                      Available at: {member.nextAvailable}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Time Slot Finder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Find Available Time Slot</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={slot.available ? "outline" : "secondary"}
                size="sm"
                disabled={!slot.available}
                onClick={() => setSelectedTimeSlot(slot.time)}
                className={`text-xs h-8 ${
                  selectedTimeSlot === slot.time ? 'ring-2 ring-blue-500' : ''
                } ${
                  slot.available ? 'hover:bg-green-50' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {slot.time}
              </Button>
            ))}
          </div>

          {selectedTimeSlot && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-blue-900">
                  Selected time: {selectedTimeSlot}
                </p>
                <Button size="sm">
                  Schedule Meeting
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 mt-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-white border rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span>Busy</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
