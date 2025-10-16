import { AppHeader } from "@/components/app-header"
import { ReportHeader } from "@/components/reports/report-header"
import { ReportMetadata } from "@/components/reports/report-metadata"
import { TranscriptionCard } from "@/components/reports/transcription-card"
import { ExtractedDataCard } from "@/components/reports/extracted-data-card"
import { InterventionsList } from "@/components/reports/interventions-list"
import { AudioPlayer } from "@/components/reports/audio-player"
import { ReportMiniMap } from "@/components/reports/report-mini-map"
import { ReportActions } from "@/components/reports/report-actions"

// Mock data - will be replaced with real data from Supabase
const mockReport = {
  id: "RPT-2024-001",
  status: "in-progress" as const,
  severity: "high" as const,
  type: "Deslizamiento de tierra",
  location: {
    address: "Calle 45 con Carrera 60, Bello",
    coordinates: "6.3389° N, 75.5636° W",
    municipality: "Bello",
  },
  reporter: {
    name: "Juan Pérez",
    phone: "+57 300 123 4567",
    role: "Técnico de Campo",
  },
  timestamps: {
    received: "2024-01-15 14:35:00",
    processed: "2024-01-15 14:35:15",
    assigned: "2024-01-15 14:40:00",
  },
  classification: {
    type: "Deslizamiento de tierra",
    subtype: "Movimiento de masa",
    affectedInfrastructure: "Vía principal",
  },
  audio: {
    url: "/audio/report-001.mp3",
    duration: "2:34",
    transcription:
      "Buenas tardes, reporto un deslizamiento de tierra en la Calle 45 con Carrera 60 en Bello. El deslizamiento está bloqueando completamente la vía principal. Hay aproximadamente 50 metros cúbicos de tierra y rocas en la calzada. No hay heridos pero el tráfico está completamente detenido. Se requiere maquinaria pesada para remover el material. La situación es crítica porque es una vía principal de acceso al municipio.",
    confidence: 96,
  },
  extractedData: {
    emergencyType: "Deslizamiento de tierra",
    location: "Calle 45 con Carrera 60, Bello",
    severity: "Alta",
    affectedInfrastructure: ["Vía principal", "Calzada", "Acceso municipal"],
    estimatedImpact: "Bloqueo total de vía principal",
    immediateActions: [
      "Desplegar maquinaria pesada para remoción de escombros",
      "Establecer rutas alternas de tráfico",
      "Evaluar estabilidad del terreno circundante",
      "Coordinar con autoridades de tránsito",
    ],
  },
  interventions: [
    {
      id: "INT-001",
      assignedTo: "Carlos Ramírez - Técnico Senior",
      assignedDate: "2024-01-15 14:40:00",
      status: "in-progress" as const,
      description: "Evaluación inicial del sitio y coordinación de maquinaria",
      notes: "Equipo en camino al sitio. ETA: 20 minutos",
    },
    {
      id: "INT-002",
      assignedTo: "Ana Martínez - Ingeniera Civil",
      assignedDate: "2024-01-15 14:45:00",
      status: "pending" as const,
      description: "Análisis de estabilidad del terreno",
    },
  ],
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col">
      <AppHeader title="Detalle del Reporte" description="Información completa y seguimiento de intervenciones" />

      <div className="flex-1 space-y-6 p-6">
        <ReportHeader
          reportId={mockReport.id}
          status={mockReport.status}
          severity={mockReport.severity}
          type={mockReport.type}
        />

        <ReportActions reportId={mockReport.id} currentStatus={mockReport.status} />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - Audio, Transcription, and Extracted Data */}
          <div className="space-y-6 lg:col-span-2">
            <AudioPlayer audioUrl={mockReport.audio.url} duration={mockReport.audio.duration} />

            <TranscriptionCard
              audioUrl={mockReport.audio.url}
              transcription={mockReport.audio.transcription}
              duration={mockReport.audio.duration}
              confidence={mockReport.audio.confidence}
            />

            <ExtractedDataCard data={mockReport.extractedData} />

            <InterventionsList interventions={mockReport.interventions} />
          </div>

          {/* Right column - Metadata and Map */}
          <div className="space-y-6">
            <ReportMetadata
              location={mockReport.location}
              reporter={mockReport.reporter}
              timestamps={mockReport.timestamps}
              classification={mockReport.classification}
            />

            <ReportMiniMap coordinates={mockReport.location.coordinates} address={mockReport.location.address} />
          </div>
        </div>
      </div>
    </div>
  )
}
