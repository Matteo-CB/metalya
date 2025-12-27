import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

// Le Boilerplate AMP doit être EXACTEMENT cette chaîne, sans aucun saut de ligne
const AMP_BOILERPLATE = `<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>`;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // 1. D'abord, on cherche si c'est une VILLE (Priorité SEO Voyage)
  const city = DESTINATIONS.find((c) => c.slug === slug);

  if (city) {
    const cost = getInflationCost(city.baseCost);
    // Optimisation Sémantique Voyage
    const title = `Voyage à ${city.name} : Le Guide Express 2025`;

    const html = `<!doctype html>
<html amp lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <link rel="canonical" href="${SITE_URL}/web-stories/${city.slug}">
    <title>${title}</title>
    ${AMP_BOILERPLATE}
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
    <style amp-custom>
      amp-story { font-family: 'Helvetica', sans-serif; }
      h1 { font-weight: 900; font-size: 2.6em; line-height: 1.1; color: #fff; text-shadow: 0 4px 20px rgba(0,0,0,0.6); text-transform: uppercase; }
      p { font-size: 1.3em; line-height: 1.6; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.8); font-weight: 500; }
      .badge { background: #2563eb; color: #fff; padding: 6px 15px; border-radius: 30px; font-size: 0.9em; font-weight: bold; display: inline-block; margin-bottom: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
      .price-tag { font-size: 3em; font-weight: 800; color: #34d399; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
      .subtitle { font-size: 1em; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9; margin-bottom: 10px; display: block; }
    </style>
  </head>
  <body>
    <amp-story standalone
      title="${title}"
      publisher="Metalya Voyage"
      publisher-logo-src="${SITE_URL}/logo.png"
      poster-portrait-src="${city.image}">
      
      <amp-story-page id="cover">
        <amp-story-grid-layer template="fill">
          <amp-img src="${city.image}" width="720" height="1280" layout="responsive" alt="${city.name}"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill" style="background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);"></amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <div style="padding: 40px; align-self: end;">
            <span class="badge">${city.region}</span>
            <h1>Découvrir ${city.name}</h1>
            <p>Budget, Météo et Incontournables en 30 secondes.</p>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="budget">
        <amp-story-grid-layer template="fill">
           <amp-img src="${city.image}" width="720" height="1280" layout="responsive"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill" style="background: rgba(0,0,0,0.85); backdrop-filter: blur(5px);"></amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="center">
          <div style="padding: 40px; text-align: center; color: white;">
            <span class="subtitle">Budget Voyageur</span>
            <div class="price-tag">${cost} €</div>
            <p>Par mois pour vivre confortablement (Logement + Sorties).</p>
            <div style="margin-top: 30px; height: 2px; width: 50px; background: white; margin-left: auto; margin-right: auto;"></div>
            <p style="margin-top: 30px;">Internet: <strong>${city.internet} Mbps</strong><br>Météo: <strong>${city.temp}°C</strong></p>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="link">
        <amp-story-grid-layer template="fill" style="background: #111;"></amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="center">
          <div style="padding: 40px; text-align: center;">
            <h1>Prêt à partir ?</h1>
            <p>Accédez au guide complet : quartiers, visas, sécurité et bons plans.</p>
          </div>
        </amp-story-grid-layer>
        <amp-story-page-outlink layout="nodesc">
          <a href="${SITE_URL}/destinations/${city.slug}">Guide Voyage ${city.name}</a>
        </amp-story-page-outlink>
      </amp-story-page>
    </amp-story>
  </body>
</html>`;
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  // 2. Sinon, on cherche si c'est un ARTICLE DE BLOG
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (post) {
    const postUrl = `${SITE_URL}/posts/${post.slug}`;
    const coverImage = post.coverImage || `${SITE_URL}/og-image.jpg`;

    // Nettoyage de l'extrait pour l'affichage
    const excerpt =
      post.excerpt || "Découvrez cet article complet sur Metalya.";

    const html = `<!doctype html>
<html amp lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <link rel="canonical" href="${postUrl}">
    <title>${post.title}</title>
    ${AMP_BOILERPLATE}
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
    <style amp-custom>
      amp-story { font-family: 'Georgia', serif; }
      h1 { font-weight: bold; font-size: 2.2em; line-height: 1.3; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
      p { font-size: 1.2em; line-height: 1.6; color: #fff; text-shadow: 0 1px 5px rgba(0,0,0,0.8); }
      .category { font-size: 0.8em; letter-spacing: 2px; text-transform: uppercase; color: #93c5fd; margin-bottom: 15px; display: block; font-weight: bold; }
      .overlay { background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); }
    </style>
  </head>
  <body>
    <amp-story standalone
      title="${post.title}"
      publisher="Metalya"
      publisher-logo-src="${SITE_URL}/logo.png"
      poster-portrait-src="${coverImage}">
      
      <amp-story-page id="cover">
        <amp-story-grid-layer template="fill">
          <amp-img src="${coverImage}" width="720" height="1280" layout="responsive" alt="${post.title}"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill" class="overlay"></amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <div style="padding: 30px; align-self: flex-end;">
            <span class="category">Metalya • Article</span>
            <h1>${post.title}</h1>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="intro">
        <amp-story-grid-layer template="fill">
           <amp-img src="${coverImage}" width="720" height="1280" layout="responsive" animate-in="pan-left" animate-in-duration="20s"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill" style="background: rgba(0,0,0,0.75);"></amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="center">
          <div style="padding: 40px; text-align: center;">
            <p>${excerpt}</p>
          </div>
        </amp-story-grid-layer>
        <amp-story-page-outlink layout="nodesc">
          <a href="${postUrl}">Lire l'article complet</a>
        </amp-story-page-outlink>
      </amp-story-page>

    </amp-story>
  </body>
</html>`;
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  return new Response("Not found", { status: 404 });
}
