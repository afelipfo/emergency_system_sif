# Prompt para v0: Sistema de Reportes de Emergencias DAGRD - Secretaría de Infraestructura Física de Medellín

## Contexto del Proyecto
Sistema de gestión de emergencias 100% automático para el **Departamento Administrativo de Gestión del Riesgo de Desastres (DAGRD)** y la **Secretaría de Infraestructura Física de Medellín**. El sistema procesa reportes de audio enviados por WhatsApp sobre emergencias de infraestructura (deslizamientos, colapsos viales, afectaciones a malla vial, inundaciones, daños estructurales), los estructura mediante IA, y permite consultas históricas en lenguaje natural[1][2].

## Stack Tecnológico
- **Frontend:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes + Vercel Serverless Functions
- **Base de Datos:** Supabase (PostgreSQL + pgvector para embeddings RAG)
- **Autenticación:** Supabase Auth
- **Storage:** Supabase Storage (audios de WhatsApp)
- **Deployment:** Vercel (Edge Network)
- **Integración IA:** OpenAI API (GPT-4.1-mini) + Whisper API para transcripción
- **Webhook Receiver:** Vercel Serverless Functions con endpoints públicos

## Arquitectura Supabase + Vercel

### Esquema de Base de Datos Supabase

```sql
-- Tabla de reportes estructurados
CREATE TABLE reportes_emergencia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_hora_reporte TIMESTAMP WITH TIME ZONE NOT NULL,
  tipo_emergencia TEXT NOT NULL, -- 'Deslizamiento', 'Colapso Vial', 'Inundación', etc.
  ubicacion_texto TEXT NOT NULL,
  comuna TEXT,
  corregimiento TEXT,
  barrio TEXT,
  coordenadas GEOGRAPHY(POINT),
  gravedad TEXT CHECK (gravedad IN ('Baja', 'Media', 'Alta', 'Crítica')),
  resumen_ejecutivo TEXT,
  transcripcion_original TEXT,
  audio_url TEXT, -- URL de Supabase Storage
  responsable_campo TEXT,
  responsable_telefono TEXT,
  metros_afectados NUMERIC,
  metros_cubicos_estimados NUMERIC,
  requiere_maquinaria BOOLEAN DEFAULT false,
  maquinaria_requerida TEXT[],
  requiere_evacuacion BOOLEAN DEFAULT false,
  estado TEXT DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En Proceso', 'Atendido', 'Requiere Seguimiento')),
  coordinado_bomberos BOOLEAN DEFAULT false,
  metadata JSONB, -- JSON completo del LLM
  embedding vector(1536) -- Para búsqueda semántica RAG con pgvector
);

-- Tabla de responsables de campo
CREATE TABLE responsables_campo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_completo TEXT NOT NULL,
  cargo TEXT NOT NULL,
  telefono_whatsapp TEXT UNIQUE NOT NULL,
  zona_asignada TEXT,
  activo BOOLEAN DEFAULT true,
  ultimo_reporte TIMESTAMP WITH TIME ZONE
);

-- Tabla de receptores de alertas
CREATE TABLE receptores_alertas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_completo TEXT NOT NULL,
  cargo TEXT NOT NULL,
  telefono_whatsapp TEXT UNIQUE NOT NULL,
  recibe_alertas_criticas BOOLEAN DEFAULT true,
  recibe_alertas_altas BOOLEAN DEFAULT true,
  comunas_interes TEXT[],
  activo BOOLEAN DEFAULT true
);

-- Tabla de intervenciones realizadas
CREATE TABLE intervenciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporte_id UUID REFERENCES reportes_emergencia(id) ON DELETE CASCADE,
  fecha_intervencion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tipo_accion TEXT NOT NULL, -- 'Remoción Material', 'Terraceo', 'Estudios Técnicos', etc.
  metros_cubicos_removidos NUMERIC,
  maquinaria_utilizada TEXT[],
  cuadrilla_asignada TEXT,
  costo_estimado NUMERIC,
  observaciones TEXT,
  completada BOOLEAN DEFAULT false
);

-- Tabla de consultas históricas (para analytics)
CREATE TABLE consultas_historicas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario_id UUID,
  pregunta TEXT NOT NULL,
  respuesta TEXT,
  reportes_recuperados UUID[],
  tiempo_respuesta_ms INTEGER
);

-- Índices para optimización
CREATE INDEX idx_reportes_fecha ON reportes_emergencia(fecha_hora_reporte DESC);
CREATE INDEX idx_reportes_gravedad ON reportes_emergencia(gravedad);
CREATE INDEX idx_reportes_comuna ON reportes_emergencia(comuna);
CREATE INDEX idx_reportes_estado ON reportes_emergencia(estado);
CREATE INDEX idx_reportes_coordenadas ON reportes_emergencia USING GIST(coordenadas);

-- Índice para búsqueda vectorial (RAG)
CREATE INDEX idx_reportes_embedding ON reportes_emergencia 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Row Level Security (RLS)
ALTER TABLE reportes_emergencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE responsables_campo ENABLE ROW LEVEL SECURITY;
ALTER TABLE receptores_alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervenciones ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso (ejemplo básico)
CREATE POLICY "Admins y responsables pueden ver reportes" 
ON reportes_emergencia FOR SELECT 
USING (auth.role() IN ('authenticated'));

CREATE POLICY "Solo admins pueden insertar reportes" 
ON reportes_emergencia FOR INSERT 
WITH CHECK (auth.jwt()->>'role' = 'admin');
```

### Estructura de Carpetas Next.js (Vercel)

