import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileCheck } from "lucide-react";

export default function InstrumentationPage() {
  const products = [
    {
      id: "tube-fittings",
      title: "Tube Fittings",
      img: "/assets/img/tube-fittings.jpg",
      reverse: false,
      desc: "Twin-ferrule instrumentation tube fittings for leak-tight, remakeable connections on impulse lines, analyser tubing and hydraulic runs.",
      headers: ["Type", "Size", "Material", "Pressure"],
      rows: [
        ["Union", '1/8"–1" (6–25 mm)', "SS316 / CS / Brass / Alloy", "Up to 6000 psi"],
        ["Elbow", '1/8"–1" (6–25 mm)', "SS316 / CS / Brass / Alloy", "Up to 6000 psi"],
        ["Tee", '1/8"–1" (6–25 mm)', "SS316 / CS / Brass / Alloy", "Up to 6000 psi"],
        ["Adapter", '1/8"–1" (6–25 mm)', "SS316 / CS / Brass / Alloy", "Up to 6000 psi"],
      ],
    },
    {
      id: "pipe-fittings",
      title: "Pipe Fittings",
      img: "/assets/img/pipe-fittings.jpg",
      reverse: true,
      desc: "Threaded pipe fittings to NPT and BSP standards for utility, instrument air and general process connections.",
      headers: ["Type", "Size", "Material", "Standard"],
      rows: [
        ["Hex Nipple", '1/8"–2"', "SS316 / CS / Brass", "ASME B16.11 / NPT"],
        ["Coupling", '1/8"–2"', "SS316 / CS / Brass", "ASME B16.11 / NPT"],
        ["Street Elbow", '1/8"–2"', "SS316 / CS", "ASME B16.11 / NPT"],
        ["Hex Bushing & Plug", '1/8"–2"', "SS316 / CS / Brass", "ASME B16.11 / NPT"],
      ],
    },
    {
      id: "needle-valves",
      title: "Needle Valves",
      img: "/assets/img/needle-valves-alt.jpg",
      reverse: false,
      desc: "Fine regulation and shutoff valves for high-pressure gas and liquid lines, with non-rotating stem tips to prevent seat galling.",
      headers: ["Pattern", "Size", "Material", "Pressure"],
      rows: [
        ["Integral Bonnet Straight", '1/4"–1/2" NPT', "SS316 / Alloy", "Up to 6000 psi"],
        ["Screwed Bonnet Angle", '1/4"–1/2" NPT', "SS316 / Monel", "Up to 10,000 psi"],
        ["Panel Mount Metering", '1/8"–1/2" NPT', "SS316", "Up to 5000 psi"],
        ["Multi-port Gauge Valve", '1/2" NPT', "SS316", "Up to 6000 psi"],
      ],
    },
    {
      id: "ball-valves",
      title: "Ball Valves",
      img: "/assets/img/ball-valves-alt.jpg",
      reverse: true,
      desc: "Quarter-turn instrumentation ball valves for positive isolation, available in 2-way and 3-way diverting configurations.",
      headers: ["Configuration", "Size", "Material", "Pressure"],
      rows: [
        ["2-way High Pressure", '1/8"–1" (6–25 mm)', "SS316 / CS", "Up to 6000 psi"],
        ["3-way Diverting", '1/8"–1" (6–25 mm)', "SS316 / CS", "Up to 6000 psi"],
        ["Panel Mount Instrument", '1/4"–1/2"', "SS316", "Up to 3000 psi"],
        ["3-Piece Bolted Body", '1/4"–1"', "SS316 / CS", "Up to 6000 psi"],
      ],
    },
    {
      id: "manifold-valves",
      title: "Manifold Valves",
      img: "/assets/img/manifold-valves-alt.jpg",
      reverse: false,
      desc: "Direct-mount and remote-mount manifolds for differential pressure transmitters — block, bleed and equalise in a single assembly.",
      headers: ["Type", "Connection", "Material", "Service"],
      rows: [
        ["2-valve manifold", '1/2" NPT', "SS316", "Gauge calibration"],
        ["3-valve manifold", '1/2" NPT / Flanged', "SS316", "DP Transmitter block & equalise"],
        ["5-valve manifold", '1/2" NPT / Coplanar', "SS316", "Gas custody flow metering"],
      ],
    },
    {
      id: "check-valves",
      title: "Check Valves",
      img: "/assets/img/check-valves-alt.jpg",
      reverse: true,
      desc: "Inline non-return valves protecting instruments and sample systems from reverse flow, with defined cracking pressures.",
      headers: ["Type", "Size", "Material", "Pressure"],
      rows: [
        ["Spring Loaded Poppet", '1/8"–1" (6–25 mm)', "SS316", "Up to 6000 psi"],
        ["All-metal Ball Type", '1/8"–1" (6–25 mm)', "SS316", "Up to 6000 psi"],
        ["Adjustable Cracking", '1/4"–1/2" NPT', "SS316", "3 to 50 psi cracking range"],
      ],
    },
    {
      id: "tubing-coils",
      title: "Tubing Coils",
      img: "/assets/img/tubing-coils-alt.jpg",
      reverse: false,
      desc: "Fully annealed seamless instrument tubing, supplied in continuous coils to minimise fittings and potential leak paths across a run.",
      headers: ["Product", "Size", "Material", "Standard"],
      rows: [
        ["Seamless imperial tubing", '1/8" to 1" O.D.', "SS316L / Inconel 625", "ASTM A269 / A213"],
        ["Metric seamless tubing", "6 mm to 25 mm O.D.", "SS316L / Duplex", "EN 10216-5 / NACE"],
        ["Continuous reels", "Up to 1000m lengths", "SS316L Bright Annealed", "Full Eddy Current Tested"],
      ],
    },
    {
      id: "analyser-systems",
      title: "Analyser Systems",
      img: "/assets/img/analyser-systems.jpg",
      reverse: true,
      desc: "Turnkey sample conditioning systems, heated probes, shelters and continuous emissions monitoring instrumentation.",
      headers: ["System", "Components", "Application", "Approvals"],
      rows: [
        ["CEMS Packages", "Heated sample line, probe, chiller, SOx/NOx analysers", "Stack emissions", "EPA / CPCB"],
        ["Gas Chromatograph (GC)", "Carrier gas manifolds, sample conditioning, shelter", "Refinery BTU metering", "ATEX / IECEx"],
        ["Combustion Efficiency", "In-situ ZrO2 oxygen and COe analysers", "Furnaces & boilers", "Explosion-proof"],
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="relative bg-[#17191C] text-white py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
          style={{ backgroundImage: "url('/assets/img/tube-fittings.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 via-[#17191C]/90 to-[#17191C]/70 z-0" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="max-w-[820px]">
            <span className="eyebrow eyebrow-gold">INSTRUMENTATION &amp; VALVES</span>
            <h1 className="text-white text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-tight leading-[1.15] mb-4">
              Precision instrumentation products, supplied to specification
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-[660px]">
              Fittings, valves and tubing in SS316, carbon steel, brass and specialist alloys — sized 1/8" to 1" and rated to 10,000 psi, with material traceability on every line item.
            </p>
          </div>
        </div>
      </section>

      {/* 2. JUMP NAV */}
      <nav className="jumpnav" aria-label="Product categories">
        <div className="max-w-[1400px] mx-auto px-6 jumpnav-inner">
          <a href="#tube-fittings">Tube Fittings</a>
          <a href="#pipe-fittings">Pipe Fittings</a>
          <a href="#needle-valves">Needle Valves</a>
          <a href="#ball-valves">Ball Valves</a>
          <a href="#manifold-valves">Manifold Valves</a>
          <a href="#check-valves">Check Valves</a>
          <a href="#tubing-coils">Tubing Coils</a>
          <a href="#analyser-systems">Analyser Systems</a>
        </div>
      </nav>

      {/* 3. GROUP A SECTION INTRO */}
      <section className="py-16 bg-white border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="max-w-[760px] mx-auto text-center">
            <span className="eyebrow">GROUP A</span>
            <h2 className="text-[#17191C] text-2xl sm:text-4xl font-extrabold tracking-tight">
              Instrumentation fittings, valves &amp; tubing
            </h2>
            <p className="text-[#5F6871] text-base sm:text-lg mt-2">
              Eight core categories held against project specifications, with dimensional and pressure data confirmed at enquiry stage.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ALTERNATING PRODUCT BLOCKS */}
      <section className="py-8 bg-white border-b border-[#D8DDE2]">
        <div className="max-w-[1400px] mx-auto px-6">
          {products.map((p) => (
            <article
              key={p.id}
              id={p.id}
              className={`prod ${p.reverse ? "prod-reverse" : ""}`}
            >
              <div className="prod-media">
                <Image
                  src={p.img}
                  alt={p.title}
                  width={1024}
                  height={582}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="prod-copy">
                <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[#17191C]">
                  {p.title}
                </h3>
                <p>{p.desc}</p>

                <div className="table-scroll">
                  <table className="spec-table">
                    <caption>Specification range</caption>
                    <thead>
                      <tr>
                        {p.headers.map((h, i) => (
                          <th key={i} scope="col">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {p.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          <th scope="row">{row[0]}</th>
                          {row.slice(1).map((col, cIdx) => (
                            <td key={cIdx}>{col}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="btn-group mt-6">
                  <Link
                    href={`/request-a-quote?product=${encodeURIComponent(p.title)}`}
                    className="btn btn-primary"
                  >
                    Enquire about {p.title.toLowerCase()}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. CTA BAND */}
      <section className="relative bg-[#17191C] overflow-hidden py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/assets/img/tube-fittings.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C]/95 to-[#17191C]/80" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-[620px]">
              <span className="eyebrow eyebrow-gold">TECHNICAL RFQ</span>
              <h2 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 mb-3">
                Send us your line list or RFQ
              </h2>
              <p className="text-white/75 text-base sm:text-lg leading-relaxed">
                We confirm sizes, pressure classes, connection types and delivery timelines within 24–48 hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link href="/request-a-quote" className="btn btn-primary">
                Submit Datasheet or RFQ
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Contact Sales Desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
