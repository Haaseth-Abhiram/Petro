import type { SupabaseClient } from "@supabase/supabase-js";

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getQueryParams(urlPath: string): URLSearchParams {
  const idx = urlPath.indexOf("?");
  return idx >= 0 ? new URLSearchParams(urlPath.slice(idx + 1)) : new URLSearchParams();
}

async function readJsonBody(init?: RequestInit): Promise<Record<string, any>> {
  if (!init?.body || typeof init.body !== "string") return {};
  try {
    return JSON.parse(init.body) || {};
  } catch {
    return {};
  }
}

export async function handleAdminSupabaseFallback(
  supabase: SupabaseClient,
  urlPath: string,
  init?: RequestInit
): Promise<Response | null> {
  const method = (init?.method || "GET").toUpperCase();
  const cleanPath = urlPath.split("?")[0];
  const qs = getQueryParams(urlPath);

  // Verify active authenticated user before accessing private tables
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) {
    return json({ success: false, message: "Unauthorized. Please sign in." }, 401);
  }

  // 1. GET /api/admin/stats
  if (method === "GET" && cleanPath === "/api/admin/stats") {
    const [prods, cats, enqs, rfqs, apps, docs, servs, inds, jobs, users, logs] = await Promise.all([
      supabase.from("products").select("id, is_published"),
      supabase.from("product_categories").select("id, slug, name, division"),
      supabase.from("contact_messages").select("id, full_name, email, company_name, subject, message, status, created_at").order("created_at", { ascending: false }),
      supabase.from("rfq_submissions").select("id, full_name, company_name, email, product_name, quantity, unit_of_measurement, status, created_at").order("created_at", { ascending: false }),
      supabase.from("applications").select("id, application_reference, full_name, email, role_of_interest, experience, status, submitted_at").order("submitted_at", { ascending: false }),
      supabase.from("documents").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("services").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("industries").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("jobs").select("id, status"),
      supabase.from("admin_users").select("id, role"),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(8),
    ]);

    const pRows = prods.data || [];
    const cRows = cats.data || [];
    const eRows = enqs.data || [];
    const rRows = rfqs.data || [];
    const aRows = apps.data || [];
    const jRows = jobs.data || [];
    const uRows = users.data || [];

    const stats = {
      products: { total: pRows.length, published: pRows.filter((p) => p.is_published).length },
      categories: {
        total: cRows.length,
        chemicals: cRows.filter((c) => (c.division || "").toLowerCase().includes("chem")).length,
        instrumentation: cRows.filter((c) => (c.division || "").toLowerCase().includes("inst")).length,
      },
      enquiries: { total: eRows.length, new: eRows.filter((e) => e.status === "new").length },
      rfqs: { total: rRows.length, new: rRows.filter((r) => r.status === "new").length },
      applications: { total: aRows.length, new: aRows.filter((a) => a.status === "New").length },
      documents: docs.count || 0,
      services: servs.count || 0,
      industries: inds.count || 0,
      pendingRoles: uRows.filter((u) => (u.role || "").toLowerCase() === "pending").length,
      totalUsers: uRows.length,
    };

    const todayStr = new Date().toISOString().slice(0, 10);
    const insights = {
      openJobs: jRows.filter((j) => j.status === "published").length,
      draftJobs: jRows.filter((j) => j.status === "draft").length,
      emptyCategories: 0,
      oldestNewEnquiry: null,
      oldestNewRfq: null,
      enquiriesToday: eRows.filter((e) => (e.created_at || "").startsWith(todayStr)).length,
      rfqsToday: rRows.filter((r) => (r.created_at || "").startsWith(todayStr)).length,
      applicationsToday: aRows.filter((a) => (a.submitted_at || "").startsWith(todayStr)).length,
      hired: aRows.filter((a) => a.status === "Selected").length,
      jobsTotal: jRows.length,
    };

    const countByStatus = (list: any[]) => {
      const map: Record<string, number> = {};
      list.forEach((item) => {
        const s = item.status || "new";
        map[s] = (map[s] || 0) + 1;
      });
      return Object.entries(map).map(([status, total]) => ({ status, total }));
    };

    return json({
      success: true,
      stats,
      recentEnquiries: eRows.slice(0, 6),
      recentRfqs: rRows.slice(0, 6),
      recentLogs: logs.data || [],
      activity: [],
      topCategories: cRows.slice(0, 5).map((c) => ({ name: c.name, division: c.division, products: 0 })),
      recentApplications: aRows.slice(0, 6),
      rfqStatus: countByStatus(rRows),
      enquiryStatus: countByStatus(eRows),
      insights,
    });
  }

  // 2. PRODUCTS (/api/admin/products)
  if (cleanPath === "/api/admin/products") {
    if (method === "GET") {
      const [prodRes, catRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("product_categories").select("slug, name"),
      ]);
      const catMap = new Map((catRes.data || []).map((c) => [c.slug, c.name]));
      let items = (prodRes.data || []).map((p) => ({ ...p, category_name: catMap.get(p.category_slug) || p.category_slug }));
      const search = (qs.get("search") || "").trim().toLowerCase();
      const division = (qs.get("division") || "").trim();
      const category = (qs.get("category") || "").trim();
      if (search) {
        items = items.filter(
          (p) =>
            (p.name || "").toLowerCase().includes(search) ||
            (p.slug || "").toLowerCase().includes(search) ||
            (p.short_description || "").toLowerCase().includes(search) ||
            (p.material || "").toLowerCase().includes(search)
        );
      }
      if (division && division !== "all") items = items.filter((p) => p.division === division);
      if (category && category !== "all") items = items.filter((p) => p.category_slug === category);
      return json({ success: true, products: items });
    }
    if (method === "POST") {
      const body = await readJsonBody(init);
      const { data, error } = await supabase.from("products").insert([body]).select().single();
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, product: data });
    }
    if (method === "PUT" || method === "PATCH") {
      const body = await readJsonBody(init);
      const { id, ...rest } = body;
      const { data, error } = await supabase.from("products").update(rest).eq("id", id).select().single();
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, product: data });
    }
    if (method === "DELETE") {
      const id = qs.get("id");
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, message: "Product deleted" });
    }
  }

  // 3. CATEGORIES (/api/admin/categories)
  if (cleanPath === "/api/admin/categories") {
    if (method === "GET") {
      const [catRes, prodRes] = await Promise.all([
        supabase.from("product_categories").select("*").order("display_order", { ascending: true }).order("name", { ascending: true }),
        supabase.from("products").select("category_slug"),
      ]);
      const counts: Record<string, number> = {};
      (prodRes.data || []).forEach((p) => { counts[p.category_slug] = (counts[p.category_slug] || 0) + 1; });
      const categories = (catRes.data || []).map((c) => ({ ...c, product_count: counts[c.slug] || 0 }));
      return json({ success: true, categories });
    }
    if (method === "POST") {
      const body = await readJsonBody(init);
      const { data, error } = await supabase.from("product_categories").insert([body]).select().single();
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, category: data });
    }
    if (method === "PUT" || method === "PATCH") {
      const body = await readJsonBody(init);
      const { id, ...rest } = body;
      const { data, error } = await supabase.from("product_categories").update(rest).eq("id", id).select().single();
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, category: data });
    }
    if (method === "DELETE") {
      const id = qs.get("id");
      const { error } = await supabase.from("product_categories").delete().eq("id", id);
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, message: "Category deleted" });
    }
  }

  // 4. QUOTE REQUESTS (/api/admin/quote-requests)
  if (cleanPath === "/api/admin/quote-requests") {
    if (method === "GET") {
      const { data, error } = await supabase.from("rfq_submissions").select("*").order("created_at", { ascending: false });
      if (error) return json({ success: false, message: error.message }, 500);
      let rows = data || [];
      const counts: Record<string, number> = {};
      rows.forEach((r) => { const s = r.status || "new"; counts[s] = (counts[s] || 0) + 1; });
      const search = (qs.get("search") || "").trim().toLowerCase();
      const status = (qs.get("status") || "").trim();
      if (search) {
        rows = rows.filter(
          (r) =>
            (r.full_name || "").toLowerCase().includes(search) ||
            (r.company_name || "").toLowerCase().includes(search) ||
            (r.email || "").toLowerCase().includes(search) ||
            (r.product_name || "").toLowerCase().includes(search)
        );
      }
      if (status && status !== "all") rows = rows.filter((r) => r.status === status);
      return json({ success: true, quoteRequests: rows, counts, totalAll: (data || []).length });
    }
    if (method === "PATCH") {
      const body = await readJsonBody(init);
      const { id, status, internal_notes, quote_amount } = body;
      const updates: Record<string, any> = {};
      if (status !== undefined) updates.status = status;
      if (internal_notes !== undefined) updates.internal_notes = internal_notes;
      if (quote_amount !== undefined) updates.quote_amount = quote_amount;
      const { data, error } = await supabase.from("rfq_submissions").update(updates).eq("id", id).select().single();
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, quoteRequest: data });
    }
    if (method === "DELETE") {
      const id = qs.get("id");
      const { error } = await supabase.from("rfq_submissions").delete().eq("id", id);
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, message: "Quote request deleted" });
    }
  }

  // 5. ENQUIRIES (/api/admin/enquiries)
  if (cleanPath === "/api/admin/enquiries") {
    if (method === "GET") {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) return json({ success: false, message: error.message }, 500);
      const all = data || [];
      const type = qs.get("type") || "all";
      const status = (qs.get("status") || "").trim();
      const search = (qs.get("search") || "").trim().toLowerCase();
      const isSug = (e: any) => /suggestion|feedback/i.test(e.subject || "");
      let rows = all;
      if (type === "suggestions") rows = rows.filter(isSug);
      else if (type === "enquiries") rows = rows.filter((e) => !isSug(e));
      if (status && status !== "all") rows = rows.filter((e) => e.status === status);
      if (search) {
        rows = rows.filter(
          (e) =>
            (e.full_name || "").toLowerCase().includes(search) ||
            (e.email || "").toLowerCase().includes(search) ||
            (e.subject || "").toLowerCase().includes(search) ||
            (e.message || "").toLowerCase().includes(search)
        );
      }
      const counts: Record<string, number> = {};
      all.forEach((e) => { const s = e.status || "new"; counts[s] = (counts[s] || 0) + 1; });
      return json({
        success: true,
        enquiries: rows,
        counts,
        totalAll: all.length,
        typeCounts: {
          enquiries: all.filter((e) => !isSug(e)).length,
          suggestions: all.filter(isSug).length,
          all: all.length,
        },
      });
    }
    if (method === "PATCH") {
      const body = await readJsonBody(init);
      const { id, status, internal_notes } = body;
      const updates: Record<string, any> = {};
      if (status !== undefined) updates.status = status;
      if (internal_notes !== undefined) updates.internal_notes = internal_notes;
      const { data, error } = await supabase.from("contact_messages").update(updates).eq("id", id).select().single();
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, enquiry: data });
    }
    if (method === "DELETE") {
      const id = qs.get("id");
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, message: "Enquiry deleted" });
    }
  }

  // 6. CAREERS ADMIN (/api/admin/careers/*)
  if (cleanPath === "/api/admin/careers/stats" && method === "GET") {
    const [jobsRes, appsRes] = await Promise.all([
      supabase.from("jobs").select("*").order("created_at", { ascending: false }),
      supabase.from("applications").select("*").order("submitted_at", { ascending: false }),
    ]);
    const jRows = jobsRes.data || [];
    const aRows = appsRes.data || [];
    const roleMap: Record<string, number> = {};
    aRows.forEach((a) => { roleMap[a.role_of_interest || "General"] = (roleMap[a.role_of_interest || "General"] || 0) + 1; });
    return json({
      success: true,
      stats: {
        totalJobs: jRows.length,
        publishedJobs: jRows.filter((j) => j.status === "published").length,
        draftJobs: jRows.filter((j) => j.status === "draft").length,
        closedJobs: jRows.filter((j) => j.status === "closed").length,
        totalApplications: aRows.length,
        newApplications: aRows.filter((a) => a.status === "New").length,
        underReviewApplications: aRows.filter((a) => a.status === "Under Review").length,
        shortlistedApplications: aRows.filter((a) => a.status === "Shortlisted").length,
        interviewApplications: aRows.filter((a) => a.status === "Interview").length,
        selectedApplications: aRows.filter((a) => a.status === "Selected").length,
        rejectedApplications: aRows.filter((a) => a.status === "Rejected").length,
      },
      byPosition: Object.entries(roleMap).map(([role, count]) => ({ role, count })),
      recentApplications: aRows.slice(0, 6),
      recentJobs: jRows.slice(0, 5),
    });
  }

  if (cleanPath === "/api/admin/careers/applications" && method === "GET") {
    const { data, error } = await supabase.from("applications").select("*").order("submitted_at", { ascending: false });
    if (error) return json({ success: false, message: error.message }, 500);
    let rows = data || [];
    const search = (qs.get("search") || "").trim().toLowerCase();
    const status = (qs.get("status") || "").trim();
    const role = (qs.get("role") || "").trim();
    if (search) {
      rows = rows.filter(
        (a) =>
          (a.full_name || "").toLowerCase().includes(search) ||
          (a.email || "").toLowerCase().includes(search) ||
          (a.application_reference || "").toLowerCase().includes(search)
      );
    }
    if (status && status !== "all") rows = rows.filter((a) => a.status === status);
    if (role && role !== "all") rows = rows.filter((a) => a.role_of_interest === role || a.job_title === role);
    const page = parseInt(qs.get("page") || "1", 10) || 1;
    const limit = parseInt(qs.get("limit") || "20", 10) || 20;
    const sliced = rows.slice((page - 1) * limit, page * limit);
    return json({
      success: true,
      applications: sliced,
      pagination: { total: rows.length, page, limit, totalPages: Math.ceil(rows.length / limit) || 1 },
    });
  }

  if (cleanPath.startsWith("/api/admin/careers/applications/") && method === "GET" && !cleanPath.endsWith("/cv") && !cleanPath.endsWith("/export")) {
    const id = cleanPath.split("/").pop() || "";
    const [appRes, notesRes, histRes] = await Promise.all([
      supabase.from("applications").select("*").eq("id", id).single(),
      supabase.from("application_notes").select("*").eq("application_id", id).order("created_at", { ascending: false }),
      supabase.from("application_status_history").select("*").eq("application_id", id).order("created_at", { ascending: false }),
    ]);
    if (appRes.error || !appRes.data) return json({ success: false, message: "Application not found" }, 404);
    return json({ success: true, application: appRes.data, notes: notesRes.data || [], history: histRes.data || [] });
  }

  if (cleanPath.endsWith("/status") && cleanPath.startsWith("/api/admin/careers/applications/") && method === "PUT") {
    const parts = cleanPath.split("/");
    const id = parts[parts.length - 2];
    const body = await readJsonBody(init);
    await supabase.from("applications").update({ status: body.status, updated_at: new Date().toISOString() }).eq("id", id);
    await supabase.from("application_status_history").insert([{
      application_id: id,
      new_status: body.status,
      changed_by: authData.user.email || "Admin",
      note: body.note || `Status updated to ${body.status}`,
    }]);
    return json({ success: true, status: body.status });
  }

  if (cleanPath.endsWith("/notes") && cleanPath.startsWith("/api/admin/careers/applications/") && method === "POST") {
    const parts = cleanPath.split("/");
    const id = parts[parts.length - 2];
    const body = await readJsonBody(init);
    const { data, error } = await supabase.from("application_notes").insert([{
      application_id: id,
      admin_email: authData.user.email || "admin@petroeng.in",
      admin_name: authData.user.user_metadata?.full_name || "Administrator",
      note: body.note,
    }]).select().single();
    if (error) return json({ success: false, message: error.message }, 500);
    return json({ success: true, note: data });
  }

  if (cleanPath === "/api/admin/careers/jobs") {
    if (method === "GET") {
      const { data } = await supabase.from("jobs").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false });
      return json({ success: true, jobs: data || [] });
    }
    if (method === "POST") {
      const body = await readJsonBody(init);
      const { data, error } = await supabase.from("jobs").insert([body]).select().single();
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, job: data });
    }
  }

  if (cleanPath.startsWith("/api/admin/careers/jobs/")) {
    const id = cleanPath.split("/").pop() || "";
    if (method === "PUT") {
      const body = await readJsonBody(init);
      const { data, error } = await supabase.from("jobs").update(body).eq("id", id).select().single();
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, job: data });
    }
    if (method === "DELETE") {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, message: "Job deleted" });
    }
  }

  if (cleanPath === "/api/admin/careers/categories") {
    if (method === "GET") {
      const { data } = await supabase.from("job_categories").select("*").order("display_order", { ascending: true });
      return json({ success: true, categories: data || [] });
    }
    if (method === "POST") {
      const body = await readJsonBody(init);
      const { data, error } = await supabase.from("job_categories").insert([{
        name: body.name,
        slug: body.slug || (body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: body.description || null,
        display_order: Number(body.displayOrder) || 0,
        is_active: body.isActive !== false,
      }]).select().single();
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, category: data });
    }
  }

  if (cleanPath.startsWith("/api/admin/careers/categories/")) {
    const id = cleanPath.split("/").pop() || "";
    if (method === "PUT") {
      const body = await readJsonBody(init);
      const { data, error } = await supabase.from("job_categories").update({
        name: body.name,
        slug: body.slug,
        description: body.description,
        display_order: body.displayOrder,
        is_active: body.isActive,
      }).eq("id", id).select().single();
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, category: data });
    }
    if (method === "DELETE") {
      const { error } = await supabase.from("job_categories").delete().eq("id", id);
      if (error) return json({ success: false, message: error.message }, 500);
      return json({ success: true, message: "Category deleted" });
    }
  }

  if (cleanPath === "/api/admin/careers/settings") {
    if (method === "GET") {
      const { data } = await supabase.from("recruitment_settings").select("value").eq("key", "general").single();
      return json({ success: true, settings: data?.value || {} });
    }
    if (method === "POST") {
      const body = await readJsonBody(init);
      await supabase.from("recruitment_settings").upsert({ key: "general", value: body });
      return json({ success: true, settings: body });
    }
  }

  // 7. CMS TABLES (services, industries, documents, audit-logs, users, roles)
  if (cleanPath === "/api/admin/services" && method === "GET") {
    const { data } = await supabase.from("services").select("*").order("display_order", { ascending: true });
    return json({ success: true, services: data || [] });
  }
  if (cleanPath === "/api/admin/industries" && method === "GET") {
    const { data } = await supabase.from("industries").select("*").order("display_order", { ascending: true });
    return json({ success: true, industries: data || [] });
  }
  if (cleanPath === "/api/admin/documents" && method === "GET") {
    const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    return json({ success: true, documents: data || [] });
  }
  if (cleanPath === "/api/admin/audit-logs" && method === "GET") {
    const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
    return json({ success: true, logs: data || [] });
  }
  if ((cleanPath === "/api/admin/users" || cleanPath === "/api/admin/roles/users") && method === "GET") {
    const { data } = await supabase
      .from("admin_users")
      .select("id, email, full_name, company, phone, role, is_active, last_login, created_at")
      .order("created_at", { ascending: false });
    return json({ success: true, users: data || [] });
  }
  if (cleanPath === "/api/admin/roles/assign" && method === "PATCH") {
    const body = await readJsonBody(init);
    const { data, error } = await supabase.from("admin_users").update({ role: body.role }).eq("id", body.userId).select("id, email, full_name, role, is_active").single();
    if (error) return json({ success: false, message: error.message }, 500);
    return json({ success: true, user: data });
  }
  if (cleanPath === "/api/admin/roles/status" && method === "PATCH") {
    const body = await readJsonBody(init);
    const { data, error } = await supabase.from("admin_users").update({ is_active: body.is_active }).eq("id", body.userId).select("id, email, full_name, role, is_active").single();
    if (error) return json({ success: false, message: error.message }, 500);
    return json({ success: true, user: data });
  }
  if (cleanPath.startsWith("/api/admin/roles/users/") && method === "DELETE") {
    const id = cleanPath.split("/").pop() || "";
    const { error } = await supabase.from("admin_users").delete().eq("id", id);
    if (error) return json({ success: false, message: error.message }, 500);
    return json({ success: true, message: "User deleted" });
  }

  return null;
}
