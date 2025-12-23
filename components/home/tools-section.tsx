"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Container } from "@/components/ui/container";
import { tools } from "@/lib/tools-config"; // Le cerveau dynamique

export function ToolsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-neutral-50/50">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <FadeIn>
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-neutral-900 tracking-tight">
              Boîte à Outils <span className="text-neutral-400">Créative</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-xl">
              Des utilitaires puissants (IA, Conversion, SEO) conçus pour
              accélérer votre flux de travail. Rapides, privés et gratuits.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Link
              href="/outils"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:text-indigo-600"
            >
              Voir tous les outils
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>

        {/* Carousel Scroll Container */}
        <div className="relative -mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
          <div className="flex gap-6 w-max md:w-full md:grid md:grid-cols-3 lg:grid-cols-5">
            {tools.map((tool, index) => (
              <FadeIn
                key={tool.title}
                delay={index * 0.1}
                className="snap-center"
              >
                <div className={`relative h-full`}>
                  <Link
                    href={
                      tool.status === "active" || tool.status === "new"
                        ? tool.href
                        : "#"
                    }
                    className={`group relative flex h-[320px] w-[280px] md:w-auto flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      tool.status === "active" || tool.status === "new"
                        ? tool.border
                        : "cursor-default opacity-80 grayscale-[0.5]"
                    }`}
                  >
                    {/* Hover Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:bg-white ${
                            tool.status === "active" || tool.status === "new"
                              ? `${tool.bg} ${tool.color}`
                              : "bg-neutral-100 text-neutral-400"
                          }`}
                        >
                          <tool.icon size={24} />
                        </div>

                        <div className="flex gap-2">
                          {tool.badge && (
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                tool.badge === "Nouveau"
                                  ? "bg-purple-600 text-white border-purple-600"
                                  : "bg-neutral-900 text-white border-neutral-900"
                              }`}
                            >
                              {tool.badge}
                            </span>
                          )}
                          {tool.status === "coming-soon" && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-neutral-100 text-neutral-500 border-neutral-200 flex items-center gap-1">
                              <Lock size={10} /> Bientôt
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-6 font-serif text-xl font-bold text-neutral-900">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-500 group-hover:text-neutral-700">
                        {tool.description}
                      </p>
                    </div>

                    {(tool.status === "active" || tool.status === "new") && (
                      <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        Utiliser
                        <ArrowRight size={14} />
                      </div>
                    )}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
