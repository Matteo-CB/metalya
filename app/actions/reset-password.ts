"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ForgotPasswordSchema, ResetPasswordSchema } from "@/lib/schemas";
import { ResetPasswordEmail } from "@/components/emails/reset-password-template";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export async function forgotPasswordAction(
  values: z.infer<typeof ForgotPasswordSchema>
) {
  const validated = ForgotPasswordSchema.safeParse(values);
  if (!validated.success) return { error: "Email invalide." };

  const { email } = validated.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) return { error: "Email introuvable." };

  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 heure

  await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });

  const resetLink = `${SITE_URL}/reset-password?token=${token}`;
  const emailHtml = await render(ResetPasswordEmail({ resetLink }));

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
    from: `"Metalya Sécurité" <${process.env.CONTACT_SMTP_USER}>`,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: emailHtml,
  });

  return { success: "Email envoyé ! Vérifiez votre boîte de réception." };
}

export async function resetPasswordAction(
  values: z.infer<typeof ResetPasswordSchema>,
  token: string | null
) {
  if (!token) return { error: "Token manquant." };

  const validated = ResetPasswordSchema.safeParse(values);
  if (!validated.success) return { error: "Champs invalides." };

  const { password } = validated.data;

  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!existingToken) return { error: "Lien invalide." };

  const hasExpired = new Date() > existingToken.expires;
  if (hasExpired) return { error: "Lien expiré." };

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });
  if (!existingUser) return { error: "Utilisateur introuvable." };

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "Mot de passe mis à jour ! Vous pouvez vous connecter." };
}
