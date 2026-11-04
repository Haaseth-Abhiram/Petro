"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/HeaderCompact";
import Footer from "@/components/layout/FooterCompact";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function SiteLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide the public header and footer on login page and after login (all admin pages)
  const isAuthOrAdmin =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/admin");

  if (isAuthOrAdmin) {
    return <main className="flex-1 w-full min-h-screen">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
