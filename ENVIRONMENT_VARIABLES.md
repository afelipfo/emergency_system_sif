# Environment Variables Configuration

## Required Environment Variables for DAGRD-SIF Medellín

### Supabase Configuration
\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### OpenAI Configuration
\`\`\`bash
OPENAI_API_KEY=your_openai_api_key
\`\`\`

### WhatsApp Business API Configuration
\`\`\`bash
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
\`\`\`

### Google Maps Configuration
\`\`\`bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
\`\`\`

### Email Configuration (Optional)
\`\`\`bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@dagrd-medellin.gov.co
\`\`\`

## Setup Instructions

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API
3. Copy the following values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to SQL Editor and run the `scripts/complete-database-schema.sql` file
5. Verify all tables were created successfully

### 2. OpenAI Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Copy the key to `OPENAI_API_KEY`
4. Ensure you have credits in your account

### 3. WhatsApp Business API Setup

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Create a new app and add WhatsApp Business API
3. Get your Phone Number ID and Access Token
4. Configure webhook URL: `https://your-domain.com/api/webhooks/whatsapp`
5. Set a custom verify token for webhook verification
6. Subscribe to message events

### 4. Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
3. Create an API key
4. Restrict the key to your domain for security
5. Copy the key to both `GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 5. Email Setup (Optional)

If you want to send email alerts:

1. Use Gmail with App Password:
   - Enable 2FA on your Google account
   - Generate an App Password
   - Use the app password in `SMTP_PASSWORD`

2. Or use a service like SendGrid, Mailgun, etc.

## Vercel Deployment

When deploying to Vercel:

1. Go to your project settings
2. Navigate to Environment Variables
3. Add all the variables listed above
4. Make sure to add them for all environments (Production, Preview, Development)

## Local Development

Create a `.env.local` file in the root of your project:

\`\`\`bash
# Copy this template and fill in your values
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=

WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=

GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Optional
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
\`\`\`

## Security Notes

- Never commit `.env.local` to version control
- Keep your service role key secure - it has admin access
- Restrict API keys to specific domains/IPs when possible
- Rotate keys regularly
- Use different keys for development and production

## Testing Without Configuration

The application includes mock data and fallback behavior when environment variables are not configured, allowing you to test the UI without setting up all integrations immediately.
