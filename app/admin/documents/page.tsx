"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";

import { ModalFrame, ConfirmDialog } from "@/components/admin/Modal";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  X,
  ExternalLink,
  Download,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Instrumentation",
    type: "Catalogue",
    description: "",
    file_url: "/resources",
    file_size: "2.4 MB",
    is_published: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const url =
        categoryFilter !== "all"
          ? `/api/admin/documents?category=${categoryFilter}`
          : "/api/admin/documents";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setDocuments(json.documents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [categoryFilter]);

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setFormData({
      title: "",
      category: "Instrumentation",
      type: "Catalogue",
      description: "",
      file_url: "/resources",
      file_size: "2.5 MB",
      is_published: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (doc: any) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title || "",
      category: doc.category || "Instrumentation",
      type: doc.type || "Catalogue",
      description: doc.description || "",
      file_url: doc.file_url || "/resources",
      file_size: doc.file_size || "1.8 MB",
      is_published: doc.is_published ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingDoc) {
        const res = await fetch("/api/admin/documents", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingDoc.id, ...formData }),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          fetchDocs();
        } else {
          alert(json.message);
        }
      } else {
        const res = await fetch("/api/admin/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          fetchDocs();
        } else {
          alert(json.message);
        }
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/documents?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirmId(null);
        fetchDocs();
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17191C]">
            Documents, Catalogues & Brochures
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6871]">
            Manage technical datasheets, MTC verification certificates, fitting catalogues, and whitepapers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C80808] hover:bg-[#A81010] text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(200,8,8,0.3)] shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D8DDE2] pb-3">
        {[
          { id: "all", label: "All Documents" },
          { id: "Chemicals", label: "Chemicals" },
          { id: "Instrumentation", label: "Instrumentation" },
          { id: "Engineering Services", label: "Engineering Services" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              categoryFilter === tab.id
                ? "bg-[#17191C] text-white shadow-sm"
                : "text-[#5F6871] hover:text-[#17191C] hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full"><WorkspaceLoader compact /></div>
        ) : documents.length === 0 ? (
          <div className="col-span-full py-16 text-center text-[#5F6871]">
            No documents found in this section.
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm p-5 flex flex-col justify-between hover:border-[#C80808] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C80808]/10 text-[#C80808] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#17191C] text-white">
                      {doc.type}
                    </span>
                    <span className="text-[10px] text-[#5F6871] font-semibold">
                      {doc.file_size}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#17191C] mb-1.5 leading-snug">
                  {doc.title}
                </h3>
                <p className="text-xs text-[#5F6871] line-clamp-2 leading-relaxed mb-4">
                  {doc.description || "Technical reference document."}
                </p>
              </div>

              <div className="pt-3 border-t border-[#D8DDE2] flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    doc.is_published ? "text-emerald-700" : "text-gray-500"
                  }`}
                >
                  {doc.is_published ? "Available" : "Hidden"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(doc)}
                    className="p-1.5 rounded text-[#5F6871] hover:text-[#17191C] hover:bg-[#F5F6F7]"
                    title="Edit Document"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === doc.id ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(doc.id)}
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
                      onClick={() => setDeleteConfirmId(doc.id)}
                      className="p-1.5 rounded text-[#929DA7] hover:text-red-600 hover:bg-red-50"
                      title="Delete Document"
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

      {/* Modal */}
      {showModal && (
        <ModalFrame onClose={() => setShowModal(false)} eyebrow="Documents" title={editingDoc ? "Edit document" : "Upload a new document"} size="lg">
        <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#C80808] outline-none"
                  placeholder="e.g. Master Instrumentation Valve Catalogue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                  >
                    <option value="Instrumentation">Instrumentation</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Engineering Services">Engineering Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    Document Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                  >
                    <option value="Catalogue">Catalogue</option>
                    <option value="Datasheet">Datasheet</option>
                    <option value="Brochure">Brochure</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Whitepaper">Whitepaper</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    File URL / Path
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.file_url}
                    onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                    placeholder="/resources or https://..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    File Size Label
                  </label>
                  <input
                    type="text"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                    placeholder="e.g. 2.4 MB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                  placeholder="Brief description of contents..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="docPub"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#C80808] focus:ring-[#C80808]"
                />
                <label htmlFor="docPub" className="text-xs font-semibold text-[#17191C] cursor-pointer">
                  Document Available for Public Download
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
                  className="px-5 py-2 rounded-lg bg-[#C80808] hover:bg-[#A81010] text-white text-xs font-bold shadow-sm disabled:opacity-70"
                >
                  {saving ? "Saving..." : editingDoc ? "Save Changes" : "Create Document"}
                </button>
              </div>
            </form>
      </ModalFrame>
      )}
    </div>
  );
}
