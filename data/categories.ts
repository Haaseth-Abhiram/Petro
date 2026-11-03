export interface CategoryItem {
  id: string;
  slug: string;
  division: "chemicals" | "instrumentation";
  name: string;
  shortDescription: string;
  detailedDescription: string;
  image: string;
  keyProducts: string[];
  applications: string[];
  standards?: string[];
}

export const CHEMICAL_CATEGORIES: CategoryItem[] = [
  {
    id: "ro-chemicals",
    slug: "ro-chemicals-and-components",
    division: "chemicals",
    name: "RO Chemicals & Components",
    shortDescription: "Antiscalants, membrane biocides, acid/alkali cleaners, and pressure vessels for RO desalination.",
    detailedDescription:
      "Engineered chemical formulations specifically designed to prevent scale formation, eliminate biofouling, and restore reverse osmosis membrane flux across brackish and sea water desalination plants.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Broad-Spectrum RO Antiscalants",
      "Non-Oxidizing Membrane Biocides",
      "High/Low pH Membrane Cleaners (CIP)",
      "RO Membrane Preservatives",
      "FRP Pressure Vessels & Cartridge Housings",
    ],
    applications: [
      "Seawater Desalination Plants",
      "Thermal Power Station Water Treatment",
      "Refinery Demineralization Units",
      "Pharma High Purity Water Loops",
    ],
    standards: ["NSF/ANSI Standard 60", "ISO 9001:2015 Compliant Formulation"],
  },
  {
    id: "cooling-water",
    slug: "cooling-water-chemicals",
    division: "chemicals",
    name: "Cooling Water Chemicals",
    shortDescription: "Corrosion inhibitors, scale inhibitors, dispersants, and algaecides for open/closed cooling towers.",
    detailedDescription:
      "Advanced treatment programs for open recirculating, closed-loop, and once-through cooling systems to protect metallurgy against galvanic and pitting corrosion, bio-slimes, and mineral precipitation.",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Anodic & Cathodic Corrosion Inhibitors",
      "Polymeric Sludge Dispersants",
      "Oxidizing & Non-Oxidizing Microbiocides",
      "Biodispersants & Surfactants",
      "Closed Circuit Nitrite/Molybdate Inhibitors",
    ],
    applications: [
      "Petrochemical Induced Draft Towers",
      "Steel Mill Blast Furnace Cooling",
      "Fertilizer Plant Condenser Circuits",
      "District Cooling Plants",
    ],
    standards: ["CTI Guidelines Compliant", "ASTM D4778 Standard Test Methods"],
  },
  {
    id: "boiler-water",
    slug: "boiler-water-chemicals",
    division: "chemicals",
    name: "Boiler Water Chemicals",
    shortDescription: "Oxygen scavengers, sludge conditioners, alkalinity builders, and neutralizing amine steam-line protectors.",
    detailedDescription:
      "High-pressure and low-pressure boiler chemistry solutions preventing caustic gouging, iron oxide deposits, and oxygen pitting in steam drums, economizers, and condensate return systems.",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "DEHA & Carbohydrazide Oxygen Scavengers",
      "Sodium Sulfite & Bisulfite Formulations",
      "Phosphate & Polymer Sludge Conditioners",
      "Filming & Neutralizing Amines",
      "Polymeric Antifoams for Priming Prevention",
    ],
    applications: [
      "Supercritical Utility Steam Boilers",
      "Industrial Waste Heat Recovery Boilers (WHRB)",
      "Co-generation Plants",
      "Sugar & Paper Pulp Mill Boilers",
    ],
    standards: ["ASME Boiler Water Quality Guidelines", "BS 2486 Standards"],
  },
  {
    id: "wastewater-etp",
    slug: "wastewater-etp-chemicals",
    division: "chemicals",
    name: "Wastewater / ETP Chemicals",
    shortDescription: "Inorganic coagulants, high molecular weight flocculants, de-emulsifiers, and odor control agents.",
    detailedDescription:
      "Specialty clarification, heavy metal precipitation, and dewatering chemicals tailored for Effluent Treatment Plants (ETP) and Common Effluent Treatment Plants (CETP) in heavy process industries.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Poly Aluminium Chloride (PAC 30%)",
      "Cationic & Anionic Polyacrylamides (PAM)",
      "Ferric Chloride & Polyferric Sulphate",
      "Heavy Metal Precipitants",
      "Biological Bio-Nutrient Supplements",
    ],
    applications: [
      "Chemical Processing Effluents",
      "Textile Dyeing ETPs",
      "Electroplating & Surface Treatment",
      "Food & Dairy Processing Wastewater",
    ],
    standards: ["CPCB Effluent Discharge Compliance", "ISO 14001 Compliant Products"],
  },
  {
    id: "water-treatment-plants",
    slug: "water-treatment-plants",
    division: "chemicals",
    name: "Water Treatment Plants",
    shortDescription: "Skid-mounted RO plants, DM plants, softening packages, and electro-deionization (EDI) modules.",
    detailedDescription:
      "Pre-engineered, containerized, and turn-key process water purification systems fabricated with stainless steel 316L skids, automated PLC panels, and precision monitoring instrumentation.",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Containerized Sea Water RO Systems",
      "Two-Bed & Mixed-Bed Demineralizers (DM)",
      "Electro-Deionization (EDI) Units",
      "Automatic Multi-Port Water Softeners",
      "Ultrafiltration (UF) Skid Packages",
    ],
    applications: [
      "Refinery Boiler Feedwater Prep",
      "Offshore Platform Portable Water",
      "Automobile Rinse Line High Purity Water",
      "Semiconductor Ultra-Pure Water",
    ],
    standards: ["ASME Sec VIII Div 1 Skids", "CE / UL Certified Control Panels"],
  },
  {
    id: "wastewater-treatment",
    slug: "wastewater-treatment",
    division: "chemicals",
    name: "Wastewater Treatment Systems",
    shortDescription: "Membrane bioreactors (MBR), moving bed biofilm reactors (MBBR), and dissolved air flotation (DAF).",
    detailedDescription:
      "Complete biological and mechanical effluent treatment technologies designed for zero liquid discharge (ZLD) architectures and water recovery systems.",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Dissolved Air Flotation (DAF) Clarifiers",
      "Submerged MBR Membrane Modules",
      "MBBR Virgin Media Bio-Carriers",
      "Sludge Filter Press & Decanter Centrifuges",
      "Ultraviolet & Ozone Disinfection Skids",
    ],
    applications: [
      "Zero Liquid Discharge (ZLD) Schemes",
      "Refinery Oily Water Separators",
      "Municipal & Industrial Sewage Plants",
      "Chemical Zone CETPs",
    ],
    standards: ["Pollution Control Board Standards", "OSHA Safety Guidelines"],
  },
  {
    id: "commercial-chemicals",
    slug: "commercial-chemicals",
    division: "chemicals",
    name: "Commercial Chemicals",
    shortDescription: "Bulk commodity acids, alkalis, biocides, oxidizers, and neutralizing agents for general manufacturing.",
    detailedDescription:
      "Bulk supply chains and packaged distribution of industrial-grade raw chemicals with strict certificate of analysis (COA) verification and batch traceability.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Hydrochloric Acid (33% Industrial Grade)",
      "Caustic Soda Lye & Flakes (48% - 99%)",
      "Sulfuric Acid (98% Technical Grade)",
      "Sodium Hypochlorite (10-12% Available Cl)",
      "Citric Acid & Hydrogen Peroxide (50%)",
    ],
    applications: [
      "Chemical Intermediates Synthesis",
      "Metal Pickling & Passivation",
      "Paper & Pulp Bleaching",
      "Cooling & Neutralization Basins",
    ],
    standards: ["IS / ASTM Chemical Purity Standards", "Full Traceability COA"],
  },
  {
    id: "lab-equipment",
    slug: "laboratory-equipment",
    division: "chemicals",
    name: "Laboratory Equipment",
    shortDescription: "Spectrophotometers, portable water testing kits, pH/conductivity meters, and chemical reagents.",
    detailedDescription:
      "High-precision analytical laboratory instrumentation, process testing field kits, and calibration standards for testing water quality, corrosion rates, and chemical residual concentrations.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "UV-VIS Double Beam Spectrophotometers",
      "Benchtop & Portable pH/ORP/Conductivity Meters",
      "Turbidimeters & Jar Test Apparatus",
      "Multi-Parameter Water Test Drop Kits",
      "Certified Calibration Standards & Buffers",
    ],
    applications: [
      "Plant QA/QC Laboratories",
      "Water Treatment Field Testing",
      "Environmental Compliance Monitoring",
      "Third Party Testing Institutes",
    ],
    standards: ["NIST Traceable Standards", "GLP / ISO 17025 Compliant"],
  },
];

