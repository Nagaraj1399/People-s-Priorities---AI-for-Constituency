import React from "react";
import { ActiveTab, LanguageCode } from "../types";
import { useTranslation } from "../languagesData";
import { ShieldCheck, User, Landmark, ShieldAlert, ArrowRight } from "lucide-react";

interface GatewaySelectionPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  selectedLanguage: LanguageCode;
}

export default function GatewaySelectionPage({ setActiveTab, selectedLanguage }: GatewaySelectionPageProps) {
  const gatewayTitle = useTranslation("gatewayTitle", "NIC Secured Gateway Selector • Kavach SSO Enforced", selectedLanguage);
  const mainHeading = useTranslation("mainHeading", "National Citizen Redressal & Project Prioritisation Portal", selectedLanguage);
  const welcomeDesc = useTranslation("welcomeDesc", "Welcome to the unified digital administration portal of the Government of India. In accordance with national cyber security directives, all public records and administrative metrics require identity authorization.", selectedLanguage);
  
  const citizenGateTitle = useTranslation("citizenGateTitle", "CPGRAMS Citizen Gate", selectedLanguage);
  const citizenGateSub = useTranslation("citizenGateSub", "Public Redressal Node", selectedLanguage);
  const citizenGateDesc = useTranslation("citizenGateDesc", "Dedicated gateway for residents of India to voice community grievances, upload geotagged photo evidence, record verbal suggestion requests, and track municipal resolution progress.", selectedLanguage);
  const citizenGateBtn = useTranslation("citizenGateBtn", "Authenticate Citizen Access", selectedLanguage);
  const citizenBullet1 = useTranslation("citizenGateBullet1", "Lodge local infrastructure, road, and water issues", selectedLanguage);
  const citizenBullet2 = useTranslation("citizenGateBullet2", "MFA Mobile OTP-secured identity verification", selectedLanguage);
  const citizenBullet3 = useTranslation("citizenGateBullet3", "Dynamic tracking of national scoring prioritisation", selectedLanguage);

  const mpGateTitle = useTranslation("mpGateTitle", "MoSPI Hon'ble MP Gate", selectedLanguage);
  const mpGateSub = useTranslation("mpGateSub", "Secured Administrative Node", selectedLanguage);
  const mpGateDesc = useTranslation("mpGateDesc", "Restricted portal for Members of Parliament and Ministry of Statistics & Programme Implementation (MoSPI) officers to review citizen inputs, set weight formulas, and sanction funds.", selectedLanguage);
  const mpGateBtn = useTranslation("mpGateBtn", "Official MP Secure Login", selectedLanguage);
  const mpBullet1 = useTranslation("mpGateBullet1", "Sanction municipal budgets via official MPLADS scheme", selectedLanguage);
  const mpBullet2 = useTranslation("mpGateBullet2", "Kavach Multi-Factor Authentication & QR Sync", selectedLanguage);
  const mpBullet3 = useTranslation("mpGateBullet3", "Configure priority formula weights for regional demands", selectedLanguage);

  const securityAdvisory = useTranslation("securityAdvisory", "CYBERSECURITY ADVISORY (IT ACT SEC 66-F)", selectedLanguage);
  const securityAdvisoryDesc = useTranslation("securityAdvisoryDesc", "Access to this system is monitored. Any unauthorized attempts to bypass, intercept or falsify credentials on either the Citizen or MP portal gates will be logged with trace IP and reported directly to the Cyber Crime Investigation Cell (CERT-In).", selectedLanguage);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans text-slate-800" id="gateway-selection-view">
      {/* Top Header Logo Banner */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#002147]/5 border border-[#002147]/10 text-xs font-semibold text-[#002147]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>{gatewayTitle}</span>
        </div>
        <h2 className="text-2xl sm:text-3.5xl font-black text-[#002147] uppercase tracking-wide font-display">
          {mainHeading}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {welcomeDesc}
        </p>
      </div>

      {/* Main Dual Gate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* CITIZEN GATE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
          <div className="h-2 w-full bg-[#e38c2d]"></div>
          <div className="p-6 sm:p-8 space-y-6 flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#e38c2d] group-hover:scale-105 transition-transform duration-300">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                  {citizenGateTitle}
                </h3>
                <p className="text-xs text-[#e38c2d] font-semibold uppercase font-mono tracking-wider">
                  {citizenGateSub}
                </p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {citizenGateDesc}
              </p>
              
              <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>{citizenBullet1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>{citizenBullet2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>{citizenBullet3}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab("citizen-auth")}
              className="w-full mt-6 py-3 bg-[#e38c2d] hover:bg-[#d17b1d] text-white font-bold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all duration-200 group-hover:translate-y-[-2px]"
              id="gateway-citizen-btn"
            >
              <span>{citizenGateBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MP ADMINISTRATIVE GATE */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group text-white">
          <div className="h-2 w-full bg-[#002147]"></div>
          <div className="p-6 sm:p-8 space-y-6 flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#002147] border border-slate-800 flex items-center justify-center text-[#F4C430] group-hover:scale-105 transition-transform duration-300">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  {mpGateTitle}
                </h3>
                <p className="text-xs text-amber-400 font-semibold uppercase font-mono tracking-wider">
                  {mpGateSub}
                </p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {mpGateDesc}
              </p>
              
              <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  <span>{mpBullet1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  <span>{mpBullet2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  <span>{mpBullet3}</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab("mp-auth")}
              className="w-full mt-6 py-3 bg-[#002147] hover:bg-[#001731] border border-white/10 text-white font-bold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all duration-200 group-hover:translate-y-[-2px]"
              id="gateway-mp-btn"
            >
              <span>{mpGateBtn}</span>
              <span className="text-[10px] text-amber-400">🔒</span>
            </button>
          </div>
        </div>

      </div>

      {/* Cyber Security Warning Banner */}
      <div className="mt-12 bg-red-50 border-l-4 border-red-500 p-4.5 rounded-r-lg text-xs text-red-900 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-red-950 uppercase tracking-wide">
          <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
          <span>{securityAdvisory}</span>
        </div>
        <p className="leading-relaxed text-slate-700">
          {securityAdvisoryDesc}
        </p>
        <p className="font-mono text-[10px] text-slate-500 pt-1">
          Trace Client Parameters: IP=164.100.23.11 • ISP=NIC-NET Delhi Central Node • Cipher=TLS_AES_256_GCM
        </p>
      </div>
    </div>
  );
}
