import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth-service";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, role } = body;

    // Basic Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Missing required fields" } },
        { status: 400 }
      );
    }

    // Role Validation (prevent creating Super Admin via API publicly)
    const validRole = (role === "TRAINER" || role === "CLIENT") ? role : "CLIENT";

    const { prismaUser } = await AuthService.createUser({
      email,
      password,
      firstName,
      lastName,
      role: validRole as Role,
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: prismaUser.id,
          email: prismaUser.email,
          role: prismaUser.role,
        },
      },
      message: "User registered successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.error("Registration Error:", error);
    
    // Handle Firebase specific errors
    if (error.code?.startsWith("auth/")) {
      return NextResponse.json(
        { success: false, error: { code: error.code, message: error.message } },
        { status: 400 }
      );
    }
    
    // Handle Prisma specific errors (e.g., unique constraint)
    if (error.code === 'P2002') { // Unique constraint failed
       return NextResponse.json(
        { success: false, error: { code: "USER_EXISTS", message: "User with this email already exists." } },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } },
      { status: 500 }
    );
  }
}
