import Link from "next/link";
import LegalPage from "@/components/common/LegalPage";

export const metadata = { title: "Sitemap | Petro Engineering" };

const groups = [
  { t: "Company", l: [["Home", "/"], ["About Us", "/about"], ["Services", "/services"], ["Industries Served", "/industries"], ["Resources & FAQs", "/resources"], ["Careers", "/careers"], ["Contact Us", "/contact"], ["Request a Quote", "/request-a-quote"]] },
  { t: "Chemicals", l: [["All chemicals", "/chemicals"], ["RO Chemicals", "/chemicals#ro-chemicals"], ["Cooling Water", "/chemicals#cooling-water"], ["Boiler Water", "/chemicals#boiler-water"], ["Wastewater / ETP", "/chemicals#etp-chemicals"], ["Treatment Plants", "/chemicals#water-treatment-plants"], ["Laboratory Equipment", "/chemicals#laboratory-equipment"]] },
  { t: "Instrumentation", l: [["All instrumentation", "/instrumentation"], ["Tube Fittings", "/instrumentation#tube-fittings"], ["Pipe Fittings", "/instrumentation#pipe-fittings"], ["Needle Valves", "/instrumentation#needle-valves"], ["Ball Valves", "/instrumentation#ball-valves"], ["Manifold Valves", "/instrumentation#manifold-valves"], ["Check Valves", "/instrumentation#check-valves"], ["Tubing Coils", "/instrumentation#tubing-coils"], ["Analyser Systems", "/instrumentation#analyser-systems"]] },
  { t: "Legal", l: [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"], ["Login", "/login"]] },
];

export default function Page() {
  return (
    <>
      <LegalPage crumb="Sitemap" title="Sitemap" intro="Every page on the Petro Engineering website." sections={[]} />
      <section className="pb-12 bg-white -mt-4">
        <div className="max-w-[820px] mx-auto px-5 sm:px-8 grid sm:grid-cols-2 gap-7">
          {groups.map((g) => (
            <div key={g.t}>
              <h2 className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#17191C] pb-1.5 mb-2.5 border-b-2 border-[#C80808] inline-block">{g.t}</h2>
              <ul className="space-y-1.5">{g.l.map(([n, h]) => (<li key={h}><Link href={h} className="text-[14px] hover:text-[#C80808]">{n}</Link></li>))}</ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
