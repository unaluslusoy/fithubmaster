"use server"

import { uploadToR2 } from "@/lib/storage"

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "Dosya bulunamadı." }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to R2 with "profile-images" folder
    const result = await uploadToR2(buffer, file.name, file.type, "profile-images")
    
    if (result.success) {
        return { success: true, url: result.url }
    } else {
        return { success: false, error: result.error }
    }
  } catch (error) {
    console.error("Upload error:", error)
    return { success: false, error: "Dosya yüklenirken bir hata oluştu." }
  }
}
