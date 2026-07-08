import React, { useState, useEffect } from "react";
import { Project, RegionalDataset } from "../types";
import { Landmark, FileSpreadsheet, MapPin, BarChart3, TrendingUp, Compass, ThermometerSun, Wind, Percent } from "lucide-react";

import { T } from "../languagesData";

interface MpDashboardPageProps {
  mpSession: { name: string; email: string } | null;
  projects: Project[];
  selectedLanguage: string;
}

export default function MpDashboardPage({ mpSession, projects, selectedLanguage }: MpDashboardPageProps) {
  const [datasets, setDatasets] = useState<Record<string, RegionalDataset>>({});
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Gautam Buddha Nagar, UP");

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const res = await fetch("/api/datasets");
      const data = await res.json();
      if (data.datasets) {
        setDatasets(data.datasets);
      }
    } catch (err) {
      console.error("Failed to fetch regional datasets", err);
    }
  };

  // Group projects by category
  const categoryCounts = projects.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  // Group projects by location
  const locationCounts = projects.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.location] = (acc[curr.location] || 0) + 1;
    return acc;
  }, {});

  // General macro calculations
  const totalCount = projects.length;
  const sanctionedProjects = projects.filter((p) => p.status === "Sanctioned");
  const budgetSanctioned = sanctionedProjects.reduce((acc, curr) => acc + (curr.sanctionedAmount || curr.estimatedCost), 0);
  const pendingCount = projects.filter((p) => p.status === "Pending Prioritization").length;

  const currentDataset = datasets[selectedDistrict] || {
    censusIndex: 0.65,
    humidity: "60%",
    aqi: 120,
    rainfallMm: 800,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans text-slate-800" id="mp-dashboard-view">
      {/* Welcome MP banner */}
      <div className="bg-[#002147] text-white rounded-xl p-6 border-b-4 border-[#e38c2d] shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F4C430] uppercase tracking-wide font-display">MoSPI MP Allocation Control Center</h2>
          <p className="text-xs text-white/80 mt-1">
            Signed in: {mpSession ? mpSession.name : "Guest Official"} • Secure token login established
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-[#e38c2d] text-white px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
            MPLADS Scheme Live
          </span>
          <span className="bg-white/10 text-white border border-white/10 px-3 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
            District Cluster: NORTH-ZONE-1
          </span>
        </div>
      </div>

      {/* Grid of macro parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md transition-shadow">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Proposals Mapped</div>
          <div className="text-2xl font-black text-[#002147]">{totalCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Synced with regional telemetry</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md transition-shadow">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Sanctioned Projects</div>
          <div className="text-2xl font-black text-green-600">{sanctionedProjects.length}</div>
          <p className="text-[10px] text-slate-400 font-medium">Funds dispatched securely</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md transition-shadow">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Pending Allocation Clearance</div>
          <div className="text-2xl font-black text-amber-600">{pendingCount}</div>
          <p className="text-[10px] text-slate-400 font-medium">Requires prioritization review</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md transition-shadow">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">MPLADS Budget Invested</div>
          <div className="text-2xl font-black text-[#e38c2d]">₹{budgetSanctioned.toFixed(1)} Lakhs</div>
          <p className="text-[10px] text-slate-400 font-medium">Cap: ₹500 Lakhs annually (standard)</p>
        </div>
      </div>

      {/* Heatmap Section & AI Categorization Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* District Demand Heatmap and SVG representation */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-[#e38c2d]" />
              <span>Public Demand Regional Heatmap</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Hover and select active district hubs</span>
          </div>

          {/* SVG district matrix representing regions relative demands */}
          <div className="bg-[#001731] rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[300px] border border-slate-800">
            <div className="absolute top-2 left-2 text-[10px] text-white/50 font-mono tracking-wider">NIC GEOSPATIAL HEAT MAP MODEL</div>
            
            <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto">
              {/* Path and circular blobs representing regional state zones */}
              {/* Patna, Bihar */}
              <circle
                cx="120"
                cy="140"
                r="30"
                className={`transition-all cursor-pointer stroke-2 ${
                  selectedDistrict === "Patna, Bihar" ? "fill-[#e38c2d] stroke-white scale-110" : "fill-[#e38c2d]/40 stroke-[#e38c2d]"
                }`}
                onClick={() => setSelectedDistrict("Patna, Bihar")}
              />
              <text x="120" y="143" textAnchor="middle" className="fill-white text-[9px] font-bold font-sans pointer-events-none">
                Patna ({locationCounts["Patna, Bihar"] || 0})
              </text>

              {/* Gautam Buddha Nagar, UP */}
              <circle
                cx="80"
                cy="80"
                r="35"
                className={`transition-all cursor-pointer stroke-2 ${
                  selectedDistrict === "Gautam Buddha Nagar, UP" ? "fill-red-500 stroke-white scale-110" : "fill-red-500/40 stroke-red-500"
                }`}
                onClick={() => setSelectedDistrict("Gautam Buddha Nagar, UP")}
              />
              <text x="80" y="83" textAnchor="middle" className="fill-white text-[9px] font-bold font-sans pointer-events-none">
                G.B. Nagar ({locationCounts["Gautam Buddha Nagar, UP"] || 0})
              </text>

              {/* Chennai, Tamil Nadu */}
              <circle
                cx="160"
                cy="220"
                r="32"
                className={`transition-all cursor-pointer stroke-2 ${
                  selectedDistrict === "Chennai, Tamil Nadu" ? "fill-green-500 stroke-white scale-110" : "fill-green-500/40 stroke-green-500"
                }`}
                onClick={() => setSelectedDistrict("Chennai, Tamil Nadu")}
              />
              <text x="160" y="223" textAnchor="middle" className="fill-white text-[9px] font-bold font-sans pointer-events-none">
                Chennai ({locationCounts["Chennai, Tamil Nadu"] || 0})
              </text>

              {/* Pune, Maharashtra */}
              <circle
                cx="60"
                cy="200"
                r="28"
                className={`transition-all cursor-pointer stroke-2 ${
                  selectedDistrict === "Pune, Maharashtra" ? "fill-purple-500 stroke-white scale-110" : "fill-purple-500/40 stroke-purple-500"
                }`}
                onClick={() => setSelectedDistrict("Pune, Maharashtra")}
              />
              <text x="60" y="203" textAnchor="middle" className="fill-white text-[9px] font-bold font-sans pointer-events-none">
                Pune ({locationCounts["Pune, Maharashtra"] || 0})
              </text>

              {/* North Delhi, Delhi */}
              <circle
                cx="150"
                cy="70"
                r="26"
                className={`transition-all cursor-pointer stroke-2 ${
                  selectedDistrict === "North Delhi, Delhi" ? "fill-blue-500 stroke-white scale-110" : "fill-blue-500/40 stroke-blue-500"
                }`}
                onClick={() => setSelectedDistrict("North Delhi, Delhi")}
              />
              <text x="150" y="73" textAnchor="middle" className="fill-white text-[9px] font-bold font-sans pointer-events-none">
                Delhi ({locationCounts["North Delhi, Delhi"] || 0})
              </text>
            </svg>

            {/* Micro details panel under map */}
            <div className="w-full text-center text-xs text-white/75 mt-2 font-medium">
              Selected Hub for telemetry analysis: <span className="text-[#F4C430] font-bold">{selectedDistrict}</span>
            </div>
          </div>
        </div>

        {/* AI Categorized counts and External Datasets (Right side) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Categorized count blocks */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4.5 h-4.5 text-[#e38c2d]" />
              <span>AI Category Cluster Distribution</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {Object.keys(categoryCounts).length === 0 ? (
                <div className="text-center py-4 text-slate-400">Loading categorization distribution...</div>
              ) : (
                Object.entries(categoryCounts).map(([cat, count]) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                      <span>{cat}</span>
                      <span className="text-slate-500 bg-slate-100 px-1.5 rounded">{count} Projects</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#002147]"
                        style={{ width: `${Math.min(100, (count / totalCount) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Regional Government Datasets telemetry display */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4.5 h-4.5 text-[#e38c2d]" />
              <span>Open Public Data Telemetry: {selectedDistrict}</span>
            </h3>
            
            <p className="text-[11px] text-slate-500">
              Direct real-time parameters imported from data.gov.in, IMD Weather, and CPCB Air Quality Index dashboards to calculate prioritisation multipliers.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 bg-white rounded-lg border border-slate-150 space-y-1.5">
                <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
                  <Percent className="w-3 h-3 text-blue-500" />
                  <span>Census Index</span>
                </div>
                <div className="text-base font-black text-slate-900">{currentDataset.censusIndex}</div>
                <p className="text-[9px] text-slate-400">Lower implies backwards index</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-150 space-y-1.5">
                <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
                  <Wind className="w-3 h-3 text-teal-500" />
                  <span>CPCB AQI</span>
                </div>
                <div className="text-base font-black text-slate-900">{currentDataset.aqi}</div>
                <p className="text-[9px] text-slate-400">Air quality monitoring level</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-150 space-y-1.5">
                <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
                  <ThermometerSun className="w-3 h-3 text-orange-500" />
                  <span>IMD Humidity</span>
                </div>
                <div className="text-base font-black text-slate-900">{currentDataset.humidity}</div>
                <p className="text-[9px] text-slate-400">Climatology sensor check</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-150 space-y-1.5">
                <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>Annual Rainfall</span>
                </div>
                <div className="text-base font-black text-slate-900">{currentDataset.rainfallMm} mm</div>
                <p className="text-[9px] text-slate-400">Meteorological validation</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
