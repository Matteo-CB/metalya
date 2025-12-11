import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Clock, Calendar } from "lucide-react";
import { Post } from "@prisma/client";
import { FadeIn } from "@/components/ui/fade-in";
import { formatDate, formatCategory } from "@/lib/utils";

interface HeroPostProps {
  post: Post;
}

export function HeroPost({ post }: HeroPostProps) {
  return (
    <section className="relative mb-20 md:mb-32 group w-full">
      {/* Fond d'ambiance plus large pour connecter les deux blocs */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50/40 blur-[120px] opacity-60" />

      {/* CHANGEMENT MAJEUR : lg:grid-cols-2 (50% / 50%) 
         Fini le ratio 8/4 qui écrasait le texte. 
      */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
        {/* --- BLOC IMAGE (Gauche) --- */}
        <div className="relative w-full perspective-1000">
          <FadeIn>
            <Link
              href={`/posts/${post.slug}`}
              className="block relative overflow-hidden rounded-[2rem] shadow-2xl shadow-neutral-200 transition-all duration-500 hover:-translate-y-1 hover:shadow-indigo-500/10 aspect-[16/10] lg:aspect-square xl:aspect-[4/3]"
              aria-label={`Lire l'article : ${post.title}`}
            >
              <Image
                src={post.coverImage || "/placeholder.jpg"}
                alt={post.title}
                fill
                priority
                className="object-cover transition-transform duration-1000 ease-out will-change-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Badge Flottant */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-900 shadow-lg backdrop-blur-md">
                <Sparkles size={14} className="text-amber-500 fill-amber-500" />
                <span>À la une</span>
              </div>
            </Link>
          </FadeIn>
        </div>

        {/* --- BLOC TEXTE (Droite) --- */}
        {/* On utilise flex-col pour bien centrer verticalement.
           Le texte a maintenant 50% de la largeur du container container, 
           ce qui laisse ~600px sur un écran large. Largement suffisant.
        */}
        <div className="flex flex-col justify-center relative px-2 md:px-0">
          <FadeIn delay={0.1}>
            <div className="space-y-8">
              {/* Métadonnées aérées */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                <span className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100/50">
                  {post.categories?.[0]
                    ? formatCategory(post.categories[0])
                    : "Éditorial"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {post.readingTime} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatDate(post.createdAt)}
                </span>
              </div>

              {/* TITRE : text-balance assure que les lignes sont équilibrées.
                 La taille s'adapte (text-4xl -> 5xl -> 6xl) sans casser la mise en page.
              */}
              <h2 className="font-serif text-4xl font-medium leading-[1.15] text-neutral-900 md:text-5xl lg:text-6xl text-balance">
                <Link
                  href={`/posts/${post.slug}`}
                  className="group/title inline-block transition-colors hover:text-indigo-900"
                >
                  {post.title}
                </Link>
              </h2>

              {/* Extrait : Plus grand (text-lg) et plus lisible */}
              <p className="text-lg leading-relaxed text-neutral-600 text-pretty line-clamp-3 md:line-clamp-4 lg:max-w-xl">
                {post.excerpt}
              </p>

              {/* CTA */}
              <div className="pt-4">
                <Link
                  href={`/posts/${post.slug}`}
                  className="group/btn inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-neutral-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white transition-all duration-300 group-hover/btn:bg-indigo-600 group-hover/btn:scale-110 group-hover/btn:shadow-lg group-hover/btn:shadow-indigo-500/30">
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:-rotate-45" />
                  </div>
                  <span className="relative">
                    Lire l&apos;article
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-neutral-900 transition-all duration-300 group-hover/btn:w-full"></span>
                  </span>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
