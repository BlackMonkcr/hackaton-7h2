"use client"

import { useState } from "react"
import { Brain, Calendar, Users, Zap, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

const planningData = {
  suggestions: [
    {
      id: 1,
      type: "optimization",
      priority: "Alta",
      title: "Optimización de Recursos - Producción Norte",
      description:
        "Se detectó sobrecarga en el turno matutino. Reasignar 3 tareas al turno nocturno aumentaría la eficiencia en 15%.",
      impact: "15% mejora eficiencia",
      department: "Producción Norte",
      estimatedSavings: 12000,
      implementationTime: "2 días",
    },
    {
      id: 2,
      type: "bottleneck",
      priority: "Alta",
      title: "Cuello de Botella Detectado - Mantenimiento",
      description:
        "El equipo de mantenimiento está saturado. Se recomienda contratar 2 técnicos adicionales o redistribuir tareas.",
      impact: "Reducir retrasos 40%",
      department: "Mantenimiento Norte",
      estimatedSavings: 8500,
      implementationTime: "1 semana",
    },
    {
      id: 3,
      type: "schedule",
      priority: "Media",
      title: "Reprogramación Automática - Proyecto ERP",
      description:
        "El proyecto ERP puede completarse 3 días antes si se asignan 2 desarrolladores adicionales de TI Sur.",
      impact: "Adelantar entrega 3 días",
      department: "TI Sur",
      estimatedSavings: 5000,
      implementationTime: "Inmediato",
    },
    {
      id: 4,
      type: "resource",
      priority: "Media",
      title: "Balanceo de Carga - Calidad Sur",
      description:
        "Planta Sur tiene capacidad ociosa en el área de calidad. Reasignar inspecciones de Planta Norte optimizaría recursos.",
      impact: "Utilización 95%",
      department: "Calidad Sur",
      estimatedSavings: 3200,
      implementationTime: "3 días",
    },
  ],
  predictions: [
    {
      id: 1,
      project: "Optimización Línea A",
      currentProgress: 75,
      predictedCompletion: "2024-06-28",
      originalDeadline: "2024-06-30",
      riskLevel: "Bajo",
      confidence: 92,
    },
    {
      id: 2,
      project: "Mantenimiento Preventivo Q1",
      currentProgress: 45,
      predictedCompletion: "2024-04-05",
      originalDeadline: "2024-03-31",
      riskLevel: "Alto",
      confidence: 87,
    },
    {
      id: 3,
      project: "Implementación ERP",
      currentProgress: 90,
      predictedCompletion: "2024-02-25",
      originalDeadline: "2024-02-28",
      riskLevel: "Bajo",
      confidence: 95,
    },
  ],
  workloadAnalysis: [
    {
      department: "Producción Norte",
      currentLoad: 95,
      optimalLoad: 85,
      status: "Sobrecargado",
      recommendation: "Redistribuir 3 tareas",
    },
    {
      department: "Producción Sur",
      currentLoad: 78,
      optimalLoad: 85,
      status: "Óptimo",
      recommendation: "Mantener asignación actual",
    },
    {
      department: "Mantenimiento Norte",
      currentLoad: 98,
      optimalLoad: 80,
      status: "Crítico",
      recommendation: "Contratar personal adicional",
    },
    {
      department: "TI Sur",
      currentLoad: 82,
      optimalLoad: 85,
      status: "Óptimo",
      recommendation: "Capacidad para tareas adicionales",
    },
    {
      department: "Calidad Sur",
      currentLoad: 65,
      optimalLoad: 80,
      status: "Subcargado",
      recommendation: "Asignar tareas adicionales",
    },
  ],
}

function SuggestionCard({ suggestion, onImplement, onDismiss }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case "optimization":
        return <TrendingUp className="h-5 w-5 text-blue-600" />
      case "bottleneck":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "schedule":
        return <Calendar className="h-5 w-5 text-green-600" />
      case "resource":
        return <Users className="h-5 w-5 text-purple-600" />
      default:
        return <Brain className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority) => {
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">{getTypeIcon(suggestion.type)}</div>
            <div>
              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
              <CardDescription className="mt-1">{suggestion.description}</CardDescription>
            </div>
          </div>
          <Badge variant={getPriorityColor(suggestion.priority)}>{suggestion.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Impacto:</span>
            <p className="font-medium text-green-600">{suggestion.impact}</p>
          </div>
          <div>
            <span className="text-gray-600">Departamento:</span>
            <p className="font-medium">{suggestion.department}</p>
          </div>
          <div>
            <span className="text-gray-600">Ahorro Estimado:</span>
            <p className="font-medium">${suggestion.estimatedSavings.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-600">Tiempo Implementación:</span>
            <p className="font-medium">{suggestion.implementationTime}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t">
          <Button size="sm" onClick={() => onImplement(suggestion)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Implementar
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDismiss(suggestion)}>
            Descartar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function WorkloadChart({ data }) {
  return (
    <div className="space-y-4">
      {data.map((dept, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{dept.department}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{dept.currentLoad}%</span>
              <Badge
                variant={
                  dept.status === "Crítico"
                    ? "destructive"
                    : dept.status === "Sobrecargado"
                      ? "destructive"
                      : dept.status === "Subcargado"
                        ? "secondary"
                        : "default"
                }
              >
                {dept.status}
              </Badge>
            </div>
          </div>
          <div className="relative">
            <Progress value={dept.currentLoad} className="h-3" />
            <div className="absolute top-0 h-3 w-1 bg-green-500 rounded" style={{ left: `${dept.optimalLoad}%` }} />
          </div>
          <p className="text-xs text-gray-600">{dept.recommendation}</p>
        </div>
      ))}
    </div>
  )
}

export default function PlannerPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const handleImplementSuggestion = (suggestion) => {
    console.log("Implementar sugerencia:", suggestion)
  }

  const handleDismissSuggestion = (suggestion) => {
    console.log("Descartar sugerencia:", suggestion)
  }

  const totalSavings = planningData.suggestions.reduce((sum, s) => sum + s.estimatedSavings, 0)
  const highPrioritySuggestions = planningData.suggestions.filter(s => s.priority === "Alta").length
  const avgConfidence = planningData.predictions.reduce((sum, p) => sum + p.confidence, 0) / planningData.predictions.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Planificador Inteligente
          </h1>
          <p className="text-gray-600">Motor de programación automática con IA avanzada</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos los departamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los departamentos</SelectItem>
              <SelectItem value="norte">Planta Norte</SelectItem>
              <SelectItem value="sur">Planta Sur</SelectItem>
              <SelectItem value="produccion">Producción</SelectItem>
              <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas del Planificador */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{planningData.suggestions.length}</p>
                <p className="text-sm text-gray-600">Sugerencias Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{highPrioritySuggestions}</p>
                <p className="text-sm text-gray-600">Prioridad Alta</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${totalSavings.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Ahorro Potencial</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{Math.round(avgConfidence)}%</p>
                <p className="text-sm text-gray-600">Confianza Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs del Planificador */}
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suggestions">Sugerencias IA</TabsTrigger>
          <TabsTrigger value="predictions">Predicciones</TabsTrigger>
          <TabsTrigger value="workload">Análisis de Carga</TabsTrigger>
          <TabsTrigger value="schedule">Programación</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sugerencias de Optimización</CardTitle>
              <CardDescription>
                Recomendaciones generadas automáticamente por el motor de IA
              </CardDescription>
            </CardHeader>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {planningData.suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onImplement={handleImplementSuggestion}
                onDismiss={handleDismissSuggestion}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predicciones de Proyectos</CardTitle>
              <CardDescription>
                Análisis predictivo del progreso y fechas de finalización
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Progreso Actual</TableHead>
                    <TableHead>Finalización Predicha</TableHead>
                    <TableHead>Fecha Original</TableHead>
                    <TableHead>Riesgo</TableHead>
                    <TableHead>Confianza</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planningData.predictions.map((prediction) => (
                    <TableRow key={prediction.id}>
                      <TableCell className="font-medium">{prediction.project}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={prediction.currentProgress} className="w-20" />
                          <span className="text-sm">{prediction.currentProgress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(prediction.predictedCompletion).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(prediction.originalDeadline).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          prediction.riskLevel === "Alto" ? "destructive" :
                          prediction.riskLevel === "Medio" ? "default" : "secondary"
                        }>
                          {prediction.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>{prediction.confidence}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Carga de Trabajo</CardTitle>
              <CardDescription>
                Distribución actual de recursos por departamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkloadChart data={planningData.workloadAnalysis} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-gray-600">Departamentos Sobrecargados</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-gray-600">Departamentos Óptimos</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">1</div>
                  <div className="text-sm text-gray-600">Departamentos Subcargados</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Programación Automática</CardTitle>
              <CardDescription>
                Vista de calendario inteligente con asignaciones optimizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                  <div key={day} className="text-center font-medium text-sm text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className="aspect-square border rounded p-1 text-xs">
                    <div className="font-medium">{((i % 31) + 1)}</div>
                    {i % 7 < 5 && i > 6 && (
                      <div className="mt-1 space-y-1">
                        {i % 3 === 0 && <div className="bg-blue-100 text-blue-800 px-1 rounded text-xs">Prod</div>}
                        {i % 4 === 0 && <div className="bg-green-100 text-green-800 px-1 rounded text-xs">Mant</div>}
                        {i % 5 === 0 && <div className="bg-purple-100 text-purple-800 px-1 rounded text-xs">TI</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Asignaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div>
                      <p className="font-medium">Mantenimiento Bomba A</p>
                      <p className="text-sm text-gray-600">Mañana 08:00 - Carlos Ruiz</p>
                    </div>
                    <Badge>Programado</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div>
                      <p className="font-medium">Inspección Calidad Lote 001</p>
                      <p className="text-sm text-gray-600">Miércoles 10:00 - María López</p>
                    </div>
                    <Badge>Programado</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                    <div>
                      <p className="font-medium">Actualización Sistema</p>
                      <p className="text-sm text-gray-600">Viernes 18:00 - Diego Herrera</p>
                \
