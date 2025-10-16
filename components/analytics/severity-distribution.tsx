"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, Legend } from "recharts"

const data = [
  { name: "Alta", value: 35, fill: "var(--color-destructive)" },
  { name: "Media", value: 58, fill: "var(--color-primary)" },
  { name: "Baja", value: 42, fill: "var(--color-chart-4)" },
]

export function SeverityDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Severidad</CardTitle>
        <CardDescription>Clasificación de prioridad</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Reportes",
            },
          }}
          className="h-[300px]"
        >
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
