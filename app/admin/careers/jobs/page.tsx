"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";
import PetroLogo from "@/components/common/PetroLogo";
import Dropdown from "@/components/admin/Dropdown";

import { ModalFrame, ConfirmDialog } from "@/components/admin/Modal";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  MapPin,
  Clock,
  Layers,
  X,
  Save,
  Sparkles,
  Users,
  CalendarDays,
  ImageIcon,
  Building2,
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

const field = "w-full rounded-xl border border-[#D8DDE2] bg-white px-3.5 py-2.5 text-[13.5px] text-[#17191C] placeholder:text-[#929DA7] outline-none transition focus:border-[#C80808] focus:ring-4 focus:ring-[#C80808]/10";
const label = "mb-1.5 block text-[12px] font-bold text-[#17191C]";
const sectionTitle = "mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]";

const STATUS_STYLE: Record<string, string> = {
  published: "bg-emerald-600 text-white",
  draft: "bg-[#E0A21A] text-[#17191C]",
  closed: "bg-[#52525B] text-white",
};
const STATUS_LABEL: Record<string, string> = { published: "Live", draft: "Draft", closed: "Closed" };

function Cover({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  const [bad, setBad] = useState(false);
  if (!src || bad) return <div className={`flex items-center justify-center bg-gradient-to-br from-[#2E3239] to-[#14161A] text-white/40 ${className}`}><ImageIcon className="h-7 w-7" /></div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} onError={() => setBad(true)} className={`object-cover ${className}`} />;
}

