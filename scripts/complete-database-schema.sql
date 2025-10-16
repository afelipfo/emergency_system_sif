-- =====================================================
-- DAGRD-SIF MEDELLÍN - COMPLETE DATABASE SCHEMA
-- Sistema de Gestión de Emergencias de Infraestructura
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- =====================================================
-- 1. USUARIOS (Users and Authentication)
-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nombre_completo TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'operator', 'field', 'viewer')),
  telefono TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- =====================================================
-- 2. REPORTES (Emergency Reports from WhatsApp)
-- =====================================================

CREATE TABLE IF NOT EXISTS reportes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_reporte TEXT UNIQUE NOT NULL,
  fecha_recepcion TIMESTAMPTZ DEFAULT NOW(),
  
  -- WhatsApp data
  whatsapp_message_id TEXT UNIQUE,
  whatsapp_phone TEXT NOT NULL,
  audio_url TEXT,
  
  -- Transcription
  transcripcion TEXT,
  transcripcion_confianza DECIMAL(3,2),
  
  -- AI Extracted data
  tipo_emergencia TEXT CHECK (tipo_emergencia IN ('deslizamiento', 'colapso_via', 'inundacion', 'dano_estructural', 'otro')),
  severidad TEXT CHECK (severidad IN ('baja', 'media', 'alta', 'critica')),
  ubicacion_texto TEXT,
  comuna TEXT,
  barrio TEXT,
  coordenadas_lat DECIMAL(10, 8),
  coordenadas_lng DECIMAL(11, 8),
  descripcion_ia TEXT,
  
  -- Status
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'asignado', 'en_atencion', 'resuelto', 'cerrado')),
  prioridad INTEGER DEFAULT 3 CHECK (prioridad BETWEEN 1 AND 5),
  
  -- Assignment
  asignado_a UUID REFERENCES usuarios(id),
  fecha_asignacion TIMESTAMPTZ,
  
  -- Vector embedding for RAG
  embedding vector(1536),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reportes_fecha ON reportes(fecha_recepcion DESC);
CREATE INDEX idx_reportes_estado ON reportes(estado);
CREATE INDEX idx_reportes_tipo ON reportes(tipo_emergencia);
CREATE INDEX idx_reportes_severidad ON reportes(severidad);
CREATE INDEX idx_reportes_comuna ON reportes(comuna);
CREATE INDEX idx_reportes_asignado ON reportes(asignado_a);
CREATE INDEX idx_reportes_whatsapp ON reportes(whatsapp_phone);

-- Vector similarity search index
CREATE INDEX idx_reportes_embedding ON reportes USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- =====================================================
-- 3. PERSONAL_CAMPO (Field Personnel)
-- =====================================================

CREATE TABLE IF NOT EXISTS personal_campo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  cargo TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT,
  especialidad TEXT,
  zona_asignada TEXT,
  disponible BOOLEAN DEFAULT true,
  ubicacion_actual_lat DECIMAL(10, 8),
  ubicacion_actual_lng DECIMAL(11, 8),
  ultima_actualizacion TIMESTAMPTZ,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_personal_disponible ON personal_campo(disponible, activo);
CREATE INDEX idx_personal_zona ON personal_campo(zona_asignada);

-- =====================================================
-- 4. INTERVENCIONES (Interventions/Actions)
-- =====================================================

CREATE TABLE IF NOT EXISTS intervenciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporte_id UUID NOT NULL REFERENCES reportes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('evaluacion', 'reparacion_temporal', 'reparacion_definitiva', 'coordinacion', 'seguimiento')),
  descripcion TEXT NOT NULL,
  personal_id UUID REFERENCES personal_campo(id),
  fecha_inicio TIMESTAMPTZ DEFAULT NOW(),
  fecha_fin TIMESTAMPTZ,
  estado TEXT DEFAULT 'planificada' CHECK (estado IN ('planificada', 'en_progreso', 'completada', 'cancelada')),
  observaciones TEXT,
  recursos_utilizados JSONB DEFAULT '[]',
  costo_estimado DECIMAL(12, 2),
  evidencias JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_intervenciones_reporte ON intervenciones(reporte_id);
CREATE INDEX idx_intervenciones_personal ON intervenciones(personal_id);
CREATE INDEX idx_intervenciones_estado ON intervenciones(estado);
CREATE INDEX idx_intervenciones_fecha ON intervenciones(fecha_inicio DESC);

-- =====================================================
-- 5. DESTINATARIOS_ALERTAS (Alert Recipients)
-- =====================================================

