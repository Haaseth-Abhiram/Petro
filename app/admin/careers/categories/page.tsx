"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";

import { ModalFrame, ConfirmDialog } from "@/components/admin/Modal";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Layers,
  ArrowUpDown,
  Briefcase,
  X,
  Check,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  job_count: number | string;
  created_at: string;
}

export default function JobCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formOrder, setFormOrder] = useState<number>(0);
  const [formActive, setFormActive] = useState<boolean>(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/careers/categories");
      const d = await res.json();
      if (d.success) {
        setCategories(d.categories || []);
      } else {
        showToast("error", d.message || "Failed to load categories");
      }
    } catch {
      showToast("error", "Network error while loading categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const openAddModal = () => {
    setActiveCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormOrder(categories.length ? Math.max(...categories.map((c) => c.display_order)) + 1 : 1);
    setFormActive(true);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setActiveCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || "");
    setFormOrder(cat.display_order);
    setFormActive(cat.is_active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast("error", "Category name is required");
      return;
    }

    setBusy(true);
    try {
      const payload = {
        name: formName.trim(),
        slug: formSlug.trim() || undefined,
        description: formDesc.trim() || null,
        displayOrder: Number(formOrder) || 0,
        isActive: formActive,
      };

      let res;
      if (activeCategory) {
        // Edit PUT
        res = await fetch(`/api/admin/careers/categories/${activeCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create POST
        res = await fetch("/api/admin/careers/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const d = await res.json();
      if (res.ok && d.success) {
        showToast("success", activeCategory ? "Category updated successfully" : "Category created successfully");
        setModalOpen(false);
        fetchCategories();
      } else {
        showToast("error", d.message || "Failed to save category");
      }
    } catch {
      showToast("error", "Error saving category");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!activeCategory) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/careers/categories/${activeCategory.id}`, {
        method: "DELETE",
      });
      const d = await res.json();
      if (res.ok && d.success) {
        showToast("success", "Category deleted successfully");
        setDeleteModalOpen(false);
        setActiveCategory(null);
        fetchCategories();
      } else {
        showToast("error", d.message || "Cannot delete category");
      }
    } catch {
      showToast("error", "Error deleting category");
    } finally {
      setBusy(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold transition-all animate-[fadeIn_.3s_ease] ${
            toast.type === "success"
              ? "bg-[#17191C] border-[#C80808] text-white"
              : "bg-red-500 border-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-[#FFA028]" /> : <AlertCircle className="w-5 h-5 text-white" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#929DA7] mb-1 font-semibold">
            <Link href="/admin/careers" className="hover:text-[#17191C]">
              Careers
            </Link>
            <span>/</span>
            <span className="text-[#C80808]">Job Categories</span>
          </div>
          <h1 className="text-2xl font-black text-[#17191C] tracking-tight flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-[#C80808]" />
            Job Categories
          </h1>
          <p className="text-sm text-[#5F6871] mt-0.5">
            Organize job openings into departments and career tracks for easy browsing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchCategories}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#D8DDE2] bg-white text-[#17191C] hover:bg-[#F5F6F7] hover:border-[#17191C] transition disabled:opacity-70"
            title="Refresh categories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#C80808]" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C80808]/70 to-[#FFA028]/70 text-white text-sm font-bold shadow-md shadow-[#C80808]/20 hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D8DDE2] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#929DA7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F5F6F7] border border-[#D8DDE2] rounded-xl text-[#17191C] placeholder:text-[#929DA7] focus:outline-none focus:border-[#C80808] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-[#5F6871] w-full sm:w-auto justify-end">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#C80808]" />
            {categories.length} Total Categories
          </span>
          <span className="h-3 w-[1px] bg-[#D8DDE2]" />
          <span className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            {categories.filter((c) => c.is_active).length} Active
          </span>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-[#D8DDE2] shadow-sm overflow-hidden">
        {loading ? (
          <WorkspaceLoader compact />
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F6F7] border border-[#D8DDE2] flex items-center justify-center mx-auto mb-3 text-[#929DA7]">
              <FolderTree className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#17191C]">No categories found</h3>
            <p className="text-sm text-[#5F6871] max-w-sm mx-auto mt-1 mb-4">
              {search ? "No categories matched your search query." : "No categories created yet. Create your first category to group jobs."}
            </p>
            {!search && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17191C] text-white text-xs font-bold hover:bg-[#C80808] transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Category Now
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D8DDE2] bg-[#F5F6F7]/75 text-[11px] font-extrabold uppercase tracking-wider text-[#5F6871]">
                  <th className="py-3.5 px-5">Order</th>
                  <th className="py-3.5 px-5">Category Name</th>
                  <th className="py-3.5 px-5">Slug</th>
                  <th className="py-3.5 px-5">Description</th>
                  <th className="py-3.5 px-5 text-center">Jobs Assigned</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8DDE2] text-sm">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#F5F6F7]/70 transition-colors">
                    <td className="py-4 px-5 font-mono text-xs font-bold text-[#929DA7]">
                      #{cat.display_order}
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-[#17191C] block">{cat.name}</span>
                    </td>
                    <td className="py-4 px-5 font-mono text-xs text-[#5F6871]">
                      {cat.slug}
                    </td>
                    <td className="py-4 px-5 max-w-xs text-xs text-[#5F6871] truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F6F7] border border-[#D8DDE2] text-xs font-bold text-[#17191C]">
                        <Briefcase className="w-3 h-3 text-[#C80808]" />
                        {cat.job_count}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      {cat.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300">
                          <X className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg border border-[#D8DDE2] hover:bg-[#F5F6F7] hover:border-[#17191C] text-[#17191C] transition"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveCategory(cat);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 transition"
                          title="Delete Category"
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

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <ModalFrame onClose={() => setModalOpen(false)} eyebrow="Job categories" title={activeCategory ? "Edit category" : "Add a new category"} size="md">
        <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales & Commercial"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!activeCategory) {
                      setFormSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "")
                      );
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8DDE2] text-sm text-[#17191C] focus:outline-none focus:border-[#C80808]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Slug (URL identifier)
                </label>
                <input
                  type="text"
                  placeholder="sales-and-commercial"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8DDE2] text-sm font-mono text-[#5F6871] focus:outline-none focus:border-[#C80808]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Description (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Short note about roles under this department..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8DDE2] text-sm text-[#17191C] focus:outline-none focus:border-[#C80808]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17191C] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8DDE2] text-sm text-[#17191C] focus:outline-none focus:border-[#C80808]"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      className="w-4 h-4 rounded text-[#C80808] focus:ring-[#C80808] border-[#D8DDE2]"
                    />
                    <span className="text-xs font-bold text-[#17191C]">Active Category</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D8DDE2] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D8DDE2] text-xs font-bold text-[#5F6871] hover:bg-[#F5F6F7] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C80808]/70 to-[#FFA028]/70 text-white text-xs font-extrabold shadow-md shadow-[#C80808]/20 hover:opacity-95 transition disabled:opacity-70"
                >
                  {busy ? "Saving..." : activeCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
      </ModalFrame>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && activeCategory && (
        <ConfirmDialog
          title="Delete this category?"
          busy={busy}
          confirmLabel="Yes, delete"
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          message={<>
            You are about to delete <b className="text-[#17191C]">{activeCategory.name}</b>. This cannot be undone.
            {Number(activeCategory.job_count) > 0 && (
              <span className="mt-3 block rounded-xl border border-[#C80808]/25 bg-[#FBE9EC] px-4 py-3 text-[13px] font-semibold text-[#C80808]">
                {activeCategory.job_count} job(s) are assigned to this category. Reassign or remove them before deleting.
              </span>
            )}
          </>}
        />
      )}
    </div>
  );
}
