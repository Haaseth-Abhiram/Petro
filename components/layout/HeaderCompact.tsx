"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Lock, Phone, Mail, Menu, X, ArrowRight, Briefcase, ShieldCheck, LogOut } from "lucide-react";
import PetroLogo from "@/components/common/PetroLogo";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { COMPANY_INFO } from "@/data/company";

const nav = [
  { label: "Home", href: "/" },
  { label: "Chemicals", href: "/chemicals" },
  { label: "Instrumentation", href: "/instrumentation" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const index = [
  { t: "Home", d: "Petro Engineering overview", h: "/" },
  { t: "Chemicals & Water Treatment", d: "RO, cooling, boiler, ETP chemistry, plants, laboratory", h: "/chemicals" },
  { t: "RO Chemicals & Components", d: "Antiscalants, membranes, dosing pumps, filters", h: "/chemicals#ro-chemicals" },
  { t: "Cooling Water Chemicals", d: "Scale and corrosion inhibitors, biocides", h: "/chemicals#cooling-water" },
  { t: "Boiler Water Chemicals", d: "Oxygen scavengers, descalers", h: "/chemicals#boiler-water" },
  { t: "Wastewater / ETP Chemicals", d: "Polyelectrolytes, ferric chloride, PAC", h: "/chemicals#etp-chemicals" },
  { t: "Instrumentation & Valves", d: "Fittings, valves, tubing, analysers", h: "/instrumentation" },
  { t: "Tube Fittings", d: "Twin-ferrule instrumentation fittings", h: "/instrumentation#tube-fittings" },
  { t: "Ball Valves", d: "2-way and 3-way ball valves", h: "/instrumentation#ball-valves" },
  { t: "Needle Valves", d: "Up to 10,000 psi", h: "/instrumentation#needle-valves" },
  { t: "Analyser Systems", d: "CEMS, GC, sample conditioning", h: "/instrumentation#analyser-systems" },
  { t: "Services", d: "Sourcing, procurement, inspection, logistics", h: "/services" },
  { t: "Industries Served", d: "Oil & gas, petrochemical, power, water", h: "/industries" },
  { t: "Resources & FAQs", d: "Guides and frequently asked questions", h: "/resources" },
  { t: "About Us", d: "Who we are and our principles", h: "/about" },
  { t: "Careers", d: "Open positions and applications", h: "/careers" },
  { t: "Contact Us", d: "Phone, email and enquiry form", h: "/contact" },
  { t: "Request a Quote", d: "Submit an RFQ or datasheet", h: "/request-a-quote" },
];

/** Proposed header: top bar (language, Careers, Login), compact nav with a search icon + site search. */
export default function HeaderCompact() {
  const path = usePathname();
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [admin, setAdmin] = useState<{ email: string; name?: string } | null>(null);

  // Show the admin session in the public header (Admin button, email, Logout)
  useEffect(() => {
    let live = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live && d?.authenticated) setAdmin(d.user); })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  const logout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch (e) {}
    setAdmin(null);
    window.location.href = "/";
  };

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setSearchOpen(false); setMenu(false); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [searchOpen]);

  const needle = q.trim().toLowerCase();
  const results = needle ? index.filter((i) => (i.t + " " + i.d).toLowerCase().includes(needle)).slice(0, 7) : index.slice(0, 6);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_3px_rgba(23,25,28,0.08)]">
      <div className="h-[2.5px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B] opacity-70" />
      {/* top bar */}
      <div className="bg-[#17191C] text-[12.5px] hidden md:block">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center gap-7 text-white/80">
            <a href={"tel:" + COMPANY_INFO.contact.phoneRaw} className="inline-flex items-center gap-2 hover:text-[#F2B93B] transition-colors"><Phone className="w-3.5 h-3.5 text-[#F2B93B]" />{COMPANY_INFO.contact.phone}</a>
            <a href={"mailto:" + COMPANY_INFO.contact.email} className="inline-flex items-center gap-2 hover:text-[#F2B93B] transition-colors"><Mail className="w-3.5 h-3.5 text-[#F2B93B]" />{COMPANY_INFO.contact.email}</a>
          </div>
          <div className="flex items-center gap-6">
            <span className="[&_button]:text-white/85 [&_button:hover]:text-[#F2B93B]"><LanguageSwitcher /></span>
            <Link href="/careers" className="inline-flex items-center gap-2 font-semibold text-white/85 hover:text-[#F2B93B] transition-colors"><Briefcase className="w-3.5 h-3.5 text-[#F2B93B]" />Careers</Link>
            {admin ? (
              <div className="flex items-center gap-4">
                <Link href="/admin/dashboard" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#C80808]/70 to-[#E0A21A]/70 text-white font-extrabold pl-1 pr-4 py-[3px] shadow-[0_3px_10px_rgba(200,8,8,0.20)] hover:-translate-y-0.5 transition-all duration-300" title="Open the admin console"><span className="w-6 h-6 rounded-full bg-white text-[#C80808] flex items-center justify-center"><ShieldCheck className="w-3.5 h-3.5" /></span>Admin<span className="absolute inset-y-0 -left-10 w-8 bg-white/40 skew-x-[-20deg] group-hover:left-[120%] transition-all duration-700" /></Link>
                <span className="h-5 w-px bg-white/20" />
                <span className="inline-flex items-center gap-2 text-white/90"><span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E0A21A]/70 to-[#C80808]/70 text-white text-[11px] font-black flex items-center justify-center">{String(admin?.name || admin?.email || "A").trim().charAt(0).toUpperCase()}</span><span className="max-w-[190px] truncate font-semibold">{admin.email}</span></span>
                <span className="h-5 w-px bg-white/20" />
                <button type="button" onClick={logout} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-[3px] font-bold text-white hover:bg-white hover:text-[#C80808] transition-colors"><LogOut className="w-3.5 h-3.5" />Logout</button>
              </div>
            ) : (
              <Link href="/login" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#C80808]/70 to-[#E0A21A]/70 text-white font-extrabold pl-1 pr-4 py-[3px] shadow-[0_3px_10px_rgba(200,8,8,0.20)] hover:-translate-y-0.5 transition-all duration-300"><span className="w-6 h-6 rounded-full bg-white text-[#C80808] flex items-center justify-center"><Lock className="w-3 h-3" /></span>Login<span className="absolute inset-y-0 -left-10 w-8 bg-white/40 skew-x-[-20deg] group-hover:left-[120%] transition-all duration-700" /></Link>
            )}
          </div>
        </div>
      </div>

      {/* nav */}
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-6">
        <Link href="/" aria-label="Petro Engineering home" className="shrink-0"><PetroLogo width={158} /></Link>
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {nav.map((n) => {
            const on = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined} className={`relative px-4 py-2 text-[15px] font-semibold transition-colors after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-[3px] after:rounded-full after:bg-[#C80808] after:origin-left after:transition-transform ${on ? "text-[#C80808] after:scale-x-100" : "text-[#17191C] hover:text-[#C80808] after:scale-x-0 hover:after:scale-x-100"}`}>{n.label}</Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Search the site" onClick={() => setSearchOpen(true)} className="group flex items-center gap-2.5 rounded-full border border-[#E7E9EE] bg-gradient-to-b from-white to-[#FFF8F0] shadow-sm hover:shadow-[0_6px_16px_rgba(200,8,8,0.12)] hover:border-[#C80808] pl-1.5 pr-3 sm:pr-3.5 py-1.5 transition-all duration-300"><span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C80808]/70 to-[#E0A21A]/70 text-white flex items-center justify-center group-hover:rotate-12 group-hover:scale-105 transition-transform"><Search className="w-4 h-4" /></span><span className="hidden sm:block text-[13px] font-semibold text-[#929DA7] group-hover:text-[#17191C] w-[104px] text-left">Search…</span></button>
          <button type="button" aria-label="Menu" onClick={() => setMenu(!menu)} className="lg:hidden w-10 h-10 rounded-lg border border-[#E7E9EE] flex items-center justify-center">{menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>

      {/* mobile menu */}
      {menu && (
        <div className="lg:hidden border-t border-[#E7E9EE] bg-white px-5 py-3 space-y-1">
          {[...nav, { label: "Careers", href: "/careers" }, ...(admin ? [{ label: "Admin console", href: "/admin/dashboard" }] : [{ label: "Login", href: "/login" }])].map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="flex items-center justify-between py-2.5 text-[15px] font-semibold text-[#17191C] border-b border-[#F3EEE6]">{n.label}<ArrowRight className="w-4 h-4 text-[#C80808]" /></Link>
          ))}
          {admin && <button type="button" onClick={logout} className="flex w-full items-center justify-between py-2.5 text-[15px] font-semibold text-[#C80808] border-b border-[#F3EEE6]">Logout ({admin.email})<LogOut className="w-4 h-4" /></button>}
          <div className="pt-2"><LanguageSwitcher variant="drawer" /></div>
        </div>
      )}

      {/* search panel */}
      {searchOpen && (
        <div className="fixed inset-0 z-[70] bg-[#17191C]/60 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4" onClick={() => setSearchOpen(false)}>
          <div role="dialog" aria-label="Site search" onClick={(e) => e.stopPropagation()} className="w-full max-w-[600px] rounded-3xl bg-white shadow-2xl overflow-hidden border-t-4 border-[#C80808]">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E7E9EE]">
              <Search className="w-5 h-5 text-[#C80808]" />
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, services, pages…" className="flex-1 outline-none text-[16px] text-[#17191C] placeholder:text-[#929DA7]" aria-label="Search" />
              <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)} className="text-[11px] font-bold rounded-md border border-[#E7E9EE] px-2 py-1 text-[#4a5159]">ESC</button>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto py-2">
              {results.length === 0 && <li className="px-5 py-6 text-center text-[14px] text-[#4a5159]">No matches. Try “valve”, “RO” or “careers”.</li>}
              {results.map((r) => (
                <li key={r.h + r.t}><Link href={r.h} onClick={() => setSearchOpen(false)} className="flex items-center justify-between gap-3 px-5 py-2.5 hover:bg-[#FFF8F0] group"><span><span className="block text-[14.5px] font-extrabold text-[#17191C]">{r.t}</span><span className="block text-[12.5px] text-[#4a5159]">{r.d}</span></span><ArrowRight className="w-4 h-4 text-[#C80808] opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              ))}
            </ul>
            
          </div>
        </div>
      )}
    </header>
  );
}
