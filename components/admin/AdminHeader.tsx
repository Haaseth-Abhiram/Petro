"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  ExternalLink,
  ChevronDown,
  Bell,
  LayoutDashboard,
  LogOut,
  UserCog,
  ScrollText,
  Package,
  Layers,
  Mail,
  FileSpreadsheet,
  FileEdit,
  FileText,
  Flame,
  Building2,
  Briefcase,
  UserCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  user?: { email: string; name?: string; role?: string } | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  notifications?: number;
}

const ICONS: [string, LucideIcon][] = [
  ["/admin/careers/applications", UserCheck],
  ["/admin/careers/categories", Layers],
  ["/admin/careers/settings", Settings],
  ["/admin/careers", Briefcase],
  ["/admin/products", Package],
  ["/admin/categories", Layers],
  ["/admin/enquiries", Mail],
  ["/admin/quote-requests", FileSpreadsheet],
  ["/admin/content", FileEdit],
  ["/admin/documents", FileText],
  ["/admin/services", Flame],
  ["/admin/industries", Building2],
  ["/admin/dashboard", LayoutDashboard],
];

const SECTION: [string, string][] = [
  ["/admin/careers", "Hiring"],
  ["/admin/products", "Catalogue"],
  ["/admin/categories", "Catalogue"],
  ["/admin/enquiries", "Inbox"],
  ["/admin/quote-requests", "Inbox"],
  ["/admin/dashboard", "Overview"],
];

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");

export default function AdminHeader({ onToggleSidebar, user, notifications = 0 }: AdminHeaderProps) {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter(Boolean).filter((s) => s !== "admin").map(titleCase);
  const title = segments[segments.length - 1] || "Dashboard";
  const Icon = (ICONS.find(([p]) => pathname.startsWith(p)) || ["", LayoutDashboard])[1] as LucideIcon;
  const section = (SECTION.find(([p]) => pathname.startsWith(p)) || ["", "Content"])[1];
  const initial = (user?.name || user?.email || "A").charAt(0).toUpperCase();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  const signOut = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch (e) {}
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-20 border-b border-transparent bg-white/90 backdrop-blur-xl">
      <div className="flex h-[76px] items-center justify-between gap-3 px-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={onToggleSidebar} className="rounded-xl p-2 text-[#5F6871] transition-colors hover:bg-[#F5F6F7] hover:text-[#17191C] lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D40E0E]/70 to-[#E0A21A]/70 text-white shadow-[0_10px_22px_-8px_rgba(200,8,8,0.20)]"><Icon className="h-[22px] w-[22px]" /></span>
          <div className="min-w-0">
            <p className="hidden items-center gap-1.5 text-[13px] font-medium text-[#5F6871] sm:flex">Admin <span className="text-[#C3CAD1]">/</span> {section}</p>
            <h1 className="truncate text-[20px] font-black leading-tight tracking-tight text-[#17191C] sm:text-[22px]">{title}</h1>
          </div>
        </div>

        <div className="hidden max-w-xl flex-1 md:block">
          <label className="flex items-center gap-3 rounded-2xl border border-[#E4E7EC] bg-white px-4 py-3 text-[#929DA7] shadow-[0_1px_2px_rgba(23,25,28,0.03)] transition focus-within:border-[#C80808]/40 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#C80808]/10">
            <Search className="h-[18px] w-[18px] shrink-0" />
            <input type="search" placeholder="Search products, enquiries, candidates…" className="w-full bg-transparent text-[14px] text-[#17191C] outline-none placeholder:text-[#929DA7]" />
          </label>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button className="relative rounded-2xl border border-[#E4E7EC] bg-white p-3 text-[#17191C] shadow-[0_1px_2px_rgba(23,25,28,0.04)] transition-colors hover:border-[#C80808]/40 hover:bg-[#F4F4F5]" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            {notifications > 0 && <span className="absolute -right-1 -top-1 min-w-[19px] rounded-full bg-[#C80808] px-1 text-center text-[10px] font-extrabold leading-[19px] text-white ring-2 ring-white">{notifications > 99 ? "99+" : notifications}</span>}
          </button>
          <Link href="/" className="hidden items-center gap-2 rounded-2xl border border-[#E4E7EC] bg-white px-4 py-3 text-[14px] font-semibold text-[#17191C] shadow-[0_1px_2px_rgba(23,25,28,0.04)] transition-colors hover:border-[#C80808]/40 hover:text-[#C80808] lg:inline-flex" title="Open public website"><ExternalLink className="h-4 w-4" />View site</Link>
          <div ref={menuRef} className="relative">
            <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-haspopup="menu" aria-expanded={menuOpen} className={`flex items-center gap-3 rounded-2xl border bg-white py-1.5 pl-1.5 pr-3 shadow-[0_1px_2px_rgba(23,25,28,0.04)] transition-colors ${menuOpen ? "border-[#C80808]/40" : "border-[#E4E7EC] hover:border-[#C80808]/30"}`}>
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E0A21A]/70 to-[#C80808]/70 text-[15px] font-black text-white">
                {initial}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </span>
              <div className="hidden text-left xl:block">
                <p className="text-[13.5px] font-bold leading-none text-[#17191C]">{user?.name || "Admin"}</p>
                <p className="mt-1 text-[12px] leading-none text-[#5F6871]">{user?.email || "admin@petroeng.in"}</p>
              </div>
              <ChevronDown className={`hidden h-4 w-4 text-[#5F6871] transition-transform sm:block ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 top-[calc(100%+10px)] z-50 w-[270px] overflow-hidden rounded-2xl border border-[#E7E9EE] bg-white shadow-[0_24px_60px_-18px_rgba(23,25,28,0.16)] animate-[routefade_.18s_ease-out_both]">
                <div className="flex items-center gap-3 border-b border-[#EEF0F3] bg-[#FAFAFB] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#E0A21A]/70 to-[#C80808]/70 text-[16px] font-black text-white">{initial}</span>
                  <div className="min-w-0"><p className="truncate text-[14px] font-bold text-[#17191C]">{user?.name || "Administrator"}</p><p className="truncate text-[12px] text-[#5F6871]">{user?.email || "admin@petroeng.in"}</p><span className="mt-1 inline-block rounded-full bg-[#FBE9EC] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#C80808]">{user?.role || "Admin"}</span></div>
                </div>
                <div className="p-1.5">
                  {[{ href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard }, { href: "/admin/users", label: "Admin users", Icon: UserCog }, { href: "/admin/settings", label: "Settings", Icon: Settings }, { href: "/admin/audit-logs", label: "Audit logs", Icon: ScrollText }, { href: "/", label: "View public site", Icon: ExternalLink }].map(({ href, label, Icon: I }) => (
                    <Link key={href} href={href} role="menuitem" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-[#17191C] transition-colors hover:bg-[#F5F6F7]"><I className="h-[17px] w-[17px] text-[#5F6871]" />{label}</Link>
                  ))}
                </div>
                <div className="border-t border-[#EEF0F3] p-1.5">
                  <button type="button" role="menuitem" onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-semibold text-[#C80808] transition-colors hover:bg-[#F4F4F5]"><LogOut className="h-[17px] w-[17px]" />Sign out</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <span className="block h-[2px] bg-gradient-to-r from-[#C80808]/0 via-[#E0A21A] to-[#C80808]/0 opacity-70" />
    </header>
  );
}
