"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  UserCheck,
  XCircle,
  FileSpreadsheet,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface StatusCount {
  status: string;
  count: number;
}

interface PositionCount {
  role: string;
  count: number;
}

interface TimelineItem {
  date: string;
  count: number;
}

interface ReportsData {
  stats: {
    totalApplications: number;
    new: number;
    underReview: number;
    shortlisted: number;
    interview: number;
    selected: number;
    rejected: number;
  };
  byPosition: PositionCount[];
  timeline: TimelineItem[];
}

export default function RecruitmentReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchReports = async (start = startDate, end = endDate) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (start) params.set("startDate", start);
      if (end) params.set("endDate", end);

      const res = await fetch(`/api/admin/careers/reports?${params.toString()}`);
      const d = await res.json();
      if (d.success) {
        setData(d);
      } else {
        showToast("error", d.message || "Failed to load reports");
      }
    } catch {
      showToast("error", "Network error while loading reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleExportCsv = () => {
    setExporting(true);
    const params = new URLSearchParams({ export: "csv" });
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    // Trigger direct download
    window.location.href = `/api/admin/careers/reports?${params.toString()}`;
    setTimeout(() => setExporting(false), 2000);
  };

  const setPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const sStr = start.toISOString().split("T")[0];
    const eStr = end.toISOString().split("T")[0];
    setStartDate(sStr);
    setEndDate(eStr);
    fetchReports(sStr, eStr);
  };

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchReports("", "");
  };

  const total = data?.stats.totalApplications || 0;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold ${
            toast.type === "success"
              ? "bg-[#17191C] border-[#FF4B32] text-white"
              : "bg-red-500 border-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-[#FFA028]" /> : <AlertCircle className="w-5 h-5 text-white" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#929DA7] mb-1 font-semibold">
            <Link href="/admin/careers" className="hover:text-[#17191C]">
              Careers
            </Link>
            <span>/</span>
            <span className="text-[#FF4B32]">Recruitment Reports</span>
          </div>
          <h1 className="text-2xl font-black text-[#17191C] tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#FF4B32]" />
            Recruitment Reports & Analytics
          </h1>
          <p className="text-sm text-[#5F6871] mt-0.5">
            Analyze applicant flow, hiring pipeline conversion, and export candidate data to CSV.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => fetchReports()}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#D8DDE2] bg-white text-[#17191C] hover:bg-[#F5F6F7] transition disabled:opacity-50"
            title="Refresh reports"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#FF4B32]" : ""}`} />
          </button>
          <button
            onClick={handleExportCsv}
            disabled={exporting || loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4B32] to-[#FFA028] text-white text-sm font-bold shadow-md shadow-[#FF4B32]/20 hover:opacity-95 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Generating CSV..." : "Export Candidates (CSV)"}
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D8DDE2] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs font-bold text-[#5F6871] uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Calendar className="w-3.5 h-3.5 text-[#FF4B32]" />
            Date Filter:
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F5F6F7] border border-[#D8DDE2] rounded-xl text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
            placeholder="From Date"
          />
          <span className="text-xs text-[#929DA7]">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F5F6F7] border border-[#D8DDE2] rounded-xl text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
            placeholder="To Date"
          />
          <button
            onClick={() => fetchReports()}
            className="px-3 py-1.5 text-xs font-bold bg-[#17191C] text-white rounded-xl hover:bg-[#FF4B32] transition"
          >
            Apply Filter
          </button>
          {(startDate || endDate) && (
            <button
              onClick={resetFilter}
              className="px-3 py-1.5 text-xs font-bold text-[#5F6871] hover:text-[#17191C] underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-[#929DA7] font-semibold">Presets:</span>
          <button
            onClick={() => setPreset(7)}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#F5F6F7] hover:bg-[#EAEAEA] text-[#17191C] border border-[#D8DDE2] transition"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setPreset(30)}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#F5F6F7] hover:bg-[#EAEAEA] text-[#17191C] border border-[#D8DDE2] transition"
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setPreset(90)}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#F5F6F7] hover:bg-[#EAEAEA] text-[#17191C] border border-[#D8DDE2] transition"
          >
            Last 90 Days
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center bg-white rounded-2xl border border-[#D8DDE2]">
          <RefreshCw className="w-8 h-8 text-[#FF4B32] animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-[#17191C]">Calculating recruitment metrics...</p>
        </div>
      ) : data ? (
        <>
          {/* Funnel Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { label: "Total Applications", value: data.stats.totalApplications, color: "text-[#17191C]", bg: "bg-[#17191C]/5", border: "border-[#17191C]/15" },
              { label: "New (Unreviewed)", value: data.stats.new, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
              { label: "Under Review", value: data.stats.underReview, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
              { label: "Shortlisted", value: data.stats.shortlisted, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
              { label: "Interviews", value: data.stats.interview, color: "text-[#FFA028]", bg: "bg-[#FFA028]/10", border: "border-[#FFA028]/30" },
              { label: "Selected", value: data.stats.selected, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
            ].map((m) => (
              <div key={m.label} className={`p-4 rounded-2xl bg-white border ${m.border} shadow-sm flex flex-col justify-between`}>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5F6871]">{m.label}</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className={`text-2xl font-black ${m.color}`}>{m.value}</span>
                  {total > 0 && (
                    <span className="text-[11px] font-bold text-[#929DA7]">
                      {Math.round((m.value / total) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pipeline Conversion Funnel */}
            <div className="bg-white p-6 rounded-2xl border border-[#D8DDE2] shadow-sm">
              <h3 className="text-base font-extrabold text-[#17191C] flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[#FF4B32]" />
                Hiring Funnel Conversion
              </h3>
              <p className="text-xs text-[#5F6871] mb-5">
                Conversion drop-off at each stage of candidate evaluation.
              </p>

              <div className="space-y-4">
                {[
                  { label: "Total Received", val: data.stats.totalApplications, pct: 100, color: "bg-[#17191C]" },
                  {
                    label: "Under Review / Screened",
                    val: data.stats.underReview + data.stats.shortlisted + data.stats.interview + data.stats.selected,
                    pct: total > 0 ? Math.round(((data.stats.underReview + data.stats.shortlisted + data.stats.interview + data.stats.selected) / total) * 100) : 0,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Shortlisted",
                    val: data.stats.shortlisted + data.stats.interview + data.stats.selected,
                    pct: total > 0 ? Math.round(((data.stats.shortlisted + data.stats.interview + data.stats.selected) / total) * 100) : 0,
                    color: "bg-purple-500",
                  },
                  {
                    label: "Interviews Scheduled",
                    val: data.stats.interview + data.stats.selected,
                    pct: total > 0 ? Math.round(((data.stats.interview + data.stats.selected) / total) * 100) : 0,
                    color: "bg-[#FFA028]",
                  },
                  {
                    label: "Selected / Hired",
                    val: data.stats.selected,
                    pct: total > 0 ? Math.round((data.stats.selected / total) * 100) : 0,
                    color: "bg-emerald-500",
                  },
                ].map((stage) => (
                  <div key={stage.label}>
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-[#17191C]">{stage.label}</span>
                      <span className="text-[#5F6871]">
                        {stage.val} <span className="text-[#929DA7]">({stage.pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-[#F5F6F7] rounded-full overflow-hidden border border-[#D8DDE2]">
                      <div
                        className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(stage.pct, 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-[#D8DDE2] flex items-center justify-between text-xs text-[#5F6871]">
                <span>Rejected Candidates:</span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  {data.stats.rejected} ({total > 0 ? Math.round((data.stats.rejected / total) * 100) : 0}%)
                </span>
              </div>
            </div>

            {/* Applications by Role / Position */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#D8DDE2] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#17191C] flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#FF4B32]" />
                    Applications by Job Position
                  </h3>
                  <p className="text-xs text-[#5F6871] mt-0.5">
                    Distribution of candidate interest across active job vacancies.
                  </p>
                </div>
                <Link
                  href="/admin/careers/applications"
                  className="text-xs font-bold text-[#FF4B32] hover:underline"
                >
                  View candidates →
                </Link>
              </div>

              {data.byPosition.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#5F6871]">
                  No candidate submissions recorded in this date range.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {data.byPosition.map((pos) => {
                    const pct = total > 0 ? Math.round((pos.count / total) * 100) : 0;
                    return (
                      <div key={pos.role} className="p-3 rounded-xl bg-[#F5F6F7]/75 border border-[#D8DDE2]">
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span className="text-[#17191C] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#FF4B32]" />
                            {pos.role}
                          </span>
                          <span className="font-mono text-[#5F6871]">
                            {pos.count} candidates <span className="text-[#929DA7]">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-[#D8DDE2]/60">
                          <div
                            className="h-full bg-gradient-to-r from-[#FF4B32] to-[#FFA028] rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 3)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Submission Timeline Table */}
          <div className="bg-white p-6 rounded-2xl border border-[#D8DDE2] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#17191C] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FFA028]" />
                  Candidate Application Volume Timeline
                </h3>
                <p className="text-xs text-[#5F6871] mt-0.5">
                  Daily incoming application activity.
                </p>
              </div>
            </div>

            {data.timeline.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#5F6871]">
                No applications received in this period.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {data.timeline.slice(-14).map((t) => (
                  <div
                    key={t.date}
                    className="p-3 rounded-xl bg-[#F5F6F7] border border-[#D8DDE2] text-center"
                  >
                    <span className="text-[11px] font-semibold text-[#5F6871] block mb-1">
                      {new Date(t.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </span>
                    <span className="text-lg font-black text-[#17191C]">{t.count}</span>
                    <span className="text-[10px] text-[#929DA7] block mt-0.5">received</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
