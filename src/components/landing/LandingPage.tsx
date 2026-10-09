import React, { useState } from 'react';
import { HeroDashboardPreview } from './HeroDashboardPreview';
import {
  ShieldCheck,
  FileText,
  Users,
  BarChart3,
  FileCheck2,
  Cpu,
  Star,
  Briefcase,
  History,
  UploadCloud,
  CheckCircle,
  Landmark,
  User,
  GraduationCap,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDashboard: () => void;
  onOpenSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDashboard,
  onOpenSignIn,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is EduCred?',
      a: 'EduCred is a comprehensive institutional platform designed to document, verify with AI assistance, and recognize the vital contributions educators make beyond ordinary classroom teaching—including mentoring, research, assessments, workshops, and institutional leadership.',
    },
    {
      q: 'How are recognition credits calculated?',
      a: 'Credits are determined by institutional administrators through transparent credit rules for each activity category (e.g., 10 credits for lesson planning, 25 for peer-reviewed research, 15 for faculty development). Credits are permanently recorded in an append-only ledger only after verified human approval.',
    },
    {
      q: 'Who can use EduCred?',
      a: 'Educators submit their professional work, authorized checkers inspect and verify evidence files, and institutional administrators configure credit policies, manage departments, and audit verification records.',
    },
    {
      q: 'Is my data secure?',
      a: 'Yes. EduCred uses strict PostgreSQL Row Level Security (RLS) policies. Teachers can only access their own submissions and evidence. All evidence files are stored securely with SHA-256 integrity hashing and private institutional isolation.',
    },
    {
      q: 'How does the verification process work?',
      a: 'When an activity is submitted, automated OCR extracts key dates, educator names, and checks for duplicate files or timestamp conflicts. The submission then routes to an assigned human checker who reviews the evidence and makes the final approval decision.',
    },
    {
      q: 'Can I export my portfolio?',
      a: 'Yes! Verified contributions automatically populate your certified Professional Portfolio. Educators can generate, preview, and download a printable, tamper-evident PDF portfolio for accreditation, career milestones, or appraisals.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFBFB] text-[#192A56] overflow-x-hidden">
      
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        {/* Subtle decorative background gradient blobs matching screenshot palette */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#F7D794]/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-36 right-10 w-80 h-80 bg-[#EDA6A3]/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-6 flex flex-col items-start">
              
              {/* Audience Pill Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDA6A3]/20 text-[#192A56] text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EDA6A3]" />
                <span>For Teachers • For Institutions</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#192A56] tracking-tight leading-[1.12] mb-6">
                Make Every <br />
                Contribution Visible.
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                Recognize the work that makes education stronger. EduCred helps institutions
                document teacher contributions, review supporting evidence, award recognition
                credits, and build meaningful professional portfolios.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-[#192A56] hover:bg-[#121f42] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#features"
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-[#192A56] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-xs flex items-center justify-center"
                >
                  Explore Features
                </a>
              </div>

              {/* 3 Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 w-full">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F7D794]/30 text-[#192A56] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#192A56]" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 leading-snug">
                    Transparent contribution tracking
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EDA6A3]/30 text-[#192A56] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#192A56]" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 leading-snug">
                    Evidence-supported recognition
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F7D794]/30 text-[#192A56] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-[#192A56]" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 leading-snug">
                    Human-reviewed decisions
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Dashboard Preview */}
            <div className="lg:col-span-6 relative">
              <HeroDashboardPreview onOpenDashboard={onExploreDashboard} />
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 2. POWERFUL FEATURES SECTION ---------------- */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl font-extrabold text-[#192A56] tracking-tight mb-3">
              Powerful Features
            </h2>
            <p className="text-slate-600 text-base">
              Everything you need to track, verify and recognize teacher contributions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-[#FCFBFB] border border-slate-200/80 hover:border-[#192A56]/30 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#F7D794]/40 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6 text-[#192A56]" />
              </div>
              <h3 className="text-lg font-bold text-[#192A56] mb-2">
                Contribution Tracking
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Record teaching, mentoring, workshops, project guidance, and institutional work with structured categorizations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-[#FCFBFB] border border-slate-200/80 hover:border-[#192A56]/30 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#EDA6A3]/30 flex items-center justify-center mb-5">
                <FileCheck2 className="w-6 h-6 text-[#192A56]" />
              </div>
              <h3 className="text-lg font-bold text-[#192A56] mb-2">
                Evidence Management
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Attach supporting documents, certificates, images or links to activities with SHA-256 cryptographic proof.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-[#FCFBFB] border border-slate-200/80 hover:border-[#192A56]/30 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#F7D794]/40 flex items-center justify-center mb-5">
                <Cpu className="w-6 h-6 text-[#192A56]" />
              </div>
              <h3 className="text-lg font-bold text-[#192A56] mb-2">
                AI-Assisted Screening
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Highlight possible inconsistencies, missing dates, or duplicate files automatically for reviewer attention.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-[#FCFBFB] border border-slate-200/80 hover:border-[#192A56]/30 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#EDA6A3]/30 flex items-center justify-center mb-5">
                <Star className="w-6 h-6 text-[#192A56]" />
              </div>
              <h3 className="text-lg font-bold text-[#192A56] mb-2">
                Transparent Credit System
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Display institution-configured recognition credits and immutable transaction history in an append-only ledger.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl bg-[#FCFBFB] border border-slate-200/80 hover:border-[#192A56]/30 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#F7D794]/40 flex items-center justify-center mb-5">
                <Briefcase className="w-6 h-6 text-[#192A56]" />
              </div>
              <h3 className="text-lg font-bold text-[#192A56] mb-2">
                Professional Portfolio
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Organize approved achievements into a shareable professional record and generate verified printable credentials.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl bg-[#FCFBFB] border border-slate-200/80 hover:border-[#192A56]/30 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#EDA6A3]/30 flex items-center justify-center mb-5">
                <History className="w-6 h-6 text-[#192A56]" />
              </div>
              <h3 className="text-lg font-bold text-[#192A56] mb-2">
                Audit Trail
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Keep an understandable, tamper-resistant record of submission, review, clarification and approval events.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 3. HOW IT WORKS SECTION ---------------- */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-[#192A56] tracking-tight mb-2">
              How It Works
            </h2>
            <p className="text-lg font-semibold text-[#192A56] mb-3">
              AI assists. Humans decide.
            </p>
            <p className="text-slate-600 text-sm sm:text-base">
              Our intelligent verification process checks for authenticity, dates and consistency,
              then routes the evidence to a human reviewer for the final decision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F7D794]/40 flex items-center justify-center mb-5 shadow-xs">
                <UploadCloud className="w-7 h-7 text-[#192A56]" />
              </div>
              <div className="text-sm font-bold text-[#192A56] mb-1.5">
                1. Submit
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teacher submits an activity and supporting evidence.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#EDA6A3]/30 flex items-center justify-center mb-5 shadow-xs">
                <Cpu className="w-7 h-7 text-[#192A56]" />
              </div>
              <div className="text-sm font-bold text-[#192A56] mb-1.5">
                2. AI Checks
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI highlights items that may need attention or clarification.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F7D794]/40 flex items-center justify-center mb-5 shadow-xs">
                <Users className="w-7 h-7 text-[#192A56]" />
              </div>
              <div className="text-sm font-bold text-[#192A56] mb-1.5">
                3. Human Review
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                A checker examines the evidence and makes the decision.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#EDA6A3]/30 flex items-center justify-center mb-5 shadow-xs">
                <CheckCircle className="w-7 h-7 text-[#192A56]" />
              </div>
              <div className="text-sm font-bold text-[#192A56] mb-1.5">
                4. Recognize
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Approved contributions are recorded and credits update the portfolio.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------- 4. BENEFITS FOR EVERYONE SECTION ---------------- */}
      <section id="benefits" className="py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-14">
            <h2 className="text-3xl font-extrabold text-[#192A56] tracking-tight">
              Benefits for Everyone
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left 2 Cards (Teachers & Institutions) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* For Teachers Card */}
              <div className="p-6 rounded-2xl bg-[#FCFBFB] border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#F7D794]/40 flex items-center justify-center mb-4">
                    <User className="w-5 h-5 text-[#192A56]" />
                  </div>
                  <h3 className="text-base font-bold text-[#192A56] mb-4">
                    For Teachers
                  </h3>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Document work beyond classroom teaching</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Track contribution history and recognition credits</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Build a professional portfolio</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Understand the status of every submission</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* For Institutions Card */}
              <div className="p-6 rounded-2xl bg-[#FCFBFB] border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EDA6A3]/30 flex items-center justify-center mb-4">
                    <Landmark className="w-5 h-5 text-[#192A56]" />
                  </div>
                  <h3 className="text-base font-bold text-[#192A56] mb-4">
                    For Institutions
                  </h3>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Use consistent contribution categories and credit rules</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Organize evidence and review queues</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Maintain review histories and audit records</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Improve transparency in contribution recognition</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Right Card: See EduCred in Action */}
            <div className="lg:col-span-5 p-8 rounded-2xl bg-gradient-to-br from-[#FFF7EA] to-[#FCEEEA] border border-[#F7D794]/40 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#192A56] mb-2">
                  See EduCred in Action
                </h3>
                <p className="text-xs text-slate-600 mb-6">
                  A clean, simple dashboard designed for teachers, checkers and administrators.
                </p>
                <button
                  onClick={onExploreDashboard}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#192A56] hover:bg-[#121f42] rounded-xl shadow-sm transition-all flex items-center gap-2 mb-8 group"
                >
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Graphic device preview */}
              <div
                onClick={onExploreDashboard}
                className="relative bg-white rounded-xl shadow-lg border border-slate-200/80 p-3 cursor-pointer hover:border-[#192A56]/30 transition-all"
              >
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 mb-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[9px] text-slate-400 ml-2">educred.app/dashboard</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  <div className="h-6 rounded bg-[#F7D794]/40" />
                  <div className="h-6 rounded bg-[#EDA6A3]/30" />
                  <div className="h-6 rounded bg-purple-100" />
                  <div className="h-6 rounded bg-emerald-100" />
                </div>
                <div className="h-14 rounded bg-slate-50 flex items-center justify-center text-[10px] text-slate-400">
                  Interactive workspace loaded
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ---------------- 5. RESPONSIBLE AI FOR FAIR RECOGNITION SECTION ---------------- */}
      <section id="responsible-ai" className="py-20 bg-[#FCFBFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Graphic / Icon Illustration */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="relative w-36 h-36 rounded-2xl bg-[#FFF7EA] border border-[#F7D794]/40 flex items-center justify-center shadow-inner">
                  <FileText className="w-16 h-16 text-[#192A56]/80" />
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-xl bg-[#EDA6A3] flex items-center justify-center shadow-md">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Center Text */}
              <div className="lg:col-span-5">
                <h3 className="text-2xl font-extrabold text-[#192A56] tracking-tight mb-3">
                  Responsible AI for Fair Recognition
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our AI doesn't make final decisions. It flags potential issues and provides
                  clear explanations so human reviewers can make informed, fair and transparent decisions.
                </p>
              </div>

              {/* Right Checklist */}
              <div className="lg:col-span-4 space-y-3.5 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8 pt-6 lg:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-800">
                    OCR reads lesson details and dates
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-800">
                    Checks for duplicates and inconsistencies
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-800">
                    Detects possible image manipulation
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-medium text-slate-800">
                    Always requires human review
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 6. FREQUENTLY ASKED QUESTIONS SECTION ---------------- */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-[#192A56] tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm">
              Answers to common questions regarding verification, recognition credits, and data privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-[#FCFBFB] transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#192A56] hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-xs font-bold text-slate-400 shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ---------------- 7. CALL TO ACTION BANNER ---------------- */}
      <section className="py-16 bg-[#FCFBFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#192A56] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-8 h-8 text-[#F7D794]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
                  Ready to make your contributions count?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Join EduCred today and build your professional future.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={onGetStarted}
                className="flex-1 sm:flex-initial px-6 py-3 text-sm font-bold text-[#192A56] bg-[#F7D794] hover:bg-[#ebcd82] rounded-xl transition-all shadow-md"
              >
                Get Started
              </button>
              <button
                onClick={onOpenSignIn}
                className="flex-1 sm:flex-initial px-6 py-3 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
              >
                Sign In
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
