import React, { useState, useMemo } from "react";
import { Grievance, Project, RegionalDataset } from "../types";
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Users,
  Filter,
  Layers,
  ThermometerSun,
  Wind,
  Droplets,
  Calendar,
  User,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { T } from "../languagesData";

interface RegionalHeatmapPageProps {
  grievances: Grievance[];
  projects: Project[];
  setActiveTab?: (tab: any) => void;
  selectedLanguage: string;
}

// In-memory regional data parameters for environmental stress layers
const REGIONAL_METRICS: Record<string, { censusIndex: number; humidity: string; aqi: number; rainfallMm: number; stateName: string }> = {
  "North Delhi, Delhi": { censusIndex: 0.85, humidity: "50%", aqi: 245, rainfallMm: 700, stateName: "Delhi NCR" },
  "Gautam Buddha Nagar, UP": { censusIndex: 0.72, humidity: "65%", aqi: 185, rainfallMm: 850, stateName: "Uttar Pradesh" },
  "Patna, Bihar": { censusIndex: 0.45, humidity: "78%", aqi: 142, rainfallMm: 1100, stateName: "Bihar" },
  "Chennai, Tamil Nadu": { censusIndex: 0.81, humidity: "85%", aqi: 62, rainfallMm: 1400, stateName: "Tamil Nadu" },
  "Pune, Maharashtra": { censusIndex: 0.79, humidity: "62%", aqi: 88, rainfallMm: 950, stateName: "Maharashtra" },
  "Guwahati, Assam": { censusIndex: 0.58, humidity: "90%", aqi: 55, rainfallMm: 1800, stateName: "Assam" },
  "Anantapur, Andhra Pradesh": { censusIndex: 0.52, humidity: "45%", aqi: 75, rainfallMm: 550, stateName: "Andhra Pradesh" },
};

// SVG positions for the 7 locations on a simplified styled map grid of India
const MAP_LOCATIONS = [
  { name: "North Delhi, Delhi", x: 150, y: 80, color: "rose" },
  { name: "Gautam Buddha Nagar, UP", x: 175, y: 95, color: "orange" },
  { name: "Patna, Bihar", x: 235, y: 115, color: "amber" },
  { name: "Guwahati, Assam", x: 310, y: 110, color: "teal" },
  { name: "Pune, Maharashtra", x: 115, y: 195, color: "violet" },
  { name: "Anantapur, Andhra Pradesh", x: 145, y: 235, color: "sky" },
  { name: "Chennai, Tamil Nadu", x: 165, y: 255, color: "emerald" },
];

