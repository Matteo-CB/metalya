"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Coffee,
  CloudRain,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SOUNDS = [
  {
    id: "rain",
    name: "Pluie Légère",
    icon: CloudRain,
    color: "text-blue-400",
    src: "/sounds/rain.mp3",
  },
  {
    id: "cafe",
    name: "Ambiance Café",
    icon: Coffee,
    color: "text-amber-600",
    src: "/sounds/coffee.mp3",
  },
  {
    id: "white",
    name: "Vent",
    icon: Wind,
    color: "text-neutral-400",
    src: "/sounds/wind.mp3",
  },
];

export function FocusSanctuary() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "short" | "long">("focus");
  const [activeSounds, setActiveSounds] = useState<string[]>([]);

  // Refs pour gérer les objets Audio sans re-render
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Initialisation des audios uniquement côté client
    if (typeof window !== "undefined") {
      SOUNDS.forEach((sound) => {
        if (!audioRefs.current[sound.id]) {
          const audio = new Audio(sound.src);
          audio.loop = true;
          audioRefs.current[sound.id] = audio;
        }
      });
    }

    return () => {
      // Cleanup: Pause all sounds on unmount
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // Gestion de la lecture/pause des sons
  useEffect(() => {
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (activeSounds.includes(id)) {
        // Play avec gestion d'erreur (si l'utilisateur n'a pas interagi avec la page)
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play policy blocked
            console.log("Audio autoplay blocked by browser");
          });
        }
      } else {
        audio.pause();
      }
    });
  }, [activeSounds]);

  const toggleSound = (id: string) => {
    setActiveSounds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Ici tu pourrais ajouter un son de cloche de fin
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const setTimerMode = (newMode: "focus" | "short" | "long") => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === "focus") setTimeLeft(25 * 60);
    if (newMode === "short") setTimeLeft(5 * 60);
    if (newMode === "long") setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Schema.org pour l'application logicielle
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Metalya Focus Sanctuaire",
    applicationCategory: "Productivity",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    featureList: "Pomodoro Timer, White Noise Generator, Ambient Sounds",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
        {/* Timer Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600" />

          <div className="flex justify-center gap-2 mb-8 bg-neutral-100 p-1 rounded-xl inline-flex relative z-10">
            {[
              { id: "focus", label: "Focus" },
              { id: "short", label: "Pause courte" },
              { id: "long", label: "Pause longue" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setTimerMode(m.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m.id
                    ? "bg-white text-indigo-600 shadow-sm font-bold"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="font-mono text-7xl sm:text-8xl font-bold text-neutral-900 mb-8 tracking-tighter tabular-nums">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setIsActive(!isActive)}
              className={`w-36 h-14 rounded-2xl text-lg font-bold shadow-lg transition-transform active:scale-95 ${
                isActive
                  ? "bg-amber-100 text-amber-900 hover:bg-amber-200 border-2 border-amber-200"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
              aria-label={isActive ? "Mettre en pause" : "Démarrer le minuteur"}
            >
              {isActive ? (
                <Pause className="mr-2 h-5 w-5" />
              ) : (
                <Play className="mr-2 h-5 w-5" />
              )}
              {isActive ? "Pause" : "Focus"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setTimerMode(mode)}
              className="h-14 w-14 rounded-2xl p-0 hover:bg-neutral-50 border-2"
              aria-label="Réinitialiser"
            >
              <RotateCcw className="h-5 w-5 text-neutral-500" />
            </Button>
          </div>
        </div>

        {/* Sound Mixer */}
        <div className="bg-neutral-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full" />

          <h3 className="flex items-center gap-2 font-bold text-lg mb-6 relative z-10">
            <Volume2 className="text-indigo-400" /> Ambiance Sonore
          </h3>
          <div className="space-y-4 relative z-10">
            {SOUNDS.map((sound) => (
              <div
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  activeSounds.includes(sound.id)
                    ? "bg-white/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
                role="switch"
                aria-checked={activeSounds.includes(sound.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-black/40 ${sound.color}`}>
                    <sound.icon size={20} />
                  </div>
                  <span className="font-medium text-sm sm:text-base">
                    {sound.name}
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeSounds.includes(sound.id)
                      ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] scale-110"
                      : "bg-neutral-700"
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-neutral-500 text-center relative z-10">
            Astuce : Combinez "Pluie" et "Café" pour une concentration maximale.
          </p>
        </div>
      </div>
    </>
  );
}
