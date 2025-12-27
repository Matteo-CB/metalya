import { Metadata } from "next";
import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import { prisma } from "@/lib/prisma"; // Ajout de Prisma pour les articles
import {
  StoryViewer,
  StoryData,
  StorySlide,
} from "@/components/web-stories/story-viewer";
import { notFound } from "next/navigation";

// --- CONFIG ---

// On pré-génère les villes (rapide)
// Les articles seront générés à la demande pour ne pas ralentir le build
export async function generateStaticParams() {
  return DESTINATIONS.map((city) => ({
    slug: city.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

  // 1. Recherche dans les VILLES
  const city = DESTINATIONS.find((c) => c.slug === slug);
  if (city) {
    return {
      title: `Story : Visiter ${city.name} - Le Guide Express`,
      description: `Découvrez ${city.name} en 15 secondes. Budget voyage, météo idéale et lieux incontournables.`,
      alternates: {
        types: {
          "text/html": [
            {
              url: `${SITE_URL}/web-stories/${city.slug}/amp`,
              title: "AMP Version",
            },
          ],
        },
      },
      openGraph: { images: [{ url: city.image }] },
    };
  }

  // 2. Recherche dans les ARTICLES (Si pas de ville trouvée)
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, coverImage: true },
  });

  if (post) {
    return {
      title: `Story : ${post.title}`,
      description: post.excerpt || `Découvrez cet article sous format Story.`,
      alternates: {
        types: {
          "text/html": [
            {
              url: `${SITE_URL}/web-stories/${slug}/amp`,
              title: "AMP Version",
            },
          ],
        },
      },
      openGraph: { images: [{ url: post.coverImage || "/og-image.jpg" }] },
    };
  }

  return {};
}

// --- STORY GENERATORS ---

// Pour une VILLE (Données structurées)
function createStoryFromCity(city: (typeof DESTINATIONS)[0]): StoryData {
  const cost = getInflationCost(city.baseCost);
  const slides: StorySlide[] = [
    {
      id: "cover",
      type: "cover",
      image: city.image,
      title: city.name,
      text: `Le guide express pour découvrir ${city.name}, ${city.country}.`,
      duration: 4000,
    },
    {
      id: "budget",
      type: "stats",
      image: city.image,
      title: "💰 Budget Voyage",
      text: "Quel budget prévoir sur place (Logement + Sorties) ?",
      data: [
        { label: "Coût Mensuel", value: `~${cost}€` },
        {
          label: "Niveau",
          value:
            cost < 1500
              ? "Pas Cher 🤑"
              : cost > 3000
              ? "Premium 💎"
              : "Standard 👌",
        },
      ],
      duration: 5000,
    },
    {
      id: "infos",
      type: "stats",
      image: city.image,
      title: "🌍 Sur Place",
      text: "Connectivité & Ambiance locale",
      data: [
        { label: "Internet", value: `${city.internet} Mbps` },
        { label: "Vibe", value: city.vibe },
      ],
      duration: 5000,
    },
    {
      id: "cta",
      type: "cta",
      image: city.image,
      title: "Prêt à partir ?",
      duration: 10000,
    },
  ];

  return {
    id: city.slug,
    title: `Visiter ${city.name}`,
    slug: city.slug,
    slides,
  };
}

// Pour un ARTICLE DE BLOG (Données textuelles)
function createStoryFromPost(post: any, slug: string): StoryData {
  const image = post.coverImage || "/og-image.jpg";

  const slides: StorySlide[] = [
    {
      id: "cover",
      type: "cover",
      image: image,
      title: post.title,
      text: "Lisez le résumé express de cet article.",
      duration: 5000,
    },
    {
      id: "intro",
      type: "content",
      image: image,
      title: "En Bref",
      text: post.excerpt || "Un article passionnant à découvrir sur Metalya.",
      duration: 7000,
    },
    {
      id: "cta",
      type: "cta",
      image: image,
      title: "Lire l'article complet",
      duration: 10000,
    },
  ];

  return { id: post.id, title: post.title, slug, slides };
}

// --- PAGE COMPONENT ---

export default async function StoryPage({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // 1. Essai Destination
  const city = DESTINATIONS.find((c) => c.slug === slug);
  if (city) {
    return <StoryViewer story={createStoryFromCity(city)} />;
  }

  // 2. Essai Article de Blog
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true, title: true, excerpt: true, coverImage: true },
  });

  if (post) {
    return <StoryViewer story={createStoryFromPost(post, slug)} />;
  }

  // 3. Rien trouvé
  notFound();
}
