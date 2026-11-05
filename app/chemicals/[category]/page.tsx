import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { CHEMICAL_CATEGORIES } from "@/data/categories";

interface PageProps {
  params: {
    category: string;
  };
}

export function generateStaticParams() {
  return CHEMICAL_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export default function ChemicalCategoryPage({ params }: PageProps) {
  const category = CHEMICAL_CATEGORIES.find((c) => c.slug === params.category);

  if (!category) {
    notFound();
  }

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="relative bg-[#17191C]/90 text-white py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
          style={{ backgroundImage: `url('/assets/img/reverse-osmosis.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/85 via-[#17191C]/75 to-[#17191C]/55 z-0" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="max-w-[820px]">
            <span className="eyebrow eyebrow-gold">CHEMICAL SOLUTION GROUP</span>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight leading-[1.15] mb-4">
              {category.name}
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[660px]">
              {category.shortDescription}
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href={`/request-a-quote?category=${encodeURIComponent(category.name)}`}
                className="btn btn-primary"
              >
                Request {category.name} Quotation
              </Link>
              <Link href="/chemicals" className="btn btn-outline">
                All Solution Groups
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DETAILS */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="eyebrow">TECHNICAL OVERVIEW</span>
                <h2 className="text-[#17191C] text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                  Formulation &amp; Application Profile
                </h2>
                <p className="text-[#5F6871] text-base leading-relaxed">
                  {category.detailedDescription}
                </p>
              </div>

              <div className="p-8 bg-[#F5F6F7] border border-[#D8DDE2] rounded-[8px]">
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#17191C] mb-4">
                  Standard Formulations &amp; Hardware Supplied
                </h3>
                <ul className="space-y-2.5 text-sm text-[#5F6871]">
                  {category.keyProducts.map((prod, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-[#C80808] mr-3 mt-1.5 shrink-0" />
                      <span>{prod}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-7 bg-[#F5F6F7] border border-[#D8DDE2] rounded-[8px]">
                <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase tracking-wider text-[#17191C] mb-3">
                  Target Operating Applications:
                </h4>
                <ul className="space-y-2 text-xs text-[#5F6871]">
                  {category.applications.map((app, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-3.5 h-3.5 text-[#C80808] mr-2 shrink-0 mt-0.5" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#17191C]/90 text-white p-7 rounded-[8px]">
                <span className="eyebrow eyebrow-gold">TECHNICAL DOSAGE</span>
                <h4 className="text-white text-base font-bold mt-1 mb-2">
                  Need a computerized dosage simulation?
                </h4>
                <p className="text-white/70 text-xs leading-relaxed mb-4">
                  Provide your raw water analysis (TDS, silica, hardness, sulfate, pH). Our specialists calculate the exact ppm requirement.
                </p>
                <Link
                  href={`/request-a-quote?category=${encodeURIComponent(category.name)}`}
                  className="btn btn-primary w-full text-center"
                >
                  Send Water Analysis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
