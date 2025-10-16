import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

const MOCK_RECORD = {
  id: "1",
  registro: "REG-2024-001",
  fecha: "2024-01-15",
  remitido: "Secretaría de Infraestructura",
  registra: "Juan Pérez",
  icad: "ICAD-001",
  comuna: "10 - La Candelaria",
  via_principal: "Carrera 52",
  complemento: "Con Calle 44",
  barrio: "Prado Centro",
  telefono: "3001234567",
  contacto: "María González",
  observacion: "Hundimiento en la vía principal, requiere atención urgente",
  atencion: "Pendiente",
  prioridad: "Alta",
  evidencias: ["https://placeholder.com/photo1.jpg"],
  radicados: ["RAD-2024-001"],
  latitud: 6.2476,
  longitud: -75.5658,
  created_at: "2024-01-15T10:30:00Z",
}

/**
 * GET /api/historico/[id] - Get single historical record
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!isSupabaseConfigured()) {
      console.log("[v0] Supabase not configured, returning mock record")
      return NextResponse.json({ data: { ...MOCK_RECORD, id } })
    }

    const supabase = await createServerClient()

    const { data, error } = await supabase.from("historico_registros").select("*").eq("id", id).single()

    if (error) {
      console.error("[v0] Error fetching historico record:", error)
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Error in GET /api/historico/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/historico/[id] - Update historical record
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!isSupabaseConfigured()) {
      console.log("[v0] Supabase not configured, simulating update")
      const body = await request.json()
      return NextResponse.json({ data: { ...MOCK_RECORD, id, ...body } })
    }

    const supabase = await createServerClient()
    const body = await request.json()

    const { data, error } = await supabase.from("historico_registros").update(body).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Error updating historico record:", error)
      return NextResponse.json({ error: "Failed to update record" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Error in PATCH /api/historico/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/historico/[id] - Delete historical record
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!isSupabaseConfigured()) {
      console.log("[v0] Supabase not configured, simulating deletion")
      return NextResponse.json({ success: true })
    }

    const supabase = await createServerClient()

    const { error } = await supabase.from("historico_registros").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting historico record:", error)
      return NextResponse.json({ error: "Failed to delete record" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/historico/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
