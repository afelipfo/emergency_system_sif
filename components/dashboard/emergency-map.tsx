"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import map component to avoid SSR issues
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
  const [isMounted, setIsMounted] = useState(false)
  const [L, setL] = useState<any>(null)

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

  const getMarkerIcon = (severity: string) => {
    if (!L) return undefined

    const color = severity === "high" ? "#ef4444" : severity === "medium" ? "#f59e0b" : "#10b981"

    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Mapa de Emergencias - Medellín</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
          {isMounted && L ? (
            <MapContainer
              center={[6.2442, -75.5812]}
              zoom={12}
              style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mockLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={getMarkerIcon(location.severity)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-sm mb-1">{location.type}</h3>
                      <p className="text-xs text-gray-600">{location.address}</p>
                      <p className="text-xs mt-1">
                        <span className="font-medium">Severidad: </span>
                        {location.severity === "high" ? "Alta" : location.severity === "medium" ? "Media" : "Baja"}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Cargando mapa...</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive"></div>
            <span className="text-xs text-muted-foreground">Alta Prioridad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#f59e0b]"></div>
            <span className="text-xs text-muted-foreground">Media Prioridad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#10b981]"></div>
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
