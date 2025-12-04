"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Empêcher Chrome d'afficher la bannière native moche
      e.preventDefault();
      // Sauvegarder l'événement pour le déclencher plus tard
      setDeferredPrompt(e);
      // Afficher notre belle bannière
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Déclencher le prompt natif
    deferredPrompt.prompt();

    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsVisible(false);
    }

    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md md:left-auto md:right-4"
        >
          <div className="flex items-center gap-4 rounded-2xl bg-neutral-900 p-4 text-white shadow-2xl ring-1 ring-white/10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
              <Download size={24} />
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-sm">Installer l'App Metalya</h4>
              <p className="text-xs text-neutral-400">
                Accès plus rapide et lecture hors ligne.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 transition-colors hover:bg-neutral-200"
              >
                Installer
              </button>
              <button
                onClick={handleClose}
                className="rounded-full p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
