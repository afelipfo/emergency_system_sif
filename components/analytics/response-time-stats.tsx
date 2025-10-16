import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingDown, TrendingUp } from "lucide-react"

export function ResponseTimeStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiempos de Respuesta</CardTitle>
        <CardDescription>Métricas de eficiencia operativa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
              <p className="text-2xl font-bold">45 min</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-chart-4">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">-12%</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Alta Prioridad</p>
              <p className="text-2xl font-bold">28 min</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-chart-4">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">-8%</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Resolución Completa</p>
              <p className="text-2xl font-bold">4.2 hrs</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-destructive">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">+5%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
