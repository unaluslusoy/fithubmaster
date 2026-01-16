"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Activity } from "lucide-react"

export default function ClientLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
        router.push("/client")
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-3">
                    <Activity className="h-6 w-6 text-primary" />
                </div>
            </div>
          <CardTitle className="text-2xl font-bold">Hoş Geldiniz</CardTitle>
          <CardDescription>
            FitHubPoint üye hesabınıza erişin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="uye@fithub.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <a href="#" className="text-sm text-primary hover:underline">Şifremi unuttum</a>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
             <p className="text-sm text-muted-foreground">
                Hesabınız yok mu? <a href="/register" className="text-primary hover:underline">Kayıt Olun</a>
             </p>
        </CardFooter>
      </Card>
    </div>
  )
}
