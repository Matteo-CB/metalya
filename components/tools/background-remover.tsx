"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  Scissors,
  Zap,
  Wand2,
  Sparkles,
  ScanEye,
  Eraser,
  ShieldCheck,
  AlertCircle,
  Layers,
  Smartphone,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { motion, AnimatePresence } from "framer-motion";

interface ProcessedImage {
  originalUrl: string;
  processedUrl: string | null;
  name: string;
  size: number;
}

// Types pour la configuration
type ImglyConfig = {
  progress?: (key: string, current: number, total: number) => void;
  debug?: boolean;
  model?: "isnet" | "isnet_fp16" | "isnet_quint8";
  device?: "gpu" | "cpu";
};

export function BackgroundRemover() {
  // --- STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  // Détection mobile au montage pour optimiser le modèle
  useEffect(() => {
    const checkMobile = () => {
      const userAgent =
        typeof window.navigator === "undefined" ? "" : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(/Android/i) ||
          userAgent.match(/webOS/i) ||
          userAgent.match(/iPhone/i) ||
          userAgent.match(/iPad/i) ||
          userAgent.match(/iPod/i) ||
          userAgent.match(/BlackBerry/i) ||
          userAgent.match(/Windows Phone/i) ||
          window.innerWidth < 768
      );
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- ACTIONS ---

  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile) return;
    setResult(null);
    setFile(selectedFile);
    setProgress(0);

    const url = URL.createObjectURL(selectedFile);
    setResult({
      originalUrl: url,
      processedUrl: null,
      name: selectedFile.name,
      size: selectedFile.size,
    });
  }, []);

  // Fonction utilitaire pour réduire la taille de l'image AVANT traitement (Crucial pour mobile)
  const resizeImageForMobile = async (file: File): Promise<Blob> => {
    if (!isMobile && file.size < 5 * 1024 * 1024) return file; // Pas besoin sur desktop si < 5MB

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Limite max pour mobile : 1500px (suffisant et évite le crash RAM)
        const maxDim = isMobile ? 1500 : 2500;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        } else {
          // Si l'image est petite, on retourne le fichier original
          resolve(file);
          return;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else resolve(file); // Fallback
            },
            file.type,
            0.9
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
    });
  };

  const processImage = async () => {
    if (!file || !result) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      setLoadingStep(
        isMobile
          ? "Optimisation pour mobile..."
          : "Initialisation du Moteur Neural..."
      );
      setProgress(5);

      // 1. Optimisation préalable de l'image (Anti-Crash)
      const optimizedBlob = await resizeImageForMobile(file);

      const imgly = await import("@imgly/background-removal");

      // 2. Configuration Adaptative : Quint8 pour Mobile (léger), Isnet pour Desktop (Qualité max)
      const config: ImglyConfig = {
        progress: (key: string, current: number, total: number) => {
          const percentage = Math.round((current / total) * 100);
          if (key.includes("fetch")) {
            setLoadingStep(`Chargement IA (${percentage}%)...`);
            setProgress(10 + percentage * 0.4);
          } else if (key.includes("compute")) {
            setLoadingStep(`Analyse sémantique...`);
            setProgress(50 + percentage * 0.5);
          }
        },
        debug: false,
        // SUR MOBILE : On force le modèle compressé (quint8) pour diviser la RAM par 4
        // SUR DESKTOP : On utilise le modèle standard
        model: isMobile ? "isnet_quint8" : "isnet",
      };

      setLoadingStep("Détourage haute précision en cours...");

      // @ts-ignore
      const blob = await imgly.removeBackground(optimizedBlob, config);
      const url = URL.createObjectURL(blob);

      setResult((prev) => (prev ? { ...prev, processedUrl: url } : null));
      setProgress(100);
    } catch (error) {
      console.error("Erreur détourage:", error);
      setLoadingStep("Mémoire insuffisante. Essayez une image plus petite.");
      // Petit délai pour laisser l'utilisateur lire l'erreur avant de reset
      setTimeout(() => setIsProcessing(false), 3000);
      return;
    } finally {
      // Sur succès immédiat, on laisse l'animation finir proprement
      if (progress === 100) {
        setTimeout(() => setIsProcessing(false), 500);
      } else {
        setIsProcessing(false);
      }
    }
  };

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!imageContainerRef.current) return;
    const { left, width } = imageContainerRef.current.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  return (
    <div className="relative">
      {/* --- HERO HEADER --- */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-xs font-bold uppercase tracking-widest text-purple-700 mb-8 shadow-sm">
            <Sparkles size={14} className="text-purple-600" />
            IA Embarquée v2.0 • 100% Gratuit
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-8 text-neutral-900">
            Studio{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Détourage
            </span>
          </h1>

          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Supprimez l'arrière-plan de n'importe quelle image avec une
            précision chirurgicale. Aucune donnée n'est envoyée dans le cloud.
          </p>
        </FadeIn>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <FadeIn delay={0.2}>
        <div className="bg-white border border-neutral-200 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative group">
          <div className="flex-1 p-6 md:p-12 flex items-center justify-center relative z-10 bg-neutral-50/50">
            {/* ETAT 1: DRAG & DROP ZONE */}
            <AnimatePresence mode="wait">
              {!file && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`w-full max-w-2xl border-2 border-dashed rounded-[2rem] p-8 md:p-16 text-center transition-all duration-300 cursor-pointer ${
                    isDragging
                      ? "border-purple-500 bg-purple-50 scale-[1.02]"
                      : "border-neutral-300 hover:border-purple-400 hover:bg-white"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files[0])
                      handleFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-100 to-pink-100 border border-white rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <Scissors
                      size={32}
                      className="text-purple-600 md:w-9 md:h-9"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-4">
                    Glissez votre image
                  </h3>
                  <p className="text-neutral-500 mb-8">
                    JPG, PNG ou WebP {isMobile ? "(Optimisé Mobile)" : ""}
                  </p>
                  <button className="px-8 py-4 bg-neutral-900 text-white rounded-full font-bold text-sm tracking-wide hover:bg-neutral-800 transition-colors shadow-lg w-full md:w-auto">
                    Parcourir les fichiers
                  </button>
                </motion.div>
              )}

              {/* ETAT 2: WORKSPACE & RESULT */}
              {file && result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-5xl"
                >
                  {/* Toolbar */}
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                      <button
                        onClick={() => {
                          setFile(null);
                          setResult(null);
                        }}
                        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100"
                      >
                        <Eraser size={16} />{" "}
                        <span className="hidden sm:inline">Changer</span>
                      </button>
                      <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
                      <span className="text-xs px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-full text-neutral-600 font-mono truncate max-w-[150px]">
                        {file.name}
                      </span>
                    </div>

                    {!result.processedUrl && !isProcessing && (
                      <button
                        onClick={processImage}
                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                      >
                        <Wand2
                          size={18}
                          className="group-hover:rotate-12 transition-transform"
                        />
                        Détourer{" "}
                        {isMobile && (
                          <span className="text-[10px] bg-white/20 px-1 rounded ml-1">
                            LITE
                          </span>
                        )}
                      </button>
                    )}

                    {result.processedUrl && (
                      <a
                        href={result.processedUrl}
                        download={`metalya-detourage-${
                          result.name.split(".")[0]
                        }.png`}
                        className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                      >
                        <Download size={18} />
                        Télécharger
                      </a>
                    )}
                  </div>

                  {/* Image Viewer Container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-100 min-h-[300px] md:min-h-[400px]">
                    {/* Checkerboard Background */}
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                        backgroundSize: "20px 20px",
                        backgroundPosition:
                          "0 0, 0 10px, 10px -10px, -10px 0px",
                      }}
                    />

                    {/* Processing Overlay */}
                    <AnimatePresence>
                      {isProcessing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-8"
                        >
                          <div className="w-full max-w-sm">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">
                              <span>
                                Traitement {isMobile ? "Mobile" : "IA"}
                              </span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden relative">
                              <motion.div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut" }}
                              />
                            </div>
                            <p className="text-center text-neutral-500 mt-4 font-medium animate-pulse text-sm">
                              {loadingStep}
                            </p>
                            {isMobile && progress < 20 && (
                              <p className="text-center text-xs text-neutral-400 mt-2">
                                Ne quittez pas la page...
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Interactive Comparison Slider */}
                    <div
                      className="relative w-full aspect-square md:aspect-[16/9] select-none cursor-ew-resize group touch-none"
                      ref={imageContainerRef}
                      onMouseMove={
                        result.processedUrl ? handleSliderMove : undefined
                      }
                      onTouchMove={
                        result.processedUrl ? handleSliderMove : undefined
                      }
                    >
                      {/* 1. Base Layer: Result */}
                      <img
                        src={result.processedUrl || result.originalUrl}
                        alt="Résultat sans fond"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      />

                      {/* 2. Top Layer: Original (Clipped) */}
                      {result.processedUrl && (
                        <div
                          className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-[5px_0_20px_rgba(0,0,0,0.2)]"
                          style={{ width: `${sliderPosition}%` }}
                        >
                          <img
                            src={result.originalUrl}
                            alt="Original"
                            className="absolute inset-0 w-full h-full object-contain max-w-none pointer-events-none"
                          />
                          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-neutral-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/50 shadow-sm">
                            Original
                          </div>
                        </div>
                      )}

                      {/* 3. Slider Handle */}
                      {result.processedUrl && (
                        <div
                          className="absolute top-0 bottom-0 w-10 flex items-center justify-center cursor-ew-resize -ml-5 z-20 group-hover:scale-110 transition-transform"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <div className="w-10 h-10 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center justify-center text-purple-600 border-4 border-white">
                            <ScanEye size={18} />
                          </div>
                        </div>
                      )}

                      {/* 4. Result Label */}
                      {result.processedUrl && (
                        <div className="absolute bottom-4 right-4 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                          Résultat
                        </div>
                      )}
                    </div>
                  </div>

                  {result.processedUrl && (
                    <div className="flex justify-center mt-6">
                      <p className="text-sm text-neutral-500 flex items-center gap-2">
                        <Sparkles size={14} className="text-yellow-500" />
                        Glissez le curseur pour comparer
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </FadeIn>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* --- INFO SECTION --- */}
      <FadeIn delay={0.4}>
        <div className="mt-32 border-t border-neutral-200 pt-20">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white border border-neutral-200 p-8 rounded-3xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 text-yellow-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">
                Vitesse Éclair
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Traitement via WebAssembly. Optimisé pour{" "}
                {isMobile ? "votre mobile" : "la performance"}.
              </p>
            </div>
            <div className="bg-white border border-neutral-200 p-8 rounded-3xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">
                100% Privé
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Vos images ne sont jamais uploadées. Tout se passe localement
                sur votre {isMobile ? "téléphone" : "ordinateur"}.
              </p>
            </div>
            <div className="bg-white border border-neutral-200 p-8 rounded-3xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">
                Mobile First
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Notre IA s'adapte automatiquement à la puissance de votre
                appareil pour éviter les crashs.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center font-serif text-3xl md:text-4xl mb-12 text-neutral-900">
              Questions Fréquentes
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Est-ce vraiment gratuit ?",
                  a: "Oui, totalement. Metalya offre cet outil gratuitement car il n'utilise pas de serveurs coûteux. C'est votre ordinateur qui fait le travail.",
                },
                {
                  q: "Pourquoi l'outil est plus lent sur mon téléphone ?",
                  a: "Sur mobile, nous utilisons un modèle IA compressé pour économiser votre batterie et votre mémoire. Le processeur d'un téléphone est moins puissant qu'un PC, ce qui peut rallonger le traitement de quelques secondes.",
                },
                {
                  q: "Quels formats sont supportés ?",
                  a: "Nous supportons JPG, PNG, WebP et GIF. L'export se fait toujours en PNG pour conserver la transparence.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-purple-200 transition-colors"
                >
                  <h3 className="font-bold text-lg text-neutral-900 mb-2 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                      Q
                    </div>
                    {item.q}
                  </h3>
                  <p className="text-neutral-600 text-sm pl-9">{item.a}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 bg-purple-50 border border-purple-100 p-6 rounded-2xl mt-12">
              <AlertCircle className="w-6 h-6 text-purple-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-purple-900">
                  Note de compatibilité
                </h4>
                <p className="text-xs text-purple-700 mt-1">
                  Sur iPhone (iOS), Safari limite fortement la mémoire des sites
                  web. Si l'outil recharge la page, essayez avec une image plus
                  petite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
