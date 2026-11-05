export type ResourceType = "Brochure" | "Catalogue" | "Datasheet" | "Whitepaper" | "Technical Guide";

export interface ResourceItem {
  id: string;
  title: string;
  category: "Chemicals" | "Instrumentation" | "Engineering Services";
  type: ResourceType;
  description: string;
  fileSize?: string;
  fileFormat?: string;
  version?: string;
  isAvailableForDownload: boolean; // false for pending files
  downloadUrl?: string; // only if real file
  isSampleContent: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Sourcing & Quality" | "Chemicals" | "Instrumentation" | "Commercial & Logistics";
}

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  publishDate: string;
  readTime: string;
  author: string;
  summary: string;
  content: string[];
  tags: string[];
  isSampleContent: boolean;
}

export const RESOURCES: ResourceItem[] = [
  {
    id: "res-inst-cat",
    title: "Double Ferrule Fittings & Valves Master Engineering Catalogue",
    category: "Instrumentation",
    type: "Catalogue",
    description:
      "Comprehensive dimensional drawings, torque values, pressure-temperature derating curves, and assembly procedures for SS316 instrumentation hardware.",
    fileSize: "14.2 MB",
    fileFormat: "PDF",
    version: "Rev 2026.1",
    isAvailableForDownload: false,
    isSampleContent: true,
  },
  {
    id: "res-ro-brochure",
    title: "Specialty Membrane Chemistry & Reverse Osmosis Antiscalant Guide",
    category: "Chemicals",
    type: "Brochure",
    description:
      "Technical dosage projection criteria, silica fouling thresholds, cleaning procedures, and NSF/ANSI Standard 60 compliance details.",
    fileSize: "4.8 MB",
    fileFormat: "PDF",
    version: "v4.2",
    isAvailableForDownload: false,
    isSampleContent: true,
  },
  {
    id: "res-manifold-datasheet",
    title: "5-Way Manifold Valve Engineering Datasheet & Flow Characteristic",
    category: "Instrumentation",
    type: "Datasheet",
    description:
      "Full dimensional layout, DIN 19213 transmitter coplanar mounting geometry, pressure boundary limits, and helium test protocol.",
    fileSize: "1.9 MB",
    fileFormat: "PDF",
    version: "Rev C",
    isAvailableForDownload: false,
    isSampleContent: true,
  },
  {
    id: "res-boiler-whitepaper",
    title: "Volatile Oxygen Scavengers (DEHA) vs Hydrazine in Supercritical Boilers",
    category: "Chemicals",
    type: "Whitepaper",
    description:
      "Comparative chemical analysis of magnetite layer growth, distribution ratios across high-pressure steam, and occupational health considerations.",
    fileSize: "2.4 MB",
    fileFormat: "PDF",
    version: "Edition 2",
    isAvailableForDownload: false,
    isSampleContent: true,
  },
  {
    id: "res-procurement-guide",
    title: "EPC Technical Procurement & MTC Verification Standard Handbook",
    category: "Engineering Services",
    type: "Technical Guide",
    description:
      "Field guide for quality managers: interpreting EN 10204 Type 3.1 vs 3.2 mill certificates, positive material identification (PMI), and API 598 testing.",
    fileSize: "3.7 MB",
    fileFormat: "PDF",
    version: "2026 Edition",
    isAvailableForDownload: false,
    isSampleContent: true,
  },
  {
    id: "res-cems-brochure",
    title: "Continuous Emission Monitoring & Sample Conditioning Shelter Overview",
    category: "Instrumentation",
    type: "Brochure",
    description:
      "Architectural drawings, hazardous area ATEX classifications, sample chiller sizing, and heated line trace configurations.",
    fileSize: "6.1 MB",
    fileFormat: "PDF",
    version: "Rev 1.0",
    isAvailableForDownload: false,
    isSampleContent: true,
  },
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "Sourcing & Quality",
    question: "What material certifications and test reports are provided with instrumentation orders?",
    answer:
      "All instrumentation tube fittings, needle valves, ball valves, and manifolds are delivered with standard EN 10204 Type 3.1 Material Test Reports (MTR) verifying chemical composition and mechanical properties from the original melt. Third-party inspection (EN 10204 Type 3.2) witnessed by agencies such as TUV, DNV, Bureau Veritas, or Lloyd's can be coordinated on request.",
  },
  {
    id: "faq-2",
    category: "Chemicals",
    question: "How do you determine the correct dosage for RO antiscalant chemicals?",
    answer:
      "Our application engineers run computerized membrane projection modeling based on your comprehensive water analysis (including calcium, silica, sulfate, barium, alkalinity, temperature, and target recovery rate). This determines the exact optimum dosage (typically 2 to 5 ppm) to prevent supersaturation and mineral scaling without over-treating.",
  },
  {
    id: "faq-3",
    category: "Instrumentation",
    question: "Are your tube fittings interchangeable with Swagelok, Parker A-LOK, or Hy-Lok?",
    answer:
      "Our double ferrule fittings are manufactured to standard international twin-ferrule dimensional tolerances. When intermixed under identical torque guidelines, they provide reliable leak-free performance. However, for critical offshore or high-pressure gas installations, engineering best practices recommend utilizing consistent bodies, ferrules, and nuts from the same verified manufacturer.",
  },
  {
    id: "faq-4",
    category: "Commercial & Logistics",
    question: "What is your typical lead time for urgent shutdown or project orders?",
    answer:
      "For standard SS316 double ferrule fittings, standard needle valves, and common water treatment formulations (PAC, scale inhibitors), we maintain substantial regional buffer stock for rapid dispatch within 24 to 72 hours. Engineered items such as custom multi-valve manifolds, high-alloy materials (Hastelloy, Monel), or containerized RO skids are manufactured to order with dedicated milestone expediting.",
  },
  {
    id: "faq-5",
    category: "General",
    question: "Can you supply products complying with NACE MR0175 / ISO 15156 sour service?",
    answer:
      "Yes. For upstream oil, gas, and refinery applications handling hydrogen sulfide (H2S), we supply valves, tube fittings, and seamless tubing manufactured from controlled-hardness stainless steel, Monel, Inconel 625, and Hastelloy C-276 fully compliant with NACE MR0175 hardness limits (< 22 HRC) and sulfide stress cracking tests.",
  },
  {
    id: "faq-6",
    category: "Commercial & Logistics",
    question: "Do you handle export packing, dangerous goods shipping, and customs formalities?",
    answer:
      "Yes. Our logistics team handles sea-worthy timber crating treated to ISPM-15, certified UN-approved packaging for hazardous chemicals (IMDG/IATA), consular legalization, Certificates of Origin, and export documentation under all major Incoterms (Ex-Works, FOB, CIF, DDP).",
  },
];

