"use client"

import { BarChart3, LineChart, Radio, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card"
import { Progress } from "./ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Badge } from "./ui/badge"

/**
 * Simple placeholder dashboard for “Indicadores clave y reportes”.
 * Replace mock data with live analytics when ready.
 */
export default function ReportsPage() {
  const kpis = [
    { name: "Productividad Global", value: 92, target: 95, unit: "%" },
    { name: "Órdenes a Tiempo", value: 88, target: 90, unit: "%" },
    { name: "Utilización de Recursos", value: 84, target: 85, unit: "%" },
    { name: "Cumplimiento Presupuestal", value: 91, target: 93, unit: "%" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-blue-600" />
          Indicadores Clave & Reportes
        </h1>
        <Badge variant="secondary">Vista General</Badge>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{kpi.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.value}
                {kpi.unit}
              </div>
              <Progress value={kpi.value} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Meta: {kpi.target}
                {kpi.unit}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for additional reports */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">
            <TrendingUp className="mr-1 h-4 w-4" />
            Rendimiento
          </TabsTrigger>
          <TabsTrigger value="quality">
            <Radio className="mr-1 h-4 w-4" />
            Calidad
          </TabsTrigger>
          <TabsTrigger value="financial">
            <LineChart className="mr-1 h-4 w-4" />
            Financiero
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Rendimiento</CardTitle>
              <CardDescription>Resumen de productividad y eficiencia.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Coloque aquí su gráfico o tabla real; usando marcador de posición */}
              <div className="aspect-video rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground">
                Gráfico de rendimiento (placeholder)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Calidad</CardTitle>
              <CardDescription>Índices de defectos y auditorías.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground">
                Gráfico de calidad (placeholder)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Reporte Financiero</CardTitle>
              <CardDescription>Comparativo de presupuesto vs. gasto real.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground">
                Gráfico financiero (placeholder)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
