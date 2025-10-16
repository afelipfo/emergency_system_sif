import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("intervenciones")
      .insert({
        reporte_id: body.reporteId,
        personal_id: body.personalId,
        descripcion: body.descripcion,
        estado: "pendiente",
        fecha_asignacion: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Update report status
    await supabase.from("reportes").update({ estado: "en_proceso" }).eq("id", body.reporteId)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating intervention:", error)
    return NextResponse.json({ error: "Failed to create intervention" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase.from("intervenciones").update(updates).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating intervention:", error)
    return NextResponse.json({ error: "Failed to update intervention" }, { status: 500 })
  }
}
