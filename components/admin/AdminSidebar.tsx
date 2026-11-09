"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Mail,
  FileSpreadsheet,
  FileEdit,
  FileText,
  Flame,
  Building2,
  Settings,
  ExternalLink,
  LogOut,
  X,
  Briefcase,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import PetroLogo from "@/components/common/PetroLogo";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { email: string; name?: string; role?: string } | null;
  enquiriesBadge?: number;
  rfqBadge?: number;
  applicationsBadge?: number;
}

type Item = { label: string; href: string; icon: LucideIcon; badge?: number; exact?: boolean };

export default function AdminSidebar({ isOpen, onClose, user, enquiriesBadge = 0, rfqBadge = 0, applicationsBadge = 0 }: AdminSidebarProps) {
  const pathname = usePathname() || "";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    window.location.href = "/login";
  };

  const groups: { title: string; items: Item[] }[] = [
    { title: "Overview", items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, exact: true }] },
    {
      title: "Catalogue",
      items: [
        { label: "Products", href: "/admin/products", icon: Package },
        { label: "Categories", href: "/admin/categories", icon: Layers },
      ],
    },
    {
      title: "Inbox",
      items: [
        { label: "Enquiries", href: "/admin/enquiries", icon: Mail, badge: enquiriesBadge },
        { label: "Quote Requests", href: "/admin/quote-requests", icon: FileSpreadsheet, badge: rfqBadge },
      ],
    },
    {
      title: "Hiring",
      items: [
        { label: "Careers", href: "/admin/careers", icon: Briefcase, exact: true },
        { label: "Jobs", href: "/admin/careers/jobs", icon: Briefcase },
        { label: "Job Applications", href: "/admin/careers/applications", icon: UserCheck, badge: applicationsBadge },
        { label: "Job Categories", href: "/admin/careers/categories", icon: Layers },
        { label: "Settings", href: "/admin/careers/settings", icon: Settings },
      ],
    },
  ];

  const initial = (user?.name || user?.email || "A").charAt(0).toUpperCase();

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside className={`fixed bottom-0 left-0 top-0 z-50 flex w-[17.5rem] flex-col bg-gradient-to-b from-[#17191D] via-[#141619] to-[#111215] text-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top_left,rgba(200,8,8,0.06),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#E0A21A]/05 blur-3xl" />

        {/* Brand — large, clearly visible logo */}
        <div className="relative shrink-0 px-4 pb-3 pt-5">
          <div className="flex items-start justify-between">
            <Link href="/admin/dashboard" className="block w-[228px] max-w-full drop-shadow-[0_4px_14px_rgba(200,8,8,0.20)]" aria-label="Petro Engineering admin">
              <PetroLogo variant="dark" width="100%" />
            </Link>
            <button onClick={onClose} className="rounded-md p-1.5 text-white/60 hover:text-white lg:hidden" aria-label="Close sidebar"><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#F2B93B]"><span className="h-px w-6 bg-gradient-to-r from-[#F2B93B] to-transparent" />Admin console</div>
        </div>

        {/* Nav */}
        <nav className="custom-scrollbar relative flex-1 space-y-3 overflow-y-auto px-3 pb-3 pt-1">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">{g.title}</p>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                      className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all ${active ? "bg-gradient-to-r from-[#D40E0E]/50 to-[#E0A21A]/50 text-white shadow-[0_6px_18px_-6px_rgba(224,100,20,0.18)]" : "text-white/65 hover:bg-white/[0.07] hover:text-white"}`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={`h-[17px] w-[17px] shrink-0 transition-colors ${active ? "text-white" : "text-white/50 group-hover:text-[#F2B93B]"}`} />
                        {item.label}
                      </span>
                      {!!item.badge && item.badge > 0 && (
                        <span className={`min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-extrabold ${active ? "bg-white text-[#C80808]" : "bg-[#C80808] text-white"}`}>{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Profile */}
        <div className="relative shrink-0 border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E0A21A]/50 to-[#C80808]/50 text-[15px] font-black text-white">{initial}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-white">{user?.name || "Admin"}</p>
              <p className="truncate text-[11px] text-white/45">{user?.email || "admin@petroeng.in"}</p>
            </div>
            <Link href="/" title="View public website" aria-label="View public website" className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white"><ExternalLink className="h-[18px] w-[18px]" /></Link>
            <button onClick={handleLogout} title="Sign out" aria-label="Sign out" className="rounded-lg p-2 text-white/50 transition-colors hover:bg-[#C80808]/25 hover:text-[#FF6A4D]"><LogOut className="h-[18px] w-[18px]" /></button>
          </div>
        </div>
      </aside>
    </>
  );
}
