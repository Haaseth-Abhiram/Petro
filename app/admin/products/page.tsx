"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";
import PetroLogo from "@/components/common/PetroLogo";
import Dropdown from "@/components/admin/Dropdown";
import ImageUploadField from "@/components/admin/ImageUploadField";

import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  FlaskConical,
  Gauge,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Sparkles,
} from "lucide-react";

const field = "w-full rounded-xl border border-[#D8DDE2] bg-white px-3.5 py-2.5 text-[13.5px] text-[#17191C] placeholder:text-[#929DA7] outline-none transition focus:border-[#C80808] focus:ring-4 focus:ring-[#C80808]/10";
const label = "mb-1.5 block text-[12px] font-bold text-[#17191C]";
const PAGE_SIZE = 12;

const EMPTY_FORM = {
  name: "",
  slug: "",
  division: "instrumentation",
  category_slug: "",
  short_description: "",
  overview: "",
  image: "",
  material: "",
  size: "",
  pressure_rating: "",
  connection_type: "",
  temperature_range: "",
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"newest" | "name" | "status">("newest");
  const [page, setPage] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (json.success) setCategories(json.categories);
    } catch (e) {}
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (divisionFilter !== "all") params.set("division", divisionFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const json = await res.json();
      if (json.success) setProducts(json.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts();
  }, [search, divisionFilter, categoryFilter]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, sortBy]);

  const stats = useMemo(() => {
    const published = products.filter((p) => p.is_published).length;
    return { total: products.length, published, drafts: products.length - published };
  }, [products]);

  const shown = useMemo(() => {
    const list = products.filter((x) => (statusFilter === "all" ? true : statusFilter === "published" ? !!x.is_published : !x.is_published));
    const date = (x: any) => +new Date(x.updated_at || x.created_at || 0);
    return list.sort((a, b) => (sortBy === "name" ? String(a.name).localeCompare(String(b.name)) : sortBy === "status" ? Number(b.is_published) - Number(a.is_published) || String(a.name).localeCompare(String(b.name)) : date(b) - date(a)));
  }, [products, statusFilter, sortBy]);

  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const visible = shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filtersActive = !!search.trim() || divisionFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all";
  const clearFilters = () => { setSearch(""); setDivisionFilter("all"); setCategoryFilter("all"); setStatusFilter("all"); };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormError(null);
    setFormData({
      ...EMPTY_FORM,
      category_slug: categories[0]?.slug || "tube-fittings",
      image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setFormError(null);
    setFormData({
      name: p.name || "",
      slug: p.slug || "",
      division: p.division || "instrumentation",
      category_slug: p.category_slug || "",
      short_description: p.short_description || "",
      overview: p.overview || "",
      image: p.image || "",
      material: p.material || "",
      size: p.size || "",
      pressure_rating: p.pressure_rating || "",
      connection_type: p.connection_type || "",
      temperature_range: p.temperature_range || "",
      is_published: p.is_published ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct ? { id: editingProduct.id, ...formData } : formData),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchProducts();
      } else {
        setFormError(json.error || json.message || "Could not save the product.");
      }
    } catch (err: any) {
      setFormError(err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (p: any) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_published: !x.is_published } : x)));
    try {
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, is_published: !p.is_published }),
      });
    } catch (e) {
      fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirmId(null);
        fetchProducts();
      } else {
        alert(json.message);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#17191C] via-[#22171A] to-[#2D161A] text-white shadow-[0_12px_28px_-16px_rgba(200,8,8,0.25)]">
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-72 rounded-full bg-[#E0A21A]/15 blur-[60px]" />
        <div className="pointer-events-none absolute right-4 top-1/2 w-[170px] -translate-y-1/2 opacity-[0.08]"><PetroLogo part="flame" variant="dark" width="100%" /></div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:30px_30px]" />
        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
        <div className="relative flex flex-col gap-4 px-5 py-4 min-[1400px]:flex-row min-[1400px]:items-center min-[1400px]:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[#F2B93B]"><Sparkles className="h-3 w-3" />Catalogue</p>
            <h2 className="mt-0.5 text-[1.3rem] font-black leading-tight tracking-tight !text-white sm:text-[1.5rem]">Product catalogue</h2>
            <p className="mt-0.5 text-[12.5px] text-white/65">Create, publish and organise your product range.</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {([["all", "All products", stats.total], ["published", "Published", stats.published], ["draft", "Drafts", stats.drafts]] as const).map(([k, l, v]) => (
              <button key={k} onClick={() => setStatusFilter(k)} className={`group flex items-baseline gap-2 rounded-xl border px-4 py-2 backdrop-blur-md transition-colors ${statusFilter === k ? "border-white/60 bg-white/25" : "border-white/15 bg-white/10 hover:border-white/35 hover:bg-white/20"}`}>
                <span className="text-[1.3rem] font-black leading-none">{loading ? "–" : v}</span>
                <span className="whitespace-nowrap text-[12px] font-semibold text-white/80">{l}</span>
              </button>
            ))}
            <button onClick={fetchProducts} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-bold backdrop-blur transition-colors hover:bg-white/20" title="Refresh"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Refresh</button>
            <button onClick={handleOpenAdd} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#D40E0E] to-[#E0A21A] px-4 py-2 text-[12px] font-extrabold shadow-[0_8px_20px_-8px_rgba(224,100,20,0.8)] transition-transform hover:-translate-y-0.5"><Plus className="h-3.5 w-3.5" />Add product</button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E4E7] bg-white p-3 shadow-sm lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#929DA7]" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, slug, material or keyword…" className={`${field} !pl-10`} />
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-[#F1F1F3] p-1">
            {[{ k: "all", l: "All" }, { k: "chemicals", l: "Chemicals" }, { k: "instrumentation", l: "Instrumentation" }].map((o) => (
              <button key={o.k} onClick={() => setDivisionFilter(o.k)} className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold transition-all ${divisionFilter === o.k ? "bg-white text-[#C80808] shadow-sm" : "text-[#5F6871] hover:text-[#17191C]"}`}>{o.l}</button>
            ))}
          </div>
          <Dropdown ariaLabel="Category" value={categoryFilter} onChange={setCategoryFilter} className="min-w-[190px]" options={[{ value: "all", label: "All categories" }, ...categories.map((c: any) => ({ value: c.slug, label: c.name, hint: c.division === "chemicals" ? "Chemicals" : "Instrumentation" }))]} />
          <Dropdown ariaLabel="Sort" value={sortBy} onChange={(v) => setSortBy(v as any)} align="right" className="min-w-[165px]" options={[{ value: "newest", label: "Newest first" }, { value: "name", label: "Name A–Z" }, { value: "status", label: "Published first" }]} />
          {filtersActive && <button onClick={clearFilters} className="px-1 text-[12.5px] font-bold text-[#C80808] hover:underline">Clear filters</button>}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <WorkspaceLoader compact />
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E4E7] bg-white px-6 py-16 text-center shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F4F5] text-[#929DA7]"><Package className="h-6 w-6" /></span>
          <h3 className="text-[16px] font-extrabold text-[#17191C]">{filtersActive ? "No products match your filters" : "No products yet"}</h3>
          <p className="max-w-sm text-[13px] text-[#5F6871]">{filtersActive ? "Try a different keyword or clear the filters to see everything." : "Add your first product and it can be published to the website straight away."}</p>
          <button onClick={filtersActive ? clearFilters : handleOpenAdd} className="mt-1 rounded-xl bg-[#17191C] px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#C80808]">{filtersActive ? "Clear filters" : "Add product"}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {visible.map((p) => (
            <article key={p.id} className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#17191C] shadow-[0_10px_30px_-14px_rgba(23,25,28,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-18px_rgba(23,25,28,0.65)]">
              <Thumb src={p.image} alt={p.name} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-110" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1013] via-[#0E1013]/35 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />

              <button onClick={() => handleTogglePublished(p)} title={p.is_published ? "Live on website — click to unpublish" : "Draft — click to publish"} className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-wider shadow-md backdrop-blur transition-transform hover:scale-105 ${p.is_published ? "bg-emerald-500/95 text-white" : "bg-white/90 text-[#3F3F46]"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${p.is_published ? "bg-white" : "bg-[#A1A1AA]"}`} />{p.is_published ? "Live" : "Draft"}
              </button>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <h3 className="line-clamp-3 min-w-0 flex-1 text-[1.05rem] font-extrabold leading-snug !text-white drop-shadow" title={p.name}>{p.name}</h3>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => handleOpenEdit(p)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#17191C] shadow-lg transition-all hover:scale-110 hover:bg-[#C80808] hover:text-white" title="Edit" aria-label="Edit product"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteConfirmId(p.id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white shadow-lg backdrop-blur transition-all hover:scale-110 hover:bg-[#C80808]" title="Delete" aria-label="Delete product"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              {deleteConfirmId === p.id && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#0E1013]/90 p-5 text-center backdrop-blur-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C80808]/20 text-[#FF6A4D]"><Trash2 className="h-5 w-5" /></span>
                  <p className="text-[14px] font-bold text-white">Delete this product?</p>
                  <div className="flex gap-2.5"><button onClick={() => handleDelete(p.id)} className="rounded-full bg-[#C80808] px-5 py-2 text-[12.5px] font-bold text-white hover:bg-[#A81010]">Delete</button><button onClick={() => setDeleteConfirmId(null)} className="rounded-full bg-white/15 px-5 py-2 text-[12.5px] font-bold text-white hover:bg-white/25">Cancel</button></div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && shown.length > PAGE_SIZE && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-[12.5px] text-[#5F6871]">Showing <b className="text-[#17191C]">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, shown.length)}</b> of <b className="text-[#17191C]">{shown.length}</b> products</p>
          <div className="inline-flex items-center gap-1.5">
            <button disabled={page === 1} onClick={() => setPage((n) => n - 1)} className="rounded-xl border border-[#E4E4E7] bg-white p-2 text-[#17191C] transition-colors hover:border-[#C80808]/40 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`h-9 min-w-9 rounded-xl px-3 text-[12.5px] font-bold transition-colors ${n === page ? "bg-[#C80808] text-white shadow-sm" : "border border-[#E4E4E7] bg-white text-[#17191C] hover:border-[#C80808]/40"}`}>{n}</button>
            ))}
            <button disabled={page === pages} onClick={() => setPage((n) => n + 1)} className="rounded-xl border border-[#E4E4E7] bg-white p-2 text-[#17191C] transition-colors hover:border-[#C80808]/40 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#14161A]/70 p-4 backdrop-blur-sm sm:items-center" onClick={() => setShowModal(false)}>
          <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="relative my-6 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_40px_120px_rgba(0,0,0,0.5)] animate-[routepop2_.35s_cubic-bezier(.2,.9,.25,1.1)_both]">
            <div className="relative flex shrink-0 items-center justify-between gap-4 border-b border-[#EEF0F3] px-6 py-5 sm:px-8">
              <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#C80808] via-[#E0A21A] to-[#F2B93B]" />
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D40E0E] to-[#E0A21A] text-white shadow-[0_8px_18px_-6px_rgba(212,14,14,0.6)]">{editingProduct ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}</span>
                <div><h3 className="text-[18px] font-black text-[#17191C]">{editingProduct ? "Edit product" : "Add a new product"}</h3><p className="text-[12.5px] text-[#5F6871]">{editingProduct ? editingProduct.name : "Fill in the details below. You can publish it right away or save it as a draft."}</p></div>
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-xl p-2 text-[#5F6871] transition-colors hover:bg-[#F5F6F7] hover:text-[#17191C]" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
                {formError && <div className="flex items-start gap-2 rounded-xl border border-[#C80808]/25 bg-[#FBE9EC] p-3 text-[13px] text-[#C80808]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{formError}</div>}

                <section>
                  <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">Basics</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className={label}>Product name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={field} placeholder="e.g. Double Ferrule Male Connector (SS316)" /></div>
                    <div><label className={label}>URL slug</label><input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className={`${field} font-mono`} placeholder="auto-generated if left blank" /></div>
                    <div><label className={label}>Division *</label><Dropdown full value={formData.division} onChange={(v) => setFormData({ ...formData, division: v })} options={[{ value: "instrumentation", label: "Instrumentation & Valves" }, { value: "chemicals", label: "Chemicals & Water Treatment" }]} /></div>
                    <div><label className={label}>Category *</label><Dropdown full value={formData.category_slug} onChange={(v) => setFormData({ ...formData, category_slug: v })} placeholder="Choose a category" options={categories.map((c: any) => ({ value: c.slug, label: c.name, hint: c.division === "chemicals" ? "Chemicals" : "Instrumentation" }))} /></div>
                  </div>
                </section>

                <section>
                  <ImageUploadField
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    label="Product Image"
                    hint="Upload directly from your device or paste an image URL. Shown on product cards and technical detail pages."
                  />
                </section>

                <section>
                  <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">Description</h4>
                  <div className="space-y-4">
                    <div><label className={label}>Short description</label><textarea rows={2} value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} className={field} placeholder="One or two lines for product cards and catalogues…" /></div>
                    <div><label className={label}>Overview & engineering details</label><textarea rows={4} value={formData.overview} onChange={(e) => setFormData({ ...formData, overview: e.target.value })} className={field} placeholder="Detailed engineering overview…" /></div>
                  </div>
                </section>

                <section>
                  <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#C80808]">Technical specifications</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className={label}>Material</label><input type="text" value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} className={field} placeholder="e.g. Stainless Steel 316 / Inconel 625" /></div>
                    <div><label className={label}>Size / range</label><input type="text" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} className={field} placeholder={'e.g. 1/8" to 1" O.D. tube'} /></div>
                    <div><label className={label}>Pressure rating</label><input type="text" value={formData.pressure_rating} onChange={(e) => setFormData({ ...formData, pressure_rating: e.target.value })} className={field} placeholder="e.g. Up to 6,000 PSI (413 bar)" /></div>
                    <div><label className={label}>Connection type</label><input type="text" value={formData.connection_type} onChange={(e) => setFormData({ ...formData, connection_type: e.target.value })} className={field} placeholder="e.g. Double Ferrule x NPT Male" /></div>
                  </div>
                </section>

                <section className="flex items-center justify-between gap-4 rounded-2xl border border-[#EEF0F3] bg-white p-4">
                  <div><p className="text-[13.5px] font-bold text-[#17191C]">Publish to the website</p><p className="text-[12px] text-[#5F6871]">{formData.is_published ? "Visitors will see this product right away." : "Saved as a draft. Visitors will not see it."}</p></div>
                  <Toggle on={formData.is_published} onClick={() => setFormData({ ...formData, is_published: !formData.is_published })} label="Publish product" />
                </section>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#EEF0F3] bg-white px-6 py-4 sm:px-8">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border-2 border-[#E7E9EE] px-5 py-2.5 text-[13.5px] font-bold text-[#17191C] transition-colors hover:border-[#17191C]">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-r from-[#C80808] to-[#E0A21A] px-6 py-2.5 text-[13.5px] font-extrabold text-white shadow-[0_10px_24px_-8px_rgba(200,8,8,0.6)] transition-transform hover:-translate-y-0.5 disabled:opacity-60">{saving ? "Saving…" : editingProduct ? "Save changes" : "Create product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
