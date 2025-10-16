import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

const locationData = [
  { municipality: "Bello", count: 45, trend: "+12%" },
  { municipality: "Medellín", count: 38, trend: "+8%" },
  { municipality: "Envigado", count: 22, trend: "-5%" },
  { municipality: "Itagüí", count: 18, trend: "+3%" },
  { municipality: "Copacabana", count: 12, trend: "+15%" },
]

export function LocationStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes por Municipio</CardTitle>
        <CardDescription>Distribución geográfica</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locationData.map((location, index) => (
            <div key={location.municipality} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{location.municipality}</p>
                  <p className="text-sm text-muted-foreground">{location.count} reportes</p>
                </div>
              </div>
              <Badge variant={location.trend.startsWith("+") ? "default" : "secondary"}>{location.trend}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
