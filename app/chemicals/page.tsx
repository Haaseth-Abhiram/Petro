import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

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

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="relative bg-[#17191C] text-white py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
          style={{ backgroundImage: "url('/assets/img/reverse-osmosis.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 via-[#17191C]/90 to-[#17191C]/70 z-0" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="max-w-[820px]">
            <span className="eyebrow eyebrow-gold">CHEMICAL &amp; WATER TREATMENT</span>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight leading-[1.15] mb-4">
              Treatment chemicals, plants and instruments — from one supplier
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[660px]">
              Eight solution groups covering RO, cooling water, boiler and ETP chemistry, complete treatment plants, filtration media and laboratory instruments. Specified against your water analysis, not from a catalogue.
            </p>
          </div>
        </div>
      </section>

      {/* 2. JUMP NAV */}
      <nav className="jumpnav" aria-label="Chemical solution groups">
        <div className="max-w-[1400px] mx-auto px-6 jumpnav-inner">
          <a href="#ro-chemicals">RO Chemicals</a>
          <a href="#cooling-water">Cooling Water</a>
          <a href="#boiler-water">Boiler Water</a>
          <a href="#etp-chemicals">Wastewater / ETP</a>
          <a href="#water-treatment-plants">Treatment Plants</a>
          <a href="#wastewater-treatment">Wastewater Treatment</a>
          <a href="#commercial-chemicals">Commercial Chemicals</a>
          <a href="#laboratory-equipment">Laboratory Equipment</a>
        </div>
      </nav>

      {/* 3. PORTFOLIO INTRO */}
      <section className="py-16 bg-white border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mx-auto text-center mb-8">
            <span className="eyebrow">PRODUCT PORTFOLIO</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Eight solution groups, sixty-three line items
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-2">
              Dosing chemistry, plant and vessel manufacturing, filtration media and the instruments to verify it is all working — supplied as single items or as a complete package.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5">
            {["Chemicals", "Treatment plants", "Filtration", "Laboratory instruments"].map((pill, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full bg-[#F5F6F7] border border-[#D8DDE2] text-xs font-semibold text-[#5F6871]"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE EIGHT GROUPS */}
      <section className="py-16 lg:py-20 bg-[#F5F6F7] border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {groups.map((group) => (
              <article key={group.id} id={group.id} className="chem-card">
                <div className="chem-media">
                  <Image
                    src={group.img}
                    alt={group.title}
                    width={292}
                    height={136}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="chem-body p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="chem-num">{group.num}</span>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#17191C] mt-1 mb-3 pb-3 border-b border-[#D8DDE2]">
                      {group.title}
                    </h3>
                    <ul className="space-y-1.5 text-[13px] text-[#5F6871]">
                      {group.items.map((it, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B32] mr-2 mt-1.5 shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-5 pt-3 border-t border-[#D8DDE2]/60 flex items-center justify-between">
                    <Link
                      href={`/request-a-quote?category=${encodeURIComponent(group.title)}`}
                      className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#FF4B32] hover:text-[#E03820] inline-flex items-center"
                    >
                      <span>Request quote</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW WE WORK (FOUR STEPS) */}
      <section className="py-20 lg:py-24 bg-white border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mx-auto text-center mb-14">
            <span className="eyebrow">HOW A CHEMICAL SUPPLY STARTS</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Dosing is decided by the water, not the price list
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-3">
              The same antiscalant that protects one membrane will foul another. Four steps before anything is quoted.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div key={st.num} className="step-card">
                <div className="step-num">{st.num}</div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#17191C] mb-2.5">
                  {st.title}
                </h3>
                <p className="text-[#5F6871] text-sm leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA BAND */}
      <section className="relative bg-[#17191C] overflow-hidden py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/assets/img/reverse-osmosis.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 to-[#17191C]/80" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-[620px]">
              <span className="eyebrow eyebrow-gold">TECHNICAL SUPPORT</span>
              <h2 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-3">
                Send us your water analysis
              </h2>
              <p className="text-white/75 text-base sm:text-lg leading-relaxed">
                We evaluate TDS, silica, pH and hardness to determine the exact antiscalant dosage and cleaning schedule for your plant.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link href="/request-a-quote" className="btn btn-primary">
                Send a Water Analysis
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Contact Technical Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
