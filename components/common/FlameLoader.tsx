import React from "react";
import Image from "next/image";

interface FlameLoaderProps {
  message?: string;
  fullScreen?: boolean;
  theme?: "light" | "dark" | "auto";
  className?: string;
}

export default function FlameLoader({
  message = "Loading experience...",
  fullScreen = true,
  theme = "light",
  className = "",
}: FlameLoaderProps) {
  const isDark = theme === "dark";

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-6 max-w-sm w-full mx-auto select-none">
      {/* Flame Icon with Ambient Warm Glow */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Soft Radial Ambient Glow */}
        <div
          className="absolute -inset-6 rounded-full blur-2xl opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,75,50,0.4) 0%, rgba(245,158,11,0.2) 50%, transparent 75%)",
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
            className="w-auto h-20 object-contain drop-shadow-[0_4px_16px_rgba(255,75,50,0.35)]"
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
