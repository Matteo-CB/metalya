"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const EmailSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email");

  const result = EmailSchema.safeParse({ email });

  if (!result.success) {
    // CORRECTION ICI : on utilise .issues au lieu de .errors
    return { error: result.error.issues[0].message };
  }

  try {
    await prisma.subscriber.upsert({
      where: { email: result.data.email },
      update: { isActive: true },
      create: { email: result.data.email },
    });

    revalidatePath("/");
    return { success: "Merci ! Vous êtes inscrit." };
  } catch (error) {
    console.error(error); // Bon pour le debug
    return { error: "Une erreur est survenue." };
  }
}

export async function unsubscribeAction(subscriberId: string) {
  try {
    await prisma.subscriber.delete({
      where: { id: subscriberId },
    });
    return { success: "Vous avez été désabonné avec succès." };
  } catch (error) {
    return { error: "Impossible de vous désabonner ou compte introuvable." };
  }
}
