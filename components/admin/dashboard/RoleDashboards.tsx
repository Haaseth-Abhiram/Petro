"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  UserCheck,
  FileSpreadsheet,
  Mail,
  Package,
  Layers,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  ShieldCheck,
  Send,
  Building2,
  Phone,
  FileText,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Eye,
  ChevronRight,
} from "lucide-react";
import PetroLogo from "@/components/common/PetroLogo";

/* ========================================================
   1. HR DASHBOARD VIEW
   ======================================================== */
export function HRDashboardView({ stats, ins, user, d }: { stats: any; ins: any; user: any; d: any }) {
  const appNew = stats.applications?.new ?? 0;
  const appTotal = stats.applications?.total ?? 0;
  const openJobs = ins.openJobs ?? 6;
  const hired = ins.hired ?? 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HR Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2A1635] via-[#1E1428] to-[#17191C] text-white p-6 sm:p-8 shadow-xl border border-purple-900/30">
        <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              Human Resources Portal
            </span>
            <h1 className="text-[1.8rem] sm:text-[2.2rem] font-black tracking-tight text-white leading-tight">
              Welcome back, <span className="text-purple-400">{user?.name || "HR Manager"}</span>
            </h1>
            <p className="text-white/70 text-[14px] max-w-[560px] mt-1">
              Manage engineering job vacancies, candidate applications, interview pipelines, and hiring records.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/admin/careers/jobs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[13px] shadow-lg shadow-purple-600/30 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              Manage Jobs
            </Link>
            <Link
              href="/admin/careers/applications"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-[13px] border border-white/20 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              Candidate Pipeline
            </Link>
          </div>
        </div>
      </div>

      {/* HR Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Open Positions", value: openJobs, sub: "Actively hiring", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
          { label: "New Applications", value: appNew, sub: "Waiting for review", icon: Clock, color: "text-[#FFA028]", bg: "bg-[#FFF9F0] border-[#FFE2B8]", pulse: appNew > 0 },
          { label: "Total Received", value: appTotal, sub: "All-time applications", icon: Users, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Shortlisted / Hired", value: hired || Math.max(1, Math.round(appTotal * 0.2)), sub: "In progress / closed", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
        ].map((m) => (
          <div key={m.label} className={`rounded-2xl border p-5 bg-white shadow-sm flex flex-col justify-between ${m.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#5F6871]">{m.label}</span>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[2.2rem] font-black text-[#17191C] leading-none">{m.value}</span>
                {m.pulse && <span className="w-2 h-2 rounded-full bg-[#FFA028] animate-pulse" />}
              </div>
              <p className="text-[12px] text-[#5F6871] mt-1">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications Table */}
      <div className="rounded-2xl border border-[#E7E9EE] bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E7E9EE] flex items-center justify-between">
          <div>
            <h2 className="text-[1.1rem] font-black text-[#17191C]">Recent Candidate Applications</h2>
            <p className="text-[12.5px] text-[#5F6871]">Latest CVs and profiles submitted via the website.</p>
          </div>
          <Link
            href="/admin/careers/applications"
            className="text-[12.5px] font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1"
          >
            View All ({appTotal}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-[#E7E9EE]">
          {d.recentApplications && d.recentApplications.length > 0 ? (
            d.recentApplications.map((app: any) => (
              <div key={app.id} className="p-4 hover:bg-neutral-50 flex items-center justify-between gap-4 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-black flex items-center justify-center text-[13px]">
                    {(app.full_name || "A").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-[#17191C] text-[13.5px]">{app.full_name}</p>
                    <p className="text-[12px] text-[#5F6871]">{app.job_title || "General Application"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-purple-100 text-purple-800">
                    {app.status || "New"}
                  </span>
                  <Link
                    href={`/admin/careers/applications/${app.id}`}
                    className="px-3 py-1.5 rounded-lg border border-[#D8DDE2] text-[12px] font-bold text-[#17191C] hover:bg-neutral-100"
                  >
                    Review Profile
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#5F6871] text-[13px]">
              No candidate applications received yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   2. EMPLOYEE DASHBOARD VIEW
   ======================================================== */
export function EmployeeDashboardView({ stats, ins, user, d }: { stats: any; ins: any; user: any; d: any }) {
  const rfqNew = stats.rfqs?.new ?? 0;
  const enqNew = stats.enquiries?.new ?? 0;
  const totalProducts = stats.products?.total ?? 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Employee Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#10233D] via-[#142B4A] to-[#17191C] text-white p-6 sm:p-8 shadow-xl border border-blue-900/30">
        <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              Employee Operations Portal
            </span>
            <h1 className="text-[1.8rem] sm:text-[2.2rem] font-black tracking-tight text-white leading-tight">
              Hello, <span className="text-blue-400">{user?.name || "Team Member"}</span>
            </h1>
            <p className="text-white/70 text-[14px] max-w-[560px] mt-1">
              Access engineering catalogues, verify customer datasheets, inspect EN 10204 test reports, and process pending RFQs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[13px] shadow-lg shadow-blue-600/30 transition-all"
            >
              <Package className="w-4 h-4" />
              Catalogue Lookup
            </Link>
            <Link
              href="/admin/quote-requests"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-[13px] border border-white/20 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Process RFQs ({rfqNew})
            </Link>
          </div>
        </div>
      </div>

      {/* Employee Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Products", value: totalProducts, sub: "Valves, Fittings & Chem", icon: Package, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Pending RFQs", value: rfqNew, sub: "Customer quotes waiting", icon: FileSpreadsheet, color: "text-[#FFA028]", bg: "bg-[#FFF9F0] border-[#FFE2B8]", pulse: rfqNew > 0 },
          { label: "Unanswered Enquiries", value: enqNew, sub: "Client technical queries", icon: Mail, color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
          { label: "Quality Compliance", value: "100%", sub: "EN 10204 3.1 / NACE", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
        ].map((m) => (
          <div key={m.label} className={`rounded-2xl border p-5 bg-white shadow-sm flex flex-col justify-between ${m.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#5F6871]">{m.label}</span>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[2.2rem] font-black text-[#17191C] leading-none">{m.value}</span>
                {m.pulse && <span className="w-2 h-2 rounded-full bg-[#FFA028] animate-pulse" />}
              </div>
              <p className="text-[12px] text-[#5F6871] mt-1">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Internal Engineering Standards & Resources */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-[#E7E9EE] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="text-[15px] font-extrabold text-[#17191C]">Technical Compliance &amp; Standards</h3>
          </div>
          <p className="text-[13px] text-[#5F6871] mb-4">
            Verify every client enquiry against mandatory manufacturing standards before issuing quotation dossiers:
          </p>
          <ul className="space-y-2.5 text-[13px]">
            {[
              { code: "EN 10204 Type 3.1 / 3.2", desc: "Material test certificates verified with heat numbers & PMI" },
              { code: "NACE MR0175 / ISO 15156", desc: "Sour service metallurgy verification for sour gas & crude" },
              { code: "ASME B16.34 / API 598", desc: "Hydrostatic & pneumatic pressure testing protocol" },
              { code: "ISO 9001:2015 QA", desc: "Traceable inspection dossier attached with every export order" },
            ].map((std) => (
              <li key={std.code} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <strong className="block text-[#17191C] font-bold">{std.code}</strong>
                  <span className="text-[#5F6871] text-[12px]">{std.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#E7E9EE] bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h3 className="text-[15px] font-extrabold text-[#17191C]">Assigned Tasks &amp; Actions</h3>
            </div>
            <p className="text-[13px] text-[#5F6871] mb-4">
              Quick access to customer quotation requests and product datasheets requiring expediting:
            </p>
            <div className="space-y-2">
              <Link
                href="/admin/quote-requests"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
              >
                <div>
                  <p className="font-extrabold text-[#17191C] text-[13px]">Incoming RFQs to Price</p>
                  <p className="text-[12px] text-[#5F6871]">{rfqNew} waiting for technical estimation</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C80808]" />
              </Link>
              <Link
                href="/admin/enquiries"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
              >
                <div>
                  <p className="font-extrabold text-[#17191C] text-[13px]">Client Technical Inquiries</p>
                  <p className="text-[12px] text-[#5F6871]">{enqNew} waiting for engineering reply</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C80808]" />
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
              >
                <div>
                  <p className="font-extrabold text-[#17191C] text-[13px]">Product Catalogue &amp; Specs</p>
                  <p className="text-[12px] text-[#5F6871]">{totalProducts} active industrial items</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C80808]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   3. CLIENT DASHBOARD VIEW
   ======================================================== */
export function ClientDashboardView({ stats, ins, user, d }: { stats: any; ins: any; user: any; d: any }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Client Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C241B] via-[#123628] to-[#17191C] text-white p-6 sm:p-8 shadow-xl border border-emerald-900/30">
        <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Petro Engineering Customer Portal
            </span>
            <h1 className="text-[1.8rem] sm:text-[2.2rem] font-black tracking-tight text-white leading-tight">
              Welcome, <span className="text-emerald-400">{user?.name || user?.company || "Valued Client"}</span>
            </h1>
            <p className="text-white/70 text-[14px] max-w-[560px] mt-1">
              Track your industrial quotations, view technical datasheets, and request new RFQs directly from your dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C80808] to-[#FFA028] text-white font-extrabold text-[13.5px] shadow-lg shadow-red-600/30 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
              Request New Quote
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-[13px] border border-white/20 transition-all"
            >
              <Download className="w-4 h-4" />
              Download Catalogues
            </Link>
          </div>
        </div>
      </div>

      {/* Client Quick Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Quotations", value: stats.rfqs?.total ?? "1", sub: "Under technical review", icon: FileSpreadsheet, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
          { label: "Order Status", value: "Verified", sub: "EN 10204 3.1 ready", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "Product Catalogue", value: stats.products?.total ?? "120+", sub: "Chemicals & Instrumentation", icon: Package, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
          { label: "Account Support", value: "24/7", sub: "Dedicated engineer", icon: Phone, color: "text-[#FFA028]", bg: "bg-[#FFF9F0] border-[#FFE2B8]" },
        ].map((m) => (
          <div key={m.label} className={`rounded-2xl border p-5 bg-white shadow-sm flex flex-col justify-between ${m.bg}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#5F6871]">{m.label}</span>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            <div>
              <span className="text-[2.2rem] font-black text-[#17191C] leading-none">{m.value}</span>
              <p className="text-[12px] text-[#5F6871] mt-1">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Client RFQ Submissions / Quotes */}
      <div className="rounded-2xl border border-[#E7E9EE] bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E7E9EE] flex items-center justify-between">
          <div>
            <h2 className="text-[1.1rem] font-black text-[#17191C]">Your Quotation Requests &amp; Orders</h2>
            <p className="text-[12.5px] text-[#5F6871]">Live status of your submitted technical requirements.</p>
          </div>
          <Link
            href="/request-a-quote"
            className="text-[12.5px] font-bold text-[#C80808] hover:underline"
          >
            + New Request
          </Link>
        </div>
        <div className="divide-y divide-[#E7E9EE]">
          {d.recentRfqs && d.recentRfqs.length > 0 ? (
            d.recentRfqs.map((rfq: any) => (
              <div key={rfq.id} className="p-4 hover:bg-neutral-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-[#17191C] text-[14px]">{rfq.product_name}</p>
                    <p className="text-[12px] text-[#5F6871]">
                      Qty: {rfq.quantity || "1"} · Ref: RFQ-#{rfq.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {rfq.status === "quoted" ? "Quotation Ready" : "Estimating"}
                  </span>
                  <Link
                    href={`/admin/quote-requests`}
                    className="px-3 py-1.5 rounded-lg border border-[#D8DDE2] text-[12px] font-bold text-[#17191C] hover:bg-neutral-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#5F6871]">
              <p className="font-bold text-[14px]">No quotations submitted yet.</p>
              <Link href="/request-a-quote" className="mt-2 inline-block font-extrabold text-[#C80808] text-[13px] hover:underline">
                Submit an RFQ for valves, chemicals, or instrumentation →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Direct Contact Card */}
      <div className="rounded-2xl border border-[#E7E9EE] bg-white p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFA028] to-[#C80808] text-white flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-[#17191C] text-[14.5px]">Dedicated Petro Engineering Sales Desk</h4>
            <p className="text-[12.5px] text-[#5F6871]">Plot No. 12, Industrial Area, Hyderabad · ISO 9001:2015</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="mailto:sales@petroeng.in"
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#17191C] font-extrabold text-[12.5px] transition-colors"
          >
            sales@petroeng.in
          </a>
          <a
            href="tel:+914023456789"
            className="px-4 py-2 rounded-xl bg-[#C80808] hover:bg-[#A80606] text-white font-extrabold text-[12.5px] transition-colors"
          >
            Call Desk
          </a>
        </div>
      </div>
    </div>
  );
}

/* ========================================================
   4. PENDING ROLE WAITING ROOM VIEW
   ======================================================== */
export function PendingDashboardView({ user }: { user: any }) {
  return (
    <div className="max-w-[700px] mx-auto py-10 px-4 text-center animate-fadeIn">
      <div className="rounded-3xl border-2 border-[#FFA028] bg-white p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#C80808] via-[#FFA028] to-[#FFD580]" />
        
        <div className="w-16 h-16 rounded-2xl bg-[#FFF8ED] text-[#FFA028] border-2 border-[#FFA028]/40 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FFF4E5] text-[#D97706] border border-[#FFA028]/30 mb-3">
          Sign-Up Received · Pending Role Assignment
        </span>

        <h1 className="text-[1.8rem] sm:text-[2.2rem] font-black text-[#17191C] tracking-tight leading-tight mb-3">
          Welcome, {user?.name || "Friend"}!
        </h1>

        <p className="text-[14.5px] text-[#5F6871] leading-relaxed max-w-[500px] mx-auto mb-6">
          Your account has been successfully registered. An administrator has received your request under the <strong>Roles</strong> console and will assign your portal role shortly:
        </p>

        {/* 4 Role Options Visual */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8 text-left">
          {[
            { label: "HR", desc: "Careers & Hiring", color: "border-purple-200 bg-purple-50 text-purple-800" },
            { label: "Employee", desc: "Internal Operations", color: "border-blue-200 bg-blue-50 text-blue-800" },
            { label: "Client", desc: "Customer RFQs", color: "border-emerald-200 bg-emerald-50 text-emerald-800" },
            { label: "Admin", desc: "Full Console", color: "border-rose-200 bg-rose-50 text-rose-800" },
          ].map((r) => (
            <div key={r.label} className={`p-3 rounded-xl border ${r.color}`}>
              <strong className="block text-[13px] font-black">{r.label}</strong>
              <span className="text-[11px] opacity-80">{r.desc}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-[13px] text-[#5F6871] mb-6">
          <p>
            Once an administrator assigns your role, refreshing this page will instantly activate your customized dashboard.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C80808] hover:bg-[#A80606] text-white text-[13px] font-extrabold shadow-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Check Approval Status
          </button>
          <a
            href="mailto:admin@petroeng.in?subject=Role%20Assignment%20Request"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D8DDE2] bg-white text-[#17191C] text-[13px] font-bold hover:bg-neutral-50 transition-colors"
          >
            Contact Administrator
          </a>
        </div>
      </div>
    </div>
  );
}
