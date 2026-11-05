"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";
import PetroLogo from "@/components/common/PetroLogo";
import { Donut } from "@/components/admin/dashboard/dash-utils";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  UserCheck,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Plus,
  RefreshCw,
  ExternalLink,
  Clock,
  Layers,
  FolderOpen,
  Sparkles,
  Inbox,
  Search,
  Star,
  CalendarCheck,
  Trophy,
  XCircle,
  MapPin,
  Mail,
  Phone,
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

const panel = "rounded-2xl border border-[#E4E4E7] bg-white shadow-sm";

const APP_STATUS: Record<string, string> = {
  New: "bg-[#C80808] text-white",
  "Under Review": "bg-[#E0A21A] text-[#17191C]",
  Shortlisted: "bg-[#2E3239] text-white",
  Interview: "bg-[#8A0A0A] text-white",
  Selected: "bg-emerald-600 text-white",
  Rejected: "bg-[#52525B] text-white",
};
const JOB_STATUS: Record<string, string> = {
  published: "bg-emerald-600 text-white",
  draft: "bg-[#E0A21A] text-[#17191C]",
  closed: "bg-[#52525B] text-white",
};

function ago(val: any): string {
  const t = new Date(val).getTime();
  if (!t) return "";
  const m = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
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
      if (!res.ok || !json.success) throw new Error(json.message || "Could not load recruitment dashboard data.");
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

  const s = data?.stats;
  const published = s?.publishedJobs ?? 0;
  const draft = s?.draftJobs ?? 0;
  const closed = s?.closedJobs ?? 0;

  const funnel = [
    { l: "New", v: s?.newApplications ?? 0, Icon: Inbox, grad: "from-[#E21212] to-[#8A0A0A]", dark: false },
    { l: "Under review", v: s?.underReviewApplications ?? 0, Icon: Search, grad: "from-[#F2B93B] to-[#D4950F]", dark: true },
    { l: "Shortlisted", v: s?.shortlistedApplications ?? 0, Icon: Star, grad: "from-[#2E3239] to-[#14161A]", dark: false },
    { l: "Interview", v: s?.interviewApplications ?? 0, Icon: CalendarCheck, grad: "from-[#8A0A0A] to-[#E0A21A]", dark: false },
    { l: "Selected", v: s?.selectedApplications ?? 0, Icon: Trophy, grad: "from-[#059669] to-[#047857]", dark: false },
    { l: "Rejected", v: s?.rejectedApplications ?? 0, Icon: XCircle, grad: "from-[#71717A] to-[#3F3F46]", dark: false },
  ];

  const quick = [
    { href: "/admin/careers/jobs", l: "Post a job", sub: "Publish a new opening", Icon: Plus, tone: "bg-gradient-to-br from-[#E21212] to-[#8A0A0A]" },
    { href: "/admin/careers/applications", l: "Applications", sub: "Review candidates", Icon: Users, tone: "bg-gradient-to-br from-[#F2B93B] to-[#D4950F]" },
    { href: "/admin/careers/categories", l: "Job categories", sub: "Organise departments", Icon: Layers, tone: "bg-gradient-to-br from-[#2E3239] to-[#14161A]" },
    { href: "/admin/careers/applications?tab=resumes", l: "Resume folder", sub: "Browse all CVs", Icon: FolderOpen, tone: "bg-gradient-to-br from-[#8A0A0A] to-[#E0A21A]" },
    { href: "/careers", l: "Careers page", sub: "View public site", Icon: ExternalLink, tone: "bg-gradient-to-br from-[#E21212] to-[#8A0A0A]" },
  ];

  const maxPos = Math.max(...(data?.byPosition || []).map((x) => x.count), 1);

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14161A] via-[#2B1115] to-[#8A0A0A] text-white shadow-[0_16px_36px_-20px_rgba(138,10,10,0.7)]">
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-72 rounded-full bg-[#E0A21A]/25 blur-[60px]" />
        <div className="pointer-events-none absolute right-4 top-1/2 w-[170px] -translate-y-1/2 opacity-[0.08]"><PetroLogo part="flame" variant="dark" width="100%" /></div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:30px_30px]" />
        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
        <div className="relative flex flex-col gap-4 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]"><Sparkles className="h-3 w-3" />Hiring</p>
            <h2 className="mt-0.5 text-[1.3rem] font-black leading-tight tracking-tight !text-white sm:text-[1.5rem]">Careers &amp; Recruitment</h2>
            <p className="mt-0.5 text-[12.5px] text-white/65">Openings, candidates and your hiring pipeline.</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {[{ v: published, l: "Open roles", h: "/admin/careers/jobs" }, { v: s?.totalApplications ?? 0, l: "Applications", h: "/admin/careers/applications" }, { v: s?.newApplications ?? 0, l: "New", h: "/admin/careers/applications" }].map((x) => (
              <Link key={x.l} href={x.h} className="group flex items-baseline gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/20">
                <span className="text-[1.3rem] font-black leading-none">{loading ? "–" : x.v}</span>
                <span className="whitespace-nowrap text-[12px] font-semibold text-white/80">{x.l}</span>
                <ArrowUpRight className="h-3 w-3 self-center text-white/40 group-hover:text-white" />
              </Link>
            ))}
            <button onClick={fetchDashboard} disabled={refreshing} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-bold backdrop-blur transition-colors hover:bg-white/20 disabled:opacity-60"><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />Refresh</button>
            <Link href="/admin/careers/jobs" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#D40E0E] to-[#E0A21A] px-4 py-2 text-[12px] font-extrabold shadow-[0_8px_20px_-8px_rgba(224,100,20,0.8)] transition-transform hover:-translate-y-0.5"><Plus className="h-3.5 w-3.5" />Post a job</Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#C80808]/30 bg-white p-4 text-[13px] text-[#8A0A0A]"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#C80808]" /><div><p className="font-bold">Could not load careers data</p><p className="text-[#71717A]">{error}</p></div><button onClick={fetchDashboard} className="ml-auto rounded-lg bg-[#17191C] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#C80808]">Try again</button></div>
      )}

      {loading ? (
        <WorkspaceLoader />
      ) : (
        <>
          {/* Hiring pipeline */}
          <section>
            <div className="mb-3"><h3 className="text-[15px] font-extrabold text-[#18181B]">Hiring pipeline</h3><p className="text-[12.5px] text-[#71717A]">Where every candidate stands right now</p></div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {funnel.map((f) => (
                <Link key={f.l} href="/admin/careers/applications" className={`group relative flex min-h-[112px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-4 shadow-[0_14px_28px_-16px_rgba(23,25,28,0.55)] transition-all duration-300 hover:-translate-y-1 ${f.grad} ${f.dark ? "text-[#17191C]" : "text-white"}`}>
                  <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
                  <f.Icon className="pointer-events-none absolute -bottom-3 right-2 h-16 w-16 opacity-[0.15]" strokeWidth={1.4} />
                  <span className={`relative flex h-9 w-9 items-center justify-center rounded-xl border ${f.dark ? "border-black/10 bg-black/10" : "border-white/30 bg-white/15"}`}><f.Icon className="h-[18px] w-[18px]" /></span>
                  <div className="relative"><p className="text-[1.8rem] font-black leading-none">{f.v}</p><p className="mt-1 text-[12.5px] font-extrabold">{f.l}</p></div>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick links */}
          <section>
            <div className="mb-3"><h3 className="text-[15px] font-extrabold text-[#18181B]">Quick links</h3><p className="text-[12.5px] text-[#71717A]">Jump straight into recruitment tasks</p></div>
            <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-5">
              {quick.map(({ href, l, sub, Icon, tone }) => (
                <Link key={l} href={href} className="group relative flex flex-col rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_36px_-16px_rgba(23,25,28,0.35)]">
                  <div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 ${tone}`}><Icon className="h-5 w-5" /></span><ArrowUpRight className="h-4 w-4 text-[#C3CAD1] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#C80808]" /></div>
                  <p className="mt-3.5 text-[14px] font-extrabold leading-tight text-[#18181B]">{l}</p>
                  <p className="mt-0.5 text-[12px] text-[#71717A]">{sub}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-5">
            {/* Recent applications */}
            <section className={`${panel} overflow-hidden lg:col-span-3`}>
              <header className="flex items-center justify-between border-b border-[#EEEEF0] px-5 py-4">
                <div><h3 className="text-[15px] font-extrabold text-[#18181B]">Recent applications</h3><p className="text-[12.5px] text-[#71717A]">The latest candidates to apply</p></div>
                <Link href="/admin/careers/applications" className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] px-3.5 py-1.5 text-[12.5px] font-bold text-[#18181B] transition-colors hover:border-[#C80808]/40 hover:text-[#C80808]">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
              </header>
              {!data?.recentApplications || data.recentApplications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-6 py-14 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F5] text-[#A1A1AA]"><Users className="h-5 w-5" /></span><p className="text-[13.5px] font-bold text-[#52525B]">No applications yet</p><p className="max-w-xs text-[12.5px] text-[#A1A1AA]">Candidates who apply on your public Careers page will appear here.</p></div>
              ) : (
                <ul className="divide-y divide-[#F1F1F3]">
                  {data.recentApplications.map((app) => (
                    <li key={app.id}>
                      <Link href={`/admin/careers/applications/${app.id}`} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#FAFAFA]">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E3239] to-[#14161A] text-[17px] font-black text-white shadow-sm">{String(app.full_name || "?").trim().charAt(0).toUpperCase()}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2"><p className="truncate text-[14px] font-extrabold text-[#18181B] group-hover:text-[#C80808]">{app.full_name}</p><span className="rounded-md bg-[#F4F4F5] px-1.5 py-0.5 font-mono text-[10.5px] text-[#71717A]">{app.application_reference}</span></div>
                          <p className="truncate text-[12.5px] text-[#52525B]">Applied for <b className="text-[#18181B]">{app.role_of_interest}</b> · {app.experience}</p>
                          <p className="mt-0.5 flex flex-wrap gap-x-3 text-[11.5px] text-[#A1A1AA]"><span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{app.email}</span>{app.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{app.phone}</span>}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5"><span className={`rounded-full px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-wider ${APP_STATUS[app.status] || "bg-[#52525B] text-white"}`}>{app.status}</span><span className="inline-flex items-center gap-1 text-[11.5px] text-[#A1A1AA]"><Clock className="h-3 w-3" />{ago(app.submitted_at)}</span></div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Right column */}
            <div className="space-y-5 lg:col-span-2">
              <section className={`${panel} p-5`}>
                <div className="mb-4 flex items-center justify-between"><div><h3 className="text-[15px] font-extrabold text-[#18181B]">Job openings</h3><p className="text-[12.5px] text-[#71717A]">{s?.totalJobs ?? 0} roles in total</p></div><Link href="/admin/careers/jobs" className="text-[12.5px] font-semibold text-[#C80808] hover:underline">Manage →</Link></div>
                <div className="flex items-center gap-5">
                  <Donut size={104} stroke={12} parts={[{ v: published || 0.001, c: "#059669" }, { v: draft, c: "#E0A21A" }, { v: closed, c: "#71717A" }]} center={<><span className="text-[1.4rem] font-black leading-none text-[#18181B]">{published}</span><span className="text-[9.5px] font-bold uppercase tracking-wider text-[#71717A]">open</span></>} />
                  <ul className="flex-1 space-y-2 text-[13px]">
                    {[["Published", published, "bg-emerald-600"], ["Draft", draft, "bg-[#E0A21A]"], ["Closed", closed, "bg-[#71717A]"]].map(([l, v, c]) => <li key={l as string} className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-[#52525B]"><span className={`h-2.5 w-2.5 rounded-full ${c}`} />{l}</span><b className="text-[#18181B]">{v}</b></li>)}
                  </ul>
                </div>
              </section>

              <section className={`${panel} p-5`}>
                <h3 className="text-[15px] font-extrabold text-[#18181B]">Applications by position</h3><p className="mb-4 text-[12.5px] text-[#71717A]">Which roles attract the most interest</p>
                {data?.byPosition && data.byPosition.length > 0 ? (
                  <div className="space-y-3.5">{data.byPosition.map((item, i) => (
                    <div key={item.role}><div className="mb-1 flex items-center justify-between text-[13px]"><span className="truncate font-semibold text-[#18181B]">{item.role}</span><b>{item.count}</b></div><div className="h-2 overflow-hidden rounded-full bg-[#F4F4F5]"><div className="h-full rounded-full" style={{ width: `${Math.max(6, (item.count / maxPos) * 100)}%`, background: ["#C80808", "#E0A21A", "#27272A", "#8A0A0A", "#D4950F"][i % 5] }} /></div></div>
                  ))}</div>
                ) : <p className="rounded-xl border border-dashed border-[#D4D4D8] px-4 py-6 text-center text-[12.5px] text-[#A1A1AA]">No applications received yet.</p>}
              </section>
            </div>
          </div>

          {/* Recent jobs */}
          <section className={`${panel} p-5`}>
            <div className="mb-4 flex items-center justify-between"><div><h3 className="text-[15px] font-extrabold text-[#18181B]">Latest job openings</h3><p className="text-[12.5px] text-[#71717A]">Recently created or updated roles</p></div><Link href="/admin/careers/jobs" className="text-[12.5px] font-semibold text-[#C80808] hover:underline">All jobs →</Link></div>
            {!data?.recentJobs || data.recentJobs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F5] text-[#A1A1AA]"><Briefcase className="h-5 w-5" /></span><p className="text-[13.5px] font-bold text-[#52525B]">No jobs yet</p><Link href="/admin/careers/jobs" className="rounded-xl bg-[#17191C] px-4 py-2 text-[12.5px] font-bold text-white hover:bg-[#C80808]">Post your first job</Link></div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {data.recentJobs.map((job) => (
                  <Link key={job.id} href="/admin/careers/jobs" className="group flex items-start gap-3.5 rounded-xl border border-[#E4E4E7] bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-[#C80808]/30 hover:shadow-md">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E3239] to-[#14161A] text-[#F2B93B]"><Briefcase className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-extrabold text-[#18181B] group-hover:text-[#C80808]" title={job.title}>{job.title}</p>
                      <p className="truncate text-[12px] text-[#71717A]">{job.department} · {job.experience}</p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-[#A1A1AA]"><MapPin className="h-3 w-3" />{job.location}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${JOB_STATUS[job.status] || "bg-[#52525B] text-white"}`}>{job.status}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
