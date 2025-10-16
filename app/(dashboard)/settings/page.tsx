import { AppHeader } from "@/components/app-header"
import { SettingsTabs } from "@/components/settings/settings-tabs"
import { WhatsAppConfig } from "@/components/settings/whatsapp-config"
import { AIConfig } from "@/components/settings/ai-config"
import { DatabaseConfig } from "@/components/settings/database-config"
import { PersonnelManagement } from "@/components/settings/personnel-management"
import { AlertsConfig } from "@/components/settings/alerts-config"
import { Tabs } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <AppHeader title="Configuración" description="Gestión de integraciones y parámetros del sistema" />

      <div className="flex-1 p-6">
        <SettingsTabs>
          <Tabs>
            <Tabs.Trigger value="whatsapp">WhatsApp</Tabs.Trigger>
            <Tabs.Trigger value="ai">AI</Tabs.Trigger>
            <Tabs.Trigger value="database">Database</Tabs.Trigger>
            <Tabs.Trigger value="personnel">Personnel</Tabs.Trigger>
            <Tabs.Trigger value="alerts">Alerts</Tabs.Trigger>
            <Tabs.Content value="whatsapp">
              <WhatsAppConfig />
            </Tabs.Content>
            <Tabs.Content value="ai">
              <AIConfig />
            </Tabs.Content>
            <Tabs.Content value="database">
              <DatabaseConfig />
            </Tabs.Content>
            <Tabs.Content value="personnel">
              <PersonnelManagement />
            </Tabs.Content>
            <Tabs.Content value="alerts">
              <AlertsConfig />
            </Tabs.Content>
          </Tabs>
        </SettingsTabs>
      </div>
    </div>
  )
}
