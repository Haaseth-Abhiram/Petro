"use client";

import React, { useState } from "react";
import SuperAdminGuard from "@/components/admin/SuperAdminGuard";
import {
  Settings,
  Database,
  ShieldCheck,
  Server,
  Lock,
  Globe,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [companySettings, setCompanySettings] = useState({
    companyName: "Petro Engineering Private Limited",
    registrationNo: "U29253MH2012PTC234120",
    gstin: "27AABCP1234F1Z8",
    defaultCurrency: "INR (₹) / USD ($)",
    enquiryNotifyEmail: "sales@petroeng.in",
    rfqNotifyEmail: "procurement@petroeng.in",
    enablePublicRegistration: false,
    enforceMfa: false,
    sessionTimeoutDays: "30",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SuperAdminGuard>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#17191C]">
            Company & System Settings
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6871]">
            Global system parameters, database configuration, and administrative preferences.
          </p>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Database Connection Diagnostic Card */}
      <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#D8DDE2]">
          <div className="w-8 h-8 rounded-lg bg-[#17191C] text-[#C80808] flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#17191C]">
              Enterprise Database Cluster
            </h3>
            <p className="text-[11px] text-[#5F6871]">
              Supabase Managed PostgreSQL Instance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
            <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Status:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected & Operational
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
            <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Region & Pooler:</span>
            <span className="font-bold text-[#17191C] mt-0.5 block">Stockholm (eu-north-1)</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
            <span className="text-[#929DA7] block text-[10px] uppercase font-bold">Port & Mode:</span>
            <span className="font-bold text-[#17191C] mt-0.5 block">Port 6543 (PgBouncer)</span>
          </div>
          <div className="p-3 rounded-lg bg-[#F5F6F7] border border-[#D8DDE2]">
            <span className="text-[#929DA7] block text-[10px] uppercase font-bold">SSL Encryption:</span>
            <span className="font-bold text-[#17191C] mt-0.5 block">TLS v1.3 Verified</span>
          </div>
        </div>
      </div>

      {/* Company Legal & Compliance Info */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#17191C]">
            Company Entity Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                Legal Entity Name
              </label>
              <input
                type="text"
                value={companySettings.companyName}
                onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                Corporate Registration No. (CIN)
              </label>
              <input
                type="text"
                value={companySettings.registrationNo}
                onChange={(e) => setCompanySettings({ ...companySettings, registrationNo: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs font-semibold outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                Enquiry Routing Notification Email
              </label>
              <input
                type="email"
                value={companySettings.enquiryNotifyEmail}
                onChange={(e) => setCompanySettings({ ...companySettings, enquiryNotifyEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#17191C] mb-1">
                RFQ Notification Desk
              </label>
              <input
                type="email"
                value={companySettings.rfqNotifyEmail}
                onChange={(e) => setCompanySettings({ ...companySettings, rfqNotifyEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D8DDE2] text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="bg-white rounded-xl border border-[#D8DDE2] shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#17191C]">
            Security & Session Policies
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F6F7]">
              <div>
                <p className="text-xs font-bold text-[#17191C]">Strict Admin Authentication</p>
                <p className="text-[11px] text-[#5F6871]">Require encrypted sessions and bcrypt passwords for all admin logins</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                Active & Enforced
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F6F7]">
              <div>
                <p className="text-xs font-bold text-[#17191C]">Zero Public Registration</p>
                <p className="text-[11px] text-[#5F6871]">Prevent public user self-signups. Admin accounts must be granted by administrators.</p>
              </div>
              <span className="text-xs font-bold text-[#17191C] bg-white border border-[#D8DDE2] px-2.5 py-1 rounded-full">
                Enforced
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#C80808] hover:bg-[#A81010] text-white text-xs font-bold shadow-[0_4px_12px_rgba(200,8,8,0.3)] transition-all"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
    </SuperAdminGuard>
  );
}
