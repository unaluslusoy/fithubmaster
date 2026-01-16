"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const userGroupSchema = z.object({
  name: z.string().min(2, "Grup adı en az 2 karakter olmalıdır"),
  description: z.string().optional(),
})

export async function getUserGroups() {
  try {
    const groups = await prisma.userGroup.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return { success: true, data: groups }
  } catch (error) {
    console.error("Failed to fetch user groups:", error)
    return { success: false, error: "Gruplar yüklenirken hata oluştu." }
  }
}

export async function createUserGroup(prevState: any, formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  const validatedFields = userGroupSchema.safeParse({ name, description })

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.flatten().fieldErrors.name?.[0] || "Geçersiz veri." }
  }

  try {
    await prisma.userGroup.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
      }
    })
    revalidatePath("/admin/user-groups")
    return { success: true, message: "Kullanıcı grubu başarıyla oluşturuldu." }
  } catch (error: any) {
    if (error.code === 'P2002') {
       return { success: false, error: "Bu isimde bir grup zaten var." }
    }
    console.error("Failed to create group:", error)
    return { success: false, error: "Grup oluşturulurken hata oluştu." }
  }
}
