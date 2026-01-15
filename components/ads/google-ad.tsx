"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface GoogleAdProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function GoogleAd({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style = {},
}: GoogleAdProps) {
  const pathname = usePathname();
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    // Réinitialise l'état au changement de page pour forcer le re-render si besoin
    setIsAdLoaded(false);

    try {
      if (typeof window !== "undefined") {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setIsAdLoaded(true);
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [pathname, slot]); // Relance si l'URL ou le slot change

  // Dimensions par défaut pour éviter le CLS (Cumulative Layout Shift)
  // On réserve l'espace : Rectangle (250px+) ou Horizontal (90px+)
  const minHeight =
    format === "rectangle"
      ? "280px"
      : format === "vertical"
      ? "600px"
      : "100px";

  return (
    <div
      aria-hidden={true}
      className={`relative w-full overflow-hidden bg-neutral-100/50 flex justify-center items-center my-8 print:hidden ${className}`}
      style={{ minHeight: isAdLoaded ? "auto" : minHeight, ...style }}
    >
      <div className="text-xs text-neutral-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
        Publicité
      </div>
      <ins
        className="adsbygoogle relative z-10"
        style={{ display: "block", width: "100%", ...style }}
        data-ad-client="ca-pub-9989627034003305"
        data-ad-slot={slot}
        data-ad-format={
          format === "rectangle" || format === "vertical" ? "auto" : format
        }
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
