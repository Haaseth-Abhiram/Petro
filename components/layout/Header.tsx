"use client";

import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, ChevronDown, ChevronRight, X, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "@/data/company";

interface NavSubItem {
  name: string;
  href: string;
  description?: string;
  badge?: string;
}

interface NavItem {
  label: string;
  href: string;
  items?: NavSubItem[];
  allLink?: { label: string; href: string };
  isMultiCol?: boolean;
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu and dropdowns on page navigation or Escape key
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Simple flat menu (no dropdowns), as on the live site.
  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Chemicals", href: "/chemicals" },
    { label: "Instrumentation", href: "/instrumentation" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ];

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const toggleMobileAccordion = (label: string) => {
    setExpandedMobile((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#D8DDE2] shadow-[0_1px_3px_rgba(23,25,28,0.05)]">
      {/* 1. TOP UTILITY STRIP */}
      <div className="bg-[#17191C]/90 text-white/80 text-xs py-2.5 border-b border-[#2A2E34] hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C80808]" />
            <span className="font-medium text-white/85">
              Right equipment. Fully compliant.{" "}
              <strong className="text-white font-bold">Delivered on time.</strong>
            </span>
          </div>
          <div className="flex items-center space-x-6 text-white/80">
            <a
              href={`tel:${COMPANY_INFO.contact.phoneRaw}`}
              className="flex items-center space-x-1.5 hover:text-[#C80808] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C80808]" />
              <span>{COMPANY_INFO.contact.phone}</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.contact.email}`}
              className="flex items-center space-x-1.5 hover:text-[#C80808] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#C80808]" />
              <span>{COMPANY_INFO.contact.email}</span>
            </a>
            <span className="border-l border-[#2A2E34] pl-4"><LanguageSwitcher /></span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div className="max-w-[1400px] mx-auto px-6 h-[76px] lg:h-[84px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Petro Engineering homepage">
          <Image
            src="/assets/img/logo.png"
            alt="Petro Engineering Private Limited"
            width={208}
            height={42}
            priority
            className="w-[175px] lg:w-[205px] h-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const hasChildren = Boolean(item.items && item.items.length > 0);
            const isOpen = openDropdown === item.label;

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasChildren && handleMouseEnter(item.label)}
                onMouseLeave={() => hasChildren && handleMouseLeave()}
              >
                <Link
                  href={item.href}
                  className={`relative inline-flex items-center px-4 py-2.5 font-['Plus_Jakarta_Sans'] text-[15px] font-semibold transition-colors duration-200 after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-[3px] after:rounded-full after:bg-[#C80808] after:origin-left after:transition-transform after:duration-300 ${active ? "text-[#C80808] after:scale-x-100" : "text-[#17191C] hover:text-[#C80808] after:scale-x-0 hover:after:scale-x-100"}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#C80808]" : "text-[#929DA7]"
                      }`}
                    />
                  )}
                </Link>

                {/* Desktop Dropdown Panel with Invisible Hover Bridge */}
                {hasChildren && isOpen && (
                  <div
                    className={`absolute top-full left-0 z-50 pt-2 transition-all duration-150 animate-in fade-in-0 zoom-in-95 ${
                      item.isMultiCol ? "w-[560px]" : "w-[360px]"
                    }`}
                  >
                    {/* Hover Bridge Area */}
                    <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

                    <div className="bg-[#FFFFFF] border border-[#D8DDE2] rounded-lg shadow-[0_14px_36px_rgba(23,25,28,0.14)] overflow-hidden">
                      {/* Dropdown Items Grid */}
                      <div
                        className={`p-3.5 ${
                          item.isMultiCol ? "grid grid-cols-2 gap-1.5" : "flex flex-col gap-1"
                        }`}
                      >
                        {item.items?.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setOpenDropdown(null)}
                            className="group flex flex-col p-2.5 rounded-md hover:bg-[#F5F6F7] transition-colors"
                          >
                            <div className="flex items-center justify-between text-[13.5px] font-bold text-[#17191C] group-hover:text-[#C80808] transition-colors">
                              <span>{sub.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#C80808]" />
                            </div>
                            {sub.description && (
                              <p className="text-[12px] text-[#5F6871] leading-snug mt-0.5 line-clamp-1">
                                {sub.description}
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>

                      {/* Dropdown Footer Link */}
                      {item.allLink && (
                        <div className="bg-[#F5F6F7] border-t border-[#D8DDE2] px-4 py-2.5 flex items-center justify-between">
                          <Link
                            href={item.allLink.href}
                            onClick={() => setOpenDropdown(null)}
                            className="text-xs font-bold text-[#C80808] hover:underline flex items-center gap-1.5"
                          >
                            <span>{item.allLink.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <span className="text-[11px] font-semibold text-[#929DA7] uppercase tracking-wider">
                            Petro Engineering
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 border border-[#D8DDE2] rounded-[6px] hover:bg-[#F5F6F7] transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span
              className={`block w-5 h-0.5 bg-[#17191C] transition-transform duration-200 ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#17191C] transition-opacity duration-200 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#17191C] transition-transform duration-200 ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. MOBILE DRAWER NAVIGATION */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#17191C]/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed top-0 right-0 bottom-0 w-[min(360px,88vw)] bg-[#FFFFFF] text-[#17191C] p-6 pt-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 border-l border-[#D8DDE2]">
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-[#D8DDE2] mb-4">
                <Image
                  src="/assets/img/logo.png"
                  alt="Petro Engineering"
                  width={150}
                  height={32}
                  className="h-7 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 border border-[#D8DDE2] rounded-[6px] flex items-center justify-center text-[#5F6871] hover:text-[#17191C] hover:bg-[#F5F6F7]"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Accordion Menu List */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const hasChildren = Boolean(item.items && item.items.length > 0);
                  const isExpanded = Boolean(expandedMobile[item.label]);

                  if (!hasChildren) {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2.5 rounded-md font-['Plus_Jakarta_Sans'] text-base font-bold transition-colors ${
                          isActive(item.href)
                            ? "bg-[#C80808]/10 text-[#C80808]"
                            : "text-[#17191C] hover:bg-[#F5F6F7]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <div key={item.label} className="border-b border-[#D8DDE2]/60 last:border-0 py-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex-1 px-3 py-2 font-['Plus_Jakarta_Sans'] text-base font-bold transition-colors ${
                            isActive(item.href) ? "text-[#C80808]" : "text-[#17191C]"
                          }`}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobileAccordion(item.label)}
                          className="p-2 text-[#5F6871] hover:text-[#17191C]"
                          aria-label={`Toggle ${item.label} sub-menu`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-[#C80808]" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Expanded Sub items */}
                      {isExpanded && (
                        <div className="pl-4 pr-1 py-1.5 space-y-1 bg-[#F5F6F7] rounded-md my-1">
                          {item.items?.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1.5 px-2 text-sm text-[#5F6871] hover:text-[#C80808] font-medium"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          {item.allLink && (
                            <Link
                              href={item.allLink.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1.5 px-2 text-xs font-bold text-[#C80808] hover:underline"
                            >
                              {item.allLink.label} →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-[#D8DDE2] space-y-3">
              <LanguageSwitcher variant="drawer" />
              <div className="text-xs text-[#5F6871] space-y-2 pt-2 border-t border-[#D8DDE2]">
                <a
                  href={`tel:${COMPANY_INFO.contact.phoneRaw}`}
                  className="flex items-center gap-2 hover:text-[#17191C]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C80808]" />
                  <span>{COMPANY_INFO.contact.phone}</span>
                </a>
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="flex items-center gap-2 hover:text-[#17191C]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C80808]" />
                  <span>{COMPANY_INFO.contact.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
