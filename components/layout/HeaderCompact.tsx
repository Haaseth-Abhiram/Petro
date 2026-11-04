"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Lock,
  Phone,
  Mail,
  Menu,
  X,
  ArrowRight,
  Briefcase,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";
import PetroLogo from "@/components/common/PetroLogo";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { COMPANY_INFO } from "@/data/company";

interface CurrentUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

const nav = [
  { label: "Home", href: "/" },
  { label: "Chemicals", href: "/chemicals" },
  { label: "Instrumentation", href: "/instrumentation" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
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

export default function HeaderCompact() {
  const path = usePathname();
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check login session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [path]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    setCurrentUser(null);
    setUserDropdownOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenu(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [searchOpen]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const needle = q.trim().toLowerCase();
  const results = needle
    ? index.filter((i) => (i.t + " " + i.d).toLowerCase().includes(needle)).slice(0, 7)
    : index.slice(0, 6);

  const isAdmin = currentUser?.role === "admin" || currentUser?.email === "admin@petroeng.in";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_1px_3px_rgba(23,25,28,0.08)]">
      {/* Brand accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-[#FF4B32] via-[#FFA028] to-[#FF4B32]" />

      {/* Top bar */}
      <div className="bg-[#17191C] text-[12.5px] hidden md:block">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center gap-7 text-white/80">
            <a
              href={"tel:" + COMPANY_INFO.contact.phoneRaw}
              className="inline-flex items-center gap-2 hover:text-[#FFA028] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FFA028]" />
              {COMPANY_INFO.contact.phone}
            </a>
            <a
              href={"mailto:" + COMPANY_INFO.contact.email}
              className="inline-flex items-center gap-2 hover:text-[#FFA028] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#FFA028]" />
              {COMPANY_INFO.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span className="[&_button]:text-white/85 [&_button:hover]:text-[#FFA028]">
              <LanguageSwitcher />
            </span>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 font-semibold text-white/85 hover:text-[#FFA028] transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#FFA028]" />
              Careers
            </Link>

            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 transition-all text-xs font-semibold"
                >
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF4B32] to-[#FFA028] text-white flex items-center justify-center text-[10px]">
                    <User className="w-3 h-3" />
                  </span>
                  <span>{currentUser.name || currentUser.email.split("@")[0]}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FF4B32] text-white">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-white/60" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-[#929DA7]/20 py-2 text-[#17191C] z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-[#F5F6F7]">
                      <p className="text-xs font-semibold text-[#17191C] truncate">
                        {currentUser.name || "User"}
                      </p>
                      <p className="text-[11px] text-[#929DA7] truncate">{currentUser.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#FF4B32] hover:bg-[#F5F6F7] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#FF4B32]" />
                        <span>Admin CMS Dashboard</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#FF4B32] to-[#FFA028] text-white font-extrabold pl-1 pr-4 py-[3px] shadow-[0_4px_14px_rgba(255,75,50,0.35)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="w-6 h-6 rounded-full bg-white text-[#FF4B32] flex items-center justify-center">
                  <Lock className="w-3 h-3" />
                </span>
                Login
                <span className="absolute inset-y-0 -left-10 w-8 bg-white/40 skew-x-[-20deg] group-hover:left-[120%] transition-all duration-700" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-6">
        <Link href="/" aria-label="Petro Engineering home" className="shrink-0">
          <PetroLogo width={158} />
        </Link>
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {nav.map((n) => {
            const on = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={on ? "page" : undefined}
                className={`relative px-3.5 py-2 text-[14.5px] font-semibold transition-colors after:absolute after:left-3.5 after:right-3.5 after:-bottom-1 after:h-[3px] after:rounded-full after:bg-[#FF4B32] after:origin-left after:transition-transform ${
                  on
                    ? "text-[#FF4B32] after:scale-x-100"
                    : "text-[#17191C] hover:text-[#FF4B32] after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search the site"
            onClick={() => setSearchOpen(true)}
            className="group flex items-center gap-2.5 rounded-full border border-[#929DA7]/20 bg-gradient-to-b from-white to-[#F5F6F7] shadow-sm hover:shadow-[0_8px_20px_rgba(255,75,50,0.18)] hover:border-[#FF4B32] pl-1.5 pr-3 sm:pr-3.5 py-1.5 transition-all duration-300"
          >
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4B32] to-[#FFA028] text-white flex items-center justify-center group-hover:rotate-12 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </span>
            <span className="hidden sm:block text-[13px] font-semibold text-[#929DA7] group-hover:text-[#17191C] w-[90px] text-left">
              Search…
            </span>
          </button>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMenu(!menu)}
            className="lg:hidden w-10 h-10 rounded-lg border border-[#929DA7]/20 flex items-center justify-center text-[#17191C]"
          >
            {menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menu && (
        <div className="lg:hidden border-t border-[#929DA7]/20 bg-white px-5 py-3 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMenu(false)}
              className="flex items-center justify-between py-2.5 text-[15px] font-semibold text-[#17191C] border-b border-[#F5F6F7]"
            >
              {n.label}
              <ArrowRight className="w-4 h-4 text-[#FF4B32]" />
            </Link>
          ))}
          <Link
            href="/careers"
            onClick={() => setMenu(false)}
            className="flex items-center justify-between py-2.5 text-[15px] font-semibold text-[#17191C] border-b border-[#F5F6F7]"
          >
            Careers
            <ArrowRight className="w-4 h-4 text-[#FF4B32]" />
          </Link>
          <Link
            href="/resources"
            onClick={() => setMenu(false)}
            className="flex items-center justify-between py-2.5 text-[15px] font-semibold text-[#17191C] border-b border-[#F5F6F7]"
          >
            Resources & FAQs
            <ArrowRight className="w-4 h-4 text-[#FF4B32]" />
          </Link>

          {currentUser ? (
            <div className="pt-2 border-t border-[#F5F6F7] space-y-2">
              <div className="px-1 text-xs text-[#929DA7]">
                Logged in as <strong className="text-[#17191C]">{currentUser.name || currentUser.email}</strong>
              </div>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenu(false)}
                  className="flex items-center justify-between py-2.5 text-[15px] font-bold text-[#FF4B32] border-b border-[#F5F6F7]"
                >
                  Admin CMS Dashboard
                  <ShieldCheck className="w-4 h-4 text-[#FF4B32]" />
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-between py-2.5 text-[15px] font-semibold text-rose-600"
              >
                Sign Out
                <LogOut className="w-4 h-4 text-rose-600" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenu(false)}
              className="flex items-center justify-between py-2.5 text-[15px] font-semibold text-[#FF4B32]"
            >
              Login
              <ArrowRight className="w-4 h-4 text-[#FF4B32]" />
            </Link>
          )}

          <div className="pt-2">
            <LanguageSwitcher variant="drawer" />
          </div>
        </div>
      )}

      {/* Search panel modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] bg-[#17191C]/60 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            role="dialog"
            aria-label="Site search"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[600px] rounded-3xl bg-white shadow-2xl overflow-hidden border-t-4 border-[#FF4B32]"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#929DA7]/20">
              <Search className="w-5 h-5 text-[#FF4B32]" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, services, pages…"
                className="flex-1 outline-none text-[16px] text-[#17191C] placeholder:text-[#929DA7]"
                aria-label="Search"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="text-[11px] font-bold rounded-md border border-[#929DA7]/30 px-2 py-1 text-[#17191C]"
              >
                ESC
              </button>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <li className="px-5 py-6 text-center text-[14px] text-[#929DA7]">
                  No matches. Try “valve”, “RO”, “fittings”, or “careers”.
                </li>
              )}
              {results.map((r) => (
                <li key={r.h + r.t}>
                  <Link
                    href={r.h}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between gap-3 px-5 py-2.5 hover:bg-[#F5F6F7] group transition-colors"
                  >
                    <span>
                      <span className="block text-[14.5px] font-extrabold text-[#17191C]">
                        {r.t}
                      </span>
                      <span className="block text-[12.5px] text-[#929DA7]">{r.d}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#FF4B32] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
