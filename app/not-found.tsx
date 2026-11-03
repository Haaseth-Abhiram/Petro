import React from "react";
import Link from "next/link";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center bg-[#FFFFFF] py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-[#FF4B32]/10 border border-[#FF4B32]/20">
          <span className="w-2 h-2 rounded-full bg-[#FF4B32]" />
          <span className="font-['Plus_Jakarta_Sans'] text-xs font-extrabold uppercase tracking-widest text-[#FF4B32]">
            Page Not Found • Error 404
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#17191C] tracking-tight mb-4">
          Looking for a specific <br />
          <span className="text-[#FF4B32]">industrial product?</span>
        </h1>

        {/* Description */}
        <p className="text-[#5F6871] text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
          The page or product specification you requested could not be found or may have been updated in our catalog.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/instrumentation"
            className="btn btn-primary"
          >
            <span>View Instrumentation</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href="/chemicals"
            className="btn btn-secondary"
          >
            <span>View Chemicals</span>
          </Link>

          <Link
            href="/"
            className="btn btn-outline-dark"
          >
            <span>Homepage</span>
          </Link>
        </div>

        {/* Popular Categories Grid */}
        <div className="p-6 bg-[#F5F6F7] border border-[#D8DDE2] rounded-xl text-left">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#17191C] mb-3">
            Popular Engineering Categories:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-semibold">
            <Link
              href="/instrumentation/tube-fittings"
              className="p-2 rounded bg-white border border-[#D8DDE2] hover:border-[#FF4B32] hover:text-[#FF4B32] transition-colors"
            >
              Tube Fittings
            </Link>
            <Link
              href="/instrumentation/ball-valves"
              className="p-2 rounded bg-white border border-[#D8DDE2] hover:border-[#FF4B32] hover:text-[#FF4B32] transition-colors"
            >
              Ball Valves
            </Link>
            <Link
              href="/instrumentation/needle-valves"
              className="p-2 rounded bg-white border border-[#D8DDE2] hover:border-[#FF4B32] hover:text-[#FF4B32] transition-colors"
            >
              Needle Valves
            </Link>
            <Link
              href="/instrumentation/manifold-valves"
              className="p-2 rounded bg-white border border-[#D8DDE2] hover:border-[#FF4B32] hover:text-[#FF4B32] transition-colors"
            >
              Manifold Valves
            </Link>
            <Link
              href="/chemicals/ro-chemicals-and-components"
              className="p-2 rounded bg-white border border-[#D8DDE2] hover:border-[#FF4B32] hover:text-[#FF4B32] transition-colors"
            >
              RO Chemicals
            </Link>
            <Link
              href="/chemicals/cooling-water-chemicals"
              className="p-2 rounded bg-white border border-[#D8DDE2] hover:border-[#FF4B32] hover:text-[#FF4B32] transition-colors"
            >
              Cooling Water
            </Link>
            <Link
              href="/services"
              className="p-2 rounded bg-white border border-[#D8DDE2] hover:border-[#FF4B32] hover:text-[#FF4B32] transition-colors"
            >
              Services
            </Link>
            <Link
              href="/request-a-quote"
              className="p-2 rounded bg-white border border-[#D8DDE2] hover:border-[#FF4B32] hover:text-[#FF4B32] transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