```
/app
  /api
    /webhooks
      /whatsapp/route.ts          # Recibe webhooks de WhatsApp Business API
    /reportes
      /create/route.ts             # Procesa y crea reportes (LLM + embedding)
      /[id]/route.ts               # CRUD individual
      /list/route.ts               # Listado con filtros
    /consultas
      /rag/route.ts                # Endpoint de consulta histórica con RAG
    /intervenciones
      /route.ts                    # CRUD de intervenciones
    /alertas
      /distribuir/route.ts         # Envía alertas masivas vía WhatsApp
  /dashboard
    /page.tsx                      # Dashboard principal (1)
    /reportes
      /[id]/page.tsx               # Vista detallada reporte (2)
    /consultas/page.tsx            # Interface RAG (3)
    /configuracion/page.tsx        # Panel configuración (4)
    /alertas/page.tsx              # Vista alertas (5)
    /estadisticas/page.tsx         # Panel estadístico (6)
  /auth
    /login/page.tsx                # Login con Supabase Auth
  /components
    /dashboard
      /MetricCard.tsx
      /MapaMedellin.tsx            # Mapa interactivo con Leaflet/Mapbox
      /TimelineReportes.tsx
      /FiltrosReportes.tsx
    /reportes
      /DetalleReporte.tsx
      /FormularioIntervencion.tsx
    /consultas
      /ChatRAG.tsx
      /ResultadosRAG.tsx
    /ui                            # Componentes shadcn/ui
  /lib
    /supabase
      /client.ts                   # Cliente Supabase browser
      /server.ts                   # Cliente Supabase server
    /openai.ts                     # Utilidades OpenAI (LLM + embeddings)
    /whatsapp.ts                   # Cliente WhatsApp Business API
    /utils.ts                      # Helpers generales
/public
  /assets
    /logos                         # Logos DAGRD, SIF, Medellín
```

## Componentes a Prototipar

### 1. Dashboard Principal de Monitoreo DAGRD (`/dashboard/page.tsx`)
Crea un dashboard moderno y responsivo para monitorear emergencias de infraestructura en tiempo real con:

**Layout y Estilo:**
- Diseño institucional Alcaldía de Medellín con paleta: Naranja corporativo #FF6B00, azul institucional #003B7A, grises neutros, acentos de alerta
- Sidebar fijo con navegación principal y logos de DAGRD + Secretaría de Infraestructura Física (usar placeholders)
- Header con breadcrumbs, notificaciones en tiempo real (Supabase Realtime subscriptions), acceso directo a línea 123, y botón de logout
- Grid responsivo que colapsa a vista móvil

**Secciones Requeridas:**
- **Tarjetas de métricas superiores** (datos desde Supabase con SQL agregado):
  - Emergencias reportadas hoy (`COUNT(*) WHERE DATE(fecha_hora_reporte) = TODAY()`)
  - Eventos críticos activos (`COUNT(*) WHERE gravedad = 'Crítica' AND estado != 'Atendido'`)
  - Tiempo promedio de respuesta DAGRD (`AVG(intervenciones.fecha_intervencion - reportes.fecha_hora_reporte)`)
  - Metros cúbicos removidos mes actual (`SUM(metros_cubicos_removidos)`)

- **Mapa interactivo de Medellín** (usar react-leaflet o @vis.gl/react-google-maps):
  - Mostrar divisiones por 16 comunas + 5 corregimientos
  - Pines dinámicos por gravedad (colores: verde/amarillo/naranja/rojo)
  - Click en pin → abrir modal con `DetalleReporte`
  - Heatmap opcional para zonas de alta concentración
  - Datos en tiempo real desde Supabase con `supabase.channel().on('postgres_changes')`

- **Timeline en vivo** de últimos 10 reportes:
  - Componente `TimelineReportes` con auto-refresh cada 30s
  - Badges de estado y tipo de emergencia
  - Click → navegar a `/dashboard/reportes/[id]`

- **Gráfico de barras** de tipos de emergencia (últimos 7 días):
  - Usar recharts o tremor para visualización
  - Tipos: Deslizamiento, Colapso Vial, Inundación, Afectación Malla Vial, Daño Estructural, Afectación por Lluvias
  - Query Supabase con `GROUP BY tipo_emergencia`

- **Lista de Responsables de Campo activos**:
  - Tabla desde `responsables_campo` con `activo = true`
  - Indicador visual de último reporte (< 1h = verde, 1-6h = amarillo, > 6h = gris)

**Interactividad:**
- Componente `FiltrosReportes` con:
  - DateRangePicker para rango de fechas
  - Multi-select para tipo de emergencia
  - Dropdown de gravedad mínima
  - Select de comuna/corregimiento
  - Toggle "Solo requiere maquinaria pesada"
- Búsqueda en tiempo real por dirección/barrio (debounce 300ms, búsqueda full-text en Supabase)
- Todos los filtros actualizan URL query params para compartibilidad

**Conexión Supabase (ejemplo en código):**
```typescript
// app/dashboard/page.tsx
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const supabase = createClientComponentClient()
  const [reportes, setReportes] = useState([])
  const [metricas, setMetricas] = useState(null)

  useEffect(() => {
    // Cargar datos iniciales
    async function fetchData() {
      const {  reportesData } = await supabase
        .from('reportes_emergencia')
        .select('*')
        .order('fecha_hora_reporte', { ascending: false })
        .limit(10)
      
      setReportes(reportesData)
      
      // Métricas agregadas
      const {  metricasData } = await supabase
        .rpc('obtener_metricas_dashboard') // Stored procedure en Supabase
      
      setMetricas(metricasData)
    }
    
    fetchData()
    
    // Suscripción en tiempo real a nuevos reportes
    const channel = supabase
      .channel('reportes-cambios')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'reportes_emergencia' },
        (payload) => {
          setReportes((prev) => [payload.new, ...prev.slice(0, 9)])
          // Mostrar toast notification
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    // JSX del dashboard
  )
}
```

