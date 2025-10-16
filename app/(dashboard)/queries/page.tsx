"use client"

import type React from "react"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { ChatMessage } from "@/components/queries/chat-message"
import { QuerySuggestions } from "@/components/queries/query-suggestions"
import { QueryStats } from "@/components/queries/query-stats"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  relatedReports?: Array<{
    id: string
    type: string
    location: string
    date: string
    severity: "high" | "medium" | "low"
  }>
}

const mockInitialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hola, soy el asistente de consultas históricas de DAGRD. Puedo ayudarte a buscar información sobre reportes de emergencias usando lenguaje natural. ¿Qué te gustaría saber?",
    timestamp: "14:30",
  },
]

export default function QueriesPage() {
  const [messages, setMessages] = useState<Message[]>(mockInitialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (query?: string) => {
    const messageContent = query || input
    if (!messageContent.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response with RAG
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(messageContent),
        timestamp: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
        relatedReports: generateMockReports(messageContent),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateMockResponse = (query: string): string => {
    if (query.toLowerCase().includes("deslizamiento")) {
      return "He encontrado 8 reportes de deslizamientos en Bello durante el último mes. La mayoría se concentran en la zona norte del municipio, especialmente en áreas con pendientes pronunciadas. 5 de estos reportes fueron clasificados como alta prioridad y todos han sido atendidos."
    }
    if (query.toLowerCase().includes("inundación")) {
      return "En El Poblado se han registrado 3 reportes de inundaciones en los últimos 30 días. Estos eventos están relacionados con el sistema de drenaje en vías principales. 2 casos ya fueron resueltos y 1 está en proceso de intervención."
    }
    if (query.toLowerCase().includes("alta prioridad")) {
      return "Actualmente hay 5 emergencias de alta prioridad sin resolver: 2 deslizamientos, 2 colapsos viales y 1 daño estructural. El tiempo promedio de respuesta para este tipo de emergencias es de 45 minutos."
    }
    return "He analizado la base de datos histórica y encontré varios reportes relacionados con tu consulta. A continuación te muestro los más relevantes basados en similitud semántica y contexto temporal."
  }

  const generateMockReports = (query: string) => {
    if (query.toLowerCase().includes("deslizamiento")) {
      return [
        {
          id: "RPT-2024-015",
          type: "Deslizamiento de tierra",
          location: "Bello, Calle 45 con Carrera 60",
          date: "2024-01-10",
          severity: "high" as const,
        },
        {
          id: "RPT-2024-012",
          type: "Deslizamiento menor",
          location: "Bello, Sector Norte",
          date: "2024-01-08",
          severity: "medium" as const,
        },
        {
          id: "RPT-2024-008",
          type: "Deslizamiento de tierra",
          location: "Bello, Zona Alta",
          date: "2024-01-05",
          severity: "high" as const,
        },
      ]
    }
    if (query.toLowerCase().includes("inundación")) {
      return [
        {
          id: "RPT-2024-018",
          type: "Inundación vial",
          location: "El Poblado, Calle 10",
          date: "2024-01-12",
          severity: "medium" as const,
        },
        {
          id: "RPT-2024-014",
          type: "Inundación",
          location: "El Poblado, Avenida El Poblado",
          date: "2024-01-09",
          severity: "high" as const,
        },
      ]
    }
    return [
      {
        id: "RPT-2024-020",
        type: "Colapso vial",
        location: "Medellín Centro",
        date: "2024-01-14",
        severity: "high" as const,
      },
      {
        id: "RPT-2024-019",
        type: "Daño estructural",
        location: "Envigado",
        date: "2024-01-13",
        severity: "medium" as const,
      },
    ]
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Consultas Históricas"
        description="Búsqueda inteligente con procesamiento de lenguaje natural"
      />

      <div className="flex-1 space-y-6 p-6">
        <QueryStats />

        {messages.length === 1 && <QuerySuggestions onSelectSuggestion={handleSendMessage} />}

        {/* Chat Container */}
        <Card className="flex flex-col">
          <div className="flex-1 space-y-4 p-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                relatedReports={message.relatedReports}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
                </div>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Analizando base de datos histórica...</p>
                </Card>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta en lenguaje natural... (Ej: ¿Cuántos deslizamientos hubo en Bello?)"
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button onClick={() => handleSendMessage()} disabled={!input.trim() || isLoading} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Presiona Enter para enviar, Shift + Enter para nueva línea
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