CREATE TABLE IF NOT EXISTS destinatarios_alertas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  cargo TEXT,
  departamento TEXT,
  tipo_alertas TEXT[] DEFAULT ARRAY['todas'],
  severidad_minima TEXT DEFAULT 'media' CHECK (severidad_minima IN ('baja', 'media', 'alta', 'critica')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_destinatarios_activo ON destinatarios_alertas(activo);
CREATE INDEX idx_destinatarios_email ON destinatarios_alertas(email);

-- =====================================================
-- 6. ALERTAS (Alerts Log)
-- =====================================================

CREATE TABLE IF NOT EXISTS alertas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporte_id UUID REFERENCES reportes(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('nuevo_reporte', 'cambio_estado', 'escalamiento', 'resolucion', 'sistema')),
  severidad TEXT NOT NULL CHECK (severidad IN ('baja', 'media', 'alta', 'critica')),
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  destinatarios UUID[] DEFAULT ARRAY[]::UUID[],
  enviada BOOLEAN DEFAULT false,
  fecha_envio TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_alertas_reporte ON alertas(reporte_id);
CREATE INDEX idx_alertas_tipo ON alertas(tipo);
CREATE INDEX idx_alertas_severidad ON alertas(severidad);
CREATE INDEX idx_alertas_fecha ON alertas(created_at DESC);
CREATE INDEX idx_alertas_enviada ON alertas(enviada);

-- =====================================================
-- 7. CONSULTAS_HISTORICAS (Historical RAG Queries)
-- =====================================================

CREATE TABLE IF NOT EXISTS consultas_historicas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id),
  consulta TEXT NOT NULL,
  respuesta TEXT,
  reportes_relacionados UUID[] DEFAULT ARRAY[]::UUID[],
  tiempo_respuesta_ms INTEGER,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_consultas_usuario ON consultas_historicas(usuario_id);
CREATE INDEX idx_consultas_fecha ON consultas_historicas(created_at DESC);

-- Vector similarity search index
CREATE INDEX idx_consultas_embedding ON consultas_historicas USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- =====================================================
-- 8. HISTORICO (Historical Records from Excel Import)
-- =====================================================

CREATE TABLE IF NOT EXISTS historico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Original fields from Excel
  registro TEXT NOT NULL,
  fecha DATE NOT NULL,
  remitido TEXT,
  registra TEXT,
  icad TEXT,
  comuna TEXT,
  via_principal TEXT,
  complemento TEXT,
  barrio TEXT,
  telefono TEXT,
  contacto TEXT,
  observacion TEXT,
  atencion TEXT,
  prioridad TEXT,
  evidencias TEXT[], -- Array of photo URLs
  radicados TEXT[], -- Array of document references
  
  -- Geocoding
  coordenadas_lat DECIMAL(10, 8),
  coordenadas_lng DECIMAL(11, 8),
  geocoded BOOLEAN DEFAULT false,
  
  -- Metadata
  importado_por UUID REFERENCES usuarios(id),
  fecha_importacion TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_historico_registro ON historico(registro);
CREATE INDEX idx_historico_fecha ON historico(fecha DESC);
CREATE INDEX idx_historico_comuna ON historico(comuna);
CREATE INDEX idx_historico_barrio ON historico(barrio);
CREATE INDEX idx_historico_prioridad ON historico(prioridad);
CREATE INDEX idx_historico_geocoded ON historico(geocoded);
CREATE INDEX idx_historico_coordenadas ON historico(coordenadas_lat, coordenadas_lng);

-- =====================================================
-- 9. CONFIGURACION (System Configuration)
-- =====================================================

CREATE TABLE IF NOT EXISTS configuracion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  tipo TEXT DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
  descripcion TEXT,
  categoria TEXT,
  actualizado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_configuracion_clave ON configuracion(clave);
CREATE INDEX idx_configuracion_categoria ON configuracion(categoria);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_campo ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervenciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinatarios_alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas_historicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- Usuarios policies
CREATE POLICY "Usuarios can view their own profile"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Admins can update users"
  ON usuarios FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Reportes policies
CREATE POLICY "Authenticated users can view reportes"
  ON reportes FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Operators and admins can insert reportes"
  ON reportes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'operator')
    )
  );

CREATE POLICY "Operators and admins can update reportes"
  ON reportes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'operator')
    )
  );

-- Personal campo policies
CREATE POLICY "Authenticated users can view personal"
  ON personal_campo FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage personal"
  ON personal_campo FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Intervenciones policies
CREATE POLICY "Authenticated users can view intervenciones"
  ON intervenciones FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Operators and admins can manage intervenciones"
  ON intervenciones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'operator', 'field')
    )
  );

-- Alertas policies
CREATE POLICY "Authenticated users can view alertas"
  ON alertas FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert alertas"
  ON alertas FOR INSERT
  WITH CHECK (true);

-- Historico policies
CREATE POLICY "Authenticated users can view historico"
  ON historico FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Operators and admins can manage historico"
  ON historico FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('admin', 'operator')
    )
  );

-- Consultas historicas policies
CREATE POLICY "Users can view their own queries"
  ON consultas_historicas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert their own queries"
  ON consultas_historicas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Configuracion policies