### 2. Vista Detallada de Reporte de Emergencia (`/dashboard/reportes/[id]/page.tsx`)
Página completa o modal para visualizar un reporte específico:

**Estructura:**
- Header con ID de reporte (UUID corto), timestamp, y badge de gravedad
- **Sección de Metadatos** en formato grid de cards:
  - Tipo de emergencia con ícono (lucide-react: Mountain para deslizamiento, Construction para colapso vial, Droplets para inundación)
  - Ubicación exacta: dirección + comuna/corregimiento + barrio
  - Mini-mapa embebido (Google Maps Static API o Leaflet estático)
  - Hora del reporte y responsable de campo
  - Estado de intervención con select editable (actualiza Supabase en tiempo real)

- **Panel de Resumen Ejecutivo** destacado con fondo según gravedad
- **Sección de Evaluación Técnica**:
  - Magnitud: metros afectados / metros cúbicos estimados (editable por administradores)
  - Riesgo a infraestructura crítica cercana (checkbox)
  - Requiere maquinaria: chips editables con opciones (Retroexcavadora CAT, Volqueta, Motoniveladora, Compactador)

- **Transcripción Original** en panel expandible:
  - Texto completo de transcripción
  - Botón de reproducción de audio (audio_url desde Supabase Storage)
  - Player HTML5 audio con controles

- **Panel de Intervenciones** (tabla desde `intervenciones`):
  - Listado de acciones realizadas/planificadas
  - Botón "+ Nueva Intervención" abre modal con formulario
  - Campos: Tipo acción, Metros cúbicos removidos, Maquinaria, Cuadrilla, Costo estimado, Observaciones
  - Al guardar → INSERT en Supabase + actualizar estado del reporte

- **Footer con Acciones**:
  - "Asignar Cuadrilla" → Modal con select de cuadrillas disponibles
  - "Coordinar con Bomberos" → Toggle que marca `coordinado_bomberos = true` + envía notificación
  - "Marcar como Atendido" → Actualiza `estado = 'Atendido'`
  - "Exportar Reporte PDF" → Genera PDF con datos (usar jsPDF o react-pdf en API route)
  - "Solicitar Retroexcavadora" → Crea ticket en sistema integrado (simulado)

**Conexión Supabase (ejemplo):**
```typescript
// app/dashboard/reportes/[id]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function DetalleReportePage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  
  const {  reporte, error } = await supabase
    .from('reportes_emergencia')
    .select(`
      *,
      intervenciones (
        id,
        fecha_intervencion,
        tipo_accion,
        metros_cubicos_removidos,
        completada
      )
    `)
    .eq('id', params.id)
    .single()
  
  if (error || !reporte) {
    return <div>Reporte no encontrado</div>
  }
  
  return (
    <DetalleReporte reporte={reporte} />
  )
}
```

### 3. Interface de Consulta Histórica RAG (`/dashboard/consultas/page.tsx`)
Panel para búsquedas en lenguaje natural usando pgvector:

**Diseño:**
- **Barra de búsqueda prominente** (input grande, centrado):
  - Placeholder: "Ej: ¿Cuántos deslizamientos en San Antonio de Prado últimos 3 meses?"
  - Botón de envío con ícono de sparkles (IA)
  - Loading state con spinner durante procesamiento

- **Consultas Sugeridas** (pills debajo del input):
  - "Emergencias Los Balsos últimos 30 días"
  - "Metros cúbicos removidos Altavista este año"
  - "Colapsos viales Popular última semana"
  - "Emergencias por lluvias Santa Elena temporada"
  - "Sectores con más reportes críticos"
  - Click en pill → ejecuta consulta automáticamente

