import { Suspense } from "react";
import "./globals.css";
import SiteLayoutWrapper from "@/components/layout/SiteLayoutWrapper";
import InitialLoader from "@/components/common/InitialLoader";
import CookieConsent from "@/components/common/CookieConsent";
import PageTransitionLoader from "@/components/common/PageTransitionLoader";

type Metadata = Record<string, unknown>;

export const metadata: Metadata = {
  title: "Petro Engineering | Industrial Solutions & Precision Sourcing",
  description:
    "Specialized sourcing partner for industrial chemicals, water treatment solutions, instrumentation, valves, tubing, and engineering services.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="icon" href="/icon.svg?v=4" type="image/svg+xml" />
        <link rel="icon" href="/icon.png?v=4" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=4" />
      </head>
      <body className="flex flex-col min-h-screen bg-white">
        <InitialLoader />
        <CookieConsent />
        <Suspense fallback={null}>
          <PageTransitionLoader />
        </Suspense>
        <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
      </body>
    </html>
  );
}
