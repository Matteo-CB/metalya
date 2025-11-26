"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { Resend } from "resend";
import { render } from "@react-email/render";
// Import depuis le fichier qui contient l'export (vérifie si c'est emails.tsx ou newsletter-template.tsx)
import { MetalyaNewsletter } from "@/components/emails";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// Utilitaire pour découper la liste d'abonnés (Batching)
function chunkArray<T>(array: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export async function sendNewsletterAction(formData: FormData) {
  // 1. Sécurité
  const session = await auth();
  if (session?.user?.role !== UserRole.ADMIN) throw new Error("Unauthorized");

  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  // 2. Récupération des abonnés
  const subscribers = await prisma.subscriber.findMany({
    where: { isActive: true },
    select: { email: true },
  });

  if (subscribers.length === 0)
    return { error: "Aucun abonné trouvé dans la base." };

  console.log(`🚀 Début envoi Metalya : ${subscribers.length} abonnés.`);

  try {
    // 3. Rendu HTML
    const emailHtml = await render(
      MetalyaNewsletter({
        subject,
        content,
        unsubscribeUrl: `${BASE_URL}/unsubscribe`,
      })
    );

    // 4. Envoi par paquets
    const BATCH_SIZE = 50;
    const batches = chunkArray(subscribers, BATCH_SIZE);
    let successCount = 0;
    let lastError = null; // Pour stocker la dernière erreur rencontrée

    for (const [index, batch] of batches.entries()) {
      const recipients = batch.map((s) => s.email);

      const { error } = await resend.emails.send({
        // IMPORTANT : Ton domaine doit être "Verified" sur Resend pour que ça marche
        from: "Metalya <newsletter@metalya.fr>",
        bcc: recipients,
        to: "matteo.biyikli3224@gmail.com", // Copie admin (obligatoire car 'to' ne peut être vide)
        subject: subject,
        html: emailHtml,
        replyTo: "contact@metalya.fr",
      });

      if (error) {
        console.error(`❌ Erreur paquet ${index + 1}:`, error);
        lastError = error.message; // On capture l'erreur
        continue; // On passe au paquet suivant
      }

      // Si pas d'erreur, on compte les succès (sauf l'admin)
      successCount += recipients.length;
      console.log(`✅ Paquet ${index + 1}/${batches.length} envoyé.`);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // 5. Rapport final intelligent
    if (successCount === 0 && lastError) {
      // Si aucun mail n'est parti, on renvoie l'erreur à l'interface
      return { error: `Échec total de l'envoi. Erreur Resend : ${lastError}` };
    }

    if (successCount < subscribers.length && lastError) {
      return {
        success: `Envoyé partiellement à ${successCount} lecteurs. Erreur sur certains paquets : ${lastError}`,
      };
    }

    return {
      success: `Newsletter envoyée avec succès à ${successCount} lecteurs !`,
    };
  } catch (error) {
    console.error("❌ Erreur Critique :", error);
    return { error: "Erreur technique grave lors de l'envoi." };
  }
}
