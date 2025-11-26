"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { Resend } from "resend";
import { render } from "@react-email/render";
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
  // 1. Sécurité : Seul l'admin peut envoyer
  const session = await auth();
  if (session?.user?.role !== UserRole.ADMIN) throw new Error("Unauthorized");

  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  // 2. Récupération des abonnés actifs
  const subscribers = await prisma.subscriber.findMany({
    where: { isActive: true },
  });

  if (subscribers.length === 0) return { error: "Aucun abonné trouvé." };

  console.log(
    `🚀 Début envoi Metalya : ${subscribers.length} abonnés à traiter.`
  );

  try {
    // 3. Stratégie d'envoi par paquets (Batching)
    // Resend recommande des paquets de 50 destinataires max en Bcc
    const BATCH_SIZE = 50;
    const batches = chunkArray(subscribers, BATCH_SIZE);
    let successCount = 0;

    // On boucle sur chaque paquet
    for (const [index, batch] of batches.entries()) {
      // Pour ce lot, on génère un tableau d'adresses
      const recipients = batch.map((s) => s.email);

      // Rendu du HTML (Note: Pour du BCC de masse, le lien unsubscribe doit être générique
      // ou géré via un header de désabonnement, car ici le HTML est le même pour les 50).
      // Si tu veux un lien 100% unique par personne, il faut faire une boucle unitaire (plus lent).
      // Ici, on garde l'approche de masse pour la performance.
      const emailHtml = await render(
        MetalyaNewsletter({
          subject,
          content,
          // Lien générique vers la page de gestion (l'utilisateur entrera son mail pour se désinscrire)
          // Ou lien direct si envoi unitaire. Ici version de masse :
          unsubscribeUrl: `${BASE_URL}/unsubscribe`,
        })
      );

      const { error } = await resend.emails.send({
        // L'adresse d'envoi PRO (Doit être validée sur Resend)
        from: "Metalya <newsletter@metalya.fr>",
        // On utilise BCC pour la confidentialité
        bcc: recipients,
        // On s'envoie une copie à nous-même pour vérifier et satisfaire le champ 'to'
        to: "matteo.biyikli3224@gmail.com",
        subject: subject,
        html: emailHtml,
        replyTo: "matteo.biyikli3224@gmail.com",
      });

      if (error) {
        console.error(`❌ Erreur paquet ${index + 1}:`, error);
        // On continue les autres paquets même si un échoue
        continue;
      }

      successCount += recipients.length;
      console.log(
        `✅ Paquet ${index + 1}/${batches.length} envoyé (${
          recipients.length
        } mails)`
      );

      // Petite pause pour respecter les limites de taux (Rate Limiting)
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return {
      success: `Newsletter envoyée avec succès à ${successCount} lecteurs !`,
    };
  } catch (error) {
    console.error("❌ Erreur Critique :", error);
    return { error: "Erreur technique lors de l'envoi de masse." };
  }
}
