import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "Metalya Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      title: true,
      coverImage: true,
      categories: true,
      author: { select: { name: true, image: true } },
    },
  });

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const category = post.categories[0] || "ARTICLE";
  const bgImage = post.coverImage || "https://metalya.fr/og-image.jpg";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "60px",
            zIndex: 10,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "#4f46e5",
                color: "white",
                padding: "8px 24px",
                borderRadius: "50px",
                fontSize: 24,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {category}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              METALYA.FR
            </div>
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              maxWidth: "90%",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.title}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            {post.author.image && (
              <img
                src={post.author.image}
                alt={post.author.name || "Auteur"}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: "3px solid white",
                }}
              />
            )}
            <div
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 28,
                fontWeight: 500,
              }}
            >
              Par {post.author.name || "La Rédaction"}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
