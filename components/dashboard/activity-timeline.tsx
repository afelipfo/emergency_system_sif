"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface TimelineEvent {
  id: string
  type: "report" | "intervention" | "alert" | "update"
  title: string
  description: string
  timestamp: string
  user?: string
}

const mockEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "report",
    title: "Nuevo reporte recibido",
    description: "Deslizamiento de tierra en Bello",
    timestamp: "14:35",
    user: "Sistema WhatsApp",
  },
  {
    id: "2",
    type: "alert",
    title: "Alerta de alta prioridad",
    description: "Colapso vial detectado en El Poblado",
    timestamp: "14:20",
  },
  {
    id: "3",
    type: "intervention",
    title: "Intervención iniciada",
    description: "Equipo desplegado a Copacabana",
    timestamp: "14:05",
    user: "Carlos Ramírez",
  },
  {
    id: "4",
    type: "update",
    title: "Estado actualizado",
    description: "Reporte RPT-2024-003 marcado como resuelto",
    timestamp: "13:50",
    user: "Ana Martínez",
  },
  {
    id: "5",
    type: "report",
    title: "Nuevo reporte recibido",
    description: "Inundación en vía principal",
    timestamp: "13:30",
    user: "Sistema WhatsApp",
  },
]

export function ActivityTimeline() {
  const getEventIcon = (type: TimelineEvent["type"]) => {
    const colors = {
      report: "bg-primary",
      intervention: "bg-chart-4",
      alert: "bg-destructive",
      update: "bg-secondary",
    }
    return colors[type]
  }

  const getEventLabel = (type: TimelineEvent["type"]) => {
    const labels = {
      report: "Reporte",
      intervention: "Intervención",
      alert: "Alerta",
      update: "Actualización",
    }
    return labels[type]
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Línea de Tiempo de Actividad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 h-[calc(100%-1rem)] w-0.5 bg-border"></div>

          {mockEvents.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Timeline dot */}
              <div
                className={`relative z-10 mt-1 h-8 w-8 rounded-full ${getEventIcon(event.type)} flex items-center justify-center`}
              >
                <Clock className="h-4 w-4 text-white" />
              </div>

              {/* Event content */}
              <div className="flex-1 rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getEventLabel(event.type)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                    {event.user && <p className="mt-1 text-xs text-muted-foreground">Por: {event.user}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
