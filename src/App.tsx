import React, { Suspense } from "react";
import { Routes, Route, Navigate, useParams, Outlet } from "react-router-dom";

// Layout components
import SiteLayoutWrapper from "@/components/layout/SiteLayoutWrapper";
import InitialLoader from "@/components/common/InitialLoader";
import CookieConsent from "@/components/common/CookieConsent";
import PageTransitionLoader from "@/components/common/PageTransitionLoader";
import AdminShell from "@/components/admin/AdminShell";

// Public Pages
import HomePage from "@/app/page";
import AboutPage from "@/app/about/page";
import ChemicalsPage from "@/app/chemicals/page";
import ChemicalCategoryPage from "@/app/chemicals/[category]/page";
import InstrumentationPage from "@/app/instrumentation/page";
import InstrumentationProductPage from "@/app/instrumentation/[product]/page";
import ServicesPage from "@/app/services/page";
import IndustriesPage from "@/app/industries/page";
import CareersPage from "@/app/careers/page";
import ContactPage from "@/app/contact/page";
import RequestAQuotePage from "@/app/request-a-quote/page";
import ResourcesPage from "@/app/resources/page";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import CookiesPage from "@/app/cookies/page";
import SitemapPage from "@/app/sitemap/page";
import LoginPage from "@/app/login/page";

// Admin Pages
import AdminDashboardPage from "@/app/admin/dashboard/page";
import AdminProductsPage from "@/app/admin/products/page";
import AdminCategoriesPage from "@/app/admin/categories/page";
import AdminQuoteRequestsPage from "@/app/admin/quote-requests/page";
import AdminEnquiriesPage from "@/app/admin/enquiries/page";
import AdminCareersOverviewPage from "@/app/admin/careers/page";
import AdminCareersJobsPage from "@/app/admin/careers/jobs/page";
import AdminCareersApplicationsPage from "@/app/admin/careers/applications/page";
import AdminCareerApplicationDetailPage from "@/app/admin/careers/applications/[id]/page";
import AdminCareersCategoriesPage from "@/app/admin/careers/categories/page";
import AdminCareersSettingsPage from "@/app/admin/careers/settings/page";
import AdminContentPage from "@/app/admin/content/page";
import AdminDocumentsPage from "@/app/admin/documents/page";
import AdminServicesPage from "@/app/admin/services/page";
import AdminIndustriesPage from "@/app/admin/industries/page";
import AdminUsersPage from "@/app/admin/users/page";
import AdminRolesPage from "@/app/admin/roles/page";
import AdminAuditLogsPage from "@/app/admin/audit-logs/page";
import AdminLoginPage from "@/app/admin/login/page";

// Wrappers for dynamic routes
function ChemicalCategoryWrapper() {
  const params = useParams<{ category: string }>();
  return <ChemicalCategoryPage params={{ category: params.category || "" }} />;
}

function InstrumentationProductWrapper() {
  const params = useParams<{ product: string }>();
  return <InstrumentationProductPage params={{ product: params.product || "" }} />;
}

function AdminApplicationDetailWrapper() {
  return <AdminCareerApplicationDetailPage />;
}

// Public layout wrapper
function PublicLayout() {
  return (
    <>
      <InitialLoader />
      <CookieConsent />
      <Suspense fallback={null}>
        <PageTransitionLoader />
      </Suspense>
      <SiteLayoutWrapper>
        <Outlet />
      </SiteLayoutWrapper>
    </>
  );
}

// Admin layout wrapper
function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/chemicals" element={<ChemicalsPage />} />
        <Route path="/chemicals/:category" element={<ChemicalCategoryWrapper />} />
        <Route path="/instrumentation" element={<InstrumentationPage />} />
        <Route path="/instrumentation/:product" element={<InstrumentationProductWrapper />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/request-a-quote" element={<RequestAQuotePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Admin Standalone Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Console (Protected by AdminShell) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="quote-requests" element={<AdminQuoteRequestsPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="careers" element={<AdminCareersOverviewPage />} />
        <Route path="careers/jobs" element={<AdminCareersJobsPage />} />
        <Route path="careers/applications" element={<AdminCareersApplicationsPage />} />
        <Route path="careers/applications/:id" element={<AdminApplicationDetailWrapper />} />
        <Route path="careers/categories" element={<AdminCareersCategoriesPage />} />
        <Route path="careers/settings" element={<AdminCareersSettingsPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="documents" element={<AdminDocumentsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="industries" element={<AdminIndustriesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="roles" element={<AdminRolesPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
