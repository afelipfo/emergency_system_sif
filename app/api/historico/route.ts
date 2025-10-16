import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server"

const MOCK_DATA = [
  {
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
  },
  {
    id: "2",
    registro: "REG-2024-002",
    fecha: "2024-01-16",
    remitido: "DAGRD",
    registra: "Ana Martínez",
    icad: "ICAD-002",
    comuna: "1 - Popular",
    via_principal: "Calle 107",
    complemento: "Con Carrera 45",
    barrio: "Santo Domingo Savio",
    telefono: "3009876543",
    contacto: "Carlos Rodríguez",
    observacion: "Deslizamiento de tierra en zona de ladera",
    atencion: "En proceso",
    prioridad: "Crítica",
    evidencias: ["https://placeholder.com/photo2.jpg", "https://placeholder.com/photo3.jpg"],
    radicados: ["RAD-2024-002"],
    latitud: 6.3282,
    longitud: -75.5397,
    created_at: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    registro: "REG-2024-003",
    fecha: "2024-01-17",
    remitido: "Alcaldía de Medellín",
    registra: "Pedro López",
    icad: "ICAD-003",
    comuna: "14 - El Poblado",
    via_principal: "Avenida El Poblado",
    complemento: "Sector Parque Lleras",
    barrio: "El Poblado",
    telefono: "3005551234",
    contacto: "Laura Sánchez",
    observacion: "Daño en pavimento por filtración de agua",
    atencion: "Atendido",
    prioridad: "Media",
    evidencias: ["https://placeholder.com/photo4.jpg"],
    radicados: ["RAD-2024-003"],
    latitud: 6.2088,
    longitud: -75.5673,
    created_at: "2024-01-17T09:15:00Z",
  },
]

/**
 * GET /api/historico - Get all historical records with filters
 */
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      console.log("[v0] Supabase not configured, returning mock data")
      const searchParams = request.nextUrl.searchParams
      let filteredData = [...MOCK_DATA]

      // Apply filters to mock data
      const comuna = searchParams.get("comuna")
      if (comuna) {
        filteredData = filteredData.filter((r) => r.comuna === comuna)
      }

      const barrio = searchParams.get("barrio")
      if (barrio) {
        filteredData = filteredData.filter((r) => r.barrio.toLowerCase().includes(barrio.toLowerCase()))
      }

      const prioridad = searchParams.get("prioridad")
      if (prioridad) {
        filteredData = filteredData.filter((r) => r.prioridad === prioridad)
      }

      const search = searchParams.get("search")
      if (search) {
        const searchLower = search.toLowerCase()
        filteredData = filteredData.filter(
          (r) =>
            r.registro.toLowerCase().includes(searchLower) ||
            r.via_principal.toLowerCase().includes(searchLower) ||
            r.observacion.toLowerCase().includes(searchLower),
        )
      }

      return NextResponse.json({
        data: filteredData,
        pagination: {
          page: 1,
          limit: 50,
          total: filteredData.length,
          totalPages: 1,
        },
      })
    }

    const supabase = await createServerClient()
    const searchParams = request.nextUrl.searchParams

    // Build query
    let query = supabase
      .from("historico_registros")
      .select("*", { count: "exact" })
      .order("fecha", { ascending: false })

    // Apply filters
    const comuna = searchParams.get("comuna")
    if (comuna) {
      query = query.eq("comuna", comuna)
    }

    const barrio = searchParams.get("barrio")
    if (barrio) {
      query = query.ilike("barrio", `%${barrio}%`)
    }

    const prioridad = searchParams.get("prioridad")
    if (prioridad) {
      query = query.eq("prioridad", prioridad)
    }

    const search = searchParams.get("search")
    if (search) {
      query = query.or(`registro.ilike.%${search}%,via_principal.ilike.%${search}%,observacion.ilike.%${search}%`)
    }

    // Date range filter
    const fechaInicio = searchParams.get("fecha_inicio")
    if (fechaInicio) {
      query = query.gte("fecha", fechaInicio)
    }

    const fechaFin = searchParams.get("fecha_fin")
    if (fechaFin) {
      query = query.lte("fecha", fechaFin)
    }

    // Pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("[v0] Error fetching historico records:", error)
      return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
    }

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
    console.error("[v0] Error in GET /api/historico:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/historico - Create new historical record
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      console.log("[v0] Supabase not configured, simulating record creation")
      const body = await request.json()
      return NextResponse.json(
        {
          data: {
            id: `mock-${Date.now()}`,
            ...body,
            created_at: new Date().toISOString(),
          },
        },
        { status: 201 },
      )
    }

    const supabase = await createServerClient()
    const body = await request.json()

    // Validate required fields
    if (!body.registro || !body.fecha || !body.via_principal) {
      return NextResponse.json({ error: "Missing required fields: registro, fecha, via_principal" }, { status: 400 })
    }

    // Insert record
    const { data, error } = await supabase.from("historico_registros").insert([body]).select().single()

    if (error) {
      console.error("[v0] Error creating historico record:", error)
      return NextResponse.json({ error: "Failed to create record" }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in POST /api/historico:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
