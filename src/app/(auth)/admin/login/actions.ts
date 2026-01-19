"use server"

import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_key_2026")

// Mock function until SMS/Email provider is integrated
// In production, this would send a real code to the user's phone/email and store it in Redis/DB
async function send2FACode(adminId: string, method: 'email' | 'phone') {
    console.log(`Sending 2FA code to admin ${adminId} via ${method}. Code: 123456`)
    return true
}

export async function verifyAdminCredentials(identifier: string, password: string) {
  try {
    // 1. Determine if email or phone
    const isEmail = identifier.includes('@')
    let admin;

    if (isEmail) {
      admin = await prisma.admin.findUnique({ where: { email: identifier } })
    } else {
      // Clean phone number (remove spaces, parens)
      const cleanPhone = identifier.replace(/\D/g, '')
      // Try to find by phone - assuming phone is stored with or without country code. 
      // For now, simple exact match or contained
      admin = await prisma.admin.findUnique({ where: { phone: cleanPhone } })
    }

    if (!admin) {
      return { success: false, error: "Kullanıcı bulunamadı." }
    }

    if (admin.status !== "ACTIVE") {
      return { success: false, error: "Hesabınız aktif değil." }
    }

    const isMatch = await compare(password, admin.passwordHash)

    if (!isMatch) {
      return { success: false, error: "Hatalı şifre." }
    }

    // 2. Check 2FA Status
    if (admin.twoFactorEnabled) {
        // Send Code
        await send2FACode(admin.id, 'email') // Defaulting to email for now or check preference

        // Set Temporary Session for 2FA Verification
        const tempToken = await new SignJWT({
            sub: admin.id,
            partial: true
        })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('5m') // 5 minutes to enter code
        .sign(SECRET_KEY)

        const cookieStore = await cookies()
        cookieStore.set("admin_2fa_temp", tempToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 300 
        })

        return { success: true, requires2FA: true }
    }

    // 3. Login Success (No 2FA)
    await createSession(admin)
    return { success: true, requires2FA: false }

  } catch (error: any) {
    console.error("Login Check Error:", error)
    return { success: false, error: "Sistem hatası: " + (error.message || "Bilinmeyen hata") }
  }
}

export async function verify2FACode(code: string) {
    try {
        const cookieStore = await cookies()
        const tempToken = cookieStore.get("admin_2fa_temp")?.value

        if (!tempToken) {
            return { success: false, error: "Oturum süresi doldu. Tekrar giriş yapın." }
        }

        const { payload } = await jwtVerify(tempToken, SECRET_KEY)
        const adminId = payload.sub as string

        // Verify Code (Mock: 123456)
        if (code !== "123456") {
            return { success: false, error: "Hatalı doğrulama kodu." }
        }

        // Get Admin
        const admin = await prisma.admin.findUnique({ where: { id: adminId } })
        if (!admin) return { success: false, error: "Admin bulunamadı." }

        // Create Real Session
        await createSession(admin)
        
        // Clear Temp Cookie
        cookieStore.delete("admin_2fa_temp")

        return { success: true }

    } catch (error) {
        return { success: false, error: "Doğrulama başarısız." }
    }
}

async function createSession(admin: any) {
    const token = await new SignJWT({
        sub: admin.id,
        email: admin.email,
        role: admin.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET_KEY)

    const cookieStore = await cookies()
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24
    })
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  cookieStore.delete("admin_2fa_temp")
  return { success: true }
}
