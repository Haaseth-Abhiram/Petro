import React from "react";
import Link from "next/link";
import { ArrowRight, Mail, Users, Wrench, ShieldCheck, TrendingUp, Home as HomeIcon, ChevronRight } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import CareersBoard, { Job } from "@/components/common/CareersBoard";
import CareerForm from "@/components/forms/CareerForm";
import { COMPANY_INFO } from "@/data/company";
import { query } from "@/lib/db";

export const metadata = {
  title: "Careers | Petro Engineering",
  description: "Build a career in industrial sourcing, process instrumentation and water treatment with Petro Engineering Private Limited.",
};

export const dynamic = "force-dynamic";

const perks = [
  { icon: Wrench, t: "Learning & Development", d: "Hands-on work with valves, fittings, analysers and RO chemistry, and a clear path to advance." },
  { icon: Users, t: "Team Culture", d: "Collaborate with skilled engineers who care about doing great work together." },
  { icon: ShieldCheck, t: "Quality-first", d: "EN 10204 documentation, NACE compliance and clear accountability on every order." },
  { icon: TrendingUp, t: "Room to Grow", d: "A focused, growing company where ownership comes early and good work is visible." },
];

const fallbackJobs: Job[] = [
  { role: "Sales Engineer", title: "Technical Sales & Sourcing Engineer", d: "Review enquiries and datasheets, source against specifications and prepare technical and commercial proposals.", img: "/assets/img/tube-fittings.jpg", exp: "2+ years", resp: ["Review RFQs, datasheets and MTOs", "Source from approved manufacturers", "Prepare technical and commercial proposals", "Follow up with clients until order closure"], location: "Mumbai, India", employment_type: "Full-time", department: "Sales" },
  { role: "Procurement Coordinator", title: "Procurement & Expediting Coordinator", d: "Manage purchase orders, vendor follow-up, milestones and consolidated deliveries for project orders.", img: "/assets/img/ball-valves.jpg", exp: "2+ years", resp: ["Issue and track purchase orders", "Expedite vendor milestones", "Coordinate consolidated shipments", "Maintain order documentation"], location: "Mumbai, India", employment_type: "Full-time", department: "Procurement" },
  { role: "Quality Engineer", title: "Quality & Inspection Engineer", d: "Coordinate third-party inspection, verify MTCs and witness tests so documentation is ready for handover.", img: "/assets/img/service-inspection-qa.jpg", exp: "3+ years", resp: ["Coordinate third-party inspection", "Verify EN 10204 3.1 / 3.2 certificates", "Witness PMI and pressure tests", "Compile handover dossiers"], location: "Mumbai, India", employment_type: "Full-time", department: "Quality Assurance" },
  { role: "Chemical Engineer", title: "Chemical Application Engineer", d: "Recommend and support RO, cooling, boiler and ETP chemistry programmes against client water analysis.", img: "/assets/img/chem-01-ro-chemicals.jpg", exp: "2+ years", resp: ["Analyse client water reports", "Project dosage and cleaning schedules", "Support commissioning and monitoring", "Advise on injection points and set-up"], location: "Mumbai, India", employment_type: "Full-time", department: "Chemicals" },
  { role: "Logistics Executive", title: "Logistics & Export Executive", d: "Plan packing, dangerous goods documentation, customs clearance and door-to-site freight.", img: "/assets/img/chem-07-commercial-chemicals.jpg", exp: "1+ years", resp: ["Plan export packing and crating", "Prepare IMDG / IATA documentation", "Handle customs clearance", "Track shipments to site"], location: "Mumbai, India", employment_type: "Full-time", department: "Logistics" },
  { role: "General Application", title: "Don't see your role?", d: "Send a general application and tell us how you can contribute. We keep every profile on file for upcoming needs.", img: "/assets/img/service-technical-consultation.jpg", exp: "Any level", resp: ["Tell us about your background", "Share the work you want to do", "We contact you when a role matches"], location: "India", employment_type: "Full-time", department: "General" },
];

