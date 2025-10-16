"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { useState } from "react"

export function WhatsAppConfig() {
  const [isConnected, setIsConnected] = useState(true)
  const [isTesting, setIsTesting] = useState(false)

  const handleTestConnection = () => {
    setIsTesting(true)
    setTimeout(() => {
      setIsTesting(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configuración de WhatsApp Business API</CardTitle>
              <CardDescription>Gestiona la conexión con WhatsApp para recibir reportes de audio</CardDescription>
            </div>
            <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
              {isConnected ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Conectado
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Desconectado
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Número de Teléfono</Label>
              <Input id="phone-number" placeholder="+57 300 123 4567" defaultValue="+57 300 555 0100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-id">Business Account ID</Label>
              <Input id="business-id" placeholder="123456789012345" defaultValue="102345678901234" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://your-domain.com/api/webhook/whatsapp"
              defaultValue="https://dagrd-medellin.vercel.app/api/webhook/whatsapp"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verify-token">Verify Token</Label>
            <Input id="verify-token" type="password" placeholder="••••••••" defaultValue="secure_token_123" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="access-token">Access Token</Label>
            <Input id="access-token" type="password" placeholder="••••••••" defaultValue="EAABsbCS1iHgBO..." />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleTestConnection} disabled={isTesting}>
              {isTesting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Probando...
                </>
              ) : (
                "Probar Conexión"
              )}
            </Button>
            <Button variant="outline">Guardar Cambios</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Mensajes</CardTitle>
          <CardDescription>Mensajes recibidos y procesados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Mensajes Hoy</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Este Mes</p>
              <p className="text-2xl font-bold">487</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tasa de Éxito</p>
              <p className="text-2xl font-bold">98.5%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
