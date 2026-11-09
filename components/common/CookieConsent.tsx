"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Cookie, SlidersHorizontal, X } from "lucide-react";

const KEY = "petro-cookie-consent";
type Prefs = { analytics: boolean; marketing: boolean };

function Toggle({ on, onChange, disabled = false, label }: { on: boolean; onChange?: (v: boolean) => void; disabled?: boolean; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={disabled} onClick={() => onChange?.(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-[#C80808]" : "bg-[#D8DDE2]"} ${disabled ? "opacity-70" : ""}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

/** Cookie consent: compact pill (Customize / Decline / Accept All) with a preferences panel. */
export default function CookieConsent() {
  const pathname = usePathname() || "";
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [panel, setPanel] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, marketing: false });

  useEffect(() => {
    setReady(true);
    if (!localStorage.getItem(KEY)) { const t = setTimeout(() => setVisible(true), 2200); return () => clearTimeout(t); }
  }, []);

  const save = (p: Prefs) => {
    localStorage.setItem(KEY, JSON.stringify({ ...p, necessary: true, at: Date.now() }));
    setVisible(false);
    setPanel(false);
  };

  if (!ready || !visible || pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;
  return (
    <div className="fixed inset-x-0 bottom-4 z-[90] px-3 flex justify-center pointer-events-none notranslate" translate="no">
      {!panel ? (
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 rounded-full bg-white border border-[#E7E9EE] shadow-[0_14px_40px_rgba(23,25,28,0.25)] p-1.5 pr-1.5 max-w-full animate-[routefade_.5s_ease-out_both]" role="dialog" aria-label="Cookie consent">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C80808] to-[#E0A21A] text-white flex items-center justify-center shrink-0"><Cookie className="w-4 h-4" /></span>
          <span className="hidden sm:inline text-[13.5px] font-bold text-[#17191C] whitespace-nowrap">We use cookies</span>
          <button type="button" onClick={() => setPanel(true)} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] font-semibold text-[#4a5159] hover:bg-[#FFF8F0] hover:text-[#17191C] whitespace-nowrap"><SlidersHorizontal className="w-4 h-4" />Customize</button>
          <button type="button" onClick={() => save({ analytics: false, marketing: false })} className="rounded-full border border-[#D8DDE2] px-3.5 py-1.5 text-[13px] font-bold text-[#17191C] hover:bg-[#F5F6F7]">Decline</button>
          <button type="button" onClick={() => save({ analytics: true, marketing: true })} className="rounded-full bg-[#C80808] hover:bg-[#A81010] text-white px-4 py-1.5 text-[13px] font-extrabold whitespace-nowrap transition-colors">Accept All</button>
        </div>
      ) : (
        <div className="pointer-events-auto w-full max-w-[450px] rounded-3xl bg-white border border-[#E7E9EE] shadow-[0_24px_70px_rgba(23,25,28,0.35)] p-5 animate-[routefade_.4s_ease-out_both]" role="dialog" aria-label="Customize cookie preferences">
          <div className="flex items-start gap-3 mb-4">
            <span className="w-10 h-10 rounded-full bg-[#FBE9EC] text-[#C80808] flex items-center justify-center shrink-0"><Cookie className="w-5 h-5" /></span>
            <div className="flex-1"><h3 className="text-[16px] font-extrabold text-[#17191C]">Customize preferences</h3><p className="text-[12.5px] text-[#4a5159]">Choose which cookies you allow.</p></div>
            <button type="button" aria-label="Close" onClick={() => setPanel(false)} className="p-1 text-[#4a5159] hover:text-[#17191C]"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-2.5">
            {[
              { k: "necessary", t: "Strictly necessary", d: "Required for the site to function. Always on.", on: true },
              { k: "analytics", t: "Analytics", d: "Help us understand how the site is used so we can improve it.", on: prefs.analytics },
              { k: "marketing", t: "Marketing", d: "Used to personalise content and measure campaigns.", on: prefs.marketing },
            ].map((r) => (
              <div key={r.k} className="flex items-center gap-3 rounded-xl border border-[#E7E9EE] px-3.5 py-3">
                <div className="flex-1"><div className="text-[13.5px] font-extrabold text-[#17191C]">{r.t}</div><div className="text-[12px] text-[#4a5159] leading-snug">{r.d}</div></div>
                <Toggle on={r.on} disabled={r.k === "necessary"} label={r.t} onChange={(v) => setPrefs((p) => ({ ...p, [r.k]: v }))} />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2.5 mt-4">
            <button type="button" onClick={() => save({ analytics: false, marketing: false })} className="rounded-full border border-[#17191C] px-4 py-2 text-[13px] font-bold text-[#17191C] hover:bg-[#17191C] hover:text-white transition-colors">Decline all</button>
            <button type="button" onClick={() => save(prefs)} className="rounded-full bg-[#C80808] hover:bg-[#A81010] text-white px-5 py-2 text-[13px] font-extrabold transition-colors">Save preferences</button>
          </div>
        </div>
      )}
    </div>
  );
}