async function getPublishedJobs(): Promise<{ jobs: Job[]; departmentCount: number }> {
  try {
    const res = await query(`
      SELECT 
        j.id,
        j.role,
        j.title,
        j.slug,
        j.department,
        j.location,
        j.employment_type,
        j.experience,
        j.short_description,
        j.description,
        j.responsibilities,
        j.image,
        j.display_order
      FROM jobs j
      WHERE j.status = 'published'
      ORDER BY j.display_order ASC, j.created_at DESC;
    `);

    if (res.rows && res.rows.length > 0) {
      const mappedJobs: Job[] = res.rows.map((r: any) => {
        let respArr: string[] = [];
        if (Array.isArray(r.responsibilities)) {
          respArr = r.responsibilities;
        } else if (typeof r.responsibilities === "string") {
          try {
            respArr = JSON.parse(r.responsibilities);
          } catch {
            respArr = [r.responsibilities];
          }
        }

        return {
          id: r.id,
          role: r.role || r.title,
          title: r.title,
          d: r.short_description || r.description || "",
          img: r.image || "/assets/img/service-technical-consultation.jpg",
          exp: r.experience || "2+ years",
          resp: respArr,
          location: r.location || "Mumbai, India",
          employment_type: r.employment_type || "Full-time",
          department: r.department || "Engineering",
          slug: r.slug,
        };
      });

      // Always include General Application card if not already in mapped list
      const hasGeneral = mappedJobs.some((j) => j.role.toLowerCase().includes("general"));
      if (!hasGeneral) {
        mappedJobs.push({
          role: "General Application",
          title: "Don't see your role?",
          d: "Send a general application and tell us how you can contribute. We keep every profile on file for upcoming needs.",
          img: "/assets/img/service-technical-consultation.jpg",
          exp: "Any level",
          resp: ["Tell us about your background", "Share the work you want to do", "We contact you when a role matches"],
          location: "India",
          employment_type: "Full-time",
          department: "General",
        });
      }

      const departments = new Set(mappedJobs.map((j) => j.department).filter(Boolean));
      return { jobs: mappedJobs, departmentCount: departments.size || 5 };
    }
  } catch (err) {
    console.error("Failed to query published jobs in CareersPage, using fallback:", err);
  }

  return { jobs: fallbackJobs, departmentCount: 5 };
}

