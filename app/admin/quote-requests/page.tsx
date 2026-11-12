"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";
import PetroLogo from "@/components/common/PetroLogo";
import Dropdown from "@/components/admin/Dropdown";
import {
  buildRfqEmailContent,
  getMailtoLink,
  getGmailComposeLink,
} from "@/lib/email-compose";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Search,
  Phone,
  Building2,
  Clock,
  Trash2,
  X,
  CheckCircle2,
  RefreshCw,
  Mail,
  Reply,
  Sparkles,
  ChevronRight,
  StickyNote,
  Inbox,
  Search as SearchIcon,
  BadgeCheck,
  Trophy,
  MapPin,
  CalendarDays,
  Package,
  Factory,
  ExternalLink,
  Paperclip,
  Download,
  Eye,
  FileText,
} from "lucide-react";

const RFQ_STATUS_STEPS = [
  { value: "new", label: "New (Pending Review)" },
  { value: "under_review", label: "Under Review / TBE" },
  { value: "awaiting_info", label: "Awaiting Client Info" },
  { value: "quoted", label: "Quotation Sent (Quoted)" },
  { value: "completed", label: "Completed / Won" },
  { value: "rejected", label: "Rejected / Closed" },
];

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  resubmitted: "Resubmitted",
  under_review: "Under review",
  awaiting_info: "Awaiting info",
  quoted: "Quoted",
  completed: "Completed",
  rejected: "Rejected",
};
const STATUS_STYLE: Record<string, string> = {
  new: "bg-[#C80808] text-white",
  resubmitted: "bg-[#E0A21A] text-[#17191C]",
  under_review: "bg-[#2E3239] text-white",
  awaiting_info: "bg-[#E0A21A] text-[#17191C]",
  quoted: "bg-emerald-600 text-white",
  completed: "bg-[#047857] text-white",
  rejected: "bg-[#52525B] text-white",
};
const STATUS_BAR: Record<string, string> = {
  new: "bg-[#C80808]",
  resubmitted: "bg-[#E0A21A]",
  under_review: "bg-[#2E3239]",
  awaiting_info: "bg-[#E0A21A]",
  quoted: "bg-emerald-500",
  completed: "bg-[#047857]",
  rejected: "bg-[#A1A1AA]",
};

