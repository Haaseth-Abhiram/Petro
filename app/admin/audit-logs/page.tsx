"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";

import React, { useState, useEffect } from "react";
import SuperAdminGuard from "@/components/admin/SuperAdminGuard";
import {
  Clock,
  ShieldCheck,
  Search,
  RefreshCw,
  Eye,
  FileCode,
} from "lucide-react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/audit-logs?limit=100");
      const json = await res.json();
      if (json.success) setLogs(json.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.admin_email?.toLowerCase().includes(search.toLowerCase()) ||
      l.entity_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SuperAdminGuard>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17191C]">
            Security Audit Logs
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6871]">
            Tamper-evident chronological log of all administrator operations, modifications, and system events.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#D8DDE2] text-xs font-semibold text-[#5F6871] hover:text-[#17191C] hover:bg-white self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#D8DDE2] shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-[#929DA7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by admin email, action name, or entity type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D8DDE2] text-xs sm:text-sm focus:border-[#C80808] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6F7] border-b border-[#D8DDE2] text-[#5F6871] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Admin Email</th>
                <th className="py-3.5 px-4">Entity Type</th>
                <th className="py-3.5 px-4">Details Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8DDE2]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5F6871]">
                    <WorkspaceLoader compact />
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#5F6871]">
                    No audit records match your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-[#F5F6F7]/60 transition-colors font-mono text-[11px]">
                    <td className="py-3 px-4 text-[#5F6871] whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#17191C] text-white text-[10px] font-bold">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#17191C] font-semibold">
                      {l.admin_email}
                    </td>
                    <td className="py-3 px-4 text-[#5F6871] uppercase text-[10px]">
                      {l.entity_type}
                    </td>
                    <td className="py-3 px-4 text-[#5F6871] max-w-[300px] truncate">
                      {JSON.stringify(l.details || {})}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </SuperAdminGuard>
  );
}
