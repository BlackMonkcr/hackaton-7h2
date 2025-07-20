"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface AIProjectGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

export function AIProjectGenerator({ isOpen, onClose, token }: AIProjectGeneratorProps) {
  const [formData, setFormData] = useState({
    titulo_proyecto: "",
    descripcion_proyecto: "",
    fecha_inicio: "",
    semanas_requeridas: 8,
    personal_disponible: "",
    rubro_laboral: "",
    tareas_resolver: "",
    prioridad_tareas: "",
    presupuesto: "",
    restricciones: "",
  });

  const [calendarConfig, setCalendarConfig] = useState({
    calendarName: "",
    useExistingCalendar: false,
    existingCalendarId: "primary",
  });

  const [generatedProject, setGeneratedProject] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const generateProjectMutation = api.project.generateWithAI.useMutation({
    onSuccess: (data) => {
      console.log("✅ Proyecto generado:", data);
      setGeneratedProject(data);
      setShowResults(true);
    },
    onError: (error) => {
      console.error("❌ Error generando proyecto:", error);
      alert(`Error: ${error.message}`);
    },
  });

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateProject = () => {
    if (!token) {
      alert("Token de autenticación requerido");
      return;
    }

    // Validar campos requeridos
    const requiredFields = ['titulo_proyecto', 'descripcion_proyecto', 'fecha_inicio', 'personal_disponible', 'rubro_laboral'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      alert(`Por favor completa los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }

    generateProjectMutation.mutate({
      token,
      formData,
      ...calendarConfig,
    });
  };

  const handleLoadSample = () => {
    const today = new Date();
    const startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // +1 semana

    setFormData({
      titulo_proyecto: "Plataforma E-commerce con IA",
      descripcion_proyecto: "Desarrollo de una plataforma e-commerce con recomendaciones personalizadas usando inteligencia artificial",
      fecha_inicio: startDate.toISOString().split('T')[0],
      semanas_requeridas: 12,
      personal_disponible: "1 Product Manager, 2 Frontend Developers, 1 Backend Developer, 1 Data Scientist, 1 UX/UI Designer, 1 QA Tester",
      rubro_laboral: "Tecnología/E-commerce",
      tareas_resolver: "Diseño UI/UX, Backend API, Frontend web, Sistema de recomendaciones IA, Integración de pagos, Testing, Documentación",
      prioridad_tareas: "MVP básico primero (catálogo, carrito, pagos), luego sistema de recomendaciones IA, finalmente features avanzadas",
      presupuesto: "$75,000 USD",
      restricciones: "Equipo distribuido remotamente, debe estar listo para temporada navideña, compliance con GDPR",
    });
  };

  const resetForm = () => {
    setFormData({
      titulo_proyecto: "",
      descripcion_proyecto: "",
      fecha_inicio: "",
      semanas_requeridas: 8,
      personal_disponible: "",
      rubro_laboral: "",
      tareas_resolver: "",
      prioridad_tareas: "",
      presupuesto: "",
      restricciones: "",
    });
    setGeneratedProject(null);
    setShowResults(false);
  };

  if (showResults && generatedProject) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🎉 Proyecto Generado con IA
              <Badge variant="secondary" className="text-green-700 bg-green-100">
                Éxito
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Resumen del proyecto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{generatedProject.project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Tareas creadas:</strong> {generatedProject.project.tasksCreated}</p>
                    <p><strong>Milestones:</strong> {generatedProject.project.milestonesCreated}</p>
                  </div>
                  <div>
                    <p><strong>Eventos en calendario:</strong> {generatedProject.project.calendarEventsCreated}</p>
                    <p><strong>ID del proyecto:</strong> {generatedProject.project.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tareas generadas */}
            {generatedProject.project.aiResponse?.tareas && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📝 Tareas Generadas ({generatedProject.project.aiResponse.tareas.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {generatedProject.project.aiResponse.tareas.slice(0, 10).map((tarea: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{tarea.nombre}</h4>
                          <div className="flex gap-2">
                            <Badge variant={
                              tarea.prioridad === 'alta' ? 'destructive' :
                              tarea.prioridad === 'media' ? 'default' : 'secondary'
                            }>
                              {tarea.prioridad}
                            </Badge>
                            <Badge variant="outline">{tarea.tipo_tarea}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{tarea.descripcion}</p>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                          <p><strong>Responsable:</strong> {tarea.responsable_principal}</p>
                          <p><strong>Inicio:</strong> {tarea.fecha_inicio}</p>
                          <p><strong>Duración:</strong> {tarea.duracion_horas}h</p>
                        </div>
                      </div>
                    ))}
                    {generatedProject.project.aiResponse.tareas.length > 10 && (
                      <p className="text-center text-sm text-gray-500">
                        ... y {generatedProject.project.aiResponse.tareas.length - 10} tareas más
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Eventos de calendario */}
            {generatedProject.project.aiResponse?.eventos_calendar && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📅 Eventos de Calendario ({generatedProject.project.aiResponse.eventos_calendar.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {generatedProject.project.aiResponse.eventos_calendar.map((evento: any, index: number) => (
                      <div key={index} className="p-2 border rounded flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-sm">{evento.titulo}</h5>
                          <p className="text-xs text-gray-600">{evento.descripcion}</p>
                        </div>
                        <div className="text-right text-xs">
                          <Badge variant={
                            evento.tipo === 'milestone' ? 'destructive' :
                            evento.tipo === 'reunion' ? 'default' : 'secondary'
                          }>
                            {evento.tipo}
                          </Badge>
                          <p className="text-gray-500 mt-1">
                            {new Date(evento.fecha_inicio).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Riesgos identificados */}
            {generatedProject.project.aiResponse?.riesgos_identificados && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">⚠️ Riesgos Identificados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {generatedProject.project.aiResponse.riesgos_identificados.map((riesgo: any, index: number) => (
                      <div key={index} className="p-2 border rounded">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-sm">{riesgo.descripcion}</p>
                          <Badge variant={
                            riesgo.probabilidad === 'alta' ? 'destructive' :
                            riesgo.probabilidad === 'media' ? 'default' : 'secondary'
                          }>
                            {riesgo.probabilidad}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600"><strong>Mitigación:</strong> {riesgo.mitigacion}</p>
                        <p className="text-xs text-gray-500"><strong>Responsable:</strong> {riesgo.responsable_seguimiento}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setShowResults(false)}>
                Volver al Formulario
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Generar Nuevo Proyecto
                </Button>
                <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                  Finalizar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🤖 Generar Proyecto con IA
            <Badge variant="outline">Azure AI</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del proyecto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📋 Información del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titulo">Título del Proyecto *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo_proyecto}
                    onChange={(e) => handleInputChange('titulo_proyecto', e.target.value)}
                    placeholder="Ej: Plataforma E-commerce con IA"
                  />
                </div>
                <div>
                  <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción del Proyecto *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion_proyecto}
                  onChange={(e) => handleInputChange('descripcion_proyecto', e.target.value)}
                  placeholder="Describe detalladamente el proyecto..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="semanas">Duración (semanas)</Label>
                  <Input
                    id="semanas"
                    type="number"
                    min="1"
                    max="52"
                    value={formData.semanas_requeridas}
                    onChange={(e) => handleInputChange('semanas_requeridas', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="presupuesto">Presupuesto</Label>
                  <Input
                    id="presupuesto"
                    value={formData.presupuesto}
                    onChange={(e) => handleInputChange('presupuesto', e.target.value)}
                    placeholder="Ej: $50,000 USD"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recursos y personal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">👥 Recursos y Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="personal">Personal Disponible *</Label>
                <Textarea
                  id="personal"
                  value={formData.personal_disponible}
                  onChange={(e) => handleInputChange('personal_disponible', e.target.value)}
                  placeholder="Ej: 1 Product Manager, 2 Frontend Developers, 1 Backend Developer, 1 UX Designer"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="rubro">Rubro Laboral *</Label>
                <Input
                  id="rubro"
                  value={formData.rubro_laboral}
                  onChange={(e) => handleInputChange('rubro_laboral', e.target.value)}
                  placeholder="Ej: Tecnología/Startups, Salud, Finanzas"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tareas y prioridades */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📝 Tareas y Prioridades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tareas">Tareas a Resolver</Label>
                <Textarea
                  id="tareas"
                  value={formData.tareas_resolver}
                  onChange={(e) => handleInputChange('tareas_resolver', e.target.value)}
                  placeholder="Ej: Diseño UI/UX, Backend API, Frontend web, Testing, Documentación"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="prioridades">Prioridad de Tareas</Label>
                <Textarea
                  id="prioridades"
                  value={formData.prioridad_tareas}
                  onChange={(e) => handleInputChange('prioridad_tareas', e.target.value)}
                  placeholder="Ej: MVP básico primero, luego features avanzadas"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="restricciones">Restricciones Especiales</Label>
                <Textarea
                  id="restricciones"
                  value={formData.restricciones}
                  onChange={(e) => handleInputChange('restricciones', e.target.value)}
                  placeholder="Ej: Equipo remoto, deadline específico, compliance requerido"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configuración de calendario */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📅 Configuración de Calendario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!calendarConfig.useExistingCalendar}
                    onChange={() => setCalendarConfig(prev => ({ ...prev, useExistingCalendar: false }))}
                    className="mr-2"
                  />
                  Crear nuevo calendario
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={calendarConfig.useExistingCalendar}
                    onChange={() => setCalendarConfig(prev => ({ ...prev, useExistingCalendar: true }))}
                    className="mr-2"
                  />
                  Usar calendario existente
                </label>
              </div>

              {!calendarConfig.useExistingCalendar ? (
                <div>
                  <Label htmlFor="calendar-name">Nombre del nuevo calendario</Label>
                  <Input
                    id="calendar-name"
                    value={calendarConfig.calendarName}
                    onChange={(e) => setCalendarConfig(prev => ({ ...prev, calendarName: e.target.value }))}
                    placeholder="Dejarlo vacío para generar automáticamente"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="existing-calendar">ID del calendario existente</Label>
                  <Input
                    id="existing-calendar"
                    value={calendarConfig.existingCalendarId}
                    onChange={(e) => setCalendarConfig(prev => ({ ...prev, existingCalendarId: e.target.value }))}
                    placeholder="primary"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Botones de acción */}
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <Button variant="outline" onClick={handleLoadSample}>
                📋 Cargar Ejemplo
              </Button>
              <Button variant="outline" onClick={resetForm}>
                🔄 Limpiar Formulario
              </Button>
            </div>

            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleGenerateProject}
                disabled={generateProjectMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {generateProjectMutation.isPending ? (
                  <>🔄 Generando...</>
                ) : (
                  <>🚀 Generar Proyecto con IA</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
