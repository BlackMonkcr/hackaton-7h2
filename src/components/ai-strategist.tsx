"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import { Brain, X, Send, TrendingUp, AlertTriangle, Target, Clock } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AIStrategistProps {
  onClose: () => void
}

export function AIStrategist({ onClose }: AIStrategistProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "¡Hola! Soy tu IA Estratega. Analizo tu startup y te ayudo con recomendaciones inteligentes. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
      suggestions: [
        "Analizar productividad del equipo",
        "Optimizar sprint actual",
        "Predecir riesgos del proyecto",
        "Sugerir mejoras de proceso",
      ],
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const quickActions = [
    {
      icon: TrendingUp,
      title: "Análisis de Productividad",
      description: "Evalúa el rendimiento del equipo",
      color: "bg-green-100 text-green-800",
    },
    {
      icon: AlertTriangle,
      title: "Detección de Riesgos",
      description: "Identifica posibles problemas",
      color: "bg-red-100 text-red-800",
    },
    {
      icon: Target,
      title: "Optimización de Tareas",
      description: "Mejora la asignación de trabajo",
      color: "bg-blue-100 text-blue-800",
    },
    {
      icon: Clock,
      title: "Predicción de Tiempos",
      description: "Estima duración de proyectos",
      color: "bg-orange-100 text-orange-800",
    },
  ]

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(inputMessage),
        timestamp: new Date(),
        suggestions: getAISuggestions(inputMessage),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("productividad") || lowerInput.includes("rendimiento")) {
      return "Basado en el análisis de tus datos, el equipo tiene una productividad del 87%. Carlos López está sobrecargado con 32h esta semana vs 24h promedio. Te recomiendo redistribuir 8h de sus tareas a Ana García, quien tiene capacidad disponible."
    }

    if (lowerInput.includes("riesgo") || lowerInput.includes("problema")) {
      return 'He detectado 3 riesgos principales: 1) La tarea "CI/CD pipeline" está bloqueada y puede retrasar el sprint. 2) El proyecto "App Mobile MVP" tiene 65% de progreso pero solo quedan 5 días. 3) Falta validación del cliente en 2 entregables críticos.'
    }

    if (lowerInput.includes("optimizar") || lowerInput.includes("mejorar")) {
      return 'Para optimizar tu startup, sugiero: 1) Implementar daily standups de 15 min máximo. 2) Agrupar reuniones similares en bloques de 2h. 3) Asignar "focus time" de 3h diarias sin interrupciones. 4) Usar pair programming para tareas complejas.'
    }

    return "Entiendo tu consulta. Basado en los datos de tu startup, puedo ayudarte a optimizar procesos, predecir riesgos y mejorar la productividad del equipo. ¿Te gustaría que analice algún aspecto específico?"
  }

  const getAISuggestions = (input: string): string[] => {
    return ["Ver análisis detallado", "Aplicar recomendaciones", "Generar reporte", "Configurar alertas"]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const handleQuickAction = (action: string) => {
    setInputMessage(action)
    sendMessage()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <span>IA Estratega</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Pro
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center space-y-2 bg-transparent"
                  onClick={() => handleQuickAction(action.title)}
                >
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-xs">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </Button>
              )
            })}
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 border rounded-lg p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs opacity-75">Sugerencias:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 bg-transparent"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">IA está escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Pregunta sobre tu startup, productividad, riesgos..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
