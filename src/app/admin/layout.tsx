"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { 
  LayoutDashboard, Users, Shield, Package, DollarSign, Settings, 
  LogOut, Zap, Bell, Search, Sun, Moon, Monitor, BarChart3, 
  Dumbbell, Apple, Heart, ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

// Grouped Sidebar Menu Structure
const sidebarGroups = [
  {
    title: "Genel",
    items: [
      { icon: LayoutDashboard, label: "Panel", href: "/admin" },
      { icon: Users, label: "Profil", href: "/admin/profile" },
    ]
  },
  {
    title: "Kullanıcı Yönetimi",
    items: [
      { icon: Users, label: "Kullanıcılar", href: "/admin/users" },
      { icon: Shield, label: "Kullanıcı Grupları", href: "/admin/user-groups" },
    ]
  },
  {
    title: "Modüller & Birimler",
    items: [
      { icon: Package, label: "Modüller", href: "/admin/modules" },
      { icon: Dumbbell, label: "Antrenman Birimleri", href: "/admin/workout-units" },
      { icon: Apple, label: "Beslenme Birimleri", href: "/admin/nutrition-units" },
      { icon: Heart, label: "Kardiyo Birimleri", href: "/admin/cardio-units" },
    ]
  },
  {
    title: "Finans & Abonelik",
    items: [
      { icon: Package, label: "Paketler", href: "/admin/packages" },
      { icon: BarChart3, label: "Abonelikler", href: "/admin/subscriptions" },
      { icon: DollarSign, label: "Cari Hesap", href: "/admin/finance" },
    ]
  },
  {
    title: "Sistem",
    items: [
      { icon: Settings, label: "Ayarlar", href: "/admin/settings" },
    ]
  },
]

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          "p-2 rounded-lg transition-all",
          theme === 'light' ? "bg-background shadow-sm" : "hover:bg-background/50"
        )}
        title="Açık Mod"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          "p-2 rounded-lg transition-all",
          theme === 'dark' ? "bg-background shadow-sm" : "hover:bg-background/50"
        )}
        title="Koyu Mod"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          "p-2 rounded-lg transition-all",
          theme === 'system' ? "bg-background shadow-sm" : "hover:bg-background/50"
        )}
        title="Sistem"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-sidebar-bg border-r border-sidebar-border hidden md:flex flex-col z-50">
        
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-sidebar-text-active">FitHub</span>
            <span className="text-primary font-bold">Point</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto no-scrollbar">
          {sidebarGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-hover"
                      )}>
                        <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-hover transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-sm font-bold text-white">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-text-active truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">Super Admin</p>
            </div>
            <LogOut 
              className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors cursor-pointer" 
              onClick={() => window.location.href = "/admin/login"}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 sticky top-0 z-40 px-6 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Ara..." 
                className="w-64 h-10 pl-10 pr-4 rounded-xl bg-secondary border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
           
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="w-10 h-10 rounded-xl bg-secondary hover:bg-accent flex items-center justify-center transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
