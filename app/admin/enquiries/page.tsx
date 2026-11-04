"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Search,
  Filter,
  Phone,
  Building2,
  Calendar,
  Clock,
  Trash2,
  X,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

const ENQUIRY_STATUS_STEPS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "responded", label: "Responded" },
  { value: "closed", label: "Closed" },
];

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

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "enquiries" | "suggestions">("all");
  const [counts, setCounts] = useState({ total: 0, enquiries: 0, suggestions: 0 });

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
  };

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedEnquiry.id,
          status: statusInput,
          internal_notes: notesInput,
        }),
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
      const res = await fetch(`/api/admin/enquiries?id=${id}`, {
        method: "DELETE",
      });
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
  const availableEnquiryStatuses = ENQUIRY_STATUS_STEPS.filter(
    (step, idx) => idx >= Math.max(0, currentStatusIndex)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17191C]">
            Enquiries &amp; Suggestions
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6871]">
            Direct customer inquiries and website visitor suggestions submitted from the public site.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#D8DDE2] text-xs font-semibold text-[#5F6871] hover:text-[#17191C] hover:bg-white transition self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Primary Category Switcher: All | Enquiries | Suggestions */}
      <div className="flex flex-wrap items-center gap-2.5 bg-white p-2.5 rounded-2xl border border-[#D8DDE2] shadow-sm">
        <button
          type="button"
          onClick={() => setTypeFilter("all")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            typeFilter === "all"
              ? "bg-[#17191C] text-white shadow-sm"
              : "text-[#5F6871] hover:text-[#17191C] hover:bg-[#F5F6F7]"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>All Messages</span>
          {counts.total > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                typeFilter === "all" ? "bg-white/20 text-white" : "bg-[#17191C]/10 text-[#17191C]"
              }`}
            >
              {counts.total}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTypeFilter("enquiries")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            typeFilter === "enquiries"
              ? "bg-[#FF4B32] text-white shadow-sm shadow-[#FF4B32]/25"
              : "text-[#5F6871] hover:text-[#17191C] hover:bg-[#F5F6F7]"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Contact Enquiries</span>
          {counts.enquiries > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                typeFilter === "enquiries" ? "bg-white/20 text-white" : "bg-[#17191C]/10 text-[#17191C]"
              }`}
            >
              {counts.enquiries}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTypeFilter("suggestions")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            typeFilter === "suggestions"
              ? "bg-gradient-to-r from-[#FFA028] to-[#FF4B32] text-white shadow-sm shadow-[#FFA028]/25"
              : "text-[#5F6871] hover:text-[#17191C] hover:bg-[#FFF8F0]"
          }`}
        >
          <Lightbulb className="w-4 h-4 text-[#FFA028] group-hover:text-white" />
          <span>Website Suggestions</span>
          {counts.suggestions > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                typeFilter === "suggestions" ? "bg-white/25 text-white" : "bg-[#FFA028] text-white"
              }`}
            >
              {counts.suggestions}
            </span>
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#D8DDE2] shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#929DA7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sender name, company, email, subject, or message text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8DDE2] text-xs sm:text-sm focus:border-[#FF4B32] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: "all", label: "All Statuses" },
            { id: "new", label: "New" },
            { id: "in_progress", label: "In Progress" },
            { id: "responded", label: "Responded" },
            { id: "closed", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-[#17191C] text-white"
                  : "bg-[#F5F6F7] text-[#5F6871] hover:text-[#17191C]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries & Suggestions Table */}
      <div className="bg-white rounded-2xl border border-[#D8DDE2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6F7] border-b border-[#D8DDE2] text-[#5F6871] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Sender &amp; Contact</th>
                <th className="py-3.5 px-4">Subject &amp; Message Preview</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DDE2]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#5F6871]">
                    <div className="w-7 h-7 border-3 border-[#FF4B32] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span className="text-xs font-semibold">Loading records…</span>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#5F6871]">
                    <div className="max-w-sm mx-auto space-y-1.5">
                      {typeFilter === "suggestions" ? (
                        <>
                          <Lightbulb className="w-8 h-8 text-[#FFA028] mx-auto mb-1 opacity-70" />
                          <p className="font-bold text-[#17191C]">No website suggestions recorded</p>
                          <p className="text-[11px] text-[#929DA7]">
                            Suggestions submitted by visitors via the footer popup on the public website will appear here.
                          </p>
                        </>
                      ) : (
                        <>
                          <Mail className="w-8 h-8 text-[#929DA7] mx-auto mb-1 opacity-60" />
                          <p className="font-bold text-[#17191C]">No enquiries found in database</p>
                          <p className="text-[11px] text-[#929DA7]">
                            Messages submitted through public contact forms will display here in real time.
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => {
                  const isSuggestion =
                    (enq.subject || "").toLowerCase().includes("suggestion") ||
                    (enq.subject || "").toLowerCase().includes("feedback") ||
                    (enq.message || "").toLowerCase().includes("suggestion");

                  return (
                    <tr
                      key={enq.id}
                      onClick={() => handleOpenDetail(enq)}
                      className={`hover:bg-[#F5F6F7]/70 cursor-pointer transition-colors ${
                        isSuggestion ? "bg-amber-50/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        {isSuggestion ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                            <Lightbulb className="w-3 h-3 text-[#FFA028]" />
                            <span>Suggestion</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                            <Mail className="w-2.5 h-2.5 text-blue-500" />
                            <span>Enquiry</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#17191C] truncate max-w-[200px]">
                          {enq.full_name}
                        </p>
                        {enq.company_name ? (
                          <p className="text-[11px] text-[#5F6871] truncate max-w-[200px]">
                            {enq.company_name}
                          </p>
                        ) : isSuggestion ? (
                          <p className="text-[10px] text-[#FFA028] font-semibold">Website Visitor</p>
                        ) : null}
                        <p className="text-[11px] text-[#929DA7] truncate max-w-[200px]">
                          {enq.email}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#17191C] truncate max-w-[340px]">
                          {enq.subject}
                        </p>
                        <p className="text-[#5F6871] text-[11px] truncate max-w-[340px] mt-0.5">
                          {enq.message}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-[#5F6871] whitespace-nowrap">
                        {formatDateSafe(enq.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            enq.status === "new"
                              ? "bg-[#FF4B32] text-white"
                              : enq.status === "in_progress"
                              ? "bg-amber-100 text-amber-800"
                              : enq.status === "responded"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(enq);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#F5F6F7] hover:bg-[#17191C] hover:text-white text-[#17191C] font-semibold text-[11px] border border-[#D8DDE2] transition-colors"
                        >
                          View &amp; Notes
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Drawer / Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#D8DDE2] shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#D8DDE2] flex items-center justify-between bg-[#F5F6F7]/50">
              <div>
                {(selectedEnquiry.subject || "").toLowerCase().includes("suggestion") ||
                (selectedEnquiry.subject || "").toLowerCase().includes("feedback") ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFA028] flex items-center gap-1.5 mb-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Website User Suggestion
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4B32] block mb-0.5">
                    Customer Contact Enquiry
                  </span>
                )}
                <h3 className="text-lg font-bold text-[#17191C]">
                  {selectedEnquiry.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-[#929DA7] hover:text-[#17191C] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Sender Info Card */}
              <div className="p-4 rounded-2xl bg-[#F5F6F7] border border-[#D8DDE2] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Contact Name:</span>
                  <span className="font-bold text-[#17191C] text-sm">{selectedEnquiry.full_name}</span>
                </div>
                <div>
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Company / Context:</span>
                  <span className="font-bold text-[#17191C] text-sm">{selectedEnquiry.company_name || "Direct Website Submission"}</span>
                </div>
                <div>
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Email Address:</span>
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=RE: ${selectedEnquiry.subject}`}
                    className="font-bold text-[#FF4B32] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{selectedEnquiry.email}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Phone:</span>
                  {selectedEnquiry.phone ? (
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="font-bold text-[#17191C] hover:text-[#FF4B32] flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3 text-[#FF4B32]" />
                      <span>{selectedEnquiry.phone}</span>
                    </a>
                  ) : (
                    <span className="text-[#5F6871]">Not provided</span>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-2">
                  {(selectedEnquiry.subject || "").toLowerCase().includes("suggestion") ? "Suggestion Message" : "Client Message"}
                </label>
                <div className="p-4 rounded-2xl bg-white border border-[#D8DDE2] text-xs text-[#17191C] leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status and Notes Control */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#D8DDE2]">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    Update Workflow Status
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8DDE2] text-xs font-bold outline-none focus:border-[#FF4B32]"
                  >
                    {availableEnquiryStatuses.map((step) => (
                      <option key={step.value} value={step.value}>
                        {step.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    Received Date
                  </label>
                  <p className="text-xs text-[#5F6871] pt-2">
                    {formatDateSafe(selectedEnquiry.created_at)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                  Internal Administrative Notes
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Private internal notes regarding this submission or follow-up action..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D8DDE2] text-xs outline-none focus:border-[#FF4B32]"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#D8DDE2] flex items-center justify-between">
                <div>
                  {deleteConfirmId === selectedEnquiry.id ? (
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(selectedEnquiry.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 text-xs text-[#5F6871]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(selectedEnquiry.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Record</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Saved successfully!</span>
                    </span>
                  )}
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-4 py-2 rounded-xl border border-[#D8DDE2] text-xs font-bold text-[#5F6871] hover:bg-[#F5F6F7]"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="px-5 py-2 rounded-xl bg-[#FF4B32] hover:bg-[#E03820] text-white text-xs font-bold shadow-sm disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Save Status & Notes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
