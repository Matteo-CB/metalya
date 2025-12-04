"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NewsletterStatus, UserRole } from "@prisma/client";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { MetalyaNewsletter } from "@/components/emails";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

function chunkArray<T>(array: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export async function createCampaign(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const action = formData.get("action") as string;

  let status: NewsletterStatus = NewsletterStatus.DRAFT;

  if (action === "submit") {
    if (session.user.role === UserRole.REDACTEUR) {
      status = NewsletterStatus.PENDING;
    } else {
      status = NewsletterStatus.DRAFT;
    }
  }

  await prisma.newsletter.create({
    data: {
      subject,
      content,
      status,
      authorId: session.user.id!,
    },
  });

  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter");
}

export async function updateCampaign(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await prisma.newsletter.findUnique({ where: { id } });
  if (!existing) throw new Error("Introuvable");

  const isOwner = existing.authorId === session.user.id;
  const isAdmin =
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.SUPER_ADMIN;

  // Sécurité : Seul l'auteur (rédacteur) ou un admin peut modifier
  if (!isAdmin && !isOwner) throw new Error("Interdit");
  if (existing.status === NewsletterStatus.SENT)
    throw new Error("Impossible de modifier une campagne envoyée");

  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const action = formData.get("action") as string;

  let status: NewsletterStatus = existing.status;

  if (action === "draft") {
    status = NewsletterStatus.DRAFT;
  } else if (action === "submit") {
    if (session.user.role === UserRole.REDACTEUR) {
      status = NewsletterStatus.PENDING;
    } else {
      status = NewsletterStatus.DRAFT;
    }
  }

  await prisma.newsletter.update({
    where: { id },
    data: {
      subject,
      content,
      status,
    },
  });

  revalidatePath("/admin/newsletter");
  redirect("/admin/newsletter");
}

export async function updateNewsletterStatus(
  id: string,
  status: NewsletterStatus
) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== UserRole.ADMIN &&
      session.user.role !== UserRole.SUPER_ADMIN)
  ) {
    return { error: "Non autorisé." };
  }

  try {
    await prisma.newsletter.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/newsletter");
    return { success: "Statut mis à jour." };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour." };
  }
}

export async function deleteCampaign(id: string) {
  const session = await auth();
  if (!session?.user) return;

  const newsletter = await prisma.newsletter.findUnique({ where: { id } });
  if (!newsletter) return;

  const isOwner = newsletter.authorId === session.user.id;
  const isAdmin =
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.SUPER_ADMIN;

  if (!isAdmin && (!isOwner || newsletter.status === NewsletterStatus.SENT)) {
    throw new Error("Interdit");
  }

  await prisma.newsletter.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}

export async function sendCampaign(id: string) {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== UserRole.ADMIN &&
      session.user.role !== UserRole.SUPER_ADMIN)
  ) {
    return { error: "Seuls les admins peuvent envoyer." };
  }

  const newsletter = await prisma.newsletter.findUnique({ where: { id } });
  if (!newsletter) return { error: "Newsletter introuvable." };
  if (newsletter.status === NewsletterStatus.SENT)
    return { error: "Déjà envoyée." };

  const subscribers = await prisma.subscriber.findMany({
    where: { isActive: true },
    select: { email: true },
  });

  if (subscribers.length === 0) return { error: "Aucun abonné." };

  try {
    const emailHtml = await render(
      MetalyaNewsletter({
        subject: newsletter.subject,
        content: newsletter.content,
        unsubscribeUrl: `${BASE_URL}/unsubscribe`,
      })
    );

    const batches = chunkArray(subscribers, 50);
    let successCount = 0;

    for (const batch of batches) {
      const recipients = batch.map((s) => s.email);
      const { error } = await resend.emails.send({
        from: "Metalya <newsletter@metalya.fr>",
        bcc: recipients,
        to: "matteo.biyikli3224@gmail.com",
        subject: newsletter.subject,
        html: emailHtml,
        replyTo: "contact@metalya.fr",
      });

      if (!error) successCount += recipients.length;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    await prisma.newsletter.update({
      where: { id },
      data: {
        status: NewsletterStatus.SENT,
        sentAt: new Date(),
      },
    });

    revalidatePath("/admin/newsletter");
    return { success: `Envoyé à ${successCount} abonnés.` };
  } catch (error) {
    console.error(error);
    return { error: "Erreur technique lors de l'envoi." };
  }
}
