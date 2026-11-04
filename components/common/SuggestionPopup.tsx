"use client";

import React, { useState } from "react";
import { X, Lightbulb, Send, CheckCircle2, AlertCircle } from "lucide-react";

/** Link-style button that opens a small pop-up for website suggestions (no page navigation). */
export default function SuggestionPopup({ className, children }: { className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ text: "", name: "", email: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const close = () => { setOpen(false); setMsg(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.text.trim().length < 5) { setMsg({ ok: false, t: "Please write your suggestion (a few words at least)." }); return; }
    setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: f.name.trim() || "Website visitor", companyName: "", email: f.email.trim() || "noreply@petroeng.in", phone: "", division: "Suggestion", subject: "Website suggestion", message: f.text }),
      });
      const out = await res.json();
      if (!res.ok || !out.success) throw new Error(out.message || "Could not send");
      setMsg({ ok: true, t: "Thank you! Your suggestion has been received." });
      setF({ text: "", name: "", email: "" });
    } catch (err: any) {
      setMsg({ ok: false, t: err.message || "Something went wrong. Please try again." });
    } finally { setBusy(false); }
  };

  const inp = "w-full rounded-lg border border-[#D8DDE2] px-3 py-2 text-[13.5px] text-[#17191C] placeholder:text-[#929DA7] focus:outline-none focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/15";
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>{children}</button>
      {open && (
        <div className="fixed inset-0 z-[85] overflow-y-auto overscroll-contain flex p-4 bg-[#17191C]/70 backdrop-blur-sm" onClick={close}>
          <div role="dialog" aria-modal="true" aria-label="Suggestions" onClick={(e) => e.stopPropagation()} className="relative w-full m-auto max-w-[460px] rounded-3xl bg-white shadow-2xl p-6 border-t-4 border-[#FF4B32] text-left">
            <button type="button" aria-label="Close" onClick={close} className="absolute right-4 top-4 p-1 text-[#5F6871] hover:text-[#17191C]"><X className="w-5 h-5" /></button>
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF4B32] to-[#FFA028] text-white flex items-center justify-center mb-3"><Lightbulb className="w-5 h-5" /></span>
            <h3 className="text-[1.25rem] font-black text-[#17191C]">Share your suggestion</h3>
            <p className="text-[13px] text-[#5F6871] mb-4">Tell us how we can improve the website or our service.</p>
            {msg?.ok ? (
              <div className="rounded-xl bg-green-50 border border-green-200 text-green-900 p-4 text-[13.5px] flex gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" />{msg.t}</div>
            ) : (
              <form onSubmit={submit} className="space-y-3" noValidate>
                <textarea aria-label="Your suggestion" rows={4} className={inp} placeholder="Your suggestion *" value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input aria-label="Name" className={inp} placeholder="Name (optional)" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                  <input aria-label="Email" type="email" className={inp} placeholder="Email (optional)" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
                </div>
                {msg && !msg.ok && <div className="flex gap-2 rounded-lg bg-[#FF4B32]/10 border border-[#FF4B32]/30 text-[#17191C] text-[12.5px] p-2.5"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF4B32]" />{msg.t}</div>}
                <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF4B32] to-[#FFA028] text-white text-[14px] font-extrabold py-3 disabled:opacity-60 shadow-md shadow-[#FF4B32]/25"><Send className="w-4 h-4" />{busy ? "Sending…" : "Submit suggestion"}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
