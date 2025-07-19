"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Progress } from "./ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Download,
  FileText,
  Target,
  Activity,
} from "lucide-react"

const sectionData = [
  { name: "Mantenimiento", productivity: 85, completion: 92, workload: 78, risk: "Bajo" },
  { name: "Logística", productivity: 78, completion: 88, workload: 95, risk: "Alto" },
  { name: "Producción", productivity: 92, completion: 95, workload: 85, risk: "Medio" },
  { name: "Administración", productivity: 88, completion: 90, workload: 65, risk: "Bajo" },
  { name: "Comercial", productivity: 82, completion: 85, workload: 72, risk: "Bajo" },
]

const individualData = [
  { name: "Juan Pérez", section: "Mantenimiento", tasksCompleted: 12, tasksTotal: 15, efficiency: 88, workload: 80 },
  { name: "María García", section: "Logística", tasksCompleted: 8, tasksTotal: 8, efficiency: 95, workload: 100 },
  { name: "Carlos López", section: "Producción", tasksCompleted: 14, tasksTotal: 16, efficiency: 92, workload: 75 },
]

export function ReportsIndicators() {
  const [reportPeriod, setReportPeriod] = useState("month")
  const [selectedSection, setSelectedSection] = useState("all")

  const getRiskColor = (risk: any) => {
    switch (risk) {
      case "Alto":
        return "bg-red-100 text-red-800"
      case "Medio":
        return "bg-yellow-100 text-yellow-800"
      case "Bajo":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportReport = (format:any) => {
    console.log(`Exportando reporte en formato ${format}`)
    // In a real app, this would generate and download the report
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reportes e Indicadores</h2>
          <p className="text-muted-foreground">Análisis de productividad y rendimiento empresarial</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport("excel")}>
            <FileText className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => exportReport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                  <SelectItem value="year">Este año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sección</label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="logistica">Logística</SelectItem>
                  <SelectItem value="produccion">Producción</SelectItem>
                  <SelectItem value="administracion">Administración</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="sections">Por Secciones</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="risks">Análisis de Riesgos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productividad General</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+5%</span> vs mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-blue-600">+12</span> vs mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cumplimiento</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-purple-600">+3%</span> vs mes anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">+1</span> vs mes anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Placeholder */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Productividad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                    <p>Gráfico de tendencias de productividad mensual</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Tareas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Activity className="mx-auto h-12 w-12 mb-4" />
                    <p>Gráfico circular de distribución por secciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productividad por Sección</CardTitle>
              <CardDescription>Análisis detallado del rendimiento de cada área</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectionData.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{section.name}</h4>
                      <Badge className={getRiskColor(section.risk)}>Riesgo {section.risk}</Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Productividad</span>
                          <span className="text-sm font-medium">{section.productivity}%</span>
                        </div>
                        <Progress value={section.productivity} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Cumplimiento</span>
                          <span className="text-sm font-medium">{section.completion}%</span>
                        </div>
                        <Progress value={section.completion} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Carga de trabajo</span>
                          <span className="text-sm font-medium">{section.workload}%</span>
                        </div>
                        <Progress value={section.workload} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento Individual</CardTitle>
              <CardDescription>Análisis del desempeño de cada colaborador</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {individualData.map((person, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{person.name}</h4>
                        <p className="text-sm text-muted-foreground">{person.section}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {person.tasksCompleted}/{person.tasksTotal} tareas
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((person.tasksCompleted / person.tasksTotal) * 100)}% completadas
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Eficiencia</span>
                          <span className="text-sm font-medium">{person.efficiency}%</span>
                        </div>
                        <Progress value={person.efficiency} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Carga de trabajo</span>
                          <span className="text-sm font-medium">{person.workload}%</span>
                        </div>
                        <Progress value={person.workload} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Riesgos por Retraso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">Logística - Inventario</p>
                      <p className="text-sm text-red-700">Retraso de 2 días</p>
                    </div>
                    <Badge variant="destructive">Alto</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">Producción - Control calidad</p>
                      <p className="text-sm text-yellow-700">Posible retraso</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Medio</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  Riesgos por Saturación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-orange-900">María García</p>
                      <p className="text-sm text-orange-700">100% capacidad utilizada</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Alto</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">Sección Logística</p>
                      <p className="text-sm text-yellow-700">95% carga promedio</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Medio</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
