"use client";

import React, { useEffect, useState } from "react";

/** Cycles through words with a slide/fade; first word is rendered on the server. */
export default function RotatingWord({ words, interval = 2600 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setPhase("out");
      setTimeout(() => {
        setI((n) => (n + 1) % words.length);
        setPhase("in");
      }, 350);
    }, interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span
      className={`text-gradient inline-block transition-all duration-[350ms] ${
        phase === "in" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      }`}
    >
      {words[i]}
    </span>
  );
}
