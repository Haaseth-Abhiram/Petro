"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Send, UploadCloud, FileText, X } from "lucide-react";

export const CAREER_ROLES = [
  "Sales Engineer",
  "Procurement Coordinator",
  "Quality Engineer",
  "Chemical Engineer",
  "Logistics Executive",
  "General Application",
];

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Valid phone number required"),
  role: z.string().min(1, "Please choose a role"),
  experience: z.string().min(1, "Please choose your experience"),
  link: z.string().optional(),
  message: z.string().min(10, "Tell us a little about yourself (min 10 characters)"),
});

type FormData = z.infer<typeof schema>;

const input = "w-full rounded-lg border border-[#D8DDE2] bg-white px-3.5 py-2.5 text-[14px] text-[#17191C] placeholder:text-[#929DA7] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/15 transition";
const label = "block text-[12.5px] font-bold text-[#17191C] mb-1";
const err = "text-[11.5px] text-[#C80808] mt-1";

export default function CareerForm({ defaultRole = "General Application" }: { defaultRole?: string }) {
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [cvErr, setCvErr] = useState<string | null>(null);
  const pick = (f?: File | null) => {
    setCvErr(null);
    if (!f) return setCv(null);
    if (!/\.(pdf|docx?)$/i.test(f.name)) { setCvErr("Please choose a PDF, DOC or DOCX file."); return; }
    if (f.size > 5 * 1024 * 1024) { setCvErr("File is larger than 5 MB."); return; }
    setCv(f);
  };
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", phone: "", role: defaultRole, experience: "", link: "", message: "" },
  });

  const onSubmit = async (d: FormData) => {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      Object.entries({ fullName: d.fullName, email: d.email, phone: d.phone, role: d.role, experience: d.experience, link: d.link || "", message: d.message }).forEach(([k, v]) => fd.append(k, v));
      if (cv) fd.append("cv", cv);
      const res = await fetch("/api/careers", { method: "POST", body: fd });
      const out = await res.json();
      if (!res.ok || !out.success) throw new Error(out.message || "Could not submit your application");
      setDone(true);
      setCv(null);
      reset();
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-[#FFF8F0] border border-[#F0E3D2] p-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-[#C80808] mx-auto mb-3" />
        <h3 className="text-[18px] font-black text-[#17191C] mb-1">Application received</h3>
        <p className="text-[13.5px] mb-4">Thank you for your interest in Petro Engineering. Our team will review your profile and get in touch if there is a match.</p>
        <button type="button" onClick={() => setDone(false)} className="text-[13px] font-extrabold text-[#C80808] hover:underline">Submit another application</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={label} htmlFor="c-name">Full name *</label><input id="c-name" className={input} placeholder="Your full name" {...register("fullName")} />{errors.fullName && <p className={err}>{errors.fullName.message}</p>}</div>
        <div><label className={label} htmlFor="c-phone">Phone number *</label><input id="c-phone" className={input} placeholder="+91 98765 43210" {...register("phone")} />{errors.phone && <p className={err}>{errors.phone.message}</p>}</div>
      </div>
      <div><label className={label} htmlFor="c-email">Email address *</label><input id="c-email" type="email" className={input} placeholder="you@email.com" {...register("email")} />{errors.email && <p className={err}>{errors.email.message}</p>}</div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className={label} htmlFor="c-role">Role of interest *</label><select id="c-role" className={input} {...register("role")}>{CAREER_ROLES.map((r) => <option key={r}>{r}</option>)}</select>{errors.role && <p className={err}>{errors.role.message}</p>}</div>
        <div><label className={label} htmlFor="c-exp">Experience *</label><select id="c-exp" className={input} {...register("experience")}><option value="">Select…</option><option>Fresher / 0–1 years</option><option>2–5 years</option><option>6–10 years</option><option>10+ years</option></select>{errors.experience && <p className={err}>{errors.experience.message}</p>}</div>
      </div>
      <div><label className={label} htmlFor="c-link">CV / LinkedIn link (optional)</label><input id="c-link" className={input} placeholder="https://" {...register("link")} /></div>
      <div>
        <label className={label}>Upload your CV (PDF, DOC, DOCX · max 5 MB)</label>
        {cv ? (
          <div className="flex items-center gap-3 rounded-xl border border-[#C80808]/30 bg-[#FBE9EC] px-3.5 py-2.5"><span className="w-9 h-9 rounded-lg bg-[#C80808] text-white flex items-center justify-center shrink-0"><FileText className="w-[18px] h-[18px]" /></span><span className="flex-1 min-w-0"><span className="block text-[13px] font-bold text-[#17191C] truncate">{cv.name}</span><span className="block text-[11.5px] text-[#4a5159]">{Math.round(cv.size / 1024)} KB</span></span><button type="button" aria-label="Remove file" onClick={() => pick(null)} className="p-1 text-[#4a5159] hover:text-[#C80808]"><X className="w-4 h-4" /></button></div>
        ) : (
          <div role="button" tabIndex={0} onClick={() => fileRef.current?.click()} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }} className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#E0A21A]/60 bg-[#FFF8F0] hover:bg-[#FFF3E6] hover:border-[#C80808] px-4 py-5 text-center transition-colors"><UploadCloud className="w-7 h-7 text-[#C80808]" /><span className="text-[13px] font-bold text-[#17191C]">Click to upload or drag &amp; drop</span><span className="text-[11.5px] text-[#4a5159]">PDF, DOC or DOCX</span></div>
        )}
        <input ref={fileRef} id="c-cv" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        {cvErr && <p className={err}>{cvErr}</p>}
      </div>
      <div><label className={label} htmlFor="c-msg">About you *</label><textarea id="c-msg" rows={4} className={input} placeholder="Your background, the kind of work you want to do, and when you could join…" {...register("message")} />{errors.message && <p className={err}>{errors.message.message}</p>}</div>
      {error && <div className="flex gap-2 rounded-lg bg-[#FBE9EC] border border-[#C80808]/30 text-[#8A0A0A] text-[13px] p-3"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}</div>}
      <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#C80808] hover:bg-[#8A0A0A] disabled:opacity-60 text-white text-[14px] font-extrabold px-5 py-3 transition-colors"><Send className="w-4 h-4" />{busy ? "Sending…" : "Submit application"}</button>
      <p className="text-center text-[11.5px] text-[#929DA7]">Your details are used only to consider your application.</p>
    </form>
  );
}
