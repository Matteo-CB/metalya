"use client";

import React, { useState, useCallback, useRef } from "react";
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
  Cpu,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { motion, AnimatePresence } from "framer-motion";

interface ProcessedImage {
  originalUrl: string;
  processedUrl: string | null;
  name: string;
  size: number;
}

// Configuration simplifiée et typée
type ImglyConfig = {
  progress?: (key: string, current: number, total: number) => void;
  debug?: boolean;
  model?: "isnet" | "isnet_fp16" | "isnet_quint8";
};

export function BackgroundRemover() {
  // --- STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

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

  // OPTIMISATION 1 : Redimensionnement global (Desktop & Mobile)
  // Limite à 1920px (Full HD) pour économiser la RAM et le CPU
  const optimizeImage = async (file: File): Promise<Blob> => {
    // Si l'image fait moins de 2MB, on ne touche à rien
    if (file.size < 2 * 1024 * 1024) return file;

    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1920; // Standard Full HD, suffisant pour 99% des usages web
        let width = img.width;
        let height = img.height;

        // Calcul du ratio pour ne pas déformer
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        } else {
          resolve(file); // Pas besoin de resize
          return;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Meilleur algorithme de lissage pour garder la qualité
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else resolve(file);
            },
            file.type === "image/png" ? "image/png" : "image/jpeg",
            0.9 // Qualité 90%
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
      setLoadingStep("Optimisation de l'image...");
      setProgress(5);

      // Etape 1 : Optimisation
      const optimizedBlob = await optimizeImage(file);

      // Etape 2 : Chargement dynamique (Lazy Load)
      // La librairie n'est téléchargée QUE maintenant
      setLoadingStep("Chargement du moteur IA...");
      const imgly = await import("@imgly/background-removal");

      // OPTIMISATION 2 : Modèle 'quint8' par défaut
      // Pèse 4x moins lourd que le modèle standard, qualité quasi-identique
      const config: ImglyConfig = {
        progress: (key: string, current: number, total: number) => {
          const percentage = Math.round((current / total) * 100);
          if (key.includes("fetch")) {
            setLoadingStep(`Chargement IA (${percentage}%)...`);
            setProgress(10 + percentage * 0.4);
          } else if (key.includes("compute")) {
            setLoadingStep(`Détourage intelligent...`);
            setProgress(50 + percentage * 0.5);
          }
        },
        debug: false,
        model: "isnet_quint8", // Le secret de la performance
      };

      // @ts-ignore
      const blob = await imgly.removeBackground(optimizedBlob, config);
      const url = URL.createObjectURL(blob);

      setResult((prev) => (prev ? { ...prev, processedUrl: url } : null));
      setProgress(100);
    } catch (error) {
      console.error("Erreur:", error);
      setLoadingStep("Erreur. L'image est peut-être trop complexe.");
      setTimeout(() => setIsProcessing(false), 3000);
    } finally {
      if (progress >= 100) setTimeout(() => setIsProcessing(false), 500);
      else setIsProcessing(false);
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
      {/* HEADER */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold uppercase tracking-widest text-purple-700 mb-8 shadow-sm">
            <Cpu size={14} className="text-purple-600" />
            Moteur v2 "Turbo" • Gratuit
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-8 text-neutral-900">
            Studio{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Détourage
            </span>
          </h1>

          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Suppression de fond instantanée. Technologie WebAssembly optimisée
            pour la vitesse.
          </p>
        </FadeIn>
      </div>

      {/* TOOL INTERFACE */}
      <FadeIn delay={0.2}>
        <div className="bg-white border border-neutral-200 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col relative group">
          <div className="flex-1 p-6 md:p-12 flex items-center justify-center relative z-10 bg-neutral-50/50">
            <AnimatePresence mode="wait">
              {/* STATE: UPLOAD */}
              {!file && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`w-full max-w-xl border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 cursor-pointer ${
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
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 border border-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <Scissors size={36} className="text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    Glissez votre image
                  </h3>
                  <p className="text-neutral-500 text-sm">
                    JPG, PNG, WebP • Max 10MB
                  </p>
                </motion.div>
              )}

              {/* STATE: RESULT / PROCESSING */}
              {file && result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-5xl"
                >
                  {/* Toolbar */}
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-center gap-4">
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
                        Détourer
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

                  {/* Viewer */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-100 min-h-[400px]">
                    {/* Background Checkerboard */}
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                        backgroundSize: "20px 20px",
                      }}
                    />

                    {/* Loading Overlay */}
                    <AnimatePresence>
                      {isProcessing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-8"
                        >
                          <div className="w-full max-w-xs">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">
                              <span>Traitement</span>
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
                            <p className="text-center text-neutral-500 mt-4 font-medium text-sm animate-pulse">
                              {loadingStep}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Comparison Slider */}
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
                      <img
                        src={result.processedUrl || result.originalUrl}
                        alt="Result"
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      />

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

                      {result.processedUrl && (
                        <div
                          className="absolute top-0 bottom-0 w-10 flex items-center justify-center cursor-ew-resize -ml-5 z-20 group-hover:scale-110 transition-transform"
                          style={{ left: `${sliderPosition}%` }}
                        >
                          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-purple-600 border-4 border-white">
                            <ScanEye size={18} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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

      {/* FEATURES */}
      <FadeIn delay={0.4}>
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-neutral-200 pt-16">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
            <Zap className="w-8 h-8 text-yellow-500 mb-4" />
            <h3 className="font-bold text-neutral-900">Vitesse Turbo</h3>
            <p className="text-sm text-neutral-500 mt-2">
              Moteur allégé pour des performances maximales.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
            <ShieldCheck className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-bold text-neutral-900">100% Local</h3>
            <p className="text-sm text-neutral-500 mt-2">
              Aucun upload serveur. Vos images restent privées.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
            <Layers className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="font-bold text-neutral-900">Qualité HD</h3>
            <p className="text-sm text-neutral-500 mt-2">
              Export haute résolution optimisé pour le web.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
