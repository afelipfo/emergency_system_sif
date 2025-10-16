"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Database, HardDrive } from "lucide-react"

export function DatabaseConfig() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Supabase Configuration</CardTitle>
              <CardDescription>Configuración de PostgreSQL y pgvector para almacenamiento y RAG</CardDescription>
            </div>
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Conectado
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supabase-url">Supabase URL</Label>
            <Input
              id="supabase-url"
              placeholder="https://xxxxx.supabase.co"
              defaultValue="https://dagrd-medellin.supabase.co"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supabase-key">Supabase Anon Key</Label>
            <Input id="supabase-key" type="password" placeholder="eyJ..." defaultValue="eyJhbGciOiJIUzI1NiIs..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service-role">Service Role Key</Label>
            <Input id="service-role" type="password" placeholder="eyJ..." defaultValue="eyJhbGciOiJIUzI1NiIs..." />
          </div>

          <Button>Guardar Configuración</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Base de Datos</CardTitle>
          <CardDescription>Uso y rendimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Reportes</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <HardDrive className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Almacenamiento Usado</p>
                <p className="text-2xl font-bold">2.4 GB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mantenimiento</CardTitle>
          <CardDescription>Operaciones de base de datos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Ejecutar Backup Manual
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Optimizar Índices
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Regenerar Embeddings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
