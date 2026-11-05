"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";
import ImageUploadField from "@/components/admin/ImageUploadField";

import { ModalFrame, ConfirmDialog } from "@/components/admin/Modal";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Flame,
  Plus,
  Edit,
  Trash2,
  X,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_desc: "",
    overview: "",
    icon_name: "Flame",
    image: "",
    display_order: 1,
    is_published: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      const json = await res.json();
      if (json.success) setServices(json.services);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      short_desc: "",
      overview: "",
      icon_name: "Flame",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      display_order: services.length + 1,
      is_published: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: any) => {
    setEditingService(s);
    setFormData({
      title: s.title || "",
      slug: s.slug || "",
      short_desc: s.short_desc || "",
      overview: s.overview || "",
      icon_name: s.icon_name || "Flame",
      image: s.image || "",
      display_order: s.display_order || 1,
      is_published: s.is_published ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingService) {
        const res = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingService.id, ...formData }),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          fetchServices();
        }
      } else {
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          fetchServices();
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
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setDeleteConfirmId(null);
        fetchServices();
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17191C]">
            Engineering & Sourcing Services
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6871]">
            Manage technical services displayed on the public /services page.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C80808] hover:bg-[#8A0A0A] text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full"><WorkspaceLoader compact /></div>
        ) : services.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#C80808] transition-colors"
          >
            <div>
              <div className="h-36 bg-[#F5F6F7] relative border-b border-[#D8DDE2]">
                {s.image && <Image src={s.image} alt={s.title} fill className="object-cover" />}
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#17191C] text-white">
                  Order #{s.display_order}
                </span>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-mono text-[#929DA7] mb-1">/{s.slug}</p>
                <h3 className="text-base font-bold text-[#17191C] mb-2">{s.title}</h3>
                <p className="text-xs text-[#5F6871] line-clamp-2">{s.short_desc}</p>
              </div>
            </div>

            <div className="p-4 border-t border-[#D8DDE2] bg-[#F5F6F7]/50 flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase ${s.is_published ? "text-emerald-700" : "text-gray-500"}`}>
                {s.is_published ? "Active" : "Hidden"}
              </span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handleOpenEdit(s)} className="p-1.5 text-[#5F6871] hover:text-[#17191C]">
                  <Edit className="w-4 h-4" />
                </button>
                {deleteConfirmId === s.id ? (
                  <button onClick={() => handleDelete(s.id)} className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">
                    Confirm
                  </button>
                ) : (
                  <button onClick={() => setDeleteConfirmId(s.id)} className="p-1.5 text-[#929DA7] hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ModalFrame onClose={() => setShowModal(false)} eyebrow="Services" title={editingService ? "Edit service" : "Add a service"} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <ImageUploadField
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Service Image"
                  hint="Upload from device or enter URL."
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">Detailed Overview</label>
                <textarea
                  rows={3}
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D8DDE2]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-[#5F6871]">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-[#C80808] text-white text-xs font-bold">
                  {saving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
      </ModalFrame>
      )}
    </div>
  );
}
