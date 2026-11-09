"use client";

import React, { useRef, useState, useEffect } from "react";
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

const input = "w-full rounded-lg border border-[#D8DDE2] bg-white px-3.5 py-2.5 text-[14px] text-[#17191C] placeholder:text-[#929DA7] focus:outline-none focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/15 transition";
const label = "block text-[12.5px] font-bold text-[#17191C] mb-1";
const err = "text-[11.5px] text-[#FF4B32] mt-1";

export default function CareerForm({ defaultRole = "General Application" }: { defaultRole?: string }) {
  const [done, setDone] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cv, setCv] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [cvErr, setCvErr] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>(CAREER_ROLES);

  // Dynamically load active published job roles
  useEffect(() => {
    fetch("/api/careers/jobs")
      .then((r) => r.json())
      .then((data) => {
        if (data?.jobs?.length) {
          const fetchedRoles = data.jobs.map((j: any) => j.role || j.title);
          const combined = Array.from(new Set([...fetchedRoles, defaultRole, "General Application"])).filter(Boolean);
          setRoles(combined);
        }
      })
      .catch(() => {
        // Fallback silently to static CAREER_ROLES
      });
  }, [defaultRole]);

  const pick = (f?: File | null) => {
    setCvErr(null);
    if (!f) return setCv(null);
    if (!/\.(pdf|docx?)$/i.test(f.name)) { setCvErr("Please choose a PDF, DOC or DOCX file."); return; }
    if (f.size > 5 * 1024 * 1024) { setCvErr("File is larger than 5 MB."); return; }
    setCv(f);
  };

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", phone: "", role: defaultRole, experience: "", link: "", message: "" },
  });

  useEffect(() => {
    if (defaultRole) {
      setValue("role", defaultRole);
    }
  }, [defaultRole, setValue]);

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
      setRefCode(out.reference || null);
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
      <div className="rounded-2xl bg-[#FFF1EF] border border-[#FF4B32]/30 p-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-[#FF4B32] mx-auto mb-3" />
        <h3 className="text-[18px] font-black text-[#17191C] mb-1">Application received</h3>
        {refCode && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#17191C] text-[#FFA028] text-xs font-mono font-bold my-3 shadow-sm">
            Reference: {refCode}
          </div>
        )}
        <p className="text-[13.5px] text-[#5F6871] mb-4">Thank you for your interest in Petro Engineering. Our team will review your profile and get in touch if there is a match.</p>
        <button type="button" onClick={() => { setDone(false); setRefCode(null); }} className="text-[13px] font-extrabold text-[#FF4B32] hover:underline">Submit another application</button>
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
        <div>
          <label className={label} htmlFor="c-role">Role of interest *</label>
          <select id="c-role" className={input} {...register("role")}>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.role && <p className={err}>{errors.role.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="c-exp">Experience *</label>
          <select id="c-exp" className={input} {...register("experience")}>
            <option value="">Select…</option>
            <option>Fresher / 0–1 years</option>
            <option>2–5 years</option>
            <option>6–10 years</option>
            <option>10+ years</option>
          </select>
          {errors.experience && <p className={err}>{errors.experience.message}</p>}
        </div>
      </div>
      <div><label className={label} htmlFor="c-link">CV / LinkedIn link (optional)</label><input id="c-link" className={input} placeholder="https://" {...register("link")} /></div>
      <div>
        <label className={label}>Upload your CV (PDF, DOC, DOCX · max 5 MB)</label>
        {cv ? (
          <div className="flex items-center gap-3 rounded-xl border border-[#FF4B32]/30 bg-[#FF4B32]/10 px-3.5 py-2.5">
            <span className="w-9 h-9 rounded-lg bg-[#FF4B32] text-white flex items-center justify-center shrink-0"><FileText className="w-[18px] h-[18px]" /></span>
            <span className="flex-1 min-w-0"><span className="block text-[13px] font-bold text-[#17191C] truncate">{cv.name}</span><span className="block text-[11.5px] text-[#5F6871]">{Math.round(cv.size / 1024)} KB</span></span>
            <button type="button" aria-label="Remove file" onClick={() => pick(null)} className="p-1 text-[#5F6871] hover:text-[#FF4B32]"><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8DDE2] bg-[#F5F6F7] hover:bg-white hover:border-[#FF4B32] p-4 text-center cursor-pointer transition">
            <UploadCloud className="w-6 h-6 text-[#FF4B32] mb-1" />
            <span className="text-[13px] font-bold text-[#17191C]">Click to choose your CV file</span>
            <span className="text-[11.5px] text-[#5F6871]">PDF, DOC or DOCX up to 5 MB</span>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
          </label>
        )}
        {cvErr && <p className={err}>{cvErr}</p>}
      </div>
      <div><label className={label} htmlFor="c-msg">About you / cover note *</label><textarea id="c-msg" rows={3} className={input} placeholder="Tell us why you would like to join Petro Engineering..." {...register("message")} />{errors.message && <p className={err}>{errors.message.message}</p>}</div>
      {error && <div className="flex gap-2 rounded-lg bg-[#FF4B32]/10 border border-[#FF4B32]/30 text-[#17191C] text-[12.5px] p-2.5"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF4B32]" />{error}</div>}
      <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF4B32] to-[#FFA028] text-white text-[14px] font-extrabold py-3 disabled:opacity-50 hover:opacity-95 shadow-md shadow-[#FF4B32]/25"><Send className="w-4 h-4" />{busy ? "Submitting application…" : "Submit application"}</button>
    </form>
  );
}
