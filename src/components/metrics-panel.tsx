"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import {
  X,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Target,
  Calendar,
} from "lucide-react"

interface MetricsPanelProps {
  onClose: () => void
}

export function MetricsPanel({ onClose }: MetricsPanelProps) {
  const metrics = {
    productivity: {
      current: 87,
      previous: 82,
      trend: "up",
    },
    sprintCompletion: {
      current: 75,
      previous: 68,
      trend: "up",
    },
    teamEfficiency: {
      current: 92,
      previous: 95,
      trend: "down",
    },
    clientSatisfaction: {
      current: 94,
      previous: 91,
      trend: "up",
    },
  }

  const weeklyStats = {
    tasksCompleted: 24,
    hoursWorked: 156,
    meetingsHeld: 8,
    blockers: 2,
  }

  const teamPerformance = [
    { name: "Ana García", completed: 8, assigned: 10, efficiency: 85 },
    { name: "Carlos López", completed: 12, assigned: 15, efficiency: 78 },
    { name: "María Rodríguez", completed: 6, assigned: 7, efficiency: 95 },
    { name: "David Martín", completed: 4, assigned: 6, efficiency: 88 },
  ]

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[85vh] overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span>Panel de Métricas</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Productividad</span>
                  {getTrendIcon(metrics.productivity.trend)}
                </div>
                <div className="text-2xl font-bold">{metrics.productivity.current}%</div>
                <div className={`text-sm ${getTrendColor(metrics.productivity.trend)}`}>
                  {metrics.productivity.trend === "up" ? "+" : ""}
                  {metrics.productivity.current - metrics.productivity.previous}% vs semana anterior
                </div>
                <Progress value={metrics.productivity.current} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Sprint Completion</span>
                  {getTrendIcon(metrics.sprintCompletion.trend)}
                </div>
                <div className="text-2xl font-bold">{metrics.sprintCompletion.current}%</div>
                <div className={`text-sm ${getTrendColor(metrics.sprintCompletion.trend)}`}>
                  {metrics.sprintCompletion.trend === "up" ? "+" : ""}
                  {metrics.sprintCompletion.current - metrics.sprintCompletion.previous}% vs anterior
                </div>
                <Progress value={metrics.sprintCompletion.current} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Eficiencia Equipo</span>
                  {getTrendIcon(metrics.teamEfficiency.trend)}
                </div>
                <div className="text-2xl font-bold">{metrics.teamEfficiency.current}%</div>
                <div className={`text-sm ${getTrendColor(metrics.teamEfficiency.trend)}`}>
                  {metrics.teamEfficiency.trend === "up" ? "+" : ""}
                  {metrics.teamEfficiency.current - metrics.teamEfficiency.previous}% vs anterior
                </div>
                <Progress value={metrics.teamEfficiency.current} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Satisfacción Cliente</span>
                  {getTrendIcon(metrics.clientSatisfaction.trend)}
                </div>
                <div className="text-2xl font-bold">{metrics.clientSatisfaction.current}%</div>
                <div className={`text-sm ${getTrendColor(metrics.clientSatisfaction.trend)}`}>
                  {metrics.clientSatisfaction.trend === "up" ? "+" : ""}
                  {metrics.clientSatisfaction.current - metrics.clientSatisfaction.previous}% vs anterior
                </div>
                <Progress value={metrics.clientSatisfaction.current} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Resumen Semanal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold">{weeklyStats.tasksCompleted}</div>
                  <div className="text-sm text-gray-600">Tareas Completadas</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold">{weeklyStats.hoursWorked}h</div>
                  <div className="text-sm text-gray-600">Horas Trabajadas</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold">{weeklyStats.meetingsHeld}</div>
                  <div className="text-sm text-gray-600">Reuniones</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold">{weeklyStats.blockers}</div>
                  <div className="text-sm text-gray-600">Bloqueadores</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Rendimiento del Equipo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformance.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{member.name}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {member.completed}/{member.assigned} tareas
                          </Badge>
                          <Badge
                            className={
                              member.efficiency >= 90
                                ? "bg-green-100 text-green-800"
                                : member.efficiency >= 80
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {member.efficiency}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(member.completed / member.assigned) * 100} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights and Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Insights y Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Tendencia Positiva</span>
                </div>
                <p className="text-sm text-green-700">
                  La productividad del equipo ha aumentado un 5% esta semana. El nuevo proceso de daily standups está
                  funcionando bien.
                </p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-800">Área de Mejora</span>
                </div>
                <p className="text-sm text-orange-700">
                  Carlos López tiene sobrecarga de trabajo. Considera redistribuir 2-3 tareas a otros miembros del
                  equipo.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Recomendación</span>
                </div>
                <p className="text-sm text-blue-700">
                  Implementa bloques de "focus time" de 2-3 horas sin reuniones para aumentar la productividad en tareas
                  complejas.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
