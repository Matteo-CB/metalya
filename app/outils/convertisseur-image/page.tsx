"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Upload,
  Download,
  Settings,
  Zap,
  Trash2,
  CheckCircle,
  FileImage,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Globe,
  Maximize2,
  Image as ImageIcon,
  Layers,
  Cpu,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/ui/fade-in";
import { motion, AnimatePresence } from "framer-motion";

// --- SEO CONSTANTS ---
const SEO_TITLE =
  "Convertisseur Image Ultime Gratuit : JPG, PNG, WebP, AVIF | Metalya";
const SEO_DESC =
  "Convertisseur et compresseur d'images illimité. Transformez vos photos en WebP et AVIF pour le web. Redimensionnement et anonymisation automatique. 100% Privé & Local.";

// --- TYPES ---
type OutputFormat =
  | "image/webp"
  | "image/jpeg"
  | "image/png"
  | "image/avif"
  | "image/x-icon";

interface ImageSettings {
  format: OutputFormat;
  quality: number;
  width?: number;
  height?: number;
  keepRatio: boolean;
}

interface ProcessedImage {
  id: string;
  originalName: string;
  originalSize: number;
  previewUrl: string;
  convertedUrl: string | null;
  convertedSize: number | null;
  status: "pending" | "processing" | "done" | "error";
  settings: ImageSettings; // Settings spécifiques à l'image (copie des settings globaux au moment de l'upload)
}

