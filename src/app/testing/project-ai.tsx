"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

const SAMPLE_PROJECT_JSON = `{
  "proyecto": "Plataforma E-commerce con Recomendaciones Personalizadas IA",
  "fecha_inicio": "2025-01-27",
  "duracion_semanas": 8,
  "equipo": {
    "Product Manager": 1,
    "Frontend Developers": 2,
    "Backend Developer": 1,
    "Data Scientist": 1,
    "UX/UI Designer": 1
  },
  "plan_trabajo": {
    "fases": [
      {
        "nombre": "MVP Básico",
        "duracion": "2 semanas",
        "entregables": ["Diseño UI/UX", "Backend API básica", "Frontend web", "Carrito de compras"],
        "tareas": [
          {
            "descripcion": "Diseño de interfaz y experiencia de usuario",
            "responsable": "UX/UI Designer",
            "fecha_inicio": "2025-01-27 09:00",
            "fecha_fin": "2025-01-31 18:00"
          },
          {
            "descripcion": "Desarrollo API principal y configuración de base de datos",
            "responsable": "Backend Developer",
            "fecha_inicio": "2025-01-30 09:00",
            "fecha_fin": "2025-02-05 18:00"
          },
          {
            "descripcion": "Implementación frontend para catálogo de productos",
            "responsable": "Frontend Developers",
            "fecha_inicio": "2025-02-03 09:00",
            "fecha_fin": "2025-02-07 18:00"
          }
        ]
      },
      {
        "nombre": "Sistema de Recomendaciones IA",
        "duracion": "3 semanas",
        "entregables": ["Modelo de IA entrenado", "Integración con backend", "Interfaz de recomendaciones"],
        "tareas": [
          {
            "descripcion": "Recolección y limpieza de datos históricos",
            "responsable": "Data Scientist",
            "fecha_inicio": "2025-02-10 09:00",
            "fecha_fin": "2025-02-14 18:00"
          },
          {
            "descripcion": "Desarrollo y entrenamiento del modelo de recomendación",
            "responsable": "Data Scientist",
            "fecha_inicio": "2025-02-17 09:00",
            "fecha_fin": "2025-02-21 18:00"
          },
          {
            "descripcion": "Integración del modelo con API backend",
            "responsable": "Backend Developer",
            "fecha_inicio": "2025-02-24 09:00",
            "fecha_fin": "2025-02-28 18:00"
          }
        ]
      },
      {
        "nombre": "Features Avanzados",
        "duracion": "3 semanas",
        "entregables": ["Integración de pagos", "Perfiles de usuario", "Búsqueda inteligente"],
        "tareas": [
          {
            "descripcion": "Implementación de pasarela de pagos",
            "responsable": "Backend Developer",
            "fecha_inicio": "2025-03-03 09:00",
            "fecha_fin": "2025-03-07 18:00"
          },
          {
            "descripcion": "Desarrollo de sistema de perfiles de usuario",
            "responsable": "Frontend Developers",
            "fecha_inicio": "2025-03-10 09:00",
            "fecha_fin": "2025-03-14 18:00"
          },
          {
            "descripcion": "Optimización de rendimiento para tráfico alto",
            "responsable": "Backend Developer",
            "fecha_inicio": "2025-03-17 09:00",
            "fecha_fin": "2025-03-21 18:00"
          }
        ]
      }
    ],
    "cronograma": {
      "revisiones": [
        {
          "descripcion": "Revisión de diseño UI/UX",
          "fecha": "2025-01-31 16:00"
        },
        {
          "descripcion": "Demo primera versión funcional",
          "fecha": "2025-02-07 11:00"
        },
        {
          "descripcion": "Validación modelo de IA",
          "fecha": "2025-02-21 14:00"
        }
      ]
    }
  },
  "asignacion_recursos": {
    "presupuesto_distribucion": {
      "MVP Básico": 13500,
      "Sistema IA": 18000,
      "Features Avanzados": 13500
    },
    "horarios": {
      "oficina": ["Lunes", "Miércoles", "Viernes"],
      "remoto": ["Martes", "Jueves"]
    }
  },
  "riesgos": [
    {
      "descripcion": "Retrasos en entrenamiento del modelo IA",
      "impacto": "Alto",
      "mitigacion": "Revisiones diarias con Data Scientist"
    },
    {
      "descripcion": "Problemas de integración con pasarelas de pago",
      "impacto": "Medio",
      "mitigacion": "Pruebas paralelas con múltiples proveedores"
    }
  ]
}`;