export const TECHNICAL_ARTICLES: ArticleItem[] = [
  {
    id: "art-1",
    slug: "double-ferrule-fittings-installation-best-practices",
    title: "Double Ferrule Fitting Installation Best Practices: Preventing High Pressure Leaks",
    publishDate: "October 14, 2026",
    readTime: "6 min read",
    author: "Petro Engineering Engineering Technical Desk",
    summary:
      "A technical walkthrough of tube preparation, deburring, bottoming, finger-tightening, and the correct 1-1/4 turn nut rotation to ensure leak-tight joints up to 6,000 PSI.",
    content: [
      "In critical instrumentation impulse lines, more than 80% of reported leaks trace back to incorrect tube preparation or improper initial tightening rather than fitting material defects.",
      "Always cut tubing with a sharp tube cutter, avoiding hacksaws that introduce irregular burrs. Deburr both the internal bore and outer edge thoroughly to ensure square seating against the fitting body shoulder.",
      "Insert the tube completely until it bottoms firmly against the shoulder inside the fitting body. Tighten the nut finger-tight, then scribe a reference mark at the 6 o'clock position.",
      "Holding the fitting body steady with a backup wrench, rotate the nut exactly 1-1/4 turns to the 9 o'clock position (for sizes above 3/16 inch). Use an inspection gap gauge to confirm proper swaging before pressurizing.",
    ],
    tags: ["Instrumentation", "Fittings", "Installation", "Safety"],
    isSampleContent: true,
  },
  {
    id: "art-2",
    slug: "mitigating-silica-fouling-in-high-recovery-ro",
    title: "Mitigating Reactive & Colloidal Silica Scaling in High-Recovery Reverse Osmosis",
    publishDate: "September 28, 2026",
    readTime: "8 min read",
    author: "Petro Engineering Water Chemistry Division",
    summary:
      "How specialized polymeric dispersants and temperature-adjusted solubility models allow industrial RO plants to operate above standard 120 ppm silica saturation limits.",
    content: [
      "Dissolved silica is one of the most stubborn foulants in reverse osmosis systems because silica polymers form an amorphous glass-like coating over polyamide membranes that is virtually impossible to dissolve with standard acid or alkali cleaning.",
      "Standard solubility equilibrium limits reactive silica to approximately 120 mg/L at 25°C at neutral pH. Operating beyond this threshold in high-recovery groundwater recovery systems traditionally caused catastrophic membrane fouling.",
      "By applying specialized organo-phosphonate and carboxylate copolymer antiscalants, the induction time for silica polymerization is dramatically extended, allowing concentrate silica levels of up to 250-300 mg/L without active precipitation.",
      "Maintaining feedwater temperature stability and monitoring differential pressure (delta-P) across the lead and tail elements are critical operating indicators for timely preventive Clean-In-Place cycles.",
    ],
    tags: ["Water Treatment", "Reverse Osmosis", "Antiscalants", "Desalination"],
    isSampleContent: true,
  },
  {
    id: "art-3",
    slug: "understanding-en-10204-type-3-1-vs-3-2",
    title: "Understanding EN 10204 Type 3.1 vs Type 3.2 Material Test Certificates in EPC Procurement",
    publishDate: "August 19, 2026",
    readTime: "5 min read",
    author: "Quality & Compliance Assurance Team",
    summary:
      "A clear guide for project procurement managers on when Type 3.1 is sufficient and when stringent Type 3.2 independent third-party witness certification is mandatory.",
    content: [
      "Standard EN 10204 specifies four types of inspection documents: Type 2.1 (Declaration of Compliance), Type 2.2 (Test Report), Type 3.1 (Inspection Certificate), and Type 3.2 (Inspection Certificate with Independent Third-Party Witness).",
      "Type 3.1 certificates are validated by the manufacturer's own authorized inspection representative who is strictly independent of the production manufacturing department. The certificate includes actual heat melt chemical analysis, tensile testing, and impact results.",
      "Type 3.2 certificates require the test results to be validated simultaneously by both the manufacturer's authorized representative and an independent third-party inspection agency (e.g., TUV, DNV, Lloyd's) or the client's appointed inspector who witnessed the physical tests.",
      "For standard utility piping and non-sour instrumentation lines, Type 3.1 is standard industry practice. For high-pressure offshore subsea lines, lethal service sour gas, or nuclear safety barriers, Type 3.2 is typically mandatory.",
    ],
    tags: ["Quality Assurance", "EPC", "Standards", "Documentation"],
    isSampleContent: true,
  },
];
