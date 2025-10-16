"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

export function AIConfig() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>OpenAI API Configuration</CardTitle>
              <CardDescription>Configuración de modelos de IA para transcripción y extracción de datos</CardDescription>
            </div>
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Activo
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input id="api-key" type="password" placeholder="sk-..." defaultValue="sk-proj-..." />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="whisper-model">Modelo de Transcripción (Whisper)</Label>
              <Select defaultValue="whisper-1">
                <SelectTrigger id="whisper-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whisper-1">whisper-1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpt-model">Modelo de Extracción (GPT)</Label>
              <Select defaultValue="gpt-4-turbo">
                <SelectTrigger id="gpt-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature: 0.3</Label>
            <Slider id="temperature" defaultValue={[0.3]} max={1} step={0.1} />
            <p className="text-xs text-muted-foreground">
              Controla la creatividad del modelo. Valores bajos = más determinista
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-tokens">Max Tokens: 1000</Label>
            <Slider id="max-tokens" defaultValue={[1000]} max={4000} step={100} />
            <p className="text-xs text-muted-foreground">Máximo de tokens para la respuesta del modelo</p>
          </div>

          <Button>Guardar Configuración</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uso de API</CardTitle>
          <CardDescription>Consumo de tokens y costos estimados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tokens Hoy</p>
              <p className="text-2xl font-bold">45.2K</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Este Mes</p>
              <p className="text-2xl font-bold">1.2M</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Costo Estimado</p>
              <p className="text-2xl font-bold">$24.50</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
