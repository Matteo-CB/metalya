"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { DESTINATIONS } from "@/lib/destinations-data";
import { Play, Zap } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export function StoriesPreview() {
  // On prend 5 destinations aléatoires ou les top tendances
  const stories = DESTINATIONS.slice(0, 5);

  return (
    <section className="py-12 border-b border-neutral-100 bg-white">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-100 text-pink-600 rounded-full">
              <Zap size={20} fill="currentColor" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              Stories à la une
            </h2>
          </div>
          <Link
            href="/web-stories"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Tout voir
          </Link>
        </div>

        {/* Scroll Horizontal Container */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 snap-x">
          {/* Intro Card */}
          <div className="snap-start shrink-0 w-32 md:w-40 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-lg">
            <span className="text-2xl mb-2">👋</span>
            <p className="text-xs font-bold leading-tight mb-2">
              Format <br /> Mobile
            </p>
            <div className="h-1 w-8 bg-white/20 rounded-full" />
          </div>

          {/* Story Cards */}
          {stories.map((city, i) => (
            <FadeIn
              key={city.slug}
              delay={i * 0.1}
              className="snap-start shrink-0"
            >
              <Link
                href={`/web-stories/${city.slug}`}
                className="group block relative w-32 h-56 md:w-40 md:h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 150px, 200px"
                />

                {/* Gradient Border (Instagram Style) */}
                <div className="absolute inset-0 rounded-2xl border-[3px] border-transparent group-hover:border-pink-500/50 transition-colors z-20 pointer-events-none" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                {/* Play Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Play size={16} fill="white" className="text-white ml-1" />
                </div>

                {/* Content */}
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <p className="text-white text-sm font-bold leading-tight shadow-black drop-shadow-md">
                    {city.name}
                  </p>
                  <p className="text-white/70 text-[10px] uppercase tracking-wider font-medium mt-1">
                    {city.country}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
