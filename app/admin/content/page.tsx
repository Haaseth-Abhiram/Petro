"use client";

import React, { useState, useEffect } from "react";
import {
  FileEdit,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function AdminContentPage() {
  const [content, setContent] = useState<any>({
    heroTitleLine1: "Industrial Fluid &",
    heroTitleLine2: "Chemical Engineering",
    heroSubtitle:
      "Engineered chemicals, water treatment systems, and precision instrumentation for oil & gas, petrochemical, and critical process utilities.",
    ctaPrimaryText: "Explore Products",
    ctaPrimaryLink: "/instrumentation",
    ctaSecondaryText: "Request a Quote",
    ctaSecondaryLink: "/request-a-quote",
    companyEmail: "sales@petroeng.in",
    companyPhone: "+91 96521 11021",
    companyAddress: "Mumbai, Maharashtra, India",
    stat1Num: "02",
    stat1Lbl: "Divisions under one roof",
    stat2Num: "08",
    stat2Lbl: "Chemical solution groups",
    stat3Num: "63",
    stat3Lbl: "Formulated & engineered lines",
    stat4Num: "6000+",
    stat4Lbl: "PSI High-pressure hardware",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/content?key=homepage_hero");
      const json = await res.json();
      if (json.success && json.content?.content) {
        const c = json.content.content;
        setContent({
          heroTitleLine1: c.heroTitleLine1 || "Industrial Fluid &",
          heroTitleLine2: c.heroTitleLine2 || "Chemical Engineering",
          heroSubtitle: c.heroSubtitle || "",
          ctaPrimaryText: c.ctaPrimaryText || "Explore Products",
          ctaPrimaryLink: c.ctaPrimaryLink || "/instrumentation",
          ctaSecondaryText: c.ctaSecondaryText || "Request a Quote",
          ctaSecondaryLink: c.ctaSecondaryLink || "/request-a-quote",
          companyEmail: c.companyEmail || "sales@petroeng.in",
          companyPhone: c.companyPhone || "+91 96521 11021",
          companyAddress: c.companyAddress || "Mumbai, Maharashtra, India",
          stat1Num: c.stats?.[0]?.num || "02",
          stat1Lbl: c.stats?.[0]?.lbl || "Divisions under one roof",
          stat2Num: c.stats?.[1]?.num || "08",
          stat2Lbl: c.stats?.[1]?.lbl || "Chemical solution groups",
          stat3Num: c.stats?.[2]?.num || "63",
          stat3Lbl: c.stats?.[2]?.lbl || "Formulated & engineered lines",
          stat4Num: c.stats?.[3]?.num || "6000+",
          stat4Lbl: c.stats?.[3]?.lbl || "PSI High-pressure hardware",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const payload = {
      key: "homepage_hero",
      section: "homepage",
      content: {
        heroTitleLine1: content.heroTitleLine1,
        heroTitleLine2: content.heroTitleLine2,
        heroSubtitle: content.heroSubtitle,
        ctaPrimaryText: content.ctaPrimaryText,
        ctaPrimaryLink: content.ctaPrimaryLink,
        ctaSecondaryText: content.ctaSecondaryText,
        ctaSecondaryLink: content.ctaSecondaryLink,
        companyEmail: content.companyEmail,
        companyPhone: content.companyPhone,
        companyAddress: content.companyAddress,
        stats: [
          { num: content.stat1Num, lbl: content.stat1Lbl },
          { num: content.stat2Num, lbl: content.stat2Lbl },
          { num: content.stat3Num, lbl: content.stat3Lbl },
          { num: content.stat4Num, lbl: content.stat4Lbl },
        ],
      },
    };

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert(json.message || "Failed to update content");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17191C]">
            Website Content Management (CMS)
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6871]">
            Update public hero messaging, call-to-actions, corporate metrics, and contact info in Supabase.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Changes successfully written to database!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Homepage Hero Section */}
        <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#D8DDE2]">
            <div className="w-8 h-8 rounded-lg bg-[#FF4B32]/10 text-[#FF4B32] flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#17191C]">
                Homepage Hero Section
              </h3>
              <p className="text-[11px] text-[#5F6871]">
                Main brand presentation, hero headlines, and primary actions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                Headline Line 1
              </label>
              <input
                type="text"
                required
                value={content.heroTitleLine1}
                onChange={(e) => setContent({ ...content, heroTitleLine1: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs font-semibold focus:border-[#FF4B32] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                Headline Line 2
              </label>
              <input
                type="text"
                required
                value={content.heroTitleLine2}
                onChange={(e) => setContent({ ...content, heroTitleLine2: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs font-semibold focus:border-[#FF4B32] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
              Hero Subtitle & Value Proposition
            </label>
            <textarea
              rows={3}
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs leading-relaxed focus:border-[#FF4B32] outline-none"
            />
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2] space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#FF4B32] block">
                Primary Button (Coral Orange)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#5F6871] mb-1">Button Text</label>
                  <input
                    type="text"
                    value={content.ctaPrimaryText}
                    onChange={(e) => setContent({ ...content, ctaPrimaryText: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[#D8DDE2] text-xs bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#5F6871] mb-1">Target Route</label>
                  <input
                    type="text"
                    value={content.ctaPrimaryLink}
                    onChange={(e) => setContent({ ...content, ctaPrimaryLink: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[#D8DDE2] text-xs bg-white outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2] space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#17191C] block">
                Secondary Button (Outline)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#5F6871] mb-1">Button Text</label>
                  <input
                    type="text"
                    value={content.ctaSecondaryText}
                    onChange={(e) => setContent({ ...content, ctaSecondaryText: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[#D8DDE2] text-xs bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#5F6871] mb-1">Target Route</label>
                  <input
                    type="text"
                    value={content.ctaSecondaryLink}
                    onChange={(e) => setContent({ ...content, ctaSecondaryLink: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-[#D8DDE2] text-xs bg-white outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Metrics (Stats Strip) */}
        <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#17191C]">
            Key Performance Metrics (Stats Strip)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
              <label className="block text-[10px] font-semibold text-[#5F6871] mb-1">Metric 1</label>
              <input
                type="text"
                value={content.stat1Num}
                onChange={(e) => setContent({ ...content, stat1Num: e.target.value })}
                className="w-full px-2 py-1 rounded border border-[#D8DDE2] text-xs font-bold mb-1.5 bg-white"
              />
              <input
                type="text"
                value={content.stat1Lbl}
                onChange={(e) => setContent({ ...content, stat1Lbl: e.target.value })}
                className="w-full px-2 py-1 rounded border border-[#D8DDE2] text-xs bg-white text-[#5F6871]"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
              <label className="block text-[10px] font-semibold text-[#5F6871] mb-1">Metric 2</label>
              <input
                type="text"
                value={content.stat2Num}
                onChange={(e) => setContent({ ...content, stat2Num: e.target.value })}
                className="w-full px-2 py-1 rounded border border-[#D8DDE2] text-xs font-bold mb-1.5 bg-white"
              />
              <input
                type="text"
                value={content.stat2Lbl}
                onChange={(e) => setContent({ ...content, stat2Lbl: e.target.value })}
                className="w-full px-2 py-1 rounded border border-[#D8DDE2] text-xs bg-white text-[#5F6871]"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
              <label className="block text-[10px] font-semibold text-[#5F6871] mb-1">Metric 3</label>
              <input
                type="text"
                value={content.stat3Num}
                onChange={(e) => setContent({ ...content, stat3Num: e.target.value })}
                className="w-full px-2 py-1 rounded border border-[#D8DDE2] text-xs font-bold mb-1.5 bg-white"
              />
              <input
                type="text"
                value={content.stat3Lbl}
                onChange={(e) => setContent({ ...content, stat3Lbl: e.target.value })}
                className="w-full px-2 py-1 rounded border border-[#D8DDE2] text-xs bg-white text-[#5F6871]"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
              <label className="block text-[10px] font-semibold text-[#5F6871] mb-1">Metric 4</label>
              <input
                type="text"
                value={content.stat4Num}
                onChange={(e) => setContent({ ...content, stat4Num: e.target.value })}
                className="w-full px-2 py-1 rounded border border-[#D8DDE2] text-xs font-bold mb-1.5 bg-white"
              />
              <input
                type="text"
                value={content.stat4Lbl}
                onChange={(e) => setContent({ ...content, stat4Lbl: e.target.value })}
                className="w-full px-2 py-1 rounded border border-[#D8DDE2] text-xs bg-white text-[#5F6871]"
              />
            </div>
          </div>
        </div>

        {/* Global Contact Info */}
        <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#17191C]">
            Company Contact Coordinates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                value={content.companyEmail}
                onChange={(e) => setContent({ ...content, companyEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#FF4B32] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                Corporate Telephone
              </label>
              <input
                type="text"
                value={content.companyPhone}
                onChange={(e) => setContent({ ...content, companyPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#FF4B32] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                value={content.companyAddress}
                onChange={(e) => setContent({ ...content, companyAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#FF4B32] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#FF4B32] hover:bg-[#E03820] text-white text-xs font-bold shadow-[0_4px_12px_rgba(255,75,50,0.3)] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Publishing to Supabase..." : "Save & Publish All Content"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
