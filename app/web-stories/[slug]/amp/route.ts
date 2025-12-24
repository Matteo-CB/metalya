import { DESTINATIONS, getInflationCost } from "@/lib/destinations-data";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // 1. On cherche dans les DESTINATIONS (et non plus Prisma)
  const city = DESTINATIONS.find((c) => c.slug === slug);

  if (!city) {
    return new Response("Not found", { status: 404 });
  }

  const storyUrl = `${SITE_URL}/web-stories/${city.slug}`;
  const canonicalUrl = `${SITE_URL}/web-stories/${city.slug}`; // Pointe vers la version moderne
  const cost = getInflationCost(city.baseCost);

  // 2. Génération du HTML AMP (Template adapté pour Ville)
  const html = `<!doctype html>
<html amp lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <link rel="canonical" href="${canonicalUrl}">
    <title>Vivre à ${city.name} : Le Guide</title>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
    <style amp-custom>
      amp-story { font-family: 'Helvetica', sans-serif; }
      h1 { font-weight: 900; font-size: 2.8em; line-height: 1.1; color: #fff; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
      p { font-size: 1.3em; line-height: 1.6; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.5); font-weight: 500; }
      .badge { background: #2563eb; color: #fff; padding: 5px 15px; border-radius: 20px; font-size: 0.8em; text-transform: uppercase; font-weight: bold; display: inline-block; margin-bottom: 15px; }
      .stat-box { background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 20px; border-radius: 15px; margin-top: 20px; border: 1px solid rgba(255,255,255,0.3); }
      .stat-label { font-size: 0.8em; text-transform: uppercase; opacity: 0.8; }
      .stat-value { font-size: 2em; font-weight: bold; }
    </style>
  </head>
  <body>
    <amp-story standalone
      title="Guide: Vivre à ${city.name}"
      publisher="Metalya"
      publisher-logo-src="${SITE_URL}/logo.png"
      poster-portrait-src="${city.image}">
      
      <amp-story-page id="cover">
        <amp-story-grid-layer template="fill">
          <amp-img src="${city.image}" width="720" height="1280" layout="responsive" alt="${city.name}"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill">
          <div style="background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);"></div>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <div style="padding: 40px; align-self: end;">
            <span class="badge">${city.region}</span>
            <h1>${city.name}</h1>
            <p>Le guide express en 15 secondes.</p>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="budget">
        <amp-story-grid-layer template="fill">
           <amp-img src="${city.image}" width="720" height="1280" layout="responsive"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill" style="background: rgba(0,0,0,0.8);"></amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="center">
          <div style="padding: 40px; text-align: center; color: white;">
            <h1>💰 Le Budget</h1>
            <div class="stat-box">
                <div class="stat-label">Coût Mensuel</div>
                <div class="stat-value">${cost} €</div>
            </div>
            <p style="margin-top: 20px;">Pour vivre confortablement (logement + sorties).</p>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="link">
        <amp-story-grid-layer template="fill" style="background: #000;"></amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="center">
          <div style="padding: 40px; text-align: center;">
            <h1>Prêt à partir ?</h1>
            <p>Découvrez tous les détails (quartiers, visas, sécurité) sur le guide complet.</p>
          </div>
        </amp-story-grid-layer>
        <amp-story-page-outlink layout="nodesc">
          <a href="${SITE_URL}/destinations/${city.slug}">Lire le Guide Complet</a>
        </amp-story-page-outlink>
      </amp-story-page>

    </amp-story>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
