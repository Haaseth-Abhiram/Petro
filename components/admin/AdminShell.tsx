"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import WorkspaceLoader from "./WorkspaceLoader";

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
  const checkedAuthRef = useRef(false);

  // The admin console should never get the large-screen zoom used on the public website
  useEffect(() => {
    document.documentElement.classList.add("admin-no-zoom");
    return () => document.documentElement.classList.remove("admin-no-zoom");
  }, []);

  // If on login route, bypass admin shell completely
  const isLoginPage = pathname === "/admin/login" || pathname === "/login";

  // Initial auth verification on mount
  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // If user is already authenticated in state, only refresh badge counts in background
    if (checkedAuthRef.current && user) {
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
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch("/api/auth/me", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          router.replace("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          checkedAuthRef.current = true;
          setUser(data.user);
          // Fetch badge counts in background
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
          router.replace("/admin/login");
        }
      })
      .catch((err) => {
        if (!isLoginPage && err.name !== "AbortError") {
          router.replace("/admin/login");
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [pathname, isLoginPage, router, user]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex">
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
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[17.5rem] transition-all duration-200">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(true)} user={user} notifications={enquiriesBadge + rfqBadge + applicationsBadge} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-[1480px] mx-auto">{loading ? <WorkspaceLoader /> : children}</div>
        </main>
      </div>
    </div>
  );
}
