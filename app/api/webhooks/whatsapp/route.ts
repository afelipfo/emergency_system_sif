import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { transcribeAudio, extractEmergencyData, generateEmbedding } from "@/lib/openai"
import { downloadWhatsAppAudio } from "@/lib/whatsapp"

export async function GET(request: NextRequest) {
  // WhatsApp webhook verification
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[v0] WhatsApp webhook verified")
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] WhatsApp webhook received:", JSON.stringify(body, null, 2))

    // Extract message data
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const messages = value?.messages

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: "no_messages" })
    }

    const message = messages[0]

    // Only process audio messages
    if (message.type !== "audio") {
      console.log("[v0] Ignoring non-audio message")
      return NextResponse.json({ status: "ignored_non_audio" })
    }

    const supabase = await createClient()

    // Extract sender info
    const from = message.from
    const audioId = message.audio.id
    const timestamp = new Date(Number.parseInt(message.timestamp) * 1000).toISOString()

    console.log("[v0] Processing audio message from:", from)

    // Download audio from WhatsApp
    const audioBuffer = await downloadWhatsAppAudio(audioId)

    // Transcribe audio using Whisper
    console.log("[v0] Transcribing audio...")
    const transcription = await transcribeAudio(audioBuffer)

    // Extract structured data using GPT-4
    console.log("[v0] Extracting emergency data...")
    const extractedData = await extractEmergencyData(transcription.text)

    // Generate embedding for RAG
    console.log("[v0] Generating embedding...")
    const embedding = await generateEmbedding(transcription.text)

    // Save to database
    const { data: report, error } = await supabase
      .from("reportes")
      .insert({
        telefono_reportante: from,
        audio_url: audioId,
        transcripcion: transcription.text,
        confianza_transcripcion: transcription.confidence,
        tipo_emergencia: extractedData.emergencyType,
        subtipo: extractedData.subtype,
        ubicacion: extractedData.location,
        coordenadas: extractedData.coordinates,
        municipio: extractedData.municipality,
        severidad: extractedData.severity,
        infraestructura_afectada: extractedData.affectedInfrastructure,
        impacto_estimado: extractedData.estimatedImpact,
        acciones_inmediatas: extractedData.immediateActions,
        estado: "pendiente",
        embedding: embedding,
        fecha_recepcion: timestamp,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      throw error
    }

    console.log("[v0] Report created:", report.id)

    // Distribute alerts to configured recipients
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/alertas/distribuir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reporteId: report.id }),
    })

    return NextResponse.json({
      status: "success",
      reportId: report.id,
    })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json(
      { error: "Processing failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
