"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import nodemailer from "nodemailer"

export async function getSystemSettings() {
  const settings = await prisma.systemSetting.findMany()
  const config: Record<string, string> = {}
  settings.forEach(s => {
    config[s.key] = s.value
  })
  return config
}

export async function saveSmtpSettings(formData: FormData) {
  const host = formData.get("host") as string
  const port = formData.get("port") as string
  const user = formData.get("user") as string
  const pass = formData.get("pass") as string
  const from = formData.get("from") as string
  const secure = formData.get("secure") === "on" ? "true" : "false"

  try {
    const settings = [
      { key: "smtp_host", value: host },
      { key: "smtp_port", value: port },
      { key: "smtp_user", value: user },
      { key: "smtp_pass", value: pass },
      { key: "smtp_from", value: from },
      { key: "smtp_secure", value: secure },
    ]

    for (const setting of settings) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value }
      })
    }

    revalidatePath("/admin/settings")
    return { success: true, message: "Ayarlar başarıyla kaydedildi." }
  } catch (error) {
    console.error("Save Settings Error:", error)
    return { success: false, error: "Ayarlar kaydedilirken bir hata oluştu." }
  }
}

export async function sendTestEmail(email: string) {
  try {
    const config = await getSystemSettings()
    
    if (!config.smtp_host || !config.smtp_user || !config.smtp_pass) {
        return { success: false, error: "SMTP ayarları eksik." }
    }

    const transporter = nodemailer.createTransport({
      host: config.smtp_host,
      port: parseInt(config.smtp_port || "465"),
      secure: config.smtp_secure === "true",
      auth: {
        user: config.smtp_user,
        pass: config.smtp_pass,
      },
    })

    await transporter.sendMail({
      from: `"${config.smtp_from_name || 'FitHub System'}" <${config.smtp_from || config.smtp_user}>`,
      to: email,
      subject: "Test E-postası - FitHub",
      text: "Bu bir test e-postasıdır. SMTP ayarlarınız başarıyla yapılandırıldı.",
      html: "<b>Bu bir test e-postasıdır.</b> SMTP ayarlarınız başarıyla yapılandırıldı."
    })

    return { success: true, message: "Test e-postası gönderildi." }
  } catch (error: any) {
    console.error("Email Error:", error)
    return { success: false, error: "E-posta gönderilemedi: " + error.message }
  }
}

export async function saveCloudflareSettings(formData: FormData) {
  const accountId = formData.get("cf_account_id") as string
  const accessKeyId = formData.get("cf_access_key_id") as string
  const secretAccessKey = formData.get("cf_secret_access_key") as string
  const bucketName = formData.get("cf_bucket_name") as string
  const publicUrl = formData.get("cf_public_url") as string

  try {
    const settings = [
      { key: "cf_account_id", value: accountId },
      { key: "cf_access_key_id", value: accessKeyId },
      { key: "cf_secret_access_key", value: secretAccessKey },
      { key: "cf_bucket_name", value: bucketName },
      { key: "cf_public_url", value: publicUrl },
    ]

    for (const setting of settings) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value }
      })
    }

    revalidatePath("/admin/settings")
    return { success: true, message: "Cloudflare ayarları başarıyla kaydedildi." }
  } catch (error) {
    console.error("Save Cloudflare Settings Error:", error)
    return { success: false, error: "Cloudflare ayarları kaydedilirken bir hata oluştu." }
  }
}

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3"

export async function testCloudflareR2(formData: FormData) {
    const accountId = formData.get("cf_account_id") as string
    const accessKeyId = formData.get("cf_access_key_id") as string
    const secretAccessKey = formData.get("cf_secret_access_key") as string
    const bucketName = formData.get("cf_bucket_name") as string

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
        return { success: false, error: "Lütfen tüm R2 alanlarını doldurunuz." }
    }

    try {
        const client = new S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        })

        // Try to list objects (lightweight operation to verify auth and bucket existence)
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            MaxKeys: 1
        })

        await client.send(command)

        return { success: true, message: "Cloudflare R2 bağlantısı başarılı!" }

    } catch (error: any) {
        console.error("R2 Test Error:", error)
        return { success: false, error: "Bağlantı hatası: " + (error.message || error) }
    }
}

export async function saveCloudflareGeneralSettings(formData: FormData) {
  const apiKey = formData.get("cf_api_key") as string
  const email = formData.get("cf_email") as string
  const zoneId = formData.get("cf_zone_id") as string

  try {
    const settings = [
      { key: "cf_api_key", value: apiKey },
      { key: "cf_email", value: email },
      { key: "cf_zone_id", value: zoneId },
    ]

    for (const setting of settings) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value }
      })
    }

    revalidatePath("/admin/settings")
    return { success: true, message: "Cloudflare genel ayarları kaydedildi." }
  } catch (error) {
    return { success: false, error: "Kaydedilemedi: " + error }
  }
}

