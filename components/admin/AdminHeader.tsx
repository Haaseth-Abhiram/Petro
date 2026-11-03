"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Database,
  ExternalLink,
  ShieldCheck,
  Bell,
  RefreshCw,
} from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  user?: {
    email: string;
    name?: string;
    role?: string;
  } | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function AdminHeader({
  onToggleSidebar,
  user,
  onRefresh,
  isRefreshing = false,
}: AdminHeaderProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path.includes("/admin/products")) return "Product Catalogue";
    if (path.includes("/admin/categories")) return "Product Categories";
    if (path.includes("/admin/enquiries")) return "Customer Enquiries";
    if (path.includes("/admin/quote-requests")) return "RFQ & Quotation Requests";
    if (path.includes("/admin/content")) return "Website Content CMS";
    if (path.includes("/admin/documents")) return "Documents & Engineering Library";
    if (path.includes("/admin/services")) return "Engineering Services";
    if (path.includes("/admin/industries")) return "Industries & Sectors";
    if (path.includes("/admin/users")) return "Admin Users & Access Control";
    if (path.includes("/admin/settings")) return "Company & System Settings";
    if (path.includes("/admin/audit-logs")) return "Security & Audit Logs";
    return "Management Dashboard";
  };

  return (
    <header className="h-16 bg-white border-b border-[#D8DDE2] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-[#17191C] hover:bg-[#F5F6F7] border border-[#D8DDE2]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6871]">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-[#17191C]">
              {getPageTitle(pathname)}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-[#17191C] tracking-tight leading-none mt-0.5 hidden sm:block">
            {getPageTitle(pathname)}
          </h1>
        </div>
      </div>

      {/* Right: DB Status + Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg text-[#5F6871] hover:text-[#17191C] hover:bg-[#F5F6F7] transition-colors border border-transparent hover:border-[#D8DDE2] disabled:opacity-50"
            title="Refresh Data"
            aria-label="Refresh Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#FF4B32]" : ""}`}
            />
          </button>
        )}

        {/* Database Connected Status Pill */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#17191C]/5 border border-[#D8DDE2] text-xs font-semibold text-[#17191C]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[#5F6871]">Supabase:</span>
          <span className="text-[#17191C] font-bold">Connected</span>
        </div>

        {/* View Public Website */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8DDE2] text-xs font-semibold text-[#17191C] hover:bg-[#F5F6F7] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#5F6871]" />
          <span>View Site</span>
        </Link>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#D8DDE2]">
          <div className="w-8 h-8 rounded-full bg-[#17191C] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#FF4B32]/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-[#17191C] leading-none">
              {user?.name || "Administrator"}
            </p>
            <p className="text-[10px] text-[#5F6871] leading-none mt-1">
              {user?.role || "Super Admin"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
