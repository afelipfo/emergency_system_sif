# DAGRD-SIF Medellín

Sistema automatizado de gestión de emergencias para el Departamento Administrativo de Gestión del Riesgo de Desastres (DAGRD) y la Secretaría de Infraestructura Física de Medellín.

## Descripción

Plataforma integral para la recepción, procesamiento y gestión de reportes de emergencias de infraestructura en Medellín. El sistema procesa reportes de audio enviados vía WhatsApp, utiliza inteligencia artificial para transcripción y extracción de datos, y proporciona herramientas avanzadas de análisis y consulta histórica mediante RAG (Retrieval-Augmented Generation).

## Características Principales

### Gestión de Reportes en Tiempo Real
- Recepción automatizada de reportes de audio vía WhatsApp Business API
- Transcripción automática mediante OpenAI Whisper
- Extracción estructurada de datos con GPT-4
- Visualización geográfica en mapas interactivos
- Sistema de alertas y notificaciones en tiempo real

### Análisis Inteligente
- Consultas en lenguaje natural mediante RAG con embeddings vectoriales
- Dashboard estadístico con métricas y KPIs
- Análisis temporal y geográfico de emergencias
- Identificación de patrones y zonas de alto riesgo

### Gestión Histórica
- Importación masiva de registros históricos desde Excel
- Geocodificación automática de direcciones
- Visualización en Google Maps con marcadores por prioridad
- Búsqueda y filtrado avanzado

### Administración
- Sistema de autenticación y gestión de usuarios
- Configuración de integraciones (WhatsApp, OpenAI, Supabase)
- Gestión de personal de campo y destinatarios de alertas
- Control de intervenciones y seguimiento de casos

## Stack Tecnológico

### Frontend
- **Next.js 14+** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos utilitarios
- **shadcn/ui** - Componentes UI
- **Recharts** - Visualización de datos
- **Google Maps API** - Mapas interactivos

### Backend
- **Next.js API Routes** - Endpoints RESTful
- **Supabase** - Base de datos PostgreSQL con pgvector
- **OpenAI API** - Whisper (transcripción) y GPT-4 (análisis)
- **WhatsApp Business API** - Recepción de mensajes

### Infraestructura
- **Vercel** - Hosting y deployment
- **PostgreSQL** - Base de datos relacional
- **pgvector** - Búsqueda semántica vectorial

## Requisitos Previos

- Node.js 18.x o superior
- Cuenta de Supabase con proyecto creado
- API Key de OpenAI con acceso a GPT-4 y Whisper
- Cuenta de WhatsApp Business API
- Google Maps API Key con Geocoding API habilitado

## Instalación

### 1. Clonar el Repositorio

\`\`\`bash
git clone <repository-url>
cd dagrd-sif-medellin
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# WhatsApp Business API
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-access-token
WHATSAPP_VERIFY_TOKEN=your-custom-verify-token

# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Configuración de Aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

Consultar `ENVIRONMENT_VARIABLES.md` para descripción detallada de cada variable.

### 4. Configurar Base de Datos

Ejecutar el script SQL completo en Supabase:

\`\`\`bash
# Copiar contenido de scripts/complete-database-schema.sql
# Ejecutar en Supabase SQL Editor
\`\`\`

El script crea:
- 9 tablas principales con relaciones
- Índices optimizados para búsquedas
- Políticas RLS (Row Level Security)
- Triggers y funciones auxiliares
- Vistas materializadas para reportes

### 5. Ejecutar en Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Acceder a `http://localhost:3000`

## Estructura del Proyecto

\`\`\`
dagrd-sif-medellin/
├── app/
│   ├── (auth)/              # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Páginas protegidas
│   │   ├── page.tsx         # Dashboard principal
│   │   ├── reports/         # Gestión de reportes
│   │   ├── queries/         # Consultas RAG
│   │   ├── alerts/          # Feed de alertas
│   │   ├── analytics/       # Estadísticas
│   │   ├── settings/        # Configuración
│   │   └── historico/       # Registros históricos
│   ├── api/                 # API Routes
│   │   ├── webhooks/        # Webhook WhatsApp
│   │   ├── reportes/        # CRUD reportes
│   │   ├── consultas/       # RAG queries
│   │   ├── intervenciones/  # Gestión intervenciones
│   │   ├── alertas/         # Distribución alertas
│   │   └── historico/       # Gestión histórico
│   └── layout.tsx
├── components/
│   ├── dashboard/           # Componentes dashboard
│   ├── reports/             # Componentes reportes
│   ├── queries/             # Componentes consultas
│   ├── alerts/              # Componentes alertas
│   ├── analytics/           # Componentes estadísticas
│   ├── settings/            # Componentes configuración
│   ├── historico/           # Componentes histórico
│   ├── app-sidebar.tsx      # Navegación lateral
│   └── app-header.tsx       # Encabezado
├── lib/
│   ├── supabase/            # Clientes Supabase
│   ├── openai.ts            # Utilidades OpenAI
│   ├── whatsapp.ts          # Cliente WhatsApp
│   ├── geocoding.ts         # Geocodificación
│   └── excel-parser.ts      # Parser Excel
├── scripts/
│   └── complete-database-schema.sql
├── middleware.ts            # Protección de rutas
└── ENVIRONMENT_VARIABLES.md
\`\`\`

## Configuración de Integraciones

### WhatsApp Business API

1. Crear aplicación en Meta for Developers
2. Configurar webhook URL: `https://your-domain.com/api/webhooks/whatsapp`
3. Suscribirse a eventos: `messages`
4. Configurar token de verificación en variables de entorno

### OpenAI API

1. Obtener API key desde platform.openai.com
2. Habilitar acceso a modelos: `gpt-4-turbo-preview`, `whisper-1`, `text-embedding-3-small`
3. Configurar límites de uso según necesidades

### Google Maps API

1. Crear proyecto en Google Cloud Console
2. Habilitar APIs: Maps JavaScript API, Geocoding API
3. Restringir API key por dominio en producción
4. Configurar facturación (incluye créditos gratuitos mensuales)

## Seguridad

### Autenticación
- Sistema de autenticación basado en Supabase Auth
- Sesiones seguras con cookies HTTP-only
- Middleware de protección de rutas

### Base de Datos
- Row Level Security (RLS) habilitado en todas las tablas
- Políticas de acceso basadas en roles
- Encriptación en tránsito y reposo

### API
- Validación de entrada en todos los endpoints
- Rate limiting en webhooks
- Sanitización de datos antes de almacenamiento
- Logs de auditoría para operaciones críticas

## Deployment

### Vercel (Recomendado)

\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

Configurar variables de entorno en Vercel Dashboard.

### Docker

\`\`\`dockerfile
# Dockerfile incluido en el proyecto
docker build -t dagrd-sif .
docker run -p 3000:3000 --env-file .env.local dagrd-sif
\`\`\`

## Mantenimiento

### Backup de Base de Datos
Configurar backups automáticos diarios en Supabase Dashboard.

### Monitoreo
- Logs de aplicación en Vercel Dashboard
- Métricas de base de datos en Supabase Dashboard
- Alertas configurables para errores críticos

### Actualizaciones
\`\`\`bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Aplicar parches de seguridad
npm audit fix
\`\`\`

## Soporte

Para reportar problemas o solicitar funcionalidades, contactar al equipo de desarrollo de DAGRD-SIF Medellín.

## Licencia

Propiedad del Departamento Administrativo de Gestión del Riesgo de Desastres (DAGRD) y la Secretaría de Infraestructura Física de Medellín. Todos los derechos reservados.
