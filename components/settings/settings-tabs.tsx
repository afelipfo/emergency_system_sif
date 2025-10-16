"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Sparkles, Database, Users, Bell } from "lucide-react"

interface SettingsTabsProps {
  children: React.ReactNode
}

export function SettingsTabs({ children }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="whatsapp" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="whatsapp" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">IA</span>
        </TabsTrigger>
        <TabsTrigger value="database" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span className="hidden sm:inline">Base de Datos</span>
        </TabsTrigger>
        <TabsTrigger value="personnel" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Personal</span>
        </TabsTrigger>
        <TabsTrigger value="alerts" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Alertas</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}
