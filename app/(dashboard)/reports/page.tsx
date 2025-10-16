"use client"

import { AppHeader } from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Clock, User, ArrowRight } from "lucide-react"
import Link from "next/link"

const mockReports = [
  {
    id: "RPT-2024-001",
    type: "Deslizamiento de tierra",
    location: "Bello, Calle 45 con Carrera 60",
    reporter: "Juan Pérez",
    timestamp: "2024-01-15 14:35:00",
    status: "in-progress" as const,
    severity: "high" as const,
  },
  {
    id: "RPT-2024-002",
    type: "Inundación vial",
    location: "Copacabana, Avenida Principal",
    reporter: "María González",
    timestamp: "2024-01-15 14:20:00",
    status: "in-progress" as const,
    severity: "medium" as const,
  },
  {
    id: "RPT-2024-003",
    type: "Colapso de vía",
    location: "El Poblado, Calle 10",
    reporter: "Carlos Ramírez",
    timestamp: "2024-01-15 14:05:00",
    status: "pending" as const,
    severity: "high" as const,
  },
  {
    id: "RPT-2024-004",
    type: "Daño en estructura",
    location: "Envigado, Carrera 43A",
    reporter: "Ana Martínez",
    timestamp: "2024-01-15 13:50:00",
    status: "resolved" as const,
    severity: "low" as const,
  },
  {
    id: "RPT-2024-005",
    type: "Grieta en pavimento",
    location: "Itagüí, Calle 50",
    reporter: "Luis Hernández",
    timestamp: "2024-01-15 13:30:00",
    status: "pending" as const,
    severity: "medium" as const,
  },
]

export default function ReportsPage() {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      "in-progress": { label: "En Proceso", variant: "default" as const },
      resolved: { label: "Resuelto", variant: "outline" as const },
    }
    return variants[status as keyof typeof variants]
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      high: "text-destructive",
      medium: "text-primary",
      low: "text-chart-4",
    }
    return colors[severity as keyof typeof colors]
  }

  return (
    <div className="flex flex-col">
      <AppHeader title="Todos los Reportes" description="Historial completo de reportes de emergencias" />

      <div className="flex-1 space-y-6 p-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar por ID, ubicación o tipo..." className="pl-9" />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En Proceso</SelectItem>
                  <SelectItem value="resolved">Resuelto</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="grid gap-4">
          {mockReports.map((report) => (
            <Card key={report.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-lg font-semibold ${getSeverityColor(report.severity)}`}>{report.type}</h3>
                      <Badge variant={getStatusBadge(report.status).variant}>
                        {getStatusBadge(report.status).label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{report.id}</span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:gap-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{report.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{report.reporter}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{report.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" asChild>
                    <Link href={`/reports/${report.id}`}>
                      Ver detalles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
