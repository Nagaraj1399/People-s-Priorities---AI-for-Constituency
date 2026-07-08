import React, { useState, useEffect } from "react";
import { ActiveTab, LanguageCode, Project, Grievance } from "./types";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import CitizenAuthPage from "./components/CitizenAuthPage";
import CitizenGrievancePage from "./components/CitizenGrievancePage";
import MpAuthPage from "./components/MpAuthPage";
import MpDashboardPage from "./components/MpDashboardPage";
import LogicConfigPage from "./components/LogicConfigPage";
import ProjectPrioritizationPage from "./components/ProjectPrioritizationPage";
import RegionalHeatmapPage from "./components/RegionalHeatmapPage";
import GatewaySelectionPage from "./components/GatewaySelectionPage";
import { AnimatePresence, motion } from "motion/react";
import { getTranslation, useTranslation } from "./languagesData";


export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("landing");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("cgrams_selected_language");
    return (saved as LanguageCode) || "en";
  });

  const footerRegistryTrans = useTranslation("footerRegistry", "National Informatics Centre (NIC) Portal Registry", selectedLanguage);
  const footerDesignTrans = useTranslation("footerDesign", "Designed & developed for the Ministry of Statistics and Programme Implementation (MoSPI), Government of India.", selectedLanguage);
  const footerRightsTrans = useTranslation("footerRights", "© 2026 Digital India Initiative. All Rights Reserved.", selectedLanguage);
  const footerPlatformTrans = useTranslation("footerPlatform", "Built by CloudSentinels team", selectedLanguage);

  const handleSetSelectedLanguage = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    localStorage.setItem("cgrams_selected_language", lang);
  };

  const [citizenSession, setCitizenSession] = useState<{ name: string; phone: string; email: string } | null>(() => {
    const saved = localStorage.getItem("cgrams_citizen_session");
    return saved ? JSON.parse(saved) : null;
  });
  const [mpSession, setMpSession] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem("cgrams_mp_session");
    return saved ? JSON.parse(saved) : null;
  });

  const handleSetCitizenSession = (session: { name: string; phone: string; email: string } | null) => {
    setCitizenSession(session);
    if (session) {
      localStorage.setItem("cgrams_citizen_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("cgrams_citizen_session");
    }
  };

  const handleSetMpSession = (session: { name: string; email: string } | null) => {
    setMpSession(session);
    if (session) {
      localStorage.setItem("cgrams_mp_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("cgrams_mp_session");
    }
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  useEffect(() => {
    fetchActiveProposals();
    fetchActiveGrievances();
  }, []);

  const fetchActiveProposals = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to load official projects", err);
    }
  };

  const fetchActiveGrievances = async () => {
    try {
      const res = await fetch("/api/grievances");
      const data = await res.json();
      if (data.grievances) {
        setGrievances(data.grievances);
      }
    } catch (err) {
      console.error("Failed to load grievances", err);
    }
  };

  const handleWeightsUpdated = () => {
    fetchActiveProposals();
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-slate-950 ${activeTab === "mp-auth" ? "bg-slate-950" : "bg-slate-50"}`}>
      
      {/* 22-Language Aware NIC Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={handleSetSelectedLanguage}
        citizenSession={citizenSession}
        setCitizenSession={handleSetCitizenSession}
        mpSession={mpSession}
        setMpSession={handleSetMpSession}
      />

      {/* Main Content Layout with motion route transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            {!(citizenSession || mpSession) ? (
              // Secure Routing Guard: When unauthenticated, only separate auth is allowed, else show GatewaySelection
              activeTab === "citizen-auth" ? (
                <CitizenAuthPage
                  setActiveTab={setActiveTab}
                  setCitizenSession={handleSetCitizenSession}
                  selectedLanguage={selectedLanguage}
                />
              ) : activeTab === "mp-auth" ? (
                <MpAuthPage
                  setActiveTab={setActiveTab}
                  setMpSession={handleSetMpSession}
                  selectedLanguage={selectedLanguage}
                />
              ) : (
                <GatewaySelectionPage
                  setActiveTab={setActiveTab}
                  selectedLanguage={selectedLanguage}
                />
              )
            ) : (
              // Unlocked Routing: When authenticated
              <>
                {activeTab === "landing" && (
                  <LandingPage
                    setActiveTab={setActiveTab}
                    selectedLanguage={selectedLanguage}
                    grievanceCount={grievances.length}
                    projectCount={projects.length}
                  />
                )}

                {activeTab === "citizen-auth" && (
                  <CitizenAuthPage
                    setActiveTab={setActiveTab}
                    setCitizenSession={handleSetCitizenSession}
                    selectedLanguage={selectedLanguage}
                  />
                )}

                {activeTab === "citizen-grievance" && (
                  <CitizenGrievancePage
                    citizenSession={citizenSession}
                    setCitizenSession={handleSetCitizenSession}
                    selectedLanguage={selectedLanguage}
                    onGrievanceSubmitted={fetchActiveGrievances}
                  />
                )}

                {activeTab === "regional-heatmap" && (
                  <RegionalHeatmapPage
                    grievances={grievances}
                    projects={projects}
                    setActiveTab={setActiveTab}
                    selectedLanguage={selectedLanguage}
                  />
                )}

                {activeTab === "mp-auth" && (
                  <MpAuthPage
                    setActiveTab={setActiveTab}
                    setMpSession={handleSetMpSession}
                    selectedLanguage={selectedLanguage}
                  />
                )}

                {activeTab === "mp-dashboard" && (
                  <MpDashboardPage
                    mpSession={mpSession}
                    projects={projects}
                    selectedLanguage={selectedLanguage}
                  />
                )}

                {activeTab === "logic-config" && (
                  <LogicConfigPage
                    mpSession={mpSession}
                    onWeightsUpdated={handleWeightsUpdated}
                    selectedLanguage={selectedLanguage}
                  />
                )}

                {activeTab === "project-prioritization" && (
                  <ProjectPrioritizationPage
                    mpSession={mpSession}
                    projects={projects}
                    fetchProjects={fetchActiveProposals}
                    selectedLanguage={selectedLanguage}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Official Symmetrical Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="text-slate-400 font-semibold tracking-wide">{footerRegistryTrans}</p>
          <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">{footerDesignTrans}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 pt-2 border-t border-slate-900/60 text-[10px] text-slate-600">
            <p>{footerRightsTrans}</p>
            <p className="hidden sm:block text-slate-800">•</p>
            <p className="uppercase tracking-wider font-mono text-[#F4C430]/70">{footerPlatformTrans}</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
