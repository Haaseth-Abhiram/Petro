import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Flame,
  Waves,
  Factory,
  Recycle,
  FlaskConical,
  Beaker,
  Microscope,
  Calculator,
  PackageCheck,
  Activity,
  Phone,
  FileCheck,
  CheckCircle2,
  Home as HomeIcon,
  ChevronRight,
} from "lucide-react";
import SolutionLink from "@/components/common/SolutionLink";
import Reveal from "@/components/common/Reveal";
import CountUp from "@/components/common/CountUp";

export default function ChemicalsPage() {
  const groups = [
    {
      id: "ro-chemicals",
      num: "01",
      title: "RO Chemicals & Components",
      img: "/assets/img/chem-01-ro-chemicals.jpg",
      items: [
        "RO antiscalant chemicals",
        "RO membrane cleaning chemicals",
        "SMBS chemicals",
        "RO dosing pumps",
        "RO pH booster chemicals",
        "RO cartridge filters",
        "RO membranes",
        "RO plant design",
        "FRP vessels",
        "Bag filters",
      ],
    },
    {
      id: "cooling-water",
      num: "02",
      title: "Cooling Water Chemicals",
      img: "/assets/img/chem-02-cooling-water.jpg",
      items: [
        "Cooling water descaling chemicals",
        "Scale inhibitors",
        "Corrosion inhibitors",
        "Microbiocides",
        "Biodispersants",
        "Chiller water chemicals",
        "pH correction chemicals",
      ],
    },
    {
      id: "boiler-water",
      num: "03",
      title: "Boiler Water Chemicals",
      img: "/assets/img/chem-03-boiler-water.jpg",
      items: [
        "Oxygen scavengers",
        "pH boosters",
        "Boiler descaling chemicals",
        "Sludge conditioners",
        "Scale and corrosion inhibitors",
      ],
    },
    {
      id: "etp-chemicals",
      num: "04",
      title: "Wastewater / ETP Chemicals",
      img: "/assets/img/chem-04-etp-chemicals.jpg",
      items: [
        "Colour removal chemicals",
        "Defoamers",
        "Antifoaming chemicals",
        "Polyelectrolytes",
        "Ferric chloride",
        "Ferric sulphate",
        "PAC",
        "Lime",
        "Non-ferric alum",
        "Ferric alum",
      ],
    },
    {
      id: "water-treatment-plants",
      num: "05",
      title: "Water Treatment Plants",
      img: "/assets/img/chem-05-water-treatment-plants.jpg",
      items: [
        "DM plant manufacturing",
        "Softening plant manufacturing",
        "RO plant manufacturing",
        "Softener / DM resins",
        "Sand filters",
        "Carbon filters",
        "Gravel for sand filters",
        "FRP vessels for RO, DM & softeners",
      ],
    },
    {
      id: "wastewater-treatment",
      num: "06",
      title: "Wastewater Treatment",
      img: "/assets/img/chem-06-wastewater-treatment.jpg",
      items: [
        "ETP manufacturing",
        "Sewage plant manufacturing",
        "RO plants for wastewater",
        "Sand / carbon filters",
        "Activated carbon",
        "Aerators",
      ],
    },
    {
      id: "commercial-chemicals",
      num: "07",
      title: "Commercial Chemicals",
      img: "/assets/img/chem-07-commercial-chemicals.jpg",
      items: [
        "Sodium hypochlorite",
        "Sodium chloride",
        "Hydrochloric acid (HCl)",
        "Sulfuric acid (H₂SO₄)",
        "Caustic lye",
        "Caustic flakes",
        "Magnesium oxide (MgO)",
        "Acetic acid",
        "Soda ash",
        "Poultry chemicals",
        "Construction chemicals",
      ],
    },
    {
      id: "laboratory-equipment",
      num: "08",
      title: "Laboratory Equipment",
      img: "/assets/img/chem-08-laboratory-equipment.jpg",
      items: [
        "pH meters",
        "TDS meters",
        "Bacteria test kits",
        "Water analysis test kits",
        "Spectrophotometers",
        "Magnetic stirrers",
      ],
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Water analysis",
      desc: "Send us a current water report or sample. We look at pH, conductivity, silica, hardness, TDS and microbiological load before recommending chemistry.",
    },
    {
      num: "02",
      title: "Dosage calculation",
      desc: "We project recovery rates, scaling thresholds and operating cycles — calculating the correct ppm dosage so you do not under-treat or waste chemical.",
    },
    {
      num: "03",
      title: "Supply & dosing setup",
      desc: "Supplied in standard drums, carboys or IBCs with certificate of analysis (COA). We advise on injection points, stroke length and dilution water quality.",
    },
    {
      num: "04",
      title: "Monitoring",
      desc: "Regular testing of feed, reject and permeate water confirms the program is working. We adjust dosing when seasons or raw water sources change.",
    },
  ];

  const icons = [Droplets, Waves, Flame, Factory, Recycle, Recycle, Beaker, Microscope];
  const stepIcons = [FlaskConical, Calculator, PackageCheck, Activity];
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="relative bg-[#17191C] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/assets/img/reverse-osmosis.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C] via-[#17191C]/90 to-[#23272B]/70" />
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#FFA028]/15 blur-[110px]" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-10 pb-14 grid lg:grid-cols-[1.25fr_1fr] gap-8 items-center">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-white/60 mb-4">
              <Link href="/" className="hover:text-white inline-flex items-center gap-1">
                <HomeIcon className="w-3.5 h-3.5" />
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#FFA028] font-semibold">Chemicals</span>
            </nav>
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028] mb-3">
              <span className="h-[3px] w-9 rounded bg-[#FFA028]" />
              Chemical &amp; water treatment division
            </span>
            <h1 className="text-white text-[1.85rem] sm:text-4xl lg:text-[2.65rem] font-black leading-[1.1] mb-3">
              Treatment chemicals, plants and instruments — <span className="text-[#FFA028]">from one supplier</span>
            </h1>
            <p className="text-white/80 text-[14.5px] sm:text-base leading-relaxed max-w-[620px] mb-6">
              Eight solution groups covering RO, cooling water, boiler and ETP chemistry, complete treatment plants, filtration media and laboratory instruments. Specified against your water analysis.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/request-a-quote" className="btn btn-primary">
                Request a Chemical Quote <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <a href="#ro-chemicals" className="btn btn-outline">
                Browse 8 Solution Groups
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: groups.length, l: "Solution groups" },
              { n: total, l: "Catalogued line items" },
              { n: 100, l: "% Analysis-driven" },
              { n: 1, l: "Point of contact" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl bg-white/[0.08] backdrop-blur border border-white/15 p-4 sm:p-5 text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#FFA028] leading-none">
                  <CountUp end={s.n} />
                  {s.l.includes("%") ? "%" : "+"}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/75 mt-1.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. JUMP NAV */}
      <nav
        className="sticky top-[68px] z-30 bg-white border-b border-[#929DA7]/20 shadow-sm overflow-x-auto"
        aria-label="Chemical solution groups"
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-2.5 flex items-center gap-2 whitespace-nowrap text-[12.5px] font-bold">
          {groups.map((g, i) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full px-3 py-1 bg-[#F5F6F7] hover:bg-[#FF4B32] hover:text-white text-[#17191C] border border-[#929DA7]/20 transition-colors"
            >
              <span className="text-[#FF4B32] group-hover:text-white font-extrabold mr-1">0{i + 1}</span>
              {g.title.split(" ")[0]}
            </a>
          ))}
        </div>
      </nav>

      {/* 3. EIGHT SOLUTION GROUPS (CARDS) */}
      <section className="py-12 sm:py-16 bg-[#F5F6F7]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[680px] mx-auto mb-10">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-2">
              <span className="h-[3px] w-9 rounded bg-[#FF4B32]" />
              Product portfolio
            </span>
            <h2 className="text-[1.5rem] sm:text-[2rem] font-black leading-[1.15] text-[#17191C] mb-2">
              Eight solution groups, {total} line items
            </h2>
            <p className="text-[14px] text-[#929DA7]">
              Dosing chemistry, plant manufacturing, filtration media and laboratory testing instruments — supplied as single items or as an integrated package.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {groups.map((g, idx) => {
              const Icon = icons[idx];
              return (
                <Reveal key={g.id} delay={(idx % 4) * 80}>
                  <article
                    id={g.id}
                    className="group flex flex-col h-full rounded-2xl bg-white border border-[#929DA7]/20 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-[#FF4B32] transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-[140px] bg-[#17191C] overflow-hidden">
                      <Image
                        src={g.img}
                        alt={g.title}
                        fill
                        sizes="(max-width:640px) 100vw, 300px"
                        className="object-cover opacity-85 group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17191C]/80 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 rounded-md bg-[#FF4B32] text-white text-[11px] font-black px-2 py-0.5">
                        {g.num}
                      </span>
                      <span className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-white/20 backdrop-blur text-white flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <h3 className="text-[16px] font-black text-[#17191C] leading-tight">{g.title}</h3>
                      <span className="text-[10.5px] font-extrabold tracking-[0.2em] text-[#FF4B32] mt-0.5 mb-2">
                        {g.items.length} LINE ITEMS
                      </span>
                      <ul className="space-y-1.5 text-[13px] text-[#17191C]/80 flex-1">
                        {g.items.map((it) => (
                          <li key={it} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#FFA028]" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                      <SolutionLink
                        title={g.title}
                        items={g.items}
                        img={g.img}
                        className="mt-4 pt-3 border-t border-[#929DA7]/20 inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-[#FF4B32] group-hover:gap-3 transition-all"
                      >
                        Get suggestions &amp; quote <ArrowRight className="w-4 h-4" />
                      </SolutionLink>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW A CHEMICAL SUPPLY STARTS */}
      <section className="relative py-14 sm:py-16 bg-[#17191C] overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-[#FF4B32]/15 blur-[110px]" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#FFA028]/15 blur-[110px]" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[680px] mx-auto mb-12">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028] mb-2">
              <span className="h-[3px] w-9 rounded bg-[#FFA028]" />
              How a chemical supply starts
            </span>
            <h2 className="text-[1.5rem] sm:text-[2rem] font-black leading-[1.15] text-white mb-2">
              Dosing is decided by the water, not the price list
            </h2>
            <p className="text-[14px] text-white/70">
              The same antiscalant that protects one membrane will foul another. Four steps before anything is quoted.
            </p>
          </Reveal>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
            <span
              aria-hidden="true"
              className="hidden lg:block absolute top-0 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#FF4B32] via-[#FFA028] to-[#FF4B32] opacity-60"
            />
            {steps.map((st, k) => {
              const Icon = stepIcons[k];
              return (
                <Reveal key={st.num} delay={k * 110}>
                  <div className="group relative h-full rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/10 hover:border-[#FFA028] p-5 pt-10 text-center transition-all duration-300">
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] h-[68px] rounded-full bg-[#FF4B32] group-hover:bg-[#FFA028] text-white flex items-center justify-center ring-4 ring-[#17191C] shadow-xl transition-colors">
                      <Icon className="w-7 h-7" />
                    </span>
                    <span className="text-[11px] font-extrabold tracking-[0.2em] text-[#FFA028]">STEP {st.num}</span>
                    <h3 className="text-[16px] font-extrabold text-white mt-1 mb-2">{st.title}</h3>
                    <p className="text-[13px] leading-relaxed text-white/70">{st.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CTA STRIP */}
      <section className="py-9 bg-gradient-to-r from-[#17191C] via-[#23272B] to-[#17191C]">
        <Reveal className="max-w-[1240px] mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-[620px]">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028]">
              Technical support
            </span>
            <h2 className="text-white text-[1.4rem] sm:text-3xl font-black leading-[1.15] mt-1 mb-1">
              Send us your water analysis
            </h2>
            <p className="text-white/85 text-[13.5px]">
              We evaluate TDS, silica, pH and hardness to determine the exact antiscalant dosage and cleaning schedule for your plant.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF4B32] hover:bg-[#FFA028] text-white font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <FileCheck className="w-5 h-5" />
              Send a Water Analysis
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <Phone className="w-5 h-5 text-[#FFA028]" />
              Contact Technical Team
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
