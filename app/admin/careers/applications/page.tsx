"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  AlertCircle,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FolderOpen,
  LayoutList,
  X,
  FileCheck,
  Building2,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";

interface Application {
  id: string;
  application_reference: string;
  job_id?: string;
  job_title?: string;
  full_name: string;
  phone: string;
  email: string;
  role_of_interest: string;
  experience: string;
  linkedin_url?: string;
  resume_original_name?: string;
  resume_file_size?: number;
  cover_note: string;
  status: string;
  submitted_at: string;
  job_slug?: string;
  notes_count?: number;
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

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [roles, setRoles] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // View mode: 'table' or 'resumes' (Resume Folder)
  const [viewMode, setViewMode] = useState<"table" | "resumes">("table");

  // In-app Resume Preview Modal
  const [previewApp, setPreviewApp] = useState<Application | null>(null);

  // Sync tab/view from URL search params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const tab = sp.get("tab") || sp.get("view");
      if (tab === "resumes" || tab === "resume") {
        setViewMode("resumes");
      }
    }
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: String(page),
        limit: viewMode === "resumes" ? "30" : "15",
      });
      if (search) query.set("search", search);
      if (statusFilter !== "all") query.set("status", statusFilter);
      if (roleFilter !== "all") query.set("role", roleFilter);

      const res = await fetch(`/api/admin/careers/applications?${query.toString()}`);
      const json = await res.json();
      if (json && json.success) {
        setApplications(json.applications || []);
        setTotal(json.pagination?.total ?? 0);
        setTotalPages(json.pagination?.totalPages ?? 1);

        // Collect distinct roles
        const distinct = Array.from(
          new Set(
            (json.applications || []).map(
              (a: Application) => a.role_of_interest || a.job_title
            )
          )
        ).filter(Boolean) as string[];
        if (distinct.length > 0) {
          setRoles((prev) => Array.from(new Set([...prev, ...distinct])));
        }
      }
    } catch (e) {
      console.error("Failed to fetch applications:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter, roleFilter, viewMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const handleExportExcel = () => {
    const query = new URLSearchParams({ format: "excel" });
    if (statusFilter !== "all") query.set("status", statusFilter);
    if (roleFilter !== "all") query.set("role", roleFilter);
    if (search.trim()) query.set("search", search.trim());
    window.location.href = `/api/admin/careers/applications/export?${query.toString()}`;
  };

  const handleExportPdf = () => {
    const query = new URLSearchParams({ format: "pdf", auto: "true" });
    if (statusFilter !== "all") query.set("status", statusFilter);
    if (roleFilter !== "all") query.set("role", roleFilter);
    if (search.trim()) query.set("search", search.trim());
    window.open(`/api/admin/careers/applications/export?${query.toString()}`, "_blank");
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
      case "Interview Scheduled":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Selected":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const resumesCount = applications.filter((a) => a.resume_original_name).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header with Excel & PDF downloads and Resume Folder option */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#929DA7]/20 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#929DA7] mb-1">
            <Link href="/admin/careers" className="hover:text-[#C80808]">
              Careers
            </Link>
            <span>/</span>
            <span className="text-[#17191C]">Candidate Applications</span>
          </div>
          <h1 className="text-2xl font-black text-[#17191C] tracking-tight">
            Applicant Submissions ({total})
          </h1>
          <p className="text-xs text-[#929DA7] mt-0.5">
            Review candidate resumes, preview CVs in browser, export records to Excel / PDF, and manage hiring stages.
          </p>
        </div>

        {/* Action Controls: View Switcher + Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl bg-[#F5F6F7] p-1 border border-[#D8DDE2]">
            <button
              type="button"
              onClick={() => {
                setViewMode("table");
                if (typeof window !== "undefined") {
                  window.history.replaceState(null, "", "/admin/careers/applications");
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-white text-[#17191C] shadow-sm ring-1 ring-black/5"
                  : "text-[#5F6871] hover:text-[#17191C]"
              }`}
            >
              <LayoutList className="w-4 h-4 text-[#C80808]" />
              <span>Applications List</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("resumes");
                if (typeof window !== "undefined") {
                  window.history.replaceState(null, "", "/admin/careers/applications?tab=resumes");
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "resumes"
                  ? "bg-white text-[#17191C] shadow-sm ring-1 ring-[#FFA028]/30"
                  : "text-[#5F6871] hover:text-[#17191C]"
              }`}
            >
              <FolderOpen className="w-4 h-4 text-[#FFA028]" />
              <span>Resume Folder</span>
              {total > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C80808] text-white">
                  {total}
                </span>
              )}
            </button>
          </div>

          {/* Export to Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-600/20"
            title="Download candidates data formatted for Microsoft Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>Download Excel</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C80808]/70 to-[#FFA028]/70 hover:opacity-95 text-white text-xs font-bold transition-colors shadow-md shadow-[#C80808]/20"
            title="Download printable PDF summary report"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#929DA7]/20 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#929DA7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or reference code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#929DA7]/20 text-xs text-[#17191C] placeholder:text-[#929DA7] focus:outline-none focus:border-[#C80808]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center gap-1 text-xs text-[#929DA7]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-[#929DA7]/20 rounded-xl px-2.5 py-1.5 text-xs text-[#17191C] bg-white focus:outline-none focus:border-[#C80808]"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Role filter */}
          {roles.length > 0 && (
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="border border-[#929DA7]/20 rounded-xl px-2.5 py-1.5 text-xs text-[#17191C] bg-white focus:outline-none focus:border-[#C80808]"
            >
              <option value="all">All Positions</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={fetchApplications}
            title="Refresh list"
            className="p-2 border border-[#929DA7]/20 rounded-xl hover:bg-[#F5F6F7] text-[#929DA7] hover:text-[#17191C] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: RESUME FOLDER VIEW */}
      {viewMode === "resumes" ? (
        <div className="space-y-4">
          <div className="bg-[#FFF8F0] p-4 rounded-2xl border border-[#FFA028]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFA028]/20 text-[#FFA028] flex items-center justify-center">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#17191C]">Candidate Resume Vault</h3>
                <p className="text-xs text-[#5F6871]">
                  Click &ldquo;Preview&rdquo; on any resume card to view the CV in browser, or &ldquo;Download&rdquo; to save directly.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#17191C] bg-white px-3 py-1 rounded-full border border-[#D8DDE2]">
              {applications.length} Resumes Ready
            </span>
          </div>

          {loading ? (
            <WorkspaceLoader compact />
          ) : applications.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-[#929DA7]/20 space-y-3">
              <FolderOpen className="w-12 h-12 text-[#929DA7]/40 mx-auto" />
              <h3 className="text-base font-bold text-[#17191C]">No resumes found</h3>
              <p className="text-xs text-[#929DA7] max-w-sm mx-auto">
                No resumes currently match your selected filters.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app) => {
                const isPdf = (app.resume_original_name || "").toLowerCase().endsWith(".pdf");
                const fileSizeKb = app.resume_file_size ? Math.round(app.resume_file_size / 1024) : 0;

                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-[#D8DDE2] p-5 shadow-sm hover:shadow-md hover:border-[#C80808] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar of Card */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isPdf
                                ? "bg-red-50 text-red-600 border border-red-200"
                                : "bg-blue-50 text-blue-600 border border-blue-200"
                            }`}
                          >
                            {isPdf ? "PDF" : "DOC"}
                          </span>
                          <div>
                            <span className="font-mono text-[10px] font-bold text-[#C80808] block">
                              {app.application_reference}
                            </span>
                            <span className="text-[11px] text-[#929DA7]">
                              {formatDateSafe(app.submitted_at)}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </div>

                      {/* Candidate Name & Role */}
                      <h4 className="text-base font-extrabold text-[#17191C] group-hover:text-[#C80808] transition-colors leading-tight mb-1">
                        {app.full_name}
                      </h4>
                      <p className="text-xs font-semibold text-[#5F6871] mb-2 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#FFA028]" />
                        {app.role_of_interest}
                      </p>

                      {/* File Details Box */}
                      <div className="p-2.5 rounded-xl bg-[#F5F6F7] border border-[#E7E9EE] text-[11px] text-[#5F6871] space-y-1 mb-4">
                        <div className="flex items-center gap-1.5 truncate">
                          <FileText className="w-3.5 h-3.5 text-[#C80808] shrink-0" />
                          <span className="truncate font-semibold text-[#17191C]">
                            {app.resume_original_name || "Resume document"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#929DA7] pt-1 border-t border-[#D8DDE2]/60">
                          <span>Size: {fileSizeKb > 0 ? `${fileSizeKb} KB` : "Attached"}</span>
                          <span>Exp: {app.experience || "Not stated"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-3 border-t border-[#F5F6F7] grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewApp(app)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#17191C] hover:bg-[#C80808] text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Resume</span>
                      </button>

                      <a
                        href={`/api/admin/careers/applications/${app.id}/cv`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#D8DDE2] hover:border-[#C80808] text-[#17191C] hover:text-[#C80808] text-xs font-bold hover:bg-[#F5F6F7] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#C80808]" />
                        <span>Download CV</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* VIEW MODE 2: TABLE VIEW */
        <div className="bg-white rounded-2xl border border-[#929DA7]/20 shadow-sm overflow-hidden">
          {loading ? (
            <WorkspaceLoader compact />
          ) : applications.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Users className="w-10 h-10 text-[#929DA7]/40 mx-auto" />
              <h3 className="text-base font-bold text-[#17191C]">No applications found</h3>
              <p className="text-xs text-[#929DA7] max-w-sm mx-auto">
                There are no candidate submissions matching your search or filters. Submissions from the public Careers form will appear here immediately.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#F5F6F7] bg-[#F5F6F7]/70 text-[#929DA7] uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Position &amp; Experience</th>
                    <th className="py-3 px-4">Resume / CV</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F6F7]">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-[#F5F6F7]/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C80808] text-xs">
                        {app.application_reference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-extrabold text-[#17191C] text-[13px] block">
                            {app.full_name}
                          </span>
                          <div className="flex items-center gap-2 text-[#929DA7] text-[11px] mt-0.5">
                            <span>{app.email}</span>
                            <span>•</span>
                            <span>{app.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-semibold text-[#17191C] block">
                            {app.role_of_interest}
                          </span>
                          <span className="text-[11px] text-[#929DA7] font-medium">
                            {app.experience}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewApp(app)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F5F6F7] hover:bg-[#C80808] hover:text-white text-[#17191C] border border-[#D8DDE2] text-[11px] font-bold transition-colors"
                            title="Preview resume in browser"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#C80808]" />
                            <span>Preview</span>
                          </button>
                          <a
                            href={`/api/admin/careers/applications/${app.id}/cv`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded-lg border border-[#D8DDE2] text-[#5F6871] hover:text-[#17191C] hover:bg-[#F5F6F7] transition"
                            title="Download file"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#929DA7] font-medium">
                        {formatDateSafe(app.submitted_at)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/careers/applications/${app.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#929DA7]/20 hover:border-[#C80808] text-xs font-bold text-[#17191C] hover:text-[#C80808] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#F5F6F7] flex items-center justify-between text-xs text-[#929DA7]">
              <span>
                Showing page {page} of {totalPages} ({total} applications)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-[#929DA7]/20 hover:bg-[#F5F6F7] disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-[#17191C]">{page}</span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-[#929DA7]/20 hover:bg-[#F5F6F7] disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* IN-APP RESUME PREVIEW MODAL */}
      {previewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-[fadeIn_.2s_ease]">
          <div className="bg-white rounded-3xl border border-[#D8DDE2] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-[scaleUp_.25s_ease]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#17191C] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C80808]/70 to-[#FFA028]/70 flex items-center justify-center text-white font-black text-sm">
                  {previewApp.full_name ? previewApp.full_name.charAt(0).toUpperCase() : "C"}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      {previewApp.full_name}
                    </h3>
                    <span className="font-mono text-xs text-[#FFA028] font-bold">
                      ({previewApp.application_reference})
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5">
                    {previewApp.role_of_interest} &bull; {previewApp.email} &bull; {previewApp.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href={`/api/admin/careers/applications/${previewApp.id}/cv?preview=true`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition"
                  title="Open PDF in a new browser tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                  <span>Open in Tab</span>
                </a>
                <a
                  href={`/api/admin/careers/applications/${previewApp.id}/cv`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition"
                >
                  <Download className="w-3.5 h-3.5 text-[#FFA028]" />
                  <span>Download CV</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewApp(null)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Preview Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F5F6F7]">
              {(previewApp.resume_original_name || "").toLowerCase().endsWith(".pdf") ? (
                <div className="w-full h-[620px] rounded-2xl overflow-hidden border border-[#D8DDE2] bg-white shadow-inner">
                  <iframe
                    src={`/api/admin/careers/applications/${previewApp.id}/cv?preview=true`}
                    title={`${previewApp.full_name} Resume`}
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="p-10 text-center bg-white rounded-2xl border border-[#D8DDE2] space-y-4 max-w-lg mx-auto my-8 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-[#17191C]">
                      {previewApp.resume_original_name || "Word Document (.docx / .doc)"}
                    </h4>
                    <p className="text-xs text-[#5F6871] mt-1">
                      Word documents cannot be directly rendered inline in standard web browsers. You can download and open this document with Microsoft Word or Google Docs.
                    </p>
                  </div>

                  {previewApp.cover_note && (
                    <div className="p-4 rounded-xl bg-[#F5F6F7] text-left border border-[#E7E9EE]">
                      <span className="text-[11px] font-bold text-[#929DA7] uppercase block mb-1">
                        Candidate Cover Note:
                      </span>
                      <p className="text-xs text-[#17191C] leading-relaxed">
                        {previewApp.cover_note}
                      </p>
                    </div>
                  )}

                  <a
                    href={`/api/admin/careers/applications/${previewApp.id}/cv`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C80808]/70 to-[#FFA028]/70 text-white text-xs font-bold shadow-md shadow-[#C80808]/20 hover:opacity-95 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {previewApp.resume_original_name || "Resume File"}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-[#D8DDE2] flex items-center justify-between text-xs">
              <span className="text-[#5F6871]">
                Status: <strong className="text-[#17191C]">{previewApp.status}</strong> &bull; Experience:{" "}
                <strong className="text-[#17191C]">{previewApp.experience}</strong>
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/careers/applications/${previewApp.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17191C] text-white font-bold hover:bg-[#C80808] transition"
                >
                  <span>Candidate Evaluation &amp; Notes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
