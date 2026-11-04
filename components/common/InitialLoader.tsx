"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import FlameLoader from "@/components/common/FlameLoader";

/** Full-screen loader shown on first load / refresh for the public website. Fades out once loaded. */
export default function InitialLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"show" | "fade" | "gone">("show");

  // In admin CMS, skip full-screen initial loader to keep admin workspace responsive
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      setPhase("gone");
      return;
    }

    const start = performance.now();
    const MIN = 800;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const finish = () => {
      const wait = Math.max(0, MIN - (performance.now() - start));
      t1 = setTimeout(() => {
        setPhase("fade");
        t2 = setTimeout(() => setPhase("gone"), 500);
      }, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const safety = setTimeout(finish, 4000);
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(safety);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    document.documentElement.style.overflow = phase === "show" ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase, isAdmin]);

  if (isAdmin || phase === "gone") return null;
  return <FlameLoader message="Loading experience" exiting={phase === "fade"} />;
}