- **Área de Resultados tipo Chat** (componente `ChatRAG`):
  - Pregunta del usuario en bubble derecho (naranja #FF6B00)
  - Respuesta generada por LLM en bubble izquierdo (gris claro)
  - Formato markdown en respuesta (usar react-markdown)
  - Fuentes citadas como chips clickeables que abren el reporte detallado

- **Sección "Reportes Relacionados Recuperados"**:
  - Grid de 3-5 cards compactos con los reportes más relevantes del RAG
  - Cada card muestra: fecha, comuna, tipo emergencia, resumen corto, metros cúbicos, botón "Ver completo"
  - Score de relevancia (similaridad coseno) en badge opcional

**Funcionalidad:**
- Input con autocompletado de comunas/corregimientos (Combobox de shadcn/ui)
- Historial de búsquedas recientes en sidebar colapsable (guardado en `consultas_historicas`)
- Botones de acción en respuesta:
  - "Generar Informe Estadístico PDF"
  - "Crear Alerta Preventiva por Zona" (si detecta patrón de riesgo)
- Loading state con skeleton screens durante consulta RAG (típicamente 2-4 segundos)
- Filtro temporal opcional: "Solo considerar últimos X días/meses"

**Flujo Backend RAG (API Route):**
```typescript
// app/api/consultas/rag/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { OpenAI } from 'openai'
import { cookies } from 'next/headers'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const { pregunta } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })
  
  // 1. Generar embedding de la pregunta
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: pregunta
  })
  const preguntaEmbedding = embeddingResponse.data[0].embedding
  
  // 2. Búsqueda de similitud en Supabase con pgvector
  const {  reportesRelevantes } = await supabase.rpc('buscar_reportes_similares', {
    query_embedding: preguntaEmbedding,
    match_threshold: 0.7,
    match_count: 5
  })
  
  // 3. Construir contexto para el LLM
  const contexto = reportesRelevantes
    .map(r => `Reporte ID ${r.id}: ${r.fecha_hora_reporte} - ${r.tipo_emergencia} en ${r.ubicacion_texto}, ${r.comuna}. Gravedad: ${r.gravedad}. Resumen: ${r.resumen_ejecutivo}`)
    .join('\n\n')
  
  // 4. Generar respuesta con LLM
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Eres un Archivista de Emergencias del DAGRD Medellín. Responde SOLO basándote en los reportes históricos proporcionados. Si no hay información, indícalo claramente. Usa términos específicos de Medellín (comunas, corregimientos, barrios).`
      },
      {
        role: 'user',
        content: `Pregunta: ${pregunta}\n\nReportes Históricos:\n${contexto}`
      }
    ],
    temperature: 0.3
  })
  
  const respuesta = completion.choices[0].message.content
  
  // 5. Guardar consulta en historial
  await supabase.from('consultas_historicas').insert({
    pregunta,
    respuesta,
    reportes_recuperados: reportesRelevantes.map(r => r.id),
    tiempo_respuesta_ms: Date.now() - startTime
  })
  
  return Response.json({ 
    respuesta, 
    reportes_relacionados: reportesRelevantes 
  })
}
```

**Stored Procedure en Supabase (pgvector search):**
```sql
-- Crear función de búsqueda vectorial
CREATE OR REPLACE FUNCTION buscar_reportes_similares(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  fecha_hora_reporte timestamp with time zone,
  tipo_emergencia text,
  ubicacion_texto text,
  comuna text,
  gravedad text,
  resumen_ejecutivo text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    re.id,
    re.fecha_hora_reporte,
    re.tipo_emergencia,
    re.ubicacion_texto,
    re.comuna,
    re.gravedad,
    re.resumen_ejecutivo,
    1 - (re.embedding <=> query_embedding) AS similarity
  FROM reportes_emergencia re
  WHERE 1 - (re.embedding <=> query_embedding) > match_threshold
  ORDER BY re.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### 4. Panel de Configuración del Sistema (`/dashboard/configuracion/page.tsx`)
Interfaz administrativa (solo para roles admin/superadmin):

**Tabs Principales (usar Tabs de shadcn/ui):**

**Tab 1: Conexión WhatsApp Business**
- Card con status de API:
  - Indicador visual (Badge: "Conectado" verde / "Desconectado" rojo)
  - Información del webhook: `https://tu-dominio.vercel.app/api/webhooks/whatsapp`
  - Token de verificación (input readonly con botón copiar)
  - Número de teléfono empresarial DAGRD configurado
  - Botón "Test Webhook" que envía mensaje de prueba
- Integración con línea 123 (toggle activado/desactivado)

**Tab 2: Servicios IA**
- Select de proveedor Speech-to-Text:
  - Opciones: OpenAI Whisper, Google Cloud Speech-to-Text, Azure AI Speech
  - Input para API key (tipo password)
  - Botón "Test Transcripción" con upload de audio de prueba
  
- Select de modelo LLM:
  - Opciones: GPT-4.1-mini, GPT-4-turbo, Claude-3.5-Sonnet
  - Input para API key
  - Textarea para personalizar system prompt (reconocer jerga Medellín: "loma", "ladera", "quebrada")
  - Slider para temperatura (0.0 - 1.0, default 0.3)
  - Botón "Test LLM" con transcripción de ejemplo

- Configuración de embeddings:
  - Modelo: text-embedding-3-small / text-embedding-3-large
  - Match threshold para RAG (slider 0.5 - 0.9, default 0.7)

**Tab 3: Bases de Datos**
- Card Supabase PostgreSQL:
  - Status connection (badge verde/rojo)
  - URL del proyecto (readonly)
  - Estadísticas: Total de reportes, Tamaño DB, Último backup
  - Botón "Sincronizar Ahora" (reindexar embeddings)
  - Logs de última actualización (scroll list de últimos 10 eventos)

- Card pgvector (Base Vectorial):
  - Status del índice ivfflat
  - Número de vectores indexados
  - Tiempo promedio de búsqueda (ms)
  - Botón "Recrear Índice" (para mantenimiento)

**Tab 4: Personal y Permisos**
- **Subtab: Responsables de Campo SIF**
  - Tabla con columns: Nombre, Cargo, Teléfono WhatsApp, Zona Asignada, Estado, Último Reporte
  - DataTable de shadcn/ui con sorting, filtering, pagination
  - Botones: "+ Agregar Responsable", "Editar" (por fila), "Desactivar"
  - Modal de formulario con campos:
    - Input nombre completo
    - Select cargo (Ingeniero Supervisor, Técnico Vial, Coordinador Zonal)
    - Input teléfono con validación formato colombiano (+57)
    - Multi-select zona asignada (comunas/corregimientos)
  - Al guardar → INSERT/UPDATE en `responsables_campo` vía API route

- **Subtab: Receptores de Alertas**
  - Tabla similar con: Nombre, Cargo, Teléfono, Recibe Críticas, Recibe Altas, Comunas de Interés, Estado
  - Formulario con:
    - Input nombre, cargo, teléfono
    - Toggles: "Recibir alertas críticas", "Recibir alertas altas"
    - Multi-select comunas de interés (array)
  - Integración con directorio institucional (simulado con combobox de búsqueda)

- **Subtab: Zonas de Alto Riesgo Priorizadas**
  - Lista editable de sectores según POT y estudios DAGRD
  - Campos: Nombre sector, Comuna, Tipo riesgo predominante, Prioridad (1-5)
  - Estas zonas reciben notificación automática a receptores específicos

**Estética:**
- Forms con labels claros (Label de shadcn/ui)
- Validation states (error/success) en todos los inputs
- Toggle switches (Switch de shadcn/ui) para activar/desactivar servicios
- Badges de status en tiempo real que hacen polling cada 30s
- Toasts de confirmación al guardar cambios
- Dialog de confirmación para acciones destructivas (eliminar responsable, etc.)

### 5. Vista de Alertas Distribuidas (`/dashboard/alertas/page.tsx`)
Feed de notificaciones para directivos y equipos de respuesta:

**Layout:**
- Header con título "Alertas de Emergencia" y filtros inline
- **Filtros superiores** (toolbar compacto):
  - Tabs: Todas / No Atendidas / Por Gravedad / Por Comuna
  - Badge con contador de alertas sin leer
  - Toggle "Solo mostrar requieren evacuación"
  - Select de comuna (opcional)

- **Feed de Alertas** (estilo tipo notificaciones):
  - Cards de alerta con diseño compacto y escaneable:
    - **Header del card:** 
      - Timestamp destacado (ej: "Hace 15 minutos" - usar date-fns formatDistanceToNow)
      - Badge de gravedad (colores institucionales)
      - Badge de tipo emergencia con ícono
    - **Body del card:**
      - Resumen ejecutivo conciso en negrita: "Deslizamiento en Cr. 43A #32-15, Barrio Los Balsos, El Poblado. Aprox. 160m altura. CRÍTICO - Requiere terraceo urgente"
      - Comuna/Corregimiento en badge pequeño
      - Ubicación como link clickeable (abre Google Maps en nueva pestaña)
    - **Footer del card:**
      - Estimación de recursos en texto pequeño: "Requiere: 2 retroexcavadoras, 4 volquetas, estudios geotécnicos"
      - Badge especial si "Coordinado con Bomberos 123" (azul)
      - Botón primario "Ver Detalles Completos" (navega a `/dashboard/reportes/[id]`)
      - Botón secundario "Coordinar Respuesta" (abre modal de acciones rápidas)

- **Sistema de Paginación** al final (usar Pagination de shadcn/ui, 20 alertas por página)

- **Panel Lateral Colapsable** (opcional):
  - Resumen de alertas por gravedad (gráfico de donut pequeño)
  - Top 3 comunas con más alertas activas
  - Botón "Enviar Alerta Manual" (para pruebas)

**Interactividad:**
- Click en card completo → navega a detalle del reporte
- Hover en card → elevación sutil (shadow-lg)
- Badge de "Nueva" para alertas < 5 minutos (pulsa con animación)
- Auto-refresh cada 60 segundos con toast discreto "X nuevas alertas"
- Sonido opcional en navegador para alertas críticas (usar Web Audio API, solo si usuario lo activa)

**Accesibilidad:**
- Alto contraste para alertas críticas (texto blanco en fondo rojo)
- Íconos + texto (no solo color) para gravedad
- Textos descriptivos en aria-labels
- Responsive: en móvil, cards son full-width y más espaciados

**Conexión Tiempo Real:**
```typescript
// Suscripción a nuevas alertas
useEffect(() => {
  const channel = supabase
    .channel('nuevas-alertas')
    .on('postgres_changes',
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'reportes_emergencia',
        filter: 'gravedad=in.(Crítica,Alta)'
      },
      (payload) => {
        // Agregar nueva alerta al estado
        setAlertas(prev => [payload.new, ...prev])
        // Mostrar toast notification
        toast({
          title: "Nueva Emergencia Crítica",
          description: payload.new.resumen_ejecutivo,
          variant: "destructive"
        })
        // Reproducir sonido si está habilitado
        if (notificacionesSonido) {
          playAlertSound()
        }
      }
    )
    .subscribe()
  
  return () => supabase.removeChannel(channel)
}, [])
```

### 6. Panel Estadístico de Intervenciones SIF (`/dashboard/estadisticas/page.tsx`)
Dashboard complementario con métricas operacionales:

**Visualizaciones (usar tremor o recharts):**

- **KPIs Superiores** (Grid de 4 tarjetas grandes):
  - Total emergencias atendidas año en curso (query: `COUNT(*) WHERE YEAR(fecha_hora_reporte) = CURRENT_YEAR AND estado = 'Atendido'`)
  - Tiempo promedio de respuesta en horas (query con JOIN a `intervenciones`)
  - Porcentaje de emergencias resueltas < 48 horas (gauge chart)
  - Inversión estimada en intervenciones COP (suma de `costo_estimado`)

- **Gráfico de Línea:** "Metros Cúbicos de Material Removido por Mes"
  - Últimos 12 meses en eje X
  - Línea con puntos de datos
  - Área sombreada debajo de la línea
  - Tooltip con valor exacto
  - Query: `SELECT DATE_TRUNC('month', fecha_intervencion) AS mes, SUM(metros_cubicos_removidos) FROM intervenciones GROUP BY mes ORDER BY mes`

- **Gráfico de Barras Apiladas:** "Emergencias por Comuna"
  - 16 comunas + 5 corregimientos en eje X
  - Barras apiladas por tipo de emergencia (colores distintos)
  - Legend arriba o a la derecha
  - Query con `GROUP BY comuna, tipo_emergencia`

- **Heatmap:** "Zonas de Mayor Concentración de Emergencias"
  - Mapa de Medellín con overlay de calor
  - Usar react-leaflet con plugin de heatmap
  - Datos desde coordenadas geográficas en Supabase
  - Opción de filtrar por tipo de emergencia

- **Tabla Detallada:** "Top 10 Sectores Críticos Recurrentes"
  - Columns: Nombre Sector, Comuna, Número de Eventos, Tipo Predominante, Última Intervención, Acción
  - DataTable ordenable por número de eventos (desc por defecto)
  - Botón "Ver Historial Completo" por fila
  - Query compleja con aggregación por ubicación similar

- **Sección "Temporada de Lluvias"** (accordion expandible):
  - Comparativa gráfico de líneas: Año actual vs Año anterior vs Promedio 3 años
  - Eje X: Semanas del año (enfocado en abril-mayo, octubre-noviembre)
  - Eje Y: Número de reportes
  - Estadísticas adicionales: Pico máximo, Semana más crítica, Incremento % vs año anterior

**Funcionalidad:**
- **Filtros Globales** en toolbar superior:
  - DateRangePicker (rango de fechas customizable)
  - Multi-select tipo de emergencia
  - Select gravedad mínima
  - Todos los gráficos se actualizan al cambiar filtros

- **Botones de Exportación:**
  - "Exportar a PDF" → Genera reporte completo con todos los gráficos (usar @react-pdf/renderer en API route)
  - "Exportar a Excel" → Descarga datos tabulares (usar xlsx en API route)
  - "Compartir Dashboard" → Genera URL temporal con filtros aplicados

- **Integración con Obras en Ejecución:**
  - Card adicional mostrando "Obras Activas SIF" (simulado)
  - Lista de proyectos en curso relacionados con sectores de alta incidencia
  - Link a sistema externo (Subsecretaría Operativa SIF)

**Queries Optimizadas (Supabase RPC):**
```sql
-- Función para métricas del dashboard estadístico
CREATE OR REPLACE FUNCTION obtener_estadisticas_panel(
  fecha_inicio date,
  fecha_fin date
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  resultado json;
BEGIN
  SELECT json_build_object(
    'total_emergencias', (
      SELECT COUNT(*) FROM reportes_emergencia 
      WHERE fecha_hora_reporte BETWEEN fecha_inicio AND fecha_fin
    ),
    'emergencias_atendidas', (
      SELECT COUNT(*) FROM reportes_emergencia 
      WHERE fecha_hora_reporte BETWEEN fecha_inicio AND fecha_fin 
      AND estado = 'Atendido'
    ),
    'tiempo_promedio_respuesta_horas', (
      SELECT AVG(EXTRACT(EPOCH FROM (i.fecha_intervencion - r.fecha_hora_reporte))/3600)
      FROM reportes_emergencia r
      INNER JOIN intervenciones i ON r.id = i.reporte_id
      WHERE r.fecha_hora_reporte BETWEEN fecha_inicio AND fecha_fin
      AND i.completada = true
    ),
    'inversion_total', (
      SELECT COALESCE(SUM(costo_estimado), 0)
      FROM intervenciones
      WHERE fecha_intervencion BETWEEN fecha_inicio AND fecha_fin
    ),
    'metros_cubicos_total', (
      SELECT COALESCE(SUM(metros_cubicos_removidos), 0)
      FROM intervenciones
      WHERE fecha_intervencion BETWEEN fecha_inicio AND fecha_fin
    )
  ) INTO resultado;
  
  RETURN resultado;
END;
$$;
```

## Flujo de Integración WhatsApp → Supabase → Vercel

### Webhook Receiver (Vercel Serverless Function)
```typescript
// app/api/webhooks/whatsapp/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { OpenAI } from 'openai'
import { cookies } from 'next/headers'
import { headers } from 'next/headers'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN

// GET para verificación del webhook (setup inicial)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')
  
  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  }
  return new Response('Forbidden', { status: 403 })
}

// POST para recibir mensajes de WhatsApp
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Verificar que es un mensaje de audio
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const message = value?.messages?.[0]
    
    if (message?.type !== 'audio') {
      return Response.json({ status: 'ignored' })
    }
    
    const audioId = message.audio.id
    const fromNumber = message.from
    
    // 1. Descargar audio desde WhatsApp
    const audioUrl = await descargarAudioWhatsApp(audioId)
    const audioBuffer = await fetch(audioUrl).then(r => r.arrayBuffer())
    
    // 2. Subir audio a Supabase Storage
    const supabase = createRouteHandlerClient({ cookies })
    const fileName = `reportes/${Date.now()}_${audioId}.ogg`
    const {  uploadData, error: uploadError } = await supabase.storage
      .from('audios-reportes')
      .upload(fileName, audioBuffer, { contentType: 'audio/ogg' })
    
    if (uploadError) throw uploadError
    
    const audioUrlSupabase = supabase.storage
      .from('audios-reportes')
      .getPublicUrl(fileName).data.publicUrl
    
    // 3. Transcribir con OpenAI Whisper
    const transcripcion = await openai.audio.transcriptions.create({
      file: await fetch(audioUrl).then(r => r.blob()),
      model: 'whisper-1',
      language: 'es'
    })
    
    const textoTranscrito = transcripcion.text
    
    // 4. Procesar con LLM para extraer entidades
    const promptProcesamiento = `Eres un Analista de Emergencias del DAGRD Medellín. Analiza esta transcripción de un reporte de emergencia de infraestructura y extrae la información en formato JSON.

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

Transcripción: ${textoTranscrito}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: promptProcesamiento }],
      response_format: { type: 'json_object' },
      temperature: 0.2
    })
    
    const reporteJSON = JSON.parse(completion.choices[0].message.content)
    
    // 5. Generar embedding para RAG
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: textoTranscrito
    })
    const embedding = embeddingResponse.data[0].embedding
    
    // 6. Buscar responsable de campo en Supabase
    const {  responsable } = await supabase
      .from('responsables_campo')
      .select('nombre_completo')
      .eq('telefono_whatsapp', fromNumber)
      .single()
    
    // 7. Guardar en Supabase
    const {  nuevoReporte, error: insertError } = await supabase
      .from('reportes_emergencia')
      .insert({
        fecha_hora_reporte: new Date().toISOString(),
        tipo_emergencia: reporteJSON.tipo_emergencia,
        ubicacion_texto: reporteJSON.ubicacion_texto,
        comuna: reporteJSON.comuna,
        barrio: reporteJSON.barrio,
        gravedad: reporteJSON.gravedad,
        resumen_ejecutivo: reporteJSON.resumen_ejecutivo,
        transcripcion_original: textoTranscrito,
        audio_url: audioUrlSupabase,
        responsable_campo: responsable?.nombre_completo || 'Desconocido',
        responsable_telefono: fromNumber,
        metros_afectados: reporteJSON.metros_afectados,
        metros_cubicos_estimados: reporteJSON.metros_cubicos_estimados,
        requiere_maquinaria: reporteJSON.requiere_maquinaria,
        maquinaria_requerida: reporteJSON.maquinaria_requerida,
        requiere_evacuacion: reporteJSON.requiere_evacuacion,
        meta reporteJSON,
        embedding: JSON.stringify(embedding)
      })
      .select()
      .single()
    
    if (insertError) throw insertError
    
    // 8. Distribuir alertas a receptores (filtrados por gravedad y comunas)
    if (reporteJSON.gravedad === 'Crítica' || reporteJSON.gravedad === 'Alta') {
      await distribuirAlertas(nuevoReporte)
    }
    
    // 9. Enviar confirmación al responsable de campo
    await enviarMensajeWhatsApp(
      fromNumber,
      `✅ Reporte recibido y procesado.\n\nID: ${nuevoReporte.id.slice(0, 8)}\nTipo: ${reporteJSON.tipo_emergencia}\nGravedad: ${reporteJSON.gravedad}\n\nEl DAGRD ha sido notificado.`
    )
    
    return Response.json({ status: 'processed', reporte_id: nuevoReporte.id })
    
  } catch (error) {
    console.error('Error procesando webhook:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

async function descargarAudioWhatsApp(audioId: string): Promise<string> {
  // Obtener URL del audio desde WhatsApp API
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${audioId}`,
    {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`
      }
    }
  )
  const data = await response.json()
  return data.url
}

