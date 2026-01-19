"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function AdminForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-background">
      
      {/* LEFT SIDE - Branding (Dark Always) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white p-12 flex-col justify-between overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl" />
        
        {/* Logo */}
        <div className="relative z-10">
          <img 
            src="/fithub-point-white.svg" 
            alt="FitHub Point" 
            className="h-12 w-auto"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8 max-w-lg">
          <h2 className="text-5xl font-bold leading-tight">
            Şifrenizi mi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Unuttunuz?
            </span>
          </h2>
          <p className="text-emerald-100/80 text-lg">
            Endişelenmeyin, hesabınıza kayıtlı e-posta adresinizi girerek şifrenizi sıfırlayabilirsiniz.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs text-emerald-300/50 uppercase tracking-widest mb-3">Güvenlik Partnerleri</p>
          <div className="flex items-center gap-4 opacity-40">
            <div className="h-6 w-20 bg-white/20 rounded" />
            <div className="h-6 w-20 bg-white/20 rounded" />
            <div className="h-6 w-20 bg-white/20 rounded" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-background relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img 
              src="/fithub-point.svg" 
              alt="FitHub Point" 
              className="h-10 w-auto"
            />
          </div>

          {/* Back Button */}
          <Link href="/admin/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Giriş Ekranına Dön
          </Link>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Şifre Sıfırlama</h2>
            <p className="text-muted-foreground">E-posta adresinize sıfırlama bağlantısı gönderilecektir.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta Adresi</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email" 
                  placeholder="admin@fithub.com" 
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sıfırlama Bağlantısı Gönder
            </Button>
          </form>

        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center text-xs text-muted-foreground">
          <p>FitHub Point &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
