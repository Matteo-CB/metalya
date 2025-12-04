"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function sendMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const recipientIds = formData.getAll("recipients") as string[];

  if (!subject || !content || recipientIds.length === 0) {
    throw new Error("Champs manquants");
  }

  const message = await prisma.message.create({
    data: {
      subject,
      content,
      senderId: session.user.id!,
      recipients: {
        create: recipientIds.map((userId) => ({
          userId,
          isRead: false,
        })),
      },
    },
  });

  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}

export async function markAsRead(messageId: string) {
  const session = await auth();
  if (!session?.user) return;

  // On cherche l'entrée destinataire correspondante
  const recipientEntry = await prisma.messageRecipient.findFirst({
    where: {
      messageId: messageId,
      userId: session.user.id,
    },
  });

  if (recipientEntry && !recipientEntry.isRead) {
    await prisma.messageRecipient.update({
      where: { id: recipientEntry.id },
      data: { isRead: true, readAt: new Date() },
    });
    revalidatePath("/admin/messages");
  }
}

export async function deleteMessage(messageId: string) {
  // Pour l'instant, suppression simple (idéalement soft delete)
  const session = await auth();
  if (!session?.user) return;

  // Si c'est l'envoyeur, on supprime tout le message ?
  // Ou si c'est le receveur, on supprime son entrée ?
  // Simplification : Suppression de son entrée recipient

  const recipientEntry = await prisma.messageRecipient.findFirst({
    where: { messageId: messageId, userId: session.user.id },
  });

  if (recipientEntry) {
    await prisma.messageRecipient.delete({ where: { id: recipientEntry.id } });
  }

  revalidatePath("/admin/messages");
}
