import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) ||
  "https://gznvueeroscdfymfuyxf.supabase.co";

const SUPABASE_KEY =
  ((import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  "sb_publishable_Uje5n9Scgfli0rncEI2qIw_dThOfEto";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function parseRequestBody(init?: RequestInit): Promise<{ fields: Record<string, string>; file: File | null }> {
  const fields: Record<string, string> = {};
  let file: File | null = null;

  if (!init?.body) return { fields, file };

  if (init.body instanceof FormData) {
    init.body.forEach((value, key) => {
      if (value instanceof File) {
        if (value.size > 0) file = value;
      } else {
        fields[key] = String(value);
      }
    });
  } else if (typeof init.body === "string") {
    try {
      const parsed = JSON.parse(init.body);
      Object.entries(parsed || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fields[k] = String(v);
      });
    } catch {
      // ignore non-JSON
    }
  }

  return { fields, file };
}

/**
 * Handles public website API requests directly via Supabase when deployed
 * on static hosting (e.g., Lovable) without a dedicated Node.js backend URL.
 */
export async function handlePublicSupabaseFallback(
  urlPath: string,
  init?: RequestInit
): Promise<Response | null> {
  const method = (init?.method || "GET").toUpperCase();
  const cleanPath = urlPath.split("?")[0];

  // 1. GET /api/careers/jobs
  if (method === "GET" && cleanPath === "/api/careers/jobs") {
    const { data, error } = await supabase
      .from("jobs")
      .select(
        "id, role, title, slug, department, location, employment_type, experience, short_description, description, responsibilities, qualifications, required_skills, optional_skills, image, application_deadline, created_at"
      )
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return jsonResponse({ success: false, message: error.message }, 500);
    }
    return jsonResponse({ success: true, jobs: data || [] });
  }

  // 2. POST /api/contact
  if (method === "POST" && cleanPath === "/api/contact") {
    const { fields } = await parseRequestBody(init);
    if (!fields.fullName || !fields.email || !fields.message) {
      return jsonResponse({ success: false, message: "Name, email, and message are required." }, 400);
    }

    const subject =
      fields.subject ||
      (fields.division === "Suggestion" || /suggestion|feedback/i.test(fields.division || "")
        ? "Website suggestion"
        : `Contact Enquiry - ${fields.division || "General"}`);

    const { error } = await supabase.from("contact_messages").insert([
      {
        full_name: fields.fullName,
        company_name: fields.companyName || "",
        email: fields.email,
        phone: fields.phone || "",
        subject,
        message: fields.message,
        status: "new",
      },
    ]);

    if (error) {
      return jsonResponse({ success: false, message: error.message }, 500);
    }
    return jsonResponse({
      success: true,
      message: "Your message has been received and logged in our system.",
    });
  }

  // 3. POST /api/rfq
  if (method === "POST" && cleanPath === "/api/rfq") {
    const { fields, file } = await parseRequestBody(init);
    if (!fields.fullName || !fields.email) {
      return jsonResponse({ success: false, message: "Full name and email are required to request a quote." }, 400);
    }

    let attachmentPath: string | null = null;
    let attachmentSize: number | null = null;
    const attachmentName = file ? file.name : fields.attachmentName || "";

    if (file) {
      attachmentSize = Math.round(file.size);
      const storageKey = `rfqs/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("uploads")
        .upload(storageKey, file, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });
      if (!upErr) {
        const { data: pub } = supabase.storage.from("uploads").getPublicUrl(storageKey);
        attachmentPath = pub?.publicUrl || null;
      }
    }

    const { error } = await supabase.from("rfq_submissions").insert([
      {
        full_name: fields.fullName,
        company_name: fields.companyName?.trim() || "Direct Client / Individual",
        email: fields.email,
        phone: fields.phone || "",
        industry: fields.industry || "Instrumentation",
        product_category: fields.productCategory || "Instrumentation & Valves",
        product_name:
          fields.productName?.trim() ||
          fields.productCategory?.trim() ||
          "Instrumentation & Valves Specification",
        quantity: fields.quantity ? String(fields.quantity) : "1",
        unit_of_measurement: fields.unitOfMeasurement || "Pcs",
        technical_specifications: fields.technicalSpecifications || "",
        delivery_location: fields.deliveryLocation || "",
        required_delivery_date: fields.requiredDeliveryDate || "",
        additional_comments: fields.additionalComments || "",
        attachment_name: attachmentName,
        attachment_path: attachmentPath,
        attachment_size: attachmentSize,
        status: "new",
      },
    ]);

    if (error) {
      return jsonResponse({ success: false, message: error.message }, 500);
    }
    return jsonResponse({
      success: true,
      message: "Quotation request successfully submitted to our engineering desk.",
    });
  }

  // 4. POST /api/careers or /api/careers/applications/submit
  if (method === "POST" && (cleanPath === "/api/careers" || cleanPath === "/api/careers/applications/submit")) {
    const { fields, file } = await parseRequestBody(init);
    if (!fields.fullName || !fields.email || !fields.phone || !fields.role) {
      return jsonResponse({ success: false, message: "Full name, email, phone, and role are required." }, 400);
    }

    const ref = `APP-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    let resumePath = "uploads/resumes/none";
    const resumeName = file ? file.name : "resume";
    const resumeSize = file ? Math.round(file.size) : 0;

    if (file) {
      const storageKey = `${ref}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("resumes")
        .upload(storageKey, file, {
          contentType: file.type || "application/pdf",
          upsert: true,
        });
      if (!upErr) {
        const { data: pub } = supabase.storage.from("resumes").getPublicUrl(storageKey);
        resumePath = pub?.publicUrl || `resumes/${storageKey}`;
      }
    }

    const { error } = await supabase.from("applications").insert([
      {
        application_reference: ref,
        full_name: fields.fullName.trim(),
        email: fields.email.toLowerCase().trim(),
        phone: fields.phone.trim(),
        role_of_interest: fields.role.trim(),
        experience: fields.experience || "Entry",
        linkedin_url: fields.link || "",
        cover_note: fields.message || "Application submitted via online careers portal",
        resume_storage_path: resumePath,
        resume_original_name: resumeName,
        resume_file_size: resumeSize,
        status: "New",
      },
    ]);

    if (error) {
      return jsonResponse({ success: false, message: error.message }, 500);
    }
    return jsonResponse({
      success: true,
      message: "Application submitted successfully.",
      reference: ref,
    });
  }

  return null;
}
