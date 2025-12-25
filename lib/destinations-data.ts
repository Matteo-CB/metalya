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
  description: string;
  pros: string[];
  cons: string[];
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

// LISTE CLASSÉE PAR POPULARITÉ TOURISTIQUE & VOYAGE (TOP 80 MONDIAL)
export const DESTINATIONS: City[] = [
  // --- LE TOP 10 MONDIAL (Les géants du tourisme) ---
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    emoji: "🇫🇷",
    currency: "EUR",
    baseCost: 3200,
    internet: 150,
    temp: 15,
    region: "Europe",
    vibe: "Romantique",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/leonard-cotte-r5scocnoodm-unsplash.webp",
    badge: "N°1 Visité",
    description:
      "La ville la plus visitée au monde. Au-delà de la Tour Eiffel, c'est une capitale de la mode, de la gastronomie et de l'art de vivre unique.",
    pros: ["Culture infinie", "Gastronomie", "Architecture"],
    cons: ["Prix élevés", "Foules immenses", "Parisiens pressés"],
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    country: "Thaïlande",
    emoji: "🇹🇭",
    currency: "THB",
    baseCost: 1450,
    internet: 110,
    temp: 32,
    region: "Asie",
    vibe: "Électrique",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/bradley-prentice-dyer-zrgcmi-unsplash.webp",
    badge: "Top Asie",
    description:
      "La ville la plus visitée d'Asie. Un mélange enivrant de temples dorés, de street food légendaire, de malls futuristes et de vie nocturne.",
    pros: ["Street food reine", "Vie nocturne", "Shopping"],
    cons: ["Chaleur humide", "Trafic", "Pollution"],
  },
  {
    slug: "londres",
    name: "Londres",
    country: "Royaume-Uni",
    emoji: "🇬🇧",
    currency: "GBP",
    baseCost: 3500,
    internet: 130,
    temp: 13,
    region: "Europe",
    vibe: "Cosmopolite",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/marcin-nowak-ixqtqc-f6ji-unsplash.webp",
    description:
      "Le carrefour du monde. Une métropole dynamique où l'histoire royale côtoie l'avant-garde artistique et financière.",
    pros: ["Musées gratuits", "Diversité culturelle", "Parcs royaux"],
    cons: ["Très cher", "Météo grise", "Distances"],
  },
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
    vibe: "Futuriste",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/darcey-beau-q8d7wzc40ea-unsplash--1-.webp",
    badge: "Luxe",
    description:
      "La ville de la démesure. Gratte-ciels records, îles artificielles et luxe absolu au milieu du désert. Le nouveau hub mondial.",
    pros: ["Sécurité totale", "Shopping", "Architecture folle"],
    cons: ["Chaleur extrême", "Ville artificielle", "Coût de la vie"],
  },
  {
    slug: "new-york",
    name: "New York",
    country: "USA",
    emoji: "🇺🇸",
    currency: "USD",
    baseCost: 6500,
    internet: 180,
    temp: 14,
    region: "Amériques",
    vibe: "Énergie",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/thomas-habr-6nmnrajpq7m-unsplash.webp",
    badge: "Iconique",
    description:
      "The City That Never Sleeps. L'épicentre culturel, financier et médiatique de la planète. Une énergie qu'on ne trouve nulle part ailleurs.",
    pros: ["Culture mondiale", "Diversité", "Opportunités"],
    cons: ["Hors de prix", "Bruit constant", "Saleté"],
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japon",
    emoji: "🇯🇵",
    currency: "JPY",
    baseCost: 2600,
    internet: 180,
    temp: 16,
    region: "Asie",
    vibe: "Cyberpunk",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/louie-martinez-iocjwyqrv3m-unsplash.webp",
    badge: "Tendance",
    description:
      "Le choc culturel ultime. Une mégalopole infinie, ultra-propre et sûre, où les temples millénaires se cachent sous les néons.",
    pros: ["Gastronomie", "Sécurité", "Dépaysement"],
    cons: ["Barrière langue", "Foules", "Logements petits"],
  },
  {
    slug: "barcelone",
    name: "Barcelone",
    country: "Espagne",
    emoji: "🇪🇸",
    currency: "EUR",
    baseCost: 2400,
    internet: 140,
    temp: 21,
    region: "Europe",
    vibe: "Fiesta",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/dorian-d1-ax5nlrkgrbc-unsplash.webp",
    description:
      "L'art de vivre méditerranéen. Architecture de Gaudi, plages urbaines, tapas et une vie nocturne qui termine à l'aube.",
    pros: ["Plage en ville", "Architecture", "Ambiance"],
    cons: ["Pickpockets", "Tourisme de masse", "Bruit"],
  },
  {
    slug: "rome",
    name: "Rome",
    country: "Italie",
    emoji: "🇮🇹",
    currency: "EUR",
    baseCost: 2100,
    internet: 90,
    temp: 20,
    region: "Europe",
    vibe: "Histoire",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/david-kohler-vfrtxgw1vju-unsplash.webp",
    description:
      "La Ville Éternelle. Un musée à ciel ouvert où chaque coin de rue révèle 3000 ans d'histoire, le tout avec des pâtes et des glaces.",
    pros: ["Patrimoine unique", "Cuisine", "Charme"],
    cons: ["Transports chaos", "Foules", "Chaleur l'été"],
  },
  {
    slug: "bali-canggu",
    name: "Bali (Canggu)",
    country: "Indonésie",
    emoji: "🇮🇩",
    currency: "IDR",
    baseCost: 1700,
    internet: 50,
    temp: 29,
    region: "Asie",
    vibe: "Surf & Chill",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/lesya-soboleva-a0tk9ekaa9e-unsplash.webp",
    badge: "Viral",
    description:
      "L'île des Dieux. Plages de surf, rizières en terrasses, temples hindous et une culture de l'accueil légendaire.",
    pros: ["Lifestyle", "Nature", "Rapport qualité/prix"],
    cons: ["Trafic", "Tourisme excessif", "Déchets"],
  },
  {
    slug: "istanbul",
    name: "Istanbul",
    country: "Turquie",
    emoji: "🇹🇷",
    currency: "TRY",
    baseCost: 1300,
    internet: 80,
    temp: 18,
    region: "Europe",
    vibe: "Orient/Occident",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/ibrahim-uzun-2uemaqyp9rk-unsplash.webp",
    description:
      "Le pont entre deux mondes. La seule ville à cheval sur deux continents, mêlant bazars historiques, mosquées grandioses et vie moderne.",
    pros: ["Histoire riche", "Cuisine", "Rapport qualité/prix"],
    cons: ["Trafic dense", "Foules", "Arnaques taxi"],
  },

  // --- AMÉRIQUES & CARAÏBES ---
  {
    slug: "miami",
    name: "Miami",
    country: "USA",
    emoji: "🇺🇸",
    currency: "USD",
    baseCost: 5500,
    internet: 160,
    temp: 28,
    region: "Amériques",
    vibe: "Plage & Fête",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/aurora-kreativ-un4cs4zncyo-unsplash.webp",
    description:
      "La capitale latine des USA. Plages de sable blanc, art déco, vie nocturne glamour et influences cubaines.",
    pros: ["Plages", "Vie nocturne", "Art (Wynwood)"],
    cons: ["Très cher", "Superficiel", "Humidité"],
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    country: "USA",
    emoji: "🇺🇸",
    currency: "USD",
    baseCost: 5800,
    internet: 170,
    temp: 24,
    region: "Amériques",
    vibe: "Cinéma",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/roberto-nickson-wdckqk1oric-unsplash.webp",
    description:
      "La cité des anges. Hollywood, Santa Monica, Venice Beach... Le rêve californien sous les palmiers.",
    pros: ["Climat", "Industrie créative", "Nature proche"],
    cons: ["Trafic horrible", "Distances", "Coût"],
  },
  {
    slug: "mexico-city",
    name: "Mexico City",
    country: "Mexique",
    emoji: "🇲🇽",
    currency: "MXN",
    baseCost: 1900,
    internet: 80,
    temp: 20,
    region: "Amériques",
    vibe: "Culturel",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/david-carballar-fzu-viw-lk8-unsplash.webp",
    description:
      "Une des plus grandes villes du monde, surprenante par sa verdure, sa gastronomie incroyable et ses quartiers bohèmes (Roma/Condesa).",
    pros: ["Gastronomie", "Culture", "Abordable"],
    cons: ["Trafic", "Sécurité", "Altitude"],
  },
  {
    slug: "cancun",
    name: "Cancún",
    country: "Mexique",
    emoji: "🇲🇽",
    currency: "MXN",
    baseCost: 2200,
    internet: 60,
    temp: 29,
    region: "Amériques",
    vibe: "Caraïbes",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/andreas-m-88intec2q5q-unsplash.webp",
    description:
      "La porte d'entrée des Caraïbes mayas. Plages turquoises, cénotes, ruines antiques et fêtes sur la plage.",
    pros: ["Mer turquoise", "Cénotes", "Connexions vols"],
    cons: ["Tourisme de masse", "Américanisé", "Sargasses"],
  },
  {
    slug: "rio-de-janeiro",
    name: "Rio de Janeiro",
    country: "Brésil",
    emoji: "🇧🇷",
    currency: "BRL",
    baseCost: 1600,
    internet: 90,
    temp: 27,
    region: "Amériques",
    vibe: "Samba",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/agustin-diaz-gargiulo-7f65hdp0-e0-unsplash.webp",
    description:
      "La 'Cidade Maravilhosa'. Un cadre naturel époustouflant entre mer et montagnes, le Christ Rédempteur et la plage de Copacabana.",
    pros: ["Paysage unique", "Plages", "Ambiance"],
    cons: ["Sécurité", "Langue (Portugais)", "Inégalités"],
  },
  {
    slug: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentine",
    emoji: "🇦🇷",
    currency: "ARS",
    baseCost: 1100,
    internet: 60,
    temp: 18,
    region: "Amériques",
    vibe: "Paris Latin",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/barbara-zandoval-fl3fdbbtj4q-unsplash.webp",
    description:
      "L'élégance européenne avec la passion latine. Tango, steaks, vin rouge et architecture haussmannienne.",
    pros: ["Très pas cher", "Culture", "Gastronomie"],
    cons: ["Économie instable", "Loin de tout", "Sécurité"],
  },
  {
    slug: "medellin",
    name: "Medellín",
    country: "Colombie",
    emoji: "🇨🇴",
    currency: "COP",
    baseCost: 1300,
    internet: 65,
    temp: 24,
    region: "Amériques",
    vibe: "Printemps",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/joel-duncan-iqa-wlbnjqs-unsplash--1-.webp",
    description:
      "La ville du printemps éternel. Une météo parfaite toute l'année, une vie nocturne intense et une transformation urbaine modèle.",
    pros: ["Climat idéal", "Prix bas", "Fête"],
    cons: ["Tourisme sexuel", "Sécurité", "Pollution"],
  },
  {
    slug: "cartagena",
    name: "Carthagène",
    country: "Colombie",
    emoji: "🇨🇴",
    currency: "COP",
    baseCost: 1500,
    internet: 50,
    temp: 30,
    region: "Amériques",
    vibe: "Colonial",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/leandro-loureiro-j0suky48jfk-unsplash.webp",
    description:
      "La perle des Caraïbes. Une vieille ville coloniale colorée, classée UNESCO, avec une ambiance tropicale romantique.",
    pros: ["Charme fou", "Histoire", "Mer"],
    cons: ["Très chaud", "Vendeurs rue", "Prix touristiques"],
  },
  {
    slug: "tulum",
    name: "Tulum",
    country: "Mexique",
    emoji: "🇲🇽",
    currency: "MXN",
    baseCost: 3500,
    internet: 40,
    temp: 28,
    region: "Amériques",
    vibe: "Bohème Chic",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/spencer-watson-ioy3bn5irew-unsplash.webp",
    description:
      "Le repaire des influenceurs et yogis. Jungle, ruines mayas en bord de mer et fêtes électro dans des lieux design.",
    pros: ["Esthétique", "Plages", "Fêtes"],
    cons: ["Hors de prix", "Cartels", "Moustiques"],
  },
  {
    slug: "toronto",
    name: "Toronto",
    country: "Canada",
    emoji: "🇨🇦",
    currency: "CAD",
    baseCost: 4200,
    internet: 140,
    temp: 10,
    region: "Amériques",
    vibe: "Moderne",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/zia-syed-goq27rhol3s-unsplash.webp",
    description:
      "La métropole multiculturelle du Canada. Une ville propre, sûre et diverse, au bord du lac Ontario, avec une scène tech forte.",
    pros: ["Sécurité", "Diversité", "Propreté"],
    cons: ["Hivers rudes", "Loyers chers", "Traffic"],
  },

  // --- ASIE & OCÉANIE ---
  {
    slug: "singapour",
    name: "Singapour",
    country: "Singapour",
    emoji: "🇸🇬",
    currency: "SGD",
    baseCost: 4500,
    internet: 250,
    temp: 30,
    region: "Asie",
    vibe: "Luxe Vert",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/hu-chen---cblrzlstg-unsplash.webp",
    description:
      "La ville jardin du futur. Une propreté clinique, une architecture verte spectaculaire et la meilleure street food étoilée.",
    pros: ["Sécurité absolue", "Propreté", "Food"],
    cons: ["Très cher", "Humide", "Règles strictes"],
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
    vibe: "K-Pop",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/zequn-gui-xvfs3meofym-unsplash.webp",
    description:
      "La ville qui ne dort jamais. Mode, cosmétiques, cafés design et technologie de pointe dans une ambiance frénétique.",
    pros: ["Shopping", "Cafés", "Sécurité"],
    cons: ["Air pollué", "Hivers froids", "Foules"],
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    country: "Japon",
    emoji: "🇯🇵",
    currency: "JPY",
    baseCost: 2100,
    internet: 120,
    temp: 16,
    region: "Asie",
    vibe: "Zen",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/david-edelstein-n4dbvtudikw-unsplash.webp",
    description:
      "L'âme du Japon traditionnel. Geishas, temples zen, jardins de pierre et cérémonies du thé. Un voyage dans le temps.",
    pros: ["Beauté", "Culture", "Calme"],
    cons: ["Tourisme de masse", "Tout ferme tôt", "Strict"],
  },
  {
    slug: "phuket",
    name: "Phuket",
    country: "Thaïlande",
    emoji: "🇹🇭",
    currency: "THB",
    baseCost: 1600,
    internet: 80,
    temp: 30,
    region: "Asie",
    vibe: "Plage",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/mike-swigunski-of-u2apwugw-unsplash.webp",
    description:
      "La plus grande île de Thaïlande. Des plages de carte postale, une vie nocturne intense et des infrastructures modernes.",
    pros: ["Plages", "Infrastructures", "Facilité"],
    cons: ["Prix taxi", "Tourisme russe", "Chaotique"],
  },
  {
    slug: "ho-chi-minh",
    name: "Ho Chi Minh",
    country: "Vietnam",
    emoji: "🇻🇳",
    currency: "VND",
    baseCost: 1100,
    internet: 85,
    temp: 31,
    region: "Asie",
    vibe: "Scooter",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/hu-nh-t-n-h-u-nubqnezvtwu-unsplash.webp",
    description:
      "L'énergie pure. Une ville qui fonce à 100 à l'heure, parfaite pour l'entrepreneuriat, avec une histoire forte et des cafés partout.",
    pros: ["Énergie", "Coût", "Cafés"],
    cons: ["Pollution", "Bruit", "Trafic"],
  },
  {
    slug: "da-nang",
    name: "Da Nang",
    country: "Vietnam",
    emoji: "🇻🇳",
    currency: "VND",
    baseCost: 950,
    internet: 70,
    temp: 28,
    region: "Asie",
    vibe: "Moderne",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/ngo-thanh-tung-pctulkx8ere-unsplash.webp",
    badge: "Top Vietnam",
    description:
      "La meilleure ville du Vietnam pour vivre. Plages immenses, ponts dragons, air plus pur et proximité avec Hoi An.",
    pros: ["Plage urbaine", "Prix bas", "Routes larges"],
    cons: ["Météo (typhons)", "Vie nocturne", "Langue"],
  },
  {
    slug: "sydney",
    name: "Sydney",
    country: "Australie",
    emoji: "🇦🇺",
    currency: "AUD",
    baseCost: 4800,
    internet: 90,
    temp: 22,
    region: "Océanie",
    vibe: "Lifestyle",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/tyler-duston-zxlfq5mexms-unsplash.webp",
    description:
      "La qualité de vie à l'australienne. Opéra iconique, plages de surf (Bondi), barbecues et soleil.",
    pros: ["Beauté naturelle", "Plages", "Sécurité"],
    cons: ["Très cher", "Loin de tout", "Internet moyen"],
  },
  {
    slug: "melbourne",
    name: "Melbourne",
    country: "Australie",
    emoji: "🇦🇺",
    currency: "AUD",
    baseCost: 4500,
    internet: 95,
    temp: 18,
    region: "Océanie",
    vibe: "Cool",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/urlaubstracker-dw8doc8r7o4-unsplash.webp",
    description:
      "La capitale culturelle d'Australie. Café, street art, musique live et une météo '4 saisons en une journée'.",
    pros: ["Culture café", "Arts", "Tramways"],
    cons: ["Météo instable", "Coût", "Loin"],
  },
  {
    slug: "auckland",
    name: "Auckland",
    country: "Nouv. Zélande",
    emoji: "🇳🇿",
    currency: "NZD",
    baseCost: 4000,
    internet: 100,
    temp: 17,
    region: "Océanie",
    vibe: "Voile",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/sulthan-auliya-v9fix0j-kaa-unsplash.webp",
    description:
      "La cité des voiles. Entre deux ports, entourée de volcans éteints et d'îles, c'est la porte d'entrée de la nature néo-zélandaise.",
    pros: ["Nature", "Mer", "Calme"],
    cons: ["Ville étalée", "Coût", "Transports"],
  },

  // --- EUROPE (Classiques & Tendance) ---
  {
    slug: "amsterdam",
    name: "Amsterdam",
    country: "Pays-Bas",
    emoji: "🇳🇱",
    currency: "EUR",
    baseCost: 3800,
    internet: 130,
    temp: 12,
    region: "Europe",
    vibe: "Canaux",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/javier-m-2hs8zbwolda-unsplash.webp",
    description:
      "La Venise du Nord. Vélos, canaux, maisons penchées et une tolérance légendaire. Une ville-village ultra-charmante.",
    pros: ["Vélo", "Esthétique", "Ambiance"],
    cons: ["Logement crise", "Touristes", "Pluie"],
  },
  {
    slug: "berlin",
    name: "Berlin",
    country: "Allemagne",
    emoji: "🇩🇪",
    currency: "EUR",
    baseCost: 2500,
    internet: 100,
    temp: 11,
    region: "Europe",
    vibe: "Techno & Art",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/florian-wehde-ufgi0-ycie0-unsplash.webp",
    description:
      "Pauvre mais sexy. La capitale de la contre-culture, des clubs techno, de l'histoire du 20ème siècle et de la liberté.",
    pros: ["Liberté", "Fête", "Espaces verts"],
    cons: ["Hivers rudes", "Service rude", "Administration"],
  },
  {
    slug: "prague",
    name: "Prague",
    country: "Rép. Tchèque",
    emoji: "🇨🇿",
    currency: "CZK",
    baseCost: 1800,
    internet: 90,
    temp: 11,
    region: "Europe",
    vibe: "Gothique",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/william-zhang-6en4wysnyxm-unsplash.webp",
    description:
      "Un conte de fées architectural. Ponts médiévaux, château, bière moins chère que l'eau et mystères alchimistes.",
    pros: ["Beauté", "Bière", "Prix"],
    cons: ["Foules", "Attrape-touristes", "Froid"],
  },
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
    vibe: "Lumière",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/aayush-gupta-ljhceahywj8-unsplash--1-.webp",
    description:
      "La ville aux sept collines. Tramways jaunes, azulejos, pastéis de nata et une lumière atlantique unique.",
    pros: ["Charme", "Météo", "Tech"],
    cons: ["Loyers", "Touristes", "Ça grimpe"],
  },
  {
    slug: "madrid",
    name: "Madrid",
    country: "Espagne",
    emoji: "🇪🇸",
    currency: "EUR",
    baseCost: 2200,
    internet: 130,
    temp: 19,
    region: "Europe",
    vibe: "Royale",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/jorge-fernandez-salas-chszetoal-i-unsplash.webp",
    description:
      "La vie à l'espagnole. Musées de classe mondiale (Prado), parcs immenses et une vie sociale qui ne s'arrête jamais.",
    pros: ["Musées", "Parcs", "Ambiance"],
    cons: ["Pas de mer", "Chaleur été", "Bruit"],
  },
  {
    slug: "athenes",
    name: "Athènes",
    country: "Grèce",
    emoji: "🇬🇷",
    currency: "EUR",
    baseCost: 1700,
    internet: 70,
    temp: 23,
    region: "Europe",
    vibe: "Antique",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/spencer-davis-ilqmlvimn4c-unsplash.webp",
    description:
      "Le berceau de la civilisation. L'Acropole veille sur une ville chaotique mais vivante, avec des bars sur les toits et la mer proche.",
    pros: ["Histoire", "Prix", "Climat"],
    cons: ["Urbanisme", "Trafic", "Chaleur"],
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
    vibe: "Thermale",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/ervin-lukacs-smyqb3i9bna-unsplash--1-.webp",
    description:
      "La perle du Danube. Thermes grandioses, Ruin bars dans des immeubles abandonnés et architecture impériale.",
    pros: ["Thermes", "Fête", "Prix"],
    cons: ["Langue", "Hiver sombre", "Politique"],
  },
  {
    slug: "dublin",
    name: "Dublin",
    country: "Irlande",
    emoji: "🇮🇪",
    currency: "EUR",
    baseCost: 3800,
    internet: 120,
    temp: 11,
    region: "Europe",
    vibe: "Pubs",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/matheus-camara-da-silva-nl2orrgh8km-unsplash.webp",
    description:
      "La convivialité irlandaise. Une ville littéraire, jeune (hub tech européen) et célèbre pour ses pubs chaleureux.",
    pros: ["Ambiance", "Tech jobs", "Nature proche"],
    cons: ["Logement crise", "Prix", "Pluie"],
  },
  {
    slug: "copenhague",
    name: "Copenhague",
    country: "Danemark",
    emoji: "🇩🇰",
    currency: "DKK",
    baseCost: 4000,
    internet: 160,
    temp: 10,
    region: "Europe",
    vibe: "Hygge",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/nick-karvounis-3-zgrsirryy-unsplash.webp",
    description:
      "Le bonheur scandinave. Design, architecture durable, vélos partout et une qualité de vie exceptionnelle.",
    pros: ["Design", "Propreté", "Vélos"],
    cons: ["Très cher", "Hivers", "Réservé"],
  },
  {
    slug: "stockholm",
    name: "Stockholm",
    country: "Suède",
    emoji: "🇸🇪",
    currency: "SEK",
    baseCost: 3500,
    internet: 150,
    temp: 9,
    region: "Europe",
    vibe: "Archipel",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/raphael-andres-3cwvfd-yptk-unsplash.webp",
    description:
      "La beauté sur l'eau. Une ville étalée sur 14 îles, mêlant nature, modernité et tradition suédoise (Fika).",
    pros: ["Eau partout", "Propreté", "Style"],
    cons: ["Hivers noirs", "Prix alcool", "Logement"],
  },
  {
    slug: "vienne",
    name: "Vienne",
    country: "Autriche",
    emoji: "🇦🇹",
    currency: "EUR",
    baseCost: 2800,
    internet: 110,
    temp: 12,
    region: "Europe",
    vibe: "Classique",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/jacek-dylag-5sjaaqqccmy-unsplash.webp",
    description:
      "L'élégance impériale. Palais, opéras, bals et la célèbre culture des cafés viennois. Une ville très sûre.",
    pros: ["Sécurité", "Culture", "Transports"],
    cons: ["Un peu strict", "Langue", "Dimanche mort"],
  },
  {
    slug: "venise",
    name: "Venise",
    country: "Italie",
    emoji: "🇮🇹",
    currency: "EUR",
    baseCost: 3000,
    internet: 70,
    temp: 16,
    region: "Europe",
    vibe: "Unique",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/henrique-ferreira-rkslqosnutc-unsplash.webp",
    description:
      "La ville miracle. Pas de voitures, juste des canaux, des palais et une atmosphère irréelle, surtout hors saison.",
    pros: ["Beauté absolue", "Pas de voitures", "Art"],
    cons: ["Tourisme fou", "Prix", "Odeurs été"],
  },
  {
    slug: "florence",
    name: "Florence",
    country: "Italie",
    emoji: "🇮🇹",
    currency: "EUR",
    baseCost: 2500,
    internet: 80,
    temp: 17,
    region: "Europe",
    vibe: "Renaissance",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/jonathan-korner-pru-vnbvjmq-unsplash.webp",
    description:
      "Le berceau de la Renaissance. Michel-Ange, Léonard de Vinci, le Duomo... Une concentration d'art unique au monde.",
    pros: ["Art", "Toscane", "Cuisine"],
    cons: ["Petite ville", "Foules", "Chaud été"],
  },
  {
    slug: "mykonos",
    name: "Mykonos",
    country: "Grèce",
    emoji: "🇬🇷",
    currency: "EUR",
    baseCost: 4000,
    internet: 60,
    temp: 22,
    region: "Europe",
    vibe: "Fête & Blanc",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/johnny-africa--zx0s27d3fw-unsplash.webp",
    description:
      "L'île blanche des Cyclades. Moulins à vent, ruelles photogéniques et fêtes exclusives sur la plage.",
    pros: ["Esthétique", "Fête", "Plages"],
    cons: ["Hors de prix", "Vent", "Saisonnier"],
  },
  {
    slug: "santorin",
    name: "Santorin",
    country: "Grèce",
    emoji: "🇬🇷",
    currency: "EUR",
    baseCost: 3800,
    internet: 50,
    temp: 21,
    region: "Europe",
    vibe: "Vue",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/johnny-africa--zx0s27d3fw-unsplash.webp",
    description:
      "La vue la plus célèbre du monde. Villages blancs accrochés à la falaise, couchers de soleil sur la caldeira et romantisme.",
    pros: ["Vues uniques", "Romantique", "Vin"],
    cons: ["Foules (Oia)", "Prix", "Grimpe"],
  },

  // --- AFRIQUE & MOYEN-ORIENT ---
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
    vibe: "Nature Wow",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/kylefromthenorth-hzr9rdxwbqo-unsplash.webp",
    badge: "Top Afrique",
    description:
      "La plus belle ville du monde ? Montagne de la Table, océan, vignobles et pingouins sur la plage.",
    pros: ["Nature", "Lifestyle", "Vin"],
    cons: ["Sécurité", "Coupures courant", "Vents"],
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Maroc",
    emoji: "🇲🇦",
    currency: "MAD",
    baseCost: 1400,
    internet: 60,
    temp: 25,
    region: "Afrique",
    vibe: "Souk",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/paul-macallan-cfkksjyrsq8-unsplash.webp",
    description:
      "La ville rouge. Riads magnifiques, place Jemaa el-Fna, jardins Majorelle et une atmosphère sensorielle unique.",
    pros: ["Culture", "Design/Déco", "Proche Europe"],
    cons: ["Harcèlement rue", "Chaleur", "Négociation"],
  },
  {
    slug: "le-caire",
    name: "Le Caire",
    country: "Égypte",
    emoji: "🇪🇬",
    currency: "EGP",
    baseCost: 1000,
    internet: 40,
    temp: 26,
    region: "Afrique",
    vibe: "Pharaonique",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/omar-elsharawy-pwmbtwa9lrc-unsplash.webp",
    description:
      "L'histoire millénaire. Les pyramides de Gizeh, le Nil et un chaos urbain fascinant. Une immersion totale.",
    pros: ["Pyramides", "Histoire", "Prix bas"],
    cons: ["Trafic", "Pollution", "Harcèlement"],
  },
  {
    slug: "doha",
    name: "Doha",
    country: "Qatar",
    emoji: "🇶🇦",
    currency: "QAR",
    baseCost: 3200,
    internet: 150,
    temp: 33,
    region: "Moyen-Orient",
    vibe: "Luxe Calme",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/visit-qatar-ggb-yb154qm-unsplash.webp",
    description:
      "L'alternative culturelle à Dubaï. Musées d'art islamique époustouflants, souk Waqif rénové et skyline moderne.",
    pros: ["Musées", "Sécurité", "Propreté"],
    cons: ["Chaleur", "Ville calme", "Coût"],
  },

  // --- AMÉRIQUE DU NORD & SUD (Suite) ---
  {
    slug: "las-vegas",
    name: "Las Vegas",
    country: "USA",
    emoji: "🇺🇸",
    currency: "USD",
    baseCost: 4500,
    internet: 120,
    temp: 25,
    region: "Amériques",
    vibe: "Show",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/grant-cai-9xjdq8-zlki-unsplash.webp",
    description:
      "Sin City. Casinos, spectacles grandioses, hôtels à thème et fêtes 24h/24 au milieu du désert du Nevada.",
    pros: ["Spectacles", "Fête", "Hôtels"],
    cons: ["Artificiel", "Frais cachés", "Fumée casinos"],
  },
  {
    slug: "san-francisco",
    name: "San Francisco",
    country: "USA",
    emoji: "🇺🇸",
    currency: "USD",
    baseCost: 6800,
    internet: 160,
    temp: 16,
    region: "Amériques",
    vibe: "Tech & Brume",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/rockwell-branding-agency-1mnksfwtxri-unsplash.webp",
    description:
      "Le berceau de la Tech. Golden Gate, tramways, collines et une histoire contre-culturelle riche.",
    pros: ["Jobs Tech", "Nature", "Vues"],
    cons: ["Sans-abris", "Prix fous", "Météo"],
  },
  {
    slug: "vancouver",
    name: "Vancouver",
    country: "Canada",
    emoji: "🇨🇦",
    currency: "CAD",
    baseCost: 3900,
    internet: 130,
    temp: 12,
    region: "Amériques",
    vibe: "Nature",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/jeffrey-eisen-2vhoq6stktm-unsplash.webp",
    description:
      "La nature en ville. Océan et montagnes de ski accessibles en 30 minutes. Une des plus belles villes du monde.",
    pros: ["Paysages", "Ski/Mer", "Asie vibes"],
    cons: ["Pluie", "Coût", "Ennuyeux?"],
  },
  {
    slug: "cusco",
    name: "Cusco",
    country: "Pérou",
    emoji: "🇵🇪",
    currency: "PEN",
    baseCost: 1100,
    internet: 40,
    temp: 14,
    region: "Amériques",
    vibe: "Inca",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/gianella-castro-lxjlmd57fhc-unsplash.webp",
    description:
      "La capitale de l'Empire Inca. Porte d'entrée du Machu Picchu, rues pavées coloniales et lamas dans la rue.",
    pros: ["Histoire", "Mystère", "Nature"],
    cons: ["Altitude", "Froid nuit", "Touristes"],
  },
  {
    slug: "punta-cana",
    name: "Punta Cana",
    country: "Rép. Dom",
    emoji: "🇩🇴",
    currency: "DOP",
    baseCost: 2000,
    internet: 50,
    temp: 28,
    region: "Amériques",
    vibe: "Resort",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/rachid-oucharia-1pwluzwnmjq-unsplash.webp",
    description:
      "Le paradis All-Inclusive. Plages de sable blanc à perte de vue, cocotiers et farniente absolu.",
    pros: ["Plages", "Détente", "Hôtels"],
    cons: ["Enfermé", "Peu culturel", "Américanisé"],
  },
  {
    slug: "sao-paulo",
    name: "São Paulo",
    country: "Brésil",
    emoji: "🇧🇷",
    currency: "BRL",
    baseCost: 1800,
    internet: 100,
    temp: 22,
    region: "Amériques",
    vibe: "Jungle Urbaine",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/raphael-nogueira-0phxypffhpg-unsplash.webp",
    description:
      "La NYC de l'Amérique du Sud. Béton, art, gastronomie de classe mondiale et business.",
    pros: ["Culture", "Business", "Food"],
    cons: ["Insécurité", "Trafic", "Moche"],
  },
  {
    slug: "santiago",
    name: "Santiago",
    country: "Chili",
    emoji: "🇨🇱",
    currency: "CLP",
    baseCost: 1600,
    internet: 140,
    temp: 18,
    region: "Amériques",
    vibe: "Andes",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/francisco-kemeny-tzzpc-ljv-a-unsplash.webp",
    description:
      "La ville au pied des Andes. Moderne, sûre et entourée de montagnes enneigées et de vignobles.",
    pros: ["Montagnes", "Sécurité", "Vin"],
    cons: ["Smog", "Séismes", "Coût (LatAm)"],
  },

  // --- ASIE (Suite & Fins) ---
  {
    slug: "hanoi",
    name: "Hanoï",
    country: "Vietnam",
    emoji: "🇻🇳",
    currency: "VND",
    baseCost: 1000,
    internet: 75,
    temp: 24,
    region: "Asie",
    vibe: "Authentique",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/hoang-anh-nyvbshngbpw-unsplash.webp",
    description:
      "L'âme du Vietnam. Lacs brumeux, vieux quartier aux 36 rues, café à l'œuf et histoire coloniale.",
    pros: ["Charme", "Culture", "Cuisine"],
    cons: ["Pollution", "Froid hiver", "Trafic"],
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    country: "Inde",
    emoji: "🇮🇳",
    currency: "INR",
    baseCost: 800,
    internet: 50,
    temp: 28,
    region: "Asie",
    vibe: "Couleurs",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/dexter-fernandes-y97sm41-g9k-unsplash.webp",
    description:
      "La ville rose. Palais des vents, forts majestueux et chaos indien photogénique.",
    pros: ["Photogénique", "Histoire", "Prix"],
    cons: ["Chaos", "Pollution", "Harcèlement"],
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    country: "Inde",
    emoji: "🇮🇳",
    currency: "INR",
    baseCost: 1200,
    internet: 60,
    temp: 29,
    region: "Asie",
    vibe: "Bollywood",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/sid-saxena-tsxadt9ldio-unsplash.webp",
    description:
      "La ville des rêves. Bollywood, bidonvilles et architecture coloniale victorienne face à la mer d'Arabie.",
    pros: ["Énergie", "Histoire", "Mer"],
    cons: ["Foules extrêmes", "Saleté", "Trafic"],
  },
  {
    slug: "chiang-mai",
    name: "Chiang Mai",
    country: "Thaïlande",
    emoji: "🇹🇭",
    currency: "THB",
    baseCost: 950,
    internet: 80,
    temp: 28,
    region: "Asie",
    vibe: "Nomad Hub",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/cheese-yang-6d05b660yde-unsplash.webp",
    badge: "Budget",
    description:
      "La capitale spirituelle des nomades. Temples, montagnes, cafés partout et coût de la vie imbattable.",
    pros: ["Prix", "Communauté", "Douceur"],
    cons: ["Saison fumée", "Pas de mer", "Trafic"],
  },
  {
    slug: "hong-kong",
    name: "Hong Kong",
    country: "Chine",
    emoji: "🇭🇰",
    currency: "HKD",
    baseCost: 4000,
    internet: 180,
    temp: 24,
    region: "Asie",
    vibe: "Vertical",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/andres-garcia-ogrflcyqfvy-unsplash.webp",
    description:
      "La jungle de béton. Gratte-ciels, trams à deux étages, dim sum et nature accessible en 20 minutes.",
    pros: ["Efficacité", "Nature/Ville", "Food"],
    cons: ["Logement micro", "Politique", "Humide"],
  },
  {
    slug: "shanghai",
    name: "Shanghai",
    country: "Chine",
    emoji: "🇨🇳",
    currency: "CNY",
    baseCost: 2800,
    internet: 100,
    temp: 18,
    region: "Asie",
    vibe: "Futur",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/edward-he-ukyzxec2k-s-unsplash.webp",
    description:
      "Le Paris de l'Orient devenu Blade Runner. Le Bund colonial face aux tours géantes de Pudong.",
    pros: ["Modernité", "Sécurité", "Vitesse"],
    cons: ["Internet (VPN)", "Foules", "Pollution"],
  },
  {
    slug: "manille",
    name: "Manille",
    country: "Philippines",
    emoji: "🇵🇭",
    currency: "PHP",
    baseCost: 1300,
    internet: 50,
    temp: 30,
    region: "Asie",
    vibe: "Chaos Latin",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/myk-miravalles-hznpolsw8bs-unsplash.webp",
    description:
      "L'Asie catholique. Centres commerciaux géants, passé espagnol (Intramuros) et trafic légendaire.",
    pros: ["Anglais courant", "Gens sympas", "Shopping"],
    cons: ["Trafic horrible", "Sécurité", "Sale"],
  },
  {
    slug: "phnom-penh",
    name: "Phnom Penh",
    country: "Cambodge",
    emoji: "🇰🇭",
    currency: "USD",
    baseCost: 1100,
    internet: 60,
    temp: 30,
    region: "Asie",
    vibe: "Renaissance",
    image:
      "https://e9hymybvd5pkqllp.public.blob.vercel-storage.com/articles/allphoto-bangkok-tx6bzt8n818-unsplash.webp",
    description:
      "La perle de l'Asie renaît. Riverside, histoire tragique (Khmers Rouges) et développement rapide.",
    pros: ["Prix", "Histoire", "Visa facile"],
    cons: ["Sale", "Vol à l'arraché", "Trafic"],
  },
];
