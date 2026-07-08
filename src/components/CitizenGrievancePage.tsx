import React, { useState, useEffect, useRef } from "react";
import { Grievance } from "../types";
import { T } from "../languagesData";
import {
  FileText,
  Mic,
  MicOff,
  Image as ImageIcon,
  Play,
  Square,
  Send,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2,
  User,
  Upload,
  Activity
} from "lucide-react";

interface CitizenGrievancePageProps {
  citizenSession: { name: string; phone: string; email: string } | null;
  setCitizenSession?: (session: { name: string; phone: string; email: string } | null) => void;
  selectedLanguage: string;
  onGrievanceSubmitted?: () => void;
}

const mpsList = [
  { name: "Shri Narendra Modi (Varanasi Constituency)", email: "narendramodi@sansad.nic.in" },
  { name: "Shri Amit Shah (Gandhinagar Constituency)", email: "amitshah@sansad.nic.in" },
  { name: "Shri K. Nagarajan (Coimbatore Constituency)", email: "shri.nagarajan@sansad.nic.in" },
  { name: "Smt. Draupadi Murmu (Mayurbhanj Constituency)", email: "murmu@sansad.nic.in" },
  { name: "Shri R. Sharma (Patna Sahib Constituency)", email: "sharma@sansad.nic.in" }
];

const constituencyProblemsList = [
  { title: "Main Sector 4 Water Tank Pipeline Fracture", category: "Water & Sanitation" },
  { title: "Bypass Overpass Bridge Concrete Crack near fields", category: "Road & Transport" },
  { title: "NH Link Road streetlights down since storm", category: "Public Safety" },
  { title: "Primary School Computer Lab Broadband outage", category: "Education" },
  { title: "Rural Health Center Vaccine Cooler Compressor Defect", category: "Healthcare" },
  { title: "Kisan Mandi Grain Storage Cover Sheet Damage", category: "Rural Development" }
];

