import { Category } from "@prisma/client";

export interface CategoryConfig {
  slug: string;
  label: string; // Pour l'affichage
  enum: Category; // Pour la DB
  title: string; // Pour le H1
  description: string; // Pour le sous-titre et le SEO
}

export const CATEGORIES: Record<string, CategoryConfig> = {
  actualites: {
    slug: "actualites",
    label: "Actualités",
    enum: Category.ACTUALITES,
    title: "Le Fil de l'Info",
    description:
      "Analyses approfondies et décryptages des événements qui façonnent notre monde politique et social.",
  },
  culture: {
    slug: "culture",
    label: "Culture",
    enum: Category.CULTURE,
    title: "Art & Société",
    description:
      "Exploration des tendances culturelles, du minimalisme au brutalisme, en passant par la philosophie.",
  },
  tech: {
    slug: "tech",
    label: "Tech",
    enum: Category.TECH,
    title: "Ingénierie & Futur",
    description:
      "Une plongée dans le code, le hardware et les innovations qui redéfinissent notre quotidien.",
  },
  voyage: {
    slug: "voyage",
    label: "Voyage",
    enum: Category.VOYAGE,
    title: "Exploration",
    description:
      "Guides pour nomades digitaux et récits d'aventures aux quatre coins du globe.",
  },
};

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES[slug.toLowerCase()];
}
