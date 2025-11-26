"use client"

import { useEffect, useState, useRef } from "react"
import { Loader2 } from "lucide-react"
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

interface MapMarker {
  id: string
  position: { lat: number; lng: number }
  title: string
  info: {
    registro: string
    fecha: string
    viaPrincipal: string
    barrio?: string
    prioridad?: string
  }
}

interface GoogleMapProps {
  markers: MapMarker[]
  center?: { lat: number; lng: number }
  zoom?: number
  onMarkerClick?: (markerId: string) => void
}

export function GoogleMap({ markers, center, zoom = 12, onMarkerClick }: GoogleMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [L, setL] = useState<any>(null)
  const mapRef = useRef<any>(null)

  // Default center to Medellín
  const defaultCenter = center || { lat: 6.2442, lng: -75.5812 }

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

  useEffect(() => {
    if (mapRef.current && markers.length > 0 && L) {
      // Fit bounds to show all markers
      const bounds = L.latLngBounds(markers.map((m) => [m.position.lat, m.position.lng]))
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [markers, L])

  const getPriorityColor = (prioridad?: string) => {
    switch (prioridad?.toLowerCase()) {
      case "alta":
      case "high":
        return "#ef4444"
      case "media":
      case "medium":
        return "#f59e0b"
      case "baja":
      case "low":
        return "#10b981"
      default:
        return "#3b82f6"
    }
  }

  const getMarkerIcon = (prioridad?: string) => {
    if (!L) return undefined

    const color = getPriorityColor(prioridad)

    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
  }

  if (!isMounted || !L) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <MapContainer
      ref={mapRef}
      center={[defaultCenter.lat, defaultCenter.lng]}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.position.lat, marker.position.lng]}
          icon={getMarkerIcon(marker.info.prioridad)}
          eventHandlers={{
            click: () => {
              if (onMarkerClick) {
                onMarkerClick(marker.id)
              }
            },
          }}
        >
          <Popup>
            <div style={{ padding: "8px", minWidth: "200px" }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 600 }}>
                {marker.info.registro}
              </h3>
              <p style={{ margin: "4px 0", fontSize: "12px" }}>
                <strong>Fecha:</strong> {marker.info.fecha}
              </p>
              <p style={{ margin: "4px 0", fontSize: "12px" }}>
                <strong>Vía:</strong> {marker.info.viaPrincipal}
              </p>
              {marker.info.barrio && (
                <p style={{ margin: "4px 0", fontSize: "12px" }}>
                  <strong>Barrio:</strong> {marker.info.barrio}
                </p>
              )}
              {marker.info.prioridad && (
                <p style={{ margin: "4px 0", fontSize: "12px" }}>
                  <strong>Prioridad:</strong> {marker.info.prioridad}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
