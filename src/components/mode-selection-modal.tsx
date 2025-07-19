"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

import { useRouter } from "next/navigation"

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
  const router = useRouter();

  const handleModeSelect = (modeId: string) => {
    console.log(`Selected mode: ${modeId}`)
    router.push(`/modo/${modeId}`)
    // Aquí puedes agregar la lógica para redirigir o configurar el modo
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold mb-2">¿Cómo quieres usar Planner B?</DialogTitle>
          <DialogDescription className="text-base">
            Selecciona un modo de uso para adaptar la experiencia a tu perfil.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {modes.map((mode) => (
            <Card
              key={mode.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${mode.color}`}
              onClick={() => handleModeSelect(mode.id)}
            >
              <CardHeader className="text-center pb-3">
                <div className="text-3xl mb-2">{mode.icon}</div>
                <CardTitle className="text-lg">{mode.title}</CardTitle>
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
                  Seleccionar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
