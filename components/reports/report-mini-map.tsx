"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface ReportMiniMapProps {
  coordinates: string
  address: string
}

export function ReportMiniMap({ coordinates, address }: ReportMiniMapProps) {
  // Parse coordinates
  const [lat, lng] = coordinates.split(",").map((c) => Number.parseFloat(c.trim().replace(/[°NSEW]/g, "")))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          {/* Placeholder for map - in production, use Leaflet or Mapbox */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Mapa interactivo</p>
              <p className="text-xs text-muted-foreground">{coordinates}</p>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Dirección</p>
          <p className="text-sm text-muted-foreground">{address}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Ver en Google Maps →
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
