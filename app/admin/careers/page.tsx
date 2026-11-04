"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Eye,
  FileText,
  BarChart3,
  TrendingUp,
  XCircle,
  Calendar,
  FolderOpen,
} from "lucide-react";

interface CareersStatsData {
  stats: {
    totalJobs: number;
    publishedJobs: number;
    draftJobs: number;
    closedJobs: number;

    totalApplications: number;
    newApplications: number;
    underReviewApplications: number;
    shortlistedApplications: number;
    interviewApplications: number;
    selectedApplications: number;
    rejectedApplications: number;
  };
  byPosition: Array<{ role: string; count: number }>;
  recentApplications: Array<{
    id: string;
    application_reference: string;
    full_name: string;
    email: string;
    phone: string;
    role_of_interest: string;
    experience: string;
    status: string;
    submitted_at: string;
  }>;
  recentJobs: Array<{
    id: string;
    role: string;
    title: string;
    slug: string;
    department: string;
    location: string;
    experience: string;
    status: string;
    created_at: string;
  }>;
}

function formatDateSafe(val: any): string {
  if (!val) return "—";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function CareersDashboardPage() {
  const [data, setData] = useState<CareersStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await fetch("/api/admin/careers/stats");
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Could not load recruitment dashboard data.");
      }
      setData(json);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to load careers metrics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Under Review":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Shortlisted":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Interview":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Selected":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "published":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "closed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="w-10 h-10 border-4 border-[#FF4B32] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#929DA7]">Loading Careers &amp; Recruitment Metrics…</p>
      </div>
    );
  }

  const s = data?.stats;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome / Header */}
      <div className="bg-[#17191C] rounded-2xl p-6 sm:p-8 text-white border border-[#2A2E34] relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[#FF4B32]/10 blur-[90px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#FFA028] mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Careers &amp; Talent Acquisition Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Recruitment Center
            </h1>
            <p className="text-sm text-white/70 max-w-2xl mt-1.5 leading-relaxed">
              Manage live job postings on petroeng.in, review candidate resumes, and track recruitment progress with real-time database synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchDashboard}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
            </button>
            <Link
              href="/admin/careers/jobs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4B32] hover:bg-[#FFA028] text-white text-xs font-bold transition-all shadow-md shadow-[#FF4B32]/25"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-800 p-4 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboard}
            className="text-xs font-bold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Job Openings */}
        <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#929DA7]">Total Job Openings</span>
            <span className="w-9 h-9 rounded-xl bg-[#FF4B32]/10 text-[#FF4B32] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-[#17191C] mt-2">{s?.totalJobs ?? 0}</div>
          <div className="flex items-center gap-2 text-xs text-[#929DA7] mt-2 pt-2 border-t border-[#F5F6F7]">
            <span className="text-emerald-600 font-bold">{s?.publishedJobs ?? 0} published</span>
            <span>•</span>
            <span>{s?.draftJobs ?? 0} draft</span>
            <span>•</span>
            <span>{s?.closedJobs ?? 0} closed</span>
          </div>
        </div>

        {/* Total Candidate Applications */}
        <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#929DA7]">Total Applications</span>
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-[#17191C] mt-2">{s?.totalApplications ?? 0}</div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold mt-2 pt-2 border-t border-[#F5F6F7]">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{s?.newApplications ?? 0} require initial review</span>
          </div>
        </div>

        {/* Under Review & Interview */}
        <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#929DA7]">Active Pipeline</span>
            <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-[#17191C] mt-2">
            {(s?.underReviewApplications ?? 0) + (s?.shortlistedApplications ?? 0) + (s?.interviewApplications ?? 0)}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#929DA7] mt-2 pt-2 border-t border-[#F5F6F7]">
            <span>{s?.underReviewApplications ?? 0} reviewing</span>
            <span>•</span>
            <span className="text-purple-600 font-bold">{s?.interviewApplications ?? 0} interview</span>
          </div>
        </div>

        {/* Selected Candidates */}
        <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#929DA7]">Offers &amp; Selected</span>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-[#17191C] mt-2">{s?.selectedApplications ?? 0}</div>
          <div className="flex items-center gap-2 text-xs text-[#929DA7] mt-2 pt-2 border-t border-[#F5F6F7]">
            <span className="text-emerald-600 font-bold">Successfully hired</span>
            <span>•</span>
            <span className="text-rose-500">{s?.rejectedApplications ?? 0} rejected</span>
          </div>
        </div>
      </div>

      {/* Candidate Pipeline Funnel Banner */}
      <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#17191C]">Application Status Summary</h2>
            <p className="text-xs text-[#929DA7]">Full candidate lifecycle breakdown across all positions</p>
          </div>
          <Link
            href="/admin/careers/applications"
            className="text-xs font-bold text-[#FF4B32] hover:text-[#FFA028] inline-flex items-center gap-1 transition-colors"
          >
            <span>View all candidate records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "1. New", count: s?.newApplications ?? 0, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "2. Under Review", count: s?.underReviewApplications ?? 0, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "3. Shortlisted", count: s?.shortlistedApplications ?? 0, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "4. Interview", count: s?.interviewApplications ?? 0, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "5. Selected", count: s?.selectedApplications ?? 0, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "6. Rejected", count: s?.rejectedApplications ?? 0, color: "text-rose-600", bg: "bg-rose-50" },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl p-3.5 border border-[#929DA7]/15 ${item.bg}`}>
              <span className="block text-[11px] font-bold text-[#929DA7]">{item.label}</span>
              <span className={`text-2xl font-black mt-1 block ${item.color}`}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Applications + Job Openings & Position Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Applications (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#929DA7]/20 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F5F6F7]">
            <div>
              <h2 className="text-base font-extrabold text-[#17191C]">Recent Applications</h2>
              <p className="text-xs text-[#929DA7]">Latest submissions received from the public careers page</p>
            </div>
            <Link
              href="/admin/careers/applications"
              className="text-xs font-bold text-[#FF4B32] hover:underline"
            >
              View all
            </Link>
          </div>

          {!data?.recentApplications || data.recentApplications.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#929DA7]">
              No applications submitted yet. Candidate submissions from the public website will appear here in real time.
            </div>
          ) : (
            <div className="divide-y divide-[#F5F6F7]">
              {data.recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F5F6F7]/50 px-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#17191C]">{app.full_name}</span>
                      <span className="text-[10px] font-mono font-bold text-[#929DA7] bg-gray-100 px-1.5 py-0.5 rounded">
                        {app.application_reference}
                      </span>
                    </div>
                    <p className="text-xs text-[#929DA7] truncate mt-0.5">
                      Applied for <strong className="text-[#17191C]">{app.role_of_interest}</strong> ({app.experience})
                    </p>
                    <div className="text-[11px] text-[#929DA7] flex items-center gap-2 mt-1">
                      <span>{app.email}</span>
                      <span>•</span>
                      <span>{app.phone}</span>
                      <span>•</span>
                      <span>{formatDateSafe(app.submitted_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                    <Link
                      href={`/admin/careers/applications/${app.id}`}
                      className="p-1.5 rounded-lg border border-[#929DA7]/20 hover:border-[#FF4B32] hover:text-[#FF4B32] transition-colors"
                      title="View candidate details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Applications by Position & Published Jobs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Applications by Role */}
          <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-[#17191C] mb-1">Applications by Position</h2>
            <p className="text-xs text-[#929DA7] mb-4">Volume distribution across published job vacancies</p>

            {data?.byPosition && data.byPosition.length > 0 ? (
              <div className="space-y-3">
                {data.byPosition.map((item) => {
                  const maxCount = Math.max(...data.byPosition.map((x) => x.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.role}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-[#17191C] truncate">{item.role}</span>
                        <span className="font-extrabold text-[#FF4B32] shrink-0 ml-2">{item.count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#F5F6F7] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF4B32] to-[#FFA028] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#929DA7] py-4 text-center">No role statistics recorded yet.</p>
            )}
          </div>

          {/* Quick Actions & Short Cuts */}
          <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-[#17191C] mb-3">Recruitment Shortcuts</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/admin/careers/jobs"
                className="flex flex-col p-3 rounded-xl border border-[#929DA7]/20 hover:border-[#FF4B32] hover:bg-[#F5F6F7]/50 transition-all text-left"
              >
                <Briefcase className="w-4 h-4 text-[#FF4B32] mb-1.5" />
                <span className="text-xs font-bold text-[#17191C]">Job Management</span>
                <span className="text-[10px] text-[#929DA7]">Create &amp; edit openings</span>
              </Link>
              <Link
                href="/admin/careers/applications"
                className="flex flex-col p-3 rounded-xl border border-[#929DA7]/20 hover:border-[#FF4B32] hover:bg-[#F5F6F7]/50 transition-all text-left"
              >
                <UserCheck className="w-4 h-4 text-blue-600 mb-1.5" />
                <span className="text-xs font-bold text-[#17191C]">Applications</span>
                <span className="text-[10px] text-[#929DA7]">Review resumes</span>
              </Link>
              <Link
                href="/admin/careers/categories"
                className="flex flex-col p-3 rounded-xl border border-[#929DA7]/20 hover:border-[#FF4B32] hover:bg-[#F5F6F7]/50 transition-all text-left"
              >
                <FileText className="w-4 h-4 text-purple-600 mb-1.5" />
                <span className="text-xs font-bold text-[#17191C]">Job Categories</span>
                <span className="text-[10px] text-[#929DA7]">Manage departments</span>
              </Link>
              <Link
                href="/admin/careers/applications?tab=resumes"
                className="flex flex-col p-3 rounded-xl border border-[#929DA7]/20 hover:border-[#FFA028] hover:bg-[#F5F6F7]/50 transition-all text-left"
              >
                <FolderOpen className="w-4 h-4 text-[#FFA028] mb-1.5" />
                <span className="text-xs font-bold text-[#17191C]">Resume Folder</span>
                <span className="text-[10px] text-[#929DA7]">Preview &amp; download CVs</span>
              </Link>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F5F6F7]">
              <Link
                href="/careers"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#929DA7] hover:text-[#17191C] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Preview public Careers page</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
