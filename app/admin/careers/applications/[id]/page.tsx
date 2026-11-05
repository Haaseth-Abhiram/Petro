"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";

import { ModalFrame } from "@/components/admin/Modal";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  MessageSquare,
  ShieldCheck,
  Send,
  UserCheck,
  Plus,
} from "lucide-react";

interface ApplicationDetail {
  id: string;
  application_reference: string;
  job_id?: string;
  job_title?: string;
  job_slug?: string;
  job_department?: string;
  full_name: string;
  phone: string;
  email: string;
  role_of_interest: string;
  experience: string;
  linkedin_url?: string;
  resume_storage_path?: string;
  resume_original_name?: string;
  resume_file_size?: number;
  cover_note: string;
  status: string;
  submitted_at: string;
  updated_at: string;
}

interface Note {
  id: string;
  admin_name: string;
  admin_email: string;
  note: string;
  created_at: string;
}

interface HistoryItem {
  id: string;
  previous_status?: string | null;
  new_status: string;
  changed_by: string;
  note?: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  "New",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
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

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status Update Modal / State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Add Note State
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/careers/applications/${id}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Could not retrieve candidate record.");
      }
      setApplication(json.application);
      setNotes(json.notes || []);
      setHistory(json.history || []);
      setSelectedStatus(json.application.status);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load candidate application.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/careers/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          note: statusNote || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update status.");
      }
      setStatusModalOpen(false);
      setStatusNote("");
      fetchDetail();
    } catch (err: any) {
      alert(err.message || "Failed to update candidate status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/careers/applications/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to add note.");
      }
      setNewNote("");
      fetchDetail();
    } catch (err: any) {
      alert(err.message || "Failed to add note.");
    } finally {
      setAddingNote(false);
    }
  };

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
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <WorkspaceLoader />
    );
  }

  if (error || !application) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-[#929DA7]/20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-black text-[#17191C]">Application Not Found</h2>
        <p className="text-xs text-[#929DA7]">{error || "Could not find this candidate record."}</p>
        <Link
          href="/admin/careers/applications"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C80808] text-white text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/careers/applications"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#929DA7] hover:text-[#C80808] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Candidate Applications</span>
        </Link>

        <span className="text-xs font-mono font-bold text-[#929DA7]">
          Reference: <strong className="text-[#C80808]">{application.application_reference}</strong>
        </span>
      </div>

      {/* Candidate Profile Header Card */}
      <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#17191C] to-[#2A2E34] text-white flex items-center justify-center text-xl font-black shrink-0">
              {application.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-[#17191C]">{application.full_name}</h1>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </div>
              <p className="text-xs font-bold text-[#C80808] mt-0.5">
                Applied for {application.role_of_interest} • {application.experience} experience
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#929DA7] mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#17191C]" />
                  <a href={`mailto:${application.email}`} className="hover:underline text-[#17191C]">
                    {application.email}
                  </a>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#17191C]" />
                  <a href={`tel:${application.phone}`} className="hover:underline text-[#17191C]">
                    {application.phone}
                  </a>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Submitted {formatDateSafe(application.submitted_at)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedStatus(application.status);
                setStatusModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#17191C] hover:bg-[#2A2E34] text-white text-xs font-bold transition-colors"
            >
              <UserCheck className="w-4 h-4 text-[#FFA028]" />
              <span>Update Status</span>
            </button>

            <a
              href={`/api/admin/careers/applications/${application.id}/cv`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C80808] hover:bg-[#FFA028] text-white text-xs font-bold shadow-md shadow-[#C80808]/25 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Details (Left) + Notes and Status History (Right) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Candidate Info & Cover Note */}
        <div className="lg:col-span-7 space-y-6">
          {/* Submission Details */}
          <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#17191C] border-b border-[#F5F6F7] pb-3">
              Application Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-[#929DA7] font-bold">Applied Role</span>
                <span className="font-extrabold text-[#17191C] text-sm mt-0.5 block">
                  {application.role_of_interest}
                </span>
              </div>
              <div>
                <span className="block text-[#929DA7] font-bold">Experience Level</span>
                <span className="font-extrabold text-[#17191C] text-sm mt-0.5 block">
                  {application.experience}
                </span>
              </div>
              <div>
                <span className="block text-[#929DA7] font-bold">Email Address</span>
                <span className="font-semibold text-[#17191C] text-xs mt-0.5 block">
                  {application.email}
                </span>
              </div>
              <div>
                <span className="block text-[#929DA7] font-bold">Phone Number</span>
                <span className="font-semibold text-[#17191C] text-xs mt-0.5 block">
                  {application.phone}
                </span>
              </div>
            </div>

            {application.linkedin_url && (
              <div className="pt-2 border-t border-[#F5F6F7]">
                <span className="block text-[11px] font-bold text-[#929DA7] mb-1">
                  LinkedIn / Portfolio Link
                </span>
                <a
                  href={application.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C80808] hover:underline"
                >
                  <span>{application.linkedin_url}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="pt-2 border-t border-[#F5F6F7]">
              <span className="block text-[11px] font-bold text-[#929DA7] mb-2">
                Attached Resume / CV File
              </span>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5F6F7] border border-[#929DA7]/15">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#C80808] text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-[#17191C] truncate">
                      {application.resume_original_name || "candidate_resume.pdf"}
                    </span>
                    <span className="block text-[10px] text-[#929DA7]">
                      {application.resume_file_size
                        ? `${Math.round(application.resume_file_size / 1024)} KB`
                        : "Uploaded Document"}
                    </span>
                  </div>
                </div>

                <a
                  href={`/api/admin/careers/applications/${application.id}/cv`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#929DA7]/20 text-xs font-bold text-[#17191C] hover:border-[#C80808] hover:text-[#C80808] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>

          {/* Cover Note / About You */}
          <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-[#17191C] border-b border-[#F5F6F7] pb-3 mb-3">
              Candidate Cover Note / Introduction
            </h2>
            <div className="rounded-xl bg-[#F5F6F7] p-4 text-xs text-[#17191C] leading-relaxed whitespace-pre-wrap">
              {application.cover_note || "No additional cover note was provided by the candidate."}
            </div>
          </div>
        </div>

        {/* Right Column: Internal Recruiter Notes & Status Audit Trail */}
        <div className="lg:col-span-5 space-y-6">
          {/* Add Recruiter Note */}
          <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#17191C] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#C80808]" />
              <span>Internal Recruiter Notes</span>
            </h2>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                required
                rows={3}
                placeholder="Add confidential feedback, interview scheduling notes, or salary expectations..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full rounded-xl border border-[#929DA7]/30 p-3 text-xs text-[#17191C] focus:outline-none focus:border-[#C80808]"
              />
              <button
                type="submit"
                disabled={addingNote || !newNote.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17191C] hover:bg-[#2A2E34] text-white text-xs font-bold disabled:opacity-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{addingNote ? "Saving…" : "Post Note"}</span>
              </button>
            </form>

            {/* Notes List */}
            {notes.length === 0 ? (
              <p className="text-xs text-[#929DA7] py-3 text-center border-t border-[#F5F6F7]">
                No internal notes recorded yet.
              </p>
            ) : (
              <div className="space-y-3 pt-3 border-t border-[#F5F6F7]">
                {notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-[#F5F6F7] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#929DA7]">
                      <span className="font-bold text-[#17191C]">{n.admin_name || n.admin_email}</span>
                      <span>{formatDateSafe(n.created_at)}</span>
                    </div>
                    <p className="text-[#17191C] leading-relaxed whitespace-pre-wrap">{n.note}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Change Audit Trail */}
          <div className="bg-white rounded-2xl border border-[#929DA7]/20 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#17191C] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFA028]" />
              <span>Status Audit History</span>
            </h2>

            {history.length === 0 ? (
              <p className="text-xs text-[#929DA7] py-3 text-center">No status changes logged.</p>
            ) : (
              <div className="relative border-l-2 border-[#F5F6F7] ml-3 space-y-4 py-1">
                {history.map((h) => (
                  <div key={h.id} className="relative pl-5 text-xs">
                    <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#C80808]" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[#17191C]">{h.new_status}</span>
                      {h.previous_status && (
                        <span className="text-[10px] text-[#929DA7]">(from {h.previous_status})</span>
                      )}
                    </div>
                    {h.note && (
                      <p className="text-[#929DA7] text-[11px] mt-0.5 leading-snug">{h.note}</p>
                    )}
                    <span className="text-[10px] text-[#929DA7] block mt-1">
                      By {h.changed_by} • {formatDateSafe(h.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {statusModalOpen && (
        <ModalFrame onClose={() => setStatusModalOpen(false)} eyebrow="Recruitment workflow" title="Change candidate status" subtitle={<>Current status: <b>{application.status}</b></>} size="md">
        <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">New Status *</label>
                <select
                  required
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-xl border border-[#929DA7]/30 p-2.5 text-xs text-[#17191C] bg-white font-semibold focus:outline-none focus:border-[#C80808]"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Reason / Audit Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Cleared technical round, scheduled round 2 interview..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full rounded-xl border border-[#929DA7]/30 p-2.5 text-xs text-[#17191C] focus:outline-none focus:border-[#C80808]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F5F6F7]">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#929DA7]/30 text-xs font-bold text-[#17191C] hover:bg-[#F5F6F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStatus || selectedStatus === application.status}
                  className="px-4 py-2 rounded-xl bg-[#C80808] hover:bg-[#FFA028] text-white text-xs font-bold disabled:opacity-50 transition-colors"
                >
                  {updatingStatus ? "Saving…" : "Confirm Status Change"}
                </button>
              </div>
            </form>
      </ModalFrame>
      )}
    </div>
  );
}
