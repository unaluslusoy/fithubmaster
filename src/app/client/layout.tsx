"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calendar, Dumbbell, Home, LogOut, Settings, User, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: Home, label: "Ana Sayfa", href: "/client" },
  { icon: Dumbbell, label: "Antrenmanlarım", href: "/client/workouts" },
  { icon: Calendar, label: "Takvim & Randevu", href: "/client/schedule" },
  { icon: BarChart3, label: "İlerleme Durumu", href: "/client/progress" },
  { icon: ShoppingBag, label: "Mağaza", href: "/client/shop" },
  { icon: User, label: "Profilim", href: "/client/profile" },
  { icon: Settings, label: "Ayarlar", href: "/client/settings" },
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-green">
            <span className="text-2xl">⚡</span> FitHubPoint
          </Link>
          <div className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">Client Panel</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-secondary text-secondary-foreground font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-semibold capitalize">
            {sidebarItems.find(i => i.href === pathname)?.label || "Panel"}
          </h1>
          <div className="flex items-center gap-4">
             {/* Add Notifications or User Avatar here */}
             <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                JD
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
