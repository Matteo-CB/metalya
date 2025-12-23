import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma"; // Assure-toi que ce chemin est correct
import { formatDate } from "@/lib/utils";

// Dimensions recommandées
export const size = {
  width: 1200,
  height: 630,
};

export const alt = "Article Metalya";
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  // 1. Récupération des données de l'article
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "black",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          Metalya.
        </div>
      ),
      { ...size }
    );
  }

  // Fallback si pas d'image de couverture
  const bgImage = post.coverImage || "https://metalya.fr/og-image.jpg"; // Remplace par ton URL par défaut

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          backgroundColor: "#000",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* IMAGE DE FOND */}
        {/* Note: Next/OG ne supporte pas 'backgroundImage: url(...)', il faut une balise img absolue */}
        <img
          src={bgImage}
          alt={post.title}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.6, // Légère transparence pour assombrir
          }}
        />

        {/* OVERLAY DEGRADÉ (Pour lisibilité texte) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
          }}
        />

        {/* CONTENU */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Badge Catégorie */}
          {post.categories[0] && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                background: "#a855f7", // Violet Metalya
                color: "white",
                borderRadius: "50px",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "uppercase",
                width: "fit-content",
              }}
            >
              {post.categories[0]}
            </div>
          )}

          {/* Titre */}
          <div
            style={{
              fontSize: "70px",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              maxWidth: "90%",
            }}
          >
            {post.title}
          </div>

          {/* Footer: Auteur & Date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginTop: "10px",
            }}
          >
            {post.author?.image && (
              <img
                src={post.author.image}
                width="60"
                height="60"
                style={{ borderRadius: "50%", border: "2px solid white" }}
              />
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "rgba(255,255,255,0.8)",
                fontSize: "20px",
              }}
            >
              <span style={{ fontWeight: 700, color: "white" }}>
                {post.author?.name}
              </span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Logo Watermark */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "50px",
            fontSize: "40px",
            fontWeight: 800,
            color: "rgba(255,255,255,0.7)",
            zIndex: 10,
          }}
        >
          Metalya.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
