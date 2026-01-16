import { Users, DollarSign, Activity, UserCheck, TrendingUp, ArrowUpRight, MoreHorizontal } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { label: "Toplam Üye", value: "1,234", change: "+12%", icon: Users },
    { label: "Aktif Eğitmen", value: "42", change: "+3", icon: UserCheck },
    { label: "Aylık Ciro", value: "₺45,231", change: "+18%", icon: DollarSign },
    { label: "Doluluk", value: "72%", change: "+5%", icon: Activity },
  ]

  const recentUsers = [
    { name: "Ahmet Yılmaz", plan: "Premium", time: "2 dk" },
    { name: "Mehmet Demir", plan: "Standart", time: "5 dk" },
    { name: "Ayşe Kaya", plan: "Premium", time: "12 dk" },
    { name: "Fatma Çelik", plan: "Temel", time: "1 sa" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel</h1>
        <p className="text-muted-foreground">İşletmenizin genel durumu</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="p-5 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              <span className="flex items-center gap-1 text-xs font-medium text-primary">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Gelir Analizi</h3>
              <p className="text-sm text-muted-foreground">Son 12 ay</p>
            </div>
            <button className="text-sm text-primary hover:underline transition-colors flex items-center gap-1">
              Rapor <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Bar Chart */}
          <div className="h-64 flex items-end gap-3 pt-4">
            {[35, 55, 40, 65, 45, 75, 60, 80, 85, 70, 55, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-primary/30 to-primary rounded-t-lg hover:from-primary/50 hover:to-primary transition-all duration-300 cursor-pointer" 
                  style={{ height: `${h}%` }} 
                />
                <span className="text-xs text-muted-foreground">
                  {['O', 'Ş', 'M', 'N', 'M', 'H', 'T', 'A', 'E', 'E', 'K', 'A'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Son Kayıtlar</h3>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.plan}</p>
                </div>
                <span className="text-xs text-muted-foreground">{user.time}</span>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-secondary transition-all">
            Tümünü Gör
          </button>
        </div>
      </div>
    </div>
  )
}
