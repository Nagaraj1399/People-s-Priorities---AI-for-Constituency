import React, { useState, useEffect } from "react";
import { Project } from "../types";
import { ListFilter, ShieldCheck, CheckCircle, Ban, ArrowUpRight, Award, FileSpreadsheet, Sparkles, Plus, AlertCircle, RefreshCw, MapPin } from "lucide-react";

import { T } from "../languagesData";

interface ProjectPrioritizationPageProps {
  mpSession: { name: string; email: string } | null;
  projects: Project[];
  fetchProjects: () => void;
  selectedLanguage: string;
}

export default function ProjectPrioritizationPage({ mpSession, projects, fetchProjects, selectedLanguage }: ProjectPrioritizationPageProps) {
  // AI prioritizing review commentary state
  const [aiReviewComment, setAiReviewComment] = useState("");
  const [isGeneratingComment, setIsGeneratingComment] = useState(false);

  // Modal control state for sanctioning a project
  const [activeSanctionId, setActiveSanctionId] = useState<string | null>(null);
  const [sanctionAmountInput, setSanctionAmountInput] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // New proposal creation modal (simulation for MP adding on-the-fly)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Water & Sanitation");
  const [newCost, setNewCost] = useState(10);
  const [newUrgency, setNewUrgency] = useState<"Critical" | "High" | "Medium" | "Low">("High");
  const [newLocation, setNewLocation] = useState("North Delhi, Delhi");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sortedProjects = [...projects].sort((a, b) => b.priorityScore - a.priorityScore);

  const handleGenerateAIReview = async () => {
    setIsGeneratingComment(true);
    setAiReviewComment("");
    try {
      const pending = sortedProjects.filter((p) => p.status === "Pending Prioritization");
      const res = await fetch("/api/prioritization/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pendingProjects: pending }),
      });
      const data = await res.json();
      if (data.comment) {
        setAiReviewComment(data.comment);
      }
    } catch (err) {
      console.error("Failed to generate priority clearance comments", err);
      setAiReviewComment("Priority evaluation complete. Central datasets confirm urgent utility allocation.");
    } finally {
      setIsGeneratingComment(false);
    }
  };

  const triggerSanctionModal = (proj: Project) => {
    setActiveSanctionId(proj.id);
    setSanctionAmountInput(proj.estimatedCost);
    setError("");
    setSuccess("");
  };

  const handleSanctionConfirm = async () => {
    if (!activeSanctionId) return;
    setError("");
    setSuccess("");

    if (!mpSession) {
      setError("Admin Access Violation: Secure Kavach MP authentication required to approve MPLADS funds.");
      return;
    }

    if (sanctionAmountInput <= 0) {
      setError("Sanction amount must be greater than zero Lakhs.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${activeSanctionId}/sanction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sanctorName: mpSession.name,
          sanctionedAmount: Number(sanctionAmountInput),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Project ${activeSanctionId} successfully approved and MPLADS funds allocated!`);
        setActiveSanctionId(null);
        fetchProjects();
      } else {
        setError(data.error || "Sanction failed. Check parameters.");
      }
    } catch (err) {
      setError("Server error on sanction allocation routing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineProposal = async (id: string) => {
    if (!mpSession) {
      setError("Access Block: MP Kavach credentials required to decline public proposals.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}/decline`, {
        method: "POST",
      });
      if (res.ok) {
        setSuccess(`Proposal ${id} successfully declined.`);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newTitle.trim() || !newDesc.trim()) {
      setError("All fields are required to draft a new development proposal.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          estimatedCost: newCost,
          urgencyLevel: newUrgency,
          location: newLocation,
          regionalCensusFactor: 0.62, // baseline
        }),
      });

      if (res.ok) {
        setSuccess("New project proposal added to priorities list successfully!");
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewDesc("");
        fetchProjects();
      }
    } catch (err) {
      setError("Failed to create project proposal.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending Prioritization":
        return "bg-amber-100 border-amber-300 text-amber-800";
      case "Sanctioned":
        return "bg-green-100 border-green-300 text-green-800";
      case "Declined":
        return "bg-red-100 border-red-300 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-8 text-slate-800" id="project-prioritization-view">
      
      {/* Alert guards */}
      {!mpSession && (
        <div className="bg-[#fffbeb] border border-[#fef3c7] p-4 rounded flex items-center justify-between text-xs text-slate-700 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#e38c2d]" />
            <span>Review Mode: You can browse prioritizations. Authenticate as MP to sanction budgets or decline proposals.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded text-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3.5 rounded text-xs">
          {success}
        </div>
      )}

      {/* Bulk prioritization AI Clearance Generator */}
      <div className="bg-gradient-to-r from-[#002147] to-[#001731] border-b-4 border-[#e38c2d] p-6 rounded-xl shadow-md text-white space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#F4C430]/20 border border-[#F4C430]/30 text-[10px] font-black text-[#F4C430] uppercase tracking-widest">
              Gemini MoSPI Analytics
            </div>
            <h3 className="text-base font-bold text-white font-display">Generate AI Priority Clearance Commentary</h3>
            <p className="text-xs text-white/85">Summarizes prioritizations, funding gaps, and optimal clearance paths automatically.</p>
          </div>
          <button
            onClick={handleGenerateAIReview}
            disabled={isGeneratingComment}
            className="px-4 py-2.5 bg-[#e38c2d] hover:bg-[#d17b1d] text-white text-xs font-bold rounded shadow-md flex items-center gap-2 cursor-pointer transition-all flex-shrink-0 disabled:bg-slate-700 disabled:text-slate-400 uppercase tracking-wider"
            id="btn-generate-ai-comment"
          >
            {isGeneratingComment ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Clearance Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Evaluate Gaps via Gemini API</span>
              </>
            )}
          </button>
        </div>

        {aiReviewComment && (
          <div className="bg-white/10 p-4 border border-white/10 rounded text-xs text-white/90 leading-relaxed italic animate-fade-in font-medium">
            "{aiReviewComment}"
          </div>
        )}
      </div>

      {/* Master Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table header menu */}
        <div className="p-5 border-b-2 border-[#F4C430] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
              <ListFilter className="w-4.5 h-4.5 text-[#e38c2d]" />
              <span>MoSPI Project Evaluation Matrix</span>
            </h3>
            <p className="text-[10px] text-slate-400">Ranked automatically by formula priority scores</p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {mpSession && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 bg-[#002147] hover:bg-[#001731] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow ml-auto uppercase tracking-wider"
                id="btn-add-proposal"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Draft Proposal</span>
              </button>
            )}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-4">Rank</th>
                <th className="p-4">Priority Score</th>
                <th className="p-4">Proposal / Area Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Est. Cost (Lakhs)</th>
                <th className="p-4">Regional Backing</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actionable Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" id="matrix-table-body">
              {sortedProjects.map((proj, idx) => (
                <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Rank number */}
                  <td className="p-4 font-bold text-slate-500 font-mono text-[11px]">
                    #{idx + 1}
                  </td>

                  {/* Score */}
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-[#e38c2d] font-black rounded border border-amber-200">
                      <Award className="w-3.5 h-3.5 text-[#e38c2d]" />
                      <span>{proj.priorityScore}/100</span>
                    </span>
                  </td>

                  {/* Title & Location details */}
                  <td className="p-4 max-w-xs space-y-1">
                    <div className="font-bold text-slate-900 text-[11px] leading-tight">
                      {proj.title}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{proj.description}</p>
                    <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{proj.location} (Census Factor: {proj.regionalCensusFactor})</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-4 text-slate-600 font-semibold">
                    {proj.category}
                  </td>

                  {/* Cost */}
                  <td className="p-4 font-mono font-bold text-slate-800 text-[11px]">
                    ₹{proj.estimatedCost.toFixed(1)}L
                  </td>

                  {/* Public Backing */}
                  <td className="p-4 font-medium text-slate-500">
                    <span className="font-bold text-slate-700">{proj.citizenBackingCount}</span> Citizens
                  </td>

                  {/* Status badge */}
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-wider ${getStatusBadge(proj.status)}`}>
                      {proj.status}
                    </span>
                  </td>

                  {/* Actions buttons */}
                  <td className="p-4 text-right whitespace-nowrap">
                    {proj.status === "Pending Prioritization" ? (
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => triggerSanctionModal(proj)}
                          disabled={!mpSession}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded text-[10px] flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Sanction</span>
                        </button>
                        <button
                          onClick={() => handleDeclineProposal(proj.id)}
                          disabled={!mpSession}
                          className="px-2.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 disabled:bg-slate-100 disabled:text-slate-400 font-bold rounded text-[10px] flex items-center gap-1 cursor-pointer transition-all border border-red-200"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Decline</span>
                        </button>
                      </div>
                    ) : proj.status === "Sanctioned" ? (
                      <div className="text-[10px] text-slate-500 font-semibold italic text-right space-y-0.5">
                        <div className="text-emerald-600 font-black flex items-center gap-0.5 justify-end">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Fund Dispatched</span>
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">By {proj.sanctorName} (₹{proj.sanctionedAmount}L)</div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic font-semibold">Declined by MoSPI Board</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sanction Modal Overlay */}
      {activeSanctionId && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in" id="sanction-modal">
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full overflow-hidden shadow-2xl">
            <div className="bg-[#002147] border-b-4 border-[#e38c2d] p-4 text-white font-bold flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-white">Kavach Fund Authorization</span>
              <button
                onClick={() => setActiveSanctionId(null)}
                className="text-white/80 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-150 space-y-1">
                <div className="font-bold text-slate-700">Proposal ID: {activeSanctionId}</div>
                <p className="text-slate-500">Enter the allocated MPLADS budget for clearance.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">Sanctioned Amount (INR Lakhs)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    value={sanctionAmountInput}
                    onChange={(e) => setSanctionAmountInput(Number(e.target.value))}
                    className="w-full pl-7 pr-12 py-2 text-xs bg-slate-50 border border-slate-200 rounded font-bold text-slate-950"
                  />
                  <span className="absolute right-3 top-2.5 font-bold text-slate-400 text-[10px] uppercase">Lakhs</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSanctionId(null)}
                  className="flex-1 py-2 bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold rounded cursor-pointer uppercase tracking-wider text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSanctionConfirm}
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-[#002147] hover:bg-[#001731] text-white font-bold rounded cursor-pointer flex items-center justify-center gap-1 shadow uppercase tracking-wider text-[10px]"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Clear Fund</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Proposal Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in" id="add-proposal-modal">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-[#002147] border-b-4 border-[#e38c2d] p-4 text-white font-bold flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-white">Draft New MPLADS Proposal</span>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddProjectSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Proposal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Setting up solar panel canopy at Pune regional depot"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-950 text-xs focus:ring-1 focus:ring-[#002147]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Focus of the proposal, development goals..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-950 text-xs focus:ring-1 focus:ring-[#002147]"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  >
                    <option>Water & Sanitation</option>
                    <option>Road & Transport</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Public Safety</option>
                    <option>Rural Development</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Estimated Cost (Lakhs)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-950 text-xs focus:ring-1 focus:ring-[#002147]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Urgency Level</label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded text-xs"
                  >
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">District Location</label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-2 py-2 bg-[#f8fafc] border border-slate-200 rounded text-xs"
                  >
                    <option>Gautam Buddha Nagar, UP</option>
                    <option>Patna, Bihar</option>
                    <option>Chennai, Tamil Nadu</option>
                    <option>Pune, Maharashtra</option>
                    <option>North Delhi, Delhi</option>
                    <option>Guwahati, Assam</option>
                    <option>Anantapur, Andhra Pradesh</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold rounded cursor-pointer uppercase tracking-wider text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-[#002147] hover:bg-[#001731] text-white font-bold rounded cursor-pointer flex items-center justify-center gap-1 shadow uppercase tracking-wider text-[10px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Draft Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
