"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Info, Send, ArrowRight } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required (min 2 characters)"),
  companyName: z.string().min(2, "Company / Organization is required"),
  email: z.string().email("Please enter a valid business email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  division: z.string().min(1, "Please select an area of interest"),
  message: z.string().min(10, "Please describe your requirement (min 10 characters)"),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm({ bare = false }: { bare?: boolean } = {}) {
  const [submitted, setSubmitted] = useState<FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      division: "Instrumentation & Valves",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to submit enquiry");
      }
      setSubmitted(data);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while submitting your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={bare ? "" : "bg-white border border-[#D8DDE2] rounded-[8px] p-8 sm:p-10 shadow-[0_1px_2px_rgba(16,24,38,0.06),0_4px_12px_rgba(16,24,38,0.04)]"}>
      {submitted ? (
        <div className="space-y-5">
          <div className="p-4 rounded-[4px] bg-[#1f7a4d]/10 border-l-[3px] border-[#1f7a4d] text-[#1a5c3b]">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-[#1f7a4d] shrink-0" />
              <h4 className="font-['Plus_Jakarta_Sans'] text-base font-bold">
                Message Received Successfully
              </h4>
            </div>
            <p className="mt-1 text-xs text-[#1a5c3b]/90">
              Thank you, {submitted.fullName}. Our technical sales desk will review your inquiry and follow up within one business day.
            </p>
          </div>

          <div className="bg-[#F5F6F7] p-5 rounded-[4px] border border-[#D8DDE2] text-xs space-y-1.5">
            <p className="font-bold text-[#17191C]">Summary of Submission:</p>
            <p className="text-[#5F6871]"><strong>Company:</strong> {submitted.companyName}</p>
            <p className="text-[#5F6871]"><strong>Email:</strong> {submitted.email}</p>
            <p className="text-[#5F6871]"><strong>Division:</strong> {submitted.division}</p>
            <p className="mt-2 text-[#5F6871]"><strong>Message:</strong> {submitted.message}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              reset();
              setSubmitted(null);
            }}
            className="btn btn-primary text-xs"
          >
            <span>Send Another Inquiry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {submitError && (
            <div className="p-3.5 rounded-[4px] bg-[#FF4B32]/10 border-l-[3px] border-[#FF4B32] text-[#17191C] flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 text-[#FF4B32] shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-2">
                Full name <span className="text-[#FF4B32]">*</span>
              </label>
              <input
                type="text"
                {...register("fullName")}
                placeholder="Your full name"
                className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/10 transition-colors ${
                  errors.fullName ? "border-[#FF4B32]" : "border-[#D8DDE2]"
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-[#FF4B32] mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-2">
                Company <span className="text-[#FF4B32]">*</span>
              </label>
              <input
                type="text"
                {...register("companyName")}
                placeholder="Company / Organization"
                className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/10 transition-colors ${
                  errors.companyName ? "border-[#FF4B32]" : "border-[#D8DDE2]"
                }`}
              />
              {errors.companyName && (
                <p className="text-xs text-[#FF4B32] mt-1">{errors.companyName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-2">
                Email address <span className="text-[#FF4B32]">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="procurement@company.com"
                className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/10 transition-colors ${
                  errors.email ? "border-[#FF4B32]" : "border-[#D8DDE2]"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-[#FF4B32] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-2">
                Phone / Mobile <span className="text-[#FF4B32]">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+91 (0) 00000 00000"
                className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/10 transition-colors ${
                  errors.phone ? "border-[#FF4B32]" : "border-[#D8DDE2]"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-[#FF4B32] mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-2">
              Area of Interest <span className="text-[#FF4B32]">*</span>
            </label>
            <select
              {...register("division")}
              className="w-full px-4 py-3 rounded-[4px] border border-[#D8DDE2] text-sm text-[#17191C] bg-white focus:outline-none focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/10 transition-colors"
            >
              <option value="Instrumentation & Valves">Instrumentation & High-Pressure Valves</option>
              <option value="Double Ferrule Fittings & Tubing">Double Ferrule Fittings & Tubing</option>
              <option value="RO & Water Treatment Chemicals">RO & Water Treatment Chemicals</option>
              <option value="Cooling & Boiler Chemistry">Cooling & Boiler Chemistry</option>
              <option value="Water Treatment Plants (RO/DM/STP)">Water Treatment Plants (RO / DM / STP)</option>
              <option value="Project Procurement & Sourcing">Comprehensive Project Sourcing</option>
              <option value="General Technical Inquiry">General Technical Inquiry</option>
              <option value="Website Feedback & Suggestions">Website Feedback &amp; Suggestions</option>
            </select>
          </div>

          <div>
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-2">
              Message / Inquiry Details <span className="text-[#FF4B32]">*</span>
            </label>
            <textarea
              rows={4}
              {...register("message")}
              placeholder="Please provide specifics: line items, operating pressure, chemical application, or specification standard..."
              className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/10 transition-colors ${
                errors.message ? "border-[#FF4B32]" : "border-[#D8DDE2]"
              }`}
            />
            {errors.message && (
              <p className="text-xs text-[#FF4B32] mt-1">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary py-3.5 flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Submitting Inquiry...</span>
            ) : (
              <>
                <span>Submit Inquiry</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
