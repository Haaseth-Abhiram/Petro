"use client";

import React, { useEffect, useState } from "react";
import FlameLoader from "@/components/common/FlameLoader";

/** Full-screen loader shown on every first load / refresh. It is part of the server HTML, so it is visible before the page hydrates, and fades out once everything has loaded. */
export default function InitialLoader() {
  const [phase, setPhase] = useState<"show" | "fade" | "gone">("show");

  useEffect(() => {
    const start = performance.now();
    const MIN = 900;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const finish = () => {
      const wait = Math.max(0, MIN - (performance.now() - start));
      t1 = setTimeout(() => {
        setPhase("fade");
        t2 = setTimeout(() => setPhase("gone"), 600);
      }, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const safety = setTimeout(finish, 6000);
    return () => { window.removeEventListener("load", finish); clearTimeout(t1); clearTimeout(t2); clearTimeout(safety); };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = phase === "show" ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [phase]);

  if (phase === "gone") return null;
  return (
    <FlameLoader message="Loading" exiting={phase === "fade"} />
  );
}
