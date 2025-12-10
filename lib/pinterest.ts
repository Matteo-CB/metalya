import { Category } from "@prisma/client";

const PINTEREST_API_URL = "https://api-sandbox.pinterest.com/v5";

const BOARD_IDS: Record<Category, string | undefined> = {
  ACTUALITES: process.env.PINTEREST_BOARD_ID_ACTUALITES,
  CULTURE: process.env.PINTEREST_BOARD_ID_CULTURE,
  TECH: process.env.PINTEREST_BOARD_ID_TECH,
  VOYAGE: process.env.PINTEREST_BOARD_ID_VOYAGE,
};

const STOP_WORDS = new Set([
  "le",
  "la",
  "les",
  "un",
  "une",
  "des",
  "du",
  "de",
  "d",
  "l",
  "ce",
  "cet",
  "cette",
  "ces",
  "et",
  "ou",
  "mais",
  "donc",
  "or",
  "ni",
  "car",
  "a",
  "à",
  "en",
  "par",
  "pour",
  "sans",
  "avec",
  "sur",
  "sous",
  "dans",
  "vers",
  "chez",
  "qui",
  "que",
  "quoi",
  "dont",
  "ou",
  "quand",
  "comment",
  "il",
  "elle",
  "ils",
  "elles",
  "nous",
  "vous",
  "je",
  "tu",
  "mon",
  "ton",
  "son",
  "notre",
  "votre",
  "leur",
  "se",
  "sa",
  "ses",
  "est",
  "sont",
  "ont",
  "avoir",
  "être",
  "fait",
  "faire",
  "plus",
  "très",
  "bien",
  "aussi",
  "tout",
  "tous",
  "toute",
  "toutes",
  "c",
  "s",
  "y",
  "n",
  "ne",
  "pas",
  "aux",
]);

const CATEGORY_BOOSTERS: Record<Category, string[]> = {
  TECH: [
    "Innovation",
    "HighTech",
    "Futur",
    "Digital",
    "Technologie",
    "Gadget",
    "Startup",
    "IA",
    "Software",
    "Hardware",
    "Geek",
  ],
  VOYAGE: [
    "Voyage",
    "Travel",
    "Explore",
    "Aventure",
    "Découverte",
    "Tourisme",
    "Wanderlust",
    "Destination",
    "Paysage",
    "Monde",
    "Trip",
  ],
  CULTURE: [
    "Culture",
    "Art",
    "Histoire",
    "Savoir",
    "Patrimoine",
    "Cinéma",
    "Musique",
    "Exposition",
    "Livre",
    "Inspiration",
    "Créativité",
  ],
  ACTUALITES: [
    "Actualités",
    "Info",
    "News",
    "Société",
    "Monde",
    "Politique",
    "Économie",
    "Tendance",
    "Média",
    "Direct",
    "Reportage",
  ],
};

interface PinterestPost {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  category: Category;
  keywords?: string[];
  altText?: string;
}

function cleanWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9àâäéèêëîïôöùûüç]/g, "");
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function generateSmartHashtags(
  title: string,
  description: string,
  category: Category,
  explicitKeywords: string[] = []
): string[] {
  const candidates = new Set<string>();

  // 1. Ajouter la catégorie et les mots-clés explicites (Priorité Haute)
  candidates.add(capitalize(category));
  explicitKeywords.forEach((k) => candidates.add(k.replace(/\s+/g, "")));

  // 2. Ajouter les boosters de niche (Priorité Moyenne)
  const boosters = CATEGORY_BOOSTERS[category] || [];
  boosters.forEach((b) => candidates.add(b));

  // 3. Extraction sémantique du titre et de la description (Priorité Basse - Longue traîne)
  const contentText = `${title} ${description}`;
  const words = contentText.split(/\s+/);

  words.forEach((rawWord) => {
    const word = cleanWord(rawWord);
    if (word.length > 3 && !STOP_WORDS.has(word)) {
      candidates.add(capitalize(word));
    }
  });

  return Array.from(candidates).map((tag) => `#${tag}`);
}

async function refreshAccessToken() {
  const clientId = process.env.PINTEREST_APP_ID;
  const clientSecret = process.env.PINTEREST_APP_SECRET;
  const refreshToken = process.env.PINTEREST_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch(
      "https://api-sandbox.pinterest.com/v5/oauth/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.access_token;
  } catch {
    return null;
  }
}

export async function createPinterestPin({
  title,
  description,
  link,
  imageUrl,
  category,
  keywords = [],
  altText,
}: PinterestPost) {
  let token = process.env.PINTEREST_ACCESS_TOKEN;
  const boardId = BOARD_IDS[category];

  if (!token || !boardId) return null;

  // GÉNÉRATION INTELLIGENTE DE LA DESCRIPTION
  const smartTags = generateSmartHashtags(
    title,
    description,
    category,
    keywords
  );

  // Pinterest limite à 500 caractères. On garde un max de description et on comble avec les tags.
  let finalDescription = description || title;
  const maxDescLength = 480; // Marge de sécurité

  // On tronque la description si elle est déjà trop longue seule
  if (finalDescription.length > 350) {
    finalDescription = finalDescription.substring(0, 347) + "...";
  }

  // On ajoute les hashtags tant qu'il y a de la place
  let tagsString = "";
  for (const tag of smartTags) {
    if (
      finalDescription.length + tagsString.length + tag.length + 1 <
      maxDescLength
    ) {
      tagsString += ` ${tag}`;
    } else {
      break;
    }
  }

  const payload = {
    board_id: boardId,
    title: title.substring(0, 100),
    description: (finalDescription + "\n\n" + tagsString).trim(),
    link: link,
    alt_text: (altText || title).substring(0, 500),
    media_source: {
      source_type: "image_url",
      url: imageUrl,
    },
  };

  try {
    let response = await fetch(`${PINTEREST_API_URL}/pins`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        token = newToken;
        response = await fetch(`${PINTEREST_API_URL}/pins`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }
    }

    if (!response.ok) {
      const err = await response.json();
      console.error("Pinterest Error:", err);
      return null;
    }

    const data = await response.json();
    console.log(`✅ Pinterest Sandbox: Épingle SEO créée (ID: ${data.id})`);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
