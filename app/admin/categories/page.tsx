"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Package,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [divisionFilter, setDivisionFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    division: "instrumentation",
    short_description: "",
    detailed_description: "",
    image: "",
    display_order: 1,
    is_published: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const url =
        divisionFilter !== "all"
          ? `/api/admin/categories?division=${divisionFilter}`
          : "/api/admin/categories";
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

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      division: "instrumentation",
      short_description: "",
      detailed_description: "",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      display_order: categories.length + 1,
      is_published: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCategory(c);
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
    try {
      if (editingCategory) {
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCategory.id, ...formData }),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          fetchCategories();
        } else {
          alert(json.error || json.message);
        }
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          fetchCategories();
        } else {
          alert(json.error || json.message);
        }
      }
    } catch (err: any) {
      alert(err.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirmId(null);
        fetchCategories();
      } else {
        alert(json.message);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17191C]">
            Product Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6871]">
            Organize chemicals and instrumentation lines, update descriptions, and manage display order.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C80808] hover:bg-[#8A0A0A] text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(200,8,8,0.3)] shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Division Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D8DDE2] pb-3">
        {[
          { id: "all", label: "All Categories" },
          { id: "chemicals", label: "Chemicals & Water Treatment" },
          { id: "instrumentation", label: "Instrumentation & Valves" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDivisionFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              divisionFilter === tab.id
                ? "bg-[#17191C] text-white shadow-sm"
                : "text-[#5F6871] hover:text-[#17191C] hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-[#5F6871]">
            <div className="w-7 h-7 border-3 border-[#C80808] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading categories from Supabase...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-16 text-center text-[#5F6871]">
            No categories found for this selection.
          </div>
        ) : (
          categories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#C80808] transition-colors group"
            >
              <div>
                {/* Header Image banner */}
                <div className="h-36 bg-[#F5F6F7] relative overflow-hidden border-b border-[#D8DDE2]">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#929DA7]">
                      <Layers className="w-8 h-8" />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm ${
                      c.division === "chemicals"
                        ? "bg-blue-600 text-white"
                        : "bg-[#17191C] text-white"
                    }`}
                  >
                    {c.division}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#929DA7] font-mono truncate">
                      /{c.slug}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F5F6F7] text-[#17191C] border border-[#D8DDE2]">
                      {c.product_count || 0} Products
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#17191C] mb-2 leading-tight">
                    {c.name}
                  </h3>
                  <p className="text-xs text-[#5F6871] line-clamp-2 leading-relaxed">
                    {c.short_description || "No short description provided."}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-5 py-3 border-t border-[#D8DDE2] bg-[#F5F6F7]/50 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    c.is_published ? "text-emerald-700" : "text-gray-500"
                  }`}
                >
                  {c.is_published ? "Published" : "Draft"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded text-[#5F6871] hover:text-[#17191C] hover:bg-white"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === c.id ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="px-2 py-1 rounded bg-red-600 text-white font-bold text-[10px]"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 rounded text-[#5F6871]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(c.id)}
                      className="p-1.5 rounded text-[#929DA7] hover:text-red-600 hover:bg-red-50"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#D8DDE2] shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#D8DDE2] flex items-center justify-between bg-[#F5F6F7]/50">
              <h3 className="text-lg font-bold text-[#17191C]">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-[#929DA7] hover:text-[#17191C] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#C80808] outline-none"
                  placeholder="e.g. Tube Fittings (Double Ferrule)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#C80808] outline-none font-mono"
                    placeholder="tube-fittings"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    Division *
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#C80808] outline-none"
                  >
                    <option value="instrumentation">Instrumentation & Valves</option>
                    <option value="chemicals">Chemicals & Water Treatment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#C80808] outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#C80808] outline-none"
                  placeholder="Summary for navigation and category cards..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={formData.detailed_description}
                  onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#C80808] outline-none"
                  placeholder="Engineering overview displayed on category page..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catPub"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#C80808] focus:ring-[#C80808]"
                />
                <label htmlFor="catPub" className="text-xs font-semibold text-[#17191C] cursor-pointer">
                  Category is Active / Published on Website
                </label>
              </div>

              <div className="pt-4 border-t border-[#D8DDE2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#D8DDE2] text-xs font-bold text-[#5F6871] hover:bg-[#F5F6F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#C80808] hover:bg-[#8A0A0A] text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
