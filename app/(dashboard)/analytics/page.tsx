import { AppHeader } from "@/components/app-header"
import { KPICards } from "@/components/analytics/kpi-cards"
import { EmergencyTypesChart } from "@/components/analytics/emergency-types-chart"
import { SeverityDistribution } from "@/components/analytics/severity-distribution"
import { TimelineChart } from "@/components/analytics/timeline-chart"
import { LocationStats } from "@/components/analytics/location-stats"
import { ResponseTimeStats } from "@/components/analytics/response-time-stats"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col">
      <AppHeader title="Estadísticas" description="Análisis y métricas del sistema de emergencias" />

      <div className="flex-1 space-y-6 p-6">
        <KPICards />

        <TimelineChart />

        <div className="grid gap-6 lg:grid-cols-2">
          <EmergencyTypesChart />
          <SeverityDistribution />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <LocationStats />
          <ResponseTimeStats />
        </div>
      </div>
    </div>
  )
}