export default async function CareersPage() {
  const { jobs, departmentCount } = await getPublishedJobs();

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative bg-[#17191C] text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/assets/img/service-technical-consultation.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/85 via-[#17191C]/70 to-[#FF4B32]/15" />
        <div className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-[#FF4B32] via-[#FFA028] to-[#FFD580] opacity-70" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-8 pb-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-white/70 mb-6">
            <Link href="/" className="hover:text-white inline-flex items-center gap-1"><HomeIcon className="w-3.5 h-3.5" />Home</Link><ChevronRight className="w-3.5 h-3.5" /><span className="text-white font-semibold">Careers</span>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/25 backdrop-blur px-4 py-1.5 text-[12.5px] font-bold mb-4"><span className="w-2 h-2 rounded-full bg-[#FFA028] animate-pulse" />We&apos;re hiring across India</span>
          <h1 className="text-white text-[2.2rem] sm:text-[3.4rem] font-black tracking-tight leading-[1.05] mb-4 max-w-[700px]">Grow your career with <span className="text-gradient animate-gradient">Petro</span></h1>
          <p className="text-white/85 text-[15px] sm:text-[16.5px] leading-relaxed max-w-[620px] mb-6">Join a team of engineers and sourcing specialists supplying water treatment chemistry and process instrumentation to plants across India and abroad. Find your role, view the details, and apply in minutes.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#positions" className="inline-flex items-center gap-2 rounded-xl bg-[#FF4B32] hover:bg-[#E03820] text-white text-[14px] font-extrabold px-6 py-3 shadow-[0_6px_18px_rgba(255,75,50,0.18)] transition-colors">View Open Positions <ArrowRight className="w-4 h-4" /></a>
            <a href="#apply" className="inline-flex items-center gap-2 rounded-xl border border-white/70 text-white text-[14px] font-extrabold px-6 py-3 hover:bg-white/10 transition-colors"><Mail className="w-4 h-4" />Apply Now</a>
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section className="py-12 sm:py-14 bg-white">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[640px] mx-auto mb-9">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FF4B32]/10 text-[#FF4B32] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em]"><ShieldCheck className="w-3.5 h-3.5" />Why join us</span>
            <h2 className="text-[1.8rem] sm:text-[2.3rem] font-black leading-[1.1] text-[#17191C] mt-3">Why work at Petro Engineering?</h2>
            <span className="block h-[4px] w-16 rounded-full bg-gradient-to-r from-[#FF4B32] to-[#FFA028] mx-auto mt-4" />
            <p className="text-[14.5px] text-[#5F6871] mt-4">People are the heart of our organisation — we invest in our team and give them the tools and trust to excel.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map((p, k) => (
              <Reveal key={p.t} delay={k * 80}>
                <div className="group h-full rounded-2xl bg-white border border-[#D8DDE2] shadow-md p-6 hover:shadow-2xl hover:border-[#FF4B32] hover:-translate-y-1.5 transition-all duration-300">
                  <span className="w-12 h-12 rounded-xl bg-[#FF4B32]/10 text-[#FF4B32] group-hover:bg-[#FF4B32] group-hover:text-white flex items-center justify-center mb-4 transition-colors"><p.icon className="w-6 h-6" /></span>
                  <h3 className="text-[16px] font-extrabold text-[#17191C] mb-1.5">{p.t}</h3>
                  <p className="text-[13.5px] text-[#5F6871] leading-relaxed">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section id="positions" className="py-12 sm:py-14 bg-[#F5F6F7] scroll-mt-28">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-[2rem] sm:text-[2.6rem] font-black leading-[1.05] text-[#17191C]">Open <span className="text-gradient">Positions</span></h2>
              <p className="text-[13.5px] text-[#5F6871] mt-2 max-w-[460px]">Roles listed here are indicative of the areas we recruit for. Apply to any, or send a general application.</p>
            </div>
            <div className="flex gap-3">
              {[{ n: jobs.length, l: "Open roles" }, { n: departmentCount, l: "Departments" }].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white border border-[#D8DDE2] shadow-sm px-5 py-3 text-center"><div className="text-[1.6rem] font-black text-[#FF4B32] leading-none">{s.n}</div><div className="text-[10px] font-extrabold tracking-[0.18em] text-[#5F6871] mt-1">{s.l.toUpperCase()}</div></div>
              ))}
            </div>
          </Reveal>
          <CareersBoard jobs={jobs} />
        </div>
      </section>

      {/* GENERAL APPLICATION */}
      <section id="apply" className="py-12 sm:py-14 bg-white scroll-mt-28">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center mb-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FF4B32]/10 text-[#FF4B32] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em]"><Mail className="w-3.5 h-3.5" />Apply</span>
            <h2 className="text-[1.8rem] sm:text-[2.2rem] font-black leading-[1.1] text-[#17191C] mt-3">Start your application</h2>
            <p className="text-[14px] text-[#5F6871] mt-2">Or write to us at <a className="font-bold text-[#FF4B32] hover:underline" href={`mailto:${COMPANY_INFO.contact.email}?subject=Career%20application`}>{COMPANY_INFO.contact.email}</a>.</p>
          </Reveal>
          <div className="rounded-3xl bg-white border border-[#D8DDE2] border-t-4 border-t-[#FF4B32] shadow-2xl p-5 sm:p-8"><CareerForm /></div>
        </div>
      </section>
    </div>
  );
}
