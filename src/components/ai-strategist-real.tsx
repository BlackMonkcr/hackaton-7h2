"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Brain, X, Send, TrendingUp, AlertTriangle, Target, Lightbulb, Zap } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AIStrategistProps {
  readonly onClose: () => void
}

const mockAIResponses: { [key: string]: string } = {
  "productividad": "📊 **Análisis de Productividad:**\n\n• Tu equipo completó 85% de las tareas del sprint actual\n• Velocidad promedio: 32 story points por sprint\n• Ana García es el miembro más productivo esta semana\n• Recomendación: Considera aumentar el tiempo de focus para Carlos\n\n💡 **Sugerencias:**\n- Implementar bloques de 2h de trabajo profundo\n- Reducir reuniones los martes y jueves\n- Usar pair programming para tareas complejas",

  "sprint": "🎯 **Optimización del Sprint Actual:**\n\n• 4 tareas en progreso, 2 completadas\n• Riesgo detectado: Testing automatizado bloqueado\n• Estimación: 75% probabilidad de completar el sprint\n\n⚡ **Acciones recomendadas:**\n- Priorizar desbloquer testing (asignar a Miguel)\n- Mover 'Documentación API' al próximo sprint\n- Programar code review para mañana 3pm",

  "riesgos": "⚠️ **Predicción de Riesgos:**\n\n🔴 **Alto riesgo:**\n- OAuth implementation: 3 días de retraso\n- Dependencia externa sin resolver\n\n🟡 **Riesgo medio:**\n- Sobrecarga de trabajo de Ana García\n- Deadline del cliente TechCorp muy ajustado\n\n✅ **Acciones preventivas:**\n- Contactar equipo de infraestructura hoy\n- Redistribuir 2 tareas de Ana a David\n- Preparar plan de contingencia para TechCorp",

  "mejoras": "🚀 **Mejoras de Proceso Sugeridas:**\n\n📈 **Basado en datos de los últimos 3 sprints:**\n\n1. **Daily Standups** - Reducir de 30min a 15min\n2. **Code Reviews** - Implementar checklist automatizada\n3. **Testing** - Aumentar cobertura del 65% al 85%\n4. **Documentación** - Usar templates estandarizados\n\n🎯 **ROI esperado:** +25% productividad en 2 sprints",

  "default": "🤖 Entiendo tu consulta. Basándome en el análisis de tu startup, aquí tienes algunas recomendaciones:\n\n• **Sprint actual:** Todo en track, considera mover 1 tarea no crítica\n• **Equipo:** Productividad óptima, Ana necesita apoyo\n• **Próximos pasos:** Focus en testing automatizado\n\n¿Te gustaría que profundice en algún aspecto específico?"
}

export function AIStrategist({ onClose }: AIStrategistProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "¡Hola! 🤖 Soy tu IA Estratega. Analizo tu startup y te ayudo con recomendaciones inteligentes basadas en datos reales de tu proyecto. ¿En qué puedo ayudarte hoy?",
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
      keyword: "productividad",
    },
    {
      icon: Target,
      title: "Optimizar Sprint",
      description: "Mejora la planificación actual",
      color: "bg-blue-100 text-blue-800",
      keyword: "sprint",
    },
    {
      icon: AlertTriangle,
      title: "Predicción de Riesgos",
      description: "Identifica problemas potenciales",
      color: "bg-red-100 text-red-800",
      keyword: "riesgos",
    },
    {
      icon: Lightbulb,
      title: "Mejoras de Proceso",
      description: "Optimiza tu flujo de trabajo",
      color: "bg-purple-100 text-purple-800",
      keyword: "mejoras",
    },
  ]

  const findResponseKeyword = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    for (const key of Object.keys(mockAIResponses)) {
      if (key === "default") continue
      if (lowerMessage.includes(key)) return key

      const matchingAction = quickActions.find(action =>
        action.keyword === key && message.includes(action.title)
      )
      if (matchingAction) return key
    }

    return "default"
  }

  const handleSendMessage = (message: string) => {
    if (!message.trim() && !inputMessage.trim()) return

    const userMessage = message || inputMessage
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newUserMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const keyword = findResponseKeyword(userMessage)
      const aiResponse = mockAIResponses[keyword]

      if (!aiResponse) return // Should not happen due to default fallback

      const newAIMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
        suggestions: [
          "¿Puedes ser más específico?",
          "Analizar otro aspecto",
          "Generar plan de acción",
          "Exportar recomendaciones",
        ],
      }

      setMessages(prev => [...prev, newAIMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: typeof quickActions[0]) => {
    handleSendMessage(action.title)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>IA Estratega</CardTitle>
              <p className="text-sm text-gray-600">
                Asistente inteligente para tu startup
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Quick Actions */}
          <div className="p-4 border-b bg-gray-50">
            <h3 className="text-sm font-medium mb-3">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className="h-auto p-3 flex flex-col items-start space-y-1 hover:shadow-sm"
                >
                  <div className="flex items-center space-x-2 w-full">
                    <div className={`p-1.5 rounded ${action.color}`}>
                      <action.icon className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-medium truncate">
                      {action.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 text-left line-clamp-2">
                    {action.description}
                  </p>
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.type === "user"
                      ? "bg-blue-600 text-white rounded-lg rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-lg rounded-bl-sm"
                  } p-4`}
                >
                  {message.type === "ai" && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600">
                        IA Estratega
                      </span>
                    </div>
                  )}

                  <div
                    className="text-sm whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/• /g, '• ')
                        .replace(/(\d+\.)/g, '<strong>$1</strong>')
                    }}
                  />

                  {message.suggestions && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium opacity-75">
                        Sugerencias:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs h-6 px-2"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs opacity-50 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-sm p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">
                      IA Estratega
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Pregúntame sobre productividad, riesgos, optimizaciones..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage("")}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage("")}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                💡 Tip: Usa las acciones rápidas para obtener análisis específicos
              </p>
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Powered by IA
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
