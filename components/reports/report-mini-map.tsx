"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
)

interface ReportMiniMapProps {
  coordinates: string
  address: string
}

export function ReportMiniMap({ coordinates, address }: ReportMiniMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [L, setL] = useState<any>(null)

  // Parse coordinates
  const [lat, lng] = coordinates.split(",").map((c) => Number.parseFloat(c.trim().replace(/[°NSEW]/g, "")))

  useEffect(() => {
    setIsMounted(true)
    // Load Leaflet
    import("leaflet").then((leaflet) => {
      setL(leaflet.default)
      // Fix marker icons
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          {isMounted && L && !isNaN(lat) && !isNaN(lng) ? (
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
              scrollWheelZoom={false}
              dragging={false}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>
                  <div className="p-2">
                    <p className="text-xs font-medium">{address}</p>
                    <p className="text-xs text-gray-600 mt-1">{coordinates}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center">
                <MapPin className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Mapa interactivo</p>
                <p className="text-xs text-muted-foreground">{coordinates}</p>
              </div>
            </div>
          )}
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
