/**
 * Geocoding utilities for converting Medellín addresses to coordinates
 * Uses Google Maps Geocoding API
 */

interface GeocodeResult {
  latitud: number
  longitud: number
  formatted_address?: string
}

/**
 * Geocode a Medellín address using Google Maps API
 */
export async function geocodeAddress(
  comuna: string,
  viaPrincipal: string,
  complemento?: string,
  barrio?: string,
): Promise<GeocodeResult | null> {
  try {
    // Build full address for Medellín
    const addressParts = [viaPrincipal]
    if (complemento) addressParts.push(complemento)
    if (barrio) addressParts.push(barrio)
    if (comuna) addressParts.push(`Comuna ${comuna}`)
    addressParts.push("Medellín, Antioquia, Colombia")

    const fullAddress = addressParts.join(", ")

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error("[v0] Google Maps API key not configured")
      return null
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return {
        latitud: location.lat,
        longitud: location.lng,
        formatted_address: data.results[0].formatted_address,
      }
    }

    console.error("[v0] Geocoding failed:", data.status)
    return null
  } catch (error) {
    console.error("[v0] Error geocoding address:", error)
    return null
  }
}

/**
 * Batch geocode multiple addresses
 */
export async function batchGeocodeAddresses(
  records: Array<{
    id: string
    comuna: string
    viaPrincipal: string
    complemento?: string
    barrio?: string
  }>,
): Promise<Map<string, GeocodeResult>> {
  const results = new Map<string, GeocodeResult>()

  // Process in batches to avoid rate limits
  const batchSize = 10
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize)
    const promises = batch.map(async (record) => {
      const result = await geocodeAddress(record.comuna, record.viaPrincipal, record.complemento, record.barrio)
      if (result) {
        results.set(record.id, result)
      }
      // Add delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 200))
    })

    await Promise.all(promises)
  }

  return results
}
