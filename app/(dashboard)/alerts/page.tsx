"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { AlertCard } from "@/components/alerts/alert-card"
import { AlertsFilter } from "@/components/alerts/alerts-filter"
import { AlertsStats } from "@/components/alerts/alerts-stats"
import { Button } from "@/components/ui/button"
import { CheckCheck } from "lucide-react"

interface Alert {
  id: string
  type: "new_report" | "high_priority" | "intervention_complete" | "system" | "assignment"
  title: string
  description: string
  timestamp: string
  severity?: "high" | "medium" | "low"
  location?: string
  reportId?: string
  isRead: boolean
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "high_priority",
    title: "Emergencia de Alta Prioridad",
    description: "Deslizamiento de tierra bloqueando vía principal en Bello",
    timestamp: "Hace 5 minutos",
    severity: "high",
    location: "Bello, Calle 45 con Carrera 60",
    reportId: "RPT-2024-001",
    isRead: false,
  },
  {
    id: "2",
    type: "new_report",
    title: "Nuevo Reporte Recibido",
    description: "Inundación vial reportada en Copacabana",
    timestamp: "Hace 15 minutos",
    severity: "medium",
    location: "Copacabana, Avenida Principal",
    reportId: "RPT-2024-002",
    isRead: false,
  },
  {
    id: "3",
    type: "assignment",
    title: "Nueva Asignación",
    description: "Carlos Ramírez asignado a intervención en El Poblado",
    timestamp: "Hace 30 minutos",
    reportId: "RPT-2024-003",
    isRead: false,
  },
  {
    id: "4",
    type: "intervention_complete",
    title: "Intervención Completada",
    description: "Reporte RPT-2024-004 marcado como resuelto",
    timestamp: "Hace 1 hora",
    location: "Envigado, Carrera 43A",
    reportId: "RPT-2024-004",
    isRead: true,
  },
  {
    id: "5",
    type: "high_priority",
    title: "Alerta Crítica",
    description: "Colapso vial detectado en zona de alto tráfico",
    timestamp: "Hace 2 horas",
    severity: "high",
    location: "El Poblado, Calle 10",
    reportId: "RPT-2024-005",
    isRead: true,
  },
  {
    id: "6",
    type: "new_report",
    title: "Nuevo Reporte Recibido",
    description: "Grieta en pavimento reportada en Itagüí",
    timestamp: "Hace 3 horas",
    severity: "low",
    location: "Itagüí, Calle 50",
    reportId: "RPT-2024-006",
    isRead: true,
  },
  {
    id: "7",
    type: "system",
    title: "Actualización del Sistema",
    description: "Base de datos optimizada exitosamente",
    timestamp: "Hace 4 horas",
    isRead: true,
  },
  {
    id: "8",
    type: "assignment",
    title: "Nueva Asignación",
    description: "Ana Martínez asignada a evaluación estructural",
    timestamp: "Hace 5 horas",
    reportId: "RPT-2024-007",
    isRead: true,
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)

  const handleMarkAsRead = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert)))
  }

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const handleMarkAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })))
  }

  const handleRefresh = () => {
    // Simulate refresh
    console.log("[v0] Refreshing alerts...")
  }

  const unreadCount = alerts.filter((alert) => !alert.isRead).length

  return (
    <div className="flex flex-col">
      <AppHeader title="Alertas" description="Feed en tiempo real de notificaciones y alertas" />

      <div className="flex-1 space-y-6 p-6">
        <AlertsStats />

        <AlertsFilter onFilterChange={() => {}} onRefresh={handleRefresh} />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Todas las Alertas</h2>
            <p className="text-sm text-muted-foreground">
              {unreadCount} {unreadCount === 1 ? "alerta no leída" : "alertas no leídas"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Marcar todas como leídas
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              {...alert}
              onMarkAsRead={() => handleMarkAsRead(alert.id)}
              onDismiss={() => handleDismiss(alert.id)}
            />
          ))}
        </div>

        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
            <p className="text-muted-foreground">No hay alertas para mostrar</p>
          </div>
        )}
      </div>
    </div>
  )
}
