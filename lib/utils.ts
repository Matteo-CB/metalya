import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCategory(category: string): string {
  switch (category) {
    case "ACTUALITES":
      return "Actualités";
    case "CULTURE":
      return "Culture";
    case "TECH":
      return "Tech";
    case "VOYAGE": // Ajout
      return "Voyage";
    default:
      return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  }
}
