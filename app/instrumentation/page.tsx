import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileCheck, ShieldCheck, Phone, Home as HomeIcon, ChevronRight } from "lucide-react";
import SolutionLink from "@/components/common/SolutionLink";
import Reveal from "@/components/common/Reveal";
import CountUp from "@/components/common/CountUp";

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
        ["Seamless imperial tubing", '1/8" to 1" O.D.', "SS316L / Inconel 625", "ASTM A269 / ASME SA213"],
        ["Seamless metric tubing", "6 mm to 25 mm O.D.", "SS316L / Monel 400", "EN 10216-5 / ASTM A269"],
        ["Coiled instrument tubing", '1/4", 3/8", 1/2" continuous', "SS316L / Hastelloy C276", "ASTM A269, up to 1000m coil"],
      ],
    },
    {
      id: "analyser-systems",
      title: "Analyser Systems",
      img: "/assets/img/analyser-systems.jpg",
      reverse: true,
      desc: "Sample conditioning systems, heated sample lines, probe assemblies and gas analysers for process monitoring and emission compliance.",
      headers: ["System", "Configuration", "Application", "Compliance"],
      rows: [
        ["Sample Conditioning System", "Custom panel / rack mount", "Refinery process gas", "ATEX / IECEx Zone 1/2"],
        ["Continuous Emission Monitoring (CEMS)", "Heated probe + gas analyser", "Stack emission monitoring", "EPA / CPCB compliant"],
        ["Process Gas Chromatograph (GC)", "Enclosure with calibration rack", "Natural gas BTU / composition", "Custody transfer grade"],
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="relative bg-[#17191C] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/assets/img/tube-fittings.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17191C] via-[#17191C]/90 to-[#23272B]/60" />
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#FFA028]/15 blur-[110px]" />
        <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full bg-[#FF4B32]/15 blur-[100px]" />
        <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-10 pb-12 grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-white/60 mb-4">
              <Link href="/" className="hover:text-white inline-flex items-center gap-1">
                <HomeIcon className="w-3.5 h-3.5" />
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#FFA028] font-semibold">Instrumentation</span>
            </nav>
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028] mb-3">
              <span className="h-[3px] w-9 rounded bg-[#FFA028]" />
              Instrumentation &amp; valves
            </span>
            <h1 className="text-white text-[1.9rem] sm:text-4xl lg:text-[2.6rem] font-black tracking-tight leading-[1.1] mb-3">
              Precision instrumentation products, <span className="text-[#FFA028]">supplied to specification</span>
            </h1>
            <p className="text-white/75 text-[15px] sm:text-base leading-relaxed max-w-[600px] mb-6">
              Fittings, valves and tubing in SS316, carbon steel, brass and specialist alloys — sized 1/8" to 1" and rated to 10,000 psi, with material traceability on every line item.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/request-a-quote" className="btn btn-primary">
                Submit Datasheet or RFQ <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a href="#catalogue" className="btn btn-outline">
                Browse the catalogue
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 text-center">
              <div className="text-3xl font-black text-[#FFA028]">
                <CountUp end={8} />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/75 mt-1">Categories</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 text-center">
              <div className="text-3xl font-black text-[#FFA028]">10,000</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/75 mt-1">psi rated</div>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 text-center">
              <div className="text-3xl font-black text-[#FFA028]">3.1 / 3.2</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/75 mt-1">EN 10204</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. JUMP NAV */}
      <nav
        className="sticky top-[68px] z-30 bg-white border-b border-[#929DA7]/20 shadow-sm overflow-x-auto"
        aria-label="Instrumentation product categories"
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 py-2.5 flex items-center gap-2 whitespace-nowrap text-[12.5px] font-bold">
          {products.map((p, i) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="rounded-full px-3 py-1 bg-[#F5F6F7] hover:bg-[#FF4B32] hover:text-white text-[#17191C] border border-[#929DA7]/20 transition-colors"
            >
              <span className="text-[#FF4B32] group-hover:text-white font-extrabold mr-1">0{i + 1}</span>
              {p.title}
            </a>
          ))}
        </div>
      </nav>

      {/* 3. CATALOGUE SECTIONS */}
      <section id="catalogue" className="py-12 sm:py-16 bg-[#F5F6F7]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <Reveal className="text-center max-w-[680px] mx-auto mb-10">
            <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF4B32] mb-2">
              <span className="h-[3px] w-9 rounded bg-[#FF4B32]" />
              Group A
            </span>
            <h2 className="text-[1.5rem] sm:text-[2rem] font-black leading-[1.15] text-[#17191C] mb-2">
              Instrumentation fittings, valves &amp; tubing
            </h2>
            <p className="text-[14px] text-[#929DA7]">
              Eight core categories held against project specifications, with dimensional and pressure data confirmed at enquiry stage.
            </p>
          </Reveal>

          <div className="space-y-8">
            {products.map((p, k) => (
              <article
                key={p.id}
                id={p.id}
                className={`scroll-mt-28 grid ${
                  k % 2 ? "lg:grid-cols-[1.15fr_0.85fr]" : "lg:grid-cols-[0.85fr_1.15fr]"
                } gap-0 rounded-3xl overflow-hidden bg-white border border-[#929DA7]/20 shadow-xl`}
              >
                <Reveal
                  variant={k % 2 ? "right" : "left"}
                  className={`relative min-h-[240px] lg:min-h-[340px] overflow-hidden group ${
                    k % 2 ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    sizes="(min-width:1024px) 520px, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <span className="absolute left-4 bottom-3 font-black text-6xl sm:text-7xl leading-none text-transparent [-webkit-text-stroke:2px_#fff] drop-shadow-lg">
                    0{k + 1}
                  </span>
                  <span className="absolute left-4 top-4 rounded-full bg-[#FF4B32] text-white text-[11px] font-extrabold tracking-wider px-3 py-1 shadow-md">
                    {p.title.toUpperCase()}
                  </span>
                </Reveal>
                <Reveal variant={k % 2 ? "left" : "right"} className="p-5 sm:p-8 flex flex-col">
                  <h3 className="text-[1.4rem] sm:text-[1.7rem] font-black text-[#17191C] leading-tight mb-2">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-[#929DA7] mb-4">{p.desc}</p>
                  <div className="overflow-x-auto rounded-xl border border-[#929DA7]/20 mb-5">
                    <table className="w-full text-left text-[13px] min-w-[460px]">
                      <caption className="sr-only">Specification range</caption>
                      <thead>
                        <tr className="bg-gradient-to-r from-[#FF4B32] to-[#FFA028] text-white">
                          {p.headers.map((h) => (
                            <th
                              key={h}
                              scope="col"
                              className="px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {p.rows.map((row, r) => (
                          <tr
                            key={r}
                            className={`border-t border-[#929DA7]/20 hover:bg-[#F5F6F7] transition-colors ${
                              r % 2 ? "bg-[#F5F6F7]/50" : "bg-white"
                            }`}
                          >
                            <th scope="row" className="px-4 py-2.5 font-extrabold text-[#17191C]">
                              {row[0]}
                            </th>
                            {row.slice(1).map((c, ci) => (
                              <td key={ci} className="px-4 py-2.5 text-[#17191C]/80">
                                {c}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-auto">
                    <SolutionLink
                      title={p.title}
                      items={p.rows.map((r) => r[0])}
                      img={p.img}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#FF4B32] hover:bg-[#17191C] text-white text-[13px] font-bold px-5 py-2.5 transition-colors"
                    >
                      Enquire about {p.title.toLowerCase()} <ArrowRight className="w-4 h-4" />
                    </SolutionLink>
                  </div>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA STRIP */}
      <section className="py-9 bg-gradient-to-r from-[#17191C] via-[#23272B] to-[#17191C]">
        <Reveal className="max-w-[1240px] mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-[620px]">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028]">
              Technical RFQ
            </span>
            <h2 className="text-white text-[1.4rem] sm:text-3xl font-black leading-[1.15] mt-1 mb-1">
              Send us your line list or RFQ
            </h2>
            <p className="text-white/70 text-[13.5px]">
              We confirm sizes, pressure classes, connection types and delivery timelines within 24–48 hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF4B32] text-white font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <FileCheck className="w-5 h-5" />
              Submit Datasheet or RFQ
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 border border-white/30 text-white font-extrabold text-[13px] px-5 py-3 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <Phone className="w-5 h-5 text-[#FFA028]" />
              Contact Sales Desk
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
