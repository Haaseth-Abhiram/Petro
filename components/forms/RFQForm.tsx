"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck2,
  Send,
  Info,
  RotateCcw,
} from "lucide-react";
import { rfqFormSchema, RFQFormData } from "@/lib/validations";

interface RFQFormProps {
  initialCategory?: string;
  initialProduct?: string;
  initialIndustry?: string;
}

export default function RFQForm({
  initialCategory = "",
  initialProduct = "",
  initialIndustry = "",
}: RFQFormProps) {
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [submittedData, setSubmittedData] = useState<RFQFormData | null>(null);
  const [submittedRfqId, setSubmittedRfqId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RFQFormData>({
    resolver: zodResolver(rfqFormSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      industry: initialIndustry || "Oil & Gas (Upstream & Midstream)",
      productCategory: initialCategory || "Tube Fittings",
      productName: initialProduct || "",
      quantity: "",
      unitOfMeasurement: "Pieces (Pcs)",
      technicalSpecifications: "",
      deliveryLocation: "",
      requiredDeliveryDate: "",
      additionalComments: "",
      attachmentName: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeInKB = file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      setSelectedFile({
        name: file.name,
        size: sizeInKB,
      });
      setAttachedFile(file);
      setValue("attachmentName", file.name);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setAttachedFile(null);
    setValue("attachmentName", "");
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: RFQFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          fd.append(key, String(val));
        }
      });
      if (attachedFile) {
        fd.append("attachment", attachedFile);
      }

      const res = await fetch("/api/rfq", {
        method: "POST",
        body: fd,
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to submit quote request");
      }
      setSubmittedRfqId(result.rfqId || null);
      setSubmittedData(data);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit RFQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setSubmittedRfqId(null);
    setSelectedFile(null);
    setAttachedFile(null);
    reset();
  };

  return (
    <div className="bg-white rounded-[8px] border border-[#D8DDE2] shadow-[0_1px_2px_rgba(16,24,38,0.06),0_4px_12px_rgba(16,24,38,0.04)] overflow-hidden">
      {/* Form Header */}
      <div className="bg-[#17191C]/90 px-8 py-6 text-white border-b border-[#2A2E34]">
        <span className="eyebrow eyebrow-gold">TECHNICAL SPECIFICATION SOURCING</span>
        <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-white mt-1">
          Request for Quotation (RFQ)
        </h3>
        <p className="text-xs sm:text-sm text-white/70 mt-1">
          Submit line items, MTO datasheets, pressure ratings or water analysis parameters.
        </p>
      </div>

      <div className="p-8 sm:p-10">
        {submittedData ? (
          <div className="space-y-6">
            <div className="p-4 rounded-[4px] bg-[#1f7a4d]/10 border-l-[3px] border-[#1f7a4d] text-[#1a5c3b]">
              <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-base">
                Quotation Request Logged in Database
              </h4>
              <p className="text-sm mt-1">
                Your technical specifications have been registered in our database and assigned to our procurement desk.
              </p>
            </div>

            <div className="bg-[#F5F6F7] rounded-[4px] p-6 border border-[#D8DDE2] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D8DDE2]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5F6871]">
                  RFQ Submission Summary
                </span>
                <span className="text-xs font-mono bg-[#C80808]/10 text-[#C80808] px-2 py-0.5 rounded font-bold">
                  {submittedRfqId ? `PETRO-RFQ-${submittedRfqId.slice(0, 8).toUpperCase()}` : "LOGGED"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#5F6871]">
                <div>
                  <strong className="block text-[#17191C]">Contact & Company:</strong>
                  <span>{submittedData.fullName} / {submittedData.companyName}</span>
                </div>
                <div>
                  <strong className="block text-[#17191C]">Email & Phone:</strong>
                  <span>{submittedData.email} | {submittedData.phone}</span>
                </div>
                <div>
                  <strong className="block text-[#17191C]">Product Line & Item:</strong>
                  <span>{submittedData.productCategory} — {submittedData.productName}</span>
                </div>
                <div>
                  <strong className="block text-[#17191C]">Quantity & Schedule:</strong>
                  <span>{submittedData.quantity} {submittedData.unitOfMeasurement} (Target: {submittedData.requiredDeliveryDate})</span>
                </div>
                <div>
                  <strong className="block text-[#17191C]">Delivery Destination:</strong>
                  <span>{submittedData.deliveryLocation}</span>
                </div>
                <div>
                  <strong className="block text-[#17191C]">Uploaded Attachment:</strong>
                  <span>{selectedFile ? `${selectedFile.name} (${selectedFile.size})` : "None attached"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#D8DDE2] text-xs">
                <strong className="block text-[#17191C] mb-1">Specifications:</strong>
                <p className="bg-white p-3 rounded border border-[#D8DDE2] font-mono text-[11px] whitespace-pre-line text-[#5F6871]">
                  {submittedData.technicalSpecifications}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F5F6F7] border border-[#D8DDE2] rounded-[4px] text-xs text-[#5F6871] flex items-start space-x-2">
              <Info className="w-4 h-4 text-[#C80808] shrink-0 mt-0.5" />
              <span>Your quotation request and technical specifications have been logged securely. Our engineering sales team will review and respond within 24 business hours.</span>
            </div>

            <button
              onClick={handleReset}
              className="btn btn-outline-dark w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>Submit Another Quotation Request</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            {/* Section 1 */}
            <div>
              <div className="flex items-center space-x-2 pb-2 mb-4 border-b border-[#D8DDE2]">
                <span className="w-6 h-6 rounded-full bg-[#C80808] text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold uppercase tracking-wider text-[#17191C]">
                  Contact &amp; Organization Details
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                    Full name <span className="text-[#C80808]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("fullName")}
                    placeholder="e.g. Ramesh Patel"
                    className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/10 transition-colors ${
                      errors.fullName ? "border-[#C80808]" : "border-[#D8DDE2]"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-[#C80808] mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                    Company Name <span className="text-[#C80808]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("companyName")}
                    placeholder="e.g. Reliance Projects Ltd"
                    className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/10 transition-colors ${
                      errors.companyName ? "border-[#C80808]" : "border-[#D8DDE2]"
                    }`}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-[#C80808] mt-1">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                    Corporate Email <span className="text-[#C80808]">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="procurement@company.com"
                    className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/10 transition-colors ${
                      errors.email ? "border-[#C80808]" : "border-[#D8DDE2]"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-[#C80808] mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                    Phone / WhatsApp <span className="text-[#C80808]">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/10 transition-colors ${
                      errors.phone ? "border-[#C80808]" : "border-[#D8DDE2]"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-[#C80808] mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="flex items-center space-x-2 pb-2 mb-4 border-b border-[#D8DDE2]">
                <span className="w-6 h-6 rounded-full bg-[#C80808] text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold uppercase tracking-wider text-[#17191C]">
                  Technical Scope &amp; Specifications
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                    Product Category <span className="text-[#C80808]">*</span>
                  </label>
                  <select
                    {...register("productCategory")}
                    className="w-full px-4 py-3 rounded-[4px] border border-[#D8DDE2] text-sm text-[#17191C] bg-white focus:outline-none focus:border-[#C80808]"
                  >
                    <optgroup label="Instrumentation & Valves">
                      <option value="Tube Fittings">Tube Fittings (Twin-Ferrule)</option>
                      <option value="Pipe Fittings">Pipe Fittings (NPT/BSP)</option>
                      <option value="Needle Valves">Needle Valves (Up to 10k PSI)</option>
                      <option value="Ball Valves">Ball Valves (2-way & 3-way)</option>
                      <option value="Manifold Valves">Manifold Valves (2, 3 & 5-way)</option>
                      <option value="Check Valves">Check Valves (Non-Return)</option>
                      <option value="Tubing Coils">Seamless Tubing Coils</option>
                      <option value="Analyser Systems">Analyser Systems & Shelters</option>
                    </optgroup>
                    <optgroup label="Chemical & Water Treatment">
                      <option value="RO Chemicals">RO Chemicals & Components</option>
                      <option value="Cooling Water Chemicals">Cooling Water Chemicals</option>
                      <option value="Boiler Water Chemicals">Boiler Water Chemicals</option>
                      <option value="Wastewater / ETP Chemicals">Wastewater / ETP Chemicals</option>
                      <option value="Water Treatment Plants">Water Treatment Plants</option>
                      <option value="Wastewater Treatment">Wastewater Treatment Systems</option>
                      <option value="Commercial Chemicals">Commercial Commodity Chemicals</option>
                      <option value="Laboratory Equipment">Laboratory Equipment & Meters</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                    Product or Equipment Name <span className="text-[#C80808]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("productName")}
                    placeholder="e.g. 1/2-inch SS316 5-Way Manifold or RO Antiscalant"
                    className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/10 transition-colors ${
                      errors.productName ? "border-[#C80808]" : "border-[#D8DDE2]"
                    }`}
                  />
                  {errors.productName && (
                    <p className="text-xs text-[#C80808] mt-1">{errors.productName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                      Quantity <span className="text-[#C80808]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("quantity")}
                      placeholder="e.g. 100"
                      className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/10 transition-colors ${
                        errors.quantity ? "border-[#C80808]" : "border-[#D8DDE2]"
                      }`}
                    />
                    {errors.quantity && (
                      <p className="text-xs text-[#C80808] mt-1">{errors.quantity.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                      Unit <span className="text-[#C80808]">*</span>
                    </label>
                    <select
                      {...register("unitOfMeasurement")}
                      className="w-full px-3 py-3 rounded-[4px] border border-[#D8DDE2] text-sm text-[#17191C] bg-white focus:outline-none focus:border-[#C80808]"
                    >
                      <option value="Pieces (Pcs)">Pieces (Pcs)</option>
                      <option value="Meters (Mtr)">Meters (Mtr)</option>
                      <option value="Kilograms (Kg)">Kilograms (Kg)</option>
                      <option value="Drums (200L)">Drums (200L)</option>
                      <option value="IBC Totes (1000L)">IBC Totes</option>
                      <option value="Complete Skids">Complete Skids</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                    Primary Sector / Industry <span className="text-[#C80808]">*</span>
                  </label>
                  <select
                    {...register("industry")}
                    className="w-full px-4 py-3 rounded-[4px] border border-[#D8DDE2] text-sm text-[#17191C] bg-white focus:outline-none focus:border-[#C80808]"
                  >
                    <option value="Oil & Gas (Upstream & Midstream)">Oil &amp; Gas (Upstream &amp; Midstream)</option>
                    <option value="Petrochemical & Refining">Petrochemical &amp; Refining</option>
                    <option value="Water Treatment & Desalination">Water Treatment &amp; Desalination</option>
                    <option value="Heavy Manufacturing">Heavy Manufacturing</option>
                    <option value="EPC & Industrial Projects">EPC &amp; Industrial Projects</option>
                    <option value="Process Utilities">Process Utilities</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                  Technical Specifications &amp; Parameters <span className="text-[#C80808]">*</span>
                </label>
                <textarea
                  rows={3}
                  {...register("technicalSpecifications")}
                  placeholder="Detail pressure rating (6000 PSI), body metallurgy (SS316, Inconel, Monel), end connections, NACE MR0175, or raw water analysis..."
                  className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/10 transition-colors ${
                    errors.technicalSpecifications ? "border-[#C80808]" : "border-[#D8DDE2]"
                  }`}
                />
                {errors.technicalSpecifications && (
                  <p className="text-xs text-[#C80808] mt-1">{errors.technicalSpecifications.message}</p>
                )}
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <div className="flex items-center space-x-2 pb-2 mb-4 border-b border-[#D8DDE2]">
                <span className="w-6 h-6 rounded-full bg-[#C80808] text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold uppercase tracking-wider text-[#17191C]">
                  Delivery Timelines &amp; Datasheet Attachment
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                    Delivery Destination / Port <span className="text-[#C80808]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("deliveryLocation")}
                    placeholder="e.g. Mumbai CIF / Hazira Site"
                    className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/10 transition-colors ${
                      errors.deliveryLocation ? "border-[#C80808]" : "border-[#D8DDE2]"
                    }`}
                  />
                  {errors.deliveryLocation && (
                    <p className="text-xs text-[#C80808] mt-1">{errors.deliveryLocation.message}</p>
                  )}
                </div>

                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                    Target Delivery Date / Timeline <span className="text-[#C80808]">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("requiredDeliveryDate")}
                    placeholder="e.g. 4 Weeks / Immediate Shutdown"
                    className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#C80808] focus:ring-2 focus:ring-[#C80808]/10 transition-colors ${
                      errors.requiredDeliveryDate ? "border-[#C80808]" : "border-[#D8DDE2]"
                    }`}
                  />
                  {errors.requiredDeliveryDate && (
                    <p className="text-xs text-[#C80808] mt-1">{errors.requiredDeliveryDate.message}</p>
                  )}
                </div>
              </div>

              {/* Attachment selector */}
              <div className="mt-4">
                <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-1.5">
                  Upload Specification Datasheet or MTO (Optional Preview)
                </label>
                {selectedFile ? (
                  <div className="flex items-center justify-between p-3.5 rounded-[4px] bg-[#F5F6F7] border border-[#D8DDE2]">
                    <div className="flex items-center space-x-3 truncate">
                      <FileCheck2 className="w-5 h-5 text-[#C80808] shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#17191C] truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-[#5F6871]">
                          {selectedFile.size} • Selected for verification
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 text-[#5F6871] hover:text-[#C80808]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border border-dashed border-[#D8DDE2] hover:border-[#C80808] rounded-[4px] p-5 flex flex-col items-center justify-center cursor-pointer bg-[#F5F6F7] hover:bg-white transition-colors">
                    <UploadCloud className="w-6 h-6 text-[#5F6871] mb-1" />
                    <span className="text-xs font-semibold text-[#17191C]">
                      Click to browse datasheet or RFQ documents
                    </span>
                    <span className="text-[11px] text-[#5F6871] mt-0.5">
                      PDF, Excel, Word, or DWG (Frontend preview)
                    </span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.zip"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#D8DDE2]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full text-center"
              >
                {isSubmitting ? "Validating RFQ..." : "Submit Technical RFQ"}
              </button>
              <p className="text-xs text-[#5F6871] text-center mt-3">
                Client-side demo validation. We respond with technical bid tabulations within 24–48 hours.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
