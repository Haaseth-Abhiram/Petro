"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Calendar,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  X,
  Save,
} from "lucide-react";

interface Job {
  id: string;
  role: string;
  title: string;
  slug: string;
  department: string;
  category_id?: string;
  category_name?: string;
  location: string;
  employment_type: string;
  experience: string;
  short_description: string;
  description?: string;
  responsibilities: string[];
  qualifications: string[];
  required_skills: string[];
  optional_skills: string[];
  image: string;
  display_order: number;
  application_deadline?: string | null;
  status: "published" | "draft" | "closed";
  created_at: string;
  updated_at: string;
  application_count?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function JobManagementPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    role: "",
    title: "",
    slug: "",
    department: "Engineering",
    categoryId: "",
    location: "Mumbai, India",
    employmentType: "Full-time",
    experience: "2+ years",
    shortDescription: "",
    description: "",
    responsibilitiesText: "",
    qualificationsText: "",
    requiredSkillsText: "",
    optionalSkillsText: "",
    image: "/assets/img/tube-fittings.jpg",
    displayOrder: 0,
    applicationDeadline: "",
    status: "published" as "published" | "draft" | "closed",
  });

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (statusFilter !== "all") query.set("status", statusFilter);
      if (deptFilter !== "all") query.set("department", deptFilter);

      const [jobsRes, catsRes] = await Promise.all([
        fetch(`/api/admin/careers/jobs?${query.toString()}`).then((r) => r.json()),
        fetch("/api/admin/careers/categories").then((r) => r.json()),
      ]);

      if (jobsRes.success) setJobs(jobsRes.jobs);
      if (catsRes.success) setCategories(catsRes.categories);
    } catch (e) {
      console.error("Failed to fetch jobs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, deptFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const openAddModal = () => {
    setEditingJob(null);
    setModalError(null);
    setFormData({
      role: "",
      title: "",
      slug: "",
      department: "Engineering",
      categoryId: categories[0]?.id || "",
      location: "Mumbai, India",
      employmentType: "Full-time",
      experience: "2+ years",
      shortDescription: "",
      description: "",
      responsibilitiesText: "Review RFQs, engineering datasheets and P&IDs\nSource from approved manufacturers\nPrepare technical bid evaluations",
      qualificationsText: "B.Tech / B.E. in relevant engineering discipline\nMinimum 2 years of industrial experience",
      requiredSkillsText: "Technical Specification Review, Vendor Evaluation, Commercial Negotiation",
      optionalSkillsText: "ERP / CRM Systems, Export Logistics",
      image: "/assets/img/tube-fittings.jpg",
      displayOrder: jobs.length + 1,
      applicationDeadline: "",
      status: "published",
    });
    setModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setModalError(null);
    setFormData({
      role: job.role,
      title: job.title,
      slug: job.slug,
      department: job.department,
      categoryId: job.category_id || "",
      location: job.location,
      employmentType: job.employment_type,
      experience: job.experience,
      shortDescription: job.short_description,
      description: job.description || job.short_description,
      responsibilitiesText: (job.responsibilities || []).join("\n"),
      qualificationsText: (job.qualifications || []).join("\n"),
      requiredSkillsText: (job.required_skills || []).join(", "),
      optionalSkillsText: (job.optional_skills || []).join(", "),
      image: job.image || "/assets/img/tube-fittings.jpg",
      displayOrder: job.display_order || 0,
      applicationDeadline: job.application_deadline
        ? new Date(job.application_deadline).toISOString().split("T")[0]
        : "",
      status: job.status,
    });
    setModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);

    try {
      const responsibilities = formData.responsibilitiesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const qualifications = formData.qualificationsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const requiredSkills = formData.requiredSkillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const optionalSkills = formData.optionalSkillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        role: formData.role,
        title: formData.title,
        slug: formData.slug || undefined,
        department: formData.department,
        categoryId: formData.categoryId || null,
        location: formData.location,
        employmentType: formData.employmentType,
        experience: formData.experience,
        shortDescription: formData.shortDescription,
        description: formData.description || formData.shortDescription,
        responsibilities,
        qualifications,
        requiredSkills,
        optionalSkills,
        image: formData.image,
        displayOrder: Number(formData.displayOrder) || 0,
        applicationDeadline: formData.applicationDeadline || null,
        status: formData.status,
      };

      const url = editingJob
        ? `/api/admin/careers/jobs/${editingJob.id}`
        : "/api/admin/careers/jobs";
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save job opening.");
      }

      setModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      setModalError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusChange = async (job: Job, newStatus: "published" | "draft" | "closed") => {
    try {
      const res = await fetch(`/api/admin/careers/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs(jobs.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/careers/jobs/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const departments = Array.from(new Set(jobs.map((j) => j.department))).filter(Boolean);

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
            <span className="text-[#17191C]">Job Management</span>
          </div>
          <h1 className="text-2xl font-black text-[#17191C] tracking-tight">Job Openings</h1>
          <p className="text-xs text-[#929DA7] mt-0.5">
            Create, edit, publish, or close vacancies shown on the public Careers page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/careers"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#929DA7]/20 hover:border-[#FF4B32] text-xs font-bold text-[#17191C] hover:text-[#FF4B32] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Board</span>
          </Link>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4B32] hover:bg-[#FFA028] text-white text-xs font-bold transition-all shadow-md shadow-[#FF4B32]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Job</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#929DA7]/20 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#929DA7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, role or department..."
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-[#929DA7]/20 rounded-xl px-2.5 py-1.5 text-xs text-[#17191C] bg-white focus:outline-none focus:border-[#FF4B32]"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Department filter */}
          {departments.length > 0 && (
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="border border-[#929DA7]/20 rounded-xl px-2.5 py-1.5 text-xs text-[#17191C] bg-white focus:outline-none focus:border-[#FF4B32]"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={fetchJobs}
            title="Refresh list"
            className="p-2 border border-[#929DA7]/20 rounded-xl hover:bg-[#F5F6F7] text-[#929DA7] hover:text-[#17191C] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-[#929DA7]/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-[#FF4B32] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#929DA7]">Loading job openings…</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-[#929DA7]/40 mx-auto" />
            <h3 className="text-base font-bold text-[#17191C]">No job openings found</h3>
            <p className="text-xs text-[#929DA7] max-w-sm mx-auto">
              There are no job postings matching your current criteria. Create a new vacancy to attract qualified applicants.
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF4B32] text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Position</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#F5F6F7] bg-[#F5F6F7]/50 text-[#929DA7] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Position Title &amp; Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Applications</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F6F7]">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#F5F6F7]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#929DA7]">{job.display_order}</td>
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-extrabold text-[#17191C] text-[13px] block">
                          {job.title}
                        </span>
                        <div className="flex items-center gap-2 text-[#929DA7] text-[11px] mt-0.5">
                          <span className="text-[#FF4B32] font-semibold">{job.role}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.employment_type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#17191C]">
                      {job.department}
                    </td>
                    <td className="py-3.5 px-4 text-[#929DA7] font-medium">{job.experience}</td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/careers/applications?role=${encodeURIComponent(job.role)}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold hover:underline text-[11px]"
                      >
                        <span>{job.application_count || 0}</span>
                        <span>applicants</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          job.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : job.status === "draft"
                            ? "bg-gray-100 text-gray-700 border border-gray-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Status Toggle Quick Buttons */}
                        {job.status === "published" ? (
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(job, "closed")}
                            className="px-2 py-1 rounded-md text-[10px] font-bold border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Close vacancy"
                          >
                            Close
                          </button>
                        ) : job.status === "closed" ? (
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(job, "published")}
                            className="px-2 py-1 rounded-md text-[10px] font-bold border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Reopen and publish vacancy"
                          >
                            Reopen
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickStatusChange(job, "published")}
                            className="px-2 py-1 rounded-md text-[10px] font-bold border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Publish job live"
                          >
                            Publish
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openEditModal(job)}
                          className="p-1.5 rounded-md border border-[#929DA7]/20 hover:border-[#FF4B32] hover:text-[#FF4B32] transition-colors"
                          title="Edit job opening"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(job)}
                          className="p-1.5 rounded-md border border-[#929DA7]/20 hover:border-rose-400 hover:text-rose-600 transition-colors"
                          title="Delete job position"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Job Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#929DA7]/20 animate-in fade-in zoom-in-95 duration-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#17191C] text-white flex items-center justify-between">
              <div>
                <span className="text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028] block">
                  {editingJob ? "Edit Job Vacancy" : "Create New Opening"}
                </span>
                <h3 className="text-lg font-black text-white">
                  {editingJob ? editingJob.title : "Add Position to Careers Board"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveJob} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              {modalError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 p-3 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Job Role / Headline *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sales Engineer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                  />
                  <p className="text-[10px] text-[#929DA7] mt-0.5">Short title shown on cards and dropdown</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Official Position Title *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Technical Sales & Sourcing Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Department *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sales & Sourcing"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Job Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] bg-white focus:outline-none focus:border-[#FF4B32]"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Experience Required *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 2+ years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] bg-white focus:outline-none focus:border-[#FF4B32]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "published" | "draft" | "closed",
                      })
                    }
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] bg-white focus:outline-none focus:border-[#FF4B32] font-semibold"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden from site)</option>
                    <option value="closed">Closed (No new applications)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Short Description (Card Summary) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="A clear 1-2 sentence summary for the job card..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Full Job Description &amp; Context
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed role description for modal and detail view..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Key Responsibilities (One per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter each responsibility on a new line"
                    value={formData.responsibilitiesText}
                    onChange={(e) =>
                      setFormData({ ...formData, responsibilitiesText: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Qualifications &amp; Requirements (One per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter each qualification on a new line"
                    value={formData.qualificationsText}
                    onChange={(e) =>
                      setFormData({ ...formData, qualificationsText: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32] font-mono"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Required Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Valve Sizing, Datasheet Review, NACE MR0175"
                    value={formData.requiredSkillsText}
                    onChange={(e) =>
                      setFormData({ ...formData, requiredSkillsText: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Optional Preferred Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ERP, LC Compliance, Export Logistics"
                    value={formData.optionalSkillsText}
                    onChange={(e) =>
                      setFormData({ ...formData, optionalSkillsText: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-[#F5F6F7]">
                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Application Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) =>
                      setFormData({ ...formData, applicationDeadline: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Header Card Background Image
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full rounded-xl border border-[#929DA7]/30 px-3 py-2 text-xs text-[#17191C] focus:outline-none focus:border-[#FF4B32]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F5F6F7]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#929DA7]/30 text-xs font-bold text-[#17191C] hover:bg-[#F5F6F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4B32] hover:bg-[#FFA028] text-white text-xs font-bold shadow-md shadow-[#FF4B32]/25 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving…" : editingJob ? "Update Job" : "Publish Job"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#929DA7]/20 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#17191C]">Delete Job Position?</h3>
              <p className="text-xs text-[#929DA7] mt-1">
                Are you sure you want to remove <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>?
                Existing candidate applications will remain safely stored.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-[#929DA7]/30 text-xs font-bold text-[#17191C] hover:bg-[#F5F6F7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
