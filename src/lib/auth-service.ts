import { auth } from "./firebase";
import prisma from "./prisma";
import { Role } from "@prisma/client";

export class AuthService {
  /**
   * Creates a user in Firebase and Prisma transactionally (logically).
   */
  static async createUser({
    email,
    password,
    firstName,
    lastName,
    role = "CLIENT",
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
  }) {
    // 1. Create in Firebase
    const firebaseUser = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    try {
      // 2. Create in Prisma
      const prismaUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          role,
          passwordHash: "FIREBASE_MANAGED", // We don't store password hash if using Firebase
          emailVerified: firebaseUser.emailVerified,
        },
      });

      // 3. Set custom claims in Firebase for Role Based Access Control
      await auth.setCustomUserClaims(firebaseUser.uid, {
        role,
        dbUserId: prismaUser.id,
      });

      return { firebaseUser, prismaUser };
    } catch (error) {
      // Rollback: Delete from Firebase if Prisma fails
      await auth.deleteUser(firebaseUser.uid);
      throw error;
    }
  }

  static async verifyIdToken(token: string) {
    return await auth.verifyIdToken(token);
  }
}
