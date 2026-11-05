"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";
import ImageUploadField from "@/components/admin/ImageUploadField";

import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  Package,
  RefreshCw,
  CheckCircle2,
  FileEdit,
  FlaskConical,
  Gauge,
  Search,
  LayoutGrid,
  List,
  ImageIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Dropdown from "@/components/admin/Dropdown";

const card = "rounded-3xl bg-white border border-[#E7E9EE] shadow-[0_1px_2px_rgba(23,25,28,0.04),0_8px_24px_-12px_rgba(23,25,28,0.10)]";
const field = "w-full rounded-xl border border-[#D8DDE2] bg-white px-3.5 py-2.5 text-[13.5px] text-[#17191C] placeholder:text-[#929DA7] outline-none transition focus:border-[#C80808] focus:ring-4 focus:ring-[#C80808]/10";
const label = "mb-1.5 block text-[12px] font-bold text-[#17191C]";

const EMPTY_FORM = {
  name: "",
  slug: "",
  division: "instrumentation",
  short_description: "",
  detailed_description: "",
  image: "",
  display_order: 1,
  is_published: true,
};

function Toggle({ on, onClick, label: l }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={l} onClick={onClick} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-[#D8DDE2]"}`}>
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

function Thumb({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  const [bad, setBad] = useState(false);
  if (!src || bad) return <div className={`flex items-center justify-center bg-[#F1F3F6] text-[#929DA7] ${className}`}><ImageIcon className="h-6 w-6" /></div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={`object-cover ${className}`} />;
}

function DivisionTag({ d, onImage = false }: { d: string; onImage?: boolean }) {
  const chem = d === "chemicals";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider ${onImage ? "bg-white/95 text-[#17191C] shadow" : chem ? "bg-[#E0A21A] text-[#17191C]" : "bg-[#17191C] text-white"}`}>
      {chem ? <FlaskConical className="h-3 w-3 text-[#D4950F]" /> : <Gauge className={`h-3 w-3 ${onImage ? "text-[#C80808]" : "text-[#F2B93B]"}`} />}
      {chem ? "Chemicals" : "Instrumentation"}
    </span>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const url = divisionFilter !== "all" ? `/api/admin/categories?division=${divisionFilter}` : "/api/admin/categories";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setCategories(json.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [divisionFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories
      .filter((c) => !q || `${c.name} ${c.slug} ${c.short_description || ""}`.toLowerCase().includes(q))
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || String(a.name).localeCompare(String(b.name)));
  }, [categories, search]);

  const stats = useMemo(() => {
    const productCount = (c: any) => parseInt(c.product_count || "0", 10);
    return {
      total: categories.length,
      chemicals: categories.filter((c) => c.division === "chemicals").length,
      instrumentation: categories.filter((c) => c.division !== "chemicals").length,
      products: categories.reduce((a, c) => a + productCount(c), 0),
      drafts: categories.filter((c) => !c.is_published).length,
      empty: categories.filter((c) => productCount(c) === 0).length,
    };
  }, [categories]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormError(null);
    setFormData({
      ...EMPTY_FORM,
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      display_order: categories.length + 1,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCategory(c);
    setFormError(null);
    setFormData({
      name: c.name || "",
      slug: c.slug || "",
      division: c.division || "instrumentation",
      short_description: c.short_description || "",
      detailed_description: c.detailed_description || "",
      image: c.image || "",
      display_order: c.display_order || 1,
      is_published: c.is_published ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory ? { id: editingCategory.id, ...formData } : formData),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchCategories();
      } else {
        setFormError(json.error || json.message || "Could not save the category.");
      }
    } catch (err: any) {
      setFormError(err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (c: any) => {
    setCategories((prev) => prev.map((x) => (x.id === c.id ? { ...x, is_published: !x.is_published } : x)));
    try {
      await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, is_published: !c.is_published }),
      });
    } catch (e) {
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirmId(null);
        fetchCategories();
      } else {
        alert(json.message);
      }
    } catch (e) {}
  };

  const RowActions = ({ c }: { c: any }) => (
    <div className="flex items-center justify-end gap-1">
      <button onClick={() => handleOpenEdit(c)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E7EC] px-2.5 py-1.5 text-[12px] font-bold text-[#17191C] transition-colors hover:border-[#C80808]/40 hover:text-[#C80808]" title="Edit category"><Pencil className="h-3.5 w-3.5" />Edit</button>
      {deleteConfirmId === c.id ? (
        <span className="inline-flex items-center gap-1">
          <button onClick={() => handleDelete(c.id)} className="rounded-lg bg-[#C80808] px-2.5 py-1.5 text-[11.5px] font-bold text-white hover:bg-[#8A0A0A]">Delete</button>
          <button onClick={() => setDeleteConfirmId(null)} className="rounded-lg p-1.5 text-[#5F6871] hover:bg-[#F5F6F7]" aria-label="Cancel"><X className="h-4 w-4" /></button>
        </span>
      ) : (
        <button onClick={() => setDeleteConfirmId(c.id)} className="rounded-lg p-2 text-[#929DA7] transition-colors hover:bg-[#FBE9EC] hover:text-[#C80808]" title="Delete category" aria-label="Delete category"><Trash2 className="h-4 w-4" /></button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[1.7rem] font-black leading-tight tracking-tight text-[#17191C]">Product categories</h2>
          <p className="mt-1 text-[13.5px] text-[#5F6871]">Organise your chemicals and instrumentation lines, edit descriptions and control the display order.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={fetchCategories} className="inline-flex items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-4 py-2.5 text-[13px] font-bold text-[#17191C] transition-colors hover:border-[#C80808]/40 hover:text-[#C80808]"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>
          <button onClick={handleOpenAdd} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C80808] to-[#E0A21A] px-5 py-2.5 text-[13px] font-extrabold text-white shadow-[0_10px_24px_-8px_rgba(200,8,8,0.6)] transition-transform hover:-translate-y-0.5"><Plus className="h-4 w-4" />Add category</button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { l: "Categories", v: stats.total, sub: stats.drafts ? `${stats.drafts} in draft` : "All published", Icon: Layers, tint: "bg-[#17191C] text-[#F2B93B]" },
          { l: "Chemicals", v: stats.chemicals, sub: "Chemicals & water treatment", Icon: FlaskConical, tint: "bg-[#E0A21A] text-[#17191C]" },
          { l: "Instrumentation", v: stats.instrumentation, sub: "Instruments & valves", Icon: Gauge, tint: "bg-[#C80808] text-white" },
          { l: "Products listed", v: stats.products, sub: stats.empty ? `${stats.empty} categor${stats.empty > 1 ? "ies" : "y"} with none` : "Every category has products", Icon: Package, tint: "bg-emerald-600 text-white" },
        ].map((s) => (
          <div key={s.l} className={`${card} flex items-center gap-4 p-5`}>
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.tint}`}><s.Icon className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="text-[1.7rem] font-black leading-none tracking-tight text-[#17191C]">{s.v}</p>
              <p className="mt-1.5 truncate text-[12.5px] font-bold text-[#17191C]">{s.l}</p>
              <p className="truncate text-[11.5px] text-[#5F6871]">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={`${card} flex flex-col gap-3 p-4 lg:flex-row lg:items-center`}>
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#929DA7]" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories by name or description…" className={`${field} !pl-10`} />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl bg-[#F1F3F6] p-1">
            {[{ k: "all", l: "All" }, { k: "chemicals", l: "Chemicals" }, { k: "instrumentation", l: "Instrumentation" }].map((o) => (
              <button key={o.k} onClick={() => setDivisionFilter(o.k)} className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold transition-all ${divisionFilter === o.k ? "bg-white text-[#C80808] shadow-sm" : "text-[#5F6871] hover:text-[#17191C]"}`}>{o.l}</button>
            ))}
          </div>
          <div className="inline-flex rounded-xl bg-[#F1F3F6] p-1">
            <button onClick={() => setView("grid")} aria-label="Grid view" className={`rounded-lg p-2 transition-all ${view === "grid" ? "bg-white text-[#C80808] shadow-sm" : "text-[#5F6871]"}`}><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setView("list")} aria-label="List view" className={`rounded-lg p-2 transition-all ${view === "list" ? "bg-white text-[#C80808] shadow-sm" : "text-[#5F6871]"}`}><List className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <WorkspaceLoader compact />
      ) : filtered.length === 0 ? (
        <div className={`${card} flex flex-col items-center gap-3 px-6 py-16 text-center`}>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F6F7] text-[#929DA7]"><Layers className="h-6 w-6" /></span>
          <h3 className="text-[16px] font-extrabold text-[#17191C]">{search || divisionFilter !== "all" ? "No categories match" : "No categories yet"}</h3>
          <p className="max-w-sm text-[13px] text-[#5F6871]">{search || divisionFilter !== "all" ? "Try a different keyword or show all divisions." : "Create your first category to start organising products."}</p>
          <button onClick={search || divisionFilter !== "all" ? () => { setSearch(""); setDivisionFilter("all"); } : handleOpenAdd} className="mt-1 rounded-xl bg-[#17191C] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#C80808]">{search || divisionFilter !== "all" ? "Clear filters" : "Add category"}</button>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const count = parseInt(c.product_count || "0", 10);
            return (
              <article key={c.id} className={`${card} group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(23,25,28,0.3)]`}>
                <div className="relative h-44 overflow-hidden bg-[#F1F3F6]">
                  <Thumb src={c.image} alt={c.name} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#17191C]/55 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3"><DivisionTag d={c.division} onImage /></span>
                  <span className="absolute right-3 top-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-[#17191C]/80 px-2 text-[11.5px] font-extrabold text-white backdrop-blur" title="Display order">#{c.display_order ?? "–"}</span>
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11.5px] font-extrabold text-[#17191C] shadow"><Package className="h-3.5 w-3.5 text-[#C80808]" />{count} product{count === 1 ? "" : "s"}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[16px] font-extrabold leading-snug text-[#17191C]">{c.name}</h3>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-[#929DA7]">/{c.slug}</p>
                  <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-[#5F6871]">{c.short_description || "No description yet."}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-[#E7E9EE] pt-4 mt-4">
                    <div className="flex items-center gap-2.5">
                      <Toggle on={!!c.is_published} onClick={() => handleTogglePublished(c)} label={`Toggle ${c.name} published`} />
                      <span className={`text-[11px] font-extrabold uppercase tracking-wider ${c.is_published ? "text-emerald-600" : "text-[#929DA7]"}`}>{c.is_published ? "Live" : "Draft"}</span>
                    </div>
                    <RowActions c={c} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={`${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
              <thead className="bg-[#F7F8FA]">
                <tr className="border-b border-[#E7E9EE] text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-[#5F6871]">
                  <th className="w-16 px-5 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Division</th>
                  <th className="px-4 py-3.5">Products</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const count = parseInt(c.product_count || "0", 10);
                  return (
                    <tr key={c.id} className="border-b border-[#EEF0F3] transition-colors last:border-0 hover:bg-white">
                      <td className="px-5 py-3 font-bold text-[#5F6871]">{c.display_order ?? "–"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Thumb src={c.image} alt={c.name} className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[#E7E9EE]" />
                          <div className="min-w-0">
                            <button onClick={() => handleOpenEdit(c)} className="block max-w-[300px] truncate text-left text-[13.5px] font-bold text-[#17191C] hover:text-[#C80808]">{c.name}</button>
                            <p className="max-w-[300px] truncate text-[11.5px] text-[#5F6871]">{c.short_description || <span className="text-[#C3CAD1]">No description</span>}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><DivisionTag d={c.division} /></td>
                      <td className="px-4 py-3"><Link href={`/admin/products`} className="inline-flex items-center gap-1 font-bold text-[#17191C] hover:text-[#C80808]">{count}<ArrowRight className="h-3 w-3 text-[#C3CAD1]" /></Link></td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleTogglePublished(c)} title={c.is_published ? "Click to unpublish" : "Click to publish"} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-bold transition-colors ${c.is_published ? "border-transparent bg-emerald-600 text-white hover:bg-emerald-700" : "border-transparent bg-[#2A2E34] text-white hover:bg-[#17191C]"}`}><span className={`h-1.5 w-1.5 rounded-full ${c.is_published ? "bg-emerald-500" : "bg-[#929DA7]"}`} />{c.is_published ? "Published" : "Draft"}</button>
                      </td>
                      <td className="px-5 py-3"><RowActions c={c} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#14161A]/70 p-4 backdrop-blur-sm sm:items-center" onClick={() => setShowModal(false)}>
          <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="relative my-6 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] animate-[routepop2_.35s_cubic-bezier(.2,.9,.25,1.1)_both]">
            <div className="relative flex shrink-0 items-center justify-between gap-4 border-b border-[#EEF0F3] px-6 py-5 sm:px-8">
              <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D40E0E] to-[#E0A21A] text-white shadow-[0_8px_18px_-6px_rgba(212,14,14,0.6)]">{editingCategory ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}</span>
                <div><h3 className="text-[18px] font-black text-[#17191C]">{editingCategory ? "Edit category" : "Add a new category"}</h3><p className="text-[12.5px] text-[#5F6871]">{editingCategory ? editingCategory.name : "Group related products so visitors can find them easily."}</p></div>
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-xl p-2 text-[#5F6871] transition-colors hover:bg-[#F5F6F7] hover:text-[#17191C]" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
                {formError && <div className="flex items-start gap-2 rounded-xl border border-[#C80808]/25 bg-[#FBE9EC] p-3 text-[13px] text-[#8A0A0A]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{formError}</div>}

                <section>
                  <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">Basics</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className={label}>Category name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={field} placeholder="e.g. Tube Fittings" /></div>
                    <div><label className={label}>URL slug</label><input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className={`${field} font-mono`} placeholder="auto-generated if left blank" /></div>
                    <div><label className={label}>Division *</label><Dropdown full value={formData.division} onChange={(v) => setFormData({ ...formData, division: v })} options={[{ value: "instrumentation", label: "Instrumentation & Valves" }, { value: "chemicals", label: "Chemicals & Water Treatment" }]} /></div>
                    <div><label className={label}>Display order</label><input type="number" min={1} value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value || "1", 10) })} className={field} /></div>
                  </div>
                </section>

                <section>
                  <ImageUploadField
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    label="Category Image"
                    hint="Upload directly from your device or paste an image URL. Shown on category cards across the website."
                  />
                </section>

                <section>
                  <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">Description</h4>
                  <div className="space-y-4">
                    <div><label className={label}>Short description</label><textarea rows={2} value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} className={field} placeholder="A line or two shown on the category card…" /></div>
                    <div><label className={label}>Detailed description</label><textarea rows={4} value={formData.detailed_description} onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })} className={field} placeholder="Longer text for the category page…" /></div>
                  </div>
                </section>

                <section className="flex items-center justify-between gap-4 rounded-2xl border border-[#EEF0F3] bg-white p-4">
                  <div><p className="text-[13.5px] font-bold text-[#17191C]">Publish to the website</p><p className="text-[12px] text-[#5F6871]">{formData.is_published ? "Visitors will see this category right away." : "Saved as a draft. Visitors will not see it."}</p></div>
                  <Toggle on={formData.is_published} onClick={() => setFormData({ ...formData, is_published: !formData.is_published })} label="Publish category" />
                </section>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#EEF0F3] bg-white px-6 py-4 sm:px-8">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border-2 border-[#E7E9EE] px-5 py-2.5 text-[13.5px] font-bold text-[#17191C] transition-colors hover:border-[#17191C]">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-r from-[#C80808] to-[#E0A21A] px-6 py-2.5 text-[13.5px] font-extrabold text-white shadow-[0_10px_24px_-8px_rgba(200,8,8,0.6)] transition-transform hover:-translate-y-0.5 disabled:opacity-60">{saving ? "Saving…" : editingCategory ? "Save changes" : "Create category"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
