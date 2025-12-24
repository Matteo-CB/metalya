import { Metadata } from "next";
import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import {
  StoryViewer,
  StoryData,
  StorySlide,
} from "@/components/web-stories/story-viewer";
import { notFound } from "next/navigation";

// --- CONFIG ---

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
  const city = DESTINATIONS.find((c) => c.slug === resolvedParams.slug);
  if (!city) return {};

  const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

  return {
    title: `Story : Vivre à ${city.name} - Guide Rapide`,
    description: `Découvrez ${city.name} en 15 secondes. Budget, Wifi et qualité de vie.`,
    // C'est ICI qu'on fait le lien magique
    alternates: {
      types: {
        // On indique à Google où trouver la version AMP
        "text/html": [
          {
            url: `${SITE_URL}/web-stories/${city.slug}/amp`,
            title: "AMP Version",
          },
        ],
      },
    },
    openGraph: {
      images: [{ url: city.image }],
      type: "article",
    },
  };
}

// --- STORY GENERATOR LOGIC ---

function createStoryFromCity(city: (typeof DESTINATIONS)[0]): StoryData {
  const cost = getInflationCost(city.baseCost);

  const slides: StorySlide[] = [
    // Slide 1: Cover
    {
      id: "cover",
      type: "cover",
      image: city.image,
      title: city.name,
      text: `Le guide express pour vivre à ${city.name}, ${city.country}.`,
      duration: 4000,
    },
    // Slide 2: Budget
    {
      id: "budget",
      type: "stats",
      image: city.image,
      title: "💰 Le Budget",
      text: "Combien faut-il pour vivre confortablement ?",
      data: [
        { label: "Coût Mensuel", value: `${cost}€` },
        {
          label: "Niveau",
          value:
            cost < 1500
              ? "Pas Cher 🤑"
              : cost > 3000
              ? "Luxe 💎"
              : "Standard 👌",
        },
      ],
      duration: 5000,
    },
    // Slide 3: Tech & Vibe
    {
      id: "tech",
      type: "stats",
      image: city.image,
      title: "💻 Digital Nomad",
      text: "Est-ce une bonne base pour travailler ?",
      data: [
        { label: "Internet", value: `${city.internet} Mbps` },
        { label: "Ambiance", value: city.vibe },
      ],
      duration: 5000,
    },
    // Slide 4: Pros (Points forts)
    {
      id: "pros",
      type: "content",
      image: city.image,
      title: "❤️ On adore",
      text: city.pros
        .slice(0, 3)
        .map((p) => `• ${p}`)
        .join("\n"),
      duration: 6000,
    },
    // Slide 5: CTA
    {
      id: "cta",
      type: "cta",
      image: city.image,
      title: "Prêt à partir ?",
      duration: 10000, // Plus long pour laisser le temps de cliquer
    },
  ];

  return {
    id: city.slug,
    title: `Vivre à ${city.name}`,
    slug: city.slug,
    slides,
  };
}

// --- PAGE COMPONENT ---

export default async function StoryPage({ params }: Props) {
  const resolvedParams = await params;
  const city = DESTINATIONS.find((c) => c.slug === resolvedParams.slug);

  if (!city) notFound();

  const story = createStoryFromCity(city);

  return <StoryViewer story={story} />;
}
