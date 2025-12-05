"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  priority?: boolean;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  priority = false,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(priority);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.01,
        rootMargin: "50px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={ref}
      className={cn(
        "transform-gpu transition-all ease-out",
        isVisible
          ? "opacity-100 translate-y-0 filter-none"
          : "opacity-0 translate-y-8 blur-sm",
        className
      )}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
