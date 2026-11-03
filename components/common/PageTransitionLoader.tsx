"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import FlameLoader from "@/components/common/FlameLoader";

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const startTimeRef = useRef<number>(0);

  // 1 second display time
  const minDurationMs = 1000;

  const startLoading = () => {
    startTimeRef.current = Date.now();
    setIsFading(false);
    setLoading(true);
  };

  const stopLoading = () => {
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, minDurationMs - elapsed);

    setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setLoading(false);
        setIsFading(false);
      }, 200);
    }, remaining);
  };

  // When pathname or searchParams change, the navigation has arrived
  useEffect(() => {
    if (loading) {
      stopLoading();
    }
  }, [pathname, searchParams]);

  // Intercept link clicks to trigger the loading flame screen
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip non-navigational links
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if target URL belongs to the same domain and is a different path
      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (targetUrl.origin === currentUrl.origin) {
          // If going to a different route/query, trigger the flame loader
          if (
            targetUrl.pathname !== currentUrl.pathname ||
            targetUrl.search !== currentUrl.search
          ) {
            startLoading();
          }
        }
      } catch (err) {
        // Fallback: ignore URL parse issues
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, []);

  // Safety fallback in case page doesn't change or user cancels navigation
  useEffect(() => {
    if (loading) {
      const fallbackTimer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setLoading(false);
          setIsFading(false);
        }, 200);
      }, 3000);
      return () => clearTimeout(fallbackTimer);
    }
  }, [loading]);

  if (!loading) return null;

  const isAdmin = pathname.startsWith("/admin");

  return (
    <FlameLoader
      theme={isAdmin ? "light" : "light"}
      message="Switching page..."
      fullScreen={true}
      className={`transition-opacity duration-200 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    />
  );
}
