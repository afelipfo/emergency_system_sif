"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const data = [
  { date: "01 Ene", reportes: 12, resueltos: 10 },
  { date: "05 Ene", reportes: 18, resueltos: 15 },
  { date: "10 Ene", reportes: 25, resueltos: 20 },
  { date: "15 Ene", reportes: 22, resueltos: 24 },
  { date: "20 Ene", reportes: 30, resueltos: 28 },
  { date: "25 Ene", reportes: 28, resueltos: 26 },
  { date: "30 Ene", reportes: 35, resueltos: 32 },
]

export function TimelineChart() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Tendencia Temporal</CardTitle>
        <CardDescription>Reportes recibidos vs resueltos - Último mes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            reportes: {
              label: "Reportes",
              color: "hsl(var(--chart-1))",
            },
            resueltos: {
              label: "Resueltos",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="reportes"
              stackId="1"
              stroke="var(--color-chart-1)"
              fill="var(--color-chart-1)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="resueltos"
              stackId="2"
              stroke="var(--color-chart-4)"
              fill="var(--color-chart-4)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
