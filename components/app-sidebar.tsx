"use client"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  BarChart3,
  AlertTriangle,
  Database,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const navigationItems = [
  {
    title: "Monitoreo",
    items: [
      {
        title: "Dashboard Principal",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Alertas",
        url: "/alerts",
        icon: Bell,
      },
    ],
  },
  {
    title: "Reportes",
    items: [
      {
        title: "Todos los Reportes",
        url: "/reports",
        icon: FileText,
      },
      {
        title: "Consultas Históricas",
        url: "/queries",
        icon: MessageSquare,
      },
      {
        title: "Histórico",
        url: "/historico",
        icon: Database,
      },
    ],
  },
  {
    title: "Análisis",
    items: [
      {
        title: "Estadísticas",
        url: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        title: "Configuración",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Clear mock user cookie and localStorage
    document.cookie = "mock_user=; path=/; max-age=0"
    localStorage.removeItem("mock_user")

    // Redirect to login
    router.push("/login")
    router.refresh()
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <AlertTriangle className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">DAGRD</span>
            <span className="text-xs text-sidebar-foreground/70">Medellín</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
        <div className="text-xs text-sidebar-foreground/60">
          <p className="font-medium">Sistema de Emergencias</p>
          <p>Versión 1.0.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
