"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockData = [
  { tipo: "Deslizamiento", cantidad: 45 },
  { tipo: "Colapso Vial", cantidad: 28 },
  { tipo: "Inundación", cantidad: 32 },
  { tipo: "Afect. Malla Vial", cantidad: 19 },
  { tipo: "Daño Estructural", cantidad: 15 },
  { tipo: "Afect. por Lluvias", cantidad: 38 },
]

export function EmergencyTypesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Emergencia</CardTitle>
        <CardDescription>Últimos 7 días</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="tipo" className="text-xs" angle={-45} textAnchor="end" height={100} />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
