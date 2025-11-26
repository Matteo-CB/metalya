import { PrismaClient, UserRole, Category } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

// Image placeholder grise neutre et élégante pour tout le monde
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2000&auto=format&fit=crop";

const POSTS_DATA = [
  // --- ACTUALITÉS (7 articles) ---
  {
    title: "Élections et IA : Le nouveau défi démocratique",
    slug: "elections-et-ia-defi",
    excerpt:
      "Analyse de l'impact des deepfakes et des algorithmes de recommandation sur les campagnes électorales mondiales en 2025.",
    content: `
## Un tournant historique

La démocratie fait face à son plus grand défi technologique. Alors que plus de 4 milliards de personnes votent cette année, l'intelligence artificielle générative brouille les frontières de la vérité.

### La désinformation à l'échelle industrielle

Ce n'est plus l'affaire de quelques hackers isolés. Des fermes de bots sophistiquées peuvent désormais générer des milliers d'articles, de vidéos et d'enregistrements audio crédibles en quelques secondes.

> "La vérité n'a jamais été aussi fragile qu'à l'ère du pixel synthétique."

### Quelles solutions ?

Les gouvernements et les géants de la Tech tentent de mettre en place des garde-fous :
- Watermarking des contenus IA
- Modération proactive
- Éducation aux médias
    `,
    categories: [Category.ACTUALITES, Category.TECH],
    featured: true,
  },
  {
    title: "Climat : Le bilan mitigé de la COP30",
    slug: "bilan-cop-30",
    excerpt:
      "Les engagements des grandes puissances sont-ils enfin à la hauteur de l'urgence climatique ? Retour sur une conférence sous tension.",
    content: `
## Des promesses aux actes

La COP30 s'est achevée ce week-end avec un accord historique sur le financement des pertes et dommages, mais laisse un goût amer concernant la sortie des énergies fossiles.

### L'Amazonie au cœur des débats

Pour la première fois, la protection de la biodiversité a été placée au même niveau que la réduction des émissions de carbone. Une victoire pour les pays du Sud, mais qui nécessite des investissements colossaux.
    `,
    categories: [Category.ACTUALITES],
    featured: false,
  },
  {
    title: "La crise du logement dans les métropoles",
    slug: "crise-logement-metropoles",
    excerpt:
      "Pourquoi vivre en ville devient impossible pour la classe moyenne et quelles sont les solutions urbanistiques émergentes.",
    content: `
## Gentrification et Airbnb

Le phénomène n'est pas nouveau, mais il s'accélère. De Paris à New York, en passant par Lisbonne, les centres-villes se vident de leurs habitants historiques.

### Les solutions politiques

Certaines villes contre-attaquent :
1. Encadrement strict des loyers
2. Interdiction des locations courte durée
3. Transformation de bureaux en logements
    `,
    categories: [Category.ACTUALITES],
    featured: false,
  },
  {
    title: "Réforme des retraites : Comparatif européen",
    slug: "reforme-retraites-europe",
    excerpt:
      "Comment nos voisins gèrent-ils le vieillissement de la population ? Étude comparative des systèmes par répartition et capitalisation.",
    content: "## Le modèle scandinave...",
    categories: [Category.ACTUALITES],
    featured: false,
  },
  {
    title: "L'ascension économique de l'Inde",
    slug: "ascension-economique-inde",
    excerpt:
      "Le géant démographique est en passe de devenir la troisième puissance mondiale. Quels sont les moteurs de cette croissance ?",
    content: "## Tech et Démographie...",
    categories: [Category.ACTUALITES],
    featured: false,
  },
  {
    title: "Santé mentale : La nouvelle pandémie silencieuse",
    slug: "sante-mentale-pandemie",
    excerpt:
      "Burn-out, anxiété écologique, solitude numérique : état des lieux d'une société à bout de souffle.",
    content: "## Les chiffres alarmants...",
    categories: [Category.ACTUALITES, Category.CULTURE],
    featured: false,
  },
  {
    title: "L'avenir du travail après le grand retour au bureau",
    slug: "avenir-travail-retour-bureau",
    excerpt:
      "Le télétravail recule, mais les employés résistent. Vers quel équilibre hybride nous dirigeons-nous ?",
    content: "## La fin du 100% remote ?...",
    categories: [Category.ACTUALITES],
    featured: false,
  },

  // --- CULTURE (8 articles) ---
  {
    title: "Le retour du Vinyle : Nostalgie ou Qualité ?",
    slug: "retour-vinyle-analyse",
    excerpt:
      "Pourquoi les ventes physiques explosent à l'ère du streaming audio sans perte. Une enquête sur notre besoin de tangibilité.",
    content: `
## Le rituel de l'écoute

À l'époque de Spotify et Apple Music, on pourrait croire le format physique mort et enterré. Pourtant, les usines de pressage tournent à plein régime.

### L'objet contre le fichier

Ce n'est pas qu'une question de son. C'est une question d'attention. Mettre un disque, c'est choisir d'écouter un album en entier, sans zapper, en regardant la pochette en grand format.
    `,
    categories: [Category.CULTURE],
    featured: false,
  },
  {
    title: "Minimalisme Japonais : Une philosophie de vie",
    slug: "minimalisme-japonais-art",
    excerpt:
      "Comprendre le Wabi-Sabi et l'art de trouver la beauté dans l'imperfection et la simplicité.",
    content: `
## Moins mais mieux

Le minimalisme n'est pas qu'une tendance déco Instagram. C'est une réponse au chaos du monde moderne.

### L'esthétique du vide

Dans la culture japonaise, le vide (Ma) n'est pas une absence, c'est un espace de possibles. Il permet à l'esprit de se reposer et à l'imagination de fleurir.
    `,
    categories: [Category.CULTURE, Category.VOYAGE],
    featured: true,
  },
  {
    title: "L'architecture Brutaliste fait son comeback",
    slug: "architecture-brutaliste-retour",
    excerpt:
      "Le béton brut n'est plus synonyme de laideur, mais de caractère, de texture et de durabilité.",
    content: `
## Le Corbusier avait raison

Longtemps détesté, le brutalism revient en force dans le design d'intérieur et l'architecture web. Pourquoi ? Parce qu'il est honnête. Il montre la structure, il ne cache rien.
    `,
    categories: [Category.CULTURE, Category.ACTUALITES],
    featured: false,
  },
  {
    title: "L'impact de TikTok sur l'industrie musicale",
    slug: "impact-tiktok-musique",
    excerpt:
      "Comment des extraits de 15 secondes dictent la composition des hits mondiaux d'aujourd'hui.",
    content: "## Le pont avant le refrain...",
    categories: [Category.CULTURE, Category.TECH],
    featured: false,
  },
  {
    title: "Histoire du Café de Spécialité",
    slug: "histoire-cafe-specialite",
    excerpt:
      "De la commodité à l'artisanat : comment le café est devenu un produit de luxe comparable au vin.",
    content: "## La troisième vague...",
    categories: [Category.CULTURE],
    featured: false,
  },
  {
    title: "Le cinéma Sud-Coréen à la conquête du monde",
    slug: "cinema-sud-coreen-monde",
    excerpt:
      "Après Parasite et Squid Game, analyse de la puissance du soft-power culturel de Séoul.",
    content: "## Une industrie soutenue par l'état...",
    categories: [Category.CULTURE],
    featured: false,
  },
  {
    title: "Pourquoi nous aimons les histoires post-apocalyptiques",
    slug: "psychologie-post-apocalyptique",
    excerpt:
      "De The Last of Us à Fallout, que dit notre fascination pour la fin du monde sur notre époque ?",
    content: "## La peur et l'espoir...",
    categories: [Category.CULTURE],
    featured: false,
  },
  {
    title: "L'art génératif est-il vraiment de l'art ?",
    slug: "art-generatif-debat",
    excerpt:
      "Midjourney et DALL-E remettent en question la notion d'auteur et de créativité humaine.",
    content: "## La machine qui rêve...",
    categories: [Category.CULTURE, Category.TECH],
    featured: false,
  },

  // --- TECH (8 articles) ---
  {
    title: "Apple Vision Pro : Un an après",
    slug: "apple-vision-pro-bilan",
    excerpt:
      "L'informatique spatiale a-t-elle révolutionné notre quotidien ou reste-t-elle un gadget de luxe pour développeurs ?",
    content: `
## L'adoption massive se fait attendre

Un an après sa sortie, le casque d'Apple reste une prouesse technologique sans véritable "Killer App".

### Les applications professionnelles

C'est dans l'industrie et la médecine que le Vision Pro trouve sa place. La chirurgie assistée et la formation technique bénéficient énormément de cette précision spatiale.
    `,
    categories: [Category.TECH],
    featured: false,
  },
  {
    title: "Pourquoi j'ai quitté le Cloud pour un Home Lab",
    slug: "quitter-cloud-home-lab",
    excerpt:
      "Reprendre le contrôle de ses données avec un serveur à la maison. Guide pour débuter avec Docker et Proxmox.",
    content: `
## La souveraineté numérique

Pourquoi payer un abonnement iCloud ou Google Drive quand on peut héberger ses propres photos ?

### Le matériel pour commencer

Pas besoin d'un rack serveur bruyant. Un simple Mini-PC d'occasion ou un Raspberry Pi suffit pour héberger :
- Nextcloud (Fichiers)
- Plex (Média)
- Home Assistant (Domotique)
    `,
    categories: [Category.TECH],
    featured: false,
  },
  {
    title: "Le guide ultime du clavier mécanique",
    slug: "guide-clavier-mecanique",
    excerpt:
      "Switches, Keycaps, PCB, Lubrification : Tout savoir pour construire votre outil de travail parfait.",
    content: "## Le son du Thock...",
    categories: [Category.TECH, Category.CULTURE],
    featured: false,
  },
  {
    title: "L'art du Prompt Engineering",
    slug: "art-prompt-engineering",
    excerpt:
      "Comment parler aux modèles de langage (LLM) pour obtenir exactement ce que vous voulez.",
    content: "## Le contexte est roi...",
    categories: [Category.TECH],
    featured: false,
  },
  {
    title: "Rust vs Go : Le duel du Backend en 2025",
    slug: "rust-vs-go-2025",
    excerpt:
      "Performance mémoire contre simplicité de développement : quel langage choisir pour votre infrastructure ?",
    content: "## La sécurité mémoire avant tout...",
    categories: [Category.TECH],
    featured: false,
  },
  {
    title: "La fin des mots de passe : Passkeys",
    slug: "fin-mots-de-passe-passkeys",
    excerpt:
      "La biométrie remplace enfin nos post-its. Comprendre le standard FIDO2 et WebAuthn.",
    content: "## Une authentification sans secret partagé...",
    categories: [Category.TECH],
    featured: false,
  },
  {
    title: "L'essor de l'informatique quantique",
    slug: "essor-informatique-quantique",
    excerpt:
      "Comprendre les Qubits et la superposition sans avoir besoin d'un doctorat en physique.",
    content: "## Au-delà du binaire...",
    categories: [Category.TECH],
    featured: false,
  },
  {
    title: "Vers un web écologique ?",
    slug: "web-ecologique-green-it",
    excerpt:
      "Optimisation du code, hébergement vert et design sobre : réduire l'empreinte carbone du numérique.",
    content: "## Le poids d'une page web...",
    categories: [Category.TECH, Category.ACTUALITES],
    featured: false,
  },

  // --- VOYAGE (7 articles) ---
  {
    title: "Kyoto : Guide pour photographes nocturnes",
    slug: "kyoto-guide-photo-nuit",
    excerpt:
      "Découvrir les ruelles de Gion et Pontocho loin de la foule touristique, à la recherche de la lumière parfaite.",
    content: `
## L'heure bleue

C'est quand le soleil passe sous l'horizon que Kyoto révèle sa vraie nature. Les lanternes rouges s'allument, le bois sombre des Machiyas absorbe la lumière.

### Le respect avant tout

Attention, Gion n'est pas un studio photo. C'est un quartier vivant et de travail pour les Geishas. La discrétion est la première qualité du photographe.
    `,
    categories: [Category.VOYAGE, Category.CULTURE],
    featured: true,
  },
  {
    title: "Roadtrip en Islande : La Route 1",
    slug: "roadtrip-islande-route-1",
    excerpt:
      "10 jours à travers des paysages lunaires, des glaciers millénaires et des volcans actifs.",
    content: `
## Préparer son 4x4

L'Islande ne se dompte pas, elle se traverse avec humilité. La météo change toutes les 5 minutes.

### Les incontournables du Sud

- Skógafoss et sa puissance
- La plage de diamant de Jökulsárlón
- Le canyon de Fjaðrárgljúfur
    `,
    categories: [Category.VOYAGE],
    featured: false,
  },
  {
    title: "Digital Nomad à Madère",
    slug: "digital-nomad-madere",
    excerpt:
      "Pourquoi cette île portugaise est devenue le QG européen des travailleurs à distance.",
    content: "## Ponta do Sol, le village nomade...",
    categories: [Category.VOYAGE, Category.TECH],
    featured: false,
  },
  {
    title: "Traverser l'Europe en train de nuit",
    slug: "europe-train-nuit",
    excerpt:
      "Le renouveau du slow travel ferroviaire. De Paris à Vienne en dormant.",
    content: "## Le charme de la couchette...",
    categories: [Category.VOYAGE, Category.ACTUALITES],
    featured: false,
  },
  {
    title: "Patagonie : Au bout du monde",
    slug: "patagonie-bout-du-monde",
    excerpt:
      "Randonnée dans le parc Torres del Paine, entre vents violents et pics granitiques.",
    content: "## Le circuit W...",
    categories: [Category.VOYAGE],
    featured: false,
  },
  {
    title: "Gastronomie de rue à Bangkok",
    slug: "street-food-bangkok",
    excerpt:
      "Guide des meilleurs stands de street food, du Pad Thai étoilé aux marchés de nuit.",
    content: "## Jay Fai et ses lunettes de ski...",
    categories: [Category.VOYAGE, Category.CULTURE],
    featured: false,
  },
  {
    title: "Vanlife en Norvège",
    slug: "vanlife-norvege",
    excerpt:
      "Liberté totale au pays des Fjords. Conseils pour le bivouac et la conduite en hiver.",
    content: "## Le droit d'accès à la nature...",
    categories: [Category.VOYAGE],
    featured: false,
  },
];

async function main() {
  console.log("Start seeding...");

  // Nettoyage complet
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();

  // Hash password pour l'admin
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  // Création Admin
  const admin = await prisma.user.create({
    data: {
      email: "matteo.biyikli3224@gmail.com",
      name: "Matteo Admin",
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log(`👤 Admin created: ${admin.email}`);

  // Création des 30 posts
  for (const post of POSTS_DATA) {
    await prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: PLACEHOLDER_IMAGE, // Image grise pour tout le monde
        published: true,
        featured: post.featured,
        authorId: admin.id,
        seoTitle: post.title,
        seoDesc: post.excerpt,
        keywords: post.categories,
        readingTime: Math.floor(Math.random() * 12) + 4, // Temps de lecture aléatoire entre 4 et 16 min
        categories: post.categories,
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 10000000000)
        ), // Dates aléatoires pour simuler un historique
      },
    });
  }

  console.log(`✅ Seeding finished with ${POSTS_DATA.length} articles.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
