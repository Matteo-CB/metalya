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
  const [voiceName, setVoiceName] = useState("");
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);

  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chunksRef = useRef<string[]>([]);

  // 1. Découpage du texte en phrases (Chunking)
  useEffect(() => {
    // Nettoyage Markdown
    const cleanText = text
      .replace(/#{1,6} /g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/> /g, "")
      .replace(/`{3}[\s\S]*?`{3}/g, "")
      .replace(/`/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Découpage intelligent par ponctuation pour éviter les blocs trop longs
    // On coupe après ., !, ?, ou ;
    const rawChunks = cleanText.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [
      cleanText,
    ];
    chunksRef.current = rawChunks;
  }, [text]);

  // 2. Initialisation Voix
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthesisRef.current = window.speechSynthesis;
      setIsSupported(true);

      const loadVoices = () => {
        const voices = synthesisRef.current?.getVoices() || [];

        if (voices.length > 0) {
          // Priorité aux voix "Google" (Chrome) ou "Siri" (Safari) qui sont bien meilleures
          const preferredVoice =
            voices.find(
              (v) =>
                v.lang.startsWith("fr") &&
                (v.name.includes("Google") ||
                  v.name.includes("Siri") ||
                  v.name.includes("Thomas") ||
                  v.name.includes("Audrey"))
            ) || voices.find((v) => v.lang.startsWith("fr"));

          if (preferredVoice) {
            voiceRef.current = preferredVoice;
            // Nettoyage du nom pour l'affichage
            setVoiceName(
              preferredVoice.name.replace(/Google|Microsoft|\(.*\)/g, "").trim()
            );
            setIsReady(true);
          } else {
            voiceRef.current = voices[0]; // Fallback
            setIsReady(true);
          }
        }
      };

      loadVoices();
      if (synthesisRef.current) {
        synthesisRef.current.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Fonction pour lire un chunk spécifique
  const speakChunk = (index: number) => {
    if (
      !synthesisRef.current ||
      !voiceRef.current ||
      index >= chunksRef.current.length
    ) {
      setIsPlaying(false);
      setProgress(100);
      return;
    }

    const chunkText = chunksRef.current[index];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.voice = voiceRef.current;
    utterance.lang = "fr-FR";
    utterance.rate = 1.0;

    utterance.onend = () => {
      // Passer au chunk suivant
      const nextIndex = index + 1;
      if (nextIndex < chunksRef.current.length) {
        setCurrentChunkIndex(nextIndex);
        speakChunk(nextIndex); // Récursion pour lire la suite
        // Mise à jour de la barre de progression
        setProgress((nextIndex / chunksRef.current.length) * 100);
      } else {
        setIsPlaying(false);
        setProgress(100);
        setCurrentChunkIndex(0);
      }
    };

    utterance.onerror = (e) => {
      console.error("TTS Error", e);
      // En cas d'erreur sur une phrase, on essaie de passer à la suivante
      if (e.error !== "interrupted" && e.error !== "canceled") {
        const nextIndex = index + 1;
        setCurrentChunkIndex(nextIndex);
        speakChunk(nextIndex);
      }
    };

    utteranceRef.current = utterance;
    synthesisRef.current.speak(utterance);
  };

  const handlePlay = () => {
    if (!synthesisRef.current) return;

    if (isPaused) {
      synthesisRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      synthesisRef.current.cancel(); // Reset
      setIsPlaying(true);
      speakChunk(currentChunkIndex);
    }
  };

  const handlePause = () => {
    if (synthesisRef.current) {
      synthesisRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentChunkIndex(0);
      setProgress(0);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="mb-10 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between bg-neutral-900 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <Volume2 size={16} className="text-indigo-200" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-indigo-200">
              Version Audio
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              {isReady ? `Voix : ${voiceName}` : "Chargement..."}
            </span>
          </div>
        </div>

        {(isPlaying || isPaused) && (
          <div className="flex gap-1">
            <span className="h-4 w-1 animate-[bounce_1s_infinite] rounded-full bg-indigo-400" />
            <span className="h-6 w-1 animate-[bounce_1.2s_infinite] rounded-full bg-indigo-300" />
            <span className="h-3 w-1 animate-[bounce_0.8s_infinite] rounded-full bg-indigo-400" />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="group relative mb-6 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
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
                className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md transition-all hover:scale-105 active:scale-95"
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
              disabled={!isPlaying && !isPaused && currentChunkIndex === 0}
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