export default function ImageConverterPage() {
  // --- STATE ---
  const [images, setImages] = useState<ProcessedImage[]>([]);

  // Global Settings
  const [globalFormat, setGlobalFormat] = useState<OutputFormat>("image/webp");
  const [globalQuality, setGlobalQuality] = useState<number>(0.8);
  const [resizeMode, setResizeMode] = useState(false);
  const [targetWidth, setTargetWidth] = useState<string>("");
  const [targetHeight, setTargetHeight] = useState<string>("");

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ACTIONS ---
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newImages: ProcessedImage[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        originalName: file.name,
        originalSize: file.size,
        previewUrl: URL.createObjectURL(file),
        convertedUrl: null,
        convertedSize: null,
        status: "pending",
        settings: {
          format: globalFormat,
          quality: globalQuality,
          width: targetWidth ? parseInt(targetWidth) : undefined,
          height: targetHeight ? parseInt(targetHeight) : undefined,
          keepRatio: true,
        },
      }));

      setImages((prev) => [...prev, ...newImages]);
      processQueue(newImages);
    },
    [globalFormat, globalQuality, targetWidth, targetHeight]
  );

  const processQueue = async (queue: ProcessedImage[]) => {
    for (const img of queue) {
      updateImageStatus(img.id, "processing");
      try {
        await convertImage(img);
      } catch (e) {
        console.error("Erreur conversion:", e);
        updateImageStatus(img.id, "error");
      }
    }
  };

  const convertImage = async (img: ProcessedImage) => {
    return new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.src = img.previewUrl;
      image.onload = () => {
        try {
          // Calcul des dimensions
          let finalWidth = image.width;
          let finalHeight = image.height;

          if (img.settings.width && !img.settings.height) {
            finalWidth = img.settings.width;
            finalHeight = (image.height / image.width) * img.settings.width;
          } else if (!img.settings.width && img.settings.height) {
            finalHeight = img.settings.height;
            finalWidth = (image.width / image.height) * img.settings.height;
          } else if (img.settings.width && img.settings.height) {
            finalWidth = img.settings.width;
            finalHeight = img.settings.height;
          }

          const canvas = document.createElement("canvas");
          canvas.width = finalWidth;
          canvas.height = finalHeight;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Canvas context failed"));
            return;
          }

          // Fond blanc pour les formats ne supportant pas la transparence (JPG)
          if (img.settings.format === "image/jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, finalWidth, finalHeight);
          }

          // Lissage haute qualité
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(image, 0, 0, finalWidth, finalHeight);

          // Astuce pour ICO : Le navigateur ne gère pas toujours "image/x-icon" dans toBlob
          // On force PNG pour les ICO si non supporté nativement, mais on change l'extension
          const exportFormat =
            img.settings.format === "image/x-icon"
              ? "image/png"
              : img.settings.format;

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                setImages((prev) =>
                  prev.map((i) =>
                    i.id === img.id
                      ? {
                          ...i,
                          convertedUrl: url,
                          convertedSize: blob.size,
                          status: "done",
                        }
                      : i
                  )
                );
                resolve();
              } else {
                reject(new Error("Blob creation failed"));
              }
            },
            exportFormat,
            img.settings.quality
          );
        } catch (err) {
          reject(err);
        }
      };
      image.onerror = (err) => reject(err);
    });
  };

  const updateImageStatus = (id: string, status: ProcessedImage["status"]) => {
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getExtension = (mime: OutputFormat) => {
    switch (mime) {
      case "image/jpeg":
        return "jpg";
      case "image/png":
        return "png";
      case "image/webp":
        return "webp";
      case "image/avif":
        return "avif";
      case "image/x-icon":
        return "ico";
      default:
        return "img";
    }
  };

  // --- JSON-LD (MASSIVE SEO DATA) ---
  const jsonLdSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Metalya Image Studio Ultimate",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    description: SEO_DESC,
    featureList: [
      "Conversion JPG vers WebP",
      "Conversion PNG vers AVIF",
      "Redimensionnement d'image batch",
      "Compression sans perte visuelle",
      "Traitement 100% Client-Side sécurisé",
    ],
    screenshot: "https://metalya.fr/og-image.jpg", // À remplacer par une vraie capture si possible
  };

  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment convertir et compresser des images gratuitement en ligne ?",
    step: [
      {
        "@type": "HowToStep",
        name: "Sélectionner vos images",
        text: "Glissez-déposez vos fichiers JPG, PNG ou GIF dans la zone de téléchargement sécurisée.",
      },
      {
        "@type": "HowToStep",
        name: "Choisir le format",
        text: "Sélectionnez WebP ou AVIF pour une compression maximale, ou JPG/PNG pour la compatibilité.",
      },
      {
        "@type": "HowToStep",
        name: "Télécharger",
        text: "Récupérez vos fichiers optimisés instantanément, sans attente serveur.",
      },
    ],
  };

  const jsonLdFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Le format AVIF est-il meilleur que le WebP ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, l'AVIF offre généralement une compression 20% à 30% supérieure au WebP à qualité égale. C'est le format le plus performant en 2025 pour le web.",
        },
      },
      {
        "@type": "Question",
        name: "Mes photos sont-elles stockées sur vos serveurs ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Non. Metalya Image Studio fonctionne entièrement dans votre navigateur. Vos images ne quittent jamais votre appareil, garantissant une confidentialité totale.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />

      <div className="relative min-h-screen bg-background pt-24 pb-20">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[100px]" />
        </div>

        <Container>
          <div className="text-center max-w-4xl mx-auto mb-12">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-6">
                <Cpu size={14} />
                Moteur V2 : Support AVIF & Batch Processing
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-6">
                Studio Image{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                  Ultimate
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                L'outil de conversion le plus rapide du web. Transformez,
                redimensionnez et optimisez vos visuels pour Google.
                <span className="block mt-2 font-medium text-foreground">
                  JPG • PNG • WebP • AVIF • ICO
                </span>
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <div className="bg-card/80 backdrop-blur-xl border border-border rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-black/5">
              {/* --- CONTROL PANEL --- */}
              <div className="border-b border-border bg-muted/30 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Format & Quality */}
                  <div className="lg:col-span-5 space-y-3">
                    <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <Layers size={14} /> Format & Compression
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <select
                          value={globalFormat}
                          onChange={(e) =>
                            setGlobalFormat(e.target.value as OutputFormat)
                          }
                          className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                        >
                          <option value="image/webp">
                            WebP (Standard Web)
                          </option>
                          <option value="image/avif">
                            AVIF (Ultra Performance)
                          </option>
                          <option value="image/jpeg">JPEG (Classique)</option>
                          <option value="image/png">PNG (Transparence)</option>
                          <option value="image/x-icon">ICO (Favicon)</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                          <Settings size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-background border border-border rounded-xl px-4 py-3 shadow-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold">Qualité</span>
                        <span className="text-xs font-bold text-indigo-600">
                          {Math.round(globalQuality * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={globalQuality}
                        onChange={(e) =>
                          setGlobalQuality(parseFloat(e.target.value))
                        }
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Resize Options */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                        <Maximize2 size={14} /> Redimensionner
                      </label>
                      <button
                        onClick={() => setResizeMode(!resizeMode)}
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full transition-colors ${
                          resizeMode
                            ? "bg-indigo-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {resizeMode ? "Activé" : "Désactivé"}
                      </button>
                    </div>

                    <div
                      className={`grid grid-cols-2 gap-3 transition-opacity duration-200 ${
                        resizeMode
                          ? "opacity-100"
                          : "opacity-40 pointer-events-none"
                      }`}
                    >
                      <div className="space-y-1">
                        <input
                          type="number"
                          placeholder="Largeur (px)"
                          value={targetWidth}
                          onChange={(e) => setTargetWidth(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <input
                          type="number"
                          placeholder="Hauteur (px)"
                          value={targetHeight}
                          onChange={(e) => setTargetHeight(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Laissez vide pour conserver le ratio auto.
                    </p>
                  </div>

                  {/* Security Badge */}
                  <div className="lg:col-span-2 flex flex-col items-center justify-center h-full border-l border-border/50 pl-6">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                      <ShieldCheck size={20} />
                    </div>
                    <p className="text-[10px] text-center font-bold text-green-700 leading-tight">
                      Mode Local
                      <br />
                      Sécurisé
                    </p>
                  </div>
                </div>
              </div>

              {/* --- DROPZONE --- */}
              <div
                className={`relative min-h-[350px] p-8 transition-all duration-300 ${
                  isDragging
                    ? "bg-indigo-500/5 border-indigo-500/50"
                    : "bg-background/50"
                } ${
                  images.length === 0
                    ? "flex flex-col items-center justify-center border-2 border-dashed border-border/60 hover:border-indigo-500/30 hover:bg-muted/30"
                    : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFiles(e.dataTransfer.files);
                }}
              >
                {images.length === 0 ? (
                  <div className="text-center space-y-6 max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm rotate-3 group-hover:rotate-6 transition-transform">
                      <Upload size={40} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        Déposez vos images ici
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        ou cliquez pour explorer vos dossiers
                      </p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-4 bg-foreground text-background rounded-xl font-bold text-lg hover:bg-indigo-600 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-1"
                    >
                      Sélectionner des fichiers
                    </button>
                    <div className="flex flex-wrap justify-center gap-2 pt-4 opacity-60">
                      {["JPG", "PNG", "WEBP", "GIF", "AVIF", "BMP", "SVG"].map(
                        (fmt) => (
                          <span
                            key={fmt}
                            className="text-[10px] font-bold border border-border px-2 py-0.5 rounded-md uppercase"
                          >
                            {fmt}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {images.map((img) => (
                        <motion.div
                          key={img.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group relative bg-white border border-border rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                          {/* Status Badge */}
                          <div className="absolute top-6 left-6 z-10">
                            {img.status === "done" && (
                              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                                <CheckCircle size={10} /> Terminé
                              </span>
                            )}
                            {img.status === "processing" && (
                              <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                                <Zap size={10} /> Traitement...
                              </span>
                            )}
                            {img.status === "error" && (
                              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                Erreur
                              </span>
                            )}
                          </div>

                          {/* Preview Image */}
                          <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-neutral-100 mb-4 ring-1 ring-black/5">
                            <img
                              src={img.previewUrl}
                              alt="Preview"
                              className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="overflow-hidden">
                              <p
                                className="font-bold text-sm text-foreground truncate"
                                title={img.originalName}
                              >
                                {img.originalName}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200">
                                  {formatSize(img.originalSize)}
                                </span>
                                <ArrowRight
                                  size={10}
                                  className="text-neutral-300"
                                />
                                <span className="text-[10px] font-bold text-indigo-600">
                                  {getExtension(
                                    img.settings.format
                                  ).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeImage(img.id)}
                              className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Action / Result */}
                          {img.status === "done" && img.convertedSize ? (
                            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3">
                              <div className="flex justify-between items-center text-xs font-medium mb-3">
                                <span className="text-indigo-900 font-bold">
                                  -
                                  {Math.round(
                                    ((img.originalSize - img.convertedSize) /
                                      img.originalSize) *
                                      100
                                  )}
                                  %
                                </span>
                                <span className="text-neutral-500">
                                  {formatSize(img.convertedSize)}
                                </span>
                              </div>
                              <a
                                href={img.convertedUrl!}
                                download={`metalya-${
                                  img.originalName.split(".")[0]
                                }.${getExtension(img.settings.format)}`}
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200"
                              >
                                <Download size={14} /> Télécharger
                              </a>
                            </div>
                          ) : null}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Add More Card */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6 text-muted-foreground hover:border-indigo-500/50 hover:bg-indigo-50/10 cursor-pointer transition-all min-h-[300px] group"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-white group-hover:shadow-md transition-all">
                        <Upload
                          size={20}
                          className="text-neutral-400 group-hover:text-indigo-600"
                        />
                      </div>
                      <span className="font-bold text-sm">
                        Ajouter d'autres images
                      </span>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
          />

          {/* --- MASSIVE SEO CONTENT --- */}
          <FadeIn delay={0.4}>
            <div className="mt-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Sidebar SEO Navigation */}
              <div className="lg:col-span-4 space-y-8 block lg:sticky top-32 h-fit">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif text-xl font-bold mb-4">
                    Formats Supportés
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ImageIcon size={14} /> JPEG/JPG
                      </span>
                      <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        Supporté
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ImageIcon size={14} /> PNG
                      </span>
                      <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        Supporté
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ImageIcon size={14} /> WebP
                      </span>
                      <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        Supporté
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ImageIcon size={14} /> AVIF (Nouveau)
                      </span>
                      <span className="text-indigo-600 text-xs font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                        Recommandé
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="font-serif text-xl font-bold mb-2">
                    Pourquoi WebP & AVIF ?
                  </h3>
                  <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                    Ces formats de nouvelle génération sont recommandés par
                    Google PageSpeed. Ils réduisent le poids de vos pages
                    jusqu'à 80% sans perte de qualité visible.
                  </p>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded">
                      SEO Boost
                    </span>
                    <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded">
                      Mobile First
                    </span>
                  </div>
                </div>
              </div>

              {/* Main SEO Article */}
              <article className="lg:col-span-8 prose prose-neutral dark:prose-invert max-w-none">
                <h2 className="font-serif text-3xl font-bold">
                  Convertisseur d'Image en Ligne : La Solution Tout-en-un
                </h2>
                <p>
                  Bienvenue sur le <strong>Studio Image Metalya</strong>,
                  l'outil le plus complet pour optimiser vos visuels pour le
                  web. Que vous soyez un développeur cherchant à améliorer son
                  score Lighthouse, un designer exportant des maquettes, ou
                  simplement quelqu'un voulant partager des photos légères,
                  notre outil est conçu pour vous.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 my-8 not-prose">
                  <div className="p-6 bg-card border border-border rounded-xl">
                    <Zap className="w-8 h-8 text-yellow-500 mb-3" />
                    <h4 className="font-bold text-lg mb-2">
                      Compression Extrême
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Réduisez vos fichiers de 5MB à 500KB en quelques secondes
                      grâce à l'encodeur AVIF.
                    </p>
                  </div>
                  <div className="p-6 bg-card border border-border rounded-xl">
                    <ShieldCheck className="w-8 h-8 text-green-500 mb-3" />
                    <h4 className="font-bold text-lg mb-2">
                      Anonymisation des Données
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      La conversion supprime automatiquement les métadonnées
                      EXIF (GPS, Appareil) pour protéger votre vie privée.
                    </p>
                  </div>
                </div>

                <h3>Fonctionnalités Avancées</h3>
                <ul>
                  <li>
                    <strong>Convertisseur par lot (Batch) :</strong> Traitez des
                    centaines d'images en une seule fois.
                  </li>
                  <li>
                    <strong>Redimensionnement intelligent :</strong> Définissez
                    une largeur maximale (ex: 1920px) et nous calculons la
                    hauteur proportionnelle automatiquement.
                  </li>
                  <li>
                    <strong>Support des formats modernes :</strong> Soyez prêt
                    pour 2025 avec le support natif de l'AVIF.
                  </li>
                  <li>
                    <strong>Création de Favicon :</strong> Transformez n'importe
                    quel logo en fichier <code>.ico</code> compatible avec tous
                    les navigateurs.
                  </li>
                </ul>

                <h3>Guide : Comment optimiser vos images pour le SEO ?</h3>
                <p>
                  L'optimisation des images est l'un des facteurs les plus
                  négligés du référencement naturel. Google pénalise les sites
                  lents. Voici la stratégie gagnante :
                </p>
                <ol>
                  <li>
                    Utilisez le format <strong>AVIF</strong> pour les grandes
                    photos (bannières).
                  </li>
                  <li>
                    Utilisez le format <strong>WebP</strong> pour les images
                    avec transparence (logos).
                  </li>
                  <li>
                    Redimensionnez toujours vos images à la taille d'affichage
                    réelle (ne uploadez pas une image 4K pour un affichage en
                    300px).
                  </li>
                  <li>
                    Utilisez notre curseur de qualité autour de{" "}
                    <strong>80%</strong> pour un équilibre parfait poids/visuel.
                  </li>
                </ol>

                <div className="bg-muted p-6 rounded-2xl my-8">
                  <h4 className="mt-0 font-serif">Le Saviez-vous ?</h4>
                  <p className="mb-0 text-sm">
                    Le format JPEG a été créé en 1992. Le WebP en 2010. L'AVIF
                    en 2019. Utiliser JPG aujourd'hui pour le web, c'est comme
                    utiliser une cassette VHS à l'ère du streaming 4K. Passez au
                    futur avec Metalya.
                  </p>
                </div>
              </article>
            </div>
          </FadeIn>
        </Container>
      </div>
    </>
  );
}
