import { NextResponse } from "next/server"

/**
 * GET /api/maps/script-url - Returns Google Maps script URL with API key
 * This keeps the API key on the server side
 */
export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
  }

  const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`

  return NextResponse.json({ scriptUrl })
}
