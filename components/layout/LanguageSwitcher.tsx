"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

type Lang = "en" | "ar" | "hi";

const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
];

const STORE_KEY = "petro-lang";
const SCRIPT_ID = "google-translate-script";

declare global {
  interface Window {
    google?: any;
    petroTranslateInit?: () => void;
  }
}

function setTranslateCookie(lang: Lang) {
  const value = lang === "en" ? "" : `/en/${lang}`;
  const expires = lang === "en" ? "Thu, 01 Jan 1970 00:00:00 GMT" : "";
  const base = `googtrans=${value}; path=/${expires ? `; expires=${expires}` : ""}`;
  document.cookie = base;
  document.cookie = `${base}; domain=${window.location.hostname}`;
}

function applyDirection(lang: Lang) {
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
}

/** Language selector (English / Arabic / Hindi). Page text is machine-translated on demand; nothing is sent until a non-English language is chosen. */
export default function LanguageSwitcher({ align = "right", variant = "bar" }: { align?: "left" | "right"; variant?: "bar" | "drawer" }) {
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const pushToWidget = useCallback((target: Lang) => {
    let tries = 0;
    const t = setInterval(() => {
      const combo = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
      tries += 1;
      if (combo) {
        combo.value = target;
        combo.dispatchEvent(new Event("change"));
        clearInterval(t);
      } else if (tries > 60) clearInterval(t);
    }, 150);
  }, []);

  const loadTranslate = useCallback(
    (target: Lang) => {
      const init = () => {
        if (!window.google?.translate?.TranslateElement) return;
        if (!document.querySelector(".goog-te-combo")) {
          new window.google.translate.TranslateElement(
            { pageLanguage: "en", includedLanguages: "en,ar,hi", autoDisplay: false },
            "google_translate_element"
          );
        }
        pushToWidget(target);
      };
      if (window.google?.translate?.TranslateElement) return init();
      window.petroTranslateInit = init;
      if (!document.getElementById(SCRIPT_ID)) {
        const s = document.createElement("script");
        s.id = SCRIPT_ID;
        s.src = "https://translate.google.com/translate_a/element.js?cb=petroTranslateInit";
        s.async = true;
        document.body.appendChild(s);
      }
    },
    [pushToWidget]
  );

  useEffect(() => {
    const saved = (localStorage.getItem(STORE_KEY) as Lang | null) || "en";
    if (saved !== "en" && LANGS.some((l) => l.code === saved)) {
      setLang(saved);
      applyDirection(saved);
      setTranslateCookie(saved);
      loadTranslate(saved);
    }
  }, [loadTranslate]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const choose = (next: Lang) => {
    setOpen(false);
    if (next === lang) return;
    localStorage.setItem(STORE_KEY, next);
    setLang(next);
    applyDirection(next);
    if (next === "en") {
      setTranslateCookie("en");
      window.location.reload();
      return;
    }
    setTranslateCookie(next);
    loadTranslate(next);
    pushToWidget(next);
  };

  const current = LANGS.find((l) => l.code === lang)!;
  const drawer = variant === "drawer";

  return (
    <div ref={rootRef} className={`relative notranslate ${drawer ? "w-full" : ""}`} translate="no">
      <div id="google_translate_element" className="hidden" />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((o) => !o)}
        className={
          drawer
            ? "w-full inline-flex items-center justify-between gap-2 rounded-lg border border-[#D8DDE2] bg-white px-4 py-3 text-sm font-bold text-[#17191C]"
            : "inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
        }
      >
        <Globe className="w-3.5 h-3.5 text-[#E0A21A]" />
        <span className="font-semibold">{current.native}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className={`absolute z-[60] mt-2 min-w-[150px] rounded-xl bg-white border border-[#E7E9EE] shadow-2xl py-1.5 ${drawer ? "left-0 right-0" : align === "right" ? "right-0" : "left-0"}`}
        >
          {LANGS.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                type="button"
                onClick={() => choose(l.code)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2 text-[13px] text-left hover:bg-[#FFF8F0] ${l.code === lang ? "font-extrabold text-[#C80808]" : "font-semibold text-[#17191C]"}`}
              >
                <span>{l.native}<span className="ml-2 text-[11px] font-medium text-[#929DA7]">{l.label}</span></span>
                {l.code === lang && <Check className="w-4 h-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
