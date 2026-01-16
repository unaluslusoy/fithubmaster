import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Flame, Trophy, TrendingUp } from "lucide-react"

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Antrenman</CardTitle>
            <Trophy className="h-4 w-4 text-[var(--caribbean-green)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 geçen aydan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yakılan Kalori</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,231</div>
            <p className="text-xs text-muted-foreground">+12% geçen haftadan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Program</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Hypertrophy A</div>
            <p className="text-xs text-muted-foreground">3. Hafta / 8 Hafta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kilo Takibi</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5 kg</div>
            <p className="text-xs text-muted-foreground">-1.2 kg bu ay</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Haftalık Aktivite</CardTitle>
            <CardDescription>
              Son 7 gün için antrenman yoğunluğunuz.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Chart Placeholder */}
            <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed text-muted-foreground">
              Grafik Alanı (Recharts eklenecek)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Yaklaşan Randevular</CardTitle>
            <CardDescription>
              Hocanızla planlanmış görüşmeler.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {/* Appointment Items */}
               <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Form Kontrolü</p>
                    <p className="text-sm text-muted-foreground">
                      Yarın, 14:00
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-[var(--caribbean-green)]">Online</div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Ölçüm Günü</p>
                    <p className="text-sm text-muted-foreground">
                      Pzt, 09:30
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-blue-500">Salon</div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
