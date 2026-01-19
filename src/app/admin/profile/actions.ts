"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

import { hash, compare } from "bcryptjs"

// Not: Gerçek senaryoda burada oturum açmış kullanıcının ID'sini 
// session/token üzerinden almalıyız. Şimdilik demo amacıyla 
// sistemdeki ilk yöneticiyi veya belirli bir ID'yi çekiyoruz.
export async function getProfile() {
  try {
    // Öncelik 1: Ünal Uslusoy (Proje Sahibi/Ana Yönetici)
    let admin = await prisma.admin.findUnique({
      where: { email: "unaluslusoy@todestek.net" }
    })

    // Öncelik 2: Super Admin (Sistem Varsayılanı)
    if (!admin) {
      admin = await prisma.admin.findUnique({
        where: { email: "admin@fithubpoint.com" }
      })
    }

    // Öncelik 3: Herhangi bir ilk yönetici
    if (!admin) {
      admin = await prisma.admin.findFirst()
    }
    
    if (!admin) {
      return { success: false, error: "Yönetici profili bulunamadı." }
    }

    // Şifre hash'ini client'a gönderme
    const { passwordHash, ...safeAdmin } = admin
    return { success: true, data: safeAdmin }
  } catch (error) {
    console.error("Profile fetch error:", error)
    return { success: false, error: "Profil yüklenirken bir sorun oluştu." }
  }
}

export async function sendTwoFactorVerification(method: "EMAIL" | "PHONE", contactInfo: string) {
  // Demo: Gerçek bir SMS/E-posta servisi olmadığı için simüle ediyoruz.
  console.log(`Sending 2FA code to ${method} (${contactInfo})...`)
  
  // Burada Twilio, AWS SNS veya mail servisi çağrılır.
  // Test için kodumuz: 123456
  
  return { 
    success: true, 
    message: `${method === 'EMAIL' ? 'E-posta adresinize' : 'Telefonunuza'} doğrulama kodu gönderildi. (Test kodu: 123456)` 
  }
}

export async function verifyAndEnableTwoFactor(id: string, code: string, method: "EMAIL" | "PHONE") {
  try {
    // 1. Kodu Doğrula (Demo)
    if (code !== "123456") {
      return { success: false, error: "Geçersiz doğrulama kodu." }
    }

    // 2. DB'yi Güncelle
    await prisma.admin.update({
      where: { id },
      data: {
        twoFactorEnabled: true,
        twoFactorMethod: method
      }
    })

    return { success: true }
  } catch (error) {
    console.error("2FA enable error:", error)
    return { success: false, error: "İşlem sırasında bir hata oluştu." }
  }
}

export async function disableTwoFactor(id: string) {
  try {
    await prisma.admin.update({
      where: { id },
      data: {
        twoFactorEnabled: false,
        twoFactorMethod: null
      }
    })
    return { success: true }
  } catch (error) {
    console.error("2FA disable error:", error)
    return { success: false, error: "İşlem hatası." }
  }
}

export async function updateProfile(id: string, data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatarUrl?: string
}) {
  try {
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
      },
    })
    
    revalidatePath("/admin/profile")
    return { success: true, data: updatedAdmin }
  } catch (error) {
    console.error("Profile update error:", error)
    return { success: false, error: "Güncelleme başarısız oldu." }
  }
}

export async function changePassword(id: string, currentPass: string, newPass: string) {
  try {
    const admin = await prisma.admin.findUnique({ where: { id } })
    if (!admin) return { success: false, error: "Kullanıcı bulunamadı." }

    const isValid = await compare(currentPass, admin.passwordHash)
    if (!isValid) return { success: false, error: "Mevcut şifre hatalı." }

    const hashed = await hash(newPass, 10)
    await prisma.admin.update({
      where: { id },
      data: { passwordHash: hashed }
    })

    return { success: true, message: "Şifreniz başarıyla güncellendi." }
  } catch (error) {
    return { success: false, error: "Şifre değiştirilemedi." }
  }
}

