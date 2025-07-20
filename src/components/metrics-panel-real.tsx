"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { X, BarChart3, TrendingUp, TrendingDown, Target, Users, Calendar, Clock } from "lucide-react"

interface MetricsPanelProps {
  readonly onClose: () => void
}

interface Metric {
  id: string
  name: string
  value: number
  previousValue: number
  unit: string
  trend: "up" | "down" | "stable"
  category: "productivity" | "quality" | "timeline" | "team"
  target?: number
  description: string
}

// Mock metrics data
const mockMetrics: Metric[] = [
  {
    id: "1",
    name: "Sprint Velocity",
    value: 32,
    previousValue: 28,
    unit: "story points",
    trend: "up",
    category: "productivity",
    target: 35,
    description: "Promedio de story points completados por sprint"
  },
  {
    id: "2",
    name: "Burn Rate",
    value: 85,
    previousValue: 78,
    unit: "%",
    trend: "up",
    category: "timeline",
    target: 90,
    description: "Porcentaje de tareas completadas según planificación"
  },
  {
    id: "3",
    name: "Code Quality Score",
    value: 87,
    previousValue: 92,
    unit: "/100",
    trend: "down",
    category: "quality",
    target: 95,
    description: "Puntuación basada en tests, coverage y code review"
  },
  {
    id: "4",
    name: "Team Satisfaction",
    value: 4.2,
    previousValue: 4.1,
    unit: "/5.0",
    trend: "up",
    category: "team",
    target: 4.5,
    description: "Encuesta semanal de satisfacción del equipo"
  },
  {
    id: "5",
    name: "Bug Resolution Time",
    value: 2.3,
    previousValue: 2.8,
    unit: "days",
    trend: "up",
    category: "quality",
    target: 2.0,
    description: "Tiempo promedio para resolver bugs reportados"
  },
  {
    id: "6",
    name: "Feature Delivery Rate",
    value: 12,
    previousValue: 10,
    unit: "features/month",
    trend: "up",
    category: "productivity",
    target: 15,
    description: "Número de features entregadas por mes"
  },
  {
    id: "7",
    name: "Technical Debt",
    value: 23,
    previousValue: 27,
    unit: "hours",
    trend: "up",
    category: "quality",
    target: 15,
    description: "Tiempo estimado para resolver deuda técnica"
  },
  {
    id: "8",
    name: "Meeting Efficiency",
    value: 78,
    previousValue: 72,
    unit: "%",
    trend: "up",
    category: "productivity",
    target: 85,
    description: "Porcentaje de reuniones que terminan a tiempo con objetivos claros"
  }
]

export function MetricsPanel({ onClose }: MetricsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week")

  const categories = [
    { id: "all", name: "Todas", count: mockMetrics.length },
    { id: "productivity", name: "Productividad", count: mockMetrics.filter(m => m.category === "productivity").length },
    { id: "quality", name: "Calidad", count: mockMetrics.filter(m => m.category === "quality").length },
    { id: "timeline", name: "Cronograma", count: mockMetrics.filter(m => m.category === "timeline").length },
    { id: "team", name: "Equipo", count: mockMetrics.filter(m => m.category === "team").length },
  ]

  const periods = [
    { id: "day", name: "Hoy" },
    { id: "week", name: "Esta semana" },
    { id: "month", name: "Este mes" },
    { id: "quarter", name: "Trimestre" },
  ]

  const filteredMetrics = selectedCategory === "all"
    ? mockMetrics
    : mockMetrics.filter(metric => metric.category === selectedCategory)

  const getTrendIcon = (trend: Metric["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getTrendColor = (trend: Metric["trend"], isImprovement: boolean) => {
    if (trend === "stable") return "text-gray-600"

    // For some metrics, "up" might be bad (like bug resolution time)
    if (isImprovement) {
      return trend === "up" ? "text-green-600" : "text-red-600"
    } else {
      return trend === "up" ? "text-red-600" : "text-green-600"
    }
  }

  const isMetricImprovement = (metric: Metric): boolean => {
    // For these metrics, higher is better
    const higherIsBetter = ["Sprint Velocity", "Burn Rate", "Code Quality Score", "Team Satisfaction", "Feature Delivery Rate", "Meeting Efficiency"]
    return higherIsBetter.includes(metric.name)
  }

  const getProgressValue = (metric: Metric): number => {
    if (!metric.target) return 0
    return Math.min((metric.value / metric.target) * 100, 100)
  }

  const getProgressColor = (metric: Metric): string => {
    const progress = getProgressValue(metric)
    if (progress >= 90) return "bg-green-500"
    if (progress >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Calculate overview stats
  const metricsOnTarget = filteredMetrics.filter(m => m.target && m.value >= m.target).length
  const metricsImproving = filteredMetrics.filter(m => {
    const isImproving = isMetricImprovement(m) ? m.value > m.previousValue : m.value < m.previousValue
    return isImproving
  }).length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl h-[85vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Panel de Métricas</CardTitle>
              <p className="text-sm text-gray-600">
                Análisis de rendimiento y KPIs del proyecto
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Controls */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Category Filters */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Categoría:</span>
                <div className="flex flex-wrap gap-1">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="text-xs"
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Period Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Período:</span>
                <div className="flex gap-1">
                  {periods.map((period) => (
                    <Button
                      key={period.id}
                      variant={selectedPeriod === period.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period.id)}
                      className="text-xs"
                    >
                      {period.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="p-4 border-b">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">En objetivo</p>
                      <p className="text-lg font-bold text-green-600">
                        {metricsOnTarget}/{filteredMetrics.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Mejorando</p>
                      <p className="text-lg font-bold text-blue-600">
                        {metricsImproving}/{filteredMetrics.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Equipo activo</p>
                      <p className="text-lg font-bold text-purple-600">6/6</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Sprint actual</p>
                      <p className="text-lg font-bold text-orange-600">7 días</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMetrics.map((metric) => {
                const isImprovement = isMetricImprovement(metric)
                const trendColor = getTrendColor(metric.trend, isImprovement)
                const progressValue = getProgressValue(metric)
                const progressColor = getProgressColor(metric)

                return (
                  <Card key={metric.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm leading-tight">
                              {metric.name}
                            </h4>
                            <Badge variant="outline" className="text-xs mt-1 capitalize">
                              {metric.category}
                            </Badge>
                          </div>
                          {getTrendIcon(metric.trend)}
                        </div>

                        {/* Value */}
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {metric.value}
                            <span className="text-sm font-normal text-gray-600 ml-1">
                              {metric.unit}
                            </span>
                          </div>
                          <div className={`text-xs flex items-center justify-center space-x-1 mt-1 ${trendColor}`}>
                            <span>
                              {metric.value > metric.previousValue ? '+' : ''}
                              {(metric.value - metric.previousValue).toFixed(1)}
                            </span>
                            <span className="text-gray-500">vs anterior</span>
                          </div>
                        </div>

                        {/* Progress to target */}
                        {metric.target && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Progreso al objetivo</span>
                              <span>{metric.target} {metric.unit}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className={`h-1 rounded-full transition-all ${progressColor}`}
                                style={{ width: `${progressValue}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600 text-center">
                              {progressValue.toFixed(0)}% del objetivo
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {metric.description}
                        </p>

                        {/* Actions */}
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" className="text-xs flex-1">
                            <Clock className="h-3 w-3 mr-1" />
                            Histórico
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs flex-1">
                            <Target className="h-3 w-3 mr-1" />
                            Ajustar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Última actualización: {new Date().toLocaleString()}
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Exportar Reporte
                </Button>
                <Button size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Configurar Alertas
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
