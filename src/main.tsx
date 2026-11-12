/// <reference types="vite/client" />
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@/app/globals.css";
import { handlePublicSupabaseFallback } from "@/lib/supabase-fallback";

// Support both dedicated Node.js backend (via VITE_API_URL or local proxy) and
// serverless/static live deployments like Lovable by seamlessly falling back to Supabase.
const API_BASE = (((import.meta as any).env?.VITE_API_URL as string) || "").trim().replace(/\/$/, "");
if (typeof window !== "undefined") {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const rawUrl = typeof input === "string" ? input : input instanceof URL ? input.pathname : "";

    if (API_BASE && typeof input === "string" && (input.startsWith("/api") || input.startsWith("/uploads"))) {
      const nextInit: RequestInit = init ? { ...init } : {};
      if (!nextInit.credentials) nextInit.credentials = "include";
      return originalFetch(`${API_BASE}${input}`, nextInit);
    }

    if (!API_BASE && typeof input === "string" && input.startsWith("/api")) {
      try {
        const res = await originalFetch(input, init);
        const ct = (res.headers.get("content-type") || "").toLowerCase();
        // On static hosts (Lovable/Vercel without API server), /api returns 404 or index.html (text/html)
        if (res.status === 404 || res.status === 405 || (ct && !ct.includes("application/json") && !ct.includes("text/csv") && !ct.includes("application/pdf"))) {
          const fallback = await handlePublicSupabaseFallback(rawUrl, init);
          if (fallback) return fallback;
        }
        return res;
      } catch (err) {
        const fallback = await handlePublicSupabaseFallback(rawUrl, init);
        if (fallback) return fallback;
        throw err;
      }
    }

    return originalFetch(input, init);
  };
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
