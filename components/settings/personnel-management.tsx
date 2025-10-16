"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, Phone, MapPin, Edit, Trash2 } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockPersonnel = [
  {
    id: "1",
    name: "Carlos Ramírez",
    role: "Técnico Senior",
    phone: "+57 300 123 4567",
    email: "carlos.ramirez@dagrd.gov.co",
    zone: "Norte",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Ana Martínez",
    role: "Ingeniera Civil",
    phone: "+57 300 234 5678",
    email: "ana.martinez@dagrd.gov.co",
    zone: "Sur",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Luis Hernández",
    role: "Técnico de Campo",
    phone: "+57 300 345 6789",
    email: "luis.hernandez@dagrd.gov.co",
    zone: "Centro",
    status: "active" as const,
  },
  {
    id: "4",
    name: "María González",
    role: "Coordinadora",
    phone: "+57 300 456 7890",
    email: "maria.gonzalez@dagrd.gov.co",
    zone: "Oriente",
    status: "inactive" as const,
  },
]

export function PersonnelManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Personal de Campo</CardTitle>
            <CardDescription>Gestión de técnicos y personal de intervención</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Personal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Personal</DialogTitle>
                <DialogDescription>Registra un nuevo miembro del equipo de campo</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" placeholder="Juan Pérez" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="senior">Técnico Senior</SelectItem>
                      <SelectItem value="engineer">Ingeniero Civil</SelectItem>
                      <SelectItem value="field">Técnico de Campo</SelectItem>
                      <SelectItem value="coordinator">Coordinador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+57 300 123 4567" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="correo@dagrd.gov.co" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="zone">Zona Asignada</Label>
                  <Select>
                    <SelectTrigger id="zone">
                      <SelectValue placeholder="Seleccionar zona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="norte">Norte</SelectItem>
                      <SelectItem value="sur">Sur</SelectItem>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="oriente">Oriente</SelectItem>
                      <SelectItem value="occidente">Occidente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Agregar Personal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPersonnel.map((person) => (
              <Card key={person.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{person.name}</h4>
                        <Badge variant={person.status === "active" ? "default" : "secondary"}>
                          {person.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{person.role}</p>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{person.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{person.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>Zona {person.zone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
