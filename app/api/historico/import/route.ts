import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { parseExcelFile, validateHistoricoRecord } from "@/lib/excel-parser"
import { batchGeocodeAddresses } from "@/lib/geocoding"

/**
 * POST /api/historico/import - Import historical records from Excel file
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls") && !file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an Excel file (.xlsx, .xls, or .csv)" },
        { status: 400 },
      )
    }

    console.log("[v0] Processing Excel file:", file.name)

    // Parse Excel file
    const buffer = await file.arrayBuffer()
    const records = await parseExcelFile(buffer)

    console.log("[v0] Parsed records:", records.length)

    // Validate records
    const validRecords = records.map((record) => validateHistoricoRecord(record)).filter((record) => record !== null)

    console.log("[v0] Valid records:", validRecords.length)

    if (validRecords.length === 0) {
      return NextResponse.json({ error: "No valid records found in file" }, { status: 400 })
    }

    if (!isSupabaseConfigured()) {
      console.log("[v0] Supabase not configured, simulating import")
      return NextResponse.json({
        success: true,
        imported: validRecords.length,
        total: records.length,
        geocoded: validRecords.length,
      })
    }

    // Geocode addresses
    console.log("[v0] Geocoding addresses...")
    const recordsToGeocode = validRecords.map((record, index) => ({
      id: String(index),
      comuna: record.comuna || "",
      viaPrincipal: record.via_principal,
      complemento: record.complemento,
      barrio: record.barrio,
    }))

    const geocodedResults = await batchGeocodeAddresses(recordsToGeocode)

    // Add coordinates to records
    const recordsWithCoordinates = validRecords.map((record, index) => {
      const geocoded = geocodedResults.get(String(index))
      return {
        ...record,
        latitud: geocoded?.latitud,
        longitud: geocoded?.longitud,
      }
    })

    // Insert records into database
    console.log("[v0] Inserting records into database...")
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("historico_registros").insert(recordsWithCoordinates).select()

    if (error) {
      console.error("[v0] Error inserting records:", error)
      return NextResponse.json({ error: "Failed to import records" }, { status: 500 })
    }

    console.log("[v0] Successfully imported records:", data?.length)

    return NextResponse.json({
      success: true,
      imported: data?.length || 0,
      total: records.length,
      geocoded: geocodedResults.size,
    })
  } catch (error) {
    console.error("[v0] Error in POST /api/historico/import:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
