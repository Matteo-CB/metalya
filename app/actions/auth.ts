"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LoginSchema, RegisterSchema } from "@/lib/schemas";
import { UserRole } from "@prisma/client";

// Liste des emails administrateurs autorisés
const adminEmails = [
  "matteo.biyikli3224@gmail.com",
  "Daiki.ajwad@gmail.com",
  "matteochantebiyikli@gmail.com",
];

// --- INSCRIPTION ---
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

  // LOGIQUE ADMIN STRICTE : Vérifie si l'email est dans la liste
  const isAdmin = adminEmails.includes(email);
  const role = isAdmin ? UserRole.ADMIN : UserRole.USER;

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // Mot de passe sécurisé
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
    // On ne bloque pas l'inscription si la newsletter échoue
    console.error("Erreur ajout newsletter", e);
  }
  return { success: "Compte créé ! Vous pouvez vous connecter." };
}

// --- CONNEXION ---
export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Champs invalides." };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      // Redirection vers l'admin si l'email est dans la liste des admins
      redirectTo: adminEmails.includes(email) ? "/admin/create" : "/",
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
    throw error; // Nécessaire pour la redirection Next.js
  }
}
