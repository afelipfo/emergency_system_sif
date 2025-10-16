"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface HistoricoFilters {
  search: string
  comuna: string
  barrio: string
  prioridad: string
  fechaInicio: string
  fechaFin: string
}

interface HistoricoFiltersProps {
  filters: HistoricoFilters
  onFiltersChange: (filters: HistoricoFilters) => void
}

const COMUNAS = [
  "1 - Popular",
  "2 - Santa Cruz",
  "3 - Manrique",
  "4 - Aranjuez",
  "5 - Castilla",
  "6 - Doce de Octubre",
  "7 - Robledo",
  "8 - Villa Hermosa",
  "9 - Buenos Aires",
  "10 - La Candelaria",
  "11 - Laureles-Estadio",
  "12 - La América",
  "13 - San Javier",
  "14 - El Poblado",
  "15 - Guayabal",
  "16 - Belén",
]

const PRIORIDADES = ["Alta", "Media", "Baja"]

export function HistoricoFilters({ filters, onFiltersChange }: HistoricoFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key: keyof HistoricoFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: HistoricoFilters = {
      search: "",
      comuna: "",
      barrio: "",
      prioridad: "",
      fechaInicio: "",
      fechaFin: "",
    }
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const hasActiveFilters = Object.values(localFilters).some((value) => value !== "")

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por registro, vía, observación..."
          value={localFilters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-9"
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative bg-transparent">
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                !
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros Avanzados</SheetTitle>
            <SheetDescription>Refina tu búsqueda de registros históricos</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Comuna</Label>
              <Select value={localFilters.comuna} onValueChange={(value) => handleFilterChange("comuna", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las comunas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las comunas</SelectItem>
                  {COMUNAS.map((comuna) => (
                    <SelectItem key={comuna} value={comuna}>
                      {comuna}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Barrio</Label>
              <Input
                placeholder="Nombre del barrio"
                value={localFilters.barrio}
                onChange={(e) => handleFilterChange("barrio", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={localFilters.prioridad} onValueChange={(value) => handleFilterChange("prioridad", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  {PRIORIDADES.map((prioridad) => (
                    <SelectItem key={prioridad} value={prioridad}>
                      {prioridad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha Inicio</Label>
              <Input
                type="date"
                value={localFilters.fechaInicio}
                onChange={(e) => handleFilterChange("fechaInicio", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Fecha Fin</Label>
              <Input
                type="date"
                value={localFilters.fechaFin}
                onChange={(e) => handleFilterChange("fechaFin", e.target.value)}
              />
            </div>

            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                <X className="mr-2 h-4 w-4" />
                Limpiar Filtros
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
