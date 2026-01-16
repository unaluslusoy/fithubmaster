"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, Settings, Package, LayoutDashboard, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Kullanıcı Yönetimi", href: "/admin/users" },
  { icon: Shield, label: "Hoca Başvuruları", href: "/admin/trainers" },
  { icon: Package, label: "Paket Yönetimi", href: "/admin/packages" },
  { icon: BarChart3, label: "Sistem Raporları", href: "/admin/reports" },
  { icon: Settings, label: "Sistem Ayarları", href: "/admin/settings" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-border bg-rich-black text-anti-flash-white hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-primary-green">
            <span className="text-2xl">⚡</span> FitHub Admin
          </Link>
          <div className="mt-2 text-xs text-gray-400 uppercase tracking-wider">Super Admin</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 hover:bg-white/10 hover:text-white",
                    isActive && "bg-[var(--caribbean-green)] text-rich-black font-medium hover:bg-[var(--caribbean-green)]/90 hover:text-rich-black"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10">
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-semibold capitalize">
            {sidebarItems.find(i => i.href === pathname)?.label || "Yönetim Paneli"}
          </h1>
          <div className="flex items-center gap-4">
             <div className="h-8 w-8 rounded-full bg-rich-black text-white flex items-center justify-center text-xs font-bold ring-2 ring-[var(--caribbean-green)]">
                AD
             </div>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
