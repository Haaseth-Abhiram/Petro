"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";
import {
  RESOURCES,
  FAQS,
  TECHNICAL_ARTICLES,
  ResourceType,
} from "@/data/resources";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>("faq-1");

  const resourceTypes: ResourceType[] = [
    "Brochure",
    "Catalogue",
    "Datasheet",
    "Whitepaper",
    "Technical Guide",
  ];

  const filteredResources = useMemo(() => {
    return RESOURCES.filter((res) => {
      const matchesSearch =
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "all" || res.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="relative bg-[#17191C]/90 text-white py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
          style={{ backgroundImage: "url('/assets/img/service-inspection-qa.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/85 via-[#17191C]/75 to-[#17191C]/55 z-0" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="max-w-[820px]">
            <span className="eyebrow eyebrow-gold">DOCUMENTATION &amp; KNOWLEDGE DESK</span>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight leading-[1.15] mb-4">
              Resources, Guides &amp; Technical Library
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[660px]">
              Access engineering product catalogues, whitepapers on severe-service metallurgy, dosage selection guides, and frequently asked questions.
            </p>
          </div>
        </div>
      </section>

      {/* 2. DOCUMENTATION LIBRARY */}
      <section id="catalogues" className="py-16 lg:py-20 bg-[#F5F6F7] border-b border-[#D8DDE2] scroll-mt-24 relative">
        <span id="datasheets" className="absolute -top-24" />
        <span id="standards" className="absolute -top-24" />
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mb-10">
            <span className="eyebrow">TECHNICAL LITERATURE</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Catalogues &amp; Engineering Datasheets
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-2">
              Dimensional drawings, pressure-temperature ratings, and application guides.
            </p>
          </div>

          {/* Search Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-[8px] border border-[#D8DDE2] mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5F6871] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search literature by title, category, or engineering topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[4px] border border-[#D8DDE2] text-sm text-[#17191C] focus:outline-none focus:border-[#C80808]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#5F6871]" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2.5 rounded-[4px] border border-[#D8DDE2] text-xs sm:text-sm text-[#17191C] bg-white focus:outline-none focus:border-[#C80808]"
              >
                <option value="all">All Document Types</option>
                {resourceTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-white p-7 border border-[#D8DDE2] rounded-[8px] flex flex-col justify-between hover:border-[#cbd4dd] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C80808]/10 text-[#C80808]">
                      {res.type}
                    </span>
                    <span className="text-xs text-[#5F6871] font-medium">
                      {res.category}
                    </span>
                  </div>

                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#17191C] mb-2">
                    {res.title}
                  </h3>

                  <p className="text-[#5F6871] text-xs leading-relaxed mb-4">
                    {res.description}
                  </p>

                  <div className="text-[11px] text-[#5F6871] pb-4 border-b border-[#D8DDE2] space-x-2">
                    <span>{res.fileFormat}</span>
                    <span>•</span>
                    <span>{res.fileSize}</span>
                    <span>•</span>
                    <span>{res.version}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-[4px] bg-[#F5F6F7] border border-[#D8DDE2] text-[#5F6871] mb-2">
                    <span className="flex items-center">
                      <Lock className="w-3.5 h-3.5 mr-1.5 text-[#5F6871]" />
                      Pending OEM Release
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#C80808]">
                      Verified Spec
                    </span>
                  </div>
                  <Link
                    href={`/request-a-quote?product=${encodeURIComponent(res.title)}`}
                    className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#C80808] hover:text-[#A81010] inline-block"
                  >
                    Request copy via RFQ &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TECHNICAL ARTICLES */}
      <section id="articles" className="py-20 lg:py-24 bg-white border-b border-[#D8DDE2] scroll-mt-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mb-12">
            <span className="eyebrow">FIELD ENGINEERING INSIGHTS</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Technical articles &amp; best practices
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-2">
              Field notes on fitting installation torques, silica solubility limits, and MTC verification standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TECHNICAL_ARTICLES.map((art) => (
              <div
                key={art.id}
                className="bg-[#F5F6F7] p-7 border border-[#D8DDE2] rounded-[8px] flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs text-[#5F6871] flex items-center space-x-3 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-[#C80808]" />
                      {art.publishDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-[#C80808]" />
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#17191C] mb-3 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-[#5F6871] text-xs leading-relaxed mb-4">
                    {art.summary}
                  </p>

                  <div className="space-y-2 text-xs text-[#5F6871] bg-white p-3.5 rounded-[4px] border border-[#D8DDE2] mb-4">
                    {art.content.slice(0, 2).map((p, idx) => (
                      <p key={idx} className="line-clamp-3">{p}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D8DDE2] flex flex-wrap gap-1">
                  {art.tags.map((t, i) => (
                    <span key={i} className="text-[10px] bg-[#EBECEE] text-[#5F6871] px-2 py-0.5 rounded font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQS ACCORDION */}
      <section className="py-20 lg:py-24 bg-[#F5F6F7] border-b border-[#D8DDE2]">
        <div className="max-w-[920px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="eyebrow">TECHNICAL KNOWLEDGE BASE</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-2">
              Common questions regarding material test reports (MTR), dangerous goods shipping, and chemical dosing.
            </p>
          </div>

          <div className="border-t border-[#D8DDE2]">
            {FAQS.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div key={faq.id} className="border-b border-[#D8DDE2]">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full py-5 text-left flex items-center justify-between gap-4 font-['Plus_Jakarta_Sans'] text-base font-bold text-[#17191C] hover:text-[#C80808] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="shrink-0 text-[#C80808]">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-5 pt-1 text-sm text-[#5F6871] leading-relaxed">
                      <p>{faq.answer}</p>
                      <span className="text-[11px] text-[#C80808] font-bold uppercase tracking-wider block mt-3">
                        Topic: {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