export default function RegionalHeatmapPage({ grievances, projects, setActiveTab, selectedLanguage }: RegionalHeatmapPageProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>("North Delhi, Delhi");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [heatmapMetric, setHeatmapMetric] = useState<"count" | "priority" | "census">("count");

  // Get unique categories for filter
  const categoriesList = ["All", "Road & Transport", "Water & Sanitation", "Healthcare", "Education", "Rural Development", "Public Safety", "General/Infrastructure"];

  // Compute live location-based statistics from state data
  const locationStats = useMemo<Record<string, any>>(() => {
    const stats: Record<string, {
      grievanceCount: number;
      averagePriority: number;
      backingCount: number;
      criticalCount: number;
      categoryBreakdown: Record<string, number>;
    }> = {};

    // Seed defaults for all 7 locations
    MAP_LOCATIONS.forEach((loc) => {
      stats[loc.name] = {
        grievanceCount: 0,
        averagePriority: 0,
        backingCount: 0,
        criticalCount: 0,
        categoryBreakdown: {},
      };
    });

    // Process actual live grievances
    grievances.forEach((grv) => {
      const loc = grv.location;
      if (!stats[loc]) {
        // Fallback or dynamic seed
        stats[loc] = {
          grievanceCount: 0,
          averagePriority: 0,
          backingCount: 0,
          criticalCount: 0,
          categoryBreakdown: {},
        };
      }

      // Check category filter compatibility
      if (selectedCategory === "All" || grv.category === selectedCategory) {
        stats[loc].grievanceCount += 1;
        stats[loc].averagePriority += grv.priorityScore;
        // Seed some backing count (grievances backed)
        stats[loc].backingCount += grv.priorityScore > 80 ? 45 : 12;
        if (grv.priorityScore >= 80) {
          stats[loc].criticalCount += 1;
        }

        const cat = grv.category;
        stats[loc].categoryBreakdown[cat] = (stats[loc].categoryBreakdown[cat] || 0) + 1;
      }
    });

    // Normalize averages
    Object.keys(stats).forEach((key) => {
      const item = stats[key];
      if (item.grievanceCount > 0) {
        item.averagePriority = Math.round(item.averagePriority / item.grievanceCount);
      } else {
        // Default base simulation score if no live grievances are recorded yet
        const baseDataset = REGIONAL_METRICS[key];
        item.averagePriority = baseDataset ? Math.round((1 - baseDataset.censusIndex) * 100) : 50;
      }
    });

    return stats;
  }, [grievances, selectedCategory]);

  // Overall calculations across India
  const totalGrievancesFiltered = grievances.filter(
    (g) => selectedCategory === "All" || g.category === selectedCategory
  ).length;

  const maxGrievanceLocation = useMemo(() => {
    let maxLoc = MAP_LOCATIONS[0].name;
    let maxVal = -1;
    (Object.entries(locationStats) as [string, any][]).forEach(([loc, stat]) => {
      if (stat.grievanceCount > maxVal) {
        maxVal = stat.grievanceCount;
        maxLoc = loc;
      }
    });
    return maxLoc;
  }, [locationStats]);

  const peakPriorityLocation = useMemo(() => {
    let maxLoc = MAP_LOCATIONS[0].name;
    let maxVal = -1;
    (Object.entries(locationStats) as [string, any][]).forEach(([loc, stat]) => {
      if (stat.averagePriority > maxVal) {
        maxVal = stat.averagePriority;
        maxLoc = loc;
      }
    });
    return maxLoc;
  }, [locationStats]);

  // Selected Location Info
  const selectedStats = locationStats[selectedLocation] || {
    grievanceCount: 0,
    averagePriority: 50,
    backingCount: 0,
    criticalCount: 0,
    categoryBreakdown: {},
  };

  const selectedEnv = REGIONAL_METRICS[selectedLocation] || {
    censusIndex: 0.60,
    humidity: "60%",
    aqi: 100,
    rainfallMm: 800,
    stateName: "State Hub"
  };

  // Filtered grievances list for the selected location
  const locationGrievanceList = useMemo(() => {
    return grievances.filter((g) => {
      const matchLoc = g.location === selectedLocation;
      const matchCat = selectedCategory === "All" || g.category === selectedCategory;
      return matchLoc && matchCat;
    });
  }, [grievances, selectedLocation, selectedCategory]);

  // Determine heat level of a location for SVG rendering based on active metric
  const getHeatValue = (locName: string) => {
    const stat = locationStats[locName];
    const env = REGIONAL_METRICS[locName];
    if (!stat || !env) return { percent: 50, color: "bg-amber-500", colorCode: "#f59e0b" };

    if (heatmapMetric === "count") {
      // Scale count: 0 is lowest, 4+ is highest
      const count = stat.grievanceCount;
      if (count === 0) return { percent: 15, color: "bg-emerald-500", colorCode: "#10b981", label: "Low (0)" };
      if (count === 1) return { percent: 40, color: "bg-teal-500", colorCode: "#14b8a6", label: "Mild (1)" };
      if (count === 2) return { percent: 65, color: "bg-amber-500", colorCode: "#f59e0b", label: "Moderate (2)" };
      return { percent: 95, color: "bg-red-500", colorCode: "#ef4444", label: "High Heatspot (3+)" };
    } else if (heatmapMetric === "priority") {
      // Scale average priority score
      const score = stat.averagePriority;
      if (score < 60) return { percent: 35, color: "bg-green-500", colorCode: "#22c55e", label: `Moderate Priority (${score})` };
      if (score < 80) return { percent: 70, color: "bg-orange-500", colorCode: "#f97316", label: `High Priority (${score})` };
      return { percent: 95, color: "bg-red-600", colorCode: "#dc2626", label: `Critical Priority (${score})` };
    } else {
      // Scale census development index (lower index = more backward = higher heat intensity on priority metrics)
      const index = env.censusIndex;
      if (index > 0.8) return { percent: 25, color: "bg-cyan-500", colorCode: "#06b6d4", label: "Well Developed" };
      if (index > 0.6) return { percent: 55, color: "bg-lime-500", colorCode: "#84cc16", label: "Developing Zone" };
      return { percent: 90, color: "bg-rose-500", colorCode: "#f43f5e", label: "High Development Deficit" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans text-slate-800 space-y-8" id="regional-heatmap-view">
      
      {/* Dynamic Header Banner */}
      <div className="bg-[#002147] text-white rounded-xl p-6 border-b-4 border-[#e38c2d] shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-bold">
            <Layers className="w-3 h-3 text-[#F4C430]" />
            <span>NIC GEOSPATIAL HEATMAP PORTAL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F4C430] uppercase tracking-wide font-display mt-1">
            National Public Demand Matrix Heatmap
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-2xl">
            Live geographical audit plotting citizen grievances alongside CPCB Air Quality indexes, IMD meteorological sensors, and regional development parameters to direct MPLADS funding allocation.
          </p>
        </div>
        <div className="bg-[#001731] border border-white/10 rounded-lg p-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Live Hotspots Registered</span>
            <span className="text-base font-black text-white">{totalGrievancesFiltered} Submissions</span>
          </div>
        </div>
      </div>

      {/* Control Filters Area */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Metric Layer Selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#e38c2d]" />
            <span>Map Metric Layer:</span>
          </span>
          <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
            <button
              onClick={() => setHeatmapMetric("count")}
              className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                heatmapMetric === "count"
                  ? "bg-[#002147] text-white shadow"
                  : "text-slate-600 hover:text-[#002147]"
              }`}
            >
              Grievance Vol.
            </button>
            <button
              onClick={() => setHeatmapMetric("priority")}
              className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                heatmapMetric === "priority"
                  ? "bg-[#002147] text-white shadow"
                  : "text-slate-600 hover:text-[#002147]"
              }`}
            >
              Severity Score
            </button>
            <button
              onClick={() => setHeatmapMetric("census")}
              className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                heatmapMetric === "census"
                  ? "bg-[#002147] text-white shadow"
                  : "text-slate-600 hover:text-[#002147]"
              }`}
            >
              Census Deficit
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-[#e38c2d]" />
            <span>Filter Category:</span>
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "🇮🇳 All Grievance Sectors" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Map Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-h-[460px]">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#e38c2d]" />
                <span>Geographical Cluster Layout</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Click hub nodes to synchronize live district parameters</p>
            </div>
            
            <div className="flex items-center gap-2 text-[10px]">
              <span className="font-bold text-slate-500 uppercase">Intensity Key:</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-400">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-slate-400">Med</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span className="text-slate-400">High</span>
              </div>
            </div>
          </div>

          {/* Map Vector Stage */}
          <div className="bg-slate-950 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[380px] border border-slate-800 shadow-inner overflow-hidden">
            <div className="absolute top-2.5 left-3 text-[9px] text-white/45 font-mono tracking-wider space-y-0.5">
              <div>GEO-COORD SPACE PROJECTION</div>
              <div className="text-amber-500/70">CURRENT METRIC: {heatmapMetric.toUpperCase()} LAYER</div>
            </div>

            {/* India Sub-continent SVG Grid */}
            <svg viewBox="0 0 400 340" className="w-full max-w-md h-auto relative z-10">
              
              {/* Dynamic Grid Background Lines */}
              <defs>
                <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </pattern>
                <radialGradient id="glowing-radial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f4c430" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#002147" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#map-grid)" />

              {/* Central glowing center */}
              <circle cx="200" cy="170" r="130" fill="url(#glowing-radial)" />

              {/* Simplified Border outline of Indian Peninsula representation */}
              <path
                d="M 150,40 L 190,30 L 220,50 L 240,80 L 260,95 L 320,100 L 330,120 L 290,140 L 250,150 L 230,180 L 210,210 L 180,280 L 175,310 L 165,310 L 145,260 L 125,220 L 100,190 L 110,140 L 120,110 L 130,80 Z"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Dynamic Heat Ring Pulses */}
              {MAP_LOCATIONS.map((loc) => {
                const heat = getHeatValue(loc.name);
                const isSelected = selectedLocation === loc.name;

                return (
                  <g key={loc.name} className="group">
                    {/* Pulsing Backlight Ring */}
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r={isSelected ? "18" : "11"}
                      fill="none"
                      stroke={heat.colorCode}
                      strokeWidth={isSelected ? "3" : "1.5"}
                      className="animate-ping opacity-25"
                      style={{ animationDuration: isSelected ? "1.5s" : "2.5s" }}
                    />

                    {/* Interactive Heat Area Circle */}
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r={isSelected ? "14" : "9"}
                      onClick={() => setSelectedLocation(loc.name)}
                      className={`cursor-pointer transition-all duration-300 stroke-2 ${
                        isSelected
                          ? "stroke-white shadow-lg fill-white/10 scale-125"
                          : "stroke-slate-900/50 hover:stroke-white/50 fill-slate-900/30"
                      }`}
                      style={{ fill: heat.colorCode + "77" }}
                    />

                    {/* Tiny Center Dot */}
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r="3.5"
                      fill="#ffffff"
                      className="pointer-events-none"
                    />
                  </g>
                );
              })}

              {/* On-Map Text Labels */}
              {MAP_LOCATIONS.map((loc) => {
                const isSelected = selectedLocation === loc.name;
                const stat = locationStats[loc.name];
                const cleanName = loc.name.split(",")[0];

                return (
                  <text
                    key={`lbl-${loc.name}`}
                    x={loc.x}
                    y={loc.y - 14}
                    textAnchor="middle"
                    onClick={() => setSelectedLocation(loc.name)}
                    className={`text-[8px] font-bold font-sans tracking-wide cursor-pointer select-none transition-all duration-200 ${
                      isSelected
                        ? "fill-[#F4C430] text-[9.5px] font-black"
                        : "fill-white/70 hover:fill-white"
                    }`}
                  >
                    {cleanName} ({stat ? stat.grievanceCount : 0})
                  </text>
                );
              })}
            </svg>

            {/* Quick Map Overlay Footer */}
            <div className="w-full mt-3 flex items-center justify-between text-[11px] text-white/75 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Selected Focus Hub:</span>
                <strong className="text-white">{selectedLocation}</strong>
              </span>
              <span className="text-[#F4C430] font-mono text-[10px] font-bold uppercase tracking-wider bg-[#001731] px-1.5 py-0.5 rounded border border-white/10">
                {getHeatValue(selectedLocation).label}
              </span>
            </div>
          </div>

          {/* Multi-District Insights Ticker Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-700 rounded-md border border-rose-100">
                <Flame className="w-4 h-4" />
              </div>
              <div className="leading-snug">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Peak Demand Hub</div>
                <div className="font-bold text-[#002147] truncate max-w-[130px]">{maxGrievanceLocation.split(",")[0]}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-md border border-amber-100">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="leading-snug">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Critical Priority Zone</div>
                <div className="font-bold text-[#002147] truncate max-w-[130px]">{peakPriorityLocation.split(",")[0]}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                <Users className="w-4 h-4" />
              </div>
              <div className="leading-snug">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Avg Backing Weight</div>
                <div className="font-bold text-slate-900">32 Citizens / Node</div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: Selected Location Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section: Hub telemetry indicators */}
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-[#e38c2d]/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[9px] text-[#F4C430] uppercase font-mono tracking-wider font-bold">
                  {selectedEnv.stateName} Zone Telemetry
                </span>
                <h4 className="text-sm font-black text-white tracking-wide uppercase">{selectedLocation}</h4>
              </div>
              <div className="bg-white/10 text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold border border-white/5">
                CENSUS ID: {selectedEnv.censusIndex}
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-normal">
              Cross-referencing telemetry points verified via NIC-MoSPI registries. Environmental stressors below act as priority multipliers in our algorithm.
            </p>

            {/* Environmental Sensors Display */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CPCB AQI Level</span>
                </div>
                <div className="text-lg font-black text-white">{selectedEnv.aqi}</div>
                <div className="text-[9px] text-slate-400 font-medium">
                  {selectedEnv.aqi > 150 ? "⚠️ Unhealthy Air Quality" : "🟢 Satisfactory Air"}
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  <ThermometerSun className="w-3.5 h-3.5 text-orange-400" />
                  <span>IMD Humidity</span>
                </div>
                <div className="text-lg font-black text-white">{selectedEnv.humidity}</div>
                <div className="text-[9px] text-slate-400 font-medium">Atmospheric moisture sensor</div>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>Annual Rainfall</span>
                </div>
                <div className="text-lg font-black text-white">{selectedEnv.rainfallMm} mm</div>
                <div className="text-[9px] text-slate-400 font-medium">Meteorology rainfall monitor</div>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>Development Factor</span>
                </div>
                <div className="text-lg font-black text-white">{Math.round((1 - selectedEnv.censusIndex) * 100)}% Deficit</div>
                <div className="text-[9px] text-slate-400 font-medium">Infrastructure backwardness weight</div>
              </div>
            </div>
          </div>

          {/* Section: Live Grievance Audit Logs for Location */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#e38c2d]" />
                <span>Logged Public Grievances ({locationGrievanceList.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">LIVE SYNCED</span>
            </div>

            {locationGrievanceList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-3">
                <Info className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-xs">
                  <p className="font-bold text-slate-500">No Active Submissions Registered</p>
                  <p className="text-[10px] text-slate-400 mt-1">Grievances for this zone have either been fully resolved or none meet the current category filter.</p>
                </div>
                {setActiveTab && (
                  <button
                    onClick={() => setActiveTab("citizen-auth")}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e38c2d] hover:underline cursor-pointer uppercase tracking-wider"
                  >
                    <span>Lodge First Grievance Here</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
                {locationGrievanceList.map((grv) => (
                  <div
                    key={grv.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-bold text-slate-400">{grv.id}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                          grv.priorityScore >= 80
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : grv.priorityScore >= 60
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-green-50 text-green-700 border border-green-100"
                        }`}
                      >
                        Priority Score: {grv.priorityScore}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-[11.5px] leading-snug">{grv.title}</div>
                    
                    <p className="text-slate-500 text-[10.5px] line-clamp-2 leading-relaxed">
                      {grv.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                      <span className="bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                        {grv.category}
                      </span>
                      <span className="font-medium text-slate-400">
                        By: {grv.citizenName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
