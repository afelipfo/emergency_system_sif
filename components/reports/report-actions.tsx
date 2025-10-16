"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, Flame, CheckCircle, FileDown, Truck, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReportActionsProps {
  reportId: string
  currentStatus: string
}

export function ReportActions({ reportId, currentStatus }: ReportActionsProps) {
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedPersonnel, setSelectedPersonnel] = useState("")
  const [description, setDescription] = useState("")

  const handleAssignCrew = async () => {
    setIsAssigning(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("[v0] Assigning crew:", selectedPersonnel, description)
    setIsAssigning(false)
  }

  const handleExportPDF = () => {
    console.log("[v0] Exporting PDF for report:", reportId)
    // TODO: Implement PDF export
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Asignar Cuadrilla
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Cuadrilla</DialogTitle>
            <DialogDescription>Selecciona el personal de campo para atender esta emergencia</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Personal de Campo</Label>
              <Select value={selectedPersonnel} onValueChange={setSelectedPersonnel}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar personal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Carlos Ramírez - Técnico Senior</SelectItem>
                  <SelectItem value="2">Ana Martínez - Ingeniera Civil</SelectItem>
                  <SelectItem value="3">Luis González - Técnico de Campo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descripción de la Intervención</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe las acciones a realizar..."
                rows={4}
              />
            </div>
            <Button
              onClick={handleAssignCrew}
              disabled={!selectedPersonnel || !description || isAssigning}
              className="w-full"
            >
              {isAssigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Asignando...
                </>
              ) : (
                "Asignar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline" size="sm">
        <Flame className="mr-2 h-4 w-4" />
        Coordinar Bomberos
      </Button>

      {currentStatus !== "atendido" && (
        <Button variant="outline" size="sm">
          <CheckCircle className="mr-2 h-4 w-4" />
          Marcar como Atendido
        </Button>
      )}

      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <FileDown className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>

      <Button variant="outline" size="sm">
        <Truck className="mr-2 h-4 w-4" />
        Solicitar Maquinaria
      </Button>
    </div>
  )
}
