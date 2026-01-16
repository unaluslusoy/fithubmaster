"use server"

import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"

export async function getAdminUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })
    return { success: true, data: users }
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}