const field = "w-full rounded-xl border border-[#D8DDE2] bg-white px-3.5 py-2.5 text-[13.5px] text-[#17191C] placeholder:text-[#929DA7] outline-none transition focus:border-[#C80808] focus:ring-4 focus:ring-[#C80808]/10";

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
function dateSafe(val: any): string {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminQuoteRequestsPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [totalAll, setTotalAll] = useState(0);

  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [quoteAmountInput, setQuoteAmountInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchRfqs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/quote-requests?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRfqs(json.quoteRequests || []);
        if (json.counts) setStatusCounts(json.counts);
        if (typeof json.totalAll === "number") setTotalAll(json.totalAll);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, [search, statusFilter]);

  const handleOpenDetail = (item: any) => {
    setSelectedRfq(item);
    setNotesInput(item.internal_notes || "");
    setStatusInput(item.status || "new");
    setQuoteAmountInput(item.quote_amount ? String(item.quote_amount) : "");
    setDeleteConfirmId(null);
  };

  const handleUpdate = async () => {
    if (!selectedRfq) return;
    setUpdating(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/quote-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRfq.id,
          status: statusInput,
          internal_notes: notesInput,
          quote_amount: quoteAmountInput ? parseFloat(quoteAmountInput) : null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedRfq(json.quoteRequest);
        setSaveSuccess(true);
        fetchRfqs();
        setTimeout(() => {
          setSelectedRfq(null);
          setSaveSuccess(false);
        }, 700);
      } else {
        alert(json.message || json.error || "Failed to update RFQ.");
      }
    } catch (e: any) {
      alert(e.message || "Network error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/quote-requests?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        if (selectedRfq?.id === id) setSelectedRfq(null);
        setDeleteConfirmId(null);
        fetchRfqs();
      }
    } catch (e) {}
  };

  // Status transitions (unchanged business rules)
  let availableRfqStatuses = RFQ_STATUS_STEPS;
  const isResubmittedState = selectedRfq?.status === "resubmitted" || statusInput === "resubmitted";
  if (statusInput === "rejected") {
    availableRfqStatuses = [
      { value: "rejected", label: "Rejected / Closed" },
      { value: "resubmitted", label: "Resubmit / Reopened" },
      { value: "under_review", label: "Resubmit (Back to Review)" },
    ];
  } else if (isResubmittedState && statusInput === "resubmitted") {
    availableRfqStatuses = [
      { value: "resubmitted", label: "Resubmit / Reopened" },
      { value: "under_review", label: "Under Review / TBE" },
      { value: "awaiting_info", label: "Awaiting Client Info" },
      { value: "quoted", label: "Quotation Sent (Quoted)" },
      { value: "completed", label: "Completed / Won" },
      { value: "rejected", label: "Rejected / Closed" },
    ];
  } else {
    const currentStatusIndex = Math.max(
      RFQ_STATUS_STEPS.findIndex((s) => s.value === selectedRfq?.status),
      RFQ_STATUS_STEPS.findIndex((s) => s.value === statusInput)
    );
    availableRfqStatuses = RFQ_STATUS_STEPS.filter((_, idx) => idx >= Math.max(0, currentStatusIndex));
  }

  const open = (statusCounts.new || 0) + (statusCounts.resubmitted || 0);
  const inReview = (statusCounts.under_review || 0) + (statusCounts.awaiting_info || 0);
  const filtersActive = !!search.trim() || statusFilter !== "all";
  const PIPE = ["new", "under_review", "awaiting_info", "quoted", "completed"];
  const pipeIdx = PIPE.indexOf(statusInput === "resubmitted" ? "new" : statusInput);

  const summary = [
    { k: "new", l: "New", sub: "Waiting for review", v: open, Icon: Inbox, grad: "from-[#E21212]/70 to-[#A81010]/70", dark: false },
    { k: "under_review", l: "In review", sub: "Review or info needed", v: inReview, Icon: SearchIcon, grad: "from-[#F2B93B]/70 to-[#D4950F]/70", dark: true },
    { k: "quoted", l: "Quoted", sub: "Quotation sent", v: statusCounts.quoted || 0, Icon: BadgeCheck, grad: "from-[#059669] to-[#047857]", dark: false },
    { k: "completed", l: "Won", sub: "Completed orders", v: statusCounts.completed || 0, Icon: Trophy, grad: "from-[#2E3239]/70 to-[#14161A]/70", dark: false },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#191B1F] via-[#1E191C] to-[#24191C] text-white shadow-[0_12px_28px_-16px_rgba(200,8,8,0.15)]">
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-72 rounded-full bg-[#E0A21A]/15 blur-[60px]" />
        <div className="pointer-events-none absolute right-4 top-1/2 w-[170px] -translate-y-1/2 opacity-[0.08]"><PetroLogo part="flame" variant="dark" width="100%" /></div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:30px_30px]" />
        <span className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B] opacity-70" />
        <div className="relative flex flex-col gap-4 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]"><Sparkles className="h-3 w-3" />Procurement</p>
            <h2 className="mt-0.5 text-[1.3rem] font-black leading-tight tracking-tight !text-white sm:text-[1.5rem]">Quote Requests</h2>
            <p className="mt-0.5 text-[12.5px] text-white/65">Quotation requests (RFQs) submitted from the website.</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button onClick={() => setStatusFilter("all")} className={`flex items-baseline gap-2 rounded-xl border px-4 py-2 backdrop-blur-md transition-colors ${statusFilter === "all" ? "border-white/60 bg-white/25" : "border-white/15 bg-white/10 hover:border-white/35 hover:bg-white/20"}`}><span className="text-[1.3rem] font-black leading-none">{loading && !totalAll ? "–" : totalAll}</span><span className="whitespace-nowrap text-[12px] font-semibold text-white/80">All RFQs</span></button>
            <button onClick={() => setStatusFilter("new")} className={`flex items-baseline gap-2 rounded-xl border px-4 py-2 backdrop-blur-md transition-colors ${statusFilter === "new" ? "border-white/60 bg-white/25" : "border-white/15 bg-white/10 hover:border-white/35 hover:bg-white/20"}`}><span className="text-[1.3rem] font-black leading-none">{open}</span><span className="whitespace-nowrap text-[12px] font-semibold text-white/80">Need review</span></button>
            <button onClick={fetchRfqs} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-bold backdrop-blur transition-colors hover:bg-white/20"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh</button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summary.map((c) => {
          const active = statusFilter === c.k;
          return (
            <button key={c.k} onClick={() => setStatusFilter(active ? "all" : c.k)} className={`group relative flex items-center gap-3.5 overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-left shadow-[0_14px_28px_-16px_rgba(23,25,28,0.20)] transition-all duration-300 hover:-translate-y-1 ${c.grad} ${c.dark ? "text-[#17191C]" : "text-white"} ${active ? "ring-4 ring-[#17191C]/20" : ""}`}>
              <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
              <c.Icon className="pointer-events-none absolute -bottom-3 right-3 h-16 w-16 opacity-[0.14]" strokeWidth={1.4} />
              <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${c.dark ? "border-black/10 bg-black/10" : "border-white/30 bg-white/15"}`}><c.Icon className="h-5 w-5" /></span>
              <span className="relative min-w-0"><span className="block text-[1.7rem] font-black leading-none">{c.v}</span><span className="mt-1 block text-[13px] font-extrabold leading-tight">{c.l}</span><span className={`block truncate text-[11.5px] ${c.dark ? "text-[#17191C]/65" : "text-white/75"}`}>{active ? "Showing only these" : c.sub}</span></span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E4E7] bg-white p-3 shadow-sm lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#929DA7]" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by company, contact, product or specification…" className={`${field} !pl-10`} />
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex max-w-full overflow-x-auto rounded-xl bg-[#F1F1F3] p-1">
            {[{ id: "all", label: "All" }, { id: "new", label: "New" }, { id: "resubmitted", label: "Resubmitted" }, { id: "under_review", label: "Review" }, { id: "awaiting_info", label: "Info" }, { id: "quoted", label: "Quoted" }, { id: "completed", label: "Won" }, { id: "rejected", label: "Rejected" }].map((tab) => (
              <button key={tab.id} onClick={() => setStatusFilter(tab.id)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[12.5px] font-bold transition-all ${statusFilter === tab.id ? "bg-white text-[#C80808] shadow-sm" : "text-[#5F6871] hover:text-[#17191C]"}`}>{tab.label}</button>
            ))}
          </div>
          {filtersActive && <button onClick={() => { setSearch(""); setStatusFilter("all"); }} className="px-1 text-[12.5px] font-bold text-[#C80808] hover:underline">Clear filters</button>}
        </div>
      </div>

      {/* RFQ list */}
      {loading ? (
        <WorkspaceLoader compact />
      ) : rfqs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E4E7] bg-white px-6 py-16 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F4F5] text-[#929DA7]"><FileSpreadsheet className="h-6 w-6" /></span>
          <h3 className="text-[16px] font-extrabold text-[#17191C]">{filtersActive ? "No quote requests match your filters" : "No quote requests yet"}</h3>
          <p className="max-w-sm text-[13px] text-[#5F6871]">{filtersActive ? "Try a different keyword or clear the filters." : "Requests submitted through the website quotation form will appear here in real time."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="px-1 text-[12.5px] text-[#71717A]">{rfqs.length} request{rfqs.length === 1 ? "" : "s"}</p>
          {rfqs.map((rfq) => {
            const status = rfq.status || "new";
            const isNew = status === "new" || status === "resubmitted";
            return (
              <article key={rfq.id} onClick={() => handleOpenDetail(rfq)} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C80808]/30 hover:shadow-[0_20px_40px_-20px_rgba(23,25,28,0.16)]">
                <span className={`absolute inset-y-0 left-0 w-1.5 ${STATUS_BAR[status] || "bg-[#A1A1AA]"}`} />
                <div className="grid gap-4 p-5 pl-6 lg:grid-cols-[minmax(230px,300px)_1fr_auto] lg:items-center lg:gap-6">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2E3239]/70 to-[#14161A]/70 text-[20px] font-black text-white shadow-md">
                      {String(rfq.company_name || rfq.full_name || "?").trim().charAt(0).toUpperCase()}
                      {isNew && <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-[#C80808] ring-2 ring-white" />}
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[14.5px] font-extrabold leading-snug text-[#17191C]" title={rfq.company_name}>{rfq.company_name || rfq.full_name}</p>
                      <p className="mt-0.5 truncate text-[12.5px] text-[#71717A]">{rfq.full_name}</p>
                      {rfq.industry && <p className="mt-0.5 inline-flex items-center gap-1 truncate text-[11.5px] text-[#A1A1AA]"><Factory className="h-3 w-3" />{rfq.industry}</p>}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#17191C] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white"><FileSpreadsheet className="h-3 w-3" />RFQ</span>
                      <h3 className="min-w-0 truncate text-[14px] font-extrabold text-[#17191C] group-hover:text-[#C80808]" title={rfq.product_name}>{rfq.product_name}</h3>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl bg-[#F7F7F8] px-3 py-2"><p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]"><Package className="h-3 w-3" />Quantity</p><p className="truncate text-[13px] font-extrabold text-[#17191C]">{rfq.quantity ? `${rfq.quantity} ${rfq.unit_of_measurement || "Pcs"}` : "—"}</p></div>
                      <div className="rounded-xl bg-[#F7F7F8] px-3 py-2"><p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]"><CalendarDays className="h-3 w-3" />Delivery</p><p className="truncate text-[13px] font-extrabold text-[#17191C]" title={rfq.required_delivery_date}>{rfq.required_delivery_date || "Standard lead time"}</p></div>
                      <div className="rounded-xl bg-[#F7F7F8] px-3 py-2"><p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]"><MapPin className="h-3 w-3" />Location</p><p className="truncate text-[13px] font-extrabold text-[#17191C]" title={rfq.delivery_location}>{rfq.delivery_location || "Not specified"}</p></div>
                    </div>
                    <p className="mt-2 truncate text-[12px] text-[#71717A]"><span className="font-semibold text-[#52525B]">{rfq.product_category || "General"}</span> · {rfq.email}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 lg:w-[170px] lg:flex-col lg:items-end lg:justify-center">
                    <div className="flex flex-col items-start gap-1.5 lg:items-end">
                      <span className={`rounded-full px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-sm ${STATUS_STYLE[status] || STATUS_STYLE.rejected}`}>{STATUS_LABEL[status] || status}</span>
                      {rfq.quote_amount ? <span className="text-[13px] font-extrabold text-emerald-700">₹{Number(rfq.quote_amount).toLocaleString("en-IN")}</span> : null}
                      <span className="inline-flex items-center gap-1 text-[12px] text-[#A1A1AA]" title={dateSafe(rfq.created_at)}><Clock className="h-3.5 w-3.5" />{ago(rfq.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const { to, subject: emailSub, body } = buildRfqEmailContent(rfq);
                        const mailto = getMailtoLink(to, emailSub, body);
                        return (
                          <a
                            href={mailto}
                            onClick={(e) => e.stopPropagation()}
                            title="Compose quotation reply email"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E4E4E7] bg-white px-3 py-2 text-[12px] font-bold text-[#17191C] transition-colors hover:border-[#C80808]/40 hover:text-[#C80808]"
                          >
                            <Reply className="h-3.5 w-3.5" />Reply
                          </a>
                        );
                      })()}
                      <span className="inline-flex items-center gap-1 rounded-xl bg-[#17191C] px-3 py-2 text-[12px] font-bold text-white transition-colors group-hover:bg-[#C80808]">Open<ChevronRight className="h-3.5 w-3.5" /></span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selectedRfq && (() => {
        const { to, subject: emailSub, body: emailBody } = buildRfqEmailContent(selectedRfq);
        const mailto = getMailtoLink(to, emailSub, emailBody);
        const gmailLink = getGmailComposeLink(to, emailSub, emailBody);
        return (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#14161A]/70 p-3 backdrop-blur-sm sm:items-center sm:p-5" onClick={() => setSelectedRfq(null)}>
            <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="relative my-4 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] animate-[routepop2_.35s_cubic-bezier(.2,.9,.25,1.1)_both]">
              <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#191B1F] via-[#1E191C] to-[#24191C] px-6 py-4 text-white sm:px-7">
                <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-48 rounded-full bg-[#E0A21A]/15 blur-3xl" />
                <span className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B] opacity-70" />
                <button onClick={() => setSelectedRfq(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25" aria-label="Close"><X className="h-4 w-4" /></button>
                <div className="flex items-center gap-4 pr-10">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-[18px] font-black text-white ring-1 ring-white/25">{String(selectedRfq.company_name || selectedRfq.full_name || "?").trim().charAt(0).toUpperCase()}</span>
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]"><FileSpreadsheet className="h-3 w-3" />Quotation request</p>
                    <h3 className="truncate text-[1.1rem] font-black leading-tight !text-white" title={selectedRfq.product_name}>{selectedRfq.product_name}</h3>
                    <p className="text-[12px] text-white/60">Received {dateSafe(selectedRfq.created_at)} · {ago(selectedRfq.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid lg:grid-cols-5">
                  <div className="space-y-5 p-6 sm:p-7 lg:col-span-3">
                    <div>
                      <h4 className="mb-2 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">Requester</h4>
                      <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0"><p className="break-words text-[15px] font-extrabold leading-snug text-[#17191C]">{selectedRfq.company_name}</p><p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[#71717A]"><Building2 className="h-3.5 w-3.5" />{selectedRfq.full_name} · {selectedRfq.industry || "General"}</p></div>
                          <div className="flex items-center gap-2">
                            <a href={mailto} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#17191C] px-3.5 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-[#C80808]" title="Compose quotation in default email app"><Reply className="h-4 w-4" />Reply</a>
                            <a href={gmailLink} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#E4E4E7] bg-white px-3 py-2 text-[12px] font-bold text-[#17191C] transition-colors hover:border-[#C80808] hover:text-[#C80808]" title="Compose quotation in Gmail web app"><ExternalLink className="h-3.5 w-3.5" />Gmail</a>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <a href={mailto} title="Click to compose quotation email" className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#F7F7F8] px-3 py-2 hover:bg-[#F0F0F2]"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C80808] text-white"><Mail className="h-4 w-4" /></span><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Email (Click to Compose)</span><span className="block truncate text-[12.5px] font-semibold text-[#17191C]" title={selectedRfq.email}>{selectedRfq.email}</span></span></a>
                          {selectedRfq.phone ? <a href={`tel:${selectedRfq.phone}`} className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#F7F7F8] px-3 py-2 hover:bg-[#F0F0F2]"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E0A21A] text-[#17191C]"><Phone className="h-4 w-4" /></span><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Phone</span><span className="block truncate text-[12.5px] font-semibold text-[#17191C]">{selectedRfq.phone}</span></span></a> : <div className="flex items-center gap-2.5 rounded-xl bg-[#F7F7F8] px-3 py-2 text-[12.5px] text-[#A1A1AA]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E4E4E7]"><Phone className="h-4 w-4" /></span>No phone provided</div>}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">Requirement</h4>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {[{ l: "Quantity", v: `${selectedRfq.quantity || "—"} ${selectedRfq.unit_of_measurement || "Pcs"}`, I: Package }, { l: "Delivery date", v: selectedRfq.required_delivery_date || "Not specified", I: CalendarDays }, { l: "Location", v: selectedRfq.delivery_location || "Not specified", I: MapPin }].map((x) => (
                          <div key={x.l} className="rounded-xl border border-[#E4E4E7] bg-white px-3 py-2.5"><p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]"><x.I className="h-3 w-3" />{x.l}</p><p className="mt-0.5 break-words text-[13px] font-extrabold text-[#17191C]">{x.v}</p></div>
                        ))}
                      </div>
                      <div className="relative mt-3 whitespace-pre-wrap rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] p-4 pl-5 text-[13.5px] leading-relaxed text-[#17191C]"><span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#C80808]/70 to-[#E0A21A]/70" /><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Technical specifications · {selectedRfq.product_category || "General"}</p>{selectedRfq.technical_specifications || "No detailed technical specifications provided."}</div>
                      {selectedRfq.additional_comments && <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-dashed border-[#D4D4D8] bg-white p-4 text-[13px] leading-relaxed text-[#52525B]"><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Additional comments</p>{selectedRfq.additional_comments}</div>}
                      {(selectedRfq.attachment_name || selectedRfq.attachment_path) && (
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FBE9EC] text-[#C80808] border border-[#C80808]/20">
                              <Paperclip className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Attached Technical Document / BOQ</p>
                              <p className="truncate text-[13px] font-extrabold text-[#17191C]">
                                {selectedRfq.attachment_name || "Attached Document"}
                              </p>
                              {selectedRfq.attachment_size ? (
                                <p className="text-[11px] text-[#71717A]">{(selectedRfq.attachment_size / 1024).toFixed(1)} KB</p>
                              ) : !selectedRfq.attachment_path ? (
                                <p className="text-[11px] text-amber-600">Filename recorded (file upload enabled for new submissions)</p>
                              ) : null}
                            </div>
                          </div>
                          {selectedRfq.attachment_path && (
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={`/api/admin/quote-requests/${selectedRfq.id}/attachment?preview=true`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E4E4E7] bg-white px-3 py-1.5 text-[12px] font-bold text-[#17191C] hover:border-[#C80808] hover:text-[#C80808] transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Preview</span>
                              </a>
                              <a
                                href={`/api/admin/quote-requests/${selectedRfq.id}/attachment`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-[#17191C] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#C80808] transition-colors"
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span>Download</span>
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5 border-t border-[#EEEEF0] bg-[#FAFAFB] p-6 sm:p-7 lg:col-span-2 lg:border-l lg:border-t-0">
                    <div>
                      <h4 className="mb-3 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">Procurement desk</h4>
                      {statusInput === "rejected" || statusInput === "resubmitted" ? (
                        <div className="rounded-xl border border-[#E4E4E7] bg-white p-3 text-[12.5px] text-[#52525B]"><span className={`mr-2 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${STATUS_STYLE[statusInput]}`}>{STATUS_LABEL[statusInput]}</span>{statusInput === "rejected" ? "This request is closed." : "This request has been reopened."}</div>
                      ) : (
                        <ol className="flex items-center">
                          {PIPE.map((st, i) => (
                            <li key={st} className="flex flex-1 items-center last:flex-none">
                              <span title={STATUS_LABEL[st]} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black ring-4 ring-[#FAFAFB] ${i === pipeIdx ? STATUS_STYLE[st] : i < pipeIdx ? "bg-emerald-600 text-white" : "bg-[#E4E4E7] text-[#71717A]"}`}>{i < pipeIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}</span>
                              {i < PIPE.length - 1 && <span className={`h-0.5 flex-1 ${i < pipeIdx ? "bg-emerald-500" : "bg-[#E4E4E7]"}`} />}
                            </li>
                          ))}
                        </ol>
                      )}
                      {selectedRfq.status === "rejected" && statusInput === "rejected" && (
                        <button type="button" onClick={() => setStatusInput("resubmitted")} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#C80808] px-3 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-[#A81010]"><RefreshCw className="h-3.5 w-3.5" />Reopen / resubmit this RFQ</button>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[12px] font-bold text-[#17191C]">Status</label>
                      <Dropdown full value={statusInput} onChange={setStatusInput} options={availableRfqStatuses.map((x) => ({ value: x.value, label: x.label }))} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-bold text-[#17191C]">Quoted price (₹ / $)</label>
                      <div className="relative"><span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13.5px] font-bold text-[#929DA7]">₹</span><input type="number" step="any" placeholder="e.g. 18500" value={quoteAmountInput} onChange={(e) => setQuoteAmountInput(e.target.value)} className={`${field} !pl-8`} /></div>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-bold text-[#17191C]"><StickyNote className="h-3.5 w-3.5 text-[#C80808]" />Internal notes</label>
                      <textarea rows={4} value={notesInput} onChange={(e) => setNotesInput(e.target.value)} placeholder="Private notes about pricing, supplier or follow-up…" className={`${field} resize-none`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#EEF0F3] bg-white px-6 py-3.5 sm:px-7">
                <div>
                  {deleteConfirmId === selectedRfq.id ? (
                    <div className="inline-flex items-center gap-2"><button onClick={() => handleDelete(selectedRfq.id)} className="rounded-xl bg-[#C80808] px-3.5 py-2 text-[12.5px] font-bold text-white hover:bg-[#A81010]">Confirm delete</button><button onClick={() => setDeleteConfirmId(null)} className="px-2 text-[12.5px] font-semibold text-[#5F6871]">Cancel</button></div>
                  ) : (
                    <button onClick={() => setDeleteConfirmId(selectedRfq.id)} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#C80808] hover:underline"><Trash2 className="h-3.5 w-3.5" />Delete record</button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {saveSuccess && <span className="flex items-center gap-1 text-[12.5px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" />Saved</span>}
                  <button onClick={() => setSelectedRfq(null)} className="rounded-xl border-2 border-[#E7E9EE] px-4 py-2 text-[13px] font-bold text-[#17191C] transition-colors hover:border-[#17191C]">Close</button>
                  <button onClick={handleUpdate} disabled={updating} className="rounded-xl bg-gradient-to-r from-[#C80808]/70 to-[#E0A21A]/70 px-5 py-2 text-[13px] font-extrabold text-white shadow-[0_10px_24px_-8px_rgba(200,8,8,0.22)] transition-transform hover:-translate-y-0.5 disabled:opacity-70">{updating ? "Saving…" : "Save changes"}</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