export const INSTRUMENTATION_CATEGORIES: CategoryItem[] = [
  {
    id: "tube-fittings",
    slug: "tube-fittings",
    division: "instrumentation",
    name: "Tube Fittings",
    shortDescription: "Double ferrule tube fittings, male/female connectors, unions, tees, and bulkhead adapters in SS316.",
    detailedDescription:
      "Precision twin-ferrule mechanical grip instrumentation tube fittings engineered for leak-tight gas and liquid connections under high vibrations, thermal cycles, and severe process pressures up to 15,000 PSI.",
    image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Male & Female Connectors",
      "Equal & Reducing Union Fittings",
      "Union Elbows & Tees (90° / 45°)",
      "Bulkhead Connectors & Reducers",
      "Front & Back Replacement Ferrules",
    ],
    applications: [
      "Instrument Air & Impulse Lines",
      "Gas Chromatography Sampling",
      "Hydraulic Control Panels",
      "Offshore Wellhead Control Skids",
    ],
    standards: ["ASTM A276 / A479 SS316", "NACE MR0175 / ISO 15156", "MSS-SP-99"],
  },
  {
    id: "pipe-fittings",
    slug: "pipe-fittings",
    division: "instrumentation",
    name: "Pipe Fittings",
    shortDescription: "High pressure forged NPT, BSPT, BSPP hex nipples, couplings, bushings, and street elbows.",
    detailedDescription:
      "Heavy-duty forged stainless steel, carbon steel, and alloy instrumentation pipe fittings with clean, rolled NPT/BSPT threads for process control piping, bypass manifolds, and gauge installations.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Hexagon Nipples & Long Nipples",
      "Hex Reducing Bushings & Couplings",
      "Female & Street 90° Elbows",
      "Threaded Crosses & Equal Tees",
      "Hex Plugs & Threaded End Caps",
    ],
    applications: [
      "High Pressure Transmitter Pigtails",
      "Process Sampling Loops",
      "Pressure Gauge Snubbers & Siphons",
      "Hydraulic Power Units",
    ],
    standards: ["ASME B16.11 Forged Fittings", "ASME B1.20.1 NPT Threads"],
  },
  {
    id: "needle-valves",
    slug: "needle-valves",
    division: "instrumentation",
    name: "Needle Valves",
    shortDescription: "Integral bonnet and screwed bonnet needle valves for precise throttling and shut-off up to 10,000 PSI.",
    detailedDescription:
      "Precision flow regulating needle valves manufactured from bar-stock SS316, Hastelloy, and Monel with non-rotating stem tips for positive bubble-tight shut-off in critical process instrumentation.",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Integral Bonnet Needle Valves (6000 PSI)",
      "Screwed Bonnet Heavy Duty Valves (10000 PSI)",
      "Panel Mount Instrumentation Valves",
      "Angle Pattern Needle Valves",
      "Multi-Port Gauge Valves with Vent Plugs",
    ],
    applications: [
      "Pressure Gauge Isolation",
      "Gas Cylinder Header Regulation",
      "Chemical Dosing Rate Metering",
      "Analyzer Shelter Fast-Loop Lines",
    ],
    standards: ["API 598 Pressure Testing", "MSS SP-99 / SP-105", "NACE MR0175"],
  },
  {
    id: "ball-valves",
    slug: "ball-valves",
    division: "instrumentation",
    name: "Ball Valves",
    shortDescription: "2-way and 3-way high pressure trunnion and floating ball valves with PTFE/PEEK seats.",
    detailedDescription:
      "Compact instrumentation ball valves delivering quick quarter-turn operation, bi-directional shut-off, and minimum pressure drop across gas lines, sample handling, and high-pressure test rigs.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "1-Piece Integral Compact Ball Valves",
      "3-Piece High Pressure Ball Valves (6000 PSI)",
      "3-Way Switching & Diverter Ball Valves",
      "Panel Mount Stainless Steel Valves",
      "Pneumatic Actuated Ball Valves",
    ],
    applications: [
      "Emergency Shut-Down Loops",
      "Natural Gas Sampling Lines",
      "Steam Tracing Isolation",
      "High Pressure Hydraulic Manifolds",
    ],
    standards: ["API 607 Fire Safe Design", "ISO 10497", "NACE MR0175"],
  },
  {
    id: "manifold-valves",
    slug: "manifold-valves",
    division: "instrumentation",
    name: "Manifold Valves",
    shortDescription: "2-way, 3-way, and 5-way direct mount and remote mount instrumentation valve manifolds.",
    detailedDescription:
      "Precision-machined barstock differential pressure manifolds that integrate block, equalize, and bleed functions into a single monolithic block, eliminating multiple leak points for differential pressure transmitters.",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "2-Way Pressure Calibration Manifolds",
      "3-Way Differential Pressure Manifolds",
      "5-Way Natural Gas Fiscal Metering Manifolds",
      "Direct-Mount (Coplanar) Manifold Blocks",
      "Base Mount & DIN 19213 Interface Manifolds",
    ],
    applications: [
      "DP Transmitter Zero Calibration",
      "Orifice Plate Flow Measurement",
      "Hydrostatic Level Transmitters",
      "Refinery Process Monitoring",
    ],
    standards: ["DIN 19213 Transmitter Interface", "MSS SP-105", "BS 6755"],
  },
  {
    id: "check-valves",
    slug: "check-valves",
    division: "instrumentation",
    name: "Check Valves",
    shortDescription: "Poppet type and ball type spring-loaded non-return valves with fixed cracking pressures.",
    detailedDescription:
      "Spring-loaded unidirectional check valves designed to prevent backflow and cross-contamination in process piping, dosing lines, and gas analytical systems.",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "In-line Spring Loaded Check Valves",
      "Adjustable Cracking Pressure Non-Return Valves",
      "O-Ring Poppet Seated Check Valves",
      "All-Metal Ball Check Valves (High Temp)",
      "Union Ended Check Valves",
    ],
    applications: [
      "Chemical Metering Pump Discharge",
      "Compressor Gas Discharge",
      "Sampling Stream Protection",
      "Cooling Circuit Flow Prevention",
    ],
    standards: ["API 598", "ASME B16.34", "MSS SP-80"],
  },
  {
    id: "tubing-coils",
    slug: "tubing-coils",
    division: "instrumentation",
    name: "Tubing Coils",
    shortDescription: "Seamless stainless steel 316/316L, Copper, and Inconel instrumentation tubing coils and straight lengths.",
    detailedDescription:
      "Bright annealed seamless stainless steel tubing offering superior bore smoothness, tight dimensional tolerances, and high ductility for uniform bending in field installation of impulse lines.",
    image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Seamless SS316 / SS316L Imperial Tubing (1/8\" to 1\")",
      "Metric Stainless Steel Tubing (6mm to 25mm)",
      "Continuous Tubing Coils (Up to 1000m lengths)",
      "Pre-Insulated & Steam-Traced Tube Bundles",
      "Inconel 625 & Hastelloy C276 Alloy Tubing",
    ],
    applications: [
      "Offshore Topside Hydraulic Lines",
      "Control Valve Air Supply Headers",
      "Chromatograph Carrier Gas Lines",
      "High Pressure Steam Trace Lines",
    ],
    standards: ["ASTM A269 / ASTM A213", "NACE MR0175", "EN 10216-5"],
  },
  {
    id: "pressure-instruments",
    slug: "pressure-instruments",
    division: "instrumentation",
    name: "Pressure Instruments",
    shortDescription: "Bourdon tube pressure gauges, differential pressure gauges, and smart pressure transmitters.",
    detailedDescription:
      "Industrial solid-front safety pattern pressure gauges, digital manometers, and 4-20mA HART pressure transmitters certified for explosive gas atmospheres and corrosive media.",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Solid Front Safety Pattern Pressure Gauges",
      "Diaphragm Seal Gauges for Viscous/Corrosive Media",
      "Differential Pressure (DP) Dial Gauges",
      "Smart 4-20mA / HART Pressure Transmitters",
      "Gauge Overpressure Protectors & Dampeners",
    ],
    applications: [
      "Wellhead Choke Pressure Monitoring",
      "Filter Delta-P Clogging Indication",
      "Boiler Steam Header Gauging",
      "Pipeline Compression Stations",
    ],
    standards: ["EN 837-1 / ASME B40.100", "ATEX / IECEx Certified", "IP66 / IP67"],
  },
  {
    id: "flow-instruments",
    slug: "flow-instruments",
    division: "instrumentation",
    name: "Flow Instruments",
    shortDescription: "Electromagnetic flow meters, variable area rotameters, vortex shedding meters, and turbine meters.",
    detailedDescription:
      "Rugged in-line flow measuring solutions for conductive fluids, hydrocarbons, steam, and industrial gases with high accuracy, digital totalization, and fieldbus communication options.",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Electromagnetic Flowmeters (Lined for Acids & Slurries)",
      "Metal Tube Variable Area Rotameters",
      "Vortex Shedding Steam Flow Meters",
      "Thermal Mass Flow Meters for Flare Gas",
      "Positive Displacement Flow Meters",
    ],
    applications: [
      "Raw Water & Cooling Tower Feed Monitoring",
      "Acid/Alkali Dosing Flow Measurement",
      "Saturated & Superheated Steam Accounting",
      "Gas Consumption Metering",
    ],
    standards: ["ISO 9104", "OIML R49", "CE Pressure Equipment Directive (PED)"],
  },
  {
    id: "analyser-systems",
    slug: "analyser-systems",
    division: "instrumentation",
    name: "Analyser Systems",
    shortDescription: "Continuous emission monitoring (CEMS), gas chromatographs, and sample conditioning packages.",
    detailedDescription:
      "Turnkey process analytical systems including heated sample extraction probes, sample coolers, coalescing filtration, calibration manifolds, and analyzer shelter integration.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    keyProducts: [
      "Continuous Emission Monitoring Systems (CEMS)",
      "Process Gas Chromatographs (GC)",
      "Heated Sample Conditioning Units (SCU)",
      "Combustion Efficiency O2 / COe Analyzers",
      "Explosion-Proof Analyzer Shelter Enclosures",
    ],
    applications: [
      "Stack Gas Environmental Compliance",
      "Flare Gas Compositional Analysis",
      "Natural Gas Custody Transfer (BTU)",
      "Furnace Combustion Optimization",
    ],
    standards: ["EPA 40 CFR Part 60/75", "IEC 61285", "ATEX Zone 1/2 Shelters"],
  },
];
