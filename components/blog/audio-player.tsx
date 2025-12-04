"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  text: string;
}

export function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [supported, setSupported] = useState(false);
  const [isReady, setIsReady] = useState(false); // Nouvel état pour indiquer que la voix est chargée
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 1. Initialisation et chargement des voix
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setIsReady(true);
        } else {
          // Si les voix ne sont pas encore chargées, on réessaie
          window.speechSynthesis.onvoiceschanged = () => {
            setIsReady(true);
          };
        }
      };

      loadVoices();
    }

    return () => {
      // Nettoyage si on quitte la page pendant la lecture
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Nettoyage optimisé du Markdown pour la lecture
  const cleanText = text
    .replace(/#{1,6} /g, "") // Titres
    .replace(/\*\*/g, "") // Gras
    .replace(/\*/g, "") // Italique
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Liens, y compris les liens images
    .replace(/!\[([^\]]+)\]\([^)]+\)/g, "Image.") // Images/Vidéo (remplacé par "Image.")
    .replace(/> /g, "") // Citations
    .replace(/`{3}[\s\S]*?`{3}/g, "Code source.") // Blocs de code
    .replace(/`/g, "") // Code inline
    .replace(/\s+/g, " ") // Supprimer les espaces multiples
    .trim();

  const handlePlay = () => {
    if (!supported || !isReady) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Tentative de choisir une voix française (optionnel mais améliore la qualité)
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice =
      voices.find((v) => v.lang === "fr-FR" && v.name.includes("French")) ||
      voices.find((v) => v.lang.startsWith("fr"));
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.lang = "fr-FR";
    utterance.rate = 1;
    utterance.pitch = 1;

    // Synchronisation de l'état au DÉBUT réel de la lecture
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(0);
    };

    utterance.onboundary = (event) => {
      const charIndex = event.charIndex;
      const textLength = cleanText.length;
      const percentage = (charIndex / textLength) * 100;
      setProgress(percentage);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    // On ne met PAS setIsPlaying(true) ici, on attend le onstart
  };

  const handlePause = () => {
    if (!supported || !isPlaying) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  };

  if (!supported) return null;

  return (
    <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-neutral-50 px-4 py-3 border-b border-neutral-100">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
          <Volume2 size={16} />
          <span>Écouter l'article</span>
        </div>
        {(isPlaying || isPaused) && ( // Afficher l'indicateur même en pause pour montrer que c'est prêt
          <div className="flex gap-1">
            <span className="h-3 w-1 animate-[bounce_1s_infinite] rounded-full bg-indigo-500"></span>
            <span className="h-3 w-1 animate-[bounce_1.2s_infinite] rounded-full bg-indigo-500"></span>
            <span className="h-3 w-1 animate-[bounce_0.8s_infinite] rounded-full bg-indigo-500"></span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center gap-4">
          {isPlaying ? (
            <button
              onClick={handlePause}
              disabled={!isReady} // Désactiver si les voix ne sont pas prêtes
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
              title="Pause"
            >
              <Pause size={18} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              disabled={!isReady} // Désactiver si les voix ne sont pas prêtes
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
              title="Lire"
            >
              <Play size={18} fill="currentColor" className="ml-0.5" />
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={!isReady || (!isPlaying && !isPaused)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            title="Arrêter"
          >
            <RotateCcw size={14} />
          </button>

          <span className="text-xs font-medium text-neutral-500">
            {!isReady
              ? "Chargement du moteur audio..."
              : isPlaying
              ? "Lecture en cours..."
              : isPaused
              ? "En pause"
              : "Version audio générée par Metalya"}
          </span>
        </div>
      </div>
    </div>
  );
}
