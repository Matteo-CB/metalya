"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileSchema, ProfileInput } from "@/lib/schemas";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateProfile(values: ProfileInput) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Non autorisé." };
  }

  const validatedFields = ProfileSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Champs invalides." };
  }

  const { name, bio, image } = validatedFields.data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        ...(image && { image }),
      },
    });

    revalidatePath("/profile");
    revalidatePath(`/author/${session.user.id}`);

    return { success: "Profil mis à jour avec succès." };
  } catch (error) {
    return { error: "Une erreur est survenue lors de la mise à jour." };
  }
}

export async function updateUserRole(targetUserId: string, newRole: UserRole) {
  const session = await auth();

  if (session?.user?.role !== UserRole.SUPER_ADMIN) {
    return { error: "Seul le Super Admin peut modifier les rôles." };
  }

  try {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });
    revalidatePath("/admin/users");
    return { success: "Rôle mis à jour." };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour du rôle." };
  }
}
