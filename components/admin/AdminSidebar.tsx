"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  Users,
  Settings,
  Clock,
  ExternalLink,
  LogOut,
  X,
  ChevronRight,
  Shield,
  Briefcase,
  UserCheck,
  BarChart3,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    email: string;
    name?: string;
    role?: string;
  } | null;
  enquiriesBadge?: number;
  rfqBadge?: number;
  applicationsBadge?: number;
}

export default function AdminSidebar({
  isOpen,
  onClose,
  user,
  enquiriesBadge = 0,
  rfqBadge = 0,
  applicationsBadge = 0,
}: AdminSidebarProps) {
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    window.location.href = "/login";
  };

  // Operational items
  const operationalNavItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Categories",
      href: "/admin/categories",
      icon: Layers,
    },
    {
      label: "Enquiries",
      href: "/admin/enquiries",
      icon: Mail,
      badge: enquiriesBadge > 0 ? enquiriesBadge : undefined,
    },
    {
      label: "Quote Requests (RFQ)",
      href: "/admin/quote-requests",
      icon: FileSpreadsheet,
      badge: rfqBadge > 0 ? rfqBadge : undefined,
    },
    {
      label: "Website Content",
      href: "/admin/content",
      icon: FileEdit,
    },
    {
      label: "Documents & Brochures",
      href: "/admin/documents",
      icon: FileText,
    },
    {
      label: "Services",
      href: "/admin/services",
      icon: Flame,
    },
    {
      label: "Industries",
      href: "/admin/industries",
      icon: Building2,
    },
  ];

  // Careers & Recruitment items
  const careersNavItems = [
    {
      label: "Careers Dashboard",
      href: "/admin/careers",
      icon: LayoutDashboard,
    },
    {
      label: "Job Management",
      href: "/admin/careers/jobs",
      icon: Briefcase,
    },
    {
      label: "Candidate Applications",
      href: "/admin/careers/applications",
      icon: UserCheck,
      badge: applicationsBadge > 0 ? applicationsBadge : undefined,
    },
    {
      label: "Job Categories",
      href: "/admin/careers/categories",
      icon: Layers,
    },
    {
      label: "Recruitment Settings",
      href: "/admin/careers/settings",
      icon: Settings,
    },
  ];

  // Administrative & Security controls
  const adminNavItems = [
    {
      label: "Admin Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Company Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      label: "Audit Logs",
      href: "/admin/audit-logs",
      icon: Clock,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#17191C] text-white flex flex-col border-r border-[#2A2E34] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#2A2E34] shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image
              src="/assets/img/logo.png"
              alt="Petro Engineering Logo"
              width={160}
              height={32}
              className="h-7 w-auto object-contain brightness-0 invert"
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-[#929DA7] hover:text-white rounded-md"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF4B32] text-white font-black text-sm flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || "Administrator"}
                </p>
              </div>
              <p className="text-[11px] text-[#929DA7] truncate">
                {user?.email || "admin@petroeng.in"}
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
            <span className="text-[#929DA7]">Role:</span>
            <span className="font-semibold px-2 py-0.5 rounded bg-[#FF4B32]/20 text-[#FF4B32]">
              {user?.role || "Admin"}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#929DA7]">
            Operational CMS
          </p>

          {/* Operational links */}
          {operationalNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#FF4B32] text-white shadow-sm"
                    : "text-[#929DA7] hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-[#929DA7] group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-[#FF4B32]"
                        : "bg-[#FF4B32] text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Careers & Recruitment section */}
          <div className="pt-3 mt-3 border-t border-[#2A2E34]">
            <div className="flex items-center justify-between px-3 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#FF4B32]" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF4B32]">
                  Careers &amp; Recruitment
                </p>
              </div>
              {applicationsBadge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#FF4B32] text-white">
                  {applicationsBadge} NEW
                </span>
              )}
            </div>

            {careersNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin/careers"
                  ? pathname === "/admin/careers"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#FF4B32] text-white shadow-sm"
                      : "text-[#929DA7] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[#929DA7] group-hover:text-white"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white text-[#FF4B32]"
                          : "bg-[#FF4B32] text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Admin Management & Security section */}
          <div className="pt-3 mt-3 border-t border-[#2A2E34]">
            <div className="flex items-center gap-1.5 px-3 pb-1.5">
              <Shield className="w-3 h-3 text-[#FFA028]" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#FFA028]">
                Admin Controls
              </p>
            </div>

            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#FF4B32] text-white shadow-sm"
                      : "text-[#929DA7] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[#929DA7] group-hover:text-white"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-[#2A2E34] space-y-1 shrink-0 bg-[#121416]">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-[#929DA7] hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-[#929DA7]" />
              <span>View Public Website</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#929DA7]" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-[#FF4B32] hover:bg-[#FF4B32]/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
