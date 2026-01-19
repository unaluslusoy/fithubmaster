"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Zap, Mail, Phone, Smartphone, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { verifyAdminCredentials, verify2FACode } from "./actions"

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"credentials" | "2fa">("credentials")
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState("")
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    if (step === '2fa') setTimer(60)
  }, [step])

  const handleResendCode = () => {
    if (timer > 0) return
    setTimer(60)
    // Here we would call resend server action
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length === 0) return ''
    if (numbers.length <= 3) return `(${numbers}`
    if (numbers.length <= 6) return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0,3)}) ${numbers.slice(3,6)} ${numbers.slice(6,10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value))
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (loginMethod === 'email' && !email) {
       setError("Lütfen e-posta adresinizi giriniz.")
       return
    }
    if (loginMethod === 'phone' && !phone) {
       setError("Lütfen telefon numaranızı giriniz.")
       return
    }
    if (!password) {
      setError("Lütfen parolanızı giriniz.")
      return
    }
    
    setLoading(true)
    
    // Identifier is either email or phone
    const identifier = loginMethod === 'email' ? email : phone

    try {
        const result = await verifyAdminCredentials(identifier, password)
        setLoading(false)

        if (result.success) {
            if (result.requires2FA) {
                setStep("2fa")
            } else {
                router.push("/admin")
            }
        } else {
            setError(result.error || "Giriş başarısız.")
        }
    } catch (err) {
        setLoading(false)
        setError("Beklenmedik bir hata oluştu.")
    }
  }

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
        const result = await verify2FACode(twoFactorCode)
        if (result.success) {
            router.push("/admin")
        } else {
            setLoading(false)
            setError(result.error || "Doğrulama başarısız.")
        }
    } catch (err) {
        setLoading(false)
        setError("Kod doğrulanamadı.")
    }
  }

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
            İşletmenizi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Geleceğe Taşıyın
            </span>
          </h2>
          <div className="space-y-4">
            {["Tüm üye verileri ve ödemeler tek ekranda.", 
              "Gelişmiş antrenman ve beslenme programlama modülleri.",
              "7/24 Teknik destek ve düzenli güncellemeler."].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-emerald-100/80">{text}</p>
              </div>
            ))}
          </div>
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

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between items-center p-8 sm:p-12 bg-background">
        <div className="flex-1 flex flex-col justify-center w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <img 
              src="/fithub-point.svg" 
              alt="FitHub Point" 
              className="h-10 w-auto"
            />
          </div>

          {step === "credentials" ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-foreground">Hesabınıza Giriş Yapın</h2>
                <p className="text-muted-foreground mt-1">E-posta veya telefon ile giriş yapabilirsiniz.</p>
              </div>

              {/* Login Method Tabs */}
              <div className="grid grid-cols-2 p-1 bg-secondary rounded-xl">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                    loginMethod === 'email' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Mail className="w-4 h-4" />
                  E-Posta
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                    loginMethod === 'phone' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Phone className="w-4 h-4" />
                  Telefon
                </button>
              </div>

              {error && (
                 <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                   {error}
                 </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {loginMethod === 'email' ? (
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresi</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email" 
                        placeholder="admin@fithub.com" 
                        className="pl-9"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon Numarası</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel" 
                        placeholder="(555) 000 00 00" 
                        className="pl-9"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Parola</Label>
                    <Link href="/admin/forgot-password" className="text-xs text-primary hover:underline">Unuttum?</Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="font-mono text-sm pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="font-normal text-muted-foreground cursor-pointer">
                    Beni hatırla
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Kontrol Ediliyor..." : "Devam Et"}
                  {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>
            </div>
          ) : (
            /* 2FA STEP */
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
               <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Güvenlik Doğrulaması</h2>
                <p className="text-muted-foreground mt-1">
                  Lütfen <b>{loginMethod === 'email' ? email : phone}</b> adresine gönderilen 6 haneli kodu giriniz.
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-yellow-600">
                    (Demo: Kod her zaman 123456)
                </p>
              </div>

               {error && (
                 <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                   {error}
                 </div>
              )}

              <form onSubmit={handle2FASubmit} className="space-y-6">
                <div className="grid grid-cols-6 gap-2">
                   {/* Simplified Input for 2FA - In real app use OTP Input */}
                   <Input 
                     className="col-span-6 text-center text-2xl tracking-widest h-14 font-mono"
                     maxLength={6}
                     value={twoFactorCode}
                     onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g,''))}
                     placeholder="000000"
                   />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Kalan süre: <span className="text-primary font-medium">00:{timer < 10 ? `0${timer}` : timer}</span>
                  </span>
                  <button 
                    type="button"
                    onClick={handleResendCode}
                    disabled={timer > 0}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      timer > 0 
                        ? "text-muted-foreground cursor-not-allowed opacity-50" 
                        : "text-primary hover:underline cursor-pointer"
                    )}
                  >
                    Kodu Tekrar Gönder
                  </button>
                </div>

                <div className="flex gap-3">
                   <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                        setStep("credentials")
                        setTwoFactorCode("")
                        setError("")
                    }}
                   >
                     Geri Dön
                   </Button>
                   <Button type="submit" className="flex-[2]" size="lg" disabled={loading}>
                     {loading ? "Doğrulanıyor..." : "Doğrula ve Giriş Yap"}
                   </Button>
                </div>
              </form>
            </div>
          )}
          
        </div>

        <div className="text-center text-xs text-muted-foreground w-full">
            <p>FitHub Point &copy; 2026</p>
        </div>
      </div>
    </div>
  )
}

