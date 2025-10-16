import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    // Extract filters from query params
    const estado = searchParams.get("estado")
    const severidad = searchParams.get("severidad")
    const tipo = searchParams.get("tipo")
    const municipio = searchParams.get("municipio")
    const fechaInicio = searchParams.get("fechaInicio")
    const fechaFin = searchParams.get("fechaFin")
    const busqueda = searchParams.get("busqueda")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    let query = supabase.from("reportes").select("*", { count: "exact" }).order("fecha_recepcion", { ascending: false })

    // Apply filters
    if (estado) query = query.eq("estado", estado)
    if (severidad) query = query.eq("severidad", severidad)
    if (tipo) query = query.eq("tipo_emergencia", tipo)
    if (municipio) query = query.eq("municipio", municipio)
    if (fechaInicio) query = query.gte("fecha_recepcion", fechaInicio)
    if (fechaFin) query = query.lte("fecha_recepcion", fechaFin)
    if (busqueda) {
      query = query.or(`transcripcion.ilike.%${busqueda}%,ubicacion.ilike.%${busqueda}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
