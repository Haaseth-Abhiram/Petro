"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Layers,
  Mail,
  FileSpreadsheet,
  FileText,
  FileEdit,
  Flame,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const [statsRes, userRes] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/auth/me").then((r) => r.json()),
      ]);

      if (statsRes.success) setData(statsRes);
      if (userRes.authenticated) setCurrentUser(userRes.user);
    } catch (e) {
      console.error("Failed to load dashboard stats:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-10 h-10 border-4 border-[#C80808] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#5F6871]">Loading live metrics from Supabase...</p>
      </div>
    );
  }

  const stats = data?.stats;
  const recentRfqs = data?.recentRfqs || [];
  const recentEnquiries = data?.recentEnquiries || [];
  const recentLogs = data?.recentLogs || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="bg-[#17191C] rounded-2xl p-6 sm:p-8 text-white border border-[#2A2E34] relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[#C80808]/10 blur-[90px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#C80808] mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role: {currentUser?.role || "Admin"} • Database Connected</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Petro Engineering Administration Center
            </h2>
            <p className="text-sm text-white/70 max-w-2xl mt-1.5 leading-relaxed">
              Real-time monitoring and database management for industrial chemicals, high-pressure instrumentation, client RFQs, and catalog specifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchStats}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors border border-white/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#C80808]" : ""}`} />
              <span>Refresh Metrics</span>
            </button>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C80808] hover:bg-[#8A0A0A] text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(200,8,8,0.3)]"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Products</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Products Card */}
        <Link
          href="/admin/products"
          className="bg-white rounded-xl p-5 border border-[#D8DDE2] hover:border-[#C80808] transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5F6871]">
              Products
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#17191C] text-[#C80808] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#17191C] tracking-tight mb-1">
            {stats?.products?.total ?? 0}
          </div>
          <div className="flex items-center justify-between text-xs text-[#5F6871]">
            <span className="text-emerald-700 font-semibold">
              {stats?.products?.published ?? 0} Active / Published
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#929DA7] group-hover:translate-x-1 group-hover:text-[#C80808] transition-all" />
          </div>
        </Link>

        {/* Categories Card */}
        <Link
          href="/admin/categories"
          className="bg-white rounded-xl p-5 border border-[#D8DDE2] hover:border-[#C80808] transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5F6871]">
              Categories
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#17191C] text-[#C80808] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#17191C] tracking-tight mb-1">
            {stats?.categories?.total ?? 0}
          </div>
          <div className="flex items-center justify-between text-xs text-[#5F6871]">
            <span>
              {stats?.categories?.chemicals ?? 0} Chem • {stats?.categories?.instrumentation ?? 0} Inst
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#929DA7] group-hover:translate-x-1 group-hover:text-[#C80808] transition-all" />
          </div>
        </Link>

        {/* RFQ Quote Requests Card */}
        <Link
          href="/admin/quote-requests"
          className="bg-white rounded-xl p-5 border border-[#D8DDE2] hover:border-[#C80808] transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5F6871]">
              Quote Requests (RFQ)
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#C80808]/10 text-[#C80808] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#17191C] tracking-tight mb-1 flex items-baseline gap-2">
            <span>{stats?.rfqs?.total ?? 0}</span>
            {stats?.rfqs?.new > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#C80808] text-white">
                {stats.rfqs.new} NEW
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-[#5F6871]">
            <span>Engineering Procurement RFQs</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#929DA7] group-hover:translate-x-1 group-hover:text-[#C80808] transition-all" />
          </div>
        </Link>

        {/* Customer Enquiries Card */}
        <Link
          href="/admin/enquiries"
          className="bg-white rounded-xl p-5 border border-[#D8DDE2] hover:border-[#C80808] transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5F6871]">
              Customer Enquiries
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#17191C] text-[#C80808] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#17191C] tracking-tight mb-1 flex items-baseline gap-2">
            <span>{stats?.enquiries?.total ?? 0}</span>
            {stats?.enquiries?.new > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                {stats.enquiries.new} NEW
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-[#5F6871]">
            <span>Contact & Support Queries</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#929DA7] group-hover:translate-x-1 group-hover:text-[#C80808] transition-all" />
          </div>
        </Link>
      </div>

      {/* Two Column Layout: Recent RFQs & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent RFQ Submissions */}
        <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#D8DDE2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C80808]/10 text-[#C80808] flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17191C]">
                  Recent Quotation Requests
                </h3>
                <p className="text-[11px] text-[#5F6871]">
                  Direct submissions from public /request-a-quote
                </p>
              </div>
            </div>
            <Link
              href="/admin/quote-requests"
              className="text-xs font-bold text-[#C80808] hover:text-[#8A0A0A] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#D8DDE2] flex-1">
            {recentRfqs.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5F6871]">
                No quotation requests received yet. Submissions from the public RFQ form will appear here.
              </div>
            ) : (
              recentRfqs.map((rfq: any) => (
                <div
                  key={rfq.id}
                  className="p-4 hover:bg-[#F5F6F7] transition-colors flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-[#17191C] truncate">
                        {rfq.product_name}
                      </span>
                      {rfq.quantity && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F5F6F7] text-[#17191C] border border-[#D8DDE2]">
                          Qty: {rfq.quantity}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5F6871] truncate">
                      {rfq.company_name} • {rfq.full_name} ({rfq.email})
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rfq.status === "new"
                          ? "bg-[#C80808] text-white"
                          : rfq.status === "resubmitted"
                          ? "bg-[#17191C] text-[#C80808] border border-[#C80808]/30"
                          : rfq.status === "quoted"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rfq.status}
                    </span>
                    <p className="text-[10px] text-[#929DA7] mt-1">
                      {new Date(rfq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contact Enquiries */}
        <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#D8DDE2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#17191C] text-[#C80808] flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17191C]">
                  Recent Contact Inquiries
                </h3>
                <p className="text-[11px] text-[#5F6871]">
                  Direct submissions from public /contact
                </p>
              </div>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-[#C80808] hover:text-[#8A0A0A] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#D8DDE2] flex-1">
            {recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5F6871]">
                No contact enquiries received yet. Messages sent via the Contact page will appear here.
              </div>
            ) : (
              recentEnquiries.map((enq: any) => (
                <div
                  key={enq.id}
                  className="p-4 hover:bg-[#F5F6F7] transition-colors flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-[#17191C] truncate mb-0.5">
                      {enq.subject}
                    </p>
                    <p className="text-xs text-[#5F6871] truncate">
                      {enq.full_name} {enq.company_name ? `(${enq.company_name})` : ""} • {enq.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        enq.status === "new"
                          ? "bg-emerald-600 text-white"
                          : enq.status === "in_progress"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {enq.status}
                    </span>
                    <p className="text-[10px] text-[#929DA7] mt-1">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Role-Specific Bottom Section */}
      {currentUser?.role === "Super Admin" ? (
        /* Security & Audit Logs Section (Super Admin Only) */
        <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#D8DDE2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#17191C] text-white flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17191C]">
                  Security Audit Log (Super Admin)
                </h3>
                <p className="text-[11px] text-[#5F6871]">
                  Live chronological record of administrative operations
                </p>
              </div>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-bold text-[#C80808] hover:text-[#8A0A0A] flex items-center gap-1"
            >
              <span>View Full Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#D8DDE2]">
            {recentLogs.map((log: any) => (
              <div
                key={log.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-[#17191C] text-white text-[10px] font-mono font-bold shrink-0">
                    {log.action}
                  </span>
                  <span className="font-semibold text-[#17191C]">
                    {log.admin_email}
                  </span>
                  <span className="text-[#5F6871] hidden md:inline">
                    on {log.entity_type}
                  </span>
                </div>
                <span className="text-[#929DA7] text-[11px]">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Operations Quick Access (Admin Role) */
        <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm p-6">
          <h3 className="text-sm font-bold text-[#17191C] mb-1">
            Operations Quick Actions
          </h3>
          <p className="text-xs text-[#5F6871] mb-5">
            Quick links for managing your daily product catalogue, client requests, and content.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/products"
              className="p-4 rounded-xl bg-[#F5F6F7] hover:bg-[#17191C] text-[#17191C] hover:text-white transition-all group border border-[#D8DDE2]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#C80808] text-white flex items-center justify-center mb-3">
                <Plus className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold">Add Product</p>
              <p className="text-[11px] text-[#5F6871] group-hover:text-white/70 mt-0.5">
                Create new chemical or valve spec
              </p>
            </Link>

            <Link
              href="/admin/quote-requests"
              className="p-4 rounded-xl bg-[#F5F6F7] hover:bg-[#17191C] text-[#17191C] hover:text-white transition-all group border border-[#D8DDE2]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#C80808] text-white flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold">Process RFQs</p>
              <p className="text-[11px] text-[#5F6871] group-hover:text-white/70 mt-0.5">
                Review line requests & quotes
              </p>
            </Link>

            <Link
              href="/admin/enquiries"
              className="p-4 rounded-xl bg-[#F5F6F7] hover:bg-[#17191C] text-[#17191C] hover:text-white transition-all group border border-[#D8DDE2]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#C80808] text-white flex items-center justify-center mb-3">
                <Mail className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold">View Inquiries</p>
              <p className="text-[11px] text-[#5F6871] group-hover:text-white/70 mt-0.5">
                Respond to customer queries
              </p>
            </Link>

            <Link
              href="/admin/content"
              className="p-4 rounded-xl bg-[#F5F6F7] hover:bg-[#17191C] text-[#17191C] hover:text-white transition-all group border border-[#D8DDE2]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#C80808] text-white flex items-center justify-center mb-3">
                <FileEdit className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold">Edit Website Content</p>
              <p className="text-[11px] text-[#5F6871] group-hover:text-white/70 mt-0.5">
                Update headlines & phone/email
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
