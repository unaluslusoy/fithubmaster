"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Save, Send, Server, Shield, User, Key, AtSign, CheckCircle2, AlertCircle, Cloud, Globe, Database, Lock } from "lucide-react"
import { toast } from "sonner"
import { 
    getSystemSettings, 
    saveSmtpSettings, 
    sendTestEmail, 
    saveCloudflareSettings, 
    testCloudflareR2,
    saveCloudflareGeneralSettings,
    getCloudflareZoneStatus,
    updateCloudflareSetting,
    purgeCloudflareCache,
    saveCaptchaSettings,
    getCloudflareZones,
    getCloudflareDnsRecords,
    addCloudflareDnsRecord,
    deleteCloudflareDnsRecord,
    saveFirebaseSettings
} from "./actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2, Plus, Flame, FileJson, BellRing, MessageSquare } from "lucide-react"

import { Turnstile } from '@marsidev/react-turnstile'
import { verifyCaptchaToken, verifyCaptchaTest } from "./actions"

export default function SettingsPage() {
    const [captchaTestToken, setCaptchaTestToken] = useState("")
    const [verifyingCaptcha, setVerifyingCaptcha] = useState(false)
    
    async function handleCaptchaVerifyTest() {
        if(!captchaTestToken) {
            toast.error("Lütfen önce Captcha'yı doğrulayınız.")
            return
        }
        setVerifyingCaptcha(true)
        // Pass the currently entered secret key for testing (before saving)
        const res = await verifyCaptchaTest(captchaTestToken, captchaSecretKey)
        setVerifyingCaptcha(false)
        if(res.success) {
            toast.success("Doğrulama Başarılı! Site Key ve Secret Key doğru çalışıyor.")
        } else {
            toast.error("Doğrulama Başarısız: " + res.error)
        }
    }

    const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testingR2, setTestingR2] = useState(false)
  
  // Cloudflare Zones & DNS
  const [zones, setZones] = useState<any[]>([])
  const [loadingZones, setLoadingZones] = useState(false)
  const [dnsRecords, setDnsRecords] = useState<any[]>([])
  const [loadingDns, setLoadingDns] = useState(false)
  const [newDnsOpen, setNewDnsOpen] = useState(false)
  const [newDns, setNewDns] = useState({ type: "A", name: "", content: "", proxied: true })

  // SMTP State
  const [host, setHost] = useState("")
  const [port, setPort] = useState("465")
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [from, setFrom] = useState("")
  const [secure, setSecure] = useState(true)
  const [testEmail, setTestEmail] = useState("")

  // Cloudflare R2 State
  const [cfAccountId, setCfAccountId] = useState("")
  const [cfAccessKeyId, setCfAccessKeyId] = useState("")
  const [cfSecretAccessKey, setCfSecretAccessKey] = useState("")
  const [cfBucketName, setCfBucketName] = useState("")
  const [cfPublicUrl, setCfPublicUrl] = useState("")

  // Cloudflare General State
  const [cfApiKey, setCfApiKey] = useState("")
  const [cfEmail, setCfEmail] = useState("")
  const [cfZoneId, setCfZoneId] = useState("")
  
  // Cloudflare Status
  const [cfStatus, setCfStatus] = useState<any>(null)
  
  // Captcha State
  const [captchaProvider, setCaptchaProvider] = useState("turnstile")
  const [captchaSiteKey, setCaptchaSiteKey] = useState("")
  const [captchaSecretKey, setCaptchaSecretKey] = useState("")
  const [captchaEnabled, setCaptchaEnabled] = useState(false)
  
  // Firebase State
  const [fbApiKey, setFbApiKey] = useState("")
  const [fbAuthDomain, setFbAuthDomain] = useState("")
  const [fbProjectId, setFbProjectId] = useState("")
  const [fbStorageBucket, setFbStorageBucket] = useState("")
  const [fbMessagingSenderId, setFbMessagingSenderId] = useState("")
  const [fbAppId, setFbAppId] = useState("")
  const [fbMeasurementId, setFbMeasurementId] = useState("")
  const [fbServiceAccount, setFbServiceAccount] = useState("")
  const [fbEnableAuth, setFbEnableAuth] = useState(false)
  const [fbEnableFcm, setFbEnableFcm] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const config = await getSystemSettings()
      if (config) {
        // SMTP
        setHost(config.smtp_host || "smtp.yandex.com")
        setPort(config.smtp_port || "465")
        setUser(config.smtp_user || "")
        setPass(config.smtp_pass || "")
        setFrom(config.smtp_from || "")
        setSecure(config.smtp_secure === "true")

        // Cloudflare R2
        setCfAccountId(config.cf_account_id || "")
        setCfAccessKeyId(config.cf_access_key_id || "")
        setCfSecretAccessKey(config.cf_secret_access_key || "")
        setCfBucketName(config.cf_bucket_name || "")
        setCfPublicUrl(config.cf_public_url || "")

        // Cloudflare General
        setCfApiKey(config.cf_api_key || "")
        setCfEmail(config.cf_email || "")
        setCfZoneId(config.cf_zone_id || "")
        
        // Captcha
        setCaptchaProvider(config.captcha_provider || "turnstile")
        setCaptchaSiteKey(config.captcha_site_key || "")
        setCaptchaSecretKey(config.captcha_secret_key || "")
        setCaptchaEnabled(config.captcha_enabled === "true")

        // Firebase
        setFbApiKey(config.firebase_api_key || "")
        setFbAuthDomain(config.firebase_auth_domain || "")
        setFbProjectId(config.firebase_project_id || "")
        setFbStorageBucket(config.firebase_storage_bucket || "")
        setFbMessagingSenderId(config.firebase_messaging_sender_id || "")
        setFbAppId(config.firebase_app_id || "")
        setFbMeasurementId(config.firebase_measurement_id || "")
        setFbServiceAccount(config.firebase_service_account || "")
        setFbEnableAuth(config.firebase_enable_auth === "true")
        setFbEnableFcm(config.firebase_enable_fcm === "true")

        if (config.cf_api_key && config.cf_email && config.cf_zone_id) {
            fetchZoneStatus()
            fetchDnsRecords()
        }
      }
    } catch(err) {
      console.error(err)
      toast.error("Ayarlar yüklenemedi.")
    } finally {
      setLoading(false)
    }
  }

  async function fetchZoneStatus() {
      const res = await getCloudflareZoneStatus()
      if (res.success) {
          setCfStatus(res.data)
      }
  }

  async function fetchDnsRecords() {
      setLoadingDns(true)
      const res = await getCloudflareDnsRecords()
      if (res.success) {
          setDnsRecords(res.records)
      }
      setLoadingDns(false)
  }

  async function handleLoadZones(e?: React.MouseEvent) {
      if(e) e.preventDefault()
      if (!cfApiKey || !cfEmail) {
          toast.error("Lütfen önce API Key ve Email giriniz.")
          return
      }
      setLoadingZones(true)
      const res = await getCloudflareZones(cfApiKey, cfEmail)
      setLoadingZones(false)

      if (res.success) {
          setZones(res.zones)
          toast.success(`${res.zones.length} adet Zone listelendi.`)
      } else {
          toast.error(res.error)
      }
  }

  async function handleAddDns() {
      const formData = new FormData()
      formData.append("type", newDns.type)
      formData.append("name", newDns.name)
      formData.append("content", newDns.content)
      formData.append("proxied", newDns.proxied ? "true" : "false")
      
      const res = await addCloudflareDnsRecord(formData)
      if (res.success) {
          toast.success(res.message)
          setNewDnsOpen(false)
          setNewDns({ type: "A", name: "", content: "", proxied: true })
          fetchDnsRecords()
      } else {
          toast.error(res.error)
      }
  }

  async function handleDeleteDns(id: string) {
      if(!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return
      
      const res = await deleteCloudflareDnsRecord(id)
      if (res.success) {
          toast.success(res.message)
          fetchDnsRecords()
      } else {
          toast.error(res.error)
      }
  }

  async function handleSmtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData()
    formData.append("host", host)
    formData.append("port", port)
    formData.append("user", user)
    formData.append("pass", pass)
    formData.append("from", from)
    formData.append("secure", secure ? "on" : "off")

    const result = await saveSmtpSettings(formData)
    setSaving(false)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.error)
    }
  }

  async function handleCloudflareSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData()
    formData.append("cf_account_id", cfAccountId)
    formData.append("cf_access_key_id", cfAccessKeyId)
    formData.append("cf_secret_access_key", cfSecretAccessKey)
    formData.append("cf_bucket_name", cfBucketName)
    formData.append("cf_public_url", cfPublicUrl)

    const result = await saveCloudflareSettings(formData)
    setSaving(false)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.error)
    }
  }

  async function handleCloudflareGeneralSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData()
    formData.append("cf_api_key", cfApiKey)
    formData.append("cf_email", cfEmail)
    formData.append("cf_zone_id", cfZoneId)

    const result = await saveCloudflareGeneralSettings(formData)
    setSaving(false)

    if (result.success) {
      toast.success(result.message)
      fetchZoneStatus()
    } else {
      toast.error(result.error)
    }
  }

  async function handleFirebaseSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData()
    formData.append("firebase_api_key", fbApiKey)
    formData.append("firebase_auth_domain", fbAuthDomain)
    formData.append("firebase_project_id", fbProjectId)
    formData.append("firebase_storage_bucket", fbStorageBucket)
    formData.append("firebase_messaging_sender_id", fbMessagingSenderId)
    formData.append("firebase_app_id", fbAppId)
    formData.append("firebase_measurement_id", fbMeasurementId)
    formData.append("firebase_service_account", fbServiceAccount)
    formData.append("firebase_enable_auth", fbEnableAuth ? "on" : "off")
    formData.append("firebase_enable_fcm", fbEnableFcm ? "on" : "off")

    const result = await saveFirebaseSettings(formData)
    setSaving(false)

    if (result.success) {
        toast.success(result.message)
    } else {
        toast.error(result.error)
    }
  }

  async function handleCaptchaSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData()
    formData.append("captcha_provider", captchaProvider)
    formData.append("captcha_site_key", captchaSiteKey)
    formData.append("captcha_secret_key", captchaSecretKey)
    formData.append("captcha_enabled", captchaEnabled ? "on" : "off")

    const result = await saveCaptchaSettings(formData)
    setSaving(false)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.error)
    }
  }

  async function handlePurgeCache() {
      if (!confirm("Tüm önbelleği temizlemek istediğinize emin misiniz?")) return
      
      const result = await purgeCloudflareCache()
      if (result.success) {
          toast.success(result.message)
      } else {
          toast.error(result.error)
      }
  }

  async function updateSetting(key: string, value: any) {
      const result = await updateCloudflareSetting(key, value)
      if (result.success) {
          toast.success(result.message)
          fetchZoneStatus()
      } else {
          toast.error(result.error)
      }
  }

  async function handleTestEmail() {
    if (!testEmail) {
        toast.error("Lütfen bir test e-postası giriniz.")
        return
    }
    setTesting(true)
    const result = await sendTestEmail(testEmail)
    setTesting(false)
    
    if (result.success) {
        toast.success(result.message)
    } else {
        toast.error(result.error)
    }
  }

  async function handleCloudflareTest(e: React.MouseEvent) {
    e.preventDefault() // Prevent form submit if button is inside form
    setTestingR2(true)

    const formData = new FormData()
    formData.append("cf_account_id", cfAccountId)
    formData.append("cf_access_key_id", cfAccessKeyId)
    formData.append("cf_secret_access_key", cfSecretAccessKey)
    formData.append("cf_bucket_name", cfBucketName)

    const result = await testCloudflareR2(formData)
    setTestingR2(false)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.error)
    }
  }

  if (loading) return <div className="p-8">Yükleniyor...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Sistem Ayarları</h2>
           <p className="text-muted-foreground">E-posta sunucusu, dosya depolama ve genel sistem yapılandırmaları.</p>
        </div>
      </div>

      <Tabs defaultValue="smtp" className="space-y-6">
        <TabsList className="h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger 
            value="smtp" 
            className="relative h-12 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <Mail className="mr-2 h-4 w-4" />
            E-Posta (SMTP)
          </TabsTrigger>
          <TabsTrigger 
            value="cloudflare" 
            className="relative h-12 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <Cloud className="mr-2 h-4 w-4" />
            Cloudflare Entegrasyonu
          </TabsTrigger>
          <TabsTrigger 
            value="firebase" 
            className="relative h-12 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <Flame className="mr-2 h-4 w-4" />
            Firebase
            {fbEnableAuth && <Badge variant="secondary" className="ml-2 text-[10px] h-4">SMS</Badge>}
            {fbEnableFcm && <Badge variant="secondary" className="ml-1 text-[10px] h-4">Push</Badge>}
          </TabsTrigger>
          <TabsTrigger 
            value="security"  
            className="relative h-12 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <Shield className="mr-2 h-4 w-4" />
            Güvenlik
          </TabsTrigger>
          <TabsTrigger 
            value="general" 
            className="relative h-12 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <Server className="mr-2 h-4 w-4" />
            Genel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="smtp">
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* SMTP Configuration Form */}
            <Card>
              <CardHeader>
                <CardTitle>SMTP Sunucu Ayarları</CardTitle>
                <CardDescription>
                  Sistem bildirimleri ve şifre sıfırlama için kullanılacak mail sunucusu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="smtp-form" onSubmit={handleSmtpSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="host">Sunucu Adresi (Host)</Label>
                      <div className="relative">
                        <Server className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="host"
                            placeholder="smtp.yandex.com" 
                            className="pl-9" 
                            value={host}
                            onChange={e => setHost(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port">Port</Label>
                      <Input 
                        id="port"
                        placeholder="465" 
                        value={port}
                        onChange={e => setPort(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user">Kullanıcı Adı (Email)</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="user"
                            placeholder="admin@domain.com" 
                            className="pl-9"
                            value={user}
                            onChange={e => setUser(e.target.value)}
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pass">Uygulama Şifresi</Label>
                    <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="pass"
                            type="password"
                            placeholder="••••••••••••••••" 
                            className="pl-9 font-mono"
                            value={pass}
                            onChange={e => setPass(e.target.value)}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Gmail veya Yandex için normal şifreniz değil, &quot;Uygulama Şifresi&quot; kullanmalısınız.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from">Gönderen Adresi (From)</Label>
                    <div className="relative">
                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="from"
                            placeholder="no-reply@domain.com" 
                            className="pl-9"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                        />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border p-3 rounded-lg bg-secondary/20">
                    <div className="space-y-0.5">
                      <Label className="text-base">SSL/TLS Güvenli Bağlantı</Label>
                      <p className="text-xs text-muted-foreground">Port 465 kullanıyorsanız açık olmalıdır.</p>
                    </div>
                    <Switch 
                        checked={secure}
                        onCheckedChange={setSecure}
                    />
                  </div>

                </form>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 bg-secondary/10 py-4">
                 <Button type="button" variant="outline" onClick={loadSettings}>Vazgeç</Button>
                 <Button type="submit" form="smtp-form" disabled={saving}>
                    {saving ? (
                        "Kaydediliyor..."
                    ) : (
                        <>
                           <Save className="w-4 h-4 mr-2" />
                           Ayarları Kaydet
                        </>
                    )}
                 </Button>
              </CardFooter>
            </Card>

            {/* Test Email Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Bağlantıyı Test Et</CardTitle>
                    <CardDescription>
                        Ayarlarınızı kaydettikten sonra test maili göndererek doğrulayın.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 flex gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div className="text-sm">
                            <p className="font-semibold mb-1">Dikkat Edilmesi Gerekenler</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Yandex/Gmail kullanıyorsanız 2FA açıp &quot;Uygulama Şifresi&quot; oluşturmalısınız.</li>
                                <li>Port genellikle SSL için 465, TLS için 587&apos;dir.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <Label>Test E-Posta Adresi</Label>
                        <Input 
                            placeholder="ornek@domain.com" 
                            value={testEmail}
                            onChange={e => setTestEmail(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        variant="secondary" 
                        className="w-full" 
                        onClick={handleTestEmail}
                        disabled={testing}
                    >
                        {testing ? "Gönderiliyor..." : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Test E-Postası Gönder
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

          </div>
        </TabsContent>

        

        <TabsContent value="cloudflare" className="space-y-6">
            <Tabs defaultValue="zone" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="zone">Alan Adı & DNS Yönetimi</TabsTrigger>
                    <TabsTrigger value="storage">R2 Depolama (Storage)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="zone" className="space-y-6 mt-4">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Cloudflare API Bağlantısı</CardTitle>
                                <CardDescription>Domain yönetimi (SSL, DNS, Cache) için gerekli kimlik bilgileri.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form id="cf-zone-form" onSubmit={handleCloudflareGeneralSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Global API Key / Token</Label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    type="password"
                                                    placeholder="Cloudflare Global API Key..."
                                                    className="pl-9"
                                                    value={cfApiKey}
                                                    onChange={e => setCfApiKey(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Cloudflare Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder="email@example.com"
                                                    className="pl-9"
                                                    value={cfEmail}
                                                    onChange={e => setCfEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Zone ID</Label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    {zones.length > 0 ? (
                                                        <Select value={cfZoneId} onValueChange={setCfZoneId}>
                                                            <SelectTrigger className="pl-9">
                                                                <SelectValue placeholder="Zone Seçiniz" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {zones.map(z => (
                                                                    <SelectItem key={z.id} value={z.id}>
                                                                        {z.name} ({z.plan}) - {z.status}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <Input 
                                                            placeholder="Zone ID (veya listelemek için 'Bağlan' butonuna basın)"
                                                            className="pl-9"
                                                            value={cfZoneId}
                                                            onChange={e => setCfZoneId(e.target.value)}
                                                        />
                                                    )}
                                                </div>
                                                <Button type="button" variant="secondary" onClick={handleLoadZones} disabled={loadingZones}>
                                                    {loadingZones ? <Loader2 className="w-4 h-4 animate-spin" /> : "Bağlan & Getir"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                         <Button type="submit" disabled={saving}>
                                            {saving ? "Kaydediliyor..." : <><Save className="w-4 h-4 mr-2" /> Kimlik Bilgilerini Kaydet</>}
                                         </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {cfZoneId && cfApiKey && (
                            <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>DNS Yönetimi</CardTitle>
                                    <CardDescription>Domain DNS kayıtlarını buradan yönetebilirsiniz.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-end mb-4">
                                        <Dialog open={newDnsOpen} onOpenChange={setNewDnsOpen}>
                                            <DialogTrigger asChild>
                                                <Button><Plus className="w-4 h-4 mr-2"/> Yeni Kayıt Ekle</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Yeni DNS Kaydı</DialogTitle>
                                                    <DialogDescription>A, CNAME veya TXT kaydı ekleyin.</DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">Tip</Label>
                                                        <Select value={newDns.type} onValueChange={v => setNewDns({...newDns, type: v})}>
                                                            <SelectTrigger className="col-span-3">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="A">A (IPv4)</SelectItem>
                                                                <SelectItem value="AAAA">AAAA (IPv6)</SelectItem>
                                                                <SelectItem value="CNAME">CNAME (Alias)</SelectItem>
                                                                <SelectItem value="TXT">TXT (Text)</SelectItem>
                                                                <SelectItem value="MX">MX (Mail)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">İsim (@ veya sub)</Label>
                                                        <Input className="col-span-3" value={newDns.name} onChange={e => setNewDns({...newDns, name: e.target.value})} placeholder="example.com" />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">Content (IP/Target)</Label>
                                                        <Input className="col-span-3" value={newDns.content} onChange={e => setNewDns({...newDns, content: e.target.value})} placeholder="192.0.2.1" />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">Proxy Status</Label>
                                                        <div className="col-span-3 flex items-center space-x-2">
                                                            <Switch checked={newDns.proxied} onCheckedChange={c => setNewDns({...newDns, proxied: c})} />
                                                            <span className="text-sm text-muted-foreground">{newDns.proxied ? "Proxied (CDN + Security)" : "DNS Only"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleAddDns}>Ekle</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Content</TableHead>
                                                    <TableHead>Proxy Status</TableHead>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loadingDns ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center h-24">Yükleniyor...</TableCell>
                                                    </TableRow>
                                                ) : dnsRecords.map((record: any) => (
                                                    <TableRow key={record.id}>
                                                        <TableCell className="font-medium">{record.type}</TableCell>
                                                        <TableCell>{record.name}</TableCell>
                                                        <TableCell className="max-w-[200px] truncate" title={record.content}>{record.content}</TableCell>
                                                        <TableCell>
                                                            {record.proxied ? (
                                                                <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">Proxied</Badge>
                                                            ) : (
                                                                <Badge variant="outline">DNS Only</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteDns(record.id)}>
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="mt-2 text-right">
                                        <Button variant="outline" size="sm" onClick={() => fetchDnsRecords()} disabled={loadingDns}>
                                            Listeyi Yenile
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Performans & Optimizasyon</CardTitle>
                                    <CardDescription>
                                        Sitenizin hızını artıracak Cloudflare özellikleri.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                     <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            Auto Minify
                                            <Badge variant="secondary" className="text-[10px]">Speed</Badge>
                                        </Label>
                                        <div className="space-y-2 border p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">JavaScript</span>
                                                <Switch 
                                                    checked={cfStatus?.minify?.js === "on"} 
                                                    onCheckedChange={(c) => updateSetting("minify", { ...cfStatus?.minify, js: c?"on":"off" })}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">CSS</span>
                                                <Switch 
                                                    checked={cfStatus?.minify?.css === "on"} 
                                                    onCheckedChange={(c) => updateSetting("minify", { ...cfStatus?.minify, css: c?"on":"off" })}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">HTML</span>
                                                <Switch 
                                                    checked={cfStatus?.minify?.html === "on"} 
                                                    onCheckedChange={(c) => updateSetting("minify", { ...cfStatus?.minify, html: c?"on":"off" })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            Rocket Loader™
                                            <Badge variant="secondary" className="text-[10px]">JS Async</Badge>
                                        </Label>
                                        <div className="flex items-center justify-between border p-3 rounded-lg h-[108px]">
                                            <p className="text-xs text-muted-foreground pr-2">JavaScript yükleme süresini iyileştirir.</p>
                                            <Switch 
                                                checked={cfStatus?.rocketLoader === "on"} 
                                                onCheckedChange={(c) => updateSetting("rocket_loader", c ? "on" : "off")}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            Brotli Compression
                                            <Badge variant="secondary" className="text-[10px]">Compression</Badge>
                                        </Label>
                                        <div className="flex items-center justify-between border p-3 rounded-lg h-[108px]">
                                            <p className="text-xs text-muted-foreground pr-2">Gzip&apos;ten daha iyi sıkıştırma sağlar.</p>
                                            <Switch 
                                                checked={cfStatus?.brotli === "on"} 
                                                onCheckedChange={(c) => updateSetting("brotli", c ? "on" : "off")}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            HTTP/3 (QUIC)
                                            <Badge variant="secondary" className="text-[10px]">Protocol</Badge>
                                        </Label>
                                        <div className="flex items-center justify-between border p-3 rounded-lg h-[108px]">
                                            <p className="text-xs text-muted-foreground pr-2">Daha hızlı ve güvenli bağlantı protokolü.</p>
                                            <Switch 
                                                checked={cfStatus?.http3 === "on"} 
                                                onCheckedChange={(c) => updateSetting("http3", c ? "on" : "off")}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            0-RTT Connection
                                            <Badge variant="secondary" className="text-[10px]">Speed</Badge>
                                        </Label>
                                        <div className="flex items-center justify-between border p-3 rounded-lg h-[108px]">
                                            <p className="text-xs text-muted-foreground pr-2">Tekrar eden ziyaretçiler için gecikmeyi düşürür.</p>
                                            <Switch 
                                                checked={cfStatus?.zeroRtt === "on"} 
                                                onCheckedChange={(c) => updateSetting("0rtt", c ? "on" : "off")}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2">
                                            IPv6 Support
                                            <Badge variant="secondary" className="text-[10px]">Network</Badge>
                                        </Label>
                                        <div className="flex items-center justify-between border p-3 rounded-lg h-[108px]">
                                            <p className="text-xs text-muted-foreground pr-2">Modern internet protokolü desteği.</p>
                                            <Switch 
                                                checked={cfStatus?.ipv6 === "on"} 
                                                onCheckedChange={(c) => updateSetting("ipv6", c ? "on" : "off")}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Güvenlik Durumu</CardTitle>
                                    <CardDescription>
                                        Mevcut Durum: 
                                        {cfStatus ? (
                                            <span className="ml-2 inline-flex items-center text-green-600 font-medium text-sm">
                                                <CheckCircle2 className="w-4 h-4 mr-1" /> Bağlı
                                            </span>
                                        ) : (
                                            <span className="ml-2 text-muted-foreground text-sm">Bilgi alınıyor...</span>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>SSL/TLS Modu</Label>
                                            <Select 
                                                value={cfStatus?.ssl || "off"} 
                                                onValueChange={(val) => updateSetting("ssl", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seçiniz" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="off">Off (Kapalı)</SelectItem>
                                                    <SelectItem value="flexible">Flexible</SelectItem>
                                                    <SelectItem value="full">Full</SelectItem>
                                                    <SelectItem value="strict">Full (Strict)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground">Sunucunuzda SSL sertifikası varsa Full (Strict) önerilir.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Güvenlik Düzeyi (Security Level)</Label>
                                            <Select 
                                                value={cfStatus?.securityLevel || "medium"} 
                                                onValueChange={(val) => updateSetting("security_level", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seçiniz" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="off">Off</SelectItem>
                                                    <SelectItem value="essentially_off">Essentially Off</SelectItem>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                    <SelectItem value="under_attack">I&apos;m Under Attack!</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Geliştirici Modu (Dev Mode)</Label>
                                            <div className="flex items-center justify-between border p-2 rounded">
                                                <span className="text-sm">Önbelleği geçici olarak devre dışı bırakır.</span>
                                                <Switch 
                                                    checked={cfStatus?.devMode === "on"}
                                                    onCheckedChange={(checked) => updateSetting("development_mode", checked ? "on" : "off")}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Always Use HTTPS</Label>
                                            <div className="flex items-center justify-between border p-2 rounded">
                                                <span className="text-sm">Tüm istekleri HTTPS&apos;e yönlendirir.</span>
                                                <Switch 
                                                    checked={cfStatus?.alwaysUseHttps === "on"}
                                                    onCheckedChange={(checked) => updateSetting("always_use_https", checked ? "on" : "off")}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Automatic HTTPS Rewrites</Label>
                                            <div className="flex items-center justify-between border p-2 rounded">
                                                <span className="text-sm">HTTP linkleri otomatik HTTPS yapar.</span>
                                                <Switch 
                                                    checked={cfStatus?.automaticHttpsRewrites === "on"}
                                                    onCheckedChange={(checked) => updateSetting("automatic_https_rewrites", checked ? "on" : "off")}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 mt-4">
                                        <Label className="mb-2 block">Önbellek İşlemleri</Label>
                                        <Button 
                                            variant="destructive" 
                                            onClick={handlePurgeCache}
                                            className="w-full sm:w-auto"
                                        >
                                            <Database className="w-4 h-4 mr-2" />
                                            Tüm Önbelleği Temizle (Purge Everything)
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Dikkat: Bu işlem sitenizin Cloudflare üzerindeki tüm önbelleğini siler. Yüklenme süreleri geçici olarak artabilir.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            </>
                        )}
                    </div>
                </TabsContent>
                
                <TabsContent value="storage">
                    <Card>
                    <CardHeader>
                        <CardTitle>Cloudflare R2 Depolama Ayarları</CardTitle>
                        <CardDescription>
                            Dosya yüklemeleri için Cloudflare R2 veya S3 uyumlu depolama ayarları.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="cf-form" onSubmit={handleCloudflareSubmit} className="space-y-4">
                            {/* R2 Form Fields */}
                            <div className="space-y-2">
                                <Label htmlFor="cfAccountId">Hesap ID (Account ID)</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="cfAccountId"
                                        placeholder="32 karakterlik hesap ID..." 
                                        className="pl-9"
                                        value={cfAccountId}
                                        onChange={e => setCfAccountId(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">R2 dashboard &gt; Account details bölümünde bulunur.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cfAccessKeyId">Access Key ID</Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="cfAccessKeyId"
                                            placeholder="CF Access Key ID..." 
                                            className="pl-9"
                                            value={cfAccessKeyId}
                                            onChange={e => setCfAccessKeyId(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cfSecretAccessKey">Secret Access Key</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="cfSecretAccessKey"
                                            type="password"
                                            placeholder="CF Secret Access Key..." 
                                            className="pl-9"
                                            value={cfSecretAccessKey}
                                            onChange={e => setCfSecretAccessKey(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cfBucketName">Bucket İsmi</Label>
                                    <div className="relative">
                                        <Database className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="cfBucketName"
                                            placeholder="my-assets-bucket" 
                                            className="pl-9"
                                            value={cfBucketName}
                                            onChange={e => setCfBucketName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cfPublicUrl">Public Domain Access</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="cfPublicUrl"
                                            placeholder="https://pub-xxx.r2.dev" 
                                            className="pl-9"
                                            value={cfPublicUrl}
                                            onChange={e => setCfPublicUrl(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 bg-secondary/10 py-4">
                        <Button type="button" variant="secondary" onClick={handleCloudflareTest} disabled={testingR2}>
                            {testingR2 ? (
                                "Test Ediliyor..." 
                            ) : ( 
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Bağlantıyı Test Et
                                </>
                            )}
                        </Button>
                        <Button type="submit" form="cf-form" disabled={saving}>
                            {saving ? "Kaydediliyor..." : <><Save className="w-4 h-4 mr-2" /> Ayarları Kaydet</>}
                        </Button>
                    </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </TabsContent>

        <TabsContent value="firebase">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Firebase Entegrasyonu
                    </CardTitle>
                    <CardDescription>
                        SMS doğrulama (2FA), E-posta girişleri ve Push bildirimleri (FCM) için Firebase yapılandırması.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="firebase-form" onSubmit={handleFirebaseSubmit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border p-4 rounded-lg bg-orange-50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-900/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-semibold">SMS / Auth Servisi</Label>
                                        <p className="text-xs text-muted-foreground">Cep telefonu girişi ve SMS doğrulaması.</p>
                                    </div>
                                    <Switch checked={fbEnableAuth} onCheckedChange={setFbEnableAuth} />
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Badge variant="outline" className="bg-background"><MessageSquare className="w-3 h-3 mr-1"/> SMS</Badge>
                                    <Badge variant="outline" className="bg-background"><User className="w-3 h-3 mr-1"/> Auth</Badge>
                                </div>
                            </div>

                            <div className="border p-4 rounded-lg bg-blue-50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-semibold">Push Bildirimleri (FCM)</Label>
                                        <p className="text-xs text-muted-foreground">Mobil ve Web bildirimleri.</p>
                                    </div>
                                    <Switch checked={fbEnableFcm} onCheckedChange={setFbEnableFcm} />
                                </div>
                                <div className="flex gap-2 mt-3">
                                     <Badge variant="outline" className="bg-background"><BellRing className="w-3 h-3 mr-1"/> Notifications</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                             <h3 className="font-medium flex items-center gap-2">
                                <FileJson className="w-4 h-4 text-primary" />
                                Client Config (Web SDK)
                             </h3>
                             <p className="text-sm text-muted-foreground mb-4">
                                Firebase Console &gt; Project Settings &gt; General &gt; Your Apps bölümündeki config nesnesi değerleri.
                             </p>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>API Key</Label>
                                    <Input value={fbApiKey} onChange={e => setFbApiKey(e.target.value)} placeholder="AIzaSy..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Auth Domain</Label>
                                    <Input value={fbAuthDomain} onChange={e => setFbAuthDomain(e.target.value)} placeholder="project-id.firebaseapp.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Project ID</Label>
                                    <Input value={fbProjectId} onChange={e => setFbProjectId(e.target.value)} placeholder="project-id" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Storage Bucket</Label>
                                    <Input value={fbStorageBucket} onChange={e => setFbStorageBucket(e.target.value)} placeholder="project-id.appspot.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Messaging Sender ID</Label>
                                    <Input value={fbMessagingSenderId} onChange={e => setFbMessagingSenderId(e.target.value)} placeholder="123456789" />
                                </div>
                                <div className="space-y-2">
                                    <Label>App ID</Label>
                                    <Input value={fbAppId} onChange={e => setFbAppId(e.target.value)} placeholder="1:123456:web:..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Measurement ID (Optional)</Label>
                                    <Input value={fbMeasurementId} onChange={e => setFbMeasurementId(e.target.value)} placeholder="G-..." />
                                </div>
                             </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="font-medium flex items-center gap-2">
                                <Key className="w-4 h-4 text-red-500" />
                                Service Account (Admin SDK)
                            </h3>
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200 text-sm border border-yellow-200 dark:border-yellow-900 rounded-md">
                                <AlertCircle className="w-4 h-4 inline mr-1" />
                                Backend işlemleri (Custom Token, Server-side bildirim vb.) için gereklidir. Project Settings &gt; Service Accounts bölümünden JSON olarak indirin.
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Service Account JSON</Label>
                                <textarea 
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono text-xs"
                                    placeholder='{ "type": "service_account", "project_id": "...", ... }'
                                    value={fbServiceAccount}
                                    onChange={e => setFbServiceAccount(e.target.value)}
                                />
                            </div>
                        </div>

                    </form>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-secondary/10 py-4">
                    <Button type="button" variant="outline" onClick={loadSettings}>Vazgeç</Button>
                    <Button type="submit" form="firebase-form" disabled={saving}>
                        {saving ? (
                            "Kaydediliyor..."
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Ayarları Kaydet
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>

        <TabsContent value="security">
            <Card>
                <CardHeader>
                    <CardTitle>Güvenlik & Captcha Ayarları</CardTitle>
                    <CardDescription>
                        Kayıt, giriş ve şifre sıfırlama sayfaları için bot koruması yapılandırması.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="captcha-form" onSubmit={handleCaptchaSubmit} className="space-y-6">
                        
                        <div className="flex items-center justify-between border p-4 rounded-lg bg-secondary/10">
                            <div className="space-y-0.5">
                                <Label className="text-base">Captcha Korumasını Etkinleştir</Label>
                                <p className="text-sm text-muted-foreground">
                                    Açık olduğunda tüm formlarda (Login, Register, Forgot Password) doğrulama istenir.
                                </p>
                            </div>
                            <Switch 
                                checked={captchaEnabled}
                                onCheckedChange={setCaptchaEnabled}
                            />
                        </div>

                        {captchaEnabled && (
                            <div className="grid gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="space-y-2">
                                    <Label>Sağlayıcı (Provider)</Label>
                                    <div className="flex items-center space-x-2 border p-3 rounded-md bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                                        <Cloud className="w-5 h-5 text-orange-600" />
                                        <span className="font-semibold text-orange-800 dark:text-orange-200">Cloudflare Turnstile</span>
                                        <Badge className="ml-auto bg-orange-600 hover:bg-orange-700">Aktif</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Tam entegrasyon için yalnızca Cloudflare Turnstile desteklenmektedir. Google reCAPTCHA desteklenmez.
                                    </p>
                                </div>
                                
                                <input type="hidden" name="captcha_provider" value="turnstile" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="siteKey">Site Key</Label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="siteKey"
                                                placeholder="Site Key..."
                                                className="pl-9"
                                                value={captchaSiteKey}
                                                onChange={e => setCaptchaSiteKey(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="secretKey">Secret Key</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="secretKey"
                                                type="password"
                                                placeholder="Secret Key..."
                                                className="pl-9"
                                                value={captchaSecretKey}
                                                onChange={e => setCaptchaSecretKey(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 flex gap-3 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <div>
                                        <p>Key&apos;leri nereden bulabilirim?</p>
                                        <ul className="list-disc pl-4 mt-1 space-y-1">
                                            <li>Cloudflare Dashboard &gt; Turnstile &gt; Add Site</li>
                                            <li>Label: Site Adınız</li>
                                            <li>Domain: {typeof window !== 'undefined' ? window.location.hostname : 'fithub.com'}</li>
                                            <li>Widget Mode: Managed (Önerilen)</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className="border-t pt-6 mt-6">
                                    <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        Kurulumu Test Et
                                    </h3>
                                    
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <div className="md:col-span-2 space-y-4">
                                            <p className="text-sm text-muted-foreground">
                                                Aşağıdaki Turnstile kutusunu işaretleyerek API anahtarlarınızın doğru çalışıp çalışmadığını test edebilirsiniz.
                                            </p>
                                            
                                            {captchaSiteKey && (
                                                <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center min-h-[100px]">
                                                    <Turnstile 
                                                        siteKey={captchaSiteKey} 
                                                        onSuccess={token => setCaptchaTestToken(token)}
                                                        onError={() => toast.error("Captcha yüklenemedi. Site Key'i kontrol edin.")}
                                                        options={{
                                                            theme: 'auto',
                                                            size: 'normal',
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <Button 
                                                type="button" 
                                                variant="secondary"
                                                className="w-full"
                                                disabled={!captchaTestToken || verifyingCaptcha}
                                                onClick={handleCaptchaVerifyTest}
                                            >
                                                {verifyingCaptcha ? (
                                                    "Doğrulanıyor..." 
                                                ) : ( 
                                                    <>
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        Token&apos;ı Sunucuda Doğrula
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                        
                    </form>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-secondary/10 py-4">
                    <Button type="button" variant="outline" onClick={loadSettings}>Vazgeç</Button>
                    <Button type="submit" form="captcha-form" disabled={saving}>
                        {saving ? (
                            "Kaydediliyor..."
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Ayarları Kaydet
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>

        <TabsContent value="general">
             <Card>
                <CardHeader>
                    <CardTitle>Genel Ayarlar</CardTitle>
                    <CardDescription>Sistem genelindeki diğer yapılandırmalar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Yakında eklenecek...</p>
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
