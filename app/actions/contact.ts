"use server";

import { ContactSchema, ContactInput } from "@/lib/schemas";
import { ContactEmail } from "@/components/emails/contact-template";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";

export async function sendContactMessage(values: ContactInput) {
  const validatedFields = ContactSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Formulaire invalide." };
  }

  const { name, email, subject, message } = validatedFields.data;

  try {
    // 1. Générer le HTML propre
    const emailHtml = await render(
      ContactEmail({ name, email, subject, message })
    );

    // 2. Configurer le transporteur One.com
    const transporter = nodemailer.createTransport({
      host: process.env.CONTACT_SMTP_HOST,
      port: Number(process.env.CONTACT_SMTP_PORT),
      secure: true, // Port 465 nécessite SSL
      auth: {
        user: process.env.CONTACT_SMTP_USER,
        pass: process.env.CONTACT_SMTP_PASS,
      },
    });

    // 3. Envoyer l'email
    await transporter.sendMail({
      from: `"Metalya Site" <${process.env.CONTACT_SMTP_USER}>`, // L'expéditeur DOIT être ton adresse One.com
      to: "contact@metalya.fr", // Tu te l'envoies à toi-même
      replyTo: email, // Pour répondre directement à l'utilisateur en cliquant sur "Répondre"
      subject: `[Contact Web] ${subject}`,
      html: emailHtml,
    });

    return { success: "Message envoyé avec succès !" };
  } catch (error) {
    console.error("Contact Error:", error);
    return { error: "Erreur technique lors de l'envoi." };
  }
}
