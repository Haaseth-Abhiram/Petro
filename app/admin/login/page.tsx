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
  ArrowRight,
  FileText,
  BarChart3,
  User,
  Building2,
  Phone,
} from "lucide-react";
import PetroLogo from "@/components/common/PetroLogo";
import { adminLoginSchema, AdminLoginFormData } from "@/lib/validations";
import { authenticateAdmin, registerUser, AuthResult } from "@/lib/auth";

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

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [su, setSu] = useState({ name: "", company: "", email: "", phone: "", password: "" });
  const [showSuPassword, setShowSuPassword] = useState(false);
  const [suBusy, setSuBusy] = useState(false);
  const [suMsg, setSuMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuMsg(null);
    if (su.name.trim().length < 2) {
      setSuMsg({ ok: false, text: "Please enter your full name." });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(su.email)) {
      setSuMsg({ ok: false, text: "Please enter a valid email address." });
      return;
    }
    if (!su.password || su.password.length < 6) {
      setSuMsg({ ok: false, text: "Password must be at least 6 characters long." });
      return;
    }

    setSuBusy(true);
    try {
      const result = await registerUser({
        fullName: su.name,
        company: su.company,
        email: su.email,
        phone: su.phone,
        password: su.password,
      });

      if (!result.success) {
        throw new Error(result.message || result.error || "Failed to create account");
      }

      setSuMsg({
        ok: true,
        text: "Account created successfully! Your sign-up has been sent to the Admin under Roles for role assignment (HR, Employee, Client, Admin).",
      });
      // Reset password field only
      setSu((prev) => ({ ...prev, password: "" }));
    } catch (err: any) {
      setSuMsg({ ok: false, text: err.message || "Something went wrong. Please try again." });
    } finally {
      setSuBusy(false);
    }
  };

  const fieldCls = (bad: boolean) =>
    `w-full pl-10 pr-3 py-2.5 rounded-xl border-2 text-[14px] text-[#17191C] placeholder:text-[#929DA7] bg-white transition-all outline-none ${
      bad
        ? "border-[#C80808] bg-[#FFF1EF]/60"
        : "border-[#E7E9EE] hover:border-[#D8C9B3] focus:border-[#C80808] focus:shadow-[0_0_0_4px_rgba(255,75,50,0.12)]"
    }`;
  const lbl = "block text-[11px] font-extrabold uppercase tracking-wider text-[#17191C] mb-1";
  const ico = "w-[17px] h-[17px] text-[#C80808] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none";

  return (
    <div className="h-screen w-full overflow-hidden grid lg:grid-cols-[1fr_1fr] bg-[#FFF8F0]">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#17191C] text-white p-10 xl:p-12">
        <Image
          src="/assets/img/service-technical-consultation.jpg"
          alt=""
          fill
          sizes="50vw"
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#17191C]/80 via-[#1F171A]/60 to-[#C80808]/40" />
        <div className="absolute -top-24 -right-16 w-[440px] h-[440px] rounded-full bg-[#FFA028]/15 blur-[110px] animate-blob" />
        <div className="absolute -bottom-32 -left-20 w-[420px] h-[420px] rounded-full bg-[#C80808]/15 blur-[110px] animate-blob" />
        <div className="absolute inset-0 dot-grid opacity-20" />

        <div className="relative flex items-center justify-between">
          <span className="rounded-2xl bg-white/95 shadow-xl px-4 py-2.5">
            <PetroLogo width={130} />
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 px-4 py-1.5 text-[12.5px] font-semibold text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFA028] group-hover:-translate-x-1 transition-transform" />
            Back to website
          </Link>
        </div>

        <div className="relative max-w-[480px]">
          <span className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFA028] mb-3">
            <span className="h-[3px] w-9 rounded bg-[#FFA028]" />
            Customer &amp; Admin Portal
          </span>
          <h2 className="text-[2.3rem] xl:text-[2.6rem] font-black leading-[1.08] mb-3 text-white">
            Your enquiries, quotes and orders <span className="text-gradient animate-gradient">in one place.</span>
          </h2>
          <p className="text-white/75 text-[14.5px] leading-relaxed mb-6">
            Sign in to manage operations, review quotations, and track engineering orders.
          </p>
          <ul className="space-y-2.5">
            {[
              { i: FileText, t: "Track every RFQ and quotation in real time" },
              { i: BarChart3, t: "Live view of products, catalogue and enquiries" },
              { i: ShieldCheck, t: "Secure, role-based access with audit trail" },
            ].map((x) => (
              <li
                key={x.t}
                className="flex items-center gap-3 rounded-xl bg-white/[0.07] border border-white/15 backdrop-blur px-3.5 py-2.5 text-[14px] text-white/95 hover:bg-white/[0.13] hover:translate-x-1 transition-all"
              >
                <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C80808]/70 to-[#FFA028]/70 flex items-center justify-center shrink-0">
                  <x.i className="w-[18px] h-[18px] text-white" />
                </span>
                {x.t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-wrap gap-2">
          {["ISO 9001:2015", "EN 10204 3.1 / 3.2", "NACE MR0175"].map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold text-white/85"
            >
              {c}
            </span>
          ))}
        </div>
      </aside>

      {/* Form panel */}
      <main className="relative flex items-center justify-center px-5 sm:px-10 overflow-hidden">
        <div className="absolute -top-24 -right-20 w-[360px] h-[360px] rounded-full bg-[#FFA028]/[0.10] blur-[90px]" />
        <div className="absolute -bottom-24 -left-20 w-[360px] h-[360px] rounded-full bg-[#C80808]/[0.05] blur-[90px]" />
        <Link
          href="/"
          className="lg:hidden absolute top-4 left-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#4a5159]"
        >
          <ArrowLeft className="w-4 h-4 text-[#C80808]" />
          Home
        </Link>

        <div className="relative w-full max-w-[430px]">
          <div className="lg:hidden flex justify-center mb-3">
            <Link href="/">
              <PetroLogo width={130} />
            </Link>
          </div>
          <div className="rounded-3xl bg-white border border-[#F0E3D2] shadow-[0_30px_80px_rgba(255,75,50,0.14)] overflow-hidden animate-[routefade_.7s_ease-out_both] relative before:absolute before:inset-x-0 before:top-0 before:h-[4px] before:bg-gradient-to-r before:from-[#C80808] via-[#FFA028] before:to-[#FFD580]">
            {/* tabs */}
            <div className="relative grid grid-cols-2 bg-[#FFF8F0] p-1.5 m-4 mb-0 rounded-2xl" role="tablist">
              <span
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-gradient-to-r from-[#C80808]/70 to-[#FFA028]/70 shadow-md transition-all duration-300"
                style={{ left: mode === "login" ? 6 : "calc(50%)" }}
              />
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => {
                    setMode(m);
                    setSuMsg(null);
                    setAuthStatus(null);
                  }}
                  className={`relative z-10 py-2.5 text-[14px] font-extrabold transition-colors ${
                    mode === m ? "text-white" : "text-[#4a5159] hover:text-[#17191C]"
                  }`}
                >
                  {m === "login" ? "Login" : "Sign up"}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6 pt-4">
              {mode === "login" ? (
                <>
                  <h1 className="text-[1.45rem] font-black text-[#17191C] leading-tight">Welcome back</h1>
                  <p className="text-[#4a5159] text-[13px] mb-4">Sign in to your account to continue.</p>
                  {authStatus && (
                    <div
                      className={`mb-3 p-3 rounded-xl border text-[12.5px] ${
                        authStatus.success
                          ? "bg-green-50 border-green-200 text-green-900"
                          : "bg-[#FFF1EF] border-[#C80808]/30 text-[#17191C]"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {authStatus.success ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-[#C80808] shrink-0 mt-0.5" />
                        )}
                        <div>
                          <strong className="font-bold block">{authStatus.message}</strong>
                          {authStatus.error && <p className="text-[#4a5159] text-xs mt-0.5">{authStatus.error}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
                    <div>
                      <label htmlFor="email" className={lbl}>
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className={ico} />
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="name@company.com"
                          {...register("email")}
                          className={fieldCls(!!errors.email)}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[#C80808] text-xs mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label htmlFor="password" className="text-[11px] font-extrabold uppercase tracking-wider text-[#17191C]">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(true)}
                          className="text-[11.5px] font-bold text-[#C80808] hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className={ico} />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••••••"
                          {...register("password")}
                          className={`${fieldCls(!!errors.password)} pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#929DA7] hover:text-[#17191C] p-1"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-[17px] h-[17px]" /> : <Eye className="w-[17px] h-[17px]" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-[#C80808] text-xs mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <input
                        id="rememberMe"
                        type="checkbox"
                        {...register("rememberMe")}
                        className="w-4 h-4 rounded border-[#D8DDE2] text-[#C80808] focus:ring-[#C80808] cursor-pointer"
                      />
                      <label htmlFor="rememberMe" className="ml-2.5 text-[12.5px] text-[#4a5159] font-medium cursor-pointer select-none">
                        Remember me for 30 days
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full inline-flex items-center justify-center gap-2 text-[14.5px] font-extrabold bg-gradient-to-r from-[#C80808]/70 to-[#FFA028]/70 bg-[length:200%_100%] hover:bg-right text-white py-3 rounded-xl shadow-[0_8px_22px_rgba(200,8,8,0.22)] hover:-translate-y-0.5 disabled:opacity-70 transition-all duration-500"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Login</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                  <p className="text-center text-[12.5px] text-[#4a5159] mt-4">
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="font-extrabold text-[#C80808] hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-[1.45rem] font-black text-[#17191C] leading-tight">Create your account</h1>
                  <p className="text-[#4a5159] text-[13px] mb-4">Tell us about you — we&apos;ll set up your access.</p>
                  {suMsg && (
                    <div
                      className={`mb-3 p-3 rounded-xl border text-[12.5px] flex gap-2 ${
                        suMsg.ok ? "bg-green-50 border-green-200 text-green-900" : "bg-[#FFF1EF] border-[#C80808]/30 text-[#17191C]"
                      }`}
                    >
                      {suMsg.ok ? (
                        <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#C80808] shrink-0 mt-0.5" />
                      )}
                      <span>{suMsg.text}</span>
                    </div>
                  )}
                  <form onSubmit={submitSignup} className="space-y-3" noValidate>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="su-name" className={lbl}>
                          Full name
                        </label>
                        <div className="relative">
                          <User className={ico} />
                          <input
                            id="su-name"
                            value={su.name}
                            onChange={(e) => setSu({ ...su, name: e.target.value })}
                            placeholder="Your name"
                            className={fieldCls(false)}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="su-co" className={lbl}>
                          Company
                        </label>
                        <div className="relative">
                          <Building2 className={ico} />
                          <input
                            id="su-co"
                            value={su.company}
                            onChange={(e) => setSu({ ...su, company: e.target.value })}
                            placeholder="Company"
                            className={fieldCls(false)}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="su-email" className={lbl}>
                        Work email
                      </label>
                      <div className="relative">
                        <Mail className={ico} />
                        <input
                          id="su-email"
                          type="email"
                          value={su.email}
                          onChange={(e) => setSu({ ...su, email: e.target.value })}
                          placeholder="name@company.com"
                          className={fieldCls(false)}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="su-ph" className={lbl}>
                        Phone <span className="font-medium normal-case text-[#929DA7]">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className={ico} />
                        <input
                          id="su-ph"
                          value={su.phone}
                          onChange={(e) => setSu({ ...su, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className={fieldCls(false)}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="su-password" className={lbl}>
                        Password <span className="text-[#C80808]">*</span>
                      </label>
                      <div className="relative">
                        <Lock className={ico} />
                        <input
                          id="su-password"
                          type={showSuPassword ? "text" : "password"}
                          value={su.password}
                          onChange={(e) => setSu({ ...su, password: e.target.value })}
                          placeholder="At least 6 characters"
                          className={`${fieldCls(false)} pr-11`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSuPassword(!showSuPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#929DA7] hover:text-[#17191C] p-1"
                          aria-label={showSuPassword ? "Hide password" : "Show password"}
                        >
                          {showSuPassword ? <EyeOff className="w-[17px] h-[17px]" /> : <Eye className="w-[17px] h-[17px]" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-[#4a5159] mt-1">Must be at least 6 characters.</p>
                    </div>
                    <button
                      type="submit"
                      disabled={suBusy}
                      className="group w-full inline-flex items-center justify-center gap-2 text-[14.5px] font-extrabold bg-gradient-to-r from-[#C80808]/70 to-[#FFA028]/70 bg-[length:200%_100%] hover:bg-right text-white py-3 rounded-xl shadow-[0_8px_22px_rgba(200,8,8,0.22)] hover:-translate-y-0.5 disabled:opacity-70 transition-all duration-500"
                    >
                      {suBusy ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create account</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    {suMsg?.ok && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setSuMsg(null);
                        }}
                        className="w-full text-center py-2 text-[13px] font-bold text-[#C80808] hover:underline"
                      >
                        Proceed to Login →
                      </button>
                    )}
                  </form>
                  <p className="text-center text-[12.5px] text-[#4a5159] mt-4">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-extrabold text-[#C80808] hover:underline"
                    >
                      Login
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
          <p className="text-center text-[11.5px] text-[#929DA7] mt-3">
            © {new Date().getFullYear()} Petro Engineering Private Limited ·{" "}
            <Link href="/privacy" className="hover:text-[#C80808]">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="hover:text-[#C80808]">
              Terms
            </Link>
          </p>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_.2s_ease]">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border border-[#D8DDE2] shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-[#929DA7] hover:text-[#17191C] p-1 rounded"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#C80808]/10 text-[#C80808] flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-[#17191C] mb-2">Password Recovery</h3>
            <p className="text-sm text-[#5F6871] leading-relaxed mb-6">
              For security compliance, automated public password resets are restricted. Please contact your support desk or IT
              department to request an authorized credential reset.
            </p>

            <div className="bg-[#F5F6F7] p-4 rounded-lg border border-[#D8DDE2] text-xs text-[#5F6871] mb-6">
              <span className="font-bold text-[#17191C] block mb-1">Support Contact:</span>
              <span>support@petroeng.in</span>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl border border-[#D8DDE2] text-[#17191C] font-bold text-sm hover:bg-[#F5F6F7] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
