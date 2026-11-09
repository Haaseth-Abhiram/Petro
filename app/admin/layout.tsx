import React from "react";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin CMS | Petro Engineering",
  description: "Administrative control center for products, RFQs, enquiries, content, and system configuration.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="icon" href="/icon.svg?v=4" type="image/svg+xml" />
        <link rel="icon" href="/icon.png?v=4" type="image/png" />
      </head>
      <AdminShell>{children}</AdminShell>
    </>
  );
}
