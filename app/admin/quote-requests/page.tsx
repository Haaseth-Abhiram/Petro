"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Search,
  Filter,
  Phone,
  Building2,
  Calendar,
  Clock,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FileText,
  DollarSign,
  MapPin,
} from "lucide-react";

const RFQ_STATUS_STEPS = [
  { value: "new", label: "New (Pending Review)" },
  { value: "under_review", label: "Under Review / TBE" },
  { value: "awaiting_info", label: "Awaiting Client Info" },
  { value: "quoted", label: "Quotation Sent (Quoted)" },
  { value: "completed", label: "Completed / Won" },
  { value: "rejected", label: "Rejected / Closed" },
];

export default function AdminQuoteRequestsPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      if (json.success) setRfqs(json.quoteRequests);
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
      const res = await fetch(`/api/admin/quote-requests?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        if (selectedRfq?.id === id) setSelectedRfq(null);
        setDeleteConfirmId(null);
        fetchRfqs();
      }
    } catch (e) {}
  };

  let availableRfqStatuses = RFQ_STATUS_STEPS;
  const isRejectedState = selectedRfq?.status === "rejected" || statusInput === "rejected";
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
    availableRfqStatuses = RFQ_STATUS_STEPS.filter(
      (step, idx) => idx >= Math.max(0, currentStatusIndex)
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17191C]">
            Request for Quotation (RFQ) Submissions
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6871]">
            Engineering procurement enquiries, line specifications, and quotation workflows.
          </p>
        </div>

        <button
          onClick={fetchRfqs}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs font-semibold text-[#5F6871] hover:text-[#17191C] hover:bg-white self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh RFQs</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#D8DDE2] shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#929DA7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company, product name, contact name, or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D8DDE2] text-xs sm:text-sm focus:border-[#C80808] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: "all", label: "All RFQs" },
            { id: "new", label: "New" },
            { id: "resubmitted", label: "Resubmitted" },
            { id: "under_review", label: "Under Review" },
            { id: "awaiting_info", label: "Awaiting Info" },
            { id: "quoted", label: "Quoted" },
            { id: "completed", label: "Completed" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
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

      {/* RFQ Table */}
      <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6F7] border-b border-[#D8DDE2] text-[#5F6871] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Company & Client</th>
                <th className="py-3.5 px-4">Requested Product & Category</th>
                <th className="py-3.5 px-4">Quantity / Unit</th>
                <th className="py-3.5 px-4">Delivery Timeline</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DDE2]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#5F6871]">
                    <div className="w-6 h-6 border-2 border-[#C80808] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading quotation requests...</span>
                  </td>
                </tr>
              ) : rfqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#5F6871]">
                    No RFQ requests found matching your filters.
                  </td>
                </tr>
              ) : (
                rfqs.map((rfq) => (
                  <tr
                    key={rfq.id}
                    onClick={() => handleOpenDetail(rfq)}
                    className="hover:bg-[#F5F6F7]/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#17191C] truncate max-w-[200px]">
                        {rfq.company_name}
                      </p>
                      <p className="text-[11px] text-[#5F6871] truncate max-w-[200px]">
                        {rfq.full_name} ({rfq.email})
                      </p>
                      {rfq.industry && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-[#F5F6F7] text-[10px] text-[#929DA7] border border-[#D8DDE2] mt-0.5">
                          {rfq.industry}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#17191C] truncate max-w-[260px]">
                        {rfq.product_name}
                      </p>
                      <p className="text-[#5F6871] text-[11px] truncate max-w-[260px]">
                        {rfq.product_category || "General"}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-[#17191C] font-semibold">
                      {rfq.quantity ? `${rfq.quantity} ${rfq.unit_of_measurement || "Pcs"}` : "—"}
                    </td>

                    <td className="py-3.5 px-4 text-[#5F6871]">
                      <p className="truncate max-w-[160px]">
                        {rfq.required_delivery_date || "Standard Lead Time"}
                      </p>
                      {rfq.delivery_location && (
                        <p className="text-[10px] text-[#929DA7] truncate max-w-[160px]">
                          Loc: {rfq.delivery_location}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          rfq.status === "new"
                            ? "bg-[#C80808] text-white"
                            : rfq.status === "resubmitted"
                            ? "bg-[#17191C] text-[#C80808] border border-[#C80808]/30"
                            : rfq.status === "under_review"
                            ? "bg-amber-100 text-amber-800"
                            : rfq.status === "awaiting_info"
                            ? "bg-orange-100 text-orange-800"
                            : rfq.status === "quoted"
                            ? "bg-emerald-100 text-emerald-800"
                            : rfq.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : rfq.status === "rejected"
                            ? "bg-gray-200 text-[#5F6871]"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {rfq.status === "under_review"
                          ? "Under Review"
                          : rfq.status === "awaiting_info"
                          ? "Awaiting Info"
                          : rfq.status === "resubmitted"
                          ? "Resubmitted"
                          : rfq.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(rfq);
                        }}
                        className="px-2.5 py-1 rounded bg-[#F5F6F7] hover:bg-[#17191C] hover:text-white text-[#17191C] font-semibold text-[11px] transition-colors"
                      >
                        Review RFQ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#D8DDE2] shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#D8DDE2] flex items-center justify-between bg-[#F5F6F7]/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C80808]">
                  Quotation Specification Docket
                </span>
                <h3 className="text-lg font-bold text-[#17191C]">
                  {selectedRfq.product_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRfq(null)}
                className="p-1.5 text-[#929DA7] hover:text-[#17191C] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Client & Product Summary Grid */}
              <div className="p-4 rounded-xl bg-[#F5F6F7] border border-[#D8DDE2] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Company:</span>
                  <span className="font-bold text-[#17191C] text-sm">{selectedRfq.company_name}</span>
                </div>
                <div>
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Contact Person:</span>
                  <span className="font-bold text-[#17191C] text-sm">{selectedRfq.full_name}</span>
                </div>
                <div>
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Email:</span>
                  <a
                    href={`mailto:${selectedRfq.email}?subject=Petro Engineering Quotation - ${selectedRfq.product_name}`}
                    className="font-bold text-[#C80808] hover:underline flex items-center gap-1"
                  >
                    <span>{selectedRfq.email}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Phone:</span>
                  <span className="font-semibold text-[#17191C]">{selectedRfq.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Industry Sector:</span>
                  <span className="font-semibold text-[#17191C]">{selectedRfq.industry || "General"}</span>
                </div>
                <div>
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Quantity Required:</span>
                  <span className="font-bold text-[#17191C] text-sm">
                    {selectedRfq.quantity || "—"} {selectedRfq.unit_of_measurement || "Pcs"}
                  </span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-2">
                  Client Technical Specifications & Parameters
                </label>
                <div className="p-4 rounded-xl bg-white border border-[#D8DDE2] text-xs text-[#17191C] leading-relaxed whitespace-pre-wrap font-mono">
                  {selectedRfq.technical_specifications || "No detailed technical specifications provided."}
                </div>
              </div>

              {/* Delivery and Additional Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Delivery Location:</span>
                  <span className="font-semibold text-[#17191C]">{selectedRfq.delivery_location || "Not specified"}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
                  <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Target Delivery Date:</span>
                  <span className="font-semibold text-[#17191C]">{selectedRfq.required_delivery_date || "Not specified"}</span>
                </div>
              </div>

              {selectedRfq.additional_comments && (
                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    Additional Comments
                  </label>
                  <p className="text-xs text-[#5F6871] p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
                    {selectedRfq.additional_comments}
                  </p>
                </div>
              )}

              {/* Workflow Status & Quoted Amount */}
              <div className="p-4 rounded-xl bg-white border-2 border-[#C80808]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-[#17191C] tracking-wider">
                    Procurement Desk Processing
                  </h4>
                  {selectedRfq.status === "rejected" && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      Currently Rejected / Closed
                    </span>
                  )}
                </div>

                {selectedRfq.status === "rejected" && (
                  <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <p className="text-xs font-bold text-[#17191C]">Need to Resubmit or Reopen this RFQ?</p>
                      <p className="text-[11px] text-[#5F6871]">Set this specification docket back to active procurement review.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStatusInput("resubmitted")}
                      className="px-3 py-1.5 rounded-lg bg-[#C80808] hover:bg-[#8A0A0A] text-white text-xs font-bold whitespace-nowrap self-start sm:self-auto transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Resubmit RFQ</span>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                      Status
                    </label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs font-bold outline-none focus:border-[#C80808]"
                    >
                      {availableRfqStatuses.map((step) => (
                        <option key={step.value} value={step.value}>
                          {step.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                      Quoted Price Amount ($ / ₹)
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 18500"
                      value={quoteAmountInput}
                      onChange={(e) => setQuoteAmountInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs font-semibold outline-none focus:border-[#C80808]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    Internal Procurement Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Factory lead times, MTC requirements, margin calculations..."
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none focus:border-[#C80808]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#D8DDE2] flex items-center justify-between">
                <div>
                  {deleteConfirmId === selectedRfq.id ? (
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(selectedRfq.id)}
                        className="px-3 py-1.5 rounded bg-red-600 text-white font-bold text-xs"
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
                      onClick={() => setDeleteConfirmId(selectedRfq.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete RFQ</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Updated successfully!</span>
                    </span>
                  )}
                  <button
                    onClick={() => setSelectedRfq(null)}
                    className="px-4 py-2 rounded-lg border border-[#D8DDE2] text-xs font-bold text-[#5F6871] hover:bg-[#F5F6F7]"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="px-5 py-2 rounded-lg bg-[#C80808] hover:bg-[#8A0A0A] text-white text-xs font-bold shadow-sm disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Update RFQ Status"}
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
