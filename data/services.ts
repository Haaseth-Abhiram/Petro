export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  iconName: string;
  image: string;
  keyActivities: string[];
  benefits: string[];
  relatedProducts: string[];
  relatedIndustries: string[];
}

export const SERVICES: ServiceItem[] = [
  {
    id: "oil-gas-sourcing",
    slug: "oil-and-gas-equipment-sourcing",
    title: "Oil & Gas Equipment Sourcing",
    shortDescription: "Specialized procurement of severe service valves, high-pressure fittings, and process instrumentation.",
    overview:
      "We act as an integrated sourcing bridge connecting global engineering EPCs and plant operators with pre-qualified manufacturers of critical pressure-containing equipment, valves, and analytical instrumentation conforming to API, NACE, and ASME specifications.",
    iconName: "Flame",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    keyActivities: [
      "Identification and vetting of API/ASME compliant global manufacturers",
      "Technical bid tabulations (TBE) matching tender datasheets",
      "Expediting fabrication milestones and factory hold points",
      "Consolidated material package deliveries for offshore/onshore projects",
    ],
    benefits: [
      "Mitigates single-source vulnerability through redundant OEM relationships",
      "Guarantees compliance with sour service NACE MR0175 / ISO 15156 metallurgy",
      "Reduces lead times through strategic regional stocking hubs",
    ],
    relatedProducts: ["Double Ferrule Tube Fittings", "5-Way Manifold Valves", "Seamless SS316L Coils"],
    relatedIndustries: ["Oil & Gas Upstream", "Refineries & Petrochemicals", "LNG Terminals"],
  },
  {
    id: "project-procurement",
    slug: "project-procurement-support",
    title: "Project Procurement Support",
    shortDescription: "End-to-end procurement management, vendor alignment, and MTO optimization for EPC contractors.",
    overview:
      "Supporting EPC project teams from the front-end engineering design (FEED) phase through commissioning. We streamline material take-offs (MTO), assist with bulk order consolidation, and resolve technical queries (TQ) with manufacturing partners.",
    iconName: "Briefcase",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    keyActivities: [
      "MTO consolidation and spare parts optimization (SPIR)",
      "Technical compliance verification prior to PO issuance",
      "Master schedule expediting with regular milestone reports",
      "Handling warranty claims, surplus management, and preservation",
    ],
    benefits: [
      "Minimizes purchase order administrative overhead for EPC contractors",
      "Eliminates on-site mismatch delays through rigorous pre-shipment cross-checks",
      "Access to volume pricing across multiple project disciplines",
    ],
    relatedProducts: ["Industrial Ball Valves", "Boiler Treatment Chemicals", "Instrumentation Manifolds"],
    relatedIndustries: ["EPC & Turnkey Projects", "Power Generation", "Heavy Manufacturing"],
  },
  {
    id: "inspection-qa",
    slug: "inspection-and-quality-assurance",
    title: "Inspection & Quality Assurance",
    shortDescription: "Third-party inspection coordination, material test reports (EN 10204 3.1/3.2), and NDT witness.",
    overview:
      "Rigorous quality governance ensuring zero defects reach the installation field. We organize witness inspections, hydrostatic pressure tests, helium leak audits, and material chemistry validation in accordance with international inspection codes.",
    iconName: "ShieldCheck",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    keyActivities: [
      "Coordination of third-party agencies (TUV, DNV, Bureau Veritas, Lloyd's)",
      "EN 10204 Type 3.1 and 3.2 Material Test Certificate (MTC) verification",
      "Non-Destructive Testing (PMI, Ultrasonic, Radiography, Dye Penetrant) witness",
      "Hydrostatic and pneumatic pressure test surveillance per API 598",
    ],
    benefits: [
      "Full traceability back to master heat melts and chemical heats",
      "Complete documentation dossiers compiled ready for client handover",
      "Eliminates costly site rejections and warranty disputes",
    ],
    relatedProducts: ["Pressure Gauges", "Needle Valves", "Forged Pipe Fittings"],
    relatedIndustries: ["Petrochemicals", "Offshore Platforms", "Nuclear & Thermal Power"],
  },
  {
    id: "vendor-rep",
    slug: "vendor-and-manufacturer-representation",
    title: "Vendor & Manufacturer Representation",
    shortDescription: "Authorized technical sales and application engineering representation for global manufacturers.",
    overview:
      "Acting as the dedicated technical sales channel for world-class manufacturers of specialty water treatment chemicals, analyzer shelters, and precision instrumentation valves across regional industrial clusters.",
    iconName: "Users",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    keyActivities: [
      "Direct technical liaison between OEM engineering and end-user maintenance teams",
      "Product presentation, pilot trials, and proof-of-concept testing",
      "Registration and pre-qualification with state utilities and oil majors",
      "Warranty handling, spare parts warehousing, and local customer service",
    ],
    benefits: [
      "End-users receive authentic, warranted equipment with direct factory support",
      "Manufacturers gain immediate market penetration and qualified customer access",
      "Local application support and rapid on-site troubleshooting",
    ],
    relatedProducts: ["Continuous Emission Monitoring (CEMS)", "RO Antiscalants", "Flowmeters"],
    relatedIndustries: ["Water & Wastewater Treatment", "Chemical Processing", "Fertilizer Manufacturing"],
  },
  {
    id: "logistics-export",
    slug: "logistics-and-export-handling",
    title: "Logistics & Export Handling",
    shortDescription: "Heavy equipment freight forwarding, sea-worthy export packing, customs clearance, and DDP delivery.",
    overview:
      "Comprehensive supply chain execution managing ocean freight, air express, hazardous chemical transport (IMDG/IATA), export documentation, and duty compliance for worldwide destination sites.",
    iconName: "Ship",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    keyActivities: [
      "Sea-worthy timber crating treated to ISPM-15 standards",
      "Dangerous Goods (DG) packing and certification for chemical cargos",
      "Certificate of Origin, Legalization, and consular documentation processing",
      "Incoterms coordination: Ex-Works, FOB, CIF, CFR, and DDP consignments",
    ],
    benefits: [
      "Damage-free arrival assured through moisture-barrier barrier wrapping and desiccant packings",
      "Smooth customs clearance preventing demurrage and port holding penalties",
      "Real-time shipment milestone tracking from manufacturer bay to site gate",
    ],
    relatedProducts: ["Containerized RO Skids", "Bulk PAC Coagulants", "Tubing Reels"],
    relatedIndustries: ["EPC & Construction", "Cross-Border Projects", "Mining & Metals"],
  },
  {
    id: "technical-consulting",
    slug: "technical-consultation-and-engineering-support",
    title: "Technical Consultation & Engineering Support",
    shortDescription: "Water treatment mass balances, impulse piping sizing, analyzer system design, and metallurgy advisory.",
    overview:
      "Experienced engineering consultation to assist procurement and operations managers in selecting optimal alloy metallurgy, valve sizing (Cv calculations), water chemical dosage projections, and instrumentation architectures.",
    iconName: "Wrench",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
    keyActivities: [
      "Reverse Osmosis chemical dosage projections via computer simulations",
      "Valve sizing, cavitation analysis, and differential pressure drop modeling",
      "Metallurgical selection for corrosive media (Sour Gas, Sea Water, Sulfuric Acid)",
      "Sampling system lag-time and conditioning calculation audits",
    ],
    benefits: [
      "Prevents premature equipment failure caused by improper material selection",
      "Optimizes chemical consumption rates, reducing recurring operating expenditure",
      "Aligns process requirements with international industry standards",
    ],
    relatedProducts: ["RO Membranes & Chemicals", "Solid Front Gauges", "High Pressure Ball Valves"],
    relatedIndustries: ["Refinery & Petrochemical", "Water Desalination", "Pharmaceutical Processing"],
  },
];
