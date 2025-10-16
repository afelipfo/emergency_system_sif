"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    google: any
  }
}

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
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<any[]>([])

  // Default center to Medellín
  const defaultCenter = center || { lat: 6.2442, lng: -75.5812 }

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (typeof window.google !== "undefined") {
        initMap()
        return
      }

      try {
        // Fetch the script URL from the server
        const response = await fetch("/api/maps/script-url")
        const data = await response.json()

        if (!response.ok || !data.scriptUrl) {
          setError("Google Maps API key not configured")
          setLoading(false)
          return
        }

        const script = document.createElement("script")
        script.src = data.scriptUrl
        script.async = true
        script.defer = true
        script.onload = () => initMap()
        script.onerror = () => {
          setError("Failed to load Google Maps")
          setLoading(false)
        }
        document.head.appendChild(script)
      } catch (err) {
        console.error("[v0] Error loading Google Maps:", err)
        setError("Failed to load Google Maps")
        setLoading(false)
      }
    }

    const initMap = () => {
      if (!mapRef.current || !window.google) return

      try {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        setMap(mapInstance)
        setLoading(false)
      } catch (err) {
        console.error("[v0] Error initializing map:", err)
        setError("Failed to initialize map")
        setLoading(false)
      }
    }

    loadGoogleMaps()
  }, [])

  useEffect(() => {
    if (!map || !window.google) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Add new markers
    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getPriorityColor(markerData.info.prioridad),
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      })

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
              ${markerData.info.registro}
            </h3>
            <p style="margin: 4px 0; font-size: 12px;">
              <strong>Fecha:</strong> ${markerData.info.fecha}
            </p>
            <p style="margin: 4px 0; font-size: 12px;">
              <strong>Vía:</strong> ${markerData.info.viaPrincipal}
            </p>
            ${markerData.info.barrio ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Barrio:</strong> ${markerData.info.barrio}</p>` : ""}
            ${markerData.info.prioridad ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Prioridad:</strong> ${markerData.info.prioridad}</p>` : ""}
          </div>
        `,
      })

      marker.addListener("click", () => {
        infoWindow.open(map, marker)
        if (onMarkerClick) {
          onMarkerClick(markerData.id)
        }
      })

      markersRef.current.push(marker)
    })

    // Adjust bounds to fit all markers
    if (markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      markers.forEach((marker) => {
        bounds.extend(marker.position)
      })
      map.fitBounds(bounds)
    }
  }, [map, markers, onMarkerClick])

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

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">Configure GOOGLE_MAPS_API_KEY in environment variables</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <div ref={mapRef} className="h-full w-full" />
}
