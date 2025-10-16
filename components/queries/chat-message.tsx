import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Bot, Clock, MapPin, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp: string
  relatedReports?: Array<{
    id: string
    type: string
    location: string
    date: string
    severity: "high" | "medium" | "low"
  }>
}

export function ChatMessage({ role, content, timestamp, relatedReports }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
      )}

      <div className={cn("flex max-w-[80%] flex-col gap-2", isUser && "items-end")}>
        <Card className={cn("p-4", isUser ? "bg-primary text-primary-foreground" : "bg-card")}>
          <p className="text-sm leading-relaxed">{content}</p>
        </Card>

        {relatedReports && relatedReports.length > 0 && (
          <div className="w-full space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Reportes relacionados encontrados:</p>
            {relatedReports.map((report) => (
              <Card key={report.id} className="p-3 transition-all hover:bg-accent">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={cn(
                          "h-3 w-3",
                          report.severity === "high"
                            ? "text-destructive"
                            : report.severity === "medium"
                              ? "text-primary"
                              : "text-chart-4",
                        )}
                      />
                      <span className="text-sm font-medium">{report.type}</span>
                      <Badge
                        variant={
                          report.severity === "high"
                            ? "destructive"
                            : report.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {report.severity === "high" ? "Alta" : report.severity === "medium" ? "Media" : "Baja"}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{report.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{report.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{report.id}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
          <User className="h-5 w-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  )
}
