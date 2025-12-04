import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://metalya.fr";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const storyUrl = `${SITE_URL}/web-stories/${post.slug}`;
  const postUrl = `${SITE_URL}/posts/${post.slug}`;
  const pubDate = new Date(post.createdAt).toISOString();
  const authorName = post.author.name || "Metalya";
  const coverImage = post.coverImage || `${SITE_URL}/og-image.jpg`;

  const html = `<!doctype html>
<html amp lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <link rel="canonical" href="${postUrl}">
    <title>${post.title}</title>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
    <style amp-custom>
      amp-story { font-family: 'Georgia', serif; }
      h1 { font-weight: bold; font-size: 2.2em; line-height: 1.2; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
      p { font-size: 1.2em; line-height: 1.5; color: #fff; text-shadow: 0 1px 5px rgba(0,0,0,0.5); }
      .category { font-size: 0.8em; letter-spacing: 2px; text-transform: uppercase; color: #a5b4fc; margin-bottom: 10px; display: block; font-weight: bold; }
      .btn { background: #fff; color: #000; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 0.9em; margin-top: 20px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
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
          <amp-img src="${coverImage}" width="720" height="1280" layout="responsive" alt="${
    post.title
  }"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill">
          <div style="background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);"></div>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom">
          <div style="padding: 30px; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; height: 100%;">
            <span class="category">Metalya • ${
              post.categories[0] || "Article"
            }</span>
            <h1>${post.title}</h1>
            <p>Par ${authorName}</p>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

      <amp-story-page id="intro">
        <amp-story-grid-layer template="fill">
           <amp-img src="${coverImage}" width="720" height="1280" layout="responsive" animate-in="pan-left" animate-in-duration="20s"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill" style="background: rgba(0,0,0,0.7);">
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="center">
          <div style="padding: 40px; text-align: center;">
            <p>${post.excerpt}</p>
          </div>
        </amp-story-grid-layer>
        <amp-story-page-outlink layout="nodesc">
          <a href="${postUrl}">Lire l'article complet</a>
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
