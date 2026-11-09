"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";
import ImageUploadField from "@/components/admin/ImageUploadField";

import { ModalFrame, ConfirmDialog } from "@/components/admin/Modal";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  X,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingInd, setEditingInd] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    short_overview: "",
    detailed_overview: "",
    image: "",
    display_order: 1,
    is_published: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/industries");
      const json = await res.json();
      if (json.success) setIndustries(json.industries);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleOpenAdd = () => {
    setEditingInd(null);
    setFormData({
      name: "",
      slug: "",
      tagline: "",
      short_overview: "",
      detailed_overview: "",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      display_order: industries.length + 1,
      is_published: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (ind: any) => {
    setEditingInd(ind);
    setFormData({
      name: ind.name || "",
      slug: ind.slug || "",
      tagline: ind.tagline || "",
      short_overview: ind.short_overview || "",
      detailed_overview: ind.detailed_overview || "",
      image: ind.image || "",
      display_order: ind.display_order || 1,
      is_published: ind.is_published ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingInd) {
        const res = await fetch("/api/admin/industries", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingInd.id, ...formData }),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          fetchIndustries();
        }
      } else {
        const res = await fetch("/api/admin/industries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          fetchIndustries();
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
      const res = await fetch(`/api/admin/industries?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirmId(null);
        fetchIndustries();
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17191C]">
            Industries & Key Sectors
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6871]">
            Target industry sectors served (Oil & Gas, Power, Marine, Petrochemicals) on public /industries.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C80808] hover:bg-[#A81010] text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Sector</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full"><WorkspaceLoader compact /></div>
        ) : industries.map((ind) => (
          <div
            key={ind.id}
            className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#C80808] transition-colors"
          >
            <div>
              <div className="h-36 bg-[#F5F6F7] relative border-b border-[#D8DDE2]">
                {ind.image && <Image src={ind.image} alt={ind.name} fill className="object-cover" />}
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#17191C] text-white">
                  Order #{ind.display_order}
                </span>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-mono text-[#929DA7] mb-1">/{ind.slug}</p>
                <h3 className="text-base font-bold text-[#17191C] mb-1">{ind.name}</h3>
                <p className="text-xs text-[#C80808] font-semibold mb-2">{ind.tagline}</p>
                <p className="text-xs text-[#5F6871] line-clamp-2">{ind.short_overview}</p>
              </div>
            </div>

            <div className="p-4 border-t border-[#D8DDE2] bg-[#F5F6F7]/50 flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase ${ind.is_published ? "text-emerald-700" : "text-gray-500"}`}>
                {ind.is_published ? "Active" : "Hidden"}
              </span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handleOpenEdit(ind)} className="p-1.5 text-[#5F6871] hover:text-[#17191C]">
                  <Edit className="w-4 h-4" />
                </button>
                {deleteConfirmId === ind.id ? (
                  <button onClick={() => handleDelete(ind.id)} className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">
                    Confirm
                  </button>
                ) : (
                  <button onClick={() => setDeleteConfirmId(ind.id)} className="p-1.5 text-[#929DA7] hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ModalFrame onClose={() => setShowModal(false)} eyebrow="Industries" title={editingInd ? "Edit industry" : "Add an industry"} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">Industry Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                />
              </div>
              <div>
                <ImageUploadField
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Industry Image"
                  hint="Upload from device or enter URL."
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">Short Overview</label>
                <textarea
                  rows={2}
                  value={formData.short_overview}
                  onChange={(e) => setFormData({ ...formData, short_overview: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8DDE2]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-[#5F6871]">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-[#C80808] text-white text-xs font-bold">
                  {saving ? "Saving..." : "Save Sector"}
                </button>
              </div>
            </form>
      </ModalFrame>
      )}
    </div>
  );
}
