"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, Loader2, Mic2 } from "lucide-react";

interface AudioPlayerProps {
  text: string;
}

export function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentVoiceName, setCurrentVoiceName] = useState("");

  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // CORRECTION CRITIQUE : L'utterance doit être persistée pour éviter le Garbage Collection
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();

        if (voices.length > 0) {
          const preferredVoice =
            voices.find(
              (v) =>
                v.lang.startsWith("fr") &&
                (v.name.includes("Google") ||
                  v.name.includes("Siri") ||
                  v.name.includes("Thomas") ||
                  v.name.includes("Amelie"))
            ) || voices.find((v) => v.lang.startsWith("fr"));

          if (preferredVoice) {
            voiceRef.current = preferredVoice;
            setCurrentVoiceName(preferredVoice.name);
            setIsReady(true);
          } else {
            const anyVoice = voices[0];
            voiceRef.current = anyVoice;
            setCurrentVoiceName(anyVoice?.name || "Défaut");
            setIsReady(true);
          }
        }
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanText = text
    .replace(/#{1,6} /g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/> /g, "")
    .replace(/`{3}[\s\S]*?`{3}/g, "")
    .replace(/`/g, "")
    .trim();

  const handlePlay = () => {
    if (!voiceRef.current) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // On annule tout avant de relancer
    window.speechSynthesis.cancel();

    // Création de l'objet utterance
    const newUtterance = new SpeechSynthesisUtterance(cleanText);
    newUtterance.voice = voiceRef.current;
    newUtterance.lang = "fr-FR";
    newUtterance.rate = 1.0;
    newUtterance.pitch = 1.0;
    newUtterance.volume = 1.0;

    newUtterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    newUtterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(0);
    };

    newUtterance.onboundary = (event) => {
      const charIndex = event.charIndex;
      const textLength = cleanText.length;
      const percentage = Math.min((charIndex / textLength) * 100, 100);
      setProgress(percentage);
    };

    newUtterance.onerror = (e) => {
      // On ignore les interruptions volontaires (quand on clique sur stop/pause)
      if (e.error === "interrupted" || e.error === "canceled") return;
      console.error("Erreur lecture:", e);
      setIsPlaying(false);
    };

    // CORRECTION : On stocke l'objet dans la ref AVANT de parler
    utteranceRef.current = newUtterance;

    // Petit délai pour s'assurer que le navigateur est prêt (fix Chrome)
    setTimeout(() => {
      window.speechSynthesis.speak(newUtterance);
    }, 10);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  };

  if (!isSupported) return null;

  return (
    <div className="mb-12 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-lg shadow-neutral-100/50">
      <div className="relative flex items-center justify-between overflow-hidden bg-neutral-900 px-6 py-4 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-20" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <Volume2 size={16} className="text-indigo-200" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-indigo-200">
              Version Audio
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              {isReady ? `Voix : ${currentVoiceName}` : "Initialisation..."}
            </span>
          </div>
        </div>

        {(isPlaying || isPaused) && (
          <div className="relative flex gap-1">
            <span
              key="b1"
              className={`h-4 w-1 rounded-full bg-indigo-400 ${
                isPlaying ? "animate-[bounce_1s_infinite]" : ""
              }`}
            />
            <span
              key="b2"
              className={`h-6 w-1 rounded-full bg-indigo-300 ${
                isPlaying ? "animate-[bounce_1.2s_infinite]" : ""
              }`}
            />
            <span
              key="b3"
              className={`h-3 w-1 rounded-full bg-indigo-400 ${
                isPlaying ? "animate-[bounce_0.8s_infinite]" : ""
              }`}
            />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="group relative mb-6 h-2 w-full cursor-pointer overflow-hidden rounded-full bg-neutral-100">
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isPlaying ? (
              <button
                onClick={handlePause}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md transition-all hover:scale-105 hover:bg-neutral-800 active:scale-95"
              >
                <Pause size={20} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={handlePlay}
                disabled={!isReady}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isReady ? (
                  <Play size={20} fill="currentColor" className="ml-1" />
                ) : (
                  <Loader2 size={20} className="animate-spin" />
                )}
              </button>
            )}

            <button
              onClick={handleStop}
              disabled={!isPlaying && !isPaused}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-500">
            <Mic2 size={12} />
            <span>Synthèse Vocale</span>
          </div>
        </div>
      </div>
    </div>
  );
}
