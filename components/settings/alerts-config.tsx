"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, Trash2 } from "lucide-react"

const mockRecipients = [
  { id: "1", name: "Director DAGRD", email: "director@dagrd.gov.co", highPriority: true, allReports: false },
  { id: "2", name: "Coordinador Técnico", email: "coordinador@dagrd.gov.co", highPriority: true, allReports: true },
  {
    id: "3",
    name: "Secretaría Infraestructura",
    email: "infraestructura@medellin.gov.co",
    highPriority: true,
    allReports: false,
  },
]

export function AlertsConfig() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Alertas</CardTitle>
          <CardDescription>Gestiona notificaciones automáticas por email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enable-alerts">Alertas Automáticas</Label>
              <p className="text-sm text-muted-foreground">Enviar notificaciones cuando se reciban nuevos reportes</p>
            </div>
            <Switch id="enable-alerts" defaultChecked />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="high-priority">Solo Alta Prioridad</Label>
              <p className="text-sm text-muted-foreground">Notificar únicamente emergencias de alta prioridad</p>
            </div>
            <Switch id="high-priority" />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="digest">Resumen Diario</Label>
              <p className="text-sm text-muted-foreground">Enviar resumen diario de actividad a las 18:00</p>
            </div>
            <Switch id="digest" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Destinatarios de Alertas</CardTitle>
            <CardDescription>Personas que recibirán notificaciones automáticas</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecipients.map((recipient) => (
              <Card key={recipient.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{recipient.name}</h4>
                        {recipient.highPriority && <Badge variant="destructive">Alta Prioridad</Badge>}
                        {recipient.allReports && <Badge variant="default">Todos los Reportes</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{recipient.email}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plantilla de Email</CardTitle>
          <CardDescription>Personaliza el formato de las notificaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Asunto del Email</Label>
            <Input id="subject" defaultValue="[DAGRD] Nueva Emergencia: {tipo} - {ubicación}" />
          </div>
          <Button>Guardar Plantilla</Button>
        </CardContent>
      </Card>
    </div>
  )
}
