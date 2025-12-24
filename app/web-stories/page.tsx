import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { DESTINATIONS } from "@/lib/destinations-data";
import { Container } from "@/components/ui/container";
import { Play, TrendingUp } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export const metadata: Metadata = {
  title: "Web Stories Voyage & Nomadisme | Metalya",
  description:
    "Guides de voyage au format Story. Découvrez Bali, New York ou Tokyo en 15 secondes. Format optimisé pour mobile.",
};

export default function WebStoriesIndex() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 mb-4 rounded-full bg-pink-600/20 text-pink-400 border border-pink-600/30 text-xs font-bold uppercase tracking-widest">
            Format Mobile
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Explorez en{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
              15 Secondes
            </span>
          </h1>
          <p className="text-neutral-400 text-lg">
            Le format le plus rapide pour choisir votre prochaine destination.
            Cliquez sur une carte pour lancer la story.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {DESTINATIONS.map((city, index) => (
            <FadeIn key={city.slug} delay={index * 0.05}>
              <Link
                href={`/web-stories/${city.slug}`}
                className="group relative block aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]"
              >
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                {/* Play Icon (Center) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Play fill="white" className="ml-1 text-white" size={20} />
                  </div>
                </div>

                {/* Content (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {city.badge && (
                    <span className="inline-block px-2 py-0.5 mb-2 rounded bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      {city.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-lg leading-tight mb-1 text-white">
                    {city.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <TrendingUp size={12} className="text-emerald-400" />
                    <span>{city.vibe}</span>
                  </div>
                </div>

                {/* Border Gradient (Instagram style) on Hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-pink-500/50 transition-colors pointer-events-none" />
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </div>
  );
}
