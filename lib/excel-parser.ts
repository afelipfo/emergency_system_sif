/**
 * Excel file parsing utilities for historical records import
 */

interface HistoricoRecord {
  registro: string
  fecha: Date
  remitido?: string
  registra?: string
  icad?: string
  comuna?: string
  via_principal: string
  complemento?: string
  barrio?: string
  telefono?: string
  contacto?: string
  observacion?: string
  atencion?: string
  prioridad?: string
  evidencias?: string[]
  radicados?: string[]
}

/**
 * Parse Excel file buffer and extract historical records
 * Note: In production, use a library like 'xlsx' or 'exceljs'
 */
export async function parseExcelFile(fileBuffer: ArrayBuffer): Promise<HistoricoRecord[]> {
  try {
    // This is a placeholder implementation
    // In production, you would use a library like 'xlsx':
    // const XLSX = require('xlsx')
    // const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
    // const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    // const data = XLSX.utils.sheet_to_json(worksheet)

    console.log("[v0] Parsing Excel file...")

    // For now, return empty array
    // The actual implementation will be added when xlsx library is installed
    return []
  } catch (error) {
    console.error("[v0] Error parsing Excel file:", error)
    throw new Error("Failed to parse Excel file")
  }
}

/**
 * Validate historical record data
 */
export function validateHistoricoRecord(record: any): HistoricoRecord | null {
  try {
    // Required fields
    if (!record.registro || !record.fecha || !record.via_principal) {
      console.error("[v0] Missing required fields:", record)
      return null
    }

    // Parse date
    let fecha: Date
    if (record.fecha instanceof Date) {
      fecha = record.fecha
    } else if (typeof record.fecha === "string") {
      fecha = new Date(record.fecha)
    } else {
      console.error("[v0] Invalid date format:", record.fecha)
      return null
    }

    // Parse arrays
    const evidencias = record.evidencias
      ? Array.isArray(record.evidencias)
        ? record.evidencias
        : record.evidencias.split(",").map((s: string) => s.trim())
      : []

    const radicados = record.radicados
      ? Array.isArray(record.radicados)
        ? record.radicados
        : record.radicados.split(",").map((s: string) => s.trim())
      : []

    return {
      registro: String(record.registro),
      fecha,
      remitido: record.remitido ? String(record.remitido) : undefined,
      registra: record.registra ? String(record.registra) : undefined,
      icad: record.icad ? String(record.icad) : undefined,
      comuna: record.comuna ? String(record.comuna) : undefined,
      via_principal: String(record.via_principal),
      complemento: record.complemento ? String(record.complemento) : undefined,
      barrio: record.barrio ? String(record.barrio) : undefined,
      telefono: record.telefono ? String(record.telefono) : undefined,
      contacto: record.contacto ? String(record.contacto) : undefined,
      observacion: record.observacion ? String(record.observacion) : undefined,
      atencion: record.atencion ? String(record.atencion) : undefined,
      prioridad: record.prioridad ? String(record.prioridad) : undefined,
      evidencias: evidencias.length > 0 ? evidencias : undefined,
      radicados: radicados.length > 0 ? radicados : undefined,
    }
  } catch (error) {
    console.error("[v0] Error validating record:", error)
    return null
  }
}
