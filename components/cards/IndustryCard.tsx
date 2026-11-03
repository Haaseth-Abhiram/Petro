import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { IndustryItem } from "@/data/industries";

interface IndustryCardProps {
  industry: IndustryItem;
}

export default function IndustryCard({ industry }: IndustryCardProps) {
  return (
    <div
      id={industry.slug}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col group"
    >
      <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
        <Image
          src={industry.image}
          alt={industry.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/30 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-600 text-white inline-block mb-1">
            Sector Solution
          </span>
          <h3 className="text-xl font-bold text-white leading-tight">
            {industry.name}
          </h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-1">
            {industry.tagline}
          </p>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {industry.detailedOverview}
          </p>

          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">
              Common Technical Demands:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {industry.commonRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 mr-2 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Key Supplied Packages:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {industry.relevantProducts.map((p, i) => (
                <span
                  key={i}
                  className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/request-a-quote?industry=${encodeURIComponent(industry.name)}`}
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center"
          >
            <span>Request {industry.name} Quotation</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
