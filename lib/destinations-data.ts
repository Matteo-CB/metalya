export interface City {
  slug: string;
  name: string;
  country: string;
  emoji: string;
  currency: string;
  baseCost: number;
  internet: number;
  temp: number;
  region:
    | "Asie"
    | "Europe"
    | "Amériques"
    | "Afrique"
    | "Moyen-Orient"
    | "Océanie";
  vibe: string;
  image: string;
  badge?: string;
  description: string; // AJOUTÉ
  pros: string[]; // AJOUTÉ
  cons: string[]; // AJOUTÉ
}

export const getInflationCost = (baseCost: number) => {
  const currentYear = new Date().getFullYear();
  const factor = Math.pow(1.035, currentYear - 2024);
  return Math.round(baseCost * factor);
};

export const getCity = (slug: string) =>
  DESTINATIONS.find((city) => city.slug === slug);
export const getAllCitySlugs = () =>
  DESTINATIONS.map((city) => ({ slug: city.slug }));

export const DESTINATIONS: City[] = [
  // ASIE
  {
    slug: "bali-canggu",
    name: "Canggu (Bali)",
    country: "Indonésie",
    emoji: "🇮🇩",
    currency: "IDR",
    baseCost: 1600,
    internet: 45,
    temp: 29,
    region: "Asie",
    vibe: "Surf & Yoga",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
    badge: "Populaire",
    description:
      "Le hub mondial incontesté des digital nomads. Entre rizières verdoyantes et vagues de surf légendaires, Canggu offre une densité de cafés, de coworkings et de villas avec piscine unique au monde.",
    pros: [
      "Communauté immense",
      "Villas de rêve abordables",
      "Nourriture healthy incroyable",
    ],
    cons: [
      "Trafic routier infernal",
      "Tourisme de masse",
      "Prix en hausse constante",
    ],
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    country: "Thaïlande",
    emoji: "🇹🇭",
    currency: "THB",
    baseCost: 1400,
    internet: 95,
    temp: 32,
    region: "Asie",
    vibe: "Urbain Chaos",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
    description:
      "La capitale mondiale de la street food. Une mégalopole vibrante qui ne dort jamais, où le luxe des malls côtoie l'authenticité des marchés de rue.",
    pros: [
      "Nourriture incroyable pas chère",
      "Transports modernes (BTS/MRT)",
      "Vie nocturne légendaire",
    ],
    cons: ["Chaleur humide écrasante", "Pollution de l'air", "Embouteillages"],
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japon",
    emoji: "🇯🇵",
    currency: "JPY",
    baseCost: 2700,
    internet: 180,
    temp: 16,
    region: "Asie",
    vibe: "Futuriste",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
    badge: "Tendance",
    description:
      "Le mélange parfait entre tradition millénaire et néons cyberpunk. Une expérience de vie unique, propre, organisée et infiniment fascinante.",
    pros: ["Propreté absolue", "Sécurité totale", "Gastronomie infinie"],
    cons: [
      "Logements très petits",
      "Barrière de la langue",
      "Été très chaud et humide",
    ],
  },
  {
    slug: "seoul",
    name: "Séoul",
    country: "Corée du Sud",
    emoji: "🇰🇷",
    currency: "KRW",
    baseCost: 2400,
    internet: 200,
    temp: 15,
    region: "Asie",
    vibe: "K-Pop Tech",
    image:
      "https://images.unsplash.com/photo-1578637387939-43c525550085?w=1200&q=80",
    description:
      "La ville du futur. Internet le plus rapide du monde, cafés ouverts 24h/24 et une culture pop qui a conquis la planète.",
    pros: [
      "Internet ultra-rapide",
      "Cafés design partout",
      "Transports efficaces",
    ],
    cons: [
      "Hivers glaciaux",
      "Qualité de l'air parfois mauvaise",
      "Société très pressée",
    ],
  },
  {
    slug: "da-nang",
    name: "Da Nang",
    country: "Vietnam",
    emoji: "🇻🇳",
    currency: "VND",
    baseCost: 950,
    internet: 55,
    temp: 28,
    region: "Asie",
    vibe: "Plage & Ville",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80",
    badge: "Low Cost",
    description:
      "La pépite montante du Vietnam. Des plages immenses, un internet stable et un coût de la vie imbattable pour une qualité de vie moderne.",
    pros: [
      "Très abordable",
      "Plage en centre-ville",
      "Moins pollué que Hanoï/HCM",
    ],
    cons: [
      "Saison des pluies intense",
      "Barrière de la langue",
      "Vie nocturne calme",
    ],
  },

  // EUROPE
  {
    slug: "lisbonne",
    name: "Lisbonne",
    country: "Portugal",
    emoji: "🇵🇹",
    currency: "EUR",
    baseCost: 2300,
    internet: 120,
    temp: 22,
    region: "Europe",
    vibe: "Soleil",
    image:
      "https://images.unsplash.com/photo-1591722839655-e46269436402?w=1200&q=80",
    description:
      "La Californie de l'Europe. Un climat doux toute l'année, une scène tech en explosion et une qualité de vie exceptionnelle au bord de l'océan.",
    pros: ["Météo idéale", "Culture café", "Communauté tech active"],
    cons: ["Loyers en explosion", "Ça grimpe (collines)", "Touristes l'été"],
  },
  {
    slug: "tenerife",
    name: "Tenerife",
    country: "Espagne",
    emoji: "🇪🇸",
    currency: "EUR",
    baseCost: 1700,
    internet: 90,
    temp: 24,
    region: "Europe",
    vibe: "Île",
    image:
      "https://images.unsplash.com/photo-1596483756372-c28373b9347c?w=1200&q=80",
    description:
      "L'île du printemps éternel. Le meilleur climat d'Europe, parfait pour les amateurs de randonnée, de surf et de nature.",
    pros: [
      "Climat parfait toute l'année",
      "Nature grandiose",
      "Fuseau horaire Europe",
    ],
    cons: [
      "Besoin d'une voiture",
      "Vols parfois longs",
      "Rythme insulaire lent",
    ],
  },
  {
    slug: "budapest",
    name: "Budapest",
    country: "Hongrie",
    emoji: "🇭🇺",
    currency: "HUF",
    baseCost: 1600,
    internet: 110,
    temp: 12,
    region: "Europe",
    vibe: "Histoire",
    image:
      "https://images.unsplash.com/photo-1565426873118-a1dfa01339ce?w=1200&q=80",
    description:
      "Le Paris de l'Est. Une architecture époustouflante, des thermes historiques et une vie nocturne vibrante pour un coût très doux.",
    pros: [
      "Architecture magnifique",
      "Vie nocturne (Ruin bars)",
      "Très abordable pour l'Europe",
    ],
    cons: ["Hivers gris et froids", "Langue difficile", "Politique locale"],
  },
  {
    slug: "tallinn",
    name: "Tallinn",
    country: "Estonie",
    emoji: "🇪🇪",
    currency: "EUR",
    baseCost: 2000,
    internet: 150,
    temp: 8,
    region: "Europe",
    vibe: "Numérique",
    image:
      "https://images.unsplash.com/photo-1541336032412-2048a618540d?w=1200&q=80",
    description:
      "La société numérique la plus avancée au monde. Tout se fait en ligne, la ville est médiévale et magnifique, et les startups sont partout.",
    pros: ["Tout est numérique", "Ville médiévale charmante", "Air pur"],
    cons: ["Hivers longs et sombres", "Petit marché", "Peu de soleil"],
  },

  // AMERIQUES
  {
    slug: "new-york",
    name: "New York",
    country: "USA",
    emoji: "🇺🇸",
    currency: "USD",
    baseCost: 7000,
    internet: 180,
    temp: 14,
    region: "Amériques",
    vibe: "Business",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?w=1200&q=80",
    description:
      "Le centre du monde. Si vous avez le budget, l'énergie et les opportunités de carrière ici sont sans égal sur la planète.",
    pros: ["Networking infini", "Culture mondiale", "Énergie unique"],
    cons: ["Hors de prix", "Bruit constant", "Hivers rudes"],
  },
  {
    slug: "medellin",
    name: "Medellín",
    country: "Colombie",
    emoji: "🇨🇴",
    currency: "COP",
    baseCost: 1250,
    internet: 60,
    temp: 24,
    region: "Amériques",
    vibe: "Printemps",
    image:
      "https://images.unsplash.com/photo-1591559637779-7f394622b7c4?w=1200&q=80",
    badge: "Montante",
    description:
      "La ville du printemps éternel. Une transformation spectaculaire avec des quartiers branchés (El Poblado), une météo parfaite et un coût de la vie très bas.",
    pros: ["Très bon marché", "Climat idéal", "Gens chaleureux"],
    cons: ["Pollution de l'air", "Trafic", "Sécurité variable"],
  },
  {
    slug: "mexico-city",
    name: "Mexico City",
    country: "Mexique",
    emoji: "🇲🇽",
    currency: "MXN",
    baseCost: 1900,
    internet: 70,
    temp: 20,
    region: "Amériques",
    vibe: "Culture",
    image:
      "https://images.unsplash.com/photo-1585464231875-d9cae9f0d82b?w=1200&q=80",
    description:
      "Une capitale verte, gastronomique et artistique. Les quartiers de Roma Norte et Condesa sont devenus les QG des créatifs internationaux.",
    pros: ["Gastronomie top mondiale", "Parcs magnifiques", "Culture riche"],
    cons: ["Altitude (fatigue)", "Trafic", "Gentrification rapide"],
  },
  {
    slug: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentine",
    emoji: "🇦🇷",
    currency: "ARS",
    baseCost: 1100,
    internet: 55,
    temp: 18,
    region: "Amériques",
    vibe: "Tango",
    image:
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1200&q=80",
    description:
      "Le Paris de l'Amérique du Sud. Une architecture européenne, des steaks incroyables et une vie nocturne intense pour un prix dérisoire.",
    pros: ["Qualité de vie / Prix", "Architecture", "Vie nocturne"],
    cons: ["Inflation (change)", "Sécurité variable", "Loin de tout"],
  },

  // AFRIQUE / MOYEN-ORIENT
  {
    slug: "dubai",
    name: "Dubaï",
    country: "Émirats",
    emoji: "🇦🇪",
    currency: "AED",
    baseCost: 3600,
    internet: 220,
    temp: 35,
    region: "Moyen-Orient",
    vibe: "Luxe",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea936a7d40c?w=1200&q=80",
    description:
      "Le futur en plein désert. Le paradis fiscal des entrepreneurs avec zéro impôt, une sécurité totale et des services de classe mondiale.",
    pros: ["Fiscalité 0%", "Sécurité totale", "Hub de voyage"],
    cons: ["Chaleur extrême l'été", "Ville artificielle", "Coût des sorties"],
  },
  {
    slug: "le-cap",
    name: "Le Cap",
    country: "Afrique du Sud",
    emoji: "🇿🇦",
    currency: "ZAR",
    baseCost: 1900,
    internet: 70,
    temp: 20,
    region: "Afrique",
    vibe: "Nature",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80",
    description:
      "L'une des plus belles villes du monde. Montagnes, océan, vignobles et design se rencontrent à la pointe de l'Afrique.",
    pros: ["Nature époustouflante", "Lifestyle outdoor", "Gastronomie"],
    cons: ["Coupures d'électricité", "Sécurité (quartiers)", "Vents forts"],
  },
];
