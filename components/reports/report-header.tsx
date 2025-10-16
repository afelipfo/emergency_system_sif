import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"

interface ReportHeaderProps {
  reportId: string
  status: "pending" | "in-progress" | "resolved"
  severity: "high" | "medium" | "low"
  type: string
}

export function ReportHeader({ reportId, status, severity, type }: ReportHeaderProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      "in-progress": { label: "En Proceso", variant: "default" as const },
      resolved: { label: "Resuelto", variant: "outline" as const },
    }
    return variants[status as keyof typeof variants]
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: { label: "Alta Prioridad", variant: "destructive" as const },
      medium: { label: "Media Prioridad", variant: "default" as const },
      low: { label: "Baja Prioridad", variant: "secondary" as const },
    }
    return variants[severity as keyof typeof variants]
  }

  return (
    <div className="flex flex-col gap-4 border-b bg-card p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/reports">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{reportId}</h1>
            <Badge variant={getStatusBadge(status).variant}>{getStatusBadge(status).label}</Badge>
            <Badge variant={getSeverityBadge(severity).variant}>{getSeverityBadge(severity).label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  )
}
