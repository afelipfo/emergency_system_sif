import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { reporteId } = await request.json()
    const supabase = await createClient()

    // Get report details
    const { data: reporte, error: reportError } = await supabase
      .from("reportes")
      .select("*")
      .eq("id", reporteId)
      .single()

    if (reportError) throw reportError

    // Get alert recipients based on severity and type
    const { data: recipients, error: recipientsError } = await supabase
      .from("destinatarios_alertas")
      .select("*")
      .eq("activo", true)
      .or(`severidades.cs.{${reporte.severidad}},tipos_emergencia.cs.{${reporte.tipo_emergencia}}`)

    if (recipientsError) throw recipientsError

    console.log("[v0] Distributing alerts to", recipients?.length || 0, "recipients")

    // Create alert records
    const alerts = recipients?.map((recipient) => ({
      reporte_id: reporteId,
      destinatario_id: recipient.id,
      tipo: "email",
      estado: "pendiente",
      fecha_envio: new Date().toISOString(),
    }))

    if (alerts && alerts.length > 0) {
      const { error: alertsError } = await supabase.from("alertas").insert(alerts)

      if (alertsError) throw alertsError
    }

    // TODO: Implement actual email sending logic here
    // For now, just mark as sent
    await supabase.from("alertas").update({ estado: "enviado" }).eq("reporte_id", reporteId)

    return NextResponse.json({
      success: true,
      alertsSent: alerts?.length || 0,
    })
  } catch (error) {
    console.error("[v0] Error distributing alerts:", error)
    return NextResponse.json({ error: "Failed to distribute alerts" }, { status: 500 })
  }
}
