"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, ChevronDown, ChevronRight, X, ArrowRight, Lock } from "lucide-react";
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

  const navItems: NavItem[] = [
    {
      label: "Chemicals",
      href: "/chemicals",
      isMultiCol: true,
      items: [
        {
          name: "RO Chemicals & Components",
          href: "/chemicals/ro-chemicals-and-components",
          description: "Antiscalants, biocides, cleaners & membranes",
        },
        {
          name: "Cooling Water Chemicals",
          href: "/chemicals/cooling-water-chemicals",
          description: "Corrosion & scale inhibitors, biocides",
        },
        {
          name: "Boiler Water Chemicals",
          href: "/chemicals/boiler-water-chemicals",
          description: "Oxygen scavengers, pH boosters & descalers",
        },
        {
          name: "Wastewater / ETP Chemicals",
          href: "/chemicals/wastewater-etp-chemicals",
          description: "Polyelectrolytes, coagulants & colour removers",
        },
        {
          name: "Water Treatment Plants",
          href: "/chemicals/water-treatment-plants",
          description: "RO, DM, softeners & UF systems",
        },
        {
          name: "Wastewater Treatment Systems",
          href: "/chemicals/wastewater-treatment",
          description: "STP, ETP, ZLD & clarifier units",
        },
        {
          name: "Commercial Chemicals",
          href: "/chemicals/commercial-chemicals",
          description: "Bulk industrial acids, alkalis & reagents",
        },
        {
          name: "Laboratory Equipment",
          href: "/chemicals/laboratory-equipment",
          description: "Meters, reagents, test kits & glassware",
        },
      ],
      allLink: { label: "Explore all chemical & water solutions", href: "/chemicals" },
    },
    {
      label: "Instrumentation",
      href: "/instrumentation",
      isMultiCol: true,
      items: [
        {
          name: "Double Ferrule Tube Fittings",
          href: "/instrumentation/tube-fittings",
          description: "SS316 compression fittings up to 6000 psi",
        },
        {
          name: "Ball Valves",
          href: "/instrumentation/ball-valves",
          description: "2-way & 3-way high-pressure instrumentation valves",
        },
        {
          name: "Needle Valves",
          href: "/instrumentation/needle-valves",
          description: "Severe duty flow control valves up to 10,000 psi",
        },
        {
          name: "Manifold Valves",
          href: "/instrumentation/manifold-valves",
          description: "2-valve, 3-valve & 5-valve differential manifolds",
        },
        {
          name: "Tubing Coils",
          href: "/instrumentation/tubing-coils",
          description: "ASTM A269 seamless SS316L continuous coils",
        },
        {
          name: "Check Valves",
          href: "/instrumentation/check-valves",
          description: "High-integrity non-return & relief valves",
        },
        {
          name: "Pipe Fittings",
          href: "/instrumentation/pipe-fittings",
          description: "Precision NPT & BSP hex nipples, couplings & tees",
        },
        {
          name: "Analyser Systems & CEMS",
          href: "/instrumentation/analyser-systems",
          description: "Sampling probes, conditioning shelters & monitors",
        },
      ],
      allLink: { label: "View Complete Instrumentation Catalogue", href: "/instrumentation" },
    },
    {
      label: "Services",
      href: "/services",
      items: [
        {
          name: "Oil & Gas Equipment Sourcing",
          href: "/services#oil-and-gas-equipment-sourcing",
          description: "Severe-service valves & alloy fittings",
        },
        {
          name: "Project Procurement Support",
          href: "/services#project-procurement-support",
          description: "MTO takeoff, bid tabulation & bulk handling",
        },
        {
          name: "Inspection & Quality Assurance",
          href: "/services#inspection-and-quality-assurance",
          description: "TPI, PMI, EN 10204 3.1 & hydro testing",
        },
        {
          name: "Vendor & OEM Representation",
          href: "/services#vendor-and-manufacturer-representation",
          description: "Approved technical agency & distributor sales",
        },
        {
          name: "Logistics & Export Crating",
          href: "/services#logistics-and-export-handling",
          description: "ISPM-15 export crating & dangerous goods clearance",
        },
        {
          name: "Technical Consultation",
          href: "/services#technical-consultation-and-engineering-support",
          description: "Chemical dosage, Cv sizing & metallurgy advisory",
        },
      ],
      allLink: { label: "View all engineering services", href: "/services" },
    },
    {
      label: "Industries",
      href: "/industries",
      items: [
        {
          name: "Oil & Gas (Upstream & Midstream)",
          href: "/industries#oil-and-gas",
          description: "Wellhead, platforms, pipelines & compressors",
        },
        {
          name: "Petrochemical & Refining",
          href: "/industries#petrochemical-and-refining",
          description: "Hydrocrackers, FCCUs & chemical synthesis",
        },
        {
          name: "Water Treatment & Desalination",
          href: "/industries#water-treatment-and-desalination",
          description: "Municipal SWRO, thermal plants & DM systems",
        },
        {
          name: "Heavy Manufacturing & Power",
          href: "/industries#manufacturing-and-industrial",
          description: "High-pressure utility boilers & cooling circuits",
        },
        {
          name: "EPC & Industrial Turnkey Projects",
          href: "/industries#epc-and-industrial-projects",
          description: "Bulk packages & specification-compliant delivery",
        },
        {
          name: "Pharma, Food & Process Industries",
          href: "/industries#process-industries",
          description: "Sanitary metallurgy, pure water & clean reagents",
        },
      ],
      allLink: { label: "Explore all industry sectors", href: "/industries" },
    },
    {
      label: "Resources",
      href: "/resources",
      items: [
        {
          name: "Technical Datasheets",
          href: "/resources#datasheets",
          description: "Valve dimensions, pressure curves & chemistry specs",
        },
        {
          name: "Engineering Catalogues",
          href: "/resources#catalogues",
          description: "Master fitting manuals & product specifications",
        },
        {
          name: "Whitepapers & Articles",
          href: "/resources#articles",
          description: "Metallurgy guides, RO fouling & dosage formulas",
        },
        {
          name: "Standards & Compliance",
          href: "/resources#standards",
          description: "NACE MR0175, ASME B31.3 & ASTM guidelines",
        },
      ],
      allLink: { label: "Browse engineering resource library", href: "/resources" },
    },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
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
      <div className="bg-[#17191C] text-white/80 text-xs py-2.5 border-b border-[#2A2E34] hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF4B32]" />
            <span className="font-medium text-white/85">
              Right equipment. Fully compliant.{" "}
              <strong className="text-white font-bold">Delivered on time.</strong>
            </span>
          </div>
          <div className="flex items-center space-x-6 text-white/80">
            <a
              href={`tel:${COMPANY_INFO.contact.phoneRaw}`}
              className="flex items-center space-x-1.5 hover:text-[#FF4B32] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF4B32]" />
              <span>{COMPANY_INFO.contact.phone}</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.contact.email}`}
              className="flex items-center space-x-1.5 hover:text-[#FF4B32] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF4B32]" />
              <span>{COMPANY_INFO.contact.email}</span>
            </a>
            <Link
              href="/login"
              className="flex items-center space-x-1.5 hover:text-[#FF4B32] transition-colors border-l border-[#2A2E34] pl-4 text-white/70 hover:text-white"
            >
              <Lock className="w-3 h-3 text-[#FF4B32]" />
              <span>Login</span>
            </Link>
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
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
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
                  className={`inline-flex items-center gap-1 px-3.5 py-2.5 rounded-md font-['Plus_Jakarta_Sans'] text-[14.5px] font-semibold transition-colors duration-150 ${
                    active || isOpen
                      ? "text-[#FF4B32] bg-[#F5F6F7]"
                      : "text-[#17191C] hover:text-[#FF4B32] hover:bg-[#F5F6F7]/60"
                  }`}
                  aria-expanded={isOpen}
                >
                  <span>{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#FF4B32]" : "text-[#929DA7]"
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
                            <div className="flex items-center justify-between text-[13.5px] font-bold text-[#17191C] group-hover:text-[#FF4B32] transition-colors">
                              <span>{sub.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#FF4B32]" />
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
                            className="text-xs font-bold text-[#FF4B32] hover:underline flex items-center gap-1.5"
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
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 font-['Plus_Jakarta_Sans'] text-xs sm:text-sm font-bold text-[#17191C] hover:text-[#FF4B32] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-[6px] border border-[#D8DDE2] hover:border-[#FF4B32] hover:bg-[#F5F6F7] transition-all shrink-0"
            aria-label="Login"
          >
            <Lock className="w-3.5 h-3.5 text-[#FF4B32]" />
            <span>Login</span>
          </Link>

          <Link
            href="/request-a-quote"
            className="hidden sm:inline-flex items-center justify-center font-['Plus_Jakarta_Sans'] text-sm font-bold bg-[#FF4B32] hover:bg-[#E03820] text-white px-5 lg:px-6 py-2.5 rounded-[6px] shadow-[0_2px_8px_rgba(255,75,50,0.25)] transition-all shrink-0"
          >
            Request a Quote
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 border border-[#D8DDE2] rounded-[6px] hover:bg-[#F5F6F7] transition-colors"
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
        <div className="lg:hidden fixed inset-0 z-50">
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
                            ? "bg-[#FF4B32]/10 text-[#FF4B32]"
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
                            isActive(item.href) ? "text-[#FF4B32]" : "text-[#17191C]"
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
                              isExpanded ? "rotate-180 text-[#FF4B32]" : ""
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
                              className="block py-1.5 px-2 text-sm text-[#5F6871] hover:text-[#FF4B32] font-medium"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          {item.allLink && (
                            <Link
                              href={item.allLink.href}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1.5 px-2 text-xs font-bold text-[#FF4B32] hover:underline"
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
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 font-['Plus_Jakarta_Sans'] text-sm font-bold border border-[#D8DDE2] bg-white text-[#17191C] hover:border-[#FF4B32] hover:text-[#FF4B32] px-5 py-2.5 rounded-[6px] shadow-sm transition-colors text-center"
              >
                <Lock className="w-4 h-4 text-[#FF4B32]" />
                <span>Login</span>
              </Link>
              <Link
                href="/request-a-quote"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center font-['Plus_Jakarta_Sans'] text-sm font-bold bg-[#FF4B32] hover:bg-[#E03820] text-white px-5 py-3 rounded-[6px] shadow-sm transition-colors text-center"
              >
                Request a Quote
              </Link>
              <div className="text-xs text-[#5F6871] space-y-2 pt-2 border-t border-[#D8DDE2]">
                <a
                  href={`tel:${COMPANY_INFO.contact.phoneRaw}`}
                  className="flex items-center gap-2 hover:text-[#17191C]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF4B32]" />
                  <span>{COMPANY_INFO.contact.phone}</span>
                </a>
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="flex items-center gap-2 hover:text-[#17191C]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF4B32]" />
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
