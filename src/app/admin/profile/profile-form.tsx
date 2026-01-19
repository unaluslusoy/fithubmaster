"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { updateProfile, changePassword, sendTwoFactorVerification, verifyAndEnableTwoFactor, disableTwoFactor } from "./actions"
import { uploadImage } from "./upload-action"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Phone, Mail, Image as ImageIcon, Key, Loader2, Save, Upload, ShieldCheck, Smartphone, CheckCircle2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "İsim en az 2 karakter olmalıdır." }),
  lastName: z.string().min(2, { message: "Soyisim en az 2 karakter olmalıdır." }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifre gereklidir."),
  newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır."),
  confirmPassword: z.string().min(6, "Şifre tekrarı gereklidir."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordFormSchema>

interface ProfileFormProps {
  user: any
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 2FA States
  const [is2FAEnabled, setIs2FAEnabled] = useState(user.twoFactorEnabled || false)
  const [twoFactorMethod, setTwoFactorMethod] = useState<"EMAIL" | "PHONE">(user.twoFactorMethod === "PHONE" ? "PHONE" : "EMAIL")
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [verifyLoading, setVerifyLoading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadImage(formData)
    setUploading(false)

    if (result.success && result.url) {
      form.setValue("avatarUrl", result.url)
      toast.success("Görsel başarıyla yüklendi.")
    } else {
      toast.error(result.error || "Görsel yüklenemedi.")
    }
  }

  async function handleToggle2FA(checked: boolean) {
    if (!checked) {
      // Disable directly
      const result = await disableTwoFactor(user.id)
      if (result.success) {
        setIs2FAEnabled(false)
        toast.success("İki faktörlü doğrulama devre dışı bırakıldı.")
      } else {
        toast.error("İşlem başarısız.")
      }
    } else {
      // Start enablement flow
      // 1. Check if phone exists if method is PHONE
      if (twoFactorMethod === "PHONE" && !user.phone && !form.getValues("phone")) {
        toast.error("Lütfen önce profil ayarlarından telefon numaranızı kaydedin.")
        return
      }
      
      const contact = twoFactorMethod === "PHONE" 
        ? (user.phone || form.getValues("phone")) 
        : (user.email || form.getValues("email"))

      // 2. Send code
      const res = await sendTwoFactorVerification(twoFactorMethod, contact)
      if (res.success) {
        toast.success(res.message)
        setShowVerifyDialog(true)
      } else {
        toast.error("Doğrulama kodu gönderilemedi.")
      }
    }
  }

  async function onVerifyCode() {
    setVerifyLoading(true)
    const res = await verifyAndEnableTwoFactor(user.id, verificationCode, twoFactorMethod)
    setVerifyLoading(false)

    if (res.success) {
        setIs2FAEnabled(true)
        setShowVerifyDialog(false)
        toast.success("İki faktörlü doğrulama başarıyla aktifleştirildi!")
    } else {
        toast.error(res.error || "Hatalı kod.")
    }
  }

  // Profile Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      avatarUrl: user.avatarUrl || "",
    },
  })

  // Password Form
  const passForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onProfileSubmit(data: ProfileFormValues) {
    setLoading(true)
    const result = await updateProfile(user.id, data)
    setLoading(false)

    if (result.success) {
      toast.success("Profil bilgileri güncellendi.")
    } else {
      toast.error(result.error || "Güncelleme başarısız.")
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    setPassLoading(true)
    const result = await changePassword(user.id, data.currentPassword, data.newPassword)
    setPassLoading(false)

    if (result.success) {
      toast.success("Şifreniz başarıyla değiştirildi.")
      passForm.reset()
    } else {
      toast.error(result.error || "Şifre değiştirilemedi.")
    }
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
        <TabsTrigger value="general">
            <User className="w-4 h-4 mr-2" />
            Genel Bilgiler
        </TabsTrigger>
        <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Güvenlik
        </TabsTrigger>
      </TabsList>

      {/* --- General Tab --- */}
      <TabsContent value="general" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Kişisel Bilgiler</CardTitle>
            <CardDescription>
              Adınız, soyadınız ve iletişim bilgileriniz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onProfileSubmit)} id="profile-form" className="space-y-6">
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-3">
                      <Avatar className="h-24 w-24 border-2 border-muted relative">
                          <AvatarImage src={form.watch("avatarUrl") || "/avatars/01.png"} className="object-cover" />
                          <AvatarFallback className="text-2xl">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                          {uploading && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-full">
                              <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                          )}
                      </Avatar>
                      <div className="flex items-center">
                        <Input 
                          type="file" 
                          id="avatar-upload" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => document.getElementById("avatar-upload")?.click()}
                          disabled={uploading}
                        >
                          <Upload className="w-3 h-3 mr-2" />
                          Fotoğraf Yükle
                        </Button>
                      </div>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ad</FormLabel>
                                <FormControl>
                                <Input placeholder="Adınız" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Soyad</FormLabel>
                                <FormControl>
                                <Input placeholder="Soyadınız" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-Posta</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-9" placeholder="ornek@fithub.com" {...field} />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefon</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-9" placeholder="0555 555 55 55" {...field} />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                      </div>

                      {/* URL input removed as requested, using hidden input for form state if needed but UI is handled by Avatar upload */}
                      <input type="hidden" {...form.register("avatarUrl")} />
                  </div>
                </div>

              </form>
            </Form>
          </CardContent>
          <CardFooter className="bg-secondary/10 flex justify-end py-4">
              <Button type="submit" form="profile-form" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Değişiklikleri Kaydet
              </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* --- Security Tab --- */}
      <TabsContent value="security" className="mt-6 space-y-6">
        
        {/* 2FA Card */}
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                             <ShieldCheck className="w-5 h-5 text-primary" />
                             İki Faktörlü Doğrulama (2FA)
                        </CardTitle>
                        <CardDescription>
                            Hesap güvenliğinizi artırmak için SMS veya E-posta ile ek doğrulama katmanı ekleyin.
                        </CardDescription>
                    </div>
                    <Switch 
                        checked={is2FAEnabled}
                        onCheckedChange={handleToggle2FA}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="flex items-start space-x-4 p-4 rounded-lg border bg-muted/40">
                        <div className={`p-2 rounded-full ${is2FAEnabled ? 'bg-green-100 text-green-600' : 'bg-secondary text-muted-foreground'}`}>
                             {is2FAEnabled ? <CheckCircle2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="font-medium text-sm">
                                {is2FAEnabled ? "2FA Şu Anda Aktif" : "2FA Şu Anda Devre Dışı"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {is2FAEnabled 
                                    ? `Hesabınız ${twoFactorMethod === 'EMAIL' ? 'E-posta' : 'SMS'} doğrulaması ile korunuyor.`
                                    : "Hesabınız sadece şifre ile korunuyor. Güvenliğiniz için 2FA açmanızı öneririz."
                                }
                            </p>
                        </div>
                    </div>

                    {!is2FAEnabled && (
                        <div className="space-y-4">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Doğrulama Yöntemi Seçin
                            </label>
                            <RadioGroup 
                                defaultValue={twoFactorMethod} 
                                onValueChange={(v) => setTwoFactorMethod(v as "EMAIL" | "PHONE")}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="EMAIL" id="r-email" className="peer sr-only" />
                                    <label
                                        htmlFor="r-email"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full text-center"
                                    >
                                        <Mail className="mb-3 h-6 w-6" />
                                        <span className="font-semibold">E-Posta</span>
                                        <span className="text-xs text-muted-foreground mt-1">Kod e-postanıza gelir</span>
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="PHONE" id="r-phone" className="peer sr-only" />
                                    <label
                                        htmlFor="r-phone"
                                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full text-center"
                                    >
                                        <Smartphone className="mb-3 h-6 w-6" />
                                        <span className="font-semibold">SMS (Telefon)</span>
                                        <span className="text-xs text-muted-foreground mt-1">Kod telefonunuza gelir</span>
                                    </label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Şifre Değiştir</CardTitle>
                <CardDescription>
                    Hesabınızın şifresini buradan güncelleyebilirsiniz.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...passForm}>
                    <form onSubmit={passForm.handleSubmit(onPasswordSubmit)} id="password-form" className="space-y-4 max-w-md">
                        <FormField
                            control={passForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mevcut Şifre</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input type="password" className="pl-9" {...field} />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Separator className="my-2" />
                        <FormField
                            control={passForm.control}
                            name="newPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Yeni Şifre</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input type="password" className="pl-9" {...field} />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={passForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Yeni Şifre (Tekrar)</FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input type="password" className="pl-9" {...field} />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="bg-secondary/10 flex justify-end py-4">
                <Button type="submit" form="password-form" disabled={passLoading}>
                    {passLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Şifreyi Güncelle
                </Button>
            </CardFooter>
        </Card>

        {/* Verify Dialog */}
        <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kodu Doğrula</DialogTitle>
                    <DialogDescription>
                        {twoFactorMethod === 'EMAIL' ? 'E-postanıza' : 'Telefonunuza'} (Test: 123456) adresine gönderilen 6 haneli kodu girin.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input 
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="123456"
                        className="text-center text-2xl tracking-widest"
                        maxLength={6}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>İptal</Button>
                    <Button onClick={onVerifyCode} disabled={verifyLoading}>
                        {verifyLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Doğrula ve Aç
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </TabsContent>
    </Tabs>
  )
}
