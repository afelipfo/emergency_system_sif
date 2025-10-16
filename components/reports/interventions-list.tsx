"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, User, Calendar, CheckCircle, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Intervention {
  id: string
  assignedTo: string
  assignedDate: string
  status: "pending" | "in-progress" | "completed"
  description: string
  completedDate?: string
  notes?: string
}

interface InterventionsListProps {
  interventions: Intervention[]
}

export function InterventionsList({ interventions }: InterventionsListProps) {
  const getStatusIcon = (status: Intervention["status"]) => {
    const icons = {
      pending: <Clock className="h-4 w-4 text-muted-foreground" />,
      "in-progress": <Clock className="h-4 w-4 text-primary" />,
      completed: <CheckCircle className="h-4 w-4 text-chart-4" />,
    }
    return icons[status]
  }

  const getStatusBadge = (status: Intervention["status"]) => {
    const variants = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      "in-progress": { label: "En Proceso", variant: "default" as const },
      completed: { label: "Completada", variant: "outline" as const },
    }
    return variants[status]
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Intervenciones</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Intervención
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Intervención</DialogTitle>
              <DialogDescription>Asigna personal y describe la intervención a realizar.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="personnel">Personal Asignado</Label>
                <Select>
                  <SelectTrigger id="personnel">
                    <SelectValue placeholder="Seleccionar técnico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech1">Carlos Ramírez - Técnico Senior</SelectItem>
                    <SelectItem value="tech2">Ana Martínez - Ingeniera Civil</SelectItem>
                    <SelectItem value="tech3">Luis Hernández - Técnico de Campo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe la intervención a realizar..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Crear Intervención</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {interventions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No hay intervenciones registradas</p>
            <p className="text-xs text-muted-foreground">Crea una nueva intervención para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interventions.map((intervention) => (
              <div key={intervention.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(intervention.status)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold">{intervention.description}</h4>
                        <Badge variant={getStatusBadge(intervention.status).variant}>
                          {getStatusBadge(intervention.status).label}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {intervention.assignedTo}
                        </p>
                        <p className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          Asignado: {intervention.assignedDate}
                        </p>
                        {intervention.completedDate && (
                          <p className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            Completado: {intervention.completedDate}
                          </p>
                        )}
                      </div>
                      {intervention.notes && (
                        <p className="text-xs text-muted-foreground">Notas: {intervention.notes}</p>
                      )}
                    </div>
                  </div>
                  {intervention.status !== "completed" && (
                    <Button variant="outline" size="sm">
                      Actualizar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
