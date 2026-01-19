"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type CardioUnitData = {
  id: string
  name: string
  description: string | null
  metValue: number | null
  defaultDuration: number | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export async function getCardioUnits() {
  try {
    const units = await prisma.cardioUnit.findMany({
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: units }
  } catch (error) {
    console.error("Failed to fetch cardio units:", error)
    return { success: false, error: "Veriler yüklenirken bir hata oluştu." }
  }
}

export async function createCardioUnit(data: {
  name: string
  description?: string
  metValue?: number
  defaultDuration?: number
}) {
  try {
    const newUnit = await prisma.cardioUnit.create({
      data: {
        name: data.name,
        description: data.description,
        metValue: data.metValue,
        defaultDuration: data.defaultDuration,
      },
    })
    revalidatePath("/admin/cardio-units")
    return { success: true, data: newUnit }
  } catch (error) {
    console.error("Failed to create cardio unit:", error)
    return { success: false, error: "Kayıt oluşturulurken bir hata oluştu." }
  }
}

export async function deleteCardioUnit(id: string) {
  try {
    await prisma.cardioUnit.delete({
      where: { id },
    })
    revalidatePath("/admin/cardio-units")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete cardio unit:", error)
    return { success: false, error: "Silme işlemi başarısız oldu." }
  }
}
