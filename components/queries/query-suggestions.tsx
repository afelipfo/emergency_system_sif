"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"

interface QuerySuggestionsProps {
  onSelectSuggestion: (query: string) => void
}

const suggestions = [
  "¿Cuántos deslizamientos se reportaron en Bello el mes pasado?",
  "Muéstrame todas las inundaciones en El Poblado",
  "¿Cuáles son las emergencias de alta prioridad sin resolver?",
  "Reportes de colapso vial en los últimos 7 días",
  "¿Qué tipo de emergencia es más común en Medellín?",
  "Intervenciones completadas por Carlos Ramírez",
]

export function QuerySuggestions({ onSelectSuggestion }: QuerySuggestionsProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Consultas sugeridas</h3>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto justify-start text-left text-sm bg-transparent"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </Card>
  )
}
