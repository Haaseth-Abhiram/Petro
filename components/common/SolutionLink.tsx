"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, CheckCircle2, Send, AlertCircle, Lightbulb } from "lucide-react";

/** Opens a pop-up with suggested solutions for a product group and a short enquiry form, instead of navigating away. */
export default function SolutionLink({ title, items, img, className, children }: { title: string; items: string[]; img?: string; className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [f, setF] = useState({ name: "", email: "", phone: "", note: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);

  const close = () => { setOpen(false); setMsg(null); };
  const toggle = (i: string) => setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(f.email)) { setMsg({ ok: false, t: "Please enter your name and a valid email." }); return; }
    setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: f.name, companyName: "", email: f.email, phone: f.phone, division: title, subject: `Solution enquiry - ${title}`, message: `Group: ${title}\nInterested in: ${picked.length ? picked.join(", ") : "general enquiry"}\n\n${f.note || "No additional notes."}` }),
      });
      const out = await res.json();
      if (!res.ok || !out.success) throw new Error(out.message || "Could not send");
      setMsg({ ok: true, t: "Thank you — our engineers will reply within one business day." });
      setF({ name: "", email: "", phone: "", note: "" }); setPicked([]);
    } catch (err: any) {
      setMsg({ ok: false, t: err.message || "Something went wrong. Please try again." });
    } finally { setBusy(false); }
  };

  const inp = "w-full rounded-lg border border-[#D8DDE2] px-3 py-2 text-[13.5px] text-[#17191C] placeholder:text-[#929DA7] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/15";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>{children}</button>
      {open && (
        <div className="fixed inset-0 z-[85] overflow-y-auto overscroll-contain flex p-4 bg-[#17191C]/70 backdrop-blur-sm" onClick={close}>
          <div role="dialog" aria-modal="true" aria-label={title} style={{ maxHeight: "calc(90dvh / var(--z))" }} onClick={(e) => e.stopPropagation()} className="relative w-full m-auto max-w-[600px] overflow-y-auto overscroll-contain rounded-3xl bg-white shadow-2xl text-left">
            <div className="relative h-[110px] overflow-hidden rounded-t-3xl bg-[#17191C]">
              {img && <Image src={img} alt="" fill sizes="600px" className="object-cover opacity-50" />}
              <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/75 to-[#C80808]/20" />
              <div className="absolute left-6 bottom-4 right-14 text-white"><span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-[0.2em] text-[#F2B93B]"><Lightbulb className="w-3.5 h-3.5" />SUGGESTED SOLUTIONS</span><h3 className="text-[1.3rem] font-black leading-tight !text-white">{title}</h3></div>
              <button type="button" aria-label="Close" onClick={close} className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-[12.5px] font-bold text-[#17191C] mb-2">Select what you need (optional):</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {items.map((i) => (
                  <button key={i} type="button" onClick={() => toggle(i)} aria-pressed={picked.includes(i)} className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${picked.includes(i) ? "bg-[#C80808] border-[#C80808] text-white" : "bg-[#FFF8F0] border-[#F0E3D2] text-[#17191C] hover:border-[#C80808]"}`}>{picked.includes(i) && <CheckCircle2 className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />}{i}</button>
                ))}
              </div>
              {msg?.ok ? (
                <div className="rounded-xl bg-green-50 border border-green-200 text-green-900 p-4 text-[13.5px] flex gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" />{msg.t}</div>
              ) : (
                <form onSubmit={submit} className="space-y-3" noValidate>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input aria-label="Your name" className={inp} placeholder="Your name *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                    <input aria-label="Phone" className={inp} placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
                  </div>
                  <input aria-label="Email" type="email" className={inp} placeholder="Email *" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
                  <textarea aria-label="Requirement" rows={2} className={inp} placeholder="Quantity, specification or water analysis (optional)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
                  {msg && !msg.ok && <div className="flex gap-2 rounded-lg bg-[#FBE9EC] border border-[#C80808]/30 text-[#C80808] text-[12.5px] p-2.5"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{msg.t}</div>}
                  <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C80808]/50 to-[#E0A21A]/50 text-white text-[14px] font-extrabold py-3 disabled:opacity-50"><Send className="w-4 h-4" />{busy ? "Sending…" : "Send enquiry"}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