// Helper for Cloudflare API with explicit credentials (for setup/discovery)
export async function getCloudflareZones(apiKey: string, email: string) {
    if (!apiKey || !email) return { success: false, error: "API Key ve Email gerekli." }
    
    try {
        const response = await fetch("https://api.cloudflare.com/client/v4/zones?per_page=50", {
            method: "GET",
            headers: {
                "X-Auth-Email": email,
                "X-Auth-Key": apiKey,
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        
        if (data.success) {
            return { 
                success: true, 
                zones: data.result.map((z: any) => ({ 
                    id: z.id, 
                    name: z.name, 
                    status: z.status,
                    plan: z.plan?.name
                })) 
            }
        }
        return { success: false, error: data.errors?.[0]?.message || "Zone listesi alınamadı." }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Helper for Cloudflare API using saved settings
async function cfRequest(endpoint: string, method: string = "GET", body: any = null) {
    const config = await getSystemSettings()
    
    const apiKey = config.cf_api_key
    const email = config.cf_email
    const zoneId = config.cf_zone_id

    if (!apiKey || !email || !zoneId) {
        throw new Error("Cloudflare API bilgileri (Email, Key, Zone ID) eksik.")
    }

    const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/${endpoint}`
    
    const headers: Record<string, string> = {
        "X-Auth-Email": email,
        "X-Auth-Key": apiKey,
        "Content-Type": "application/json"
    }

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            cache: 'no-store'
        })
        
        return await response.json()
    } catch(e) {
        throw new Error("Network error during fetch")
    }
}

export async function getCloudflareDnsRecords() {
    try {
        const res = await cfRequest("dns_records?per_page=100")
        if (res.success) {
            return { success: true, records: res.result }
        }
        return { success: false, error: res.errors?.[0]?.message }
    } catch(e: any) {
        return { success: false, error: e.message }
    }
}

export async function addCloudflareDnsRecord(formData: FormData) {
    const type = formData.get("type") as string
    const name = formData.get("name") as string
    const content = formData.get("content") as string
    const proxied = formData.get("proxied") === "true"

    try {
        const res = await cfRequest("dns_records", "POST", { type, name, content, proxied })
        if (res.success) {
            revalidatePath("/admin/settings")
            return { success: true, message: "DNS kaydı oluşturuldu." }
        }
        return { success: false, error: res.errors?.[0]?.message }
    } catch(e: any) {
        return { success: false, error: e.message }
    }
}

export async function deleteCloudflareDnsRecord(recordId: string) {
    try {
        const res = await cfRequest(`dns_records/${recordId}`, "DELETE")
        if (res.success) {
            revalidatePath("/admin/settings")
            return { success: true, message: "DNS kaydı silindi." }
        }
        return { success: false, error: res.errors?.[0]?.message }
    } catch(e: any) {
        return { success: false, error: e.message }
    }
}

export async function getCloudflareZoneStatus() {
    try {
        const [
            sslRes, secRes, devRes, cacheRes, minRes, rocketRes, brotliRes,
            httpsRes, rewritesRes, ipv6Res, http3Res, zerorttRes
        ] = await Promise.all([
            cfRequest("settings/ssl"),
            cfRequest("settings/security_level"),
            cfRequest("settings/development_mode"),
            cfRequest("settings/browser_cache_ttl"),
            cfRequest("settings/minify"),
            cfRequest("settings/rocket_loader"),
            cfRequest("settings/brotli"),
            cfRequest("settings/always_use_https"),
            cfRequest("settings/automatic_https_rewrites"),
            cfRequest("settings/ipv6"),
            cfRequest("settings/http3"),
            cfRequest("settings/0rtt")
        ])

        return {
            success: true,
            data: {
                ssl: sslRes.result?.value || "unknown",
                securityLevel: secRes.result?.value || "unknown",
                devMode: devRes.result?.value || "off",
                browserCache: cacheRes.result?.value || 0,
                minify: minRes.result?.value || { js: "off", css: "off", html: "off" },
                rocketLoader: rocketRes.result?.value || "off",
                brotli: brotliRes.result?.value || "off",
                alwaysUseHttps: httpsRes.result?.value || "off",
                automaticHttpsRewrites: rewritesRes.result?.value || "off",
                ipv6: ipv6Res.result?.value || "off",
                http3: http3Res.result?.value || "off",
                zeroRtt: zerorttRes.result?.value || "off"
            }
        }
    } catch (error: any) {
        console.error("CF Status Error:", error)
        return { success: false, error: error.message }
    }
}

export async function updateCloudflareSetting(settingId: string, value: any) {
    try {
        const result = await cfRequest(`settings/${settingId}`, "PATCH", { value })
        if (result.success) {
            revalidatePath("/admin/settings")
            return { success: true, message: "Ayar başarıyla güncellendi." }
        }
        return { success: false, error: result.errors?.[0]?.message || "Güncellenemedi." }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function purgeCloudflareCache() {
    try {
        const result = await cfRequest("purge_cache", "POST", { purge_everything: true })
        if (result.success) {
            return { success: true, message: "Tüm önbellek başarıyla temizlendi." }
        }
        return { success: false, error: result.errors?.[0]?.message }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function saveCaptchaSettings(formData: FormData) {
  // Always force Turnstile, ignore user selection if any
  const provider = "turnstile" 
  const siteKey = formData.get("captcha_site_key") as string
  const secretKey = formData.get("captcha_secret_key") as string
  const enabled = formData.get("captcha_enabled") === "on" ? "true" : "false"

  try {
    const settings = [
      { key: "captcha_provider", value: provider },
      { key: "captcha_site_key", value: siteKey },
      { key: "captcha_secret_key", value: secretKey },
      { key: "captcha_enabled", value: enabled },
    ]

    for (const setting of settings) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value }
      })
    }

    revalidatePath("/admin/settings")
    return { success: true, message: "Captcha ayarları kaydedildi. (Turnstile Modu)" }
  } catch (error) {
    return { success: false, error: "Kaydedilemedi: " + error }
  }
}

export async function verifyCaptchaToken(token: string) {
  try {
    const settings = await getSystemSettings()
    
    // If disabled, skip verification
    if (settings.captcha_enabled !== "true") {
        return { success: true }
    }

    const secretKey = settings.captcha_secret_key
    
    if (!secretKey) {
        // Misconfiguration
        console.error("Captcha enabled but no secret key found.")
        return { success: true } // Fail open or closed? Usually fail open if config error to not lock out admins.
    }

    let formData = new FormData()
    formData.append("secret", secretKey)
    formData.append("response", token)

    // Turnstile Only Verification
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

    const res = await fetch(url, {
        method: "POST",
        body: formData,
    })

    const data = await res.json()

    if (data.success) {
        return { success: true }
    } else {
        console.error("Turnstile Verification Failed:", data)
        return { success: false, error: "Güvenlik doğrulaması başarısız." }
    }

  } catch (error) {
    console.error("Captcha Verification Error:", error)
    return { success: false, error: "Doğrulama servisine erişilemedi." }
  }
}

export async function verifyCaptchaTest(token: string, secretKey: string) {
    try {
        if (!secretKey) return { success: false, error: "Secret Key eksik." }

        const formData = new FormData()
        formData.append("secret", secretKey)
        formData.append("response", token)

        const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        const res = await fetch(url, { method: "POST", body: formData })
        const data = await res.json()

        if (data.success) {
            return { success: true }
        } else {
            return { success: false, error: "Turnstile Error: " + JSON.stringify(data["error-codes"]) }
        }
    } catch (error) {
        return { success: false, error: "Sunucu hatası: " + error }
    }
}

export async function saveFirebaseSettings(formData: FormData) {
    try {
        const settings = [
            { key: "firebase_api_key", value: formData.get("firebase_api_key") as string },
            { key: "firebase_auth_domain", value: formData.get("firebase_auth_domain") as string },
            { key: "firebase_project_id", value: formData.get("firebase_project_id") as string },
            { key: "firebase_storage_bucket", value: formData.get("firebase_storage_bucket") as string },
            { key: "firebase_messaging_sender_id", value: formData.get("firebase_messaging_sender_id") as string },
            { key: "firebase_app_id", value: formData.get("firebase_app_id") as string },
            { key: "firebase_measurement_id", value: formData.get("firebase_measurement_id") as string },
            { key: "firebase_service_account", value: formData.get("firebase_service_account") as string },
            { key: "firebase_enable_auth", value: formData.get("firebase_enable_auth") === "on" ? "true" : "false" },
            { key: "firebase_enable_fcm", value: formData.get("firebase_enable_fcm") === "on" ? "true" : "false" },
        ]

        for (const setting of settings) {
             // Basic validation to avoid saving nulls for non-optional strings if needed, 
             // but here we just treat them as empty strings if missing
            await prisma.systemSetting.upsert({
                where: { key: setting.key },
                update: { value: setting.value || "" },
                create: { key: setting.key, value: setting.value || "" }
            })
        }
        
        revalidatePath("/admin/settings")
        return { success: true, message: "Firebase ayarları kaydedildi." }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}