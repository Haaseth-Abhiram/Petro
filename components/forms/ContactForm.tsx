"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Info, RefreshCw } from "lucide-react";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Valid corporate email required"),
  phone: z.string().min(7, "Valid phone number required"),
  division: z.string().min(1, "Please select an area of requirement"),
  message: z.string().min(10, "Please describe your requirement (min 10 characters)"),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
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
    <div className="bg-white border border-[#D8DDE2] rounded-[8px] p-8 sm:p-10 shadow-[0_1px_2px_rgba(16,24,38,0.06),0_4px_12px_rgba(16,24,38,0.04)]">
      {submitted ? (
        <div className="space-y-5">
          <div className="p-4 rounded-[4px] bg-[#1f7a4d]/10 border-l-[3px] border-[#1f7a4d] text-[#1a5c3b]">
            <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-base">
              Enquiry Received & Registered
            </h4>
            <p className="text-sm mt-1">
              Thank you for contacting Petro Engineering. Your message has been safely logged in our database and routed to our technical team.
            </p>
          </div>

          <div className="bg-[#F5F6F7] p-4 rounded-[4px] border border-[#D8DDE2] text-xs text-[#5F6871] space-y-1.5">
            <p><strong>Contact:</strong> {submitted.fullName} ({submitted.companyName})</p>
            <p><strong>Email:</strong> {submitted.email} | <strong>Phone:</strong> {submitted.phone}</p>
            <p><strong>Division:</strong> {submitted.division}</p>
            <p className="mt-2 text-[#5F6871]"><strong>Message:</strong> {submitted.message}</p>
          </div>

          <div className="p-3 bg-[#FF4B32]/5 border border-[#FF4B32]/20 rounded-[4px] text-xs text-[#5F6871] flex items-start space-x-2">
            <Info className="w-4 h-4 text-[#FF4B32] shrink-0 mt-0.5" />
            <span>This is a frontend demonstration. No email has been sent and no database record was stored.</span>
          </div>

          <button
            onClick={() => {
              setSubmitted(null);
              reset();
            }}
            className="btn btn-outline-dark w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span>Send another enquiry</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
                placeholder="work@company.com"
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
                Phone number <span className="text-[#FF4B32]">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+91 98765 43210"
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
              Area of requirement <span className="text-[#FF4B32]">*</span>
            </label>
            <select
              {...register("division")}
              className="w-full px-4 py-3 rounded-[4px] border border-[#D8DDE2] text-sm text-[#17191C] bg-white focus:outline-none focus:border-[#FF4B32]"
            >
              <option value="Instrumentation & Valves">Instrumentation &amp; Valves</option>
              <option value="Chemical & Water Treatment">Chemical &amp; Water Treatment</option>
              <option value="Both / Project Package">Both / Project Package</option>
              <option value="Engineering / Procurement Support">Engineering / Procurement Support</option>
            </select>
          </div>

          <div>
            <label className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#17191C] block mb-2">
              Message / Specification details <span className="text-[#FF4B32]">*</span>
            </label>
            <textarea
              rows={4}
              {...register("message")}
              placeholder="Tell us about the line items, quantities, pressure ratings or water parameters..."
              className={`w-full px-4 py-3 rounded-[4px] border text-sm text-[#17191C] focus:outline-none focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/10 transition-colors ${
                errors.message ? "border-[#FF4B32]" : "border-[#D8DDE2]"
              }`}
            />
            {errors.message && (
              <p className="text-xs text-[#FF4B32] mt-1">{errors.message.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full text-center"
            >
              {isSubmitting ? "Validating..." : "Send enquiry"}
            </button>
            <p className="text-xs text-[#5F6871] text-center mt-3">
              We respond to all technical enquiries within one business day.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
