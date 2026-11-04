"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [enquiriesBadge, setEnquiriesBadge] = useState(0);
  const [rfqBadge, setRfqBadge] = useState(0);
  const [applicationsBadge, setApplicationsBadge] = useState(0);

  // If on login route, bypass admin shell completely
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Verify session
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.replace("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
          // Fetch badge counts
          fetch("/api/admin/stats")
            .then((r) => r.json())
            .then((sData) => {
              if (sData.success && sData.stats) {
                setEnquiriesBadge(sData.stats.enquiries?.new || 0);
                setRfqBadge(sData.stats.rfqs?.new || 0);
                setApplicationsBadge(sData.stats.applications?.new || 0);
              }
            })
            .catch(() => {});
        } else if (!isLoginPage) {
          router.replace("/login");
        }
      })
      .catch(() => {
        if (!isLoginPage) router.replace("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#17191C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#FF4B32] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-white/80">Securing Admin Session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7] flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        enquiriesBadge={enquiriesBadge}
        rfqBadge={rfqBadge}
        applicationsBadge={applicationsBadge}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-200">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