function dateShort(val?: string | null) {
  if (!val) return "";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function JobManagementPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

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

      const [jobsRes, catsRes, allRes] = await Promise.all([
        fetch(`/api/admin/careers/jobs?${query.toString()}`).then((r) => r.json()),
        fetch("/api/admin/careers/categories").then((r) => r.json()),
        fetch("/api/admin/careers/jobs").then((r) => r.json()).catch(() => null),
      ]);

      if (jobsRes.success) setJobs(jobsRes.jobs);
      if (catsRes.success) setCategories(catsRes.categories);
      if (allRes?.success) setAllJobs(allRes.jobs);
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
      applicationDeadline: job.application_deadline ? new Date(job.application_deadline).toISOString().split("T")[0] : "",
      status: job.status,
    });
    setModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);

    try {
      const lines = (t: string) => t.split("\n").map((s) => s.trim()).filter(Boolean);
      const csv = (t: string) => t.split(",").map((s) => s.trim()).filter(Boolean);

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
        responsibilities: lines(formData.responsibilitiesText),
        qualifications: lines(formData.qualificationsText),
        requiredSkills: csv(formData.requiredSkillsText),
        optionalSkills: csv(formData.optionalSkillsText),
        image: formData.image,
        displayOrder: Number(formData.displayOrder) || 0,
        applicationDeadline: formData.applicationDeadline || null,
        status: formData.status,
      };

      const url = editingJob ? `/api/admin/careers/jobs/${editingJob.id}` : "/api/admin/careers/jobs";
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to save job opening.");

      setModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      setModalError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusChange = async (job: Job, newStatus: "published" | "draft" | "closed") => {
    if (job.status === newStatus) return;
    try {
      const res = await fetch(`/api/admin/careers/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setJobs(jobs.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
        setAllJobs(allJobs.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/careers/jobs/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== deleteTarget.id));
        setAllJobs(allJobs.filter((j) => j.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const departments = Array.from(new Set((allJobs.length ? allJobs : jobs).map((j) => j.department))).filter(Boolean);
  const counts = {
    all: allJobs.length || jobs.length,
    published: (allJobs.length ? allJobs : jobs).filter((j) => j.status === "published").length,
    draft: (allJobs.length ? allJobs : jobs).filter((j) => j.status === "draft").length,
    closed: (allJobs.length ? allJobs : jobs).filter((j) => j.status === "closed").length,
  };
  const filtersActive = !!search.trim() || statusFilter !== "all" || deptFilter !== "all";
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); setDeptFilter("all"); setTimeout(fetchJobs, 0); };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#191B1F] via-[#1E191C] to-[#24191C] text-white shadow-[0_12px_28px_-16px_rgba(200,8,8,0.15)]">
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-72 rounded-full bg-[#E0A21A]/15 blur-[60px]" />
        <div className="pointer-events-none absolute right-4 top-1/2 w-[170px] -translate-y-1/2 opacity-[0.08]"><PetroLogo part="flame" variant="dark" width="100%" /></div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:30px_30px]" />
        <span className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B] opacity-60" />
        <div className="relative flex flex-col gap-4 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]"><Sparkles className="h-3 w-3" />Hiring</p>
            <h2 className="mt-0.5 text-[1.3rem] font-black leading-tight tracking-tight !text-white sm:text-[1.5rem]">Job Openings</h2>
            <p className="mt-0.5 text-[12.5px] text-white/65">Create, publish or close vacancies on your Careers page.</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {([["all", "All jobs", counts.all], ["published", "Live", counts.published], ["draft", "Drafts", counts.draft], ["closed", "Closed", counts.closed]] as const).map(([k, l, v]) => (
              <button key={k} onClick={() => setStatusFilter(k)} className={`flex items-baseline gap-2 rounded-xl border px-4 py-2 backdrop-blur-md transition-colors ${statusFilter === k ? "border-white/60 bg-white/25" : "border-white/15 bg-white/10 hover:border-white/35 hover:bg-white/20"}`}>
                <span className="text-[1.3rem] font-black leading-none">{loading && !v ? "–" : v}</span>
                <span className="whitespace-nowrap text-[12px] font-semibold text-white/80">{l}</span>
              </button>
            ))}
            <button onClick={fetchJobs} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-bold backdrop-blur transition-colors hover:bg-white/20"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh</button>
            <button onClick={openAddModal} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#D40E0E] to-[#E0A21A] px-4 py-2 text-[12px] font-extrabold shadow-[0_8px_20px_-8px_rgba(224,100,20,0.25)] transition-transform hover:-translate-y-0.5"><Plus className="h-3.5 w-3.5" />Add job</button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 rounded-2xl border border-[#E4E4E7] bg-white p-3 shadow-sm lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#929DA7]" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, role or department — press Enter" className={`${field} !pl-10`} />
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-[#F1F1F3] p-1">
            {[{ k: "all", l: "All" }, { k: "published", l: "Live" }, { k: "draft", l: "Draft" }, { k: "closed", l: "Closed" }].map((o) => (
              <button key={o.k} type="button" onClick={() => setStatusFilter(o.k)} className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold transition-all ${statusFilter === o.k ? "bg-white text-[#C80808] shadow-sm" : "text-[#5F6871] hover:text-[#17191C]"}`}>{o.l}</button>
            ))}
          </div>
          <Dropdown ariaLabel="Department" value={deptFilter} onChange={setDeptFilter} align="right" className="min-w-[180px]" options={[{ value: "all", label: "All departments" }, ...departments.map((d) => ({ value: d, label: d }))]} />
          {filtersActive && <button type="button" onClick={clearFilters} className="px-1 text-[12.5px] font-bold text-[#C80808] hover:underline">Clear filters</button>}
        </div>
      </form>

      {/* Jobs grid */}
      {loading ? (
        <WorkspaceLoader compact />
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E4E7] bg-white px-6 py-16 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F4F5] text-[#929DA7]"><Briefcase className="h-6 w-6" /></span>
          <h3 className="text-[16px] font-extrabold text-[#17191C]">{filtersActive ? "No jobs match your filters" : "No job openings yet"}</h3>
          <p className="max-w-sm text-[13px] text-[#5F6871]">{filtersActive ? "Try a different keyword or clear the filters." : "Post your first opening and it will appear on your public Careers page."}</p>
          <button onClick={filtersActive ? clearFilters : openAddModal} className="mt-1 rounded-xl bg-[#17191C] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#C80808]">{filtersActive ? "Clear filters" : "Add job"}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {jobs.map((job) => (
            <article key={job.id} className="group flex flex-col overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-18px_rgba(23,25,28,0.16)]">
              <div className="relative h-36 overflow-hidden bg-[#17191C]">
                <Cover src={job.image} alt={job.title} className="h-full w-full opacity-90 transition-transform duration-700 group-hover:scale-105" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1013] via-[#0E1013]/45 to-[#A81010]/20" />
                <span className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-wider shadow-sm ${STATUS_STYLE[job.status]}`}><span className="h-1.5 w-1.5 rounded-full bg-white" />{STATUS_LABEL[job.status] || job.status}</span>
                {typeof job.application_count === "number" && <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-extrabold text-[#17191C] shadow-sm"><Users className="h-3.5 w-3.5 text-[#C80808]" />{job.application_count} applied</span>}
                <div className="absolute inset-x-4 bottom-3"><p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#F2B93B]">{job.role}</p><h3 className="truncate text-[1.05rem] font-black leading-tight !text-white" title={job.title}>{job.title}</h3></div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-[#52525B]">{job.short_description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[{ I: Building2, t: job.department }, { I: MapPin, t: job.location }, { I: Clock, t: `${job.employment_type} · ${job.experience}` }, ...(job.category_name ? [{ I: Layers, t: job.category_name }] : [])].map((c, i) => (
                    <span key={i} className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] px-2.5 py-1 text-[11.5px] font-semibold text-[#3F3F46]"><c.I className="h-3.5 w-3.5 shrink-0 text-[#C80808]" /><span className="truncate">{c.t}</span></span>
                  ))}
                  {job.application_deadline && <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E0A21A]/50 bg-[#FFFBEF] px-2.5 py-1 text-[11.5px] font-semibold text-[#8A6100]"><CalendarDays className="h-3.5 w-3.5" />Apply by {dateShort(job.application_deadline)}</span>}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EEEEF0] pt-3.5">
                  <div className="inline-flex rounded-lg bg-[#F1F1F3] p-0.5" role="group" aria-label="Change status">
                    {(["published", "draft", "closed"] as const).map((st) => (
                      <button key={st} onClick={() => handleQuickStatusChange(job, st)} className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all ${job.status === st ? `${STATUS_STYLE[st]} shadow-sm` : "text-[#71717A] hover:text-[#17191C]"}`}>{STATUS_LABEL[st]}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link href={`/careers`} target="_blank" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E4E7] text-[#52525B] transition-colors hover:border-[#C80808]/40 hover:text-[#C80808]" title="View on public site" aria-label="View on public site"><ExternalLink className="h-4 w-4" /></Link>
                    <button onClick={() => openEditModal(job)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#17191C] px-3.5 py-2 text-[12px] font-bold text-white transition-colors hover:bg-[#C80808]"><Pencil className="h-3.5 w-3.5" />Edit</button>
                    <button onClick={() => setDeleteTarget(job)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E4E7] text-[#929DA7] transition-colors hover:border-[#C80808]/40 hover:bg-[#FBE9EC] hover:text-[#C80808]" title="Delete" aria-label="Delete job"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add / Edit Job Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#14161A]/70 p-3 backdrop-blur-sm sm:items-center sm:p-5" onClick={() => setModalOpen(false)}>
          <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="relative my-4 flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] animate-[routepop2_.35s_cubic-bezier(.2,.9,.25,1.1)_both]">
            <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#191B1F] via-[#1E191C] to-[#24191C] px-6 py-4 text-white sm:px-7">
              <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-48 rounded-full bg-[#E0A21A]/15 blur-3xl" />
              <span className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B] opacity-60" />
              <button type="button" onClick={() => setModalOpen(false)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25" aria-label="Close"><X className="h-4 w-4" /></button>
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]">{editingJob ? "Edit job vacancy" : "Create new opening"}</p>
              <h3 className="mt-0.5 pr-10 text-[1.15rem] font-black !text-white">{editingJob ? editingJob.title : "Add a position to the Careers page"}</h3>
            </div>

            <form onSubmit={handleSaveJob} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-7">
                {modalError && <div className="flex items-start gap-2 rounded-xl border border-[#C80808]/25 bg-[#FBE9EC] p-3 text-[13px] text-[#C80808]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{modalError}</div>}

                <section>
                  <h4 className={sectionTitle}>Position</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className={label}>Job role / headline *</label><input required type="text" placeholder="e.g. Sales Engineer" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className={field} /><p className="mt-1 text-[11px] text-[#929DA7]">Short title shown on cards and the apply dropdown</p></div>
                    <div><label className={label}>Official position title *</label><input required type="text" placeholder="e.g. Technical Sales & Sourcing Engineer" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={field} /></div>
                    <div><label className={label}>Department *</label><input required type="text" placeholder="e.g. Sales & Sourcing" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className={field} /></div>
                    <div><label className={label}>Job category</label><Dropdown full value={formData.categoryId} onChange={(v) => setFormData({ ...formData, categoryId: v })} placeholder="Select category…" options={[{ value: "", label: "No category" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} /></div>
                  </div>
                </section>

                <section>
                  <h4 className={sectionTitle}>Details</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div><label className={label}>Experience required *</label><input required type="text" placeholder="e.g. 2+ years" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={field} /></div>
                    <div><label className={label}>Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={field} /></div>
                    <div><label className={label}>Employment type</label><Dropdown full value={formData.employmentType} onChange={(v) => setFormData({ ...formData, employmentType: v })} options={["Full-time", "Part-time", "Contract", "Internship"].map((x) => ({ value: x, label: x }))} /></div>
                  </div>
                </section>

                <section>
                  <h4 className={sectionTitle}>Description</h4>
                  <div className="space-y-4">
                    <div><label className={label}>Short description (card summary) *</label><textarea required rows={2} placeholder="A clear 1–2 sentence summary for the job card…" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className={`${field} resize-none`} /></div>
                    <div><label className={label}>Full job description</label><textarea rows={3} placeholder="Detailed role description for the details view…" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${field} resize-none`} /></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label className={label}>Key responsibilities <span className="font-medium text-[#929DA7]">(one per line)</span></label><textarea rows={4} placeholder="Enter each responsibility on a new line" value={formData.responsibilitiesText} onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })} className={`${field} resize-none`} /></div>
                      <div><label className={label}>Qualifications <span className="font-medium text-[#929DA7]">(one per line)</span></label><textarea rows={4} placeholder="Enter each qualification on a new line" value={formData.qualificationsText} onChange={(e) => setFormData({ ...formData, qualificationsText: e.target.value })} className={`${field} resize-none`} /></div>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className={sectionTitle}>Skills</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className={label}>Required skills <span className="font-medium text-[#929DA7]">(comma separated)</span></label><input type="text" placeholder="e.g. Valve Sizing, Datasheet Review" value={formData.requiredSkillsText} onChange={(e) => setFormData({ ...formData, requiredSkillsText: e.target.value })} className={field} /></div>
                    <div><label className={label}>Preferred skills <span className="font-medium text-[#929DA7]">(comma separated)</span></label><input type="text" placeholder="e.g. ERP, Export Logistics" value={formData.optionalSkillsText} onChange={(e) => setFormData({ ...formData, optionalSkillsText: e.target.value })} className={field} /></div>
                  </div>
                </section>

                <section>
                  <h4 className={sectionTitle}>Publishing</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div><label className={label}>Status *</label><Dropdown full value={formData.status} onChange={(v) => setFormData({ ...formData, status: v as "published" | "draft" | "closed" })} options={[{ value: "published", label: "Published", hint: "Visible on the site" }, { value: "draft", label: "Draft", hint: "Hidden from the site" }, { value: "closed", label: "Closed", hint: "No new applications" }]} /></div>
                    <div><label className={label}>Application deadline</label><input type="date" value={formData.applicationDeadline} onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })} className={field} /></div>
                    <div><label className={label}>Display order</label><input type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })} className={field} /></div>
                  </div>
                  <div className="mt-4 flex items-start gap-4">
                    <Cover src={formData.image} alt="Cover preview" className="h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-[#E7E9EE]" />
                    <div className="flex-1"><label className={label}>Header card background image</label><input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className={field} placeholder="/assets/img/… or https://…" /></div>
                  </div>
                </section>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#EEF0F3] bg-white px-6 py-3.5 sm:px-7">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border-2 border-[#E7E9EE] px-4 py-2 text-[13px] font-bold text-[#17191C] transition-colors hover:border-[#17191C]">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C80808] to-[#E0A21A] px-5 py-2 text-[13px] font-extrabold text-white shadow-[0_10px_24px_-8px_rgba(200,8,8,0.22)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"><Save className="h-4 w-4" />{saving ? "Saving…" : editingJob ? "Update job" : "Publish job"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete this job?"
          busy={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          message={<>You are about to remove <b className="text-[#17191C]">“{deleteTarget.title}”</b> from your Careers page. Existing candidate applications will stay safely stored.</>}
        />
      )}
    </div>
  );
}
