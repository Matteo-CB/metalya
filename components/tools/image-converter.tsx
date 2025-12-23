"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Upload,
  Download,
  Settings,
  Zap,
  Trash2,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Image as ImageIcon,
  Layers,
  Cpu,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { motion, AnimatePresence } from "framer-motion";

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
  settings: ImageSettings;
}

export function ImageConverter() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [globalFormat, setGlobalFormat] = useState<OutputFormat>("image/webp");
  const [globalQuality, setGlobalQuality] = useState<number>(0.8);
  const [resizeMode, setResizeMode] = useState(false);
  const [targetWidth, setTargetWidth] = useState<string>("");
  const [targetHeight, setTargetHeight] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

          if (img.settings.format === "image/jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, finalWidth, finalHeight);
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(image, 0, 0, finalWidth, finalHeight);

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

  return (
    <div className="relative">
      <div className="text-center max-w-4xl mx-auto mb-12">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-xs font-bold uppercase tracking-widest text-indigo-700 mb-6">
            <Cpu size={14} />
            Moteur V2 : Support AVIF & Batch Processing
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-neutral-900 tracking-tight mb-6">
            Studio Image{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
              Ultimate
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            L'outil de conversion le plus rapide du web. Transformez,
            redimensionnez et optimisez vos visuels pour Google.
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={0.2}>
        <div className="bg-white/80 backdrop-blur-xl border border-neutral-200 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-black/5">
          {/* --- CONTROL PANEL --- */}
          <div className="border-b border-neutral-200 bg-neutral-50/50 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Format & Quality */}
              <div className="lg:col-span-5 space-y-3">
                <label className="text-xs font-bold uppercase text-neutral-500 flex items-center gap-2">
                  <Layers size={14} /> Format & Compression
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select
                      value={globalFormat}
                      onChange={(e) =>
                        setGlobalFormat(e.target.value as OutputFormat)
                      }
                      className="w-full appearance-none bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm cursor-pointer"
                    >
                      <option value="image/webp">WebP (Standard Web)</option>
                      <option value="image/avif">
                        AVIF (Ultra Performance)
                      </option>
                      <option value="image/jpeg">JPEG (Classique)</option>
                      <option value="image/png">PNG (Transparence)</option>
                      <option value="image/x-icon">ICO (Favicon)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                      <Settings size={16} />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-neutral-300 rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-600">
                      Qualité
                    </span>
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
                    className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              {/* Resize Options */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-neutral-500 flex items-center gap-2">
                    <Maximize2 size={14} /> Redimensionner
                  </label>
                  <button
                    onClick={() => setResizeMode(!resizeMode)}
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full transition-colors ${
                      resizeMode
                        ? "bg-indigo-600 text-white"
                        : "bg-neutral-200 text-neutral-500"
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
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="number"
                      placeholder="Hauteur (px)"
                      value={targetHeight}
                      onChange={(e) => setTargetHeight(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-neutral-400">
                  Laissez vide pour conserver le ratio auto.
                </p>
              </div>

              {/* Security Badge */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center h-full border-l border-neutral-200 pl-6">
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
              isDragging ? "bg-indigo-50 border-indigo-500/50" : "bg-white/50"
            } ${
              images.length === 0
                ? "flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-indigo-400 hover:bg-neutral-50"
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
                  <h3 className="text-2xl font-bold text-neutral-900">
                    Déposez vos images ici
                  </h3>
                  <p className="text-neutral-500 mt-2">
                    ou cliquez pour explorer vos dossiers
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-neutral-900 text-white rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-1"
                >
                  Sélectionner des fichiers
                </button>
                <div className="flex flex-wrap justify-center gap-2 pt-4 opacity-60">
                  {["JPG", "PNG", "WEBP", "GIF", "AVIF", "BMP", "SVG"].map(
                    (fmt) => (
                      <span
                        key={fmt}
                        className="text-[10px] font-bold border border-neutral-200 px-2 py-0.5 rounded-md uppercase text-neutral-500"
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
                      className="group relative bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300"
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
                            className="font-bold text-sm text-neutral-900 truncate"
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
                              {getExtension(img.settings.format).toUpperCase()}
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
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
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
                  className="border-2 border-dashed border-neutral-300 rounded-2xl flex flex-col items-center justify-center p-6 text-neutral-400 hover:border-indigo-400 hover:bg-indigo-50/10 cursor-pointer transition-all min-h-[300px] group"
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

      {/* --- INFO SECTION --- */}
      <FadeIn delay={0.4}>
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8 lg:sticky top-32 h-fit">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold mb-4 text-neutral-900">
                Formats Supportés
              </h3>
              <ul className="space-y-2 text-sm text-neutral-500">
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
          </div>

          <article className="lg:col-span-8 prose prose-neutral max-w-none">
            <h2 className="font-serif text-3xl font-bold">
              Convertisseur d'Image en Ligne : La Solution Tout-en-un
            </h2>
            <p>
              Bienvenue sur le <strong>Studio Image Metalya</strong>, l'outil le
              plus complet pour optimiser vos visuels pour le web.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 my-8 not-prose">
              <div className="p-6 bg-white border border-neutral-200 rounded-xl">
                <Zap className="w-8 h-8 text-yellow-500 mb-3" />
                <h4 className="font-bold text-lg mb-2 text-neutral-900">
                  Compression Extrême
                </h4>
                <p className="text-sm text-neutral-500">
                  Réduisez vos fichiers de 5MB à 500KB en quelques secondes
                  grâce à l'encodeur AVIF.
                </p>
              </div>
              <div className="p-6 bg-white border border-neutral-200 rounded-xl">
                <ShieldCheck className="w-8 h-8 text-green-500 mb-3" />
                <h4 className="font-bold text-lg mb-2 text-neutral-900">
                  Mode 100% Local
                </h4>
                <p className="text-sm text-neutral-500">
                  La conversion supprime automatiquement les métadonnées EXIF
                  pour protéger votre vie privée.
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
                <strong>Redimensionnement intelligent :</strong> Définissez une
                largeur maximale (ex: 1920px) et nous calculons la hauteur.
              </li>
              <li>
                <strong>Support des formats modernes :</strong> Soyez prêt pour
                2025 avec le support natif de l'AVIF.
              </li>
            </ul>
          </article>
        </div>
      </FadeIn>
    </div>
  );
}
