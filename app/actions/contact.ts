"use server";

import { ContactSchema, ContactInput } from "@/lib/schemas";
import { Resend } from "resend";
import { ContactEmail } from "@/components/emails/contact-template";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(values: ContactInput) {
  const validatedFields = ContactSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Formulaire invalide." };
  }

  const { name, email, subject, message } = validatedFields.data;

  try {
    const emailHtml = await render(
      ContactEmail({ name, email, subject, message })
    );

    await resend.emails.send({
      // On envoie DEPUIS ton domaine (le serveur)
      from: "Metalya Contact <contact@metalya.fr>",
      // VERS ta boîte de réception
      to: "contact@metalya.fr",
      // Avec l'email de l'utilisateur en Reply-To pour répondre facilement
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: emailHtml,
    });

    return { success: "Message envoyé avec succès !" };
  } catch (error) {
    console.error("Contact Error:", error);
    return { error: "Erreur lors de l'envoi du message." };
  }
}
