"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell } from "lucide-react"

export default function TrainerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate login
    setTimeout(() => {
      router.push("/trainer")
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-caribbeangreen-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <Dumbbell className="h-6 w-6 text-caribbeangreen-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-pine-900">Eğitmen Girişi</CardTitle>
          <CardDescription>
            Öğrencilerinizi yönetmek için panele giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="hoca@ornek.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <Label htmlFor="password">Şifre</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="flex items-center space-x-2">
               <Checkbox id="remember" />
               <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Beni Hatırla</label>
            </div>
            <Button className="w-full bg-pine-600 hover:bg-pine-700" type="submit" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
