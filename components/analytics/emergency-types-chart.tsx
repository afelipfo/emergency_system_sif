"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const data = [
  { type: "Deslizamiento", count: 45, fill: "var(--color-chart-1)" },
  { type: "Inundación", count: 32, fill: "var(--color-chart-2)" },
  { type: "Colapso Vial", count: 28, fill: "var(--color-chart-3)" },
  { type: "Daño Estructural", count: 18, fill: "var(--color-chart-4)" },
  { type: "Grietas", count: 12, fill: "var(--color-chart-5)" },
]

export function EmergencyTypesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Emergencia</CardTitle>
        <CardDescription>Distribución por categoría - Últimos 30 días</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Reportes",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
