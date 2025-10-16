"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Eye, MapPin, Phone, Calendar, FileText, ImageIcon, User, Building2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface HistoricoRecord {
  id: string
  registro: string
  fecha: string
  remitido?: string
  registra?: string
  icad?: string
  comuna?: string
  via_principal: string
  complemento?: string
  barrio?: string
  telefono?: string
  contacto?: string
  observacion?: string
  atencion?: string
  prioridad?: string
  evidencias?: string[]
  radicados?: string[]
  latitud?: number
  longitud?: number
}

interface RecordsTableProps {
  records: HistoricoRecord[]
  onRecordClick?: (recordId: string) => void
}

export function RecordsTable({ records, onRecordClick }: RecordsTableProps) {
  const [selectedRecord, setSelectedRecord] = useState<HistoricoRecord | null>(null)

  const getPriorityColor = (prioridad?: string) => {
    switch (prioridad?.toLowerCase()) {
      case "alta":
      case "high":
        return "destructive"
      case "media":
      case "medium":
        return "default"
      case "baja":
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registro</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>ICAD</TableHead>
              <TableHead>Remitido</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Barrio</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Atención</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No se encontraron registros
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.registro}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {format(new Date(record.fecha), "dd MMM yyyy", { locale: es })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{record.icad || "-"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm">{record.remitido || "-"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate text-sm">
                      {record.via_principal}
                      {record.complemento && `, ${record.complemento}`}
                    </div>
                    {record.comuna && <div className="text-xs text-muted-foreground">Comuna {record.comuna}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{record.barrio || "-"}</div>
                  </TableCell>
                  <TableCell>
                    {record.prioridad && <Badge variant={getPriorityColor(record.prioridad)}>{record.prioridad}</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm">{record.atencion || "-"}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRecord(record)
                        if (onRecordClick) {
                          onRecordClick(record.id)
                        }
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalle del Registro
            </DialogTitle>
            <DialogDescription>Registro #{selectedRecord?.registro}</DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
                <TabsTrigger value="evidencias">Evidencias</TabsTrigger>
                <TabsTrigger value="radicados">Radicados</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Registro</div>
                        <div className="text-sm font-semibold">{selectedRecord.registro}</div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Fecha</div>
                        <div className="text-sm">
                          {format(new Date(selectedRecord.fecha), "dd MMMM yyyy, HH:mm", {
                            locale: es,
                          })}
                        </div>
                      </div>

                      {selectedRecord.prioridad && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Prioridad</div>
                          <Badge variant={getPriorityColor(selectedRecord.prioridad)}>{selectedRecord.prioridad}</Badge>
                        </div>
                      )}

                      {selectedRecord.icad && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">ICAD</div>
                          <div className="text-sm">{selectedRecord.icad}</div>
                        </div>
                      )}

                      {selectedRecord.remitido && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Remitido</div>
                          <div className="text-sm">{selectedRecord.remitido}</div>
                        </div>
                      )}

                      {selectedRecord.registra && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Registra</div>
                          <div className="text-sm">{selectedRecord.registra}</div>
                        </div>
                      )}

                      {selectedRecord.atencion && (
                        <div className="col-span-2">
                          <div className="text-sm font-medium text-muted-foreground">Atención</div>
                          <div className="text-sm">{selectedRecord.atencion}</div>
                        </div>
                      )}
                    </div>

                    {selectedRecord.observacion && (
                      <>
                        <Separator />
                        <div>
                          <div className="mb-2 text-sm font-medium text-muted-foreground">Observación</div>
                          <div className="rounded-md bg-muted p-3 text-sm">{selectedRecord.observacion}</div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-4 w-4" />
                      Información de Contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedRecord.contacto && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Contacto</div>
                        <div className="text-sm">{selectedRecord.contacto}</div>
                      </div>
                    )}

                    {selectedRecord.telefono && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Teléfono</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${selectedRecord.telefono}`} className="hover:underline">
                            {selectedRecord.telefono}
                          </a>
                        </div>
                      </div>
                    )}

                    {!selectedRecord.contacto && !selectedRecord.telefono && (
                      <div className="text-sm text-muted-foreground">No hay información de contacto disponible</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ubicacion" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      Ubicación Detallada
                    </CardTitle>
                    <CardDescription>Información geográfica del registro</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedRecord.comuna && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Comuna</div>
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {selectedRecord.comuna}
                          </div>
                        </div>
                      )}

                      {selectedRecord.barrio && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Barrio</div>
                          <div className="text-sm">{selectedRecord.barrio}</div>
                        </div>
                      )}

                      <div className="col-span-2">
                        <div className="text-sm font-medium text-muted-foreground">Vía Principal</div>
                        <div className="text-sm font-semibold">{selectedRecord.via_principal}</div>
                      </div>

                      {selectedRecord.complemento && (
                        <div className="col-span-2">
                          <div className="text-sm font-medium text-muted-foreground">Complemento</div>
                          <div className="text-sm">{selectedRecord.complemento}</div>
                        </div>
                      )}

                      {selectedRecord.latitud && selectedRecord.longitud && (
                        <>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Latitud</div>
                            <div className="font-mono text-sm">{selectedRecord.latitud.toFixed(6)}</div>
                          </div>

                          <div>
                            <div className="text-sm font-medium text-muted-foreground">Longitud</div>
                            <div className="font-mono text-sm">{selectedRecord.longitud.toFixed(6)}</div>
                          </div>
                        </>
                      )}
                    </div>

                    {selectedRecord.latitud && selectedRecord.longitud && (
                      <div className="pt-2">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://www.google.com/maps?q=${selectedRecord.latitud},${selectedRecord.longitud}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            Ver en Google Maps
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evidencias" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ImageIcon className="h-4 w-4" />
                      Evidencias Fotográficas
                    </CardTitle>
                    <CardDescription>
                      {selectedRecord.evidencias && selectedRecord.evidencias.length > 0
                        ? `${selectedRecord.evidencias.length} foto(s) adjunta(s)`
                        : "No hay evidencias fotográficas"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedRecord.evidencias && selectedRecord.evidencias.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {selectedRecord.evidencias.map((evidencia, index) => (
                          <div
                            key={index}
                            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                          >
                            <img
                              src={evidencia || "/placeholder.svg"}
                              alt={`Evidencia ${index + 1}`}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button variant="secondary" size="sm" asChild>
                                <a href={evidencia} target="_blank" rel="noopener noreferrer">
                                  Ver completa
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">No hay evidencias disponibles</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="radicados" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4" />
                      Radicados Asociados
                    </CardTitle>
                    <CardDescription>
                      {selectedRecord.radicados && selectedRecord.radicados.length > 0
                        ? `${selectedRecord.radicados.length} radicado(s) asociado(s)`
                        : "No hay radicados asociados"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedRecord.radicados && selectedRecord.radicados.length > 0 ? (
                      <div className="space-y-2">
                        {selectedRecord.radicados.map((radicado, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-mono text-sm font-medium">{radicado}</div>
                                <div className="text-xs text-muted-foreground">Radicado #{index + 1}</div>
                              </div>
                            </div>
                            <Badge variant="outline">Activo</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                        <div className="text-center">
                          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">No hay radicados asociados</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
