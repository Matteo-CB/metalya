"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LoginSchema, RegisterSchema } from "@/lib/schemas";
import { UserRole } from "@prisma/client";

// Configuration des emails privilégiés
const SUPER_ADMIN_EMAILS = ["matteo.biyikli3224@gmail.com"];
const ADMIN_EMAILS = ["daiki.ajwad@gmail.com"]; // Rétablissement de l'autre admin

export async function registerAction(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Champs invalides." };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Cet email est déjà utilisé." };
  }

  // Logique d'attribution des rôles
  let role: UserRole = UserRole.USER;

  if (SUPER_ADMIN_EMAILS.includes(email)) {
    role = UserRole.SUPER_ADMIN;
  } else if (ADMIN_EMAILS.includes(email)) {
    role = UserRole.ADMIN;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  try {
    await prisma.subscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });
  } catch (e) {
    console.error("Erreur ajout newsletter", e);
  }
  return { success: "Compte créé ! Vous pouvez vous connecter." };
}

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Champs invalides." };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    const isStaff =
      user &&
      (user.role === UserRole.ADMIN ||
        user.role === UserRole.SUPER_ADMIN ||
        user.role === UserRole.REDACTEUR);

    await signIn("credentials", {
      email,
      password,
      redirectTo: isStaff ? "/admin/posts" : "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Identifiants incorrects." };
        default:
          return { error: "Une erreur est survenue." };
      }
    }
    throw error;
  }
}
