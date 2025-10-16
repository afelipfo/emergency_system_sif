"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Filter, X, Search } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

const COMUNAS = [
  "Popular",
  "Santa Cruz",
  "Manrique",
  "Aranjuez",
  "Castilla",
  "Doce de Octubre",
  "Robledo",
  "Villa Hermosa",
  "Buenos Aires",
  "La Candelaria",
  "Laureles-Estadio",
  "La América",
  "San Javier",
  "El Poblado",
  "Guayabal",
  "Belén",
]

const CORREGIMIENTOS = ["San Antonio de Prado", "Altavista", "San Cristóbal", "Palmitas", "Santa Elena"]

const TIPOS_EMERGENCIA = [
  "Deslizamiento",
  "Colapso Vial",
  "Inundación",
  "Afectación Malla Vial",
  "Daño Estructural",
  "Afectación por Lluvias",
]

interface FiltersReportesProps {
  onFilterChange?: (filters: any) => void
}

export function FiltersReportes({ onFilterChange }: FiltersReportesProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [selectedTipos, setSelectedTipos] = useState<string[]>([])
  const [selectedGravedad, setSelectedGravedad] = useState<string>("")
  const [selectedZona, setSelectedZona] = useState<string>("")
  const [requiereMaquinaria, setRequiereMaquinaria] = useState(false)

  const handleReset = () => {
    setSearchTerm("")
    setDateRange({})
    setSelectedTipos([])
    setSelectedGravedad("")
    setSelectedZona("")
    setRequiereMaquinaria(false)
    onFilterChange?.({})
  }

  const toggleTipo = (tipo: string) => {
    setSelectedTipos((prev) => (prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]))
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="mr-2 h-4 w-4" />
          Limpiar
        </Button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Buscar por dirección o barrio</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Ej: Carrera 43A, Los Balsos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-2">
        <Label>Rango de fechas</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd MMM", { locale: es })} -{" "}
                    {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                  </>
                ) : (
                  format(dateRange.from, "dd MMM yyyy", { locale: es })
                )
              ) : (
                "Seleccionar fechas"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => setDateRange(range || {})}
              locale={es}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Emergency Types */}
      <div className="space-y-2">
        <Label>Tipo de emergencia</Label>
        <div className="flex flex-wrap gap-2">
          {TIPOS_EMERGENCIA.map((tipo) => (
            <Badge
              key={tipo}
              variant={selectedTipos.includes(tipo) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTipo(tipo)}
            >
              {tipo}
            </Badge>
          ))}
        </div>
      </div>

      {/* Severity */}
      <div className="space-y-2">
        <Label htmlFor="gravedad">Gravedad mínima</Label>
        <Select value={selectedGravedad} onValueChange={setSelectedGravedad}>
          <SelectTrigger id="gravedad">
            <SelectValue placeholder="Todas las gravedades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="Baja">Baja</SelectItem>
            <SelectItem value="Media">Media</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Crítica">Crítica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Zone */}
      <div className="space-y-2">
        <Label htmlFor="zona">Comuna / Corregimiento</Label>
        <Select value={selectedZona} onValueChange={setSelectedZona}>
          <SelectTrigger id="zona">
            <SelectValue placeholder="Todas las zonas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {COMUNAS.map((comuna) => (
              <SelectItem key={comuna} value={comuna}>
                {comuna}
              </SelectItem>
            ))}
            {CORREGIMIENTOS.map((corr) => (
              <SelectItem key={corr} value={corr}>
                {corr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Machinery Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="maquinaria"
          checked={requiereMaquinaria}
          onChange={(e) => setRequiereMaquinaria(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="maquinaria" className="cursor-pointer">
          Solo requiere maquinaria pesada
        </Label>
      </div>

      <Button
        className="w-full"
        onClick={() =>
          onFilterChange?.({
            searchTerm,
            dateRange,
            selectedTipos,
            selectedGravedad,
            selectedZona,
            requiereMaquinaria,
          })
        }
      >
        Aplicar Filtros
      </Button>
    </div>
  )
}
