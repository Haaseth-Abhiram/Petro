import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "@/data/company";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#17191C] text-white/75 text-sm border-t border-[#2A2E34]">
      {/* Main Footer Container */}
      <div className="max-w-[1400px] mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Info (col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block" aria-label="Petro Engineering homepage">
              <Image
                src="/assets/img/logo.png"
                alt="Petro Engineering Private Limited"
                width={208}
                height={42}
                className="w-[190px] h-auto object-contain brightness-0 invert opacity-95"
              />
            </Link>
            <p className="text-white/65 text-[14px] leading-relaxed max-w-sm">
              Sourcing and supply partner for oil & gas, petrochemical, process utilities and industrial analyser systems. Two divisions under one roof — chemicals & water treatment, and precision instrumentation.
            </p>
            <div className="pt-2 text-[13px] text-white/80 space-y-2.5">
              <a
                href={`tel:${COMPANY_INFO.contact.phoneRaw}`}
                className="flex items-center text-white/80 hover:text-[#FF4B32] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF4B32] mr-2 shrink-0" />
                <span>{COMPANY_INFO.contact.phone}</span>
              </a>
              <a
                href={`mailto:${COMPANY_INFO.contact.email}`}
                className="flex items-center text-white/80 hover:text-[#FF4B32] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#FF4B32] mr-2 shrink-0" />
                <span>{COMPANY_INFO.contact.email}</span>
              </a>
              <div className="flex items-start text-white/60">
                <MapPin className="w-3.5 h-3.5 text-[#FF4B32] mr-2 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Company (col 2) */}
          <div className="lg:col-span-2">
            <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white/70 hover:text-white transition-colors">
                  Engineering Services
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-white/70 hover:text-white transition-colors">
                  Industries Served
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-white/70 hover:text-white transition-colors">
                  Resources & FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/request-a-quote" className="text-[#FF4B32] font-semibold hover:underline flex items-center">
                  <span>Request a quote</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Chemicals Links (col 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-white mb-4">
              Chemicals
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link href="/chemicals/ro-chemicals-and-components" className="text-white/70 hover:text-white transition-colors">
                  RO Chemicals & Components
                </Link>
              </li>
              <li>
                <Link href="/chemicals/cooling-water-chemicals" className="text-white/70 hover:text-white transition-colors">
                  Cooling Water Chemicals
                </Link>
              </li>
              <li>
                <Link href="/chemicals/boiler-water-chemicals" className="text-white/70 hover:text-white transition-colors">
                  Boiler Water Chemicals
                </Link>
              </li>
              <li>
                <Link href="/chemicals/wastewater-etp-chemicals" className="text-white/70 hover:text-white transition-colors">
                  Wastewater / ETP Chemicals
                </Link>
              </li>
              <li>
                <Link href="/chemicals/water-treatment-plants" className="text-white/70 hover:text-white transition-colors">
                  Water Treatment Plants
                </Link>
              </li>
              <li>
                <Link href="/chemicals/wastewater-treatment" className="text-white/70 hover:text-white transition-colors">
                  Wastewater Treatment Systems
                </Link>
              </li>
              <li>
                <Link href="/chemicals/commercial-chemicals" className="text-white/70 hover:text-white transition-colors">
                  Commercial Chemicals
                </Link>
              </li>
              <li>
                <Link href="/chemicals/laboratory-equipment" className="text-white/70 hover:text-white transition-colors">
                  Laboratory Equipment
                </Link>
              </li>
            </ul>
          </div>

          {/* Instrumentation Links (col 3) */}
          <div className="lg:col-span-3">
            <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-white mb-4">
              Instrumentation
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link href="/instrumentation/tube-fittings" className="text-white/70 hover:text-white transition-colors">
                  Tube Fittings (1/8"–1")
                </Link>
              </li>
              <li>
                <Link href="/instrumentation/pipe-fittings" className="text-white/70 hover:text-white transition-colors">
                  High Pressure Pipe Fittings
                </Link>
              </li>
              <li>
                <Link href="/instrumentation/ball-valves" className="text-white/70 hover:text-white transition-colors">
                  Ball Valves (2-way & 3-way)
                </Link>
              </li>
              <li>
                <Link href="/instrumentation/needle-valves" className="text-white/70 hover:text-white transition-colors">
                  Needle Valves (Up to 10,000 PSI)
                </Link>
              </li>
              <li>
                <Link href="/instrumentation/manifold-valves" className="text-white/70 hover:text-white transition-colors">
                  Manifold Valves (2, 3 & 5-Valve)
                </Link>
              </li>
              <li>
                <Link href="/instrumentation/check-valves" className="text-white/70 hover:text-white transition-colors">
                  Non-Return Check Valves
                </Link>
              </li>
              <li>
                <Link href="/instrumentation/tubing-coils" className="text-white/70 hover:text-white transition-colors">
                  Seamless Tubing Coils (ASTM A269)
                </Link>
              </li>
              <li>
                <Link href="/instrumentation/analyser-systems" className="text-white/70 hover:text-white transition-colors">
                  Analyser Shelters & CEMS
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-[#2A2E34] bg-[#121416] py-6">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-white/50 space-y-3 md:space-y-0">
          <p>© {currentYear} {COMPANY_INFO.legalName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/60">
            <span>ASME</span>
            <span>•</span>
            <span>NACE MR0175</span>
            <span>•</span>
            <span>ASTM</span>
            <span>•</span>
            <span>API 607</span>
            <span>•</span>
            <span>EN 10204 3.1 / 3.2</span>
            <span>•</span>
            <span>ISO 9001:2015</span>
            <span>•</span>
            <Link href="/login" className="text-[#FF4B32] hover:underline font-bold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
