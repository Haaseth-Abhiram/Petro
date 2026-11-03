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

  // Check if we are inside the authenticated admin workspace (not admin login)
  const isAdminWorkspace =
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    pathname !== "/login";

  // Inside the admin panel: only load the right-side data workspace (keep sidebar & header intact)
  if (isAdminWorkspace) {
    return (
      <div
        className={`fixed top-16 bottom-0 right-0 left-0 lg:left-72 z-30 flex items-center justify-center bg-[#F5F6F7]/90 backdrop-blur-sm transition-opacity duration-200 ${
          isFading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <FlameLoader
          theme="light"
          message="Loading workspace..."
          fullScreen={false}
        />
      </div>
    );
  }

  // Public site and login routes: clean full-screen transition
  return (
    <FlameLoader
      theme="light"
      message="Switching page..."
      fullScreen={true}
      className={`transition-opacity duration-200 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    />
  );
}
