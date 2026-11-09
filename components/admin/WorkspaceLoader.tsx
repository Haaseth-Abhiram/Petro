"use client";

import React from "react";
import PetroLogo from "@/components/common/PetroLogo";

/** Loader for the admin data area only — the sidebar and header around it stay untouched. */
export default function WorkspaceLoader({ message = "Getting your data ready", title = "Loading...", className = "", compact = false }: { message?: string; title?: string; className?: string; compact?: boolean }) {
  return (
    <div role="status" aria-live="polite" className={`relative flex ${compact ? "min-h-[300px] !rounded-2xl" : "min-h-[440px]"} w-full items-center justify-center overflow-hidden rounded-[2rem] border border-[#EEF0F3] bg-white shadow-[0_1px_2px_rgba(23,25,28,0.04),0_24px_60px_-30px_rgba(23,25,28,0.25)] ${className}`}>
      <style>{`
        @keyframes wl-spin{to{transform:rotate(360deg)}}
        @keyframes wl-spin-rev{to{transform:rotate(-360deg)}}
        @keyframes wl-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes wl-bar{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}
        @media (prefers-reduced-motion: reduce){.wl-a{animation:none!important}}
      `}</style>
      {/* soft colour washes + dotted texture */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#E0A21A]/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[460px] w-[460px] rounded-full bg-[#C80808]/[0.07] blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(#D8DDE2_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,#000_10%,transparent_65%)]" />

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="relative flex h-[190px] w-[190px] items-center justify-center">
          <span className="absolute inset-0 rounded-full border-[3px] border-[#EEF0F3]" />
          <span className="wl-a absolute inset-0 rounded-full border-[3px] border-transparent border-l-[#E0A21A] border-b-[#E0A21A]" style={{ animation: "wl-spin 1.6s linear infinite" }} />
          <span className="wl-a absolute inset-[18px] rounded-full border-[3px] border-transparent border-t-[#C80808] border-r-[#C80808]" style={{ animation: "wl-spin-rev 2.2s linear infinite" }} />
          <span className="wl-a absolute inset-0" style={{ animation: "wl-spin 1.6s linear infinite" }}><span className="absolute bottom-[14px] right-[28px] h-3 w-3 rounded-full bg-[#C80808] shadow-[0_0_14px_rgba(200,8,8,0.7)]" /></span>
          <div className="wl-a flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-8px_rgba(23,25,28,0.25)]" style={{ animation: "wl-pulse 2s ease-in-out infinite" }}>
            <div className="w-[34px]"><PetroLogo part="flame" width="100%" /></div>
          </div>
        </div>
        <h3 className="mt-8 text-[1.55rem] font-black tracking-tight text-[#17191C]">{title}</h3>
        <p className="mt-1.5 text-[15px] text-[#5F6871]">{message}</p>
        <div className="mt-6 h-[6px] w-[340px] max-w-[70vw] overflow-hidden rounded-full bg-[#EEF0F3]">
          <div className="wl-a h-full w-1/3 rounded-full bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" style={{ animation: "wl-bar 1.4s ease-in-out infinite" }} />
        </div>
      </div>
    </div>
  );
}
