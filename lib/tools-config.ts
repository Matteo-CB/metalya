import {
  Image as ImageIcon,
  Globe,
  Zap,
  Clock,
  Search,
  Scissors,
  Wallet,
  Crown,
  Calendar,
  Plane,
  Coins, // Nouvelle icône
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
    title: "Pouvoir d'Achat",
    description:
      "Calculateur de richesse relative. Votre salaire de 2000€ vaut 8000€ ailleurs. Découvrez où vivre comme un roi.",
    icon: Coins, // Icône plus financière
    href: "/outils/lifestyle-calculator",
    status: "new",
    badge: "Viral",
    color: "text-indigo-600",
    bg: "bg-indigo-600/10",
    border: "group-hover:border-indigo-600/50",
    gradient: "from-indigo-600/20 to-purple-600/20",
    keywords: ["geoarbitrage", "pouvoir d'achat", "salaire expatriation"],
  },
  {
    title: "Budget Voyage", // Renommé de "Nomad Cost"
    description:
      "Comparateur de coût de la vie pour 80+ villes. Loyer, Hôtels, Repas. Planifiez votre budget vacances ou expatriation.",
    icon: Wallet,
    href: "/outils/nomad-cost",
    status: "active",
    badge: "Populaire",
    color: "text-emerald-600",
    bg: "bg-emerald-600/10",
    border: "group-hover:border-emerald-600/50",
    gradient: "from-emerald-600/20 to-teal-600/20",
    keywords: ["coût vie voyage", "budget vacances", "comparateur ville"],
  },
  {
    title: "Calendrier Voyage",
    description:
      "Où partir ce mois-ci ? L'outil qui croise la météo idéale et les événements culturels pour des vacances parfaites.",
    icon: Calendar,
    href: "/outils/travel-calendar",
    status: "new",
    badge: "Indispensable",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    border: "group-hover:border-blue-600/50",
    gradient: "from-blue-600/20 to-cyan-600/20",
    keywords: ["quand partir", "calendrier voyage", "saison idéale"],
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
    keywords: ["supprimer fond", "détourage ia", "transparent background"],
  },
  {
    title: "Studio Image",
    description:
      "Convertisseur & Compresseur (WebP, AVIF). Optimisez vos photos de voyage pour le web sans perte de qualité.",
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
      "Générateur de bruits ambiants (Pluie, Café, Train) et minuteur Pomodoro pour travailler efficacement en voyage.",
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
