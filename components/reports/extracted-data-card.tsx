import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface ExtractedData {
  emergencyType: string
  location: string
  severity: string
  affectedInfrastructure: string[]
  estimatedImpact: string
  immediateActions: string[]
}

interface ExtractedDataCardProps {
  data: ExtractedData
}

export function ExtractedDataCard({ data }: ExtractedDataCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Datos Extraídos por IA</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Tipo de Emergencia</p>
            <p className="text-sm font-semibold text-foreground">{data.emergencyType}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Ubicación</p>
            <p className="text-sm font-semibold text-foreground">{data.location}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Severidad</p>
            <Badge
              variant={data.severity === "Alta" ? "destructive" : data.severity === "Media" ? "default" : "secondary"}
            >
              {data.severity}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Impacto Estimado</p>
            <p className="text-sm font-semibold text-foreground">{data.estimatedImpact}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Infraestructura Afectada</p>
          <div className="flex flex-wrap gap-2">
            {data.affectedInfrastructure.map((item, index) => (
              <Badge key={index} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Acciones Inmediatas Recomendadas</p>
          <ul className="space-y-1">
            {data.immediateActions.map((action, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
