import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { Building2, Server, ShieldCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Mentions Légales | Metalya",
  description:
    "Informations légales, hébergement et propriété intellectuelle de Metalya.",
  robots: { index: false, follow: true },
};

export default function LegalMentionsPage() {
  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header Premium */}
      <div className="relative bg-neutral-900 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <Container className="relative z-10">
          <FadeIn>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-white sm:text-6xl">
              Mentions Légales
            </h1>
            <p className="mt-6 text-lg text-neutral-300 max-w-2xl">
              La transparence est la base de notre relation. Voici les
              informations légales concernant l'éditeur et l'hébergeur de la
              plateforme Metalya.
            </p>
          </FadeIn>
        </Container>
      </div>

      <Container className="py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Section Éditeur */}
          <FadeIn
            delay={0.1}
            className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="font-serif text-2xl text-neutral-900">
                1. Édition du site
              </h2>
            </div>
            <div className="prose prose-neutral text-neutral-600">
              <p>
                En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004
                pour la confiance dans l'économie numérique, il est précisé aux
                utilisateurs du site internet <strong>Metalya</strong>{" "}
                l'identité des intervenants :
              </p>
              <ul className="list-none pl-0 space-y-3 mt-4">
                <li className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Propriétaire & Éditeur
                  </span>
                  <span className="font-medium text-neutral-900">
                    Metalya Media
                  </span>
                </li>
                <li className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Statut
                  </span>
                  <span>Média Numérique Indépendant</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Contact Officiel
                  </span>
                  <a
                    href="mailto:contact@metalya.fr"
                    className="text-indigo-600 hover:underline"
                  >
                    contact@metalya.fr
                  </a>
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* Section Hébergement */}
          <FadeIn
            delay={0.2}
            className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Server className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="font-serif text-2xl text-neutral-900">
                2. Hébergement
              </h2>
            </div>
            <div className="prose prose-neutral text-neutral-600">
              <p>
                L'infrastructure technique de Metalya est assurée par un leader
                mondial du cloud computing, garantissant sécurité et rapidité.
              </p>
              <ul className="list-none pl-0 space-y-3 mt-4">
                <li className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Hébergeur
                  </span>
                  <span className="font-medium text-neutral-900">
                    Vercel Inc.
                  </span>
                </li>
                <li className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Siège Social
                  </span>
                  <span>340 S Lemon Ave #4133 Walnut, CA 91789, USA</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Site Web
                  </span>
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="nofollow"
                    className="text-indigo-600 hover:underline"
                  >
                    https://vercel.com
                  </a>
                </li>
              </ul>
            </div>
          </FadeIn>

          {/* Section Propriété Intellectuelle */}
          <FadeIn
            delay={0.3}
            className="lg:col-span-2 bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-50 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="font-serif text-2xl text-neutral-900">
                3. Propriété Intellectuelle & Droits
              </h2>
            </div>
            <div className="prose prose-neutral text-neutral-600 max-w-none">
              <p>
                L'intégralité du contenu présent sur le site{" "}
                <strong>Metalya</strong>, incluant, de façon non limitative, les
                graphismes, images, textes, vidéos, animations, sons, logos,
                gifs et icônes ainsi que leur mise en forme sont la propriété
                exclusive de la société à l'exception des marques, logos ou
                contenus appartenant à d'autres sociétés partenaires ou auteurs.
              </p>
              <p>
                Toute reproduction, distribution, modification, adaptation,
                retransmission ou publication, même partielle, de ces différents
                éléments est strictement interdite sans l'accord exprès par
                écrit de Metalya Media. Cette représentation ou reproduction,
                par quelque procédé que ce soit, constitue une contrefaçon
                sanctionnée par les articles L.335-2 et suivants du Code de la
                propriété intellectuelle.
              </p>
            </div>
          </FadeIn>

          {/* Section Conception */}
          <FadeIn
            delay={0.4}
            className="lg:col-span-2 bg-neutral-900 p-8 rounded-3xl text-center"
          >
            <p className="text-neutral-400 text-sm uppercase tracking-widest mb-4">
              Conception & Ingénierie Digitale
            </p>
            <h3 className="text-2xl font-serif text-white mb-2">Hidden Lab</h3>
            <p className="text-neutral-400 mb-6">
              Agence experte en développement web haute performance et design
              UI/UX.
            </p>
            <a
              href="https://hiddenlab.fr"
              target="_blank"
              className="inline-flex px-6 py-3 bg-white text-neutral-900 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors"
            >
              Visiter le site de l'agence
            </a>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
