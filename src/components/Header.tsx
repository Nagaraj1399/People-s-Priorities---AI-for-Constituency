import React, { useState, useEffect } from "react";
import { ActiveTab, LanguageCode } from "../types";
import { OFFICIAL_LANGUAGES, getTranslation, useTranslation, T } from "../languagesData";
import { Globe, Clock, ShieldCheck, User, Landmark, Settings, CheckSquare } from "lucide-react";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedLanguage: LanguageCode;
  setSelectedLanguage: (lang: LanguageCode) => void;
  citizenSession: { name: string; phone: string } | null;
  setCitizenSession: (session: null) => void;
  mpSession: { name: string; email: string } | null;
  setMpSession: (session: null) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  selectedLanguage,
  setSelectedLanguage,
  citizenSession,
  setCitizenSession,
  mpSession,
  setMpSession,
}: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const portalNameTrans = useTranslation("portalName", "National Citizen Redressal & Project Prioritisation Portal", selectedLanguage);
  const ministryTrans = useTranslation("ministry", "Ministry of Statistics, Programme Implementation & National Informatics Centre", selectedLanguage);
  const taglineTrans = useTranslation("tagline", "Satyamev Jayate • Transparent Administration for Citizen Prosperity", selectedLanguage);
  const navOverviewTrans = useTranslation("navOverview", "1. Overview", selectedLanguage);
  const navCitizenAccessTrans = useTranslation("navCitizenAccess", "2. Citizen Access", selectedLanguage);
  const navSubmitGrievanceTrans = useTranslation("navSubmitGrievance", "3. Submit Grievance", selectedLanguage);
  const navHeatmapTrans = useTranslation("navHeatmap", "4. Regional Heatmap", selectedLanguage);
  const navMpHeatmapTrans = useTranslation("navMpHeatmap", "2. Regional Heatmap", selectedLanguage);
  const navMpDashboardTrans = useTranslation("navMpDashboard", "3. MP Dashboard", selectedLanguage);
  const navFormulaTrans = useTranslation("navFormula", "4. Formula Settings", selectedLanguage);
  const navPrioritizeTrans = useTranslation("navPrioritize", "5. Prioritize & Sanction", selectedLanguage);
  const navMpLoginTrans = useTranslation("navMpLogin", "Hon'ble MP Login (Kavach Gateway)", selectedLanguage);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogoutCitizen = () => {
    setCitizenSession(null);
    setActiveTab("landing");
  };

  const handleLogoutMp = () => {
    setMpSession(null);
    setActiveTab("landing");
  };

  const currentLangObj = OFFICIAL_LANGUAGES.find((l) => l.code === selectedLanguage) || OFFICIAL_LANGUAGES[0];

  return (
    <header className="w-full bg-[#002147] border-b-4 border-[#F4C430] text-white font-sans text-xs" id="gov-header">
      {/* Top micro-bar for Tricolor accent and Indian Gov metadata */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Ministry title with Satyamev Jayate placeholder */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab("landing")}>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-md border border-slate-200">
            <div className="w-full h-full border-2 border-slate-100 rounded-full flex flex-col items-center justify-center text-[7px] font-black text-[#002147] text-center leading-none">
              <span><T lang={selectedLanguage} k="govtOf">GOVT OF</T></span>
              <span className="font-sans font-bold text-[9px] text-[#e38c2d]"><T lang={selectedLanguage} k="india">INDIA</T></span>
            </div>
          </div>
          <div className="leading-tight border-l border-white/20 pl-4">
            <h1 className="text-sm font-bold uppercase tracking-wider text-white">
              {portalNameTrans}
            </h1>
            <p className="text-xs text-white/80 font-medium">
              {ministryTrans}
            </p>
            <p className="text-[10px] text-white/60 italic mt-0.5">
              {taglineTrans}
            </p>
          </div>
        </div>

        {/* Right widgets: Clock, Language Selector, Session Badges */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Live Indian Standard Time (IST) Clock */}
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded text-xs font-medium border border-white/10 text-white">
            <Clock className="w-3.5 h-3.5 text-[#F4C430]" />
            <span className="font-mono text-xs">{time.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST</span>
          </div>

          {/* 22 Official Languages Selector Select Box */}
          <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded text-xs font-medium border border-white/10 transition-colors focus-within:ring-1 focus-within:ring-[#F4C430]">
            <Globe className="w-3.5 h-3.5 text-[#F4C430] shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-white focus:outline-none cursor-pointer py-0.5 font-medium border-none"
              id="language-select-box"
            >
              {OFFICIAL_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#002147] text-white">
                  {lang.nativeName} ({lang.englishName})
                </option>
              ))}
            </select>
          </div>

          {/* Citizen Session */}
          {citizenSession && (
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 px-3 py-1 rounded text-xs">
              <User className="w-3.5 h-3.5 text-green-400" />
              <div className="text-white/90 font-medium">
                <T lang={selectedLanguage} k="citizenLabel">Citizen</T>: <span className="text-green-300 font-semibold">{citizenSession.name}</span>
              </div>
              <button
                onClick={handleLogoutCitizen}
                className="text-white/60 hover:text-red-400 font-semibold underline text-[10px] ml-1.5 cursor-pointer"
              >
                <T lang={selectedLanguage} k="logoutLabel">Logout</T>
              </button>
            </div>
          )}

          {/* MP Session */}
          {mpSession && (
            <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 px-3 py-1 rounded text-xs">
              <Landmark className="w-3.5 h-3.5 text-orange-400" />
              <div className="text-white/90 font-medium">
                <T lang={selectedLanguage} k="mpLabel">Hon'ble MP</T>: <span className="text-orange-300 font-semibold">{mpSession.name}</span>
              </div>
              <button
                onClick={handleLogoutMp}
                className="text-white/60 hover:text-red-400 font-semibold underline text-[10px] ml-1.5 cursor-pointer"
              >
                <T lang={selectedLanguage} k="logoutLabel">Logout</T>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main navigation menu for the pages, restricted dynamically based on MP session status */}
      {activeTab === "mp-auth" ? (
        <div className="bg-[#001026] border-t border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between" id="navigation-tabs-locked">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-500 animate-pulse" />
            <span><T lang={selectedLanguage} k="govSecureLock">NIC GOVERNMENT SECURED INTRANET NODE — SSL 256-BIT SESSION LOCK</T></span>
          </div>
          <button
            onClick={() => setActiveTab("landing")}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded text-xs transition-all cursor-pointer border border-white/20 flex items-center gap-1.5 uppercase tracking-wide"
          >
            <span>← <T lang={selectedLanguage} k="exitGateway">Exit to Gateway Selector</T></span>
          </button>
        </div>
      ) : !(citizenSession || mpSession) ? (
        <div className="bg-[#001026] border-t border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between animate-fade-in" id="navigation-tabs-locked">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#F4C430] animate-pulse" />
            <span className="tracking-wide text-[11px]"><T lang={selectedLanguage} k="portalLockEnforced">NIC PORTAL LOCK — SEPARATE PUBLIC & MP ADMINISTRATIVE GATEWAYS ENFORCED</T></span>
          </div>
          {activeTab !== "landing" && (
            <button
              onClick={() => setActiveTab("landing")}
              className="px-3 py-1 bg-white/10 hover:bg-white/15 text-white/90 hover:text-white font-bold rounded text-xs transition-all cursor-pointer border border-white/20 flex items-center gap-1 uppercase tracking-wide"
            >
              <span>← <T lang={selectedLanguage} k="gatewaySelectorBtn">Gateway Selector</T></span>
            </button>
          )}
        </div>
      ) : (
        <nav className="bg-[#001731] border-t border-white/10 px-4 sm:px-6 py-2" id="navigation-tabs">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-1.5 text-xs font-semibold items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveTab("landing")}
                className={`px-3.5 py-2 rounded font-medium transition-all cursor-pointer ${
                  activeTab === "landing"
                    ? "bg-[#F4C430] text-[#002147] shadow-sm font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
                id="tab-landing"
              >
                {navOverviewTrans}
              </button>

              {!mpSession && (
                <>
                  <button
                    onClick={() => setActiveTab("citizen-auth")}
                    className={`px-3.5 py-2 rounded font-medium transition-all cursor-pointer ${
                      activeTab === "citizen-auth"
                        ? "bg-[#F4C430] text-[#002147] shadow-sm font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    id="tab-citizen-auth"
                  >
                    {navCitizenAccessTrans}
                  </button>

                  <button
                    onClick={() => setActiveTab("citizen-grievance")}
                    className={`px-3.5 py-2 rounded font-medium transition-all cursor-pointer ${
                      activeTab === "citizen-grievance"
                        ? "bg-[#F4C430] text-[#002147] shadow-sm font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    id="tab-citizen-grievance"
                  >
                    {navSubmitGrievanceTrans}
                  </button>
                </>
              )}

              <button
                onClick={() => setActiveTab("regional-heatmap")}
                className={`px-3.5 py-2 rounded font-medium transition-all cursor-pointer ${
                  activeTab === "regional-heatmap"
                    ? "bg-[#F4C430] text-[#002147] shadow-sm font-bold"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
                id="tab-regional-heatmap"
              >
                {mpSession ? navMpHeatmapTrans : navHeatmapTrans}
              </button>

              {mpSession && (
                <>
                  <button
                    onClick={() => setActiveTab("mp-dashboard")}
                    className={`px-3.5 py-2 rounded font-medium transition-all cursor-pointer ${
                      activeTab === "mp-dashboard"
                        ? "bg-[#F4C430] text-[#002147] shadow-sm font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    id="tab-mp-dashboard"
                  >
                    {navMpDashboardTrans}
                  </button>

                  <button
                    onClick={() => setActiveTab("logic-config")}
                    className={`px-3.5 py-2 rounded font-medium transition-all cursor-pointer ${
                      activeTab === "logic-config"
                        ? "bg-[#F4C430] text-[#002147] shadow-sm font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    id="tab-logic-config"
                  >
                    {navFormulaTrans}
                  </button>

                  <button
                    onClick={() => setActiveTab("project-prioritization")}
                    className={`px-3.5 py-2 rounded font-medium transition-all cursor-pointer ${
                      activeTab === "project-prioritization"
                        ? "bg-[#F4C430] text-[#002147] shadow-sm font-bold"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                    id="tab-project-prioritization"
                  >
                    {navPrioritizeTrans}
                  </button>
                </>
              )}
            </div>

            {!mpSession && (
              <button
                onClick={() => setActiveTab("mp-auth")}
                className="px-3.5 py-2 rounded font-bold bg-[#e38c2d] hover:bg-[#d17b1d] text-white transition-all cursor-pointer shadow flex items-center gap-1.5 uppercase tracking-wider text-[10.5px]"
                id="tab-mp-auth"
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>{navMpLoginTrans}</span>
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
