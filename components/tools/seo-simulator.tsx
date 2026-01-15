"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, MoreVertical } from "lucide-react";

export function SeoSimulator() {
  const [title, setTitle] = useState("Titre de votre page | Votre Marque");
  const [desc, setDesc] = useState(
    "Ceci est la méta-description qui apparaîtra dans les résultats de recherche Google. Optimisez-la pour augmenter votre taux de clic (CTR)."
  );
  const [url, setUrl] = useState("https://metalya.fr/votre-page");

  // Simulation approximative de la largeur en pixels (Google coupe à ~600px desktop)
  const titlePixelWidth = title.length * 9;
  const isTitleTooLong = title.length > 60;
  const isDescTooLong = desc.length > 160;

  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const domain = url.replace(/^https?:\/\//, "").split("/")[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Metalya SEO Simulator",
    applicationCategory: "SEO Tool",
    description:
      "Visualize your website in Google Search Results pages (SERP).",
    operatingSystem: "Web",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Editor */}
        <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-neutral-100">
          <h3 className="font-bold text-lg text-neutral-900 border-b pb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
              <Globe size={16} />
            </span>
            Éditeur de Métadonnées
          </h3>

          <div>
            <label className="flex justify-between text-sm font-medium text-neutral-700 mb-2">
              <span>Titre SEO</span>
              <span
                className={`text-xs ${
                  isTitleTooLong ? "text-red-500 font-bold" : "text-emerald-600"
                }`}
              >
                {title.length} / 60 caractères
              </span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`font-sans transition-colors ${
                isTitleTooLong
                  ? "border-red-300 focus-visible:ring-red-200"
                  : ""
              }`}
              placeholder="Entrez votre titre ici..."
            />
            <div className="h-1.5 w-full bg-neutral-100 mt-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isTitleTooLong
                    ? "bg-red-500"
                    : title.length > 50
                    ? "bg-orange-400"
                    : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min((title.length / 60) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-neutral-700 mb-2">
              <span>Méta Description</span>
              <span
                className={`text-xs ${
                  isDescTooLong ? "text-red-500 font-bold" : "text-emerald-600"
                }`}
              >
                {desc.length} / 160 caractères
              </span>
            </label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              className={`font-sans resize-none transition-colors ${
                isDescTooLong ? "border-red-300 focus-visible:ring-red-200" : ""
              }`}
              placeholder="Décrivez votre page pour inciter au clic..."
            />
            <div className="h-1.5 w-full bg-neutral-100 mt-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isDescTooLong
                    ? "bg-red-500"
                    : desc.length > 150
                    ? "bg-orange-400"
                    : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min((desc.length / 160) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              URL de la page
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="font-mono text-sm text-neutral-600"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-8">
          <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <span className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            Aperçu Résultats Google (SERP)
          </h3>

          {/* Desktop Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80 hover:shadow-md transition-shadow">
            <p className="text-[10px] text-neutral-400 mb-4 uppercase tracking-widest font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neutral-300" /> Desktop
            </p>
            <div className="font-sans max-w-[600px]">
              <div className="flex items-center gap-3 text-sm text-[#202124] mb-1.5 group cursor-pointer">
                <div className="bg-neutral-100 rounded-full w-[26px] h-[26px] flex items-center justify-center text-[10px] border border-neutral-200">
                  <img
                    src="/icon.png"
                    alt="Logo"
                    className="w-4 h-4 opacity-70"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[#202124] text-sm font-medium">
                    {domain}
                  </span>
                  <span className="text-[#5f6368] text-xs mt-0.5">{url}</span>
                </div>
                <MoreVertical
                  size={14}
                  className="text-neutral-400 ml-auto opacity-0 group-hover:opacity-100"
                />
              </div>

              <h3 className="text-[#1a0dab] text-[20px] leading-[1.3] font-normal cursor-pointer hover:underline truncate mb-1">
                {title}
              </h3>

              <p className="text-[#4d5156] text-sm leading-[1.58] break-words">
                <span className="text-[#70757a]">{currentDate} — </span>
                {desc}
              </p>
            </div>
          </div>

          {/* Mobile Card */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-neutral-200 max-w-[375px] mx-auto lg:mx-0 relative overflow-hidden">
            {/* Notch simulation */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-black rounded-b-xl opacity-5"></div>

            <p className="text-[10px] text-neutral-400 mb-4 uppercase tracking-widest font-bold flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-neutral-300" /> Mobile
            </p>
            <div className="font-sans">
              <div className="flex items-center gap-3 text-sm text-[#202124] mb-3">
                <div className="bg-neutral-100 rounded-full w-8 h-8 flex items-center justify-center text-[10px] border border-neutral-200 shrink-0">
                  <img
                    src="/icon.png"
                    alt="Logo"
                    className="w-5 h-5 opacity-70"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
                <div className="flex flex-col leading-tight overflow-hidden">
                  <span className="text-[#202124] text-sm font-medium truncate">
                    {domain}
                  </span>
                  <span className="text-[#5f6368] text-xs truncate">{url}</span>
                </div>
                <MoreVertical size={16} className="text-neutral-500 ml-auto" />
              </div>

              <h3 className="text-[#1967d2] text-[16px] font-medium leading-tight mb-1 cursor-pointer">
                {title}
              </h3>

              <p className="text-[#4d5156] text-sm leading-[1.5] line-clamp-3">
                <span className="text-[#70757a]">{currentDate} — </span>
                {desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
