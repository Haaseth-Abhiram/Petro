"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { adminLoginSchema, AdminLoginFormData } from "@/lib/validations";
import { authenticateAdmin, AuthResult } from "@/lib/auth";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsSubmitting(true);
    setAuthStatus(null);

    // Call authentication integration point
    try {
      const result = await authenticateAdmin(data);
      setAuthStatus(result);
      if (result.success) {
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 800);
      }
    } catch (err: any) {
      setAuthStatus({
        success: false,
        message: "An unexpected error occurred during authentication.",
        error: err?.message || "Connection failure",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#17191C] flex flex-col justify-between relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glow matching brand identity */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#FF4B32]/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[350px] bg-[#929DA7]/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Top Header / Back Navigation */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#929DA7] hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF4B32] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Website</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-[#929DA7]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FF4B32]" />
          <span>Secure Login</span>
        </div>
      </div>

      {/* Main Login Card Area */}
      <div className="max-w-[460px] w-full mx-auto my-auto z-10 py-8">
        <div className="bg-[#FFFFFF] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.35)] border border-[#D8DDE2] overflow-hidden">
          {/* Card Header & Brand Logo */}
          <div className="p-8 pb-6 text-center border-b border-[#D8DDE2] bg-[#F5F6F7]/50">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/assets/img/logo.png"
                alt="Petro Engineering Logo"
                width={190}
                height={38}
                priority
                className="h-9 w-auto object-contain mx-auto"
              />
            </Link>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17191C] tracking-tight mb-2">
              Login
            </h1>
            <p className="text-[#5F6871] text-sm">
              Sign in to your account.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 pt-6">
            {/* Feedback / Architecture Notice */}
            {authStatus && (
              <div
                className={`mb-6 p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  authStatus.success
                    ? "bg-green-50 border-green-200 text-green-900"
                    : "bg-[#F5F6F7] border-[#D8DDE2] text-[#17191C]"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#FF4B32] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-[#17191C] block mb-1">
                      {authStatus.message}
                    </strong>
                    {authStatus.error && (
                      <p className="text-[#5F6871] text-xs">
                        {authStatus.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-[#17191C] mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#929DA7] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-[#17191C] placeholder:text-[#929DA7] transition-all outline-none ${
                      errors.email
                        ? "border-[#FF4B32] bg-[#FF4B32]/5 focus:ring-2 focus:ring-[#FF4B32]/20"
                        : "border-[#D8DDE2] focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/10"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[#FF4B32] text-xs mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-wider text-[#17191C]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-[#FF4B32] hover:text-[#E03820] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#929DA7] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    {...register("password")}
                    className={`w-full pl-10 pr-11 py-2.5 rounded-lg border text-sm text-[#17191C] placeholder:text-[#929DA7] transition-all outline-none ${
                      errors.password
                        ? "border-[#FF4B32] bg-[#FF4B32]/5 focus:ring-2 focus:ring-[#FF4B32]/20"
                        : "border-[#D8DDE2] focus:border-[#FF4B32] focus:ring-2 focus:ring-[#FF4B32]/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#929DA7] hover:text-[#17191C] p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[#FF4B32] text-xs mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 rounded border-[#D8DDE2] text-[#FF4B32] focus:ring-[#FF4B32] cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2.5 text-xs text-[#5F6871] font-medium cursor-pointer select-none"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 font-['Plus_Jakarta_Sans'] text-sm font-bold bg-[#FF4B32] hover:bg-[#E03820] text-white py-3 px-6 rounded-lg shadow-[0_4px_14px_rgba(255,75,50,0.28)] hover:shadow-[0_6px_20px_rgba(255,75,50,0.38)] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Direct Link to Help */}
            <div className="mt-6 pt-5 border-t border-[#D8DDE2] text-center">
              <Link
                href="/contact"
                className="text-xs font-semibold text-[#5F6871] hover:text-[#17191C] hover:underline"
              >
                Need assistance? Contact support →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-5xl mx-auto w-full text-center text-xs text-[#929DA7] z-10">
        <p>© {new Date().getFullYear()} Petro Engineering Private Limited. All rights reserved.</p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-[#D8DDE2] shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-[#929DA7] hover:text-[#17191C] p-1 rounded"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#FF4B32]/10 text-[#FF4B32] flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-[#17191C] mb-2">
              Password Recovery
            </h3>
            <p className="text-sm text-[#5F6871] leading-relaxed mb-6">
              For security compliance, automated public password resets are restricted. Please contact your support desk or IT department to request an authorized credential reset.
            </p>

            <div className="bg-[#F5F6F7] p-4 rounded-lg border border-[#D8DDE2] text-xs text-[#5F6871] mb-6">
              <span className="font-bold text-[#17191C] block mb-1">Support Contact:</span>
              <span>support@petroeng.in</span>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
