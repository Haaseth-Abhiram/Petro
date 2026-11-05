"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";
import PetroLogo from "@/components/common/PetroLogo";
import {
  buildEnquiryEmailContent,
  getMailtoLink,
  getGmailComposeLink,
} from "@/lib/email-compose";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Search,
  Phone,
  Building2,
  Clock,
  Trash2,
  X,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Lightbulb,
  Sparkles,
  ChevronRight,
  Reply,
  StickyNote,
  Inbox,
  Hourglass,
  CheckCheck,
  Archive,
} from "lucide-react";

const ENQUIRY_STATUS_STEPS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "responded", label: "Responded" },
  { value: "closed", label: "Closed" },
];

const STATUS_STYLE: Record<string, string> = {
  new: "bg-[#C80808] text-white",
  in_progress: "bg-[#E0A21A] text-[#17191C]",
  responded: "bg-emerald-600 text-white",
  closed: "bg-[#52525B] text-white",
};

const STATUS_BAR: Record<string, string> = {
  new: "bg-[#C80808]",
  in_progress: "bg-[#E0A21A]",
  responded: "bg-emerald-500",
  closed: "bg-[#A1A1AA]",
};

function formatDateSafe(val: any): string {
  if (!val) return "—";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "—";
  }
}

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

const isSuggestionItem = (e: any) =>
  (e.subject || "").toLowerCase().includes("suggestion") ||
  (e.subject || "").toLowerCase().includes("feedback") ||
  (e.message || "").toLowerCase().includes("suggestion");

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "enquiries" | "suggestions">("all");
  const [counts, setCounts] = useState({ total: 0, enquiries: 0, suggestions: 0 });
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({ new: 0, in_progress: 0, responded: 0, closed: 0 });

  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);

      // unfiltered request feeds the status summary cards
      fetch("/api/admin/enquiries").then((r) => r.json()).then((all) => {
        if (all.success) {
          const c: Record<string, number> = { new: 0, in_progress: 0, responded: 0, closed: 0 };
          (all.enquiries || []).forEach((e: any) => { c[e.status || "new"] = (c[e.status || "new"] || 0) + 1; });
          setStatusCounts(c);
        }
      }).catch(() => {});

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.enquiries || []);
        if (json.counts) {
          setCounts({
            total: json.counts.total || 0,
            enquiries: json.counts.enquiries || 0,
            suggestions: json.counts.suggestions || 0,
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [search, statusFilter, typeFilter]);

  const handleOpenDetail = (item: any) => {
    setSelectedEnquiry(item);
    setNotesInput(item.internal_notes || "");
    setStatusInput(item.status || "new");
    setDeleteConfirmId(null);
  };

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedEnquiry.id, status: statusInput, internal_notes: notesInput }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedEnquiry(json.enquiry);
        setSaveSuccess(true);
        fetchEnquiries();
        setTimeout(() => {
          setSelectedEnquiry(null);
          setSaveSuccess(false);
        }, 700);
      } else {
        alert(json.message || json.error || "Failed to update enquiry.");
      }
    } catch (e: any) {
      alert(e.message || "Network error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
        setDeleteConfirmId(null);
        fetchEnquiries();
      }
    } catch (e) {}
  };

  const currentStatusIndex = Math.max(
    ENQUIRY_STATUS_STEPS.findIndex((s) => s.value === selectedEnquiry?.status),
    ENQUIRY_STATUS_STEPS.findIndex((s) => s.value === statusInput)
  );
  const availableEnquiryStatuses = ENQUIRY_STATUS_STEPS.filter((_, idx) => idx >= Math.max(0, currentStatusIndex));
  const newCount = enquiries.filter((e) => e.status === "new").length;
  const filtersActive = !!search.trim() || statusFilter !== "all" || typeFilter !== "all";

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
            <p className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]"><Sparkles className="h-3 w-3" />Inbox</p>
            <h2 className="mt-0.5 text-[1.3rem] font-black leading-tight tracking-tight !text-white sm:text-[1.5rem]">Enquiries &amp; Suggestions</h2>
            <p className="mt-0.5 text-[12.5px] text-white/65">Messages from your contact form and website visitors.</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {([["all", "All messages", counts.total], ["enquiries", "Enquiries", counts.enquiries], ["suggestions", "Suggestions", counts.suggestions]] as const).map(([k, l, v]) => (
              <button key={k} onClick={() => setTypeFilter(k)} className={`flex items-baseline gap-2 rounded-xl border px-4 py-2 backdrop-blur-md transition-colors ${typeFilter === k ? "border-white/60 bg-white/25" : "border-white/15 bg-white/10 hover:border-white/35 hover:bg-white/20"}`}>
                <span className="text-[1.3rem] font-black leading-none">{loading && !v ? "–" : v}</span>
                <span className="whitespace-nowrap text-[12px] font-semibold text-white/80">{l}</span>
              </button>
            ))}
            <button onClick={fetchEnquiries} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-bold backdrop-blur transition-colors hover:bg-white/20"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh</button>
          </div>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {([
          { k: "new", l: "New", sub: "Waiting for a reply", Icon: Inbox, grad: "from-[#E21212] to-[#8A0A0A]", dark: false },
          { k: "in_progress", l: "In progress", sub: "Being handled", Icon: Hourglass, grad: "from-[#F2B93B] to-[#D4950F]", dark: true },
          { k: "responded", l: "Responded", sub: "Reply sent", Icon: CheckCheck, grad: "from-[#059669] to-[#047857]", dark: false },
          { k: "closed", l: "Closed", sub: "Finished", Icon: Archive, grad: "from-[#52525B] to-[#27272A]", dark: false },
        ] as const).map((c) => {
          const active = statusFilter === c.k;
          return (
            <button key={c.k} onClick={() => setStatusFilter(active ? "all" : c.k)} className={`group relative flex items-center gap-3.5 overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-left shadow-[0_14px_28px_-16px_rgba(23,25,28,0.55)] transition-all duration-300 hover:-translate-y-1 ${c.grad} ${c.dark ? "text-[#17191C]" : "text-white"} ${active ? "ring-4 ring-[#17191C]/20" : ""}`}>
              <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
              <c.Icon className="pointer-events-none absolute -bottom-3 right-3 h-16 w-16 opacity-[0.14]" strokeWidth={1.4} />
              <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${c.dark ? "border-black/10 bg-black/10" : "border-white/30 bg-white/15"}`}><c.Icon className="h-5 w-5" /></span>
              <span className="relative min-w-0"><span className="block text-[1.7rem] font-black leading-none">{statusCounts[c.k] ?? 0}</span><span className="mt-1 block text-[13px] font-extrabold leading-tight">{c.l}</span><span className={`block truncate text-[11.5px] ${c.dark ? "text-[#17191C]/65" : "text-white/75"}`}>{active ? "Showing only these" : c.sub}</span></span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E4E7] bg-white p-3 shadow-sm lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#929DA7]" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, company, email, subject or message…" className="w-full rounded-xl border border-[#D8DDE2] bg-white py-2.5 pl-10 pr-4 text-[13.5px] text-[#17191C] outline-none transition placeholder:text-[#929DA7] focus:border-[#C80808] focus:ring-4 focus:ring-[#C80808]/10" />
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex overflow-x-auto rounded-xl bg-[#F1F1F3] p-1">
            {[{ id: "all", label: "All" }, { id: "new", label: "New" }, { id: "in_progress", label: "In progress" }, { id: "responded", label: "Responded" }, { id: "closed", label: "Closed" }].map((tab) => (
              <button key={tab.id} onClick={() => setStatusFilter(tab.id)} className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold transition-all ${statusFilter === tab.id ? "bg-white text-[#C80808] shadow-sm" : "text-[#5F6871] hover:text-[#17191C]"}`}>{tab.label}</button>
            ))}
          </div>
          {filtersActive && <button onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }} className="px-1 text-[12.5px] font-bold text-[#C80808] hover:underline">Clear filters</button>}
        </div>
      </div>

      {/* Message list */}
      {loading ? (
        <WorkspaceLoader compact />
      ) : enquiries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E4E7] bg-white px-6 py-16 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F4F5] text-[#929DA7]">{typeFilter === "suggestions" ? <Lightbulb className="h-6 w-6" /> : <Mail className="h-6 w-6" />}</span>
          <h3 className="text-[16px] font-extrabold text-[#17191C]">{typeFilter === "suggestions" && !search.trim() && statusFilter === "all" ? "No website suggestions yet" : filtersActive ? "No messages match your filters" : "No enquiries yet"}</h3>
          <p className="max-w-sm text-[13px] text-[#5F6871]">{filtersActive ? "Try a different keyword or clear the filters." : "Messages sent through the public contact form and the footer suggestion box will appear here in real time."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="px-1 text-[12.5px] text-[#71717A]">{enquiries.length} message{enquiries.length === 1 ? "" : "s"}{newCount > 0 && <> · <b className="text-[#C80808]">{newCount} new</b></>}</p>
          {enquiries.map((enq) => {
            const sug = isSuggestionItem(enq);
            const status = enq.status || "new";
            const isNew = status === "new";
            return (
              <article key={enq.id} onClick={() => handleOpenDetail(enq)} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C80808]/30 hover:shadow-[0_20px_40px_-20px_rgba(23,25,28,0.35)]">
                <span className={`absolute inset-y-0 left-0 w-1.5 ${STATUS_BAR[status] || "bg-[#A1A1AA]"}`} />
                <div className="grid gap-4 p-5 pl-6 lg:grid-cols-[minmax(230px,300px)_1fr_auto] lg:items-center lg:gap-6">
                  {/* sender */}
                  <div className="flex min-w-0 items-center gap-3.5">
                    <span className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[20px] font-black shadow-md ${sug ? "bg-gradient-to-br from-[#F2B93B] to-[#D4950F] text-[#17191C]" : "bg-gradient-to-br from-[#2E3239] to-[#14161A] text-white"}`}>
                      {String(enq.full_name || "?").trim().charAt(0).toUpperCase()}
                      {isNew && <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-[#C80808] ring-2 ring-white" />}
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[14.5px] font-extrabold leading-snug text-[#17191C]" title={enq.full_name}>{enq.full_name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 truncate text-[12.5px] text-[#71717A]">{enq.company_name ? <><Building2 className="h-3.5 w-3.5 shrink-0" />{enq.company_name}</> : sug ? "Website visitor" : "Direct submission"}</p>
                    </div>
                  </div>

                  {/* message */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${sug ? "bg-[#E0A21A] text-[#17191C]" : "bg-[#17191C] text-white"}`}>{sug ? <Lightbulb className="h-3 w-3" /> : <Mail className="h-3 w-3" />}{sug ? "Suggestion" : "Enquiry"}</span>
                      <h3 className="min-w-0 truncate text-[14px] font-extrabold text-[#17191C] group-hover:text-[#C80808]" title={enq.subject}>{enq.subject}</h3>
                    </div>
                    <div className="mt-2 rounded-xl bg-[#F7F7F8] px-3.5 py-2.5"><p className="line-clamp-2 text-[13px] leading-relaxed text-[#52525B]">{enq.message}</p></div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#71717A]">
                      <span className="inline-flex min-w-0 items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0 text-[#A1A1AA]" /><span className="truncate">{enq.email}</span></span>
                      {enq.phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[#A1A1AA]" />{enq.phone}</span>}
                    </div>
                  </div>

                  {/* status + actions */}
                  <div className="flex items-center justify-between gap-3 lg:w-[170px] lg:flex-col lg:items-end lg:justify-center">
                    <div className="flex flex-col items-start gap-1.5 lg:items-end">
                      <span className={`rounded-full px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-sm ${STATUS_STYLE[status] || STATUS_STYLE.closed}`}>{String(status).replace("_", " ")}</span>
                      <span className="inline-flex items-center gap-1 text-[12px] text-[#A1A1AA]" title={formatDateSafe(enq.created_at)}><Clock className="h-3.5 w-3.5" />{ago(enq.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const { to, subject: emailSub, body } = buildEnquiryEmailContent(enq);
                        const mailto = getMailtoLink(to, emailSub, body);
                        return (
                          <a
                            href={mailto}
                            onClick={(e) => e.stopPropagation()}
                            title="Compose reply email"
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
      {selectedEnquiry && (() => {
        const sug = isSuggestionItem(selectedEnquiry);
        const { to, subject: emailSub, body: emailBody } = buildEnquiryEmailContent(selectedEnquiry);
        const mailto = getMailtoLink(to, emailSub, emailBody);
        const gmailLink = getGmailComposeLink(to, emailSub, emailBody);
        const curIdx = ENQUIRY_STATUS_STEPS.findIndex((x) => x.value === statusInput);
        const savedIdx = ENQUIRY_STATUS_STEPS.findIndex((x) => x.value === selectedEnquiry.status);
        return (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#14161A]/70 p-3 backdrop-blur-sm sm:items-center sm:p-5" onClick={() => setSelectedEnquiry(null)}>
            <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="relative my-4 flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] animate-[routepop2_.35s_cubic-bezier(.2,.9,.25,1.1)_both]">
              {/* header */}
              <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#14161A] via-[#2B1115] to-[#8A0A0A] px-6 py-4 text-white sm:px-7">
                <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-48 rounded-full bg-[#E0A21A]/25 blur-3xl" />
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
                <button onClick={() => setSelectedEnquiry(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25" aria-label="Close"><X className="h-4 w-4" /></button>
                <div className="flex items-center gap-4 pr-10">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[18px] font-black ${sug ? "bg-gradient-to-br from-[#F2B93B] to-[#D4950F] text-[#17191C]" : "bg-white/15 text-white ring-1 ring-white/25"}`}>{String(selectedEnquiry.full_name || "?").trim().charAt(0).toUpperCase()}</span>
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]">{sug ? <Lightbulb className="h-3 w-3" /> : <Mail className="h-3 w-3" />}{sug ? "Website suggestion" : "Customer enquiry"}</p>
                    <h3 className="truncate text-[1.1rem] font-black leading-tight !text-white" title={selectedEnquiry.subject}>{selectedEnquiry.subject}</h3>
                    <p className="text-[12px] text-white/60">Received {formatDateSafe(selectedEnquiry.created_at)} · {ago(selectedEnquiry.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* body — two columns, scrolls only on small screens */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid gap-0 lg:grid-cols-5">
                  <div className="space-y-5 p-6 sm:p-7 lg:col-span-3">
                    <div>
                      <h4 className="mb-2 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">From</h4>
                      <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0"><p className="break-words text-[15px] font-extrabold leading-snug text-[#17191C]">{selectedEnquiry.full_name}</p><p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[#71717A]"><Building2 className="h-3.5 w-3.5" />{selectedEnquiry.company_name || "Direct website submission"}</p></div>
                          <div className="flex items-center gap-2">
                            <a href={mailto} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#17191C] px-3.5 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-[#C80808]" title="Compose reply in your default email client"><Reply className="h-4 w-4" />Reply</a>
                            <a href={gmailLink} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#E4E4E7] bg-white px-3 py-2 text-[12px] font-bold text-[#17191C] transition-colors hover:border-[#C80808] hover:text-[#C80808]" title="Compose reply in Gmail web app"><ExternalLink className="h-3.5 w-3.5" />Gmail</a>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <a href={mailto} title="Click to compose email" className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#F7F7F8] px-3 py-2 transition-colors hover:bg-[#F0F0F2]"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C80808] text-white"><Mail className="h-4 w-4" /></span><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Email (Click to Compose)</span><span className="block truncate text-[12.5px] font-semibold text-[#17191C]" title={selectedEnquiry.email}>{selectedEnquiry.email}</span></span></a>
                          {selectedEnquiry.phone ? (
                            <a href={`tel:${selectedEnquiry.phone}`} className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#F7F7F8] px-3 py-2 transition-colors hover:bg-[#F0F0F2]"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E0A21A] text-[#17191C]"><Phone className="h-4 w-4" /></span><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Phone</span><span className="block truncate text-[12.5px] font-semibold text-[#17191C]">{selectedEnquiry.phone}</span></span></a>
                          ) : (
                            <div className="flex items-center gap-2.5 rounded-xl bg-[#F7F7F8] px-3 py-2 text-[12.5px] text-[#A1A1AA]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E4E4E7] text-[#A1A1AA]"><Phone className="h-4 w-4" /></span>No phone provided</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">{sug ? "Suggestion" : "Message"}</h4>
                      <div className="relative whitespace-pre-wrap rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] p-4 pl-5 text-[14px] leading-relaxed text-[#17191C]"><span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#C80808] to-[#E0A21A]" />{selectedEnquiry.message}</div>
                    </div>
                  </div>

                  <div className="space-y-5 border-t border-[#EEEEF0] bg-[#FAFAFB] p-6 sm:p-7 lg:col-span-2 lg:border-l lg:border-t-0">
                    <div>
                      <h4 className="mb-3 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">Workflow status</h4>
                      <ol className="relative space-y-1">
                        <span className="absolute bottom-4 left-[15px] top-4 w-0.5 bg-[#E4E4E7]" />
                        {ENQUIRY_STATUS_STEPS.map((step, idx) => {
                          const allowed = availableEnquiryStatuses.some((x) => x.value === step.value);
                          const active = statusInput === step.value;
                          const done = idx < curIdx;
                          return (
                            <li key={step.value} className="relative">
                              <button type="button" disabled={!allowed} onClick={() => setStatusInput(step.value)} className={`relative flex w-full items-center gap-3 rounded-xl px-1.5 py-2 text-left transition-colors ${active ? "bg-white shadow-sm ring-1 ring-[#E4E4E7]" : allowed ? "hover:bg-white" : "cursor-default"}`}>
                                <span className={`z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[12px] font-black ring-4 ring-[#FAFAFB] ${active ? STATUS_STYLE[step.value] : done ? "bg-emerald-600 text-white" : "bg-[#E4E4E7] text-[#71717A]"}`}>{done ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}</span>
                                <span className="min-w-0 flex-1"><span className={`block text-[13.5px] font-bold ${active ? "text-[#17191C]" : done ? "text-[#52525B]" : "text-[#3F3F46]"}`}>{step.label}</span><span className="block text-[11px] text-[#A1A1AA]">{active ? (idx === savedIdx ? "Current status" : "Will be saved") : done ? "Completed" : allowed ? "Click to set" : ""}</span></span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                    <div>
                      <h4 className="mb-2 flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]"><StickyNote className="h-3.5 w-3.5" />Internal notes</h4>
                      <textarea rows={4} value={notesInput} onChange={(e) => setNotesInput(e.target.value)} placeholder="Private notes about this message or the follow-up…" className="w-full resize-none rounded-xl border border-[#D8DDE2] bg-white px-3.5 py-2.5 text-[13.5px] text-[#17191C] outline-none transition placeholder:text-[#929DA7] focus:border-[#C80808] focus:ring-4 focus:ring-[#C80808]/10" />
                    </div>
                  </div>
                </div>
              </div>

              {/* footer */}
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#EEF0F3] bg-white px-6 py-3.5 sm:px-7">
                <div>
                  {deleteConfirmId === selectedEnquiry.id ? (
                    <div className="inline-flex items-center gap-2"><button onClick={() => handleDelete(selectedEnquiry.id)} className="rounded-xl bg-[#C80808] px-3.5 py-2 text-[12.5px] font-bold text-white hover:bg-[#8A0A0A]">Confirm delete</button><button onClick={() => setDeleteConfirmId(null)} className="px-2 text-[12.5px] font-semibold text-[#5F6871]">Cancel</button></div>
                  ) : (
                    <button onClick={() => setDeleteConfirmId(selectedEnquiry.id)} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#C80808] hover:underline"><Trash2 className="h-3.5 w-3.5" />Delete record</button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {saveSuccess && <span className="flex items-center gap-1 text-[12.5px] font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" />Saved</span>}
                  <button onClick={() => setSelectedEnquiry(null)} className="rounded-xl border-2 border-[#E7E9EE] px-4 py-2 text-[13px] font-bold text-[#17191C] transition-colors hover:border-[#17191C]">Close</button>
                  <button onClick={handleUpdate} disabled={updating} className="rounded-xl bg-gradient-to-r from-[#C80808] to-[#E0A21A] px-5 py-2 text-[13px] font-extrabold text-white shadow-[0_10px_24px_-8px_rgba(200,8,8,0.6)] transition-transform hover:-translate-y-0.5 disabled:opacity-60">{updating ? "Saving…" : "Save status & notes"}</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
