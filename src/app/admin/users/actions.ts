"use server"

import prisma from "@/lib/prisma"
import { AdminRole, AccountStatus } from "@prisma/client"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"

// Unified User Type for UI
export type UserData = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  createdAt: Date
  userGroupId?: string | null
  userGroupName?: string | null
}

export async function getUserGroupOptions() {
  try {
     const groups = await prisma.userGroup.findMany({
         select: { id: true, name: true },
         orderBy: { name: "asc" }
     })
     return { success: true, data: groups }
  } catch (error) {
     return { success: false, data: [] }
  }
}

export async function seedTestGroups() {
    try {
        const testGroups = [
            { name: "Yönetici", description: "Tam yetkili sistem yöneticileri." },
            { name: "Kullanıcı", description: "Standart kullanıcı yetkileri." },
            { name: "Editör", description: "İçerik düzenleme yetkileri." }
        ]

        for (const group of testGroups) {
            await prisma.userGroup.upsert({
                where: { name: group.name },
                update: {},
                create: group
            })
        }
    } catch (error) {
        console.error("Failed to seed test groups", error)
    }
}

export async function getAdminUsers() {
  try {
    // Ensure test groups exist
    await seedTestGroups()

    // 1. Fetch Admins ONLY
    const admins = await prisma.admin.findMany({
      select: { 
          id: true, 
          firstName: true, 
          lastName: true, 
          email: true, 
          role: true, 
          status: true, 
          createdAt: true,
          userGroupId: true,
          userGroup: {
              select: { name: true }
          }
      },
      orderBy: { createdAt: "desc" }
    })

    // 2. Normalize
    const normalizedAdmins: UserData[] = admins.map(a => ({
      ...a,
      role: a.role, 
      status: a.status,
      userGroupId: a.userGroupId,
      userGroupName: a.userGroup?.name
    }))

    return { success: true, data: normalizedAdmins }
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return { success: false, error: "Kullanıcılar getirilemedi." }
  }
}

export async function createUser(data: any) {
  try {
    const { firstName, lastName, email, password, role, status, userGroupId } = data
    const hashedPassword = await hash(password, 10)

    // Only allow Admin creation
    if (!["SUPER_ADMIN", "EDITOR", "SUPPORT"].includes(role)) {
       return { success: false, error: "Bu panelden sadece yönetici oluşturulabilir." }
    }

    const newUser = await prisma.admin.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash: hashedPassword,
          role: role as AdminRole,
          status: status as AccountStatus,
          userGroupId: userGroupId || null
        }
    })

    revalidatePath("/admin/users")
    return { success: true, data: newUser }
  } catch (error) {
    console.error("Create User Error:", error)
    return { success: false, error: "Kullanıcı oluşturulurken hata oluştu." }
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const { firstName, lastName, email, status, role, userGroupId } = data

    // Only update Admin table
    await prisma.admin.update({
        where: { id },
        data: { 
            firstName, 
            lastName, 
            email, 
            status: status as AccountStatus, 
            role: role as AdminRole,
            userGroupId: userGroupId || null
        }
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Update User Error:", error)
    return { success: false, error: "Güncelleme başarısız." }
  }
}

export async function deleteUser(id: string) {
  try {
    // Only delete from Admin table
    await prisma.admin.delete({ where: { id } })
    
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
     console.error("Delete User Error:", error)
     return { success: false, error: "Silme işlemi başarısız." }
  }
}
