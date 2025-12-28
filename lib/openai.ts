import OpenAI from "openai"

// Lazy initialization of OpenAI client to avoid build-time errors when env vars are missing
let openaiClient: OpenAI | null = null

function getOpenAIClient() {
  if (openaiClient) return openaiClient

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey && process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    console.warn("OPENAI_API_KEY is missing")
  }

  openaiClient = new OpenAI({
    apiKey: apiKey || "dummy-key-for-build",
  })

  return openaiClient
}

export async function transcribeAudio(audioBuffer: ArrayBuffer): Promise<string> {
  const openai = getOpenAIClient()
  const file = new File([audioBuffer], "audio.ogg", { type: "audio/ogg" })

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language: "es",
  })

  return transcription.text
}

export async function extractEmergencyData(transcription: string) {
  const prompt = `Eres un Analista de Emergencias del DAGRD Medellín. Analiza esta transcripción de un reporte de emergencia de infraestructura y extrae la información en formato JSON.

IMPORTANTE: Reconoce términos locales de Medellín como "loma", "ladera", "quebrada", comunas (Popular, Santa Cruz, etc.), corregimientos (San Antonio de Prado, Altavista, etc.).

Esquema JSON requerido:
{
  "tipo_emergencia": "Deslizamiento | Colapso Vial | Inundación | Afectación Malla Vial | Daño Estructural | Afectación por Lluvias",
  "ubicacion_texto": "Dirección completa",
  "comuna": "Nombre de la comuna o corregimiento",
  "barrio": "Nombre del barrio si se menciona",
  "gravedad": "Baja | Media | Alta | Crítica",
  "resumen_ejecutivo": "1-2 frases concisas para alerta",
  "metros_afectados": número o null,
  "metros_cubicos_estimados": número o null,
  "requiere_maquinaria": boolean,
  "maquinaria_requerida": ["Retroexcavadora", "Volqueta", etc.] o [],
  "requiere_evacuacion": boolean
}

Transcripción: ${transcription}`

  const completion = await getOpenAIClient().chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.2,
  })

  return JSON.parse(completion.choices[0].message.content || "{}")
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await getOpenAIClient().embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  })

  return response.data[0].embedding
}

export async function queryRAG(question: string, context: string): Promise<string> {
  const completion = await getOpenAIClient().chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Eres un Archivista de Emergencias del DAGRD Medellín. Responde SOLO basándote en los reportes históricos proporcionados. Si no hay información, indícalo claramente. Usa términos específicos de Medellín (comunas, corregimientos, barrios).`,
      },
      {
        role: "user",
        content: `Pregunta: ${question}\n\nReportes Históricos:\n${context}`,
      },
    ],
    temperature: 0.3,
  })

  return completion.choices[0].message.content || ""
}

export async function generateRAGResponse(
  query: string,
  similarReports: any[],
): Promise<{ answer: string; sources: string[] }> {
  // Format reports as context
  const context = similarReports
    .map(
      (report, idx) =>
        `[Reporte ${idx + 1}]
ID: ${report.id}
Fecha: ${report.fecha_recepcion}
Tipo: ${report.tipo_emergencia}
Ubicación: ${report.ubicacion}
Severidad: ${report.severidad}
Transcripción: ${report.transcripcion}
---`,
    )
    .join("\n\n")

  const completion = await getOpenAIClient().chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Eres un Analista de Datos del DAGRD Medellín especializado en emergencias de infraestructura. 

INSTRUCCIONES:
- Responde en español de forma clara y profesional
- Usa los reportes históricos proporcionados como fuente principal
- Menciona estadísticas específicas (cantidades, fechas, ubicaciones)
- Identifica patrones y tendencias cuando sea relevante
- Si no hay suficiente información, indícalo claramente
- Usa términos locales de Medellín (comunas, corregimientos, barrios)
- Proporciona recomendaciones cuando sea apropiado`,
      },
      {
        role: "user",
        content: `Pregunta del usuario: ${query}

Reportes históricos relevantes encontrados:
${context || "No se encontraron reportes relevantes en la base de datos."}

Por favor, responde la pregunta basándote en estos reportes históricos.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 800,
  })

  const answer = completion.choices[0].message.content || "No se pudo generar una respuesta."

  // Extract source IDs
  const sources = similarReports.map((r) => r.id)

  return { answer, sources }
}
