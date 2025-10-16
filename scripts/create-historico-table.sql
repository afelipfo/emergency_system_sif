-- Create historical records table for imported Excel data
CREATE TABLE IF NOT EXISTS historico_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registro TEXT NOT NULL, -- Record ID from Excel
  fecha TIMESTAMP WITH TIME ZONE NOT NULL,
  remitido TEXT,
  registra TEXT,
  icad TEXT,
  comuna TEXT,
  via_principal TEXT NOT NULL,
  complemento TEXT,
  barrio TEXT,
  telefono TEXT,
  contacto TEXT,
  observacion TEXT,
  atencion TEXT,
  prioridad TEXT,
  evidencias TEXT[], -- Array of photo URLs
  radicados TEXT[],
  -- Geographic coordinates (will be geocoded from address)
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_historico_fecha ON historico_registros(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_historico_comuna ON historico_registros(comuna);
CREATE INDEX IF NOT EXISTS idx_historico_barrio ON historico_registros(barrio);
CREATE INDEX IF NOT EXISTS idx_historico_prioridad ON historico_registros(prioridad);
CREATE INDEX IF NOT EXISTS idx_historico_coordinates ON historico_registros(latitud, longitud);

-- Enable Row Level Security
ALTER TABLE historico_registros ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all records
CREATE POLICY "Allow authenticated users to read historico"
  ON historico_registros
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to insert records
CREATE POLICY "Allow authenticated users to insert historico"
  ON historico_registros
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update records
CREATE POLICY "Allow authenticated users to update historico"
  ON historico_registros
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete records
CREATE POLICY "Allow authenticated users to delete historico"
  ON historico_registros
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_historico_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_historico_timestamp
  BEFORE UPDATE ON historico_registros
  FOR EACH ROW
  EXECUTE FUNCTION update_historico_updated_at();
