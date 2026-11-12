"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  Users,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
  Phone,
  Mail,
  Trash2,
  ExternalLink,
  ChevronRight,
  Shield,
  Briefcase,
  User,
  Crown,
} from "lucide-react";
import WorkspaceLoader from "@/components/admin/WorkspaceLoader";

interface RoleUser {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

const ROLES = [
  { key: "HR", label: "HR", desc: "Hiring, applications, job postings", color: "bg-purple-100 text-purple-800 border-purple-300", activeBg: "bg-purple-600 text-white" },
  { key: "Employee", label: "Employee", desc: "Internal catalogue, assigned RFQs, datasheets", color: "bg-blue-100 text-blue-800 border-blue-300", activeBg: "bg-blue-600 text-white" },
  { key: "Client", label: "Client", desc: "Customer RFQs, quotation tracking, enquiries", color: "bg-emerald-100 text-emerald-800 border-emerald-300", activeBg: "bg-emerald-600 text-white" },
  { key: "Admin", label: "Admin", desc: "Full console, catalogue, quotes, hiring, settings", color: "bg-rose-100 text-rose-800 border-rose-300", activeBg: "bg-rose-600 text-white" },
];

export default function AdminRolesPage() {
  const [users, setUsers] = useState<RoleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/roles/users");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err: any) {
      setNotice({ type: "error", message: "Failed to load user list from server." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAssignRole = async (userId: string, newRole: string, userName: string) => {
    setAssigningId(userId);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/roles/assign", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Could not assign role");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      setNotice({
        type: "success",
        message: `Success! Role "${newRole}" assigned to ${userName || "user"}. Their dashboard is now activated for ${newRole}.`,
      });
    } catch (err: any) {
      setNotice({ type: "error", message: err.message || "Failed to update role." });
    } finally {
      setAssigningId(null);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/roles/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_active: !currentStatus } : u))
        );
      }
    } catch (err) {}
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${email}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/roles/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setNotice({ type: "success", message: `User ${email} deleted.` });
      } else {
        setNotice({ type: "error", message: data.message || "Cannot delete user." });
      }
    } catch (err: any) {
      setNotice({ type: "error", message: "Failed to delete user." });
    }
  };

  // Counts
  const pendingCount = users.filter((u) => !u.role || u.role.toLowerCase() === "pending").length;
  const hrCount = users.filter((u) => (u.role || "").toLowerCase() === "hr").length;
  const empCount = users.filter((u) => (u.role || "").toLowerCase() === "employee").length;
  const clientCount = users.filter((u) => (u.role || "").toLowerCase() === "client").length;
  const adminCount = users.filter((u) => (u.role || "").toLowerCase() === "admin" || (u.role || "").toLowerCase() === "super admin").length;

  // Filter
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    const matchQuery =
      !q ||
      u.email.toLowerCase().includes(q) ||
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.company && u.company.toLowerCase().includes(q));

    if (!matchQuery) return false;

    if (roleFilter === "pending") {
      return !u.role || u.role.toLowerCase() === "pending";
    }
    if (roleFilter !== "all") {
      return (u.role || "").toLowerCase() === roleFilter.toLowerCase();
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#C80808]/10 text-[#C80808]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-[1.8rem] font-black text-[#17191C] tracking-tight">Role Management &amp; Approvals</h1>
          </div>
          <p className="text-[13.5px] text-[#5F6871] mt-1">
            When users sign up, assign their role using the checkboxes below. Each role unlocks a customized dashboard.
          </p>
        </div>
        <button
          onClick={loadUsers}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D8DDE2] bg-white text-[13px] font-bold text-[#17191C] hover:bg-neutral-50 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-[#C80808] ${loading ? "animate-spin" : ""}`} />
          Refresh Users
        </button>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          className={`p-4 rounded-2xl border text-[13.5px] font-medium flex items-center justify-between gap-3 ${
            notice.type === "success"
              ? "bg-green-50 border-green-200 text-green-900"
              : "bg-[#FFF1EF] border-[#C80808]/30 text-[#17191C]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notice.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#C80808] shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Pending Banner if any users awaiting role */}
      {pendingCount > 0 && (
        <div className="rounded-2xl border-2 border-[#FFA028] bg-gradient-to-r from-[#FFF8ED] via-[#FFF3E0] to-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFA028] opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FFA028]" />
            </span>
            <div>
              <p className="text-[14px] font-extrabold text-[#17191C]">
                {pendingCount} New Sign-Up{pendingCount > 1 ? "s" : ""} Awaiting Role Assignment!
              </p>
              <p className="text-[12.5px] text-[#5F6871]">
                Check one of the 4 boxes (HR, Employee, Client, or Admin) to grant immediate dashboard access to the user.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRoleFilter("pending")}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFA028] hover:bg-[#E08A18] text-white text-[12.5px] font-extrabold transition-colors shrink-0"
          >
            Show Pending Only ({pendingCount})
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Users", count: users.length, icon: Users, filter: "all", color: "text-[#17191C]" },
          { label: "Pending Role", count: pendingCount, icon: Clock, filter: "pending", color: "text-[#FFA028]", pulse: pendingCount > 0 },
          { label: "HR Staff", count: hrCount, icon: Briefcase, filter: "hr", color: "text-purple-600" },
          { label: "Employees", count: empCount, icon: UserCheck, filter: "employee", color: "text-blue-600" },
          { label: "Clients", count: clientCount, icon: User, filter: "client", color: "text-emerald-600" },
          { label: "Admins", count: adminCount, icon: Crown, filter: "admin", color: "text-rose-600" },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setRoleFilter(s.filter)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              roleFilter === s.filter
                ? "border-[#17191C] bg-[#17191C] text-white shadow-md"
                : "border-[#E7E9EE] bg-white hover:border-[#D8C9B3] text-[#17191C]"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider ${roleFilter === s.filter ? "text-white/70" : "text-[#5F6871]"}`}>
                {s.label}
              </span>
              <s.icon className={`w-4 h-4 ${roleFilter === s.filter ? "text-[#FFA028]" : s.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[1.6rem] font-black leading-none">{s.count}</span>
              {s.pulse && (
                <span className="inline-block w-2 h-2 rounded-full bg-[#FFA028] animate-pulse" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#E7E9EE] bg-white p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#929DA7] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8DDE2] text-[13.5px] outline-none focus:border-[#C80808]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {["all", "pending", "hr", "employee", "client", "admin"].map((f) => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold capitalize transition-colors ${
                roleFilter === f
                  ? "bg-[#C80808] text-white"
                  : "bg-neutral-100 text-[#4a5159] hover:bg-neutral-200"
              }`}
            >
              {f === "all" ? "All Roles" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Users */}
      <div className="rounded-2xl border border-[#E7E9EE] bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <WorkspaceLoader />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-[#5F6871]">
            <Users className="w-10 h-10 mx-auto text-[#D8DDE2] mb-2" />
            <p className="font-bold text-[15px]">No users found matching your search</p>
            <p className="text-[13px] mt-1">Try clearing your search query or role filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E9EE] bg-[#FBFBFC] text-[11px] font-extrabold uppercase tracking-wider text-[#5F6871]">
                  <th className="py-3.5 px-4">User / Sign-Up</th>
                  <th className="py-3.5 px-3">Company &amp; Contact</th>
                  <th className="py-3.5 px-3">Joined</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Assign Role (4 Checkboxes)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E9EE] text-[13px]">
                {filteredUsers.map((u) => {
                  const isPending = !u.role || u.role.toLowerCase() === "pending";
                  const initial = (u.full_name || u.email || "U").charAt(0).toUpperCase();
                  const currentRoleLower = (u.role || "").toLowerCase();

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-[#F9F9FA] transition-colors ${
                        isPending ? "bg-[#FFFDF7]" : ""
                      }`}
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-black shrink-0 ${
                              isPending
                                ? "bg-[#FFA028] shadow-sm"
                                : currentRoleLower === "admin"
                                ? "bg-[#C80808]"
                                : currentRoleLower === "hr"
                                ? "bg-purple-600"
                                : currentRoleLower === "employee"
                                ? "bg-blue-600"
                                : "bg-emerald-600"
                            }`}
                          >
                            {initial}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-extrabold text-[#17191C] truncate">
                                {u.full_name || "New User"}
                              </p>
                              {isPending && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FFA028]/20 text-[#D97706] border border-[#FFA028]/40 animate-pulse">
                                  NEW SIGN-UP
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-[#5F6871] truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Company & Phone */}
                      <td className="py-3.5 px-3 text-[#5F6871]">
                        {u.company ? (
                          <div className="flex items-center gap-1.5 font-medium text-[#17191C]">
                            <Building2 className="w-3.5 h-3.5 text-[#929DA7]" />
                            <span className="truncate max-w-[160px]">{u.company}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 text-xs">Direct Sign-up</span>
                        )}
                        {u.phone && (
                          <div className="flex items-center gap-1.5 text-[11.5px] mt-0.5">
                            <Phone className="w-3 h-3 text-[#929DA7]" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="py-3.5 px-3 text-[#5F6871] text-[12px]">
                        {u.created_at
                          ? new Date(u.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u.id, u.is_active)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border transition-colors ${
                            u.is_active
                              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              : "bg-neutral-100 border-neutral-300 text-neutral-500 hover:bg-neutral-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.is_active ? "bg-green-600" : "bg-neutral-400"
                            }`}
                          />
                          {u.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* 4 Role Checkboxes */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {ROLES.map((role) => {
                            const isChecked = currentRoleLower === role.key.toLowerCase();
                            const isBusy = assigningId === u.id;

                            return (
                              <label
                                key={role.key}
                                title={role.desc}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 text-[12px] font-extrabold cursor-pointer transition-all select-none ${
                                  isChecked
                                    ? `${role.activeBg} border-transparent shadow-sm scale-105`
                                    : "bg-white border-[#E7E9EE] text-[#4a5159] hover:border-[#D8C9B3] hover:bg-neutral-50"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={isBusy}
                                  onChange={() =>
                                    handleAssignRole(u.id, role.key, u.full_name || u.email)
                                  }
                                  className="w-4 h-4 rounded border-[#D8DDE2] text-[#C80808] focus:ring-0 cursor-pointer"
                                />
                                <span>{role.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/dashboard?rolePreview=${u.role || "Client"}`}
                            title="View Dashboard for this role"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#D8DDE2] text-[11.5px] font-bold text-[#17191C] hover:bg-neutral-100 transition-colors"
                          >
                            <span>Dashboard</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#C80808]" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            title="Delete user"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-[#C80808] hover:bg-[#FFF1EF] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
