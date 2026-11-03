"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  Eye,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({
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
  });
  const [saving, setSaving] = useState(false);
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
    fetchProducts();
  }, [search, divisionFilter, categoryFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      division: "instrumentation",
      category_slug: categories[0]?.slug || "tube-fittings",
      short_description: "",
      overview: "",
      image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
      material: "",
      size: "",
      pressure_rating: "",
      connection_type: "",
      temperature_range: "",
      is_published: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
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
    try {
      if (editingProduct) {
        // Update
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, ...formData }),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          fetchProducts();
        } else {
          alert(json.error || json.message);
        }
      } else {
        // Create
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (json.success) {
          setShowModal(false);
          fetchProducts();
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

  const handleTogglePublished = async (p: any) => {
    try {
      await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, is_published: !p.is_published }),
      });
      fetchProducts();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17191C]">
            Product Catalogue Management
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6871]">
            Create, update, publish, or remove chemical solutions and instrumentation hardware.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF4B32] hover:bg-[#E03820] text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(255,75,50,0.3)] shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#D8DDE2] shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#929DA7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, slug, material, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D8DDE2] text-xs sm:text-sm focus:border-[#FF4B32] focus:ring-1 focus:ring-[#FF4B32] outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs font-semibold bg-white text-[#17191C] outline-none"
          >
            <option value="all">All Divisions</option>
            <option value="chemicals">Chemicals & Water</option>
            <option value="instrumentation">Instrumentation</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs font-semibold bg-white text-[#17191C] outline-none max-w-[200px]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={fetchProducts}
            className="p-2 rounded-lg border border-[#D8DDE2] text-[#5F6871] hover:text-[#17191C] hover:bg-[#F5F6F7]"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6F7] border-b border-[#D8DDE2] text-[#5F6871] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Division & Category</th>
                <th className="py-3.5 px-4">Specs (Material / Rating)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DDE2]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5F6871]">
                    <div className="w-6 h-6 border-2 border-[#FF4B32] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading products from database...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5F6871]">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F5F6F7]/60 transition-colors">
                    {/* Product Name + Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2] overflow-hidden shrink-0 relative">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-[#929DA7] m-auto" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#17191C] truncate max-w-[280px]">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-[#929DA7] font-mono truncate max-w-[280px]">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Division & Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                          p.division === "chemicals"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-[#17191C] text-white"
                        }`}
                      >
                        {p.division}
                      </span>
                      <p className="text-[#5F6871] text-[11px] truncate max-w-[200px]">
                        {p.category_name || p.category_slug}
                      </p>
                    </td>

                    {/* Specs */}
                    <td className="py-3.5 px-4 text-[#5F6871]">
                      {p.material && (
                        <p className="truncate max-w-[200px]">
                          <strong>Mat:</strong> {p.material}
                        </p>
                      )}
                      {p.pressure_rating && (
                        <p className="truncate max-w-[200px]">
                          <strong>Press:</strong> {p.pressure_rating}
                        </p>
                      )}
                      {!p.material && !p.pressure_rating && (
                        <span className="text-[#929DA7] italic">Standard Line</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublished(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          p.is_published
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {p.is_published ? "Published" : "Draft"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded text-[#5F6871] hover:text-[#17191C] hover:bg-[#F5F6F7]"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {deleteConfirmId === p.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(p.id)}
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
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 rounded text-[#929DA7] hover:text-red-600 hover:bg-red-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#D8DDE2] shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-[#D8DDE2] flex items-center justify-between bg-[#F5F6F7]/50">
              <h3 className="text-lg font-bold text-[#17191C]">
                {editingProduct ? "Edit Product Item" : "Create New Product Item"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-[#929DA7] hover:text-[#17191C] rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#FF4B32] outline-none"
                    placeholder="e.g. Double Ferrule Male Connector (SS316)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#FF4B32] outline-none font-mono"
                    placeholder="auto-generated from name if left blank"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    Division *
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#FF4B32] outline-none"
                  >
                    <option value="instrumentation">Instrumentation & Valves</option>
                    <option value="chemicals">Chemicals & Water Treatment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category_slug}
                    onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#FF4B32] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.division})
                      </option>
                    ))}
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
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#FF4B32] outline-none"
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
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#FF4B32] outline-none"
                  placeholder="Summary for product cards and catalogues..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                  Overview & Engineering Details
                </label>
                <textarea
                  rows={3}
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs focus:border-[#FF4B32] outline-none"
                  placeholder="Detailed engineering overview..."
                />
              </div>

              {/* Technical Specifications */}
              <div className="pt-2 border-t border-[#D8DDE2]">
                <p className="text-xs font-extrabold uppercase text-[#17191C] mb-3">
                  Technical Specifications
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F6871] mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                      placeholder="e.g. Stainless Steel 316 / Inconel 625"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F6871] mb-1">
                      Size / Range
                    </label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                      placeholder='e.g. 1/8" to 1" O.D. Tube'
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F6871] mb-1">
                      Pressure Rating
                    </label>
                    <input
                      type="text"
                      value={formData.pressure_rating}
                      onChange={(e) => setFormData({ ...formData, pressure_rating: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                      placeholder="e.g. Up to 6,000 PSI (413 bar)"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F6871] mb-1">
                      Connection Type
                    </label>
                    <input
                      type="text"
                      value={formData.connection_type}
                      onChange={(e) => setFormData({ ...formData, connection_type: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D8DDE2] text-xs outline-none"
                      placeholder="e.g. Double Ferrule x NPT Male"
                    />
                  </div>
                </div>
              </div>

              {/* Publication Status */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FF4B32] focus:ring-[#FF4B32]"
                />
                <label htmlFor="pubCheck" className="text-xs font-semibold text-[#17191C] cursor-pointer">
                  Publish product immediately to public website
                </label>
              </div>

              {/* Submit Buttons */}
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
                  className="px-5 py-2 rounded-lg bg-[#FF4B32] hover:bg-[#E03820] text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {saving ? "Saving to Supabase..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
