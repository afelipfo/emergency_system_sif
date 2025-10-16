import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "warning" | "danger" | "success"
}

export function StatsCard({ title, value, description, icon: Icon, trend, variant = "default" }: StatsCardProps) {
  const variantStyles = {
    default: "border-border",
    warning: "border-primary/50 bg-primary/5",
    danger: "border-destructive/50 bg-destructive/5",
    success: "border-chart-4/50 bg-chart-4/5",
  }

  return (
    <Card className={cn("transition-all hover:shadow-md", variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <p className={cn("text-xs", trend.isPositive ? "text-chart-4" : "text-destructive")}>
            {trend.isPositive ? "+" : ""}
            {trend.value}% desde el mes pasado
          </p>
        )}
      </CardContent>
    </Card>
  )
}
