"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import CinematicLoader from "@/components/common/CinematicLoader";

export type LoaderVariant = "flame" | "fill" | "ring";
export const DEFAULT_LOADER_VARIANT: LoaderVariant = "fill";

interface FlameLoaderProps {
  variant?: LoaderVariant;
  message?: string;
  fullScreen?: boolean;
  theme?: "light" | "dark" | "auto";
  className?: string;
  exiting?: boolean;
}

export default function FlameLoader({
  message = "Loading experience...",
  fullScreen = true,
  theme = "light",
  className = "",
  exiting = false,
  variant = DEFAULT_LOADER_VARIANT,
}: FlameLoaderProps) {
  const isDark = theme === "dark";

  if (variant !== "flame") {
    if (!fullScreen) {
      return (
        <div className="relative h-[420px] w-full rounded-2xl overflow-hidden">
          <CinematicLoader message={message} className="!absolute" />
        </div>
      );
    }
    return <CinematicLoader message={message} exiting={exiting} className={className} />;
  }

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm w-full mx-auto select-none">
      {/* Flame Icon with Ambient Warm Glow */}
      <div className="relative mb-6">
        <div
          className="absolute -inset-6 rounded-full blur-2xl opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,75,50,0.4) 0%, rgba(245,158,11,0.2) 50%, transparent 75%)",
          }}
        />

        <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-[0_8px_30px_rgba(255,75,50,0.25)] border border-[#FF4B32]/20 animate-flame-pulse">
          <Image
            src="/assets/img/flame-logo-clean.png"
            alt="Petro Engineering Logo"
            width={53}
            height={80}
            priority
            className="w-auto h-20 object-contain drop-shadow-[0_4px_16px_rgba(255,75,50,0.35)]"
          />
        </div>
      </div>

      {/* Brand Label */}
      <h3
        className={`font-['Plus_Jakarta_Sans'] font-extrabold text-base tracking-tight mb-1 ${
          isDark ? "text-white" : "text-[#17191C]"
        }`}
      >
        Petro Engineering
      </h3>

      {/* Dynamic Status Message */}
      <p
        className={`text-xs font-medium tracking-wide mb-5 ${
          isDark ? "text-[#929DA7]" : "text-[#5F6871]"
        }`}
      >
        {message}
      </p>

      {/* Shimmering Progress Bar */}
      <div
        className={`w-48 h-1 rounded-full overflow-hidden relative ${
          isDark ? "bg-[#2A2E34]" : "bg-[#D8DDE2]"
        }`}
      >
        <div
          className="h-full w-24 rounded-full animate-flame-shimmer absolute top-0 left-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, #FF4B32 50%, #F59E0B 80%, transparent)",
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
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        isDark ? "bg-[#17191C]" : "bg-white/95 backdrop-blur-md"
      } ${className}`}
    >
      {content}
    </div>
  );
}
