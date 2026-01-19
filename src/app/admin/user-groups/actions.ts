"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
export type PermissionData = {
  id: string
  action: string
  subject: string
  description: string | null
}

export type UserGroupData = {
  id: string
  name: string
  description: string | null
  createdAt: Date
  permissions: PermissionData[]
  _count: {
    admins: number
  }
}

// -----------------------------------------------------------------------------
// PERMISSION SEEDING
// -----------------------------------------------------------------------------
const DEFAULT_PERMISSIONS = [
  // User Management
  { action: "read", subject: "users", description: "Kullanıcıları görüntüleme" },
  { action: "create", subject: "users", description: "Kullanıcı oluşturma" },
  { action: "update", subject: "users", description: "Kullanıcı düzenleme" },
  { action: "delete", subject: "users", description: "Kullanıcı silme" },
  
  // User Groups
  { action: "read", subject: "user_groups", description: "Grupları görüntüleme" },
  { action: "manage", subject: "user_groups", description: "Grupları yönetme" },

  // Trainers
  { action: "read", subject: "trainers", description: "Eğitmenleri görüntüleme" },
  { action: "approve", subject: "trainers", description: "Eğitmen başvurularını onaylama" },
  
  // Settings
  { action: "read", subject: "settings", description: "Ayarları görüntüleme" },
  { action: "update", subject: "settings", description: "Ayarları değiştirme" },
]

export async function seedPermissions() {
  try {
    const existingCount = await prisma.permission.count()
    if (existingCount > 0) return { success: true, message: "Permissions already seeded." }

    console.log("Seeding permissions...")
    for (const perm of DEFAULT_PERMISSIONS) {
      await prisma.permission.upsert({
        where: {
          action_subject: {
            action: perm.action,
            subject: perm.subject
          }
        },
        update: {},
        create: perm
      })
    }
    return { success: true, message: "Permissions seeded successfully." }
  } catch (error) {
    console.error("Seeding failed:", error)
    return { success: false, error: "Yetkiler oluşturulamadı." }
  }
}

// -----------------------------------------------------------------------------
// READ
// -----------------------------------------------------------------------------

export async function getAllPermissions() {
  try {
    await seedPermissions() // Ensure permissions exist when we try to fetch them
    const permissions = await prisma.permission.findMany({
      orderBy: [{ subject: "asc" }, { action: "asc" }]
    })
    return { success: true, data: permissions }
  } catch (error) {
    console.error("Fetch permissions error:", error)
    return { success: false, error: "Yetkiler yüklenemedi." }
  }
}

export async function getUserGroups() {
  try {
    const groups = await prisma.userGroup.findMany({
      include: {
        permissions: true,
        _count: {
          select: { admins: true }
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

// -----------------------------------------------------------------------------
// CREATE
// -----------------------------------------------------------------------------
export async function createUserGroup(data: any) {
  try {
    const { name, description, permissionIds } = data

    if (!name) return { success: false, error: "Grup adı zorunludur." }

    const newGroup = await prisma.userGroup.create({
      data: {
        name,
        description,
        permissions: {
            connect: permissionIds?.map((id: string) => ({ id })) || []
        }
      }
    })

    revalidatePath("/admin/user-groups")
    return { success: true, data: newGroup }
  } catch (error: any) {
    if (error.code === 'P2002') {
       return { success: false, error: "Bu isimde bir grup zaten var." }
    }
    console.error("Create group error:", error)
    return { success: false, error: "Grup oluşturulurken hata oluştu." }
  }
}

// -----------------------------------------------------------------------------
// UPDATE
// -----------------------------------------------------------------------------
export async function updateUserGroup(id: string, data: any) {
  try {
    const { name, description, permissionIds } = data
    
    // Using set to replace all permissions with the new list
    await prisma.userGroup.update({
        where: { id },
        data: {
            name,
            description,
            permissions: {
                set: permissionIds?.map((id: string) => ({ id })) || []
            }
        }
    })

    revalidatePath("/admin/user-groups")
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
        return { success: false, error: "Bu isimde bir grup zaten var." }
     }
    console.error("Update group error:", error)
    return { success: false, error: "Güncelleme başarısız." }
  }
}

// -----------------------------------------------------------------------------
// DELETE
// -----------------------------------------------------------------------------
export async function deleteUserGroup(id: string) {
  try {
    await prisma.userGroup.delete({ where: { id } })
    revalidatePath("/admin/user-groups")
    return { success: true }
  } catch (error) {
    console.error("Delete group error:", error)
    return { success: false, error: "Silme işlemi başarısız." }
  }
}
