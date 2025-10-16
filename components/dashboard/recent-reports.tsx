"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, User, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Report {
  id: string
  type: string
  location: string
  reporter: string
  timestamp: string
  status: "pending" | "in-progress" | "resolved"
  severity: "high" | "medium" | "low"
}

const mockReports: Report[] = [
  {
    id: "RPT-2024-001",
    type: "Deslizamiento de tierra",
    location: "Bello, Calle 45 con Carrera 60",
    reporter: "Juan Pérez",
    timestamp: "Hace 5 minutos",
    status: "pending",
    severity: "high",
  },
  {
    id: "RPT-2024-002",
    type: "Inundación vial",
    location: "Copacabana, Avenida Principal",
    reporter: "María González",
    timestamp: "Hace 15 minutos",
    status: "in-progress",
    severity: "medium",
  },
  {
    id: "RPT-2024-003",
    type: "Colapso de vía",
    location: "El Poblado, Calle 10",
    reporter: "Carlos Ramírez",
    timestamp: "Hace 30 minutos",
    status: "in-progress",
    severity: "high",
  },
  {
    id: "RPT-2024-004",
    type: "Daño en estructura",
    location: "Envigado, Carrera 43A",
    reporter: "Ana Martínez",
    timestamp: "Hace 1 hora",
    status: "resolved",
    severity: "low",
  },
  {
    id: "RPT-2024-005",
    type: "Grieta en pavimento",
    location: "Itagüí, Calle 50",
    reporter: "Luis Hernández",
    timestamp: "Hace 2 horas",
    status: "pending",
    severity: "medium",
  },
]

export function RecentReports() {
  const getStatusBadge = (status: Report["status"]) => {
    const variants = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      "in-progress": { label: "En Proceso", variant: "default" as const },
      resolved: { label: "Resuelto", variant: "outline" as const },
    }
    return variants[status]
  }

  const getSeverityColor = (severity: Report["severity"]) => {
    const colors = {
      high: "text-destructive",
      medium: "text-primary",
      low: "text-chart-4",
    }
    return colors[severity]
  }

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reportes Recientes</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/reports">
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockReports.map((report) => (
            <div key={report.id} className="flex flex-col gap-2 rounded-lg border p-4 transition-all hover:bg-accent">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-semibold ${getSeverityColor(report.severity)}`}>{report.type}</h4>
                    <Badge variant={getStatusBadge(report.status).variant}>{getStatusBadge(report.status).label}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{report.id}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{report.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span>{report.reporter}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{report.timestamp}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="mt-2 w-full bg-transparent" asChild>
                <Link href={`/reports/${report.id}`}>Ver detalles</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
