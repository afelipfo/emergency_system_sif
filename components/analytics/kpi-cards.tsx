import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const kpis = [
  {
    title: "Total Reportes",
    value: "1,247",
    change: "+12.5%",
    trend: "up" as const,
    icon: AlertTriangle,
    description: "vs mes anterior",
  },
  {
    title: "Tasa de Resolución",
    value: "94.2%",
    change: "+3.1%",
    trend: "up" as const,
    icon: CheckCircle,
    description: "Promedio mensual",
  },
  {
    title: "Tiempo Promedio",
    value: "45 min",
    change: "-8.3%",
    trend: "down" as const,
    icon: Clock,
    description: "Respuesta inicial",
  },
  {
    title: "Personal Activo",
    value: "24",
    change: "+2",
    trend: "up" as const,
    icon: Users,
    description: "Técnicos disponibles",
  },
]

export function KPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center gap-1 text-xs">
              {kpi.trend === "up" ? (
                <TrendingUp
                  className={cn("h-3 w-3", kpi.title === "Total Reportes" ? "text-destructive" : "text-chart-4")}
                />
              ) : (
                <TrendingDown className="h-3 w-3 text-chart-4" />
              )}
              <span
                className={cn(
                  kpi.trend === "up" && kpi.title === "Total Reportes" ? "text-destructive" : "text-chart-4",
                )}
              >
                {kpi.change}
              </span>
              <span className="text-muted-foreground">{kpi.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
