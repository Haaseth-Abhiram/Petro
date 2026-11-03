export interface IndustryItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortOverview: string;
  detailedOverview: string;
  image: string;
  commonRequirements: string[];
  relevantProducts: string[];
  relevantServices: string[];
}

export const INDUSTRIES: IndustryItem[] = [
  {
    id: "oil-gas",
    slug: "oil-and-gas",
    name: "Oil & Gas (Upstream & Midstream)",
    tagline: "High-pressure, sour service, and offshore qualified fluid control solutions.",
    shortOverview:
      "Critical pressure containment, double ferrule tube fittings, manifold valves, and chemical injection systems built to withstand extreme offshore marine and wellhead conditions.",
    detailedOverview:
      "Exploration and production environments subject process hardware to severe vibration, sour gas (H2S), high pressures exceeding 10,000 PSI, and corrosive salt mist. We source fully certified NACE MR0175 compliant valves, seamless 316L/Inconel tubing coils, and hazardous-area certified instrumentation designed for offshore platforms, wellheads, and pipeline booster stations.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    commonRequirements: [
      "NACE MR0175 / ISO 15156 sour service compliance",
      "API 607 / ISO 10497 fire safe certification",
      "EN 10204 Type 3.2 material traceability with third-party witness",
      "Super Duplex and Inconel 625 high alloy options for saline splash zones",
    ],
    relevantProducts: [
      "Double Ferrule Male Connectors (SS316)",
      "3-Piece High Pressure Ball Valves",
      "5-Way Differential Pressure Manifolds",
      "Continuous Tubing Coils",
    ],
    relevantServices: [
      "Oil & Gas Equipment Sourcing",
      "Inspection & Quality Assurance (Third Party Witness)",
      "Logistics & Export Handling",
    ],
  },
  {
    id: "petrochemical",
    slug: "petrochemical-and-refining",
    name: "Petrochemical & Refining",
    tagline: "Severe thermal cycles, volatile hydrocarbons, and corrosion control chemistry.",
    shortOverview:
      "High temperature process valves, continuous emission monitoring systems (CEMS), cooling water inhibitors, and boiler treatment chemistry for continuous refinery operations.",
    detailedOverview:
      "Refineries operate 24/7 continuous catalytic cracking, hydrotreating, and alkylation units where downtime costs are prohibitive. We provide reliable high-purity instrumentation, steam-line corrosion chemistry, and specialized sample conditioning panels for online process gas chromatographs.",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    commonRequirements: [
      "Fugitive emission compliant valve packings (ISO 15848-1)",
      "High temperature metallurgy (SS321, SS347, Monel 400)",
      "Continuous cooling tower scale & corrosion inhibition programs",
      "EPA-compliant stack gas emission monitoring integration",
    ],
    relevantProducts: [
      "Integral Bonnet Needle Valves 6000 PSI",
      "Cooling Tower Multifunctional Corrosion Inhibitor",
      "DEHA Non-Toxic Volatile Oxygen Scavenger",
      "Solid Front Safety Pattern Gauges",
    ],
    relevantServices: [
      "Technical Consultation & Engineering Support",
      "Vendor & Manufacturer Representation",
      "Project Procurement Support",
    ],
  },
  {
    id: "water-treatment",
    slug: "water-treatment-and-desalination",
    name: "Water Treatment & Desalination",
    tagline: "High-recovery membrane antiscalants, biocide programs, and skid packages.",
    shortOverview:
      "Complete chemical programs, filtration equipment, and instrumentation for industrial RO plants, sea water desalination, DM units, and wastewater ETP facilities.",
    detailedOverview:
      "Water scarcity and environmental regulations demand higher cycles of concentration and zero liquid discharge (ZLD). Our water treatment product range spans NSF-certified reverse osmosis antiscalants, cleaning formulations, coagulants, electromagnetic flowmeters, and skid-mounted filtration packages.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    commonRequirements: [
      "NSF / ANSI Standard 60 drinking water certification",
      "Silica and sulfate scale inhibition up to extreme saturation limits",
      "Corrosion-resistant plastic and Super Austenitic 254SMO wetted parts",
      "Automated chemical dosing skid monitoring integration",
    ],
    relevantProducts: [
      "Broad-Spectrum High-Recovery RO Antiscalant",
      "Poly Aluminium Chloride (PAC 30%) Coagulant",
      "Electromagnetic Flowmeters",
      "FRP Pressure Vessels & Skid Packages",
    ],
    relevantServices: [
      "Technical Consultation (Computerized RO Projections)",
      "Vendor & Manufacturer Representation",
      "Inspection & Quality Assurance",
    ],
  },
  {
    id: "manufacturing",
    slug: "manufacturing-and-industrial",
    name: "Heavy Manufacturing & Automotive",
    tagline: "Process utilities, compressed air lines, hydraulic systems, and metal treatment.",
    shortOverview:
      "Durable instrumentation, pneumatic tubing, chemical pickling agents, and closed-loop cooling tower chemistry for automotive and metal fabrication plants.",
    detailedOverview:
      "Discrete and batch manufacturing plants rely on continuous utility distribution (steam, compressed air, hydraulic fluid, and demineralized rinse water). We deliver reliable forged pipe fittings, needle valves, and water chemistry to maintain peak machine uptime and protect auxiliary plant assets.",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    commonRequirements: [
      "Standardized thread profiles (NPT, BSPT, BSPP)",
      "Rapid dispatch from regional inventory hubs",
      "Competitive lifecycle cost for high-volume maintenance consumption",
      "Closed loop corrosion inhibitors for machine tool cooling jackets",
    ],
    relevantProducts: [
      "Forged High Pressure Pipe Fittings",
      "In-Line Spring-Loaded Check Valves",
      "Commercial Acids & Caustic Soda Lye",
      "Dial Pressure Gauges",
    ],
    relevantServices: [
      "Project Procurement Support",
      "Logistics & Export Handling",
      "Vendor Representation",
    ],
  },
  {
    id: "epc-projects",
    slug: "epc-and-industrial-projects",
    name: "EPC & Industrial Projects",
    tagline: "Turnkey package consolidation, vendor list compliance, and milestone expediting.",
    shortOverview:
      "Strategic material take-off (MTO) consolidation, technical query (TQ) resolution, and on-time site deliveries for global engineering and construction contractors.",
    detailedOverview:
      "Large-scale capital expenditure (CAPEX) infrastructure projects demand seamless collaboration across hundreds of equipment suppliers. Petronex acts as a single-point procurement partner for EPC contractors, managing material approval requests (MAR), third-party witness testing, and phased job-site deliveries.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    commonRequirements: [
      "Approved Vendor List (AVL) compliance with major international EPCs",
      "Strict compliance with project specifications and ITP inspection plans",
      "Consolidated multi-discipline packing and barcoded palletization",
      "Comprehensive final documentation dossiers (MTR, NDT, Hydro, COA)",
    ],
    relevantProducts: [
      "Bulk Tube Fittings Packages (SS316)",
      "Turnkey Containerized Water Treatment Plants",
      "5-Way Manifold Blocks & Transmitter Accessories",
      "Tubing Coils & Tracing Bundles",
    ],
    relevantServices: [
      "Project Procurement Support",
      "Inspection & Quality Assurance",
      "Logistics & Export Handling",
      "Oil & Gas Equipment Sourcing",
    ],
  },
  {
    id: "process-industries",
    slug: "process-industries",
    name: "Process Industries (Pharma, Paper & Fertilizer)",
    tagline: "Hygienic finishes, specialty chemicals, and precise flow control.",
    shortOverview:
      "Sanitary and high-purity valves, high-pressure steam boiler chemicals, wastewater recovery, and analytical laboratory instrumentation.",
    detailedOverview:
      "Chemical synthesis, pharmaceutical formulations, fertilizer granulation, and paper pulp mills each impose unique process demands. We supply high-grade passivated instrumentation, effluent wastewater coagulants, and precision laboratory testing gear.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    commonRequirements: [
      "Electropolished internal surface finishes (Ra < 0.4 um)",
      "Clean-In-Place (CIP) and Steam-In-Place (SIP) compatibility",
      "Heavy metal coagulants for complex industrial wastewater",
      "High accuracy analytical laboratory testing standards",
    ],
    relevantProducts: [
      "DEHA Boiler Water Oxygen Scavengers",
      "High Purity Double Ferrule Fittings",
      "Laboratory UV-VIS Spectrophotometers",
      "Dissolved Air Flotation (DAF) Clarifiers",
    ],
    relevantServices: [
      "Technical Consultation & Engineering Support",
      "Vendor & Manufacturer Representation",
      "Inspection & Quality Assurance",
    ],
  },
];
