import { AppHeader } from "@/components/app-header"
import { SettingsTabs } from "@/components/settings/settings-tabs"
import { WhatsAppConfig } from "@/components/settings/whatsapp-config"
import { AIConfig } from "@/components/settings/ai-config"
import { DatabaseConfig } from "@/components/settings/database-config"
import { PersonnelManagement } from "@/components/settings/personnel-management"
import { AlertsConfig } from "@/components/settings/alerts-config"
import { TabsContent } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <AppHeader title="Configuración" description="Gestión de integraciones y parámetros del sistema" />

      <div className="flex-1 p-6">
        <SettingsTabs>
          <TabsContent value="whatsapp">
            <WhatsAppConfig />
          </TabsContent>
          <TabsContent value="ai">
            <AIConfig />
          </TabsContent>
          <TabsContent value="database">
            <DatabaseConfig />
          </TabsContent>
          <TabsContent value="personnel">
            <PersonnelManagement />
          </TabsContent>
          <TabsContent value="alerts">
            <AlertsConfig />
          </TabsContent>
        </SettingsTabs>
      </div>
    </div>
  )
}
