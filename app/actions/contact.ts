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
    const emailHtml = await render(
      ContactEmail({ name, email, subject, message })
    );

    const transporter = nodemailer.createTransport({
      host: process.env.CONTACT_SMTP_HOST,
      port: Number(process.env.CONTACT_SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.CONTACT_SMTP_USER,
        pass: process.env.CONTACT_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Metalya Site" <${process.env.CONTACT_SMTP_USER}>`,
      to: "contact@metalya.fr",
      replyTo: email,
      subject: `[Contact Web] ${subject}`,
      html: emailHtml,
    });

    return { success: "Message envoyé avec succès !" };
  } catch (error) {
    console.error("Contact Error:", error);
    return { error: "Erreur technique lors de l'envoi." };
  }
}
