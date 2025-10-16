import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, User, Phone, Clock, AlertCircle } from "lucide-react"

interface ReportMetadataProps {
  location: {
    address: string
    coordinates: string
    municipality: string
  }
  reporter: {
    name: string
    phone: string
    role: string
  }
  timestamps: {
    received: string
    processed: string
    assigned?: string
  }
  classification: {
    type: string
    subtype: string
    affectedInfrastructure: string
  }
}

export function ReportMetadata({ location, reporter, timestamps, classification }: ReportMetadataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Reporte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary" />
            Ubicación
          </h3>
          <div className="ml-6 space-y-1 text-sm">
            <p className="text-foreground">{location.address}</p>
            <p className="text-muted-foreground">Municipio: {location.municipality}</p>
            <p className="text-muted-foreground">Coordenadas: {location.coordinates}</p>
          </div>
        </div>

        {/* Reporter */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <User className="h-4 w-4 text-primary" />
            Reportante
          </h3>
          <div className="ml-6 space-y-1 text-sm">
            <p className="text-foreground">{reporter.name}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3 w-3" />
              {reporter.phone}
            </p>
            <p className="text-muted-foreground">Rol: {reporter.role}</p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4 text-primary" />
            Cronología
          </h3>
          <div className="ml-6 space-y-1 text-sm">
            <p className="text-muted-foreground">Recibido: {timestamps.received}</p>
            <p className="text-muted-foreground">Procesado: {timestamps.processed}</p>
            {timestamps.assigned && <p className="text-muted-foreground">Asignado: {timestamps.assigned}</p>}
          </div>
        </div>

        {/* Classification */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <AlertCircle className="h-4 w-4 text-primary" />
            Clasificación
          </h3>
          <div className="ml-6 space-y-1 text-sm">
            <p className="text-foreground">{classification.type}</p>
            <p className="text-muted-foreground">Subtipo: {classification.subtype}</p>
            <p className="text-muted-foreground">Infraestructura: {classification.affectedInfrastructure}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
