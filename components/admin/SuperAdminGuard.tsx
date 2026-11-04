"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

export default function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.authenticated && data.user) {
          setRole(data.user.role);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-[#C80808] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-[#5F6871]">Verifying security privileges...</p>
      </div>
    );
  }

  if (role !== "Super Admin") {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl p-8 border border-[#D8DDE2] shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#C80808]/10 text-[#C80808] flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-extrabold text-[#17191C] mb-2">
          Super Administrator Access Required
        </h2>
        <p className="text-xs sm:text-sm text-[#5F6871] leading-relaxed mb-6">
          Your current account role (<strong>{role || "Admin"}</strong>) has operational permissions for product and content management, but does not have permission to modify system security, administrative users, or audit logs.
        </p>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#17191C] hover:bg-[#2A2E34] text-white text-xs font-bold transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
