"use client";

import React from "react";
import Link from "next/link";
import {
  RefreshCw,
  Plus,
  FileSpreadsheet,
  Mail,
  Users,
  Layers,
  Package,
  FileEdit,
  FileText,
  Briefcase,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import WorkspaceLoader from "@/components/admin/WorkspaceLoader";
import PetroLogo from "@/components/common/PetroLogo";
import { useDashboard, greeting, ago, LineChart, Donut } from "@/components/admin/dashboard/dash-utils";

const panel = "rounded-2xl border border-[#E4E4E7] bg-white";
const BADGE: Record<string, string> = {
  new: "bg-[#C80808] text-white",
  in_progress: "bg-[#E0A21A] text-[#17191C]",
  resubmitted: "bg-[#E0A21A] text-[#17191C]",
  quoted: "bg-emerald-600 text-white",
  responded: "bg-emerald-600 text-white",
  closed: "bg-[#52525B] text-white",
  rejected: "bg-[#52525B] text-white",
  shortlisted: "bg-emerald-600 text-white",
  under_review: "bg-[#E0A21A] text-[#17191C]",
};
const STATUS_COLOR: Record<string, string> = { new: "#C80808", in_progress: "#E0A21A", resubmitted: "#E0A21A", quoted: "#059669", responded: "#059669", resolved: "#059669", closed: "#71717A", rejected: "#71717A" };

const RANK_COLORS = ["#C80808", "#E0A21A", "#27272A", "#8A0A0A", "#D4950F", "#52525B"];

type Insight = { tone: "red" | "gold" | "ok"; text: string; sub?: string; href?: string; cta?: string; Icon: LucideIcon };

function StatCard({ href, label, value, sub, today, Icon, grad, dark }: { href: string; label: string; value: number | string; sub: string; today?: number; Icon: LucideIcon; grad: string; dark?: boolean }) {
  const glass = dark ? "border-black/10 bg-black/10" : "border-white/30 bg-white/15";
  return (
    <Link href={href} className={`group relative flex min-h-[170px] flex-col overflow-hidden rounded-3xl bg-gradient-to-br p-5 shadow-[0_18px_36px_-18px_rgba(23,25,28,0.6)] transition-all duration-300 hover:-translate-y-1 ${grad} ${dark ? "text-[#17191C]" : "text-white"}`}>
      <span className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-black/10" />
      <Icon className="pointer-events-none absolute -bottom-5 -right-4 h-32 w-32 opacity-[0.15]" strokeWidth={1.3} />
      <div className="relative flex items-start justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl border backdrop-blur ${glass}`}><Icon className="h-5 w-5" /></span>
        {today !== undefined ? (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-extrabold ${dark ? "bg-black/15" : "bg-white/20"}`}><span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-[#17191C]" : "bg-white"}`} />{today} today</span>
        ) : (
          <ArrowUpRight className="h-5 w-5 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        )}
      </div>
      <p className="relative mt-auto pt-5 text-[2.5rem] font-black leading-none tracking-tight">{value}</p>
      <p className="relative mt-2 text-[1.02rem] font-extrabold leading-tight">{label}</p>
      <p className={`relative mt-0.5 text-[12.5px] ${dark ? "text-[#17191C]/70" : "text-white/75"}`}>{sub}</p>
    </Link>
  );
}

function Breakdown({ title, rows, href }: { title: string; rows: { status: string; total: number }[]; href: string }) {
  const sum = rows.reduce((a, r) => a + r.total, 0) || 1;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between"><h4 className="text-[13px] font-bold text-[#18181B]">{title}</h4><Link href={href} className="text-[12px] font-semibold text-[#C80808] hover:underline">Open</Link></div>
      {rows.length === 0 ? <p className="text-[12.5px] text-[#71717A]">Nothing received yet.</p> : (
        <>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-[#E4E4E7]">{rows.map((r) => <span key={r.status} style={{ width: `${(r.total / sum) * 100}%`, background: STATUS_COLOR[r.status] || "#A1A1AA" }} />)}</div>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">{rows.map((r) => <span key={r.status} className="inline-flex items-center gap-1.5 text-[12px] text-[#52525B]"><span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[r.status] || "#A1A1AA" }} /><span className="capitalize">{r.status.replace("_", " ")}</span><b className="text-[#18181B]">{r.total}</b></span>)}</div>
        </>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const d = useDashboard();
  const { stats, ins } = d;

  const rfqNew = stats.rfqs?.new ?? 0, enqNew = stats.enquiries?.new ?? 0, appNew = stats.applications?.new ?? 0;
  const pending = rfqNew + enqNew + appNew;
  const published = stats.products?.published ?? 0, total = stats.products?.total ?? 0;
  const draft = Math.max(0, total - published);
  const pct = total ? Math.round((published / total) * 100) : 0;
  const topShare = total ? Math.min(100, Math.round((d.topCategories.reduce((a: number, c: any) => a + c.products, 0) / total) * 100)) : 0;
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  type Check = { ok: boolean; level: "red" | "gold"; Icon: LucideIcon; text: string; sub?: string; href: string; cta: string };
  const checks: Check[] = [
    rfqNew > 0
      ? { ok: false, level: "red", Icon: FileSpreadsheet, text: `${rfqNew} new quotation request${rfqNew > 1 ? "s" : ""} waiting`, sub: ins.oldestNewRfq ? `Oldest received ${ago(ins.oldestNewRfq)}` : undefined, href: "/admin/quote-requests", cta: "Respond" }
      : { ok: true, level: "red", Icon: FileSpreadsheet, text: "No quotation requests waiting", sub: `${stats.rfqs?.total ?? 0} received in total`, href: "/admin/quote-requests", cta: "Open" },
    enqNew > 0
      ? { ok: false, level: "red", Icon: Mail, text: `${enqNew} customer enquir${enqNew > 1 ? "ies" : "y"} not yet answered`, sub: ins.oldestNewEnquiry ? `Oldest received ${ago(ins.oldestNewEnquiry)}` : undefined, href: "/admin/enquiries", cta: "Reply" }
      : { ok: true, level: "red", Icon: Mail, text: "All customer enquiries answered", sub: `${stats.enquiries?.total ?? 0} received in total`, href: "/admin/enquiries", cta: "Open" },
    appNew > 0
      ? { ok: false, level: "gold", Icon: Users, text: `${appNew} new job application${appNew > 1 ? "s" : ""} to review`, href: "/admin/careers/applications", cta: "Review" }
      : { ok: true, level: "gold", Icon: Users, text: "No applications waiting for review", sub: `${stats.applications?.total ?? 0} received in total`, href: "/admin/careers/applications", cta: "Open" },
    draft > 0
      ? { ok: false, level: "gold", Icon: Package, text: `${draft} product${draft > 1 ? "s are" : " is"} still in draft`, sub: "Draft products are not visible on the website", href: "/admin/products", cta: "Publish" }
      : { ok: true, level: "gold", Icon: Package, text: "All products are published", sub: `${published} products live on the website`, href: "/admin/products", cta: "Open" },
    (ins.emptyCategories ?? 0) > 0
      ? { ok: false, level: "gold", Icon: Layers, text: `${ins.emptyCategories} categor${ins.emptyCategories > 1 ? "ies have" : "y has"} no products`, sub: "Empty categories look unfinished to visitors", href: "/admin/categories", cta: "Fix" }
      : { ok: true, level: "gold", Icon: Layers, text: "Every category has products", sub: `${stats.categories?.total ?? 0} categories`, href: "/admin/categories", cta: "Open" },
    ins.openJobs === 0
      ? { ok: false, level: "gold", Icon: Briefcase, text: "No open job positions are published", sub: "Candidates see an empty Careers page", href: "/admin/careers/jobs", cta: "Post a job" }
      : { ok: true, level: "gold", Icon: Briefcase, text: `${ins.openJobs ?? 0} job position${ins.openJobs === 1 ? " is" : "s are"} open`, sub: "Visible on the Careers page", href: "/admin/careers/jobs", cta: "Open" },
  ];
  const failing = checks.filter((c) => !c.ok);
  checks.sort((a, b) => Number(a.ok) - Number(b.ok));

  const cols = [
    { t: "Quotations", Icon: FileSpreadsheet, total: stats.rfqs?.total ?? 0, n: rfqNew, href: "/admin/quote-requests", head: "bg-gradient-to-r from-[#E21212] to-[#8A0A0A]", dark: false, accent: "border-l-[#C80808]", avatar: "bg-[#C80808] text-white", empty: "No quotation requests yet", items: d.recentRfqs.map((r: any) => ({ id: "r" + r.id, a: r.product_name, b: `${r.company_name || r.full_name}${r.quantity ? " · " + r.quantity : ""}`, s: r.status, t: r.created_at })) },
    { t: "Enquiries", Icon: Mail, total: stats.enquiries?.total ?? 0, n: enqNew, href: "/admin/enquiries", head: "bg-gradient-to-r from-[#F2B93B] to-[#D4950F]", dark: true, accent: "border-l-[#E0A21A]", avatar: "bg-[#E0A21A] text-[#17191C]", empty: "No enquiries yet", items: d.recentEnquiries.map((r: any) => ({ id: "e" + r.id, a: r.subject, b: `${r.full_name}${r.company_name ? " · " + r.company_name : ""}`, s: r.status, t: r.created_at })) },
    { t: "Applications", Icon: Users, total: stats.applications?.total ?? 0, n: appNew, href: "/admin/careers/applications", head: "bg-gradient-to-r from-[#2E3239] to-[#14161A]", dark: false, accent: "border-l-[#17191C]", avatar: "bg-[#27272A] text-white", empty: "No applications yet", items: d.recentApplications.map((r: any) => ({ id: "a" + r.id, a: r.full_name, b: r.job_title || "General application", s: String(r.status || "new").toLowerCase().replace(" ", "_"), t: r.created_at })) },
  ];

  const quick: { href: string; l: string; sub: string; Icon: LucideIcon; tone: string; count: number }[] = [
    { href: "/admin/products", l: "Add product", sub: "New chemical or instrument", Icon: Plus, tone: "bg-gradient-to-br from-[#E21212] to-[#8A0A0A]", count: 0 },
    { href: "/admin/quote-requests", l: "Process RFQs", sub: "Review and quote requests", Icon: FileSpreadsheet, tone: "bg-gradient-to-br from-[#F2B93B] to-[#D4950F]", count: rfqNew },
    { href: "/admin/enquiries", l: "Enquiries", sub: "Reply to contact messages", Icon: Mail, tone: "bg-gradient-to-br from-[#2E3239] to-[#14161A]", count: enqNew },
    { href: "/admin/careers/jobs", l: "Post a job", sub: "Publish a new opening", Icon: Briefcase, tone: "bg-gradient-to-br from-[#8A0A0A] to-[#E0A21A]", count: 0 },
    { href: "/admin/content", l: "Website content", sub: "Edit headlines and contacts", Icon: FileEdit, tone: "bg-gradient-to-br from-[#E21212] to-[#8A0A0A]", count: 0 },
    { href: "/admin/documents", l: "Brochures", sub: "Manage downloadable files", Icon: FileText, tone: "bg-gradient-to-br from-[#F2B93B] to-[#D4950F]", count: 0 },
  ];

  return (
    <div className="space-y-5">
      {/* 1 — Banner (compact, clickable counters) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14161A] via-[#2B1115] to-[#8A0A0A] text-white shadow-[0_16px_36px_-20px_rgba(138,10,10,0.7)]">
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-72 rounded-full bg-[#E0A21A]/25 blur-[60px]" />
        <div className="pointer-events-none absolute right-4 top-1/2 w-[170px] -translate-y-1/2 opacity-[0.08]"><PetroLogo part="flame" variant="dark" width="100%" /></div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:30px_30px]" />
        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
        <div className="relative flex flex-col gap-4 px-5 py-4 min-[1400px]:flex-row min-[1400px]:items-center min-[1400px]:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]"><Sparkles className="h-3 w-3" />{today}</p>
            <h2 className="mt-0.5 text-[1.3rem] font-black leading-tight tracking-tight !text-white sm:text-[1.5rem]">{greeting()}, {d.name}</h2>
            <p className="mt-0.5 text-[12.5px] text-white/65">{d.loading ? "Fetching your latest figures…" : pending > 0 ? <><b className="text-white">{pending} item{pending > 1 ? "s" : ""}</b> need your attention today.</> : "You are all caught up."}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {[{ v: stats.enquiries?.total ?? 0, l: "Contacts", h: "/admin/enquiries" }, { v: stats.applications?.total ?? 0, l: "Applications", h: "/admin/careers/applications" }, { v: ins.openJobs ?? 0, l: "Open roles", h: "/admin/careers/jobs" }].map((x) => (
              <Link key={x.l} href={x.h} className="group flex items-baseline gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md transition-colors hover:border-white/35 hover:bg-white/20">
                <span className="text-[1.3rem] font-black leading-none">{d.loading ? "–" : x.v}</span>
                <span className="whitespace-nowrap text-[12px] font-semibold text-white/75 group-hover:text-white">{x.l}</span>
                <ArrowUpRight className="h-3 w-3 self-center text-white/40 transition-colors group-hover:text-white" />
              </Link>
            ))}
            <button onClick={d.load} disabled={d.refreshing} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-bold backdrop-blur transition-colors hover:bg-white/20 disabled:opacity-60" title={`Last updated: ${d.updatedAt || "…"}`}><RefreshCw className={`h-3.5 w-3.5 ${d.refreshing ? "animate-spin" : ""}`} />Refresh</button>
          </div>
        </div>
      </div>

      {d.loading ? (
        <WorkspaceLoader />
      ) : (
        <>
          {/* 2 — Quick links */}
          <section>
            <div className="mb-3 flex items-end justify-between"><div><h3 className="text-[15px] font-extrabold text-[#18181B]">Quick links</h3><p className="text-[12.5px] text-[#71717A]">Jump straight into your most common tasks</p></div></div>
            <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-6">
              {quick.map(({ href, l, sub, Icon, tone, count }) => (
                <Link key={l} href={href} className="group relative flex flex-col rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_36px_-16px_rgba(23,25,28,0.35)]">
                  <span className={`absolute inset-x-4 top-0 h-[3px] rounded-b-full opacity-0 transition-opacity group-hover:opacity-100 ${tone}`} />
                  <div className="flex items-start justify-between">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 ${tone}`}><Icon className="h-5 w-5" /></span>
                    {count > 0 ? <span className="rounded-full bg-[#C80808] px-2 py-0.5 text-[10.5px] font-extrabold text-white">{count} new</span> : <ArrowUpRight className="h-4 w-4 text-[#C3CAD1] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#C80808]" />}
                  </div>
                  <p className="mt-4 text-[14px] font-extrabold leading-tight text-[#18181B]">{l}</p>
                  <p className="mt-1 text-[12px] leading-snug text-[#71717A]">{sub}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* 3 — Latest requests board (right after quick links) */}
          <section>
            <div className="mb-3 flex items-end justify-between"><div><h3 className="text-[15px] font-extrabold text-[#18181B]">Latest requests</h3><p className="text-[12.5px] text-[#71717A]">The newest quotations, enquiries and applications</p></div></div>
            <div className="grid items-stretch gap-5 lg:grid-cols-3">
              {cols.map((c) => (
                <section key={c.t} className="flex flex-col overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white shadow-sm transition-shadow hover:shadow-[0_18px_36px_-18px_rgba(23,25,28,0.3)]">
                  <header className={`relative flex items-center justify-between gap-3 overflow-hidden px-4 py-3.5 ${c.head} ${c.dark ? "text-[#17191C]" : "text-white"}`}>
                    <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
                    <c.Icon className="pointer-events-none absolute -bottom-3 right-10 h-16 w-16 opacity-[0.12]" strokeWidth={1.4} />
                    <div className="relative flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${c.dark ? "border-black/10 bg-black/10" : "border-white/30 bg-white/15"}`}><c.Icon className="h-[18px] w-[18px]" /></span>
                      <div><h4 className={`text-[14.5px] font-extrabold leading-tight ${c.dark ? "!text-[#17191C]" : "!text-white"}`}>{c.t}</h4><p className={`text-[11.5px] ${c.dark ? "text-[#17191C]/70" : "text-white/75"}`}>{c.total} in total</p></div>
                    </div>
                    {c.n > 0 ? <span className={`relative rounded-full px-3 py-1 text-[11.5px] font-extrabold ${c.dark ? "bg-black/15" : "bg-white/20"}`}>{c.n} new</span> : <span className={`relative text-[11.5px] font-semibold ${c.dark ? "text-[#17191C]/60" : "text-white/60"}`}>All handled</span>}
                  </header>
                  <div className="flex-1 space-y-2 p-3">
                    {c.items.length === 0 ? (
                      <div className="flex h-full min-h-[150px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#D4D4D8] px-4 py-6 text-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F4F5] text-[#A1A1AA]"><c.Icon className="h-5 w-5" /></span>
                        <p className="text-[13px] font-bold text-[#52525B]">{c.empty}</p>
                        <p className="text-[12px] text-[#A1A1AA]">New ones will appear here.</p>
                      </div>
                    ) : c.items.map((i: any) => (
                      <Link key={i.id} href={c.href} title={i.a} className={`group flex items-start gap-3 rounded-xl border border-[#EEEEF0] border-l-4 bg-white p-3 transition-all hover:-translate-y-0.5 hover:bg-[#FAFAFA] hover:shadow-md ${i.s === "new" ? c.accent : "border-l-[#E4E4E7]"}`}>
                        <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-black ${c.avatar}`}>{String(i.b || i.a || "?").trim().charAt(0).toUpperCase()}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-bold text-[#18181B] group-hover:text-[#C80808]">{i.a}</p>
                          <p className="truncate text-[12px] text-[#71717A]">{i.b}</p>
                          <div className="mt-2 flex items-center justify-between gap-2"><span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${BADGE[i.s] || BADGE.closed}`}>{String(i.s).replace("_", " ")}</span><span className="inline-flex items-center gap-1 text-[11.5px] text-[#A1A1AA]"><Clock className="h-3 w-3" />{ago(i.t)}</span></div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href={c.href} className="flex items-center justify-center gap-1.5 border-t border-[#EEEEF0] bg-[#FAFAFA] py-3 text-[12.5px] font-bold text-[#18181B] transition-colors hover:bg-[#17191C] hover:text-white">View all {c.t.toLowerCase()}<ArrowRight className="h-3.5 w-3.5" /></Link>
                </section>
              ))}
            </div>
          </section>

          {/* 3 — Catalogue health + health checks */}
          <div className="grid gap-5 lg:grid-cols-5">
            <section className={`${panel} flex flex-col justify-between gap-5 p-5 lg:col-span-2`}>
              <div className="flex items-start justify-between">
                <div><h3 className="text-[15px] font-extrabold text-[#18181B]">Catalogue health</h3><p className="text-[12.5px] text-[#71717A]">What visitors can see on the website</p></div>
                <Link href="/admin/products" className="text-[12.5px] font-semibold text-[#C80808] hover:underline">Manage →</Link>
              </div>
              <div className="flex items-center gap-5">
                <Donut size={112} stroke={13} parts={[{ v: published || 0.001, c: "#C80808" }, { v: draft, c: "#D4D4D8" }]} center={<><span className="text-[1.5rem] font-black leading-none text-[#18181B]">{pct}%</span><span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">live</span></>} />
                <div className="grid flex-1 grid-cols-2 gap-2.5">
                  {[{ l: "Published", v: published, c: "bg-[#C80808]" }, { l: "Draft", v: draft, c: "bg-[#D4D4D8]" }, { l: "Categories", v: stats.categories?.total ?? 0, c: "bg-[#E0A21A]" }, { l: "Products", v: total, c: "bg-[#27272A]" }].map((x) => (
                    <div key={x.l} className="rounded-xl border border-[#E4E4E7] px-3 py-2.5"><div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#71717A]"><span className={`h-2 w-2 rounded-full ${x.c}`} />{x.l}</div><div className="mt-0.5 text-[1.25rem] font-black leading-none text-[#18181B]">{x.v}</div></div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#F4F4F5] pt-4">
                <div className="mb-1.5 flex items-center justify-between text-[12px] font-semibold text-[#52525B]"><span>Category split</span><span className="text-[#71717A]">{(stats.categories?.chemicals ?? 0)} chemicals · {(stats.categories?.instrumentation ?? 0)} instrumentation</span></div>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-[#E4E4E7]"><span className="bg-gradient-to-r from-[#C80808] to-[#E0A21A]" style={{ width: `${((stats.categories?.chemicals ?? 0) / Math.max(1, (stats.categories?.chemicals ?? 0) + (stats.categories?.instrumentation ?? 0))) * 100}%` }} /><span className="bg-[#27272A]" style={{ width: `${((stats.categories?.instrumentation ?? 0) / Math.max(1, (stats.categories?.chemicals ?? 0) + (stats.categories?.instrumentation ?? 0))) * 100}%` }} /></div>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[{ l: "Documents", v: stats.documents ?? 0, h: "/admin/documents" }, { l: "Services", v: stats.services ?? 0, h: "/admin/services" }, { l: "Industries", v: stats.industries ?? 0, h: "/admin/industries" }].map((x) => (
                  <Link key={x.l} href={x.h} className="rounded-xl bg-[#F4F4F5] px-3 py-2.5 text-center transition-colors hover:bg-[#E4E4E7]"><div className="text-[1.15rem] font-black leading-none text-[#18181B]">{x.v}</div><div className="mt-1 text-[11px] font-semibold text-[#71717A]">{x.l}</div></Link>
                ))}
              </div>
            </section>

            <section className={`${panel} p-5 lg:col-span-3`}>
              <div className="mb-4 flex items-center justify-between">
                <div><h3 className="text-[15px] font-extrabold text-[#18181B]">Needs your attention</h3><p className="text-[12.5px] text-[#71717A]">{failing.length === 0 ? "All checks passed" : `${failing.length} of ${checks.length} checks need action`}</p></div>
                <span className={`rounded-full px-3 py-1 text-[11.5px] font-extrabold text-white ${failing.length === 0 ? "bg-emerald-600" : "bg-[#C80808]"}`}>{failing.length === 0 ? "All clear" : `${failing.length} item${failing.length > 1 ? "s" : ""}`}</span>
              </div>
              <ul className="space-y-1.5">
                {checks.map((c, n) => (
                  <li key={n} className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${c.ok ? "border-[#E4E4E7] bg-white" : c.level === "red" ? "border-[#C80808]/30 bg-white shadow-sm" : "border-[#E0A21A]/50 bg-white shadow-sm"}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.ok ? "bg-emerald-600 text-white" : c.level === "red" ? "bg-[#C80808] text-white" : "bg-[#E0A21A] text-[#17191C]"}`}>{c.ok ? <CheckCircle2 className="h-5 w-5" /> : <c.Icon className="h-5 w-5" />}</span>
                    <div className="min-w-0 flex-1"><p className="text-[13.5px] font-bold text-[#18181B]">{c.text}</p>{c.sub && <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[#71717A]">{!c.ok && (c.level === "red" ? <Clock className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />)}{c.sub}</p>}</div>
                    {c.ok ? <Link href={c.href} className="shrink-0 text-[12px] font-semibold text-[#71717A] hover:text-[#C80808]">Open →</Link> : <Link href={c.href} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#17191C] px-3.5 py-1.5 text-[12px] font-bold text-white transition-colors hover:bg-[#C80808]">{c.cta}<ArrowRight className="h-3 w-3" /></Link>}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* 6 — Activity + pipeline */}
          <div className="grid gap-5 lg:grid-cols-3">
            <section className={`${panel} p-5 lg:col-span-2`}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <div><h3 className="text-[15px] font-extrabold text-[#18181B]">Incoming activity</h3><p className="text-[12.5px] text-[#71717A]">Quotations, enquiries and applications · last 14 days</p></div>
                <div className="flex gap-4 text-[12px] text-[#52525B]">{[["#C80808", "Quotations"], ["#D4950F", "Enquiries"], ["#27272A", "Applications"]].map(([c, l]) => <span key={l} className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: c }} />{l}</span>)}</div>
              </div>
              <LineChart data={d.activity} series={[{ k: "rfqs", color: "#C80808", label: "Quotations" }, { k: "enquiries", color: "#D4950F", label: "Enquiries" }, { k: "applications", color: "#27272A", label: "Applications" }]} />
            </section>
            <section className={`${panel} flex flex-col gap-5 p-5`}>
              <div><h3 className="text-[15px] font-extrabold text-[#18181B]">Pipeline status</h3><p className="text-[12.5px] text-[#71717A]">Where your requests stand right now</p></div>
              <Breakdown title="Quotation requests" rows={d.rfqStatus} href="/admin/quote-requests" />
              <Breakdown title="Customer enquiries" rows={d.enquiryStatus} href="/admin/enquiries" />
              <p className="mt-auto rounded-xl bg-[#F4F4F5] px-4 py-3 text-[12.5px] text-[#52525B]"><b className="text-[#18181B]">{(stats.rfqs?.total ?? 0) + (stats.enquiries?.total ?? 0)}</b> customer requests in total, <b className="text-[#18181B]">{rfqNew + enqNew}</b> still open.</p>
            </section>
          </div>

          {/* 7 — Top categories */}
          <section className={`${panel} p-5`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-extrabold text-[#18181B]">Top categories</h3>
                <p className="text-[12.5px] text-[#71717A]">{d.topCategories.length > 0 ? <>The {d.topCategories.length} biggest categories hold <b className="text-[#18181B]">{topShare}%</b> of your {total} products</> : "By number of products"}</p>
              </div>
              <Link href="/admin/categories" className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] px-3.5 py-1.5 text-[12.5px] font-bold text-[#18181B] transition-colors hover:border-[#C80808]/40 hover:text-[#C80808]">Manage categories <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            {d.topCategories.length === 0 ? <p className="py-6 text-center text-[13px] text-[#71717A]">No categories yet.</p> : (
              <>
                {/* stacked share bar */}
                <div className="mb-5 flex h-3 overflow-hidden rounded-full bg-[#E4E4E7]">
                  {d.topCategories.map((c: any, i: number) => <span key={c.name} title={`${c.name}: ${c.products}`} style={{ width: `${total ? (c.products / total) * 100 : 0}%`, background: RANK_COLORS[i % RANK_COLORS.length] }} />)}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {d.topCategories.map((c: any, i: number) => {
                    const share = total ? Math.round((c.products / total) * 100) : 0;
                    const mx = Math.max(1, ...d.topCategories.map((x: any) => x.products));
                    const chem = c.division === "chemicals";
                    return (
                      <Link key={c.name} href="/admin/categories" className="group flex items-center gap-3.5 rounded-xl border border-[#E4E4E7] bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-[#C80808]/30 hover:shadow-md">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[14px] font-black text-white shadow-sm" style={{ background: RANK_COLORS[i % RANK_COLORS.length], color: i === 1 ? "#17191C" : "#fff" }}>{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[13.5px] font-bold text-[#18181B] group-hover:text-[#C80808]" title={c.name}>{c.name}</p>
                            <p className="shrink-0 text-[1.15rem] font-black leading-none text-[#18181B]">{c.products}</p>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11.5px] text-[#71717A]">
                            <span className="inline-flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${chem ? "bg-[#E0A21A]" : "bg-[#27272A]"}`} />{chem ? "Chemicals" : "Instrumentation"}</span>
                            <span>{share}% of catalogue</span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F4F4F5]"><div className="h-full rounded-full" style={{ width: `${Math.max(6, (c.products / mx) * 100)}%`, background: RANK_COLORS[i % RANK_COLORS.length] }} /></div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
