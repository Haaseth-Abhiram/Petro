"use client";

import WorkspaceLoader from "@/components/admin/WorkspaceLoader";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sliders,
  Save,
  RefreshCw,
  Mail,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bell,
  Clock,
  Send,
  Phone,
} from "lucide-react";

interface RecruitmentSettings {
  notification_email: string;
  auto_acknowledge: boolean;
  acknowledgement_subject: string;
  cv_max_size_mb: number;
  allowed_extensions: string[];
  allow_general_applications: boolean;
  retention_period_months: number;
  recruitment_contact_phone: string;
  recruitment_contact_email: string;
}

export default function RecruitmentSettingsPage() {
  const [settings, setSettings] = useState<RecruitmentSettings>({
    notification_email: "hr@petroeng.in, sales@petroeng.in",
    auto_acknowledge: true,
    acknowledgement_subject: "Thank you for applying to Petro Engineering",
    cv_max_size_mb: 5,
    allowed_extensions: [".pdf", ".doc", ".docx"],
    allow_general_applications: true,
    retention_period_months: 24,
    recruitment_contact_phone: "+91 96521 11021",
    recruitment_contact_email: "careers@petroeng.in",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/careers/settings");
      const d = await res.json();
      if (d.success && d.settings) {
        setSettings({
          ...d.settings,
          allowed_extensions: Array.isArray(d.settings.allowed_extensions)
            ? d.settings.allowed_extensions
            : [".pdf", ".doc", ".docx"],
        });
      } else {
        showToast("error", d.message || "Failed to load recruitment settings");
      }
    } catch {
      showToast("error", "Network error while loading settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/careers/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        showToast("success", "Recruitment settings updated successfully");
      } else {
        showToast("error", d.message || "Failed to save settings");
      }
    } catch {
      showToast("error", "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold ${
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
            <span className="text-[#C80808]">Settings</span>
          </div>
          <h1 className="text-2xl font-black text-[#17191C] tracking-tight flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-[#C80808]" />
            Recruitment Settings
          </h1>
          <p className="text-sm text-[#5F6871] mt-0.5">
            Configure automated candidate acknowledgement emails, notification recipients, and upload rules.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={loading}
          className="p-2.5 rounded-xl border border-[#D8DDE2] bg-white text-[#17191C] hover:bg-[#F5F6F7] transition disabled:opacity-70 self-start sm:self-auto"
          title="Reload settings"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#C80808]" : ""}`} />
        </button>
      </div>

      {loading ? (
        <WorkspaceLoader compact />
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Notifications & Emails */}
          <div className="bg-white p-6 rounded-2xl border border-[#D8DDE2] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D8DDE2]">
              <Bell className="w-5 h-5 text-[#C80808]" />
              <h2 className="text-base font-extrabold text-[#17191C]">Notifications & Candidate Communication</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17191C] mb-1">
                Internal Recruiter Alert Emails (comma-separated) *
              </label>
              <input
                type="text"
                required
                value={settings.notification_email}
                onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
                placeholder="hr@petroeng.in, admin@petroeng.in"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8DDE2] bg-[#F5F6F7] text-[#17191C] focus:bg-white focus:outline-none focus:border-[#C80808]"
              />
              <p className="text-[11px] text-[#5F6871] mt-1">
                These email addresses receive instant notification whenever a candidate submits an application.
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_acknowledge}
                  onChange={(e) => setSettings({ ...settings, auto_acknowledge: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-[#C80808] focus:ring-[#C80808] border-[#D8DDE2]"
                />
                <div>
                  <span className="text-sm font-bold text-[#17191C] block">
                    Send Instant Acknowledgement Email to Candidate
                  </span>
                  <span className="text-xs text-[#5F6871] block mt-0.5">
                    Automatically sends a branded confirmation email with their unique Application Reference (APP-YYYY-XXXX).
                  </span>
                </div>
              </label>
            </div>

            {settings.auto_acknowledge && (
              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Candidate Acknowledgement Email Subject Line
                </label>
                <input
                  type="text"
                  value={settings.acknowledgement_subject}
                  onChange={(e) => setSettings({ ...settings, acknowledgement_subject: e.target.value })}
                  placeholder="Thank you for applying to Petro Engineering"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8DDE2] bg-[#F5F6F7] text-[#17191C] focus:bg-white focus:outline-none focus:border-[#C80808]"
                />
              </div>
            )}
          </div>

          {/* Section 2: Resume Upload Policies */}
          <div className="bg-white p-6 rounded-2xl border border-[#D8DDE2] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D8DDE2]">
              <FileCheck className="w-5 h-5 text-[#FFA028]" />
              <h2 className="text-base font-extrabold text-[#17191C]">Resume & Document Upload Policies</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Max CV File Size (MB)
                </label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={settings.cv_max_size_mb}
                  onChange={(e) => setSettings({ ...settings, cv_max_size_mb: parseInt(e.target.value) || 5 })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8DDE2] bg-[#F5F6F7] text-[#17191C] focus:bg-white focus:outline-none focus:border-[#C80808]"
                />
                <p className="text-[11px] text-[#5F6871] mt-1">Recommended: 5 MB limit per candidate.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Candidate Retention Period (Months)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={settings.retention_period_months}
                  onChange={(e) => setSettings({ ...settings, retention_period_months: parseInt(e.target.value) || 24 })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8DDE2] bg-[#F5F6F7] text-[#17191C] focus:bg-white focus:outline-none focus:border-[#C80808]"
                />
                <p className="text-[11px] text-[#5F6871] mt-1">How long talent resumes are maintained on file.</p>
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={settings.allow_general_applications}
                  onChange={(e) => setSettings({ ...settings, allow_general_applications: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded text-[#C80808] focus:ring-[#C80808] border-[#D8DDE2]"
                />
                <div>
                  <span className="text-sm font-bold text-[#17191C] block">
                    Accept &ldquo;General Application&rdquo; Inquiries
                  </span>
                  <span className="text-xs text-[#5F6871] block mt-0.5">
                    Permits candidates to submit resumes even when their specific role is not currently published.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Recruitment Contact Info */}
          <div className="bg-white p-6 rounded-2xl border border-[#D8DDE2] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D8DDE2]">
              <Phone className="w-5 h-5 text-[#C80808]" />
              <h2 className="text-base font-extrabold text-[#17191C]">Public Careers Contact Details</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Careers Help Email
                </label>
                <input
                  type="email"
                  value={settings.recruitment_contact_email}
                  onChange={(e) => setSettings({ ...settings, recruitment_contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8DDE2] bg-[#F5F6F7] text-[#17191C] focus:bg-white focus:outline-none focus:border-[#C80808]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17191C] mb-1">
                  Recruitment Desk Phone
                </label>
                <input
                  type="text"
                  value={settings.recruitment_contact_phone}
                  onChange={(e) => setSettings({ ...settings, recruitment_contact_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#D8DDE2] bg-[#F5F6F7] text-[#17191C] focus:bg-white focus:outline-none focus:border-[#C80808]"
                />
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C80808]/70 to-[#FFA028]/70 text-white text-sm font-extrabold shadow-md shadow-[#C80808]/25 hover:opacity-95 transition disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
