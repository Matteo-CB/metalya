import {
  Image as ImageIcon,
  Globe,
  Zap,
  Clock,
  Search,
  Layers,
  Scissors,
  Wand2,
  Map,
  Wallet,
} from "lucide-react";

export interface Tool {
  title: string;
  description: string;
  icon: any;
  href: string;
  status: "active" | "coming-soon" | "new";
  badge?: string;
  color: string;
  bg: string;
  border: string;
  gradient: string;
  keywords: string[];
}

export const tools: Tool[] = [
  {
    title: "Nomad Métriques",
    description:
      "Calculateur de pouvoir d'achat voyage. Découvrez combien de temps vous pouvez vivre à Bali, New York ou Tokyo avec votre budget actuel.",
    icon: Wallet, // Nouvelle icône pertinente
    href: "/outils/nomad-cost",
    status: "new", // ACTIVÉ
    badge: "Viral",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
    border: "group-hover:border-emerald-600/50",
    gradient: "from-emerald-600/20 to-teal-600/20",
    keywords: [
      "coût vie voyage",
      "budget digital nomad",
      "comparateur ville",
      "pouvoir d'achat tourisme",
    ],
  },
  {
    title: "Studio Détourage",
    description:
      "Supprimez l'arrière-plan de n'importe quelle image en 1 clic. IA embarquée puissante. 100% Gratuit & Privé.",
    icon: Scissors,
    href: "/outils/remove-background",
    status: "active",
    badge: "Populaire",
    color: "text-purple-600",
    bg: "bg-purple-600/10",
    border: "group-hover:border-purple-600/50",
    gradient: "from-purple-600/20 to-indigo-600/20",
    keywords: [
      "supprimer fond",
      "détourage ia",
      "transparent background",
      "remove bg",
    ],
  },
  {
    title: "Studio Image",
    description:
      "Convertisseur & Compresseur (WebP, AVIF). Optimisez vos images pour le web sans perte de qualité.",
    icon: ImageIcon,
    href: "/outils/convertisseur-image",
    status: "active",
    badge: "Essentiel",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "group-hover:border-pink-500/50",
    gradient: "from-pink-500/20 to-rose-500/20",
    keywords: ["convertisseur webp", "compresser image", "avif converter"],
  },
  {
    title: "Focus Sanctuaire",
    description:
      "Générateur de bruits ambiants (Pluie, Café, Train) et minuteur Pomodoro pour le Deep Work.",
    icon: Clock,
    href: "/outils/focus",
    status: "coming-soon",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "group-hover:border-amber-500/50",
    gradient: "from-amber-500/20 to-orange-500/20",
    keywords: ["pomodoro timer", "bruit blanc", "focus music"],
  },
  {
    title: "SEO Preview",
    description:
      "Simulateur de résultats Google (SERP). Optimisez vos titres et méta-descriptions pour le clic.",
    icon: Search,
    href: "/outils/seo-preview",
    status: "coming-soon",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/50",
    gradient: "from-blue-500/20 to-cyan-500/20",
    keywords: ["serp simulator", "seo preview", "google snippet"],
  },
  {
    title: "Lecteur Zen",
    description:
      "Analysez la lisibilité de vos textes et estimez le temps de lecture pour votre audience.",
    icon: Zap,
    href: "/outils/lecture",
    status: "coming-soon",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "group-hover:border-violet-500/50",
    gradient: "from-violet-500/20 to-purple-500/20",
    keywords: ["temps de lecture", "lisibilité texte"],
  },
];
