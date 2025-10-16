"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const mockPersonnel = [
  {
    id: "1",
    nombre: "Ing. Carlos Quintero",
    cargo: "Coordinador Zona Norte",
    zona: "Popular, Santa Cruz, Manrique",
    ultimoReporte: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    activo: true,
  },
  {
    id: "2",
    nombre: "Téc. Andrea Gómez",
    cargo: "Supervisora Corregimientos",
    zona: "San Antonio de Prado, Altavista",
    ultimoReporte: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    activo: true,
  },
  {
    id: "3",
    nombre: "Ing. Jaime Naranjo",
    cargo: "Director Operativo SIF",
    zona: "Todas las zonas",
    ultimoReporte: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    activo: true,
  },
  {
    id: "4",
    nombre: "Téc. María Rodríguez",
    cargo: "Supervisora Zona Sur",
    zona: "El Poblado, Guayabal, Belén",
    ultimoReporte: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    activo: true,
  },
]

function getStatusColor(lastReport: Date): "success" | "warning" | "secondary" {
  const hoursSince = (Date.now() - lastReport.getTime()) / (1000 * 60 * 60)
  if (hoursSince < 1) return "success"
  if (hoursSince < 6) return "warning"
  return "secondary"
}

export function FieldPersonnelList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal de Campo Activo</CardTitle>
        <CardDescription>Responsables SIF en servicio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPersonnel.map((person) => {
            const statusVariant = getStatusColor(person.ultimoReporte)

            return (
              <div key={person.id} className="flex items-start gap-3 rounded-lg border p-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {person.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{person.nombre}</p>
                    <Badge variant={statusVariant} className="text-xs">
                      {formatDistanceToNow(person.ultimoReporte, { locale: es, addSuffix: true })}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{person.cargo}</p>
                  <p className="text-xs text-muted-foreground">📍 {person.zona}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