export function ProjectAITest() {
  const [token, setToken] = useState<string>("");
  const [projectJson, setProjectJson] = useState<string>(SAMPLE_PROJECT_JSON);
  const [calendarName, setCalendarName] = useState<string>("");
  const [useExistingCalendar, setUseExistingCalendar] = useState<boolean>(false);
  const [existingCalendarId, setExistingCalendarId] = useState<string>("primary");
  const [lastCreatedProject, setLastCreatedProject] = useState<any>(null);

  // Cargar token desde localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Mutations y Queries
  const createProjectMutation = api.project.createFromAI.useMutation({
    onSuccess: (data) => {
      console.log("✅ Proyecto creado:", data);
      setLastCreatedProject(data.project);
      alert(`¡Proyecto creado exitosamente!\n\n${data.message}\n\nTareas creadas: ${data.project.tasksCreated}\nMilestones: ${data.project.milestonesCreated}\nEventos en calendario: ${data.project.calendarEventsCreated}`);
    },
    onError: (error) => {
      console.error("❌ Error creando proyecto:", error);
      alert(`Error: ${error.message}`);
    },
  });

  const { data: projectsData, refetch: getProjects } = api.project.getProjects.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const { data: projectDetails, refetch: getProjectDetails } = api.project.getProjectDetails.useQuery(
    { token, projectId: selectedProjectId },
    { enabled: !!token && !!selectedProjectId, retry: false }
  );

  // Handlers
  const handleCreateProject = () => {
    if (!token) {
      alert("Primero ingresa tu token de autenticación");
      return;
    }

    try {
      const projectData = JSON.parse(projectJson);

      createProjectMutation.mutate({
        token,
        projectData,
        calendarName: calendarName || undefined,
        useExistingCalendar,
        existingCalendarId: useExistingCalendar ? existingCalendarId : undefined,
      });
    } catch (error) {
      alert("Error: JSON inválido. Verifica el formato.");
      console.error("JSON parsing error:", error);
    }
  };

  const handleLoadSample = () => {
    setProjectJson(SAMPLE_PROJECT_JSON);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(projectJson);
      setProjectJson(JSON.stringify(parsed, null, 2));
    } catch (error) {
      console.error("JSON formatting error:", error);
      alert("Error: JSON inválido. No se pudo formatear.");
    }
  };

  const handleLoadProjects = () => {
    if (token) {
      getProjects();
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    getProjectDetails();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">🤖 Creación de Proyectos con IA</h1>

      {/* Token de autenticación */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">🔑 Token de Autenticación</h2>
        <input
          type="text"
          placeholder="Ingresa tu token de autenticación JWT"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={() => {
            const savedToken = localStorage.getItem("auth_token");
            if (savedToken) {
              setToken(savedToken);
              alert("Token cargado desde localStorage");
            } else {
              alert("No hay token guardado");
            }
          }}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
        >
          Cargar Token Guardado
        </button>
      </div>

      {/* Configuración de calendario */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold mb-4">📅 Configuración de Calendario</h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={!useExistingCalendar}
                onChange={() => setUseExistingCalendar(false)}
                className="mr-2"
              />
              Crear nuevo calendario
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={useExistingCalendar}
                onChange={() => setUseExistingCalendar(true)}
                className="mr-2"
              />
              Usar calendario existente
            </label>
          </div>

          {!useExistingCalendar && (
            <div>
              <label htmlFor="calendar-name" className="block text-sm font-medium mb-1">
                Nombre del nuevo calendario:
              </label>
              <input
                id="calendar-name"
                type="text"
                placeholder="Dejarlo vacío para generar automáticamente"
                value={calendarName}
                onChange={(e) => setCalendarName(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-600 mt-1">
                Si está vacío, se creará como "📋 [Nombre del Proyecto]"
              </p>
            </div>
          )}

          {useExistingCalendar && (
            <div>
              <label htmlFor="existing-calendar-id" className="block text-sm font-medium mb-1">
                ID del calendario:
              </label>
              <input
                id="existing-calendar-id"
                type="text"
                placeholder="primary"
                value={existingCalendarId}
                onChange={(e) => setExistingCalendarId(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-600 mt-1">
                Usa "primary" para el calendario principal o el ID específico del calendario
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Editor de JSON */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📝 Datos del Proyecto (JSON de IA)</h2>

        <div className="mb-4 space-x-2">
          <button
            onClick={handleLoadSample}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Cargar Ejemplo
          </button>
          <button
            onClick={handleFormatJson}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Formatear JSON
          </button>
        </div>

        <textarea
          value={projectJson}
          onChange={(e) => setProjectJson(e.target.value)}
          className="w-full h-96 p-3 border rounded font-mono text-sm"
          placeholder="Pega aquí el JSON generado por la IA..."
        />

        <div className="mt-4">
          <button
            onClick={handleCreateProject}
            disabled={createProjectMutation.isPending || !token}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 text-lg font-semibold"
          >
            {createProjectMutation.isPending ? "Creando Proyecto..." : "🚀 Crear Proyecto y Sincronizar con Calendario"}
          </button>
        </div>

        {lastCreatedProject && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold text-green-800">✅ Último proyecto creado:</h3>
            <div className="text-sm text-green-700 mt-2">
              <p><strong>Nombre:</strong> {lastCreatedProject.name}</p>
              <p><strong>ID:</strong> {lastCreatedProject.id}</p>
              <p><strong>Tareas creadas:</strong> {lastCreatedProject.tasksCreated}</p>
              <p><strong>Milestones:</strong> {lastCreatedProject.milestonesCreated}</p>
              <p><strong>Eventos en calendario:</strong> {lastCreatedProject.calendarEventsCreated}</p>
              <p><strong>Calendario ID:</strong> {lastCreatedProject.calendarId}</p>
            </div>
          </div>
        )}
      </div>

      {/* Lista de proyectos */}
      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📋 Proyectos Creados</h2>

        <button
          onClick={handleLoadProjects}
          disabled={!token}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 mb-4"
        >
          Cargar Proyectos
        </button>

        {projectsData?.projects && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {projectsData.projects.length === 0 ? (
              <p className="text-gray-500">No tienes proyectos creados</p>
            ) : (
              projectsData.projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-3 border rounded cursor-pointer ${
                    selectedProjectId === project.id ? 'bg-purple-100 border-purple-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <h4 className="font-semibold">{project.name}</h4>
                  <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
                    <p><strong>Tipo:</strong> {project.projectType}</p>
                    <p><strong>Categoría:</strong> {project.category}</p>
                    <p><strong>Tareas:</strong> {project.tasksCount}</p>
                    <p><strong>Milestones:</strong> {project.milestonesCount}</p>
                    <p><strong>Inicio:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Fin:</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-500 mt-2 truncate">{project.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Detalles del proyecto seleccionado */}
      {projectDetails && (
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">🔍 Detalles del Proyecto</h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">{projectDetails.project.name}</h3>
            <p className="text-gray-600">{projectDetails.project.description}</p>
          </div>

          {/* Tareas */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">📝 Tareas ({projectDetails.project.tasks.length})</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {projectDetails.project.tasks.map((task) => (
                <div key={task.id} className="p-2 bg-white rounded border-l-4 border-blue-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{task.title}</h5>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        <span className={`px-2 py-1 rounded ${
                          task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                        <span className="ml-2">Prioridad: {task.priority}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {task.startDate && (
                        <p>Inicio: {new Date(task.startDate).toLocaleDateString()}</p>
                      )}
                      {task.dueDate && (
                        <p>Fin: {new Date(task.dueDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h4 className="font-semibold mb-2">🎯 Milestones ({projectDetails.project.milestones.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {projectDetails.project.milestones.map((milestone) => (
                <div key={milestone.id} className="p-2 bg-white rounded border-l-4 border-red-400">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">{milestone.title}</h5>
                      {milestone.description && (
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Fecha: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                      <span className={`px-2 py-1 rounded ${
                        milestone.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {milestone.isCompleted ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectAITest;
