"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/auth-context"

interface ModeSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const modes = [
  {
    id: "students",
    icon: "📘",
    title: "Estudiantes universitarios",
    description: "Organiza entregables, avances y cargas académicas en grupo.",
    color: "border-blue-200 hover:border-blue-400",
  },
  {
    id: "startups",
    icon: "🚀",
    title: "Startups",
    description: "Planifica tareas, responde rápido al cambio y maximiza tu tiempo.",
    color: "border-purple-200 hover:border-purple-400",
  },
  {
    id: "pymes",
    icon: "🏢",
    title: "PyMEs",
    description: "Gestiona operaciones sin necesidad de sistemas complejos.",
    color: "border-orange-200 hover:border-orange-400",
  },
  {
    id: "enterprise",
    icon: "🌐",
    title: "Empresas grandes",
    description: "Optimiza recursos y equipos a gran escala con inteligencia integrada.",
    color: "border-green-200 hover:border-green-400",
  },
]

export function ModeSelectionModal({ open, onOpenChange }: ModeSelectionModalProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  const handleModeSelect = (modeId: string) => {
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir al registro con el modo seleccionado
      router.push(`/register?mode=${modeId}`)
    } else {
      // Si está autenticado, ir directamente al dashboard correspondiente
      router.push(`/modo/${modeId}`)
    }
    onOpenChange(false)
  }

  const getRecommendedMode = () => {
    if (!user) return null
    
    if (user.university) return "students"
    if (user.companyName) return "pymes"
    return "startups"
  }

  const recommendedMode = getRecommendedMode()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold mb-2">
            {isAuthenticated ? "¿A dónde quieres ir?" : "¿Cómo quieres usar Planner B?"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {isAuthenticated 
              ? "Selecciona el modo que mejor se adapte a tu trabajo actual."
              : "Selecciona un modo de uso para adaptar la experiencia a tu perfil."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {modes.map((mode) => (
            <Card
              key={mode.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${mode.color} ${
                recommendedMode === mode.id ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={() => handleModeSelect(mode.id)}
            >
              <CardHeader className="text-center pb-3">
                <div className="text-3xl mb-2">{mode.icon}</div>
                <CardTitle className="text-lg">
                  {mode.title}
                  {recommendedMode === mode.id && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Recomendado
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4 text-sm leading-relaxed">{mode.description}</CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={(e: any) => {
                    e.stopPropagation()
                    handleModeSelect(mode.id)
                  }}
                >
                  {isAuthenticated ? "Ir al Dashboard" : "Comenzar"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isAuthenticated && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              ¿Ya tienes una cuenta?
            </p>
            <Button variant="ghost" onClick={() => {
              router.push("/login")
              onOpenChange(false)
            }}>
              Iniciar sesión
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
