"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface AlertsFilterProps {
  onFilterChange?: (filters: any) => void
  onRefresh?: () => void
}

export function AlertsFilter({ onFilterChange, onRefresh }: AlertsFilterProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="alert-type">Tipo de Alerta</Label>
            <Select defaultValue="all">
              <SelectTrigger id="alert-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="new_report">Nuevos Reportes</SelectItem>
                <SelectItem value="high_priority">Alta Prioridad</SelectItem>
                <SelectItem value="intervention_complete">Intervenciones Completadas</SelectItem>
                <SelectItem value="assignment">Asignaciones</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="severity">Severidad</Label>
            <Select defaultValue="all">
              <SelectTrigger id="severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-3">
            <Label htmlFor="unread-only" className="text-sm">
              Solo no leídas
            </Label>
            <Switch id="unread-only" />
          </div>

          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
