import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const features = [
  {
    icon: "🔄",
    title: "Planificación automática",
    description: "Algoritmos inteligentes que organizan tus tareas de forma óptima",
  },
  {
    icon: "🧠",
    title: "Inteligencia adaptativa",
    description: "Se adapta a tu forma de trabajar y mejora con el tiempo",
  },
  {
    icon: "📊",
    title: "Visualización de carga y tiempos",
    description: "Gráficos claros para entender tu capacidad y distribución",
  },
  {
    icon: "💡",
    title: "Recomendaciones inteligentes",
    description: "Sugerencias personalizadas para optimizar tu productividad",
  },
  {
    icon: "🧩",
    title: "Escalabilidad real",
    description: "Crece contigo desde proyectos pequeños hasta operaciones complejas",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Qué hace Planner B especial?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Características diseñadas para adaptarse a cualquier escala de proyecto
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center pb-3">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
