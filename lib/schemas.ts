import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "L'adresse email est invalide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "L'adresse email est invalide." }),
  password: z
    .string()
    .min(6, { message: "Le mot de passe doit faire au moins 6 caractères." }),
});

export const ContactSchema = z.object({
  name: z.string().min(2, { message: "Votre nom est requis." }),
  email: z.string().email({ message: "Email invalide." }),
  subject: z.string().min(5, { message: "Le sujet est trop court." }),
  message: z
    .string()
    .min(20, { message: "Votre message doit faire au moins 20 caractères." }),
});

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  bio: z
    .string()
    .max(500, { message: "La biographie ne doit pas dépasser 500 caractères." })
    .optional()
    .or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email invalide." }),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Minimum 6 caractères." }),
    confirmPassword: z.string().min(6, { message: "Minimum 6 caractères." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
export type ProfileInput = z.infer<typeof ProfileSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
