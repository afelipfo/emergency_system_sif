"use client"

import { useEffect, useState } from "react"
import { Database, Map, TableIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleMap } from "@/components/historico/google-map"
import { ImportDialog } from "@/components/historico/import-dialog"
import { HistoricoFilters } from "@/components/historico/filters"
import { RecordsTable } from "@/components/historico/records-table"

interface HistoricoRecord {
  id: string
  registro: string
  fecha: string
  remitido?: string
  registra?: string
  icad?: string
  comuna?: string
  via_principal: string
  complemento?: string
  barrio?: string
  telefono?: string
  contacto?: string
  observacion?: string
  atencion?: string
  prioridad?: string
  evidencias?: string[]
  radicados?: string[]
  latitud?: number
  longitud?: number
}

interface Filters {
  search: string
  comuna: string
  barrio: string
  prioridad: string
  fechaInicio: string
  fechaFin: string
}

export default function HistoricoPage() {
  const [records, setRecords] = useState<HistoricoRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    search: "",
    comuna: "",
    barrio: "",
    prioridad: "",
    fechaInicio: "",
    fechaFin: "",
  })
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  useEffect(() => {
    fetchRecords()
  }, [filters])

  const fetchRecords = async () => {
    try {
      setLoading(true)

      // Build query params
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.comuna) params.append("comuna", filters.comuna)
      if (filters.barrio) params.append("barrio", filters.barrio)
      if (filters.prioridad) params.append("prioridad", filters.prioridad)
      if (filters.fechaInicio) params.append("fecha_inicio", filters.fechaInicio)
      if (filters.fechaFin) params.append("fecha_fin", filters.fechaFin)

      const response = await fetch(`/api/historico?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setRecords(data.data || [])
      } else {
        console.error("[v0] Error fetching records:", data.error)
      }
    } catch (error) {
      console.error("[v0] Error fetching records:", error)
    } finally {
      setLoading(false)
    }
  }

  // Convert records to map markers
  const mapMarkers = records
    .filter((record) => record.latitud && record.longitud)
    .map((record) => ({
      id: record.id,
      position: {
        lat: record.latitud!,
        lng: record.longitud!,
      },
      title: record.registro,
      info: {
        registro: record.registro,
        fecha: new Date(record.fecha).toLocaleDateString("es-CO"),
        viaPrincipal: record.via_principal,
        barrio: record.barrio,
        prioridad: record.prioridad,
      },
    }))

  // Stats
  const totalRecords = records.length
  const recordsWithCoordinates = records.filter((r) => r.latitud && r.longitud).length
  const highPriorityRecords = records.filter(
    (r) => r.prioridad?.toLowerCase() === "alta" || r.prioridad?.toLowerCase() === "high",
  ).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico</h1>
          <p className="text-muted-foreground">Consulta y gestión de registros históricos importados</p>
        </div>
        <ImportDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">Registros en la base de datos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geocodificados</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordsWithCoordinates}</div>
            <p className="text-xs text-muted-foreground">
              {totalRecords > 0
                ? `${Math.round((recordsWithCoordinates / totalRecords) * 100)}% del total`
                : "0% del total"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridad</CardTitle>
            <TableIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityRecords}</div>
            <p className="text-xs text-muted-foreground">Requieren atención urgente</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
          <CardDescription>Refina tu búsqueda de registros históricos</CardDescription>
        </CardHeader>
        <CardContent>
          <HistoricoFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">
            <TableIcon className="mr-2 h-4 w-4" />
            Tabla
          </TabsTrigger>
          <TabsTrigger value="map">
            <Map className="mr-2 h-4 w-4" />
            Mapa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros Históricos</CardTitle>
              <CardDescription>{loading ? "Cargando..." : `${totalRecords} registros encontrados`}</CardDescription>
            </CardHeader>
            <CardContent>
              <RecordsTable records={records} onRecordClick={(id) => setSelectedRecordId(id)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Registros</CardTitle>
              <CardDescription>
                Visualización geográfica de {recordsWithCoordinates} registros en Medellín
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] w-full overflow-hidden rounded-lg border">
                <GoogleMap markers={mapMarkers} onMarkerClick={(id) => setSelectedRecordId(id)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
