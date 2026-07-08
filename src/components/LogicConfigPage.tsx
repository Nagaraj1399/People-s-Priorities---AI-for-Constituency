import React, { useState, useEffect } from "react";
import { FormulaWeights } from "../types";
import { Settings, Save, AlertCircle, RefreshCw, Layers, Database, Sparkles, HelpCircle } from "lucide-react";

import { T } from "../languagesData";

interface LogicConfigPageProps {
  mpSession: { name: string; email: string } | null;
  onWeightsUpdated: () => void;
  selectedLanguage: string;
}

export default function LogicConfigPage({ mpSession, onWeightsUpdated, selectedLanguage }: LogicConfigPageProps) {
  const [weights, setWeights] = useState<FormulaWeights>({
    urgencyWeight: 40,
    costWeight: 20,
    censusWeight: 25,
    citizenBackingWeight: 15,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = async () => {
    try {
      const res = await fetch("/api/prioritization/weights");
      const data = await res.json();
      if (data) {
        setWeights(data);
      }
    } catch (err) {
      console.error("Failed to load formula weights", err);
    }
  };

  const autoBalanceWeights = () => {
    const total = weights.urgencyWeight + weights.costWeight + weights.censusWeight + weights.citizenBackingWeight;
    if (total === 0) {
      setWeights({ urgencyWeight: 25, costWeight: 25, censusWeight: 25, citizenBackingWeight: 25 });
      return;
    }
    
    let urgency = Math.round((weights.urgencyWeight / total) * 100);
    let cost = Math.round((weights.costWeight / total) * 100);
    let census = Math.round((weights.censusWeight / total) * 100);
    let citizen = Math.round((weights.citizenBackingWeight / total) * 100);
    
    let sum = urgency + cost + census + citizen;
    let diff = 100 - sum;
    
    if (diff !== 0) {
      const vals = [urgency, cost, census, citizen];
      const maxIdx = vals.indexOf(Math.max(...vals));
      if (maxIdx === 0) urgency += diff;
      else if (maxIdx === 1) cost += diff;
      else if (maxIdx === 2) census += diff;
      else if (maxIdx === 3) citizen += diff;
    }

    setWeights({
      urgencyWeight: urgency,
      costWeight: cost,
      censusWeight: census,
      citizenBackingWeight: citizen
    });
    setError("");
    setSuccess("");
  };

  const handleSliderChange = (key: keyof FormulaWeights, val: number) => {
    setWeights((prev) => {
      const updated = { ...prev, [key]: val };
      return updated;
    });
    setError("");
    setSuccess("");
  };

  const handleSaveWeights = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!mpSession) {
      setError("Admin Access Violation: You must be authenticated via an official @sansad.nic.in or @gov.in email utilizing Kavach SSO to modify official logic formulas.");
      return;
    }

    const total = weights.urgencyWeight + weights.costWeight + weights.censusWeight + weights.citizenBackingWeight;
    if (total === 0) {
      setError("Aggregate formula allocation cannot be 0%. Please adjust at least one slider.");
      return;
    }

    let targetWeights = { ...weights };
    let normalizedMsg = "";

    if (total !== 100) {
      let urgency = Math.round((weights.urgencyWeight / total) * 100);
      let cost = Math.round((weights.costWeight / total) * 100);
      let census = Math.round((weights.censusWeight / total) * 100);
      let citizen = Math.round((weights.citizenBackingWeight / total) * 100);
      
      let sum = urgency + cost + census + citizen;
      let diff = 100 - sum;
      
      if (diff !== 0) {
        const vals = [urgency, cost, census, citizen];
        const maxIdx = vals.indexOf(Math.max(...vals));
        if (maxIdx === 0) urgency += diff;
        else if (maxIdx === 1) cost += diff;
        else if (maxIdx === 2) census += diff;
        else if (maxIdx === 3) citizen += diff;
      }
      
      targetWeights = {
        urgencyWeight: urgency,
        costWeight: cost,
        censusWeight: census,
        citizenBackingWeight: citizen
      };
      setWeights(targetWeights);
      normalizedMsg = ` (Scaled proportionally from ${total}% to sum to exactly 100%)`;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/prioritization/weights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(targetWeights),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Prioritization weights successfully updated on government server! Master scoring formulas updated instantly.${normalizedMsg}`);
        onWeightsUpdated();
      } else {
        setError(data.error || "Failed to update prioritization weights. Verify authorization.");
      }
    } catch (err) {
      setError("Failed to communicate with government backend registry.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentTotal = weights.urgencyWeight + weights.costWeight + weights.censusWeight + weights.citizenBackingWeight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-8 text-slate-800" id="logic-config-view">
      {/* Security alert if not authenticated as MP */}
      {!mpSession && (
        <div className="bg-[#fffbeb] border border-[#fef3c7] p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3 text-xs text-slate-700">
            <AlertCircle className="w-6 h-6 text-[#e38c2d] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-950 uppercase tracking-wide">Official Admin Security Block</h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                The National Informatics Centre (NIC) mandates that formula weight configurations, keyword mappings, and database alignments can only be saved by verified Members of Parliament (MPs) or Ministry Officials with active Kavach authorizations.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const tabBtn = document.getElementById("tab-mp-auth");
              if (tabBtn) tabBtn.click();
            }}
            className="px-5 py-2.5 bg-[#002147] hover:bg-[#001731] text-white font-bold rounded text-xs cursor-pointer transition-all flex-shrink-0 uppercase tracking-wider"
          >
            Authenticate Official ID
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Symmetrical left: Sliders control panel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b-2 border-[#F4C430] pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4.5 h-4.5 text-[#e38c2d]" />
              <span>Prioritization Formula Adjuster</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Formula: v3.1-MoSPI</span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded text-xs flex items-center gap-2">
              <Save className="w-4.5 h-4.5 text-green-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSaveWeights} className="space-y-6">
            
            {/* Slider 1: Urgency */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>1. Public Urgency & Safety Factor</span>
                <span className="text-[#e38c2d] bg-amber-50 px-2.5 py-0.5 rounded font-black border border-amber-200/50">{weights.urgencyWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weights.urgencyWeight}
                onChange={(e) => handleSliderChange("urgencyWeight", Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#002147]"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed">Determines the weighting of critical, high-risk life-safety grievances like collapsed structures.</p>
            </div>

            {/* Slider 2: Cost */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>2. Fund Efficiency Factor (Cost Inverse Relation)</span>
                <span className="text-[#e38c2d] bg-amber-50 px-2.5 py-0.5 rounded font-black border border-amber-200/50">{weights.costWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weights.costWeight}
                onChange={(e) => handleSliderChange("costWeight", Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#002147]"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed">Favors highly cost-efficient projects to maximize public fund distribution and community outreach.</p>
            </div>

            {/* Slider 3: Census Factor */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>3. Backwardness Index (Census Regional Multiplier)</span>
                <span className="text-[#e38c2d] bg-amber-50 px-2.5 py-0.5 rounded font-black border border-amber-200/50">{weights.censusWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weights.censusWeight}
                onChange={(e) => handleSliderChange("censusWeight", Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#002147]"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed">Provides higher priority scores to projects located in districts with low Census development indexes.</p>
            </div>

            {/* Slider 4: Citizen Backing */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>4. Democratic Support Factor (Citizen Backing Count)</span>
                <span className="text-[#e38c2d] bg-amber-50 px-2.5 py-0.5 rounded font-black border border-amber-200/50">{weights.citizenBackingWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weights.citizenBackingWeight}
                onChange={(e) => handleSliderChange("citizenBackingWeight", Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#002147]"
              />
              <p className="text-[10px] text-slate-400 leading-relaxed">Boosts the priority score based on the volume of verified citizen grievances supporting the development.</p>
            </div>

            {/* Rebalance bar */}
            <div className="p-3 bg-slate-50 border border-slate-150 rounded flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
              <span className="text-slate-600">Aggregate Formula Allocation:</span>
              <div className="flex flex-wrap items-center gap-2">
                {currentTotal !== 100 && currentTotal > 0 && (
                  <button
                    type="button"
                    onClick={autoBalanceWeights}
                    className="px-2 py-1 bg-[#e38c2d] hover:bg-[#d17b1d] text-white rounded text-[10px] uppercase tracking-wider cursor-pointer font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95"
                    title="Scale sliders proportionally to sum to exactly 100%"
                  >
                    <RefreshCw className="w-3 h-3 text-white" />
                    <span>Auto-Balance</span>
                  </button>
                )}
                <span className={`px-2.5 py-1 rounded font-bold ${currentTotal === 100 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  {currentTotal}% / 100%
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !mpSession || currentTotal === 0}
              className="w-full py-2.5 bg-[#002147] hover:bg-[#001731] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all uppercase tracking-wider"
              id="btn-save-weights"
            >
              <Save className="w-4 h-4" />
              <span>Apply & Re-Score Active Proposals</span>
            </button>
          </form>
        </div>

        {/* Right side: Keyword triggers mapping list */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Layers className="w-4.5 h-4.5 text-[#e38c2d]" />
              <span>AI Keyword Mapping Panel</span>
            </h3>
            
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Administrative classification rules matching public grievance keywords with primary focus categories and regional datasets:
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded space-y-1.5">
                <div className="font-bold text-[#002147] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Water Supply Mapping</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Keywords like <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[9px]">contamination</code>, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[9px]">pipes</code>, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[9px]">tank</code> automatically trigger priority mapping to the <strong>Water & Sanitation</strong> department and cross-checks with Census potable indices.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-150 rounded space-y-1.5">
                <div className="font-bold text-[#002147] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>Public Safety Mapping</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Keywords like <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[9px]">dark</code>, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[9px]">streetlights</code>, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[9px]">crime</code> trigger alignment with the <strong>Public Safety</strong> category, bypassing basic density weight bounds.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-150 rounded space-y-1.5">
                <div className="font-bold text-[#002147] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span>Agricultural Infrastructure</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Keywords like <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[9px]">canal</code>, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[9px]">irrigation</code>, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[9px]">bypass</code> map to <strong>Rural Development</strong> with local weather rainfall multipliers factored in.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm text-xs space-y-3">
            <h4 className="font-bold text-[#002147] flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
              <Database className="w-4 h-4 text-[#e38c2d]" />
              <span>External API Integrity Check</span>
            </h4>
            <div className="space-y-1.5 text-slate-600 leading-relaxed font-semibold">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>data.gov.in Hub Connection:</span>
                <span className="text-emerald-600 font-bold uppercase text-[10px]">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>IMD Weather Station Sensors:</span>
                <span className="text-emerald-600 font-bold uppercase text-[10px]">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>Census Registry Sync (2011/2021):</span>
                <span className="text-emerald-600 font-bold uppercase text-[10px]">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
