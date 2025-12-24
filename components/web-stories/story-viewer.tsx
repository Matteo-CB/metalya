"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  X,
  Share2,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";

// --- TYPES ---

export type StorySlide = {
  id: string;
  type: "cover" | "content" | "stats" | "cta";
  image: string;
  title?: string;
  text?: string;
  data?: { label: string; value: string; icon?: React.ReactNode }[];
  duration?: number; // Durée en ms (défaut 5000)
};

export type StoryData = {
  id: string;
  title: string;
  slug: string;
  slides: StorySlide[];
};

// --- COMPONENT ---

export function StoryViewer({ story }: { story: StoryData }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const touchStartTime = useRef<number>(0);

  const currentSlide = story.slides[currentIndex];
  const slideDuration = currentSlide.duration || 5000;

  // Navigation
  const nextSlide = useCallback(() => {
    if (currentIndex < story.slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Fin de la story -> Retour à l'index ou story suivante
      router.push("/web-stories");
    }
  }, [currentIndex, story.slides.length, router]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Timer automatique
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      nextSlide();
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, nextSlide, slideDuration]);

  // Gestionnaires d'événements (Tactile & Souris)
  const handleTouchStart = () => {
    touchStartTime.current = Date.now();
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.MouseEvent | React.TouchEvent) => {
    setIsPaused(false);
    const touchDuration = Date.now() - touchStartTime.current;

    // Si c'est un appui long (>200ms), on ne change pas de slide (c'était une pause)
    if (touchDuration > 200) return;

    // Sinon, on détermine la zone de clic
    // @ts-ignore - TS ne gère pas bien clientX sur l'union Mouse/Touch event ici
    const clientX = "clientX" in e ? e.clientX : e.changedTouches[0].clientX;
    const width = window.innerWidth;

    if (clientX < width / 3) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  // Préchargement des images (Optimisation Critique)
  useEffect(() => {
    const nextImages = story.slides.slice(currentIndex + 1, currentIndex + 3);
    nextImages.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.image;
    });
  }, [currentIndex, story.slides]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* BACKGROUND BLUR (Mode Desktop) */}
      <div className="absolute inset-0 z-0 opacity-30 hidden md:block">
        <Image
          src={currentSlide.image}
          alt="Background"
          fill
          className="object-cover blur-3xl"
        />
      </div>

      {/* STORY CONTAINER */}
      <div
        className="relative w-full h-full md:w-[400px] md:h-[85vh] md:rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl"
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* --- HEADER (Progress Bars & Controls) --- */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4 pt-6 bg-gradient-to-b from-black/60 to-transparent">
          {/* Progress Bars */}
          <div className="flex gap-1.5 mb-4">
            {story.slides.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: idx < currentIndex ? "100%" : "0%" }}
                  animate={{
                    width:
                      idx === currentIndex
                        ? isPaused
                          ? "var(--progress-width)"
                          : "100%"
                        : idx < currentIndex
                        ? "100%"
                        : "0%",
                  }}
                  transition={{
                    duration: idx === currentIndex ? slideDuration / 1000 : 0,
                    ease: "linear",
                  }}
                  style={{
                    // Hack pour figer l'animation en CSS si besoin, mais Framer gère bien
                    // @ts-ignore
                    "--progress-width": "current",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Top Controls */}
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Link
                href="/web-stories"
                className="bg-black/20 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <X size={20} />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="bg-black/20 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.share?.({
                    title: story.title,
                    url: window.location.href,
                  });
                }}
                className="bg-black/20 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT (Slides) --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10"
          >
            {/* Background Image */}
            <Image
              src={currentSlide.image}
              alt={currentSlide.title || "Story Image"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex flex-col justify-end h-full">
              {/* Type: COVER */}
              {currentSlide.type === "cover" && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest">
                    Nouveau Guide
                  </span>
                  <h1 className="font-serif text-5xl font-bold text-white mb-4 leading-tight">
                    {currentSlide.title}
                  </h1>
                  <p className="text-lg text-white/90">{currentSlide.text}</p>
                  <div className="mt-8 flex justify-center animate-bounce">
                    <span className="text-white/70 text-xs uppercase tracking-widest">
                      Tap pour commencer
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Type: CONTENT / STATS */}
              {(currentSlide.type === "content" ||
                currentSlide.type === "stats") && (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="font-bold text-3xl text-white mb-4 shadow-black drop-shadow-lg">
                    {currentSlide.title}
                  </h2>

                  {currentSlide.text && (
                    <p className="text-xl text-white/95 font-medium leading-relaxed drop-shadow-md mb-6">
                      {currentSlide.text}
                    </p>
                  )}

                  {/* Stats Grid */}
                  {currentSlide.data && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {currentSlide.data.map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl"
                        >
                          <div className="text-white/60 text-xs font-bold uppercase mb-1">
                            {stat.label}
                          </div>
                          <div className="text-white text-xl font-bold">
                            {stat.value}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Type: CTA (Call to Action) */}
              {currentSlide.type === "cta" && (
                <div className="text-center">
                  <motion.h2
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-serif font-bold text-white mb-6"
                  >
                    {currentSlide.title}
                  </motion.h2>
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      href={`/destinations/${story.slug}`}
                      className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-blue-50 transition-all w-full justify-center"
                      onClick={(e) => e.stopPropagation()} // Important: empêche de passer au slide suivant au clic
                    >
                      Lire le Guide Complet
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="text-white/60 text-sm mt-6">
                      Glissez vers le haut ou cliquez pour ouvrir
                    </p>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tap Areas Indicators (Optional UX hint) */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-w-resize" />
        <div className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-e-resize" />
      </div>
    </div>
  );
}
