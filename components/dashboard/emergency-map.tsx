"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface EmergencyLocation {
  id: string
  lat: number
  lng: number
  type: string
  severity: "high" | "medium" | "low"
  address: string
}

const mockLocations: EmergencyLocation[] = [
  { id: "1", lat: 6.2442, lng: -75.5812, type: "Deslizamiento", severity: "high", address: "Bello, Antioquia" },
  { id: "2", lat: 6.2476, lng: -75.5658, type: "Inundación", severity: "medium", address: "Copacabana" },
  { id: "3", lat: 6.2308, lng: -75.5906, type: "Colapso Vial", severity: "high", address: "El Poblado" },
  { id: "4", lat: 6.2518, lng: -75.5636, type: "Daño Estructural", severity: "low", address: "Envigado" },
]

export function EmergencyMap() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Mapa de Emergencias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Mapa interactivo de Medellín</p>
              <p className="text-xs text-muted-foreground">Integración con Leaflet/Mapbox pendiente</p>
            </div>
          </div>

          {/* Mock location markers */}
          <div className="absolute left-1/4 top-1/4">
            <div className="relative">
              <div className="h-4 w-4 animate-ping rounded-full bg-destructive opacity-75"></div>
              <div className="absolute inset-0 h-4 w-4 rounded-full bg-destructive"></div>
            </div>
          </div>
          <div className="absolute left-2/3 top-1/3">
            <div className="relative">
              <div className="h-4 w-4 animate-ping rounded-full bg-primary opacity-75"></div>
              <div className="absolute inset-0 h-4 w-4 rounded-full bg-primary"></div>
            </div>
          </div>
          <div className="absolute left-1/2 top-2/3">
            <div className="relative">
              <div className="h-4 w-4 animate-ping rounded-full bg-destructive opacity-75"></div>
              <div className="absolute inset-0 h-4 w-4 rounded-full bg-destructive"></div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive"></div>
            <span className="text-xs text-muted-foreground">Alta Prioridad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span className="text-xs text-muted-foreground">Media Prioridad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-4"></div>
            <span className="text-xs text-muted-foreground">Baja Prioridad</span>
          </div>
        </div>

        {/* Location list */}
        <div className="mt-4 space-y-2">
          {mockLocations.map((location) => (
            <div key={location.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{location.type}</p>
                  <p className="text-xs text-muted-foreground">{location.address}</p>
                </div>
              </div>
              <Badge
                variant={
                  location.severity === "high"
                    ? "destructive"
                    : location.severity === "medium"
                      ? "default"
                      : "secondary"
                }
              >
                {location.severity === "high" ? "Alta" : location.severity === "medium" ? "Media" : "Baja"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
