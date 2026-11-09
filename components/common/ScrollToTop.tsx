"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating back-to-top button with a scroll-progress ring. */
export type TopVariant = "ring" | "pill";
/** Change this to switch the public site's button style. */
export const DEFAULT_TOP_VARIANT: TopVariant = "pill";

export default function ScrollToTop({ variant = DEFAULT_TOP_VARIANT, demo = false }: { variant?: TopVariant; demo?: boolean }) {
  const [p, setP] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
        setShow(window.scrollY > 500);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const C = 2 * Math.PI * 24;
  const vis = demo || show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none";
  const pos = demo ? "relative" : "fixed z-[70] right-4 bottom-4 sm:right-7 sm:bottom-7";

  if (variant === "pill") {
    return (
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`group ${pos} overflow-hidden rounded-2xl bg-gradient-to-br from-[#C80808] to-[#E0241A] text-white shadow-[0_8px_20px_rgba(200,8,8,0.18)] px-4 pt-3 pb-4 flex flex-col items-center gap-1 transition-all duration-500 hover:-translate-y-1.5 hover:from-[#E0A21A] hover:to-[#D4950F] ${vis}`}
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em]">Top</span>
        <span className="absolute left-0 bottom-0 h-1 bg-white/90 rounded-r" style={{ width: `${Math.round(p * 100)}%` }} />
      </button>
    );
  }
  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group ${pos} w-14 h-14 rounded-full bg-[#17191C] text-white shadow-[0_14px_34px_rgba(23,25,28,0.35)] flex items-center justify-center transition-all duration-500 hover:bg-[#C80808] hover:-translate-y-1 ${vis}`}
    >
      <svg className="absolute inset-[-5px] w-[calc(100%+10px)] h-[calc(100%+10px)] -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
        <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(23,25,28,0.12)" strokeWidth="3" />
        <circle cx="28" cy="28" r="24" fill="none" stroke="#C80808" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} className="transition-[stroke-dashoffset] duration-150" />
      </svg>
      <ArrowUp className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
