"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, MapPin, User, CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface AlertCardProps {
  id: string
  type: "new_report" | "high_priority" | "intervention_complete" | "system" | "assignment"
  title: string
  description: string
  timestamp: string
  severity?: "high" | "medium" | "low"
  location?: string
  reportId?: string
  isRead: boolean
  onMarkAsRead?: () => void
  onDismiss?: () => void
}

export function AlertCard({
  id,
  type,
  title,
  description,
  timestamp,
  severity,
  location,
  reportId,
  isRead,
  onMarkAsRead,
  onDismiss,
}: AlertCardProps) {
  const getAlertIcon = () => {
    switch (type) {
      case "new_report":
        return <AlertTriangle className="h-5 w-5 text-primary" />
      case "high_priority":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "intervention_complete":
        return <CheckCircle className="h-5 w-5 text-chart-4" />
      case "assignment":
        return <User className="h-5 w-5 text-secondary" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getAlertBadge = () => {
    switch (type) {
      case "new_report":
        return <Badge variant="default">Nuevo Reporte</Badge>
      case "high_priority":
        return <Badge variant="destructive">Alta Prioridad</Badge>
      case "intervention_complete":
        return <Badge variant="outline">Completado</Badge>
      case "assignment":
        return <Badge variant="secondary">Asignación</Badge>
      default:
        return <Badge variant="outline">Sistema</Badge>
    }
  }

  return (
    <Card className={cn("transition-all hover:shadow-md", !isRead && "border-l-4 border-l-primary bg-accent/50")}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">{getAlertIcon()}</div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{title}</h4>
                  {getAlertBadge()}
                  {!isRead && (
                    <Badge variant="secondary" className="text-xs">
                      Nuevo
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>

              <Button variant="ghost" size="icon" onClick={onDismiss}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timestamp}</span>
              </div>
              {location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{location}</span>
                </div>
              )}
              {severity && (
                <Badge
                  variant={severity === "high" ? "destructive" : severity === "medium" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {severity === "high" ? "Alta" : severity === "medium" ? "Media" : "Baja"}
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              {reportId && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/reports/${reportId}`}>Ver Reporte</Link>
                </Button>
              )}
              {!isRead && (
                <Button variant="ghost" size="sm" onClick={onMarkAsRead}>
                  Marcar como leído
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
