import { AppHeader } from "@/components/app-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { EmergencyMap } from "@/components/dashboard/emergency-map"
import { RecentReports } from "@/components/dashboard/recent-reports"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { FiltersReportes } from "@/components/dashboard/filters-reportes"
import { EmergencyTypesChart } from "@/components/dashboard/emergency-types-chart"
import { FieldPersonnelList } from "@/components/dashboard/field-personnel-list"
import { AlertTriangle, Clock, CheckCircle, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <AppHeader
        title="Dashboard Principal"
        description="Monitoreo en tiempo real de emergencias de infraestructura"
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: "Dashboard" }]}
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Emergencias Hoy"
            value={12}
            description="Reportadas en las últimas 24h"
            icon={AlertTriangle}
            variant="warning"
            trend={{ value: 8, isPositive: false }}
          />
          <StatsCard
            title="Eventos Críticos"
            value={5}
            description="Requieren atención inmediata"
            icon={Clock}
            variant="danger"
            trend={{ value: 15, isPositive: false }}
          />
          <StatsCard
            title="Tiempo Promedio"
            value="3.2h"
            description="Respuesta DAGRD"
            icon={TrendingUp}
            variant="success"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="M³ Removidos"
            value="1,245"
            description="Mes actual"
            icon={CheckCircle}
            variant="default"
            trend={{ value: 18, isPositive: true }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <FiltersReportes />
          </div>
          <div className="lg:col-span-3">
            <EmergencyTypesChart />
          </div>
        </div>

        {/* Map and Recent Reports */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EmergencyMap />
          </div>
          <RecentReports />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <FieldPersonnelList />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  )
}