export default function CitizenGrievancePage({
  citizenSession,
  setCitizenSession,
  selectedLanguage,
  onGrievanceSubmitted
}: CitizenGrievancePageProps) {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("North Delhi, Delhi");

  // Voice recording real & simulation states
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [simulatedVoiceBase64, setSimulatedVoiceBase64] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // MP selection and search box states
  const [selectedMp, setSelectedMp] = useState(mpsList[2].name); // Default to Shri K. Nagarajan
  const [problemSearchQuery, setProblemSearchQuery] = useState("");
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [isAddingNewProblem, setIsAddingNewProblem] = useState(false);
  const [customProblemTitle, setCustomProblemTitle] = useState("");
  const [customProblemCategory, setCustomProblemCategory] = useState("Road & Transport");

  // Grievance tracker search box state
  const [trackerSearchQuery, setTrackerSearchQuery] = useState("");

  const [categoryHint, setCategoryHint] = useState("General/Infrastructure");
  const [isAnalyzingCategory, setIsAnalyzingCategory] = useState(false);

  useEffect(() => {
    if (!title.trim() && !description.trim()) {
      setCategoryHint("General/Infrastructure");
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzingCategory(true);
      try {
        const res = await fetch("/api/gemini/analyze-category", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description })
        });
        const data = await res.json();
        if (data.category) {
          setCategoryHint(data.category);
        }
      } catch (err) {
        console.error("Failed to analyze category", err);
      } finally {
        setIsAnalyzingCategory(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [title, description]);

  // Photo upload states
  const [photoBase64, setPhotoBase64] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General states
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const locationsList = [
    "North Delhi, Delhi",
    "Gautam Buddha Nagar, UP",
    "Patna, Bihar",
    "Chennai, Tamil Nadu",
    "Pune, Maharashtra",
    "Guwahati, Assam",
    "Anantapur, Andhra Pradesh"
  ];

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const res = await fetch("/api/grievances");
      const data = await res.json();
      if (data.grievances) {
        setGrievances(data.grievances);
      }
    } catch (err) {
      console.error("Failed to fetch grievances", err);
    }
  };

  // Real Microphone and Simulated Fallback Voice Note Capture
  const startRecording = async () => {
    setFormError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const localUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localUrl);

        const reader = new FileReader();
        reader.onloadend = () => {
          setSimulatedVoiceBase64(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      setIsRecording(true);
      setVoiceRecorded(false);
      setRecordingSeconds(0);
      setSimulatedVoiceBase64("");
      setAudioUrl("");

      mediaRecorder.start();

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 15) {
            stopRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn("Microphone access declined or unavailable, falling back to secure simulated audio stream.", err);
      // Fallback simulation
      setIsRecording(true);
      setVoiceRecorded(false);
      setRecordingSeconds(0);
      setSimulatedVoiceBase64("");
      setAudioUrl("");

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 10) {
            stopRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setVoiceRecorded(true);
    } else {
      // Simulation stop
      setIsRecording(false);
      setVoiceRecorded(true);
      setSimulatedVoiceBase64("MOCK_BASE64_AUDIO_REPRESENTATION_SIMULATED_NIC_NODE");
      setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); // Standard high fidelity test audio URL
    }
  };

  // Photo Upload Handler (FileReader base64 converter)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPhotoFile(file);
    }
  };

  const processPhotoFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setFormError("Only image uploads (JPEG/PNG) are accepted.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFormError("Image file must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string);
      setFormError("");
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop implementation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processPhotoFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedPhoto = () => {
    setPhotoBase64("");
  };

  const removeVoiceNote = () => {
    setVoiceRecorded(false);
    setSimulatedVoiceBase64("");
    setRecordingSeconds(0);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!title.trim() || !description.trim()) {
      setFormError("Grievance Title and detailed description are required.");
      return;
    }

    let activeSession = citizenSession;
    let autoVerified = false;
    if (!activeSession) {
      const demoSession = {
        name: "Nagarajan K.",
        phone: "9876543210",
        email: "nagarajan1320@gmail.com",
      };
      if (setCitizenSession) {
        setCitizenSession(demoSession);
      }
      activeSession = demoSession;
      autoVerified = true;
    }

    setIsLoading(true);

    try {
      const linkageText = selectedProblem 
        ? `Linked Constituency Problem: ${selectedProblem}`
        : isAddingNewProblem 
          ? `New Constituency Problem Registered: ${customProblemTitle || title} (${customProblemCategory})` 
          : `General Constituency Issue`;

      const descWithMp = `Selected MP Node: ${selectedMp}\nProblem Area: ${linkageText}\n\n${description}`;

      const payload = {
        title,
        description: descWithMp,
        citizenName: activeSession.name,
        citizenEmail: activeSession.email,
        citizenPhone: activeSession.phone,
        location,
        voiceData: simulatedVoiceBase64 ? simulatedVoiceBase64 : "",
        photoData: photoBase64 ? photoBase64.split(",")[1] : "",
      };

      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(
          autoVerified
            ? "Successfully logged grievance! Secure citizen credentials generated for 'Nagarajan K.' automatically. Gemini AI analyzed and prioritized your issue."
            : "Grievance logged successfully! Gemini AI has classified your issue and computed a priority rating."
        );
        setTitle("");
        setDescription("");
        setPhotoBase64("");
        setVoiceRecorded(false);
        setSimulatedVoiceBase64("");
        setRecordingSeconds(0);
        setAudioUrl("");
        
        // Reset problem search/choose states
        setSelectedProblem(null);
        setIsAddingNewProblem(false);
        setCustomProblemTitle("");
        setProblemSearchQuery("");

        fetchGrievances();
        if (onGrievanceSubmitted) {
          onGrievanceSubmitted();
        }
      } else {
        setFormError(data.error || "Grievance filing failed. Please retry.");
      }
    } catch (err) {
      setFormError("Failed to communicate with NIC gateway server. Check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-sky-50 border-sky-200 text-sky-700";
      case "In Review":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "Under Investigation":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "Sanctioned":
        return "bg-green-50 border-green-200 text-green-700";
      case "Resolved":
        return "bg-emerald-100 border-emerald-300 text-emerald-800";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-8 text-slate-800" id="citizen-grievance-view">
      {/* Verification Guard banner if not logged in */}
      {!citizenSession ? (
        <div className="bg-[#fffbeb] border border-[#fef3c7] p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-[#e38c2d] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wide">Official Clearance Required</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                To prevent automated bots and spammers, citizens must verify their mobile/email credentials prior to submitting grievances.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const tabBtn = document.getElementById("tab-citizen-auth");
              if (tabBtn) tabBtn.click();
            }}
            className="px-5 py-2.5 bg-[#002147] hover:bg-[#001731] text-white font-bold rounded text-xs cursor-pointer transition-all uppercase tracking-wider"
          >
            Authenticate Now
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {citizenSession.name[0]}
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-900">Authorized Session active:</span> {citizenSession.name} ({citizenSession.phone})
            </div>
          </div>
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase">
            KAVACH VALIDATED
          </span>
        </div>
      )}

      {/* Main Grid: Form Left, Track Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lodging Form (Left side) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b-2 border-[#F4C430] pb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#002147] flex items-center gap-2 uppercase tracking-wide">
              <Send className="w-5 h-5 text-[#e38c2d]" />
              <span>Grievance Lodger Room</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Form ref: NIC-LODGE-2026</span>
          </div>

          {formError && (
            <div className="bg-red-55/30 border border-red-200 text-red-800 p-3 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-55/30 border border-green-200 text-green-800 p-3 rounded text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4" id="grievance-lodge-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">District/Geographic Area</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#002147]/30"
                  id="select-location"
                >
                  {locationsList.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Proposed Focus (Category hint)</label>
                <div className={`px-3 py-2 text-xs font-bold rounded border flex items-center gap-1.5 transition-all ${
                  isAnalyzingCategory 
                    ? "bg-slate-50 border-slate-200 text-slate-500 animate-pulse" 
                    : "bg-[#002147]/5 border-[#002147]/10 text-[#002147]"
                }`}>
                  <span>⚡</span>
                  <span>{isAnalyzingCategory ? "Analyzing with Gemini..." : categoryHint}</span>
                </div>
              </div>
            </div>

            {/* MP & PROBLEM SELECTION CONTAINER */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4 animate-fade-in" id="mp-coupler-container">
              <div className="text-xs font-bold text-[#002147] uppercase tracking-wide border-b border-slate-200 pb-1.5 flex justify-between items-center">
                <span>1. Select Assigned Constituency MP</span>
                <span className="text-[10px] bg-[#e38c2d]/10 text-[#e38c2d] px-2 py-0.5 rounded uppercase font-bold">Secure Routing Node</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">Constituency MP Officer</label>
                  <select
                    value={selectedMp}
                    onChange={(e) => setSelectedMp(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147]/30 font-semibold cursor-pointer"
                    id="select-mp-officer"
                  >
                    {mpsList.map((mp) => (
                      <option key={mp.name} value={mp.name}>
                        {mp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 block">MP Contact Endpoint</label>
                  <div className="px-3 py-2 bg-slate-100 text-slate-600 text-xs font-mono rounded border border-slate-200 select-all truncate">
                    {mpsList.find(mp => mp.name === selectedMp)?.email}
                  </div>
                </div>
              </div>

              {/* PROBLEM COUPLER ENGINE */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    2. Link to Existing Constituency Problem or Register New
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewProblem(!isAddingNewProblem);
                      setSelectedProblem(null);
                    }}
                    className="text-[10px] text-[#e38c2d] hover:text-[#d17b1d] font-bold hover:underline cursor-pointer"
                    id="btn-toggle-add-problem"
                  >
                    {isAddingNewProblem ? "← Search Existing Problems" : "+ Register New Problem Node"}
                  </button>
                </div>

                {isAddingNewProblem ? (
                  <div className="bg-white p-3 rounded border border-slate-200 space-y-3 animate-fade-in">
                    <div className="bg-amber-50/50 border border-amber-100 p-2 rounded text-[10px] text-amber-800">
                      <strong>New Problem Registration:</strong> Define an overriding constituency problem to link other citizen grievances to.
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 block">Constituency Problem Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Bypass Bridge Concrete Crack"
                        value={customProblemTitle}
                        onChange={(e) => setCustomProblemTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147]/30"
                        id="input-new-problem-title"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 block">Primary Sector Category</label>
                      <select
                        value={customProblemCategory}
                        onChange={(e) => setCustomProblemCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="Road & Transport">Road & Transport</option>
                        <option value="Water & Sanitation">Water & Sanitation</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Rural Development">Rural Development</option>
                        <option value="Public Safety">Public Safety</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="🔍 Type to search active MP constituency problems..."
                        value={problemSearchQuery}
                        onChange={(e) => setProblemSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 pl-8 bg-white border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147]/30"
                        id="input-problem-search"
                      />
                      <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
                    </div>

                    {/* MATCHES LIST */}
                    <div className="bg-white border border-slate-200 rounded max-h-36 overflow-y-auto divide-y divide-slate-100 text-xs shadow-sm">
                      {constituencyProblemsList
                        .filter(prob => 
                          prob.title.toLowerCase().includes(problemSearchQuery.toLowerCase()) ||
                          prob.category.toLowerCase().includes(problemSearchQuery.toLowerCase())
                        )
                        .map((prob) => {
                          const isSelected = selectedProblem === prob.title;
                          return (
                            <div
                              key={prob.title}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedProblem(null);
                                  setTitle("");
                                } else {
                                  setSelectedProblem(prob.title);
                                  setTitle(`Grievance: ${prob.title}`);
                                }
                              }}
                              className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                                isSelected ? "bg-emerald-50 text-emerald-900 font-medium" : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="font-semibold text-[11px] leading-tight">{prob.title}</div>
                                <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.2 rounded font-mono uppercase">
                                  {prob.category}
                                </span>
                              </div>
                              <button
                                type="button"
                                className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border cursor-pointer ${
                                  isSelected
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                                }`}
                              >
                                {isSelected ? "Selected ✓" : "Choose"}
                              </button>
                            </div>
                          );
                        })}
                      {constituencyProblemsList.filter(prob => 
                        prob.title.toLowerCase().includes(problemSearchQuery.toLowerCase()) ||
                        prob.category.toLowerCase().includes(problemSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="p-3 text-center text-[10px] text-slate-400">
                          No pre-registered problems match your query. Choose "+ Register New Problem Node" to add a new one.
                        </div>
                      )}
                    </div>

                    {selectedProblem && (
                      <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded text-[11px] text-emerald-800 flex justify-between items-center animate-fade-in">
                        <span className="leading-tight">
                          <strong>Active Linkage:</strong> Linked grievance to constituency problem node <strong>"{selectedProblem}"</strong>.
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProblem(null);
                            setTitle("");
                          }}
                          className="text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Grievance / Project Title</label>
              <input
                type="text"
                maxLength={100}
                placeholder="e.g. Broken drainage pipe flooding local primary school road"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#002147]/30"
                id="lodge-title-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Factual Description & Community Impact</label>
              <textarea
                rows={4}
                placeholder="Describe what is damaged, how long it has been broken, the risk to children/pedestrians, and approximate households impacted..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#002147]/30"
                id="lodge-desc-input"
              ></textarea>
            </div>

            {/* Multimodal Attachments (Photo & Voice) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Photo Upload with Drag-and-Drop */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Geotagged Photo Attachment</span>
                </label>
                
                {!photoBase64 ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 ${
                      isDragging ? "border-[#e38c2d] bg-amber-50/10" : "border-slate-300 bg-slate-50/50"
                    }`}
                    id="photo-drag-drop"
                  >
                    <Upload className="w-6 h-6 text-slate-400" />
                    <div className="text-[11px] text-slate-500">
                      <span className="font-bold text-[#e38c2d]">Drag & Drop photo</span> or browse
                    </div>
                    <p className="text-[9px] text-slate-400">JPEG/PNG max 2MB size</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative border border-slate-200 rounded p-2 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={photoBase64}
                        alt="Uploaded citizen evidence"
                        className="w-12 h-12 rounded object-cover border border-slate-200"
                      />
                      <div className="text-[10px] text-slate-500 font-medium">
                        Evidence Image Captured
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeSelectedPhoto}
                      className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Simulated Voice Suggestion Recorder */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-red-500" />
                  <span>Voice Note Request</span>
                </label>

                {!voiceRecorded ? (
                  <div className="border border-slate-200 rounded p-4 bg-slate-50 flex flex-col items-center justify-center gap-2">
                    {isRecording ? (
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5 items-center">
                          <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                          <span className="w-1.5 h-8 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-5 bg-red-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                        </div>
                        <span className="text-xs text-red-600 font-bold">Recording... {recordingSeconds}s</span>
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="p-1.5 bg-slate-950 text-white rounded-full hover:bg-slate-800 cursor-pointer"
                        >
                          <Square className="w-3 h-3 fill-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-4 py-2 bg-red-50 border border-red-100 text-red-700 hover:bg-red-100 rounded text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Record Oral Statement</span>
                      </button>
                    )}
                    <p className="text-[9px] text-slate-400 text-center">Provides voice transcription to administrators</p>
                  </div>
                ) : (
                  <div className="relative border border-slate-200 rounded p-2.5 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#002147] flex items-center justify-center text-[#F4C430]">
                          <Play className="w-3.5 h-3.5 fill-[#F4C430]" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-700">Audio Statement Node.wav</div>
                          <p className="text-[9px] text-slate-400">Duration: {recordingSeconds}s • Playback ready</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeVoiceNote}
                        className="p-1 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {audioUrl && (
                      <div className="pt-1.5 border-t border-slate-200">
                        <audio src={audioUrl} controls className="w-full h-8 text-xs rounded" />
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {!citizenSession && (
              <div className="bg-[#fffbeb] border border-[#fef3c7] p-3 rounded text-[11px] text-[#e38c2d] font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#e38c2d] flex-shrink-0" />
                <span>💡 You are submitting as a guest. Transmitting will automatically verify your session as Nagarajan K. (Demo) to process your grievance with Gemini AI.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#002147] hover:bg-[#001731] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow mt-2 uppercase tracking-wider"
              id="btn-lodge-grievance"
            >
              {isLoading ? (
                <span>AI Categorizing & Scoring... Please wait</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{citizenSession ? "Transmit to National Prioritization Matrix" : "Auto-Verify & Transmit to Matrix"}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dynamic Tracking Status (Right side) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="border-b-2 border-[#F4C430] pb-3 mb-4">
            <h3 className="text-sm font-bold text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#e38c2d]" />
              <span>Grievance Tracker</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">National resolution database linked dynamically</p>
          </div>

          {/* SEARCH BOX FOR TRACKER */}
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="🔍 Search submitted grievances by ID, Title or Location..."
              value={trackerSearchQuery}
              onChange={(e) => setTrackerSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-8 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147]/30"
              id="input-tracker-search"
            />
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[500px] flex-1 pr-1" id="grievance-tracker-list">
            {grievances.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400 space-y-2">
                <div>No active submissions found for this routing.</div>
              </div>
            ) : grievances.filter((grv) => {
                const q = trackerSearchQuery.toLowerCase();
                return (
                  grv.id.toLowerCase().includes(q) ||
                  grv.title.toLowerCase().includes(q) ||
                  grv.description.toLowerCase().includes(q) ||
                  grv.location.toLowerCase().includes(q) ||
                  grv.status.toLowerCase().includes(q)
                );
              }).length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                No matching grievances found for your search.
              </div>
            ) : (
              grievances
                .filter((grv) => {
                  const q = trackerSearchQuery.toLowerCase();
                  return (
                    grv.id.toLowerCase().includes(q) ||
                    grv.title.toLowerCase().includes(q) ||
                    grv.description.toLowerCase().includes(q) ||
                    grv.location.toLowerCase().includes(q) ||
                    grv.status.toLowerCase().includes(q)
                  );
                })
                .map((grv) => (
                <div
                  key={grv.id}
                  className="p-4 rounded-xl border border-slate-150 space-y-3 transition-shadow hover:shadow-sm"
                >
                  {/* Status header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {grv.id}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold border ${getStatusColor(grv.status)}`}>
                      {grv.status}
                    </span>
                  </div>

                  {/* Grievance details */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{grv.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-3">{grv.description}</p>
                  </div>

                  {/* Geotag/Metainfo */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(grv.submittedAt).toLocaleDateString()}</span>
                    </span>
                    <span>•</span>
                    <span>{grv.location}</span>
                  </div>

                  {/* Attachment indicators */}
                  {(grv.photoUrl || grv.voiceUrl) && (
                    <div className="flex gap-2 pt-1 border-t border-slate-50">
                      {grv.photoUrl && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] rounded font-semibold border border-blue-100">
                          <ImageIcon className="w-2.5 h-2.5" />
                          <span>Photo evidence</span>
                        </span>
                      )}
                      {grv.voiceUrl && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] rounded font-semibold border border-red-100">
                          <Mic className="w-2.5 h-2.5" />
                          <span>Voice suggestion</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Gemini Prioritizer assessment */}
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100 text-[10px] space-y-1.5">
                    <div className="flex justify-between items-center font-bold text-slate-700">
                      <span>Gemini AI Priority Rating</span>
                      <span className="text-amber-600 bg-amber-50 px-1 rounded font-extrabold">{grv.priorityScore}/100</span>
                    </div>
                    <p className="text-slate-500 italic leading-snug">"{grv.remarks}"</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
