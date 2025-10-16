import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateEmbedding, generateRAGResponse } from "@/lib/openai"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    console.log("[v0] RAG query received:", query)

    const supabase = await createClient()

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)

    // Perform vector similarity search using pgvector
    const { data: similarReports, error } = await supabase.rpc("buscar_reportes_similares", {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5,
    })

    if (error) {
      console.error("[v0] Vector search error:", error)
      throw error
    }

    console.log("[v0] Found similar reports:", similarReports?.length || 0)

    // Generate contextual response using GPT-4
    const response = await generateRAGResponse(query, similarReports || [])

    // Save query to history
    await supabase.from("consultas_historicas").insert({
      consulta: query,
      respuesta: response.answer,
      reportes_relacionados: similarReports?.map((r: any) => r.id) || [],
      embedding: queryEmbedding,
    })

    return NextResponse.json({
      answer: response.answer,
      relatedReports: similarReports || [],
      sources: response.sources,
    })
  } catch (error) {
    console.error("[v0] RAG query error:", error)
    return NextResponse.json(
      { error: "Failed to process query", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