CREATE POLICY "Authenticated users can view config"
  ON configuracion FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage config"
  ON configuracion FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reportes_updated_at BEFORE UPDATE ON reportes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_updated_at BEFORE UPDATE ON personal_campo
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intervenciones_updated_at BEFORE UPDATE ON intervenciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinatarios_updated_at BEFORE UPDATE ON destinatarios_alertas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_historico_updated_at BEFORE UPDATE ON historico
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracion_updated_at BEFORE UPDATE ON configuracion
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate report number
CREATE OR REPLACE FUNCTION generate_report_number()
RETURNS TEXT AS $$
DECLARE
  year_prefix TEXT;
  sequence_num INTEGER;
BEGIN
  year_prefix := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COUNT(*) + 1 INTO sequence_num
  FROM reportes
  WHERE EXTRACT(YEAR FROM fecha_recepcion) = EXTRACT(YEAR FROM NOW());
  
  RETURN 'REP-' || year_prefix || '-' || LPAD(sequence_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate report number
CREATE OR REPLACE FUNCTION set_report_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_reporte IS NULL THEN
    NEW.numero_reporte := generate_report_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_reportes_number BEFORE INSERT ON reportes
  FOR EACH ROW EXECUTE FUNCTION set_report_number();

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default configuration values
INSERT INTO configuracion (clave, valor, tipo, descripcion, categoria) VALUES
  ('whatsapp_webhook_url', '', 'string', 'URL del webhook de WhatsApp Business', 'whatsapp'),
  ('whatsapp_phone_number_id', '', 'string', 'ID del número de teléfono de WhatsApp', 'whatsapp'),
  ('whatsapp_access_token', '', 'string', 'Token de acceso de WhatsApp Business API', 'whatsapp'),
  ('openai_api_key', '', 'string', 'API Key de OpenAI', 'ai'),
  ('openai_model_transcription', 'whisper-1', 'string', 'Modelo de OpenAI para transcripción', 'ai'),
  ('openai_model_extraction', 'gpt-4-turbo-preview', 'string', 'Modelo de OpenAI para extracción de datos', 'ai'),
  ('openai_model_rag', 'gpt-4-turbo-preview', 'string', 'Modelo de OpenAI para RAG', 'ai'),
  ('google_maps_api_key', '', 'string', 'API Key de Google Maps', 'maps'),
  ('alert_email_enabled', 'true', 'boolean', 'Habilitar alertas por email', 'alerts'),
  ('alert_whatsapp_enabled', 'false', 'boolean', 'Habilitar alertas por WhatsApp', 'alerts'),
  ('sistema_nombre', 'DAGRD-SIF Medellín', 'string', 'Nombre del sistema', 'general'),
  ('sistema_version', '1.0.0', 'string', 'Versión del sistema', 'general')
ON CONFLICT (clave) DO NOTHING;

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- View: Reportes con información completa
CREATE OR REPLACE VIEW vista_reportes_completos AS
SELECT 
  r.*,
  u.nombre_completo as asignado_nombre,
  u.email as asignado_email,
  COUNT(DISTINCT i.id) as total_intervenciones,
  COUNT(DISTINCT CASE WHEN i.estado = 'completada' THEN i.id END) as intervenciones_completadas
FROM reportes r
LEFT JOIN usuarios u ON r.asignado_a = u.id
LEFT JOIN intervenciones i ON r.id = i.reporte_id
GROUP BY r.id, u.nombre_completo, u.email;

-- View: Estadísticas por comuna
CREATE OR REPLACE VIEW vista_estadisticas_comuna AS
SELECT 
  comuna,
  COUNT(*) as total_reportes,
  COUNT(CASE WHEN estado = 'resuelto' THEN 1 END) as reportes_resueltos,
  COUNT(CASE WHEN severidad = 'critica' THEN 1 END) as reportes_criticos,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) as tiempo_promedio_resolucion_horas
FROM reportes
WHERE comuna IS NOT NULL
GROUP BY comuna;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ DAGRD-SIF Medellín Database Schema created successfully!';
  RAISE NOTICE '📊 Tables created: 9';
  RAISE NOTICE '🔒 RLS policies enabled on all tables';
  RAISE NOTICE '🔧 Triggers and functions configured';
  RAISE NOTICE '📈 Views created for reporting';
  RAISE NOTICE '';
  RAISE NOTICE '⚙️  Next steps:';
  RAISE NOTICE '1. Configure environment variables in your application';
  RAISE NOTICE '2. Create your first admin user';
  RAISE NOTICE '3. Configure WhatsApp Business API webhook';
  RAISE NOTICE '4. Set up OpenAI API key for transcription and RAG';
  RAISE NOTICE '5. Configure Google Maps API key';
END $$;
