import React from "react";
import { ActiveTab, LanguageCode } from "../types";
import { T } from "../languagesData";
import { ArrowRight, HelpCircle, FileText, CheckCircle, Flame, Shield, MapPin, Landmark } from "lucide-react";

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  selectedLanguage: LanguageCode;
  grievanceCount: number;
  projectCount: number;
}

export default function LandingPage({ setActiveTab, selectedLanguage, grievanceCount, projectCount }: LandingPageProps) {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans text-slate-800" id="landing-page-view">
      {/* Hero Welcome banner */}
      <div className="relative overflow-hidden bg-[#002147] text-white rounded-xl p-8 border-b-4 border-[#e38c2d] shadow-md">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#F4C430] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-[#e38c2d] rounded-full opacity-10 blur-3xl"></div>
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 border border-white/10 text-xs font-semibold text-[#F4C430]">
            <Shield className="w-3.5 h-3.5 text-[#F4C430] animate-pulse" />
            <span><T lang={selectedLanguage} k="kavachBadge">NIC Verified Security Environment • Kavach SSO Integration</T></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight uppercase font-display">
            <T lang={selectedLanguage} k="welcome">Welcome to the Unified National Redressal Platform</T>
          </h2>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            <T lang={selectedLanguage} k="subWelcome">Express grievances, request local development projects, and monitor MPLADS sanctioning transparently.</T>
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab("citizen-auth")}
              className="px-6 py-3 bg-[#e38c2d] hover:bg-[#d17b1d] text-white rounded font-bold text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md uppercase tracking-wider"
              id="landing-citizen-btn"
            >
              <span><T lang={selectedLanguage} k="citizenLogin">Citizen Login / Register</T></span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("mp-auth")}
              className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded font-bold text-sm flex items-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
              id="landing-mp-btn"
            >
              <span><T lang={selectedLanguage} k="officialLogin">NIC Kavach Login (Official)</T></span>
              <Landmark className="w-4 h-4 text-[#F4C430]" />
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Statistics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-dashboard">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-blue-50 text-[#002147] rounded-lg border border-blue-100">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              <T lang={selectedLanguage} k="activeGrievances">Active Grievances</T>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{grievanceCount}</div>
            <div className="text-[10px] text-green-600 font-semibold mt-0.5">● Real-time analysis sync</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-amber-50 text-[#e38c2d] rounded-lg border border-amber-100">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              <T lang={selectedLanguage} k="totalProjects">Prioritised Projects</T>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{projectCount}</div>
            <div className="text-[10px] text-blue-600 font-semibold mt-0.5">CPGRAMS & MPLADS mapped</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-green-50 text-green-700 rounded-lg border border-green-100">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              <T lang={selectedLanguage} k="resolvedGrievances">Resolved Grievances</T>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">14,295</div>
            <div className="text-[10px] text-slate-500 mt-0.5">94.2% Resolution rate</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-orange-50 text-[#e38c2d] rounded-lg border border-orange-100">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              <T lang={selectedLanguage} k="sanctionedFunds">Sanctioned Funds (Lakhs)</T>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">₹4,850.0</div>
            <div className="text-[10px] text-orange-600 font-semibold mt-0.5">Total MP Sanctioned</div>
          </div>
        </div>
      </div>

      {/* Live scrollable national notification alert ticker */}
      <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-lg p-3 flex items-center gap-3 overflow-hidden shadow-sm">
        <span className="flex-shrink-0 bg-[#e38c2d] text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded">
          <T lang={selectedLanguage} k="tickerTitle">Gov Alert Ticker</T>
        </span>
        <div className="marquee text-xs text-amber-900 font-medium leading-normal">
          <T lang={selectedLanguage} k="tickerBody">Note: Under NIC guidelines, all Members of Parliament must utilize official @sansad.nic.in credentials linked to their Kavach MFA application. Citizen grievances require 10-digit authentic phone validation.</T>
        </div>
      </div>

      {/* Grid of details, info cards and portal rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#002147] flex items-center gap-2 uppercase tracking-wide border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-[#e38c2d]" />
            <span><T lang={selectedLanguage} k="howItWorks">How It Works: Integrated Administrative Framework</T></span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-55/30 border border-slate-200 rounded-lg space-y-2">
              <div className="font-bold text-[#002147] flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <span className="bg-[#002147] text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px]">1</span>
                <span><T lang={selectedLanguage} k="step1Title">Citizen Voice</T></span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                <T lang={selectedLanguage} k="step1Desc">Citizens submit infrastructural challenges via textual description, audio recordings (with automated AI transcribing), or geotagged media.</T>
              </p>
            </div>

            <div className="p-4 bg-slate-55/30 border border-slate-200 rounded-lg space-y-2">
              <div className="font-bold text-[#002147] flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <span className="bg-[#002147] text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px]">2</span>
                <span><T lang={selectedLanguage} k="step2Title">Gemini API Scoring</T></span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                <T lang={selectedLanguage} k="step2Desc">Gemini classifies proposals, parses keywords, assesses national census indexes and maps urgency ratings into an AI priority score.</T>
              </p>
            </div>

            <div className="p-4 bg-slate-55/30 border border-slate-200 rounded-lg space-y-2">
              <div className="font-bold text-[#002147] flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <span className="bg-[#002147] text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px]">3</span>
                <span><T lang={selectedLanguage} k="step3Title">MP Fund Sanction</T></span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                <T lang={selectedLanguage} k="step3Desc">Hon'ble MPs review highly-prioritized proposals, allocate MPLADS funds securely via verified digital Kavach authorization.</T>
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <h4 className="text-sm font-bold text-[#002147] uppercase tracking-wider text-[11px]">
              <T lang={selectedLanguage} k="recentClearances">Recent Development Clearances (MoSPI Dashboard)</T>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-green-50/50 border border-green-100 rounded-md">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-green-600" />
                  <span className="font-semibold text-slate-800">Chennai - NH Lamp Deployment</span>
                </div>
                <span className="text-green-700 font-bold">₹8.0 Lakhs Sanctioned</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-md">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">Gautam Buddha Nagar - Minor Bypass Bridge</span>
                </div>
                <span className="text-[#e38c2d] font-semibold">Awaiting Prioritisation Audit</span>
              </div>
            </div>
          </div>
        </div>

        {/* CPGRAMS & MPLADS Official Guidelines Sidebar */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2.5">
            <HelpCircle className="w-4 h-4 text-[#e38c2d]" />
            <span>NIC Administrative Directives</span>
          </h3>
          
          <div className="space-y-3 text-slate-600 leading-relaxed">
            <div className="space-y-1">
              <div className="font-bold text-slate-800">1. Citizen Resident Validation</div>
              <p>CPGRAMS guidelines require validating grievance inputs. Spammers are subject to penal system action. OTP code validation ensures trace capability.</p>
            </div>
            
            <div className="space-y-1">
              <div className="font-bold text-slate-800">2. Official Domain Restrictions</div>
              <p>Official dashboards are restricted strictly to <strong>@sansad.nic.in</strong> and <strong>@gov.in</strong> email profiles. Any other attempts are flagged under cybersecurity directives.</p>
            </div>
            
            <div className="space-y-1">
              <div className="font-bold text-slate-800">3. Formula Weight Adjustments</div>
              <p>Prioritisation algorithm weights can only be modified by authorized Ministry administrators with clear audit logs captured instantly.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center">
            Supported by National Informatics Centre (NIC) • 2026 Digital India Initiative
          </div>
        </div>
      </div>
    </div>
  );
}
