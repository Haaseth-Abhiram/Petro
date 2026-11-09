"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import CinematicLoader from "@/components/common/CinematicLoader";

export type LoaderVariant = "flame" | "fill" | "ring";
/** Change this to switch the public site's loader style. */
export const DEFAULT_LOADER_VARIANT: LoaderVariant = "fill";

interface FlameLoaderProps {
  variant?: LoaderVariant;
  message?: string;
  fullScreen?: boolean;
  theme?: "light" | "dark" | "auto";
  className?: string;
  exiting?: boolean;
}

function Percent() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = ((t - t0) % 2600) / 2600;
      setN(Math.min(99, Math.round(100 * (1 - Math.pow(1 - Math.min(1, p * 1.15), 3)))));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span className="tabular-nums">{String(n).padStart(2, "0")}</span>;
}

export default function FlameLoader({
  message = "Loading experience",
  fullScreen = true,
  theme = "light",
  className = "",
  exiting = false,
  variant = DEFAULT_LOADER_VARIANT,
}: FlameLoaderProps) {
  const isDark = theme === "dark";

  if (variant !== "flame") {
    if (!fullScreen) return <div className="relative h-[420px] w-full rounded-2xl overflow-hidden"><CinematicLoader message={message} className="!absolute" /></div>;
    return <CinematicLoader message={message} exiting={exiting} className={className} />;
  }

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm w-full mx-auto select-none">
      {/* Flame Icon with Ambient Warm Glow */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Soft Radial Ambient Glow */}
        <div
          className="absolute -inset-6 rounded-full blur-2xl opacity-70 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(200,8,8,0.4) 0%, rgba(245,158,11,0.2) 50%, transparent 75%)",
          }}
        />

        {/* Pulsing Flame Graphic */}
        <div className="relative w-16 h-24 flex items-center justify-center animate-flame-pulse">
          <Image
            src="/assets/img/flame-logo.png"
            alt="Petro Engineering Flame"
            width={53}
            height={80}
            priority
            className="w-auto h-20 object-contain drop-shadow-[0_4px_16px_rgba(200,8,8,0.35)]"
          />
        </div>
      </div>

      {/* Brand Heading */}
      <h3
        className={`text-sm sm:text-base font-extrabold tracking-[0.25em] uppercase font-['Plus_Jakarta_Sans',sans-serif] ${
          isDark ? "text-white" : "text-[#17191C]"
        }`}
      >
        Petro Engineering
      </h3>

      <p
        className={`text-xs mt-1 tracking-wider uppercase font-semibold ${
          isDark ? "text-[#929DA7]" : "text-[#5F6871]"
        }`}
      >
        {message}
      </p>

      {/* High-End Slim Shimmer Progress Bar */}
      <div
        className={`mt-5 w-44 sm:w-52 h-1 rounded-full overflow-hidden relative ${
          isDark ? "bg-[#2A2E34]" : "bg-[#D8DDE2]"
        }`}
      >
        <div
          className="h-full w-24 rounded-full animate-flame-shimmer absolute top-0 left-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, #C80808 50%, #F59E0B 80%, transparent)",
          }}
        />
      </div>
    </div>
  );

  if (!fullScreen) {
    return <div className="py-16 flex items-center justify-center w-full">{content}</div>;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        isDark
          ? "bg-[#17191C]/95 backdrop-blur-md text-white"
          : "bg-white/95 backdrop-blur-md text-[#17191C]"
      } ${className}`}
    >
      {content}
    </div>
  );
}