async function distribuirAlertas(reporte: any) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Obtener receptores según criterios
  const {  receptores } = await supabase
    .from('receptores_alertas')
    .select('*')
    .eq('activo', true)
    .or(`recibe_alertas_criticas.eq.true,recibe_alertas_altas.eq.true`)
    // Filtrar también por comunas_interes si aplica
  
  const mensajeAlerta = `🚨 ALERTA DAGRD - ${reporte.gravedad.toUpperCase()}

${reporte.tipo_emergencia}
📍 ${reporte.ubicacion_texto}
🏘️ ${reporte.comuna}${reporte.barrio ? ` - ${reporte.barrio}` : ''}

${reporte.resumen_ejecutivo}

${reporte.requiere_evacuacion ? '⚠️ REQUIERE EVACUACIÓN' : ''}
${reporte.requiere_maquinaria ? `🚜 Maquinaria: ${reporte.maquinaria_requerida.join(', ')}` : ''}

ID: ${reporte.id.slice(0, 8)}
Ver detalles: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/reportes/${reporte.id}`

  // Enviar a cada receptor
  for (const receptor of receptores || []) {
    await enviarMensajeWhatsApp(receptor.telefono_whatsapp, mensajeAlerta)
  }
}

async function enviarMensajeWhatsApp(to: string, mensaje: string) {
  await fetch(
    `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: mensaje }
      })
    }
  )
}
```

## Requisitos Técnicos Generales

**Stack Completo:**
- Next.js 14+ (App Router, React Server Components)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui (todos los componentes de UI)
- Supabase (PostgreSQL + Auth + Storage + Realtime + pgvector)
- Vercel (deployment con Edge Network)
- Lucide React (iconografía completa)
- date-fns (manipulación de fechas)
- recharts o tremor (gráficos y visualizaciones)
- react-leaflet (mapas interactivos)
- react-markdown (renderizado de respuestas RAG)
- zod (validación de schemas)

**Variables de Entorno (`.env.local`):**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# OpenAI
OPENAI_API_KEY=sk-xxx

# WhatsApp Business
WHATSAPP_PHONE_NUMBER_ID=xxx
WHATSAPP_ACCESS_TOKEN=xxx
WHATSAPP_VERIFY_TOKEN=xxx

# App
NEXT_PUBLIC_APP_URL=https://dagrd-emergencias.vercel.app
```

**Configuración Vercel:**
- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install` o `pnpm install`
- Node.js Version: 20.x
- Regiones: San Francisco (us-west) para menor latencia con Colombia

**Datos Mock Realistas:**
- Comunas de Medellín (16): Popular, Santa Cruz, Manrique, Aranjuez, Castilla, Doce de Octubre, Robledo, Villa Hermosa, Buenos Aires, La Candelaria, Laureles-Estadio, La América, San Javier, El Poblado, Guayabal, Belén
- Corregimientos (5): San Antonio de Prado, Altavista, San Cristóbal, Palmitas, Santa Elena
- Responsables de campo ejemplo:
  - "Ing. Carlos Quintero - Coordinador Zona Norte"
  - "Téc. Andrea Gómez - Supervisora Corregimientos"
  - "Ing. Jaime Naranjo - Director Operativo SIF"
- Emergencias ejemplo con nomenclatura vial colombiana:
  - "Deslizamiento Cr. 43A #32-15, Los Balsos, El Poblado - 160m altura ladera - CRÍTICO"
  - "Hundimiento Cl. 107 #50-23, San Antonio de Prado - Afectación vía principal - ALTO"
  - "Desbordamiento quebrada Santa Elena Km 12 corregimiento Santa Elena - Arrastre material - MEDIO"
  - "Colapso carpeta asfáltica Cir. 75 #44-32, Laureles-Estadio - Hueco 3m diámetro - ALTO"

## Flujo de Navegación
1. Login (`/auth/login`) → Dashboard Principal (`/dashboard`)
2. Dashboard → Vista Detallada Reporte (click en timeline o pin mapa) → `/dashboard/reportes/[id]`
3. Dashboard → Consulta Histórica RAG (menú lateral) → `/dashboard/consultas`
4. Dashboard → Panel Configuración (header, ícono engranaje, solo admin) → `/dashboard/configuracion`
5. Dashboard → Vista Alertas (header, ícono campana con badge) → `/dashboard/alertas`
6. Dashboard → Panel Estadístico (menú lateral, "Informes y Métricas") → `/dashboard/estadisticas`
7. Vista Detallada → "Asignar Cuadrilla" → Modal con select de equipos SIF
8. Cualquier vista → Logout (dropdown en header)

## Priorización de Desarrollo
**Fase 1 (Core):** Dashboard Principal + Vista Detallada de Reporte + Webhook Receiver
**Fase 2 (RAG):** Interface de Consulta Histórica + Búsqueda Vectorial
**Fase 3 (Alertas):** Vista de Alertas Distribuidas + Sistema de notificaciones tiempo real
**Fase 4 (Admin):** Panel de Configuración + Gestión de personal
**Fase 5 (Analytics):** Panel Estadístico + Exportación de reportes

## Notas de Estilo Institucional Alcaldía de Medellín

**Paleta de Colores:**
```css
/* Colores principales */
--naranja-medellin: #FF6B00;      /* Color oficial, CTAs principales */
--azul-institucional: #003B7A;     /* Headers, sidebar, enlaces */
--gris-corporativo: #505050;       /* Texto secundario */
--fondo-claro: #F5F5F5;            /* Fondo general modo claro */
--fondo-oscuro: #1A1A1A;           /* Fondo general modo oscuro */

/* Alertas */
--critica: #DC2626;                /* Rojo intenso */
--alta: #EA580C;                   /* Naranja fuerte */
--media: #F59E0B;                  /* Amarillo/ámbar */
--baja: #16A34A;                   /* Verde */

/* Neutrales */
--gris-100: #F3F4F6;
--gris-200: #E5E7EB;
--gris-300: #D1D5DB;
--gris-700: #374151;
--gris-900: #111827;
```

**Tipografía:**
- Fuente principal: Inter o Roboto (sans-serif, alta legibilidad)
- Tamaños: Base 16px, Headers 24px/20px/18px, Small 14px, Tiny 12px
- Pesos: Regular 400 (texto), Medium 500 (labels), Semibold 600 (subtítulos), Bold 700 (headers)

**Espaciado:**
- Espaciado entre secciones: 24px (lg)
- Espaciado entre componentes: 16px (md)
- Espaciado interno cards: 20px padding
- Bordes redondeados: rounded-lg (8px) para cards, rounded-full para badges

**Animaciones:**
- Transiciones: 200ms para hover states, 300ms para modales/drawers
- Efectos: fadeIn, slideIn desde bottom, scale en hover
- Loading states: skeleton screens con shimmer effect

**Componentes Visuales:**
- Logos en header: Escudo de Medellín + logo DAGRD + logo Secretaría Infraestructura Física (usar placeholders SVG o imágenes Next.js optimizadas)
- Íconos: Lucide React (consistentes en todo el sistema)
  - Mountain (deslizamiento)
  - Construction (colapso vial)
  - Droplets (inundación)
  - AlertTriangle (alerta general)
  - Truck (maquinaria)
  - Users (cuadrillas)
- Sombras: shadow-sm para cards normales, shadow-md para cards elevados, shadow-lg para modales

**Accesibilidad:**
- Contraste mínimo WCAG AA: 4.5:1 para texto normal
- Indicadores visuales + texto (no solo color) para estados
- aria-labels en todos los botones de acción
- Keyboard navigation completa (tab order lógico)
- Focus visible en todos los elementos interactivos

***

Este prompt está completamente adaptado para implementación en **v0 con stack Supabase + Vercel**, incluyendo esquemas de base de datos, API routes, integración de servicios, y arquitectura serverless completa para el sistema de emergencias DAGRD Medellín[1][2][3][4].

Fuentes
[1] DAGRD: gestión del riesgo en Medellín https://www.medellin.gov.co/es/dagrd/
[2] Van 53.750 metros cúbicos de material removidos en ... https://vivirenelpoblado.com/van-53-750-metros-cubicos-de-material-removidos-en-puntos-criticos-por-lluvias-en-medellin/
[3] ✓ Funciones de la Secretaría de Infraestructura Física https://www.medellin.gov.co/es/secretaria-infraestructura-fisica/que-hace/
[4] Subdirección de Manejo de Desastre en Medellín - DAGRD https://www.medellin.gov.co/es/dagrd/manejo-de-desastres/
