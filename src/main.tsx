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
    const isApiCall = typeof input === "string" && input.startsWith("/api");
    const isUploadsCall = typeof input === "string" && input.startsWith("/uploads");

    let nextInit: RequestInit = init ? { ...init } : {};
    if (isApiCall) {
      if (!nextInit.credentials) nextInit.credentials = "include";
      // Clear both local tokens & Supabase Auth session when logging out
      if (rawUrl.startsWith("/api/auth/logout")) {
        await handlePublicSupabaseFallback("/api/auth/logout", { method: "POST" }).catch(() => {});
      } else {
        // Attach Bearer token from localStorage so cross-origin & serverless auth always persists
        try {
          const token = window.localStorage.getItem("petronex_admin_token");
          if (token) {
            const headers = new Headers(nextInit.headers || undefined);
            if (!headers.has("Authorization")) {
              headers.set("Authorization", `Bearer ${token}`);
            }
            nextInit.headers = headers;
          }
        } catch {}
      }
    }

    if (API_BASE && (isApiCall || isUploadsCall)) {
      if (!nextInit.credentials) nextInit.credentials = "include";
      return originalFetch(`${API_BASE}${input}`, nextInit);
    }

    if (!API_BASE && isApiCall) {
      try {
        const res = await originalFetch(input, nextInit);
        const ct = (res.headers.get("content-type") || "").toLowerCase();
        const isUnreachable =
          res.status === 404 ||
          res.status === 405 ||
          res.status >= 500 ||
          res.status === 401 ||
          (ct && !ct.includes("application/json") && !ct.includes("text/csv") && !ct.includes("application/pdf"));
        if (isUnreachable) {
          const fallback = await handlePublicSupabaseFallback(rawUrl, nextInit);
          if (fallback && (fallback.ok || res.status !== 401)) return fallback;
        }
        return res;
      } catch (err) {
        const fallback = await handlePublicSupabaseFallback(rawUrl, nextInit);
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
