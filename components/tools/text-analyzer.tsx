"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Zap, AlignLeft, Clock, FileText } from "lucide-react";

export function TextAnalyzer() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        chars: 0,
        sentences: 0,
        readingTime: 0,
        score: "En attente...",
        color: "text-neutral-400",
        keywords: [],
      };
    }

    const wordsArray = trimmed.split(/\s+/);
    const words = wordsArray.length;
    const chars = text.length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200); // 200 mots/min (vitesse moyenne)

    // Score de lisibilité simplifié
    let score = "Neutre";
    let color = "text-neutral-500";

    if (words > 0) {
      const avgSentenceLength = words / (sentences || 1);
      if (avgSentenceLength < 10) {
        score = "Très Facile";
        color = "text-emerald-600";
      } else if (avgSentenceLength < 15) {
        score = "Facile";
        color = "text-emerald-500";
      } else if (avgSentenceLength < 20) {
        score = "Normal";
        color = "text-blue-500";
      } else if (avgSentenceLength < 25) {
        score = "Complexe";
        color = "text-orange-500";
      } else {
        score = "Très Difficile";
        color = "text-red-500";
      }
    }

    // Analyse basique de densité de mots clés (mots de > 4 lettres)
    const frequency: Record<string, number> = {};
    wordsArray.forEach((word) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:"()]/g, "");
      if (cleanWord.length > 3) {
        frequency[cleanWord] = (frequency[cleanWord] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        density: Math.round((count / words) * 100),
      }));

    return {
      words,
      chars,
      sentences,
      readingTime,
      score,
      color,
      keywords: topKeywords,
    };
  }, [text]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Metalya Zen Reader",
    applicationCategory: "Utility",
    description:
      "Analyze text readability, word count, and reading time instantly.",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="relative">
            <Textarea
              placeholder="Collez votre texte ici pour l'analyser..."
              className="w-full h-[600px] p-8 text-lg leading-relaxed rounded-3xl border-neutral-200 focus:ring-violet-500 resize-none shadow-inner bg-white"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="absolute bottom-6 right-6 text-xs text-neutral-400 font-medium bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-neutral-100">
              {stats.chars} caractères
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-neutral-100/80">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
              <FileText size={14} /> Statistiques Clés
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 flex items-center gap-2 text-sm">
                  <AlignLeft size={16} /> Mots
                </span>
                <span className="font-mono font-bold text-2xl text-neutral-900">
                  {stats.words}
                </span>
              </div>
              <div className="w-full h-px bg-neutral-100" />
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 flex items-center gap-2 text-sm">
                  Phrases
                </span>
                <span className="font-mono font-bold text-2xl text-neutral-900">
                  {stats.sentences}
                </span>
              </div>
              <div className="w-full h-px bg-neutral-100" />
              <div>
                <p className="text-neutral-500 text-sm mb-1 flex items-center gap-2">
                  <Clock size={16} /> Temps de lecture
                </p>
                <p className="text-4xl font-bold text-violet-600 tracking-tight">
                  {stats.readingTime}{" "}
                  <span className="text-lg text-neutral-400 font-normal">
                    min
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg border border-neutral-100/80">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
              <Zap size={14} /> Analyse IA
            </h3>
            <div className="mb-6">
              <p className="text-neutral-500 text-sm mb-2">
                Score de Lisibilité
              </p>
              <p
                className={`text-2xl font-bold ${stats.color} flex items-center gap-2`}
              >
                {stats.score}
              </p>
            </div>

            {stats.keywords.length > 0 && (
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <p className="text-neutral-500 text-sm mb-3">
                  Mots-clés fréquents
                </p>
                <div className="flex flex-wrap gap-2">
                  {stats.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 text-xs font-medium border border-neutral-200 flex items-center gap-1"
                    >
                      {kw.word}
                      <span className="text-neutral-400 border-l border-neutral-300 pl-1 ml-1">
                        {kw.count}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
