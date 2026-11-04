"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Database,
  Globe,
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

  // Generate breadcrumb from pathname
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "));

  const currentPageTitle = segments[segments.length - 1] || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-[#D8DDE2] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-[#5F6871] hover:text-[#17191C] hover:bg-[#F5F6F7] transition-colors"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#5F6871] hidden sm:inline">Admin CMS</span>
          <span className="text-[#929DA7] hidden sm:inline">/</span>
          <h1 className="font-bold text-[#17191C] text-sm sm:text-base tracking-tight">
            {currentPageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Quick Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Refresh Action */}
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

        {/* View Public Website (Opens in same tab/page) */}
        <Link
          href="/"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8DDE2] text-xs font-semibold text-[#17191C] hover:bg-[#F5F6F7] transition-colors"
          title="Open Public Website"
        >
          <Globe className="w-3.5 h-3.5 text-[#5F6871]" />
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
