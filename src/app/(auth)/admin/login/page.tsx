"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Zap, Mail, Phone, Smartphone, ShieldCheck, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock Settings (In real app, this comes from DB/Context)
const SYSTEM_SETTINGS = {
    twoFactorMethod: 'sms', // 'sms' | 'email' | 'app'
    supportPhone: '+90 (850) 123 45 67'
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"credentials" | "2fa">("credentials")
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  
  // Form State
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState("")
  
  // UI State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{email?: string, phone?: string}>({})

  // 2FA Timer State
  const [timer, setTimer] = useState(0)

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timer > 0) {
        interval = setInterval(() => {
            setTimer((prev) => prev - 1)
        }, 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  // Reset timer when entering 2FA step
  useEffect(() => {
      if (step === '2fa') {
          setTimer(60)
      }
  }, [step])

  const handleResendCode = () => {
      if (timer > 0) return
      // Simulate API resend
      console.log("Resending code...")
      setTimer(60)
  }

  // Phone Masking Logic
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length === 0) return ''
    if (numbers.length <= 3) return `(${numbers}`
    if (numbers.length <= 6) return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0,3)}) ${numbers.slice(3,6)} ${numbers.slice(6,10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPhone(formatPhoneNumber(e.target.value))
      if (fieldErrors.phone) setFieldErrors({...fieldErrors, phone: undefined})
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
      if (fieldErrors.email) setFieldErrors({...fieldErrors, email: undefined})
  }

  // Validation
  const validateForm = () => {
      const errors: {email?: string, phone?: string} = {}
      let isValid = true

      if (loginMethod === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(email)) {
              errors.email = "Geçerli bir e-posta adresi giriniz."
              isValid = false
          }
      } else {
          const numericPhone = phone.replace(/\D/g, '')
          if (numericPhone.length < 10) {
              errors.phone = "Geçerli bir telefon numarası giriniz."
              isValid = false
          }
      }

      setFieldErrors(errors)
      return isValid
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!validateForm()) return
    if (!password) {
        setError("Lütfen parolanızı giriniz.")
        return
    }

    setLoading(true)

    try {
        console.log("Login Method:", loginMethod)
        console.log("Credentials:", loginMethod === 'email' ? email : phone)
        
        setTimeout(() => {
            setLoading(false)
            setStep("2fa")
        }, 1000)

    } catch (err) {
      setError("Giriş bilgileri doğrulanamadı.")
      setLoading(false)
    }
  }

  const handle2FASubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError("")

      try {
        setTimeout(() => {
            router.push("/admin")
        }, 1000)
      } catch (err) {
          setError("Doğrulama kodu hatalı.")
          setLoading(false)
      }
  }

  return (
    <div className="flex h-screen w-full bg-rich-black overflow-hidden">
      
      {/* LEFT SIDE - Brand & Panel Info */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-rich-black text-white p-12 flex-col justify-between border-r border-white/5">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-bangladesh-green/20 rounded-full blur-[128px] pointer-events-none mix-blend-screen animate-pulse duration-1000" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-caribbean-green/5 rounded-full blur-[128px] pointer-events-none mix-blend-screen" />
        
        {/* Content */}
        <div className="relative z-10">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bangladesh-green to-caribbean-green flex items-center justify-center shadow-glow">
                    <Zap className="w-6 h-6 text-white fill-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">FitHub<span className="text-caribbean-green">Point</span></h1>
             </div>

             <div className="space-y-8 max-w-lg mt-20">
                <h2 className="text-5xl font-bold leading-tight tracking-tight">
                    İşletmenizi <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-caribbean-green to-pistachio">
                        Geleceğe Taşıyın
                    </span>
                </h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-caribbean-green/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-caribbean-green" />
                        </div>
                        <p className="text-pistachio/80 font-light">Tüm üye verileri ve ödemeler tek ekranda.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-caribbean-green/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-caribbean-green" />
                        </div>
                        <p className="text-pistachio/80 font-light">Gelişmiş antrenman ve beslenme programlama modülleri.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-caribbean-green/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-caribbean-green" />
                        </div>
                        <p className="text-pistachio/80 font-light">7/24 Teknik destek ve düzenli güncellemeler.</p>
                    </div>
                </div>
             </div>
        </div>

        <div className="relative z-10">
            <p className="text-xs text-stone uppercase tracking-widest mb-4">Güvenlik Partnerleri</p>
            <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Placeholders for partner logos if needed */}
               <div className="h-8 w-24 bg-white/10 rounded"></div>
               <div className="h-8 w-24 bg-white/10 rounded"></div>
               <div className="h-8 w-24 bg-white/10 rounded"></div>
            </div>
        </div>
      </div>


      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-rich-black relative">
        {/* Mobile Background Bloom */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-64 bg-caribbean-green/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[440px] space-y-8 relative z-10">
            
            {/* Brand Logo - Visible on Mobile Only */}
            <div className="lg:hidden flex justify-center mb-8">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bangladesh-green to-caribbean-green flex items-center justify-center shadow-glow">
                        <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold text-white">FitHubPoint</span>
                </div>
            </div>

            {step === "credentials" ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Giriş Yap</h2>
                        <p className="text-stone">Hesabınıza erişmek için bilgilerinizi girin.</p>
                    </div>

                    {/* Login Method Tabs */}
                    <div className="grid grid-cols-2 p-1 bg-pine/50 rounded-xl border border-white/5">
                        <button
                            onClick={() => setLoginMethod('email')}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                loginMethod === 'email' 
                                    ? "bg-forest/50 text-white shadow-sm ring-1 ring-white/10" 
                                    : "text-stone hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Mail className="w-4 h-4" /> E-posta
                        </button>
                        <button
                            onClick={() => setLoginMethod('phone')}
                            className={cn(
                                "flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                loginMethod === 'phone' 
                                    ? "bg-forest/50 text-white shadow-sm ring-1 ring-white/10" 
                                    : "text-stone hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Phone className="w-4 h-4" /> Telefon
                        </button>
                    </div>

                    <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* Input Field */}
                            <div className="space-y-1.5">
                                <Label htmlFor="identity" className="text-xs font-semibold uppercase tracking-wider text-pistachio ml-1">
                                    {loginMethod === 'email' ? 'E-posta Adresi' : 'Telefon Numarası'}
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone group-focus-within:text-caribbean-green transition-colors">
                                        {loginMethod === 'email' ? <Mail className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                                    </div>
                                    <Input 
                                        id="identity" 
                                        type={loginMethod === 'email' ? 'email' : 'tel'}
                                        placeholder={loginMethod === 'email' ? 'ad.soyad@sirketiniz.com' : '(555) 000 0000'}
                                        value={loginMethod === 'email' ? email : phone}
                                        onChange={loginMethod === 'email' ? handleEmailChange : handlePhoneChange}
                                        className={cn(
                                            "pl-10 h-12 bg-pine/30 border-white/10 text-white placeholder:text-stone/50 rounded-xl focus:border-caribbean-green/50 focus:ring-caribbean-green/20 transition-all",
                                            (loginMethod === 'email' ? fieldErrors.email : fieldErrors.phone) && "border-red-500/50 focus:border-red-500"
                                        )}
                                        autoComplete={loginMethod === 'email' ? 'username' : 'tel'}
                                    />
                                    {(loginMethod === 'email' ? fieldErrors.email : fieldErrors.phone) && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-in fade-in">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                {(loginMethod === 'email' ? fieldErrors.email : fieldErrors.phone) && (
                                    <p className="text-xs text-red-400 ml-1">
                                        {loginMethod === 'email' ? fieldErrors.email : fieldErrors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-pistachio">Parola</Label>
                                    <a href="#" className="text-xs text-caribbean-green hover:text-mountain-meadow transition-colors font-medium">
                                        Parolamı Unuttum
                                    </a>
                                </div>
                                <Input 
                                    id="password" 
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-pine/30 border-white/10 text-white placeholder:text-stone/50 rounded-xl focus:border-caribbean-green/50 focus:ring-caribbean-green/20 transition-all px-4"
                                    autoComplete="current-password"
                                />
                            </div>

                            <div className="flex items-center space-x-2.5 ml-1">
                                <Checkbox 
                                    id="remember" 
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    className="border-white/20 data-[state=checked]:bg-caribbean-green data-[state=checked]:text-rich-black w-5 h-5 rounded-md"
                                />
                                <Label htmlFor="remember" className="text-sm text-stone cursor-pointer select-none">
                                    Bu cihazda oturumu açık tut
                                </Label>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400 font-medium">{error}</p>
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-bangladesh-green to-caribbean-green text-rich-black font-bold text-lg hover:shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 border-none group"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                     <span className="w-4 h-4 border-2 border-rich-black/30 border-t-rich-black rounded-full animate-spin"></span>
                                     Giriş Yapılıyor...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Giriş Yap <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>
                </div>
            ) : (
                /* 2FA STEP */
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 text-center lg:text-left">
                    <button 
                        onClick={() => setStep("credentials")} 
                        className="text-stone hover:text-white text-sm flex items-center gap-1 transition-colors mb-4 group"
                    >
                         <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Geri Dön
                    </button>
                    
                    <div className="space-y-2">
                        <div className="w-16 h-16 bg-caribbean-green/10 rounded-2xl flex items-center justify-center mb-4 mx-auto lg:mx-0 ring-1 ring-caribbean-green/20">
                            <ShieldCheck className="w-8 h-8 text-caribbean-green" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Doğrulama</h2>
                        <p className="text-stone">
                            {SYSTEM_SETTINGS.twoFactorMethod === 'sms' 
                                ? "Telefonunuza gönderilen SMS kodunu giriniz." 
                                : "E-posta adresinize gönderilen doğrulama kodunu giriniz."}
                        </p>
                    </div>

                    <form onSubmit={handle2FASubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="2fa" className="sr-only">Kod</Label>
                            <Input 
                                id="2fa" 
                                type="text"
                                maxLength={6}
                                placeholder="000 000"
                                value={twoFactorCode}
                                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                className="h-20 text-center text-4xl font-mono tracking-[0.4em] bg-pine/30 border-white/10 text-caribbean-green placeholder:text-stone/10 rounded-xl focus:border-caribbean-green/50 focus:ring-caribbean-green/20"
                                autoFocus
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-stone">Kod gelmedi mi?</span>
                            <button 
                                type="button" 
                                onClick={handleResendCode}
                                disabled={timer > 0}
                                className={cn(
                                    "font-medium transition-colors",
                                    timer > 0 
                                        ? "text-stone cursor-not-allowed" 
                                        : "text-caribbean-green hover:underline"
                                )}
                            >
                                {timer > 0 ? `Tekrar gönder (${timer}s)` : "Tekrar Gönder"}
                            </button>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-caribbean-green text-rich-black font-bold text-lg hover:bg-caribbean-green/90 transition-all border-none"
                        >
                            {loading ? "Doğrulanıyor..." : "Doğrula"}
                        </Button>
                    </form>
                </div>
            )}
            
            {/* Footer */}
            <div className="pt-8 border-t border-white/5 text-center px-4 mt-auto">
               <p className="text-xs text-stone">
                   Sorun mu yaşıyorsunuz? <a href="#" className="text-pistachio hover:text-white underline">Destek Ekibi</a> ile iletişime geçin.
               </p>
            </div>
        </div>
      </div>
    </div>
  )
}
