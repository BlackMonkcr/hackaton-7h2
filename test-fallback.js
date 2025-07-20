// Prueba simple para verificar que el fallback funciona
import { createFallbackProject } from "../src/server/api/routers/project";

const testFormData = {
  titulo_proyecto: "Test Project",
  descripcion_proyecto: "Test Description",
  fecha_inicio: "2025-01-27",
  semanas_requeridas: 8,
  personal_disponible: "1 Developer, 1 Designer",
  rubro_laboral: "Technology",
  tareas_resolver: "Frontend, Backend, Testing",
  prioridad_tareas: "MVP first",
  presupuesto: "$50,000",
  restricciones: "Remote team"
};

console.log("Testing fallback project generation...");
const result = createFallbackProject(testFormData);
console.log(JSON.stringify(result, null, 2));
