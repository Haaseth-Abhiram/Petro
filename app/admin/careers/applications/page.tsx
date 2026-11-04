"use client";

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

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: String(page),
        limit: "15",
      });
      if (search) query.set("search", search);
      if (statusFilter !== "all") query.set("status", statusFilter);
      if (roleFilter !== "all") query.set("role", roleFilter);

      const res = await fetch(`/api/admin/careers/applications?${query.toString()}`);
      const json = await res.json();
      if (json.success) {
        setApplications(json.applications || []);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);

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
  }, [page, statusFilter, roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#929DA7]/20 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#929DA7] mb-1">
            <Link href="/admin/careers" className="hover:text-[#FF4B32]">
              Careers
            </Link>
            <span>/</span>
            <span className="text-[#17191C]">Candidate Applications</span>
          </div>
          <h1 className="text-2xl font-black text-[#17191C] tracking-tight">
            Applicant Submissions ({total})
          </h1>
          <p className="text-xs text-[#929DA7] mt-0.5">
            Review candidate resumes, download CVs, record interview notes, and manage hiring statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/careers/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#929DA7]/20 hover:border-[#FF4B32] text-xs font-bold text-[#17191C] hover:text-[#FF4B32] transition-colors"
          >
            <span>Recruitment Analytics</span>
          </Link>
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
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#929DA7]/20 text-xs text-[#17191C] placeholder:text-[#929DA7] focus:outline-none focus:border-[#FF4B32]"
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
              className="border border-[#929DA7]/20 rounded-xl px-2.5 py-1.5 text-xs text-[#17191C] bg-white focus:outline-none focus:border-[#FF4B32]"
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
              className="border border-[#929DA7]/20 rounded-xl px-2.5 py-1.5 text-xs text-[#17191C] bg-white focus:outline-none focus:border-[#FF4B32]"
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

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-[#929DA7]/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-[#FF4B32] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#929DA7]">Loading applicant records…</p>
          </div>
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
                <tr className="border-b border-[#F5F6F7] bg-[#F5F6F7]/50 text-[#929DA7] uppercase font-bold text-[10px] tracking-wider">
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
                    <td className="py-3.5 px-4 font-mono font-bold text-[#FF4B32] text-xs">
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
                      <a
                        href={`/api/admin/careers/applications/${app.id}/cv`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#929DA7]/20 hover:border-[#FF4B32] hover:text-[#FF4B32] text-[11px] font-semibold transition-colors"
                        title="Download CV securely"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#FF4B32]" />
                        <span className="max-w-[120px] truncate">
                          {app.resume_original_name || "Resume"}
                        </span>
                        <Download className="w-3 h-3 text-[#929DA7]" />
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-[#929DA7] font-medium">
                      {new Date(app.submitted_at).toLocaleDateString()}
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#929DA7]/20 hover:border-[#FF4B32] text-xs font-bold text-[#17191C] hover:text-[#FF4B32] transition-colors"
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
    </div>
  );
}
