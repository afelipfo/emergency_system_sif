import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Volume2, FileAudio } from "lucide-react"

interface TranscriptionCardProps {
  audioUrl: string
  transcription: string
  duration: string
  confidence: number
}

export function TranscriptionCard({ audioUrl, transcription, duration, confidence }: TranscriptionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transcripción de Audio</CardTitle>
          <Badge variant="outline">Confianza: {confidence}%</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio Player */}
        <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
          <FileAudio className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">Audio Original</p>
            <p className="text-xs text-muted-foreground">Duración: {duration}</p>
          </div>
          <Button size="sm" variant="outline">
            <Volume2 className="mr-2 h-4 w-4" />
            Reproducir
          </Button>
        </div>

        {/* Transcription Text */}
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm leading-relaxed text-foreground">{transcription}</p>
        </div>
      </CardContent>
    </Card>
  )
}
