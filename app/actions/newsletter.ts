"use server";

import { prisma } from "@/lib/prisma";
import { NewsletterSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;

  const validated = NewsletterSchema.safeParse({ email });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    await prisma.subscriber.upsert({
      where: { email: validated.data.email },
      update: { isActive: true },
      create: { email: validated.data.email },
    });

    revalidatePath("/");
    return { success: "Inscription réussie ! Bienvenue dans le club." };
  } catch (error) {
    console.error("Erreur inscription newsletter:", error);
    return { error: "Une erreur est survenue. Réessayez plus tard." };
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
