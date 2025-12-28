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

export const NewsletterSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse valide." }),
});

export const postStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "PENDING",
]);

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "Le titre est trop long"),
  slug: z
    .string()
    .min(1, "L'URL est requise")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "L'URL doit contenir uniquement des lettres minuscules, des chiffres et des tirets (ex: mon-article-super)"
    ),
  excerpt: z.string().max(300, "L'extrait est trop long").optional(),
  content: z.string().min(1, "Le contenu ne peut pas être vide"),
  coverImage: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1, "La catégorie est requise"),
  status: postStatusSchema.default("DRAFT"),
  featured: z.boolean().default(false),
  seoTitle: z
    .string()
    .max(60, "Le titre SEO doit faire moins de 60 caractères")
    .optional(),
  seoDesc: z
    .string()
    .max(160, "La description SEO doit faire moins de 160 caractères")
    .optional(),
  keywords: z.array(z.string()).default([]),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
export type ProfileInput = z.infer<typeof ProfileSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type NewsletterInput = z.infer<typeof NewsletterSchema>;
export type PostFormValues = z.infer<typeof postSchema>;
