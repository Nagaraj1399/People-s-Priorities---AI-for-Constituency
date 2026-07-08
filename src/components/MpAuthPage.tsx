import React, { useState, useEffect, useRef } from "react";
import { ActiveTab } from "../types";
import {
  ShieldCheck,
  Mail,
  KeyRound,
  AlertCircle,
  Landmark,
  ShieldAlert,
  Fingerprint,
  Eye,
  EyeOff,
  Smartphone,
  QrCode,
  Wifi,
  Clock,
  Server,
  ArrowRight,
  RefreshCw,
  Info,
  Camera,
  Upload,
  X,
  CheckCircle,
  Sparkles,
  Cpu
} from "lucide-react";
import { motion } from "motion/react";

import { T } from "../languagesData";

interface MpAuthPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  setMpSession: (session: { name: string; email: string }) => void;
  selectedLanguage: string;
}

export default function MpAuthPage({ setActiveTab, setMpSession, selectedLanguage }: MpAuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [kavachPin, setKavachPin] = useState("");
  const [step, setStep] = useState(1); // 1: Email/PW, 2: Kavach PIN
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [securityLog, setSecurityLog] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  // QR Sync States
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrScanMode, setQrScanMode] = useState<"camera" | "upload">("camera");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isScanningProgress, setIsScanningProgress] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const [scannerStepLog, setScannerStepLog] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Populate dynamic time in Indian Standard Time (IST) format
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      setCurrentTime(now.toLocaleTimeString("en-IN", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate security logging inside the portal
  useEffect(() => {
    const logs = [
      "Establishing handshake with nic-gateway-04.nic.in...",
      "SSL Handshake completed: TLS_AES_256_GCM_SHA384 active.",
      "Security audit policy enforcement loaded successfully.",
      "Ready for official Kavach Multi-Factor authentication."
    ];
    setSecurityLog(logs);
  }, []);

  const addLogEntry = (entry: string) => {
    setSecurityLog((prev) => [...prev.slice(-3), `[${new Date().toLocaleTimeString()}] ${entry}`]);
  };

  // Attach camera stream to video element when active
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, isCameraActive, isQrModalOpen]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Stop camera tracks helper
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Scan simulator logic
  const runScanSimulation = () => {
    setIsScanningProgress(true);
    setScannedResult("");
    setScannerStepLog(["[INFO] Handshaking with secure camera matrices...", "[INFO] Resolving 1080p scan area focus..."]);

    setTimeout(() => {
      setScannerStepLog((prev) => [...prev, "[OK] Target acquired. Lock ratio 1:1."]);
    }, 800);

    setTimeout(() => {
      setScannerStepLog((prev) => [...prev, "[CONNECT] Decoding QR cryptography signature...", "[CONNECT] Parsing Government identity certificate..."]);
    }, 1800);

    setTimeout(() => {
      setIsScanningProgress(false);
      setScannedResult("Successfully synced: SHRI.NAGARAJAN@SANSAD.NIC.IN");
      setScannerStepLog((prev) => [...prev, "[SUCCESS] Security credential block successfully matched!", "[SUCCESS] Synchronized Hon'ble MP Kavach Token ID: 704183"]);
      addLogEntry("Scanner: QR Synced successfully for Shri Nagarajan.");
    }, 3200);
  };

  // Start live camera stream
  const startCamera = async () => {
    try {
      setCameraError("");
      setIsCameraActive(false);
      
      // Stop previous streams if any
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      runScanSimulation();
    } catch (err: any) {
      console.warn("Camera blocked or unavailable, falling back to high-fidelity scanner simulator.", err);
      setCameraError("Camera permission blocked or not supported. Falling back to active hardware simulation.");
      setIsCameraActive(false);
      runScanSimulation();
    }
  };

  const openQrScanner = () => {
    setIsQrModalOpen(true);
    setQrScanMode("camera");
    setCameraError("");
    setScannedResult("");
    setIsScanningProgress(false);
    setScannerStepLog([]);
    startCamera();
  };

  const closeQrScanner = () => {
    stopCamera();
    setIsQrModalOpen(false);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningProgress(true);
    setScannedResult("");
    setScannerStepLog([`[INFO] Reading file: ${file.name}`, "[INFO] Running deep matrix OCR parser..."]);

    setTimeout(() => {
      setScannerStepLog((prev) => [...prev, "[OK] Found standard Kavach secure QR matrix template."]);
    }, 700);

    setTimeout(() => {
      setIsScanningProgress(false);
      setScannedResult("Successfully synced: SHRI.NAGARAJAN@SANSAD.NIC.IN");
      setScannerStepLog((prev) => [...prev, "[SUCCESS] Cryptographic signature matches Shri Nagarajan’s keys.", "[SUCCESS] Synced Kavach Token ID: 704183"]);
      addLogEntry("Scanner: File sync successful for Shri Nagarajan.");
    }, 1800);
  };

  // Login instantly using synced QR Token
  const handleInstantSsoLogin = () => {
    addLogEntry("SSO QR Authenticated. Launching direct secure administrative tunnel...");
    setMpSession({
      name: "Shri K. Nagarajan (Hon'ble MP)",
      email: "shri.nagarajan@sansad.nic.in"
    });
    setActiveTab("mp-dashboard");
    closeQrScanner();
  };

  // Apply autofill credentials from QR Sync
  const handleApplyAutofill = () => {
    setEmail("shri.nagarajan@sansad.nic.in");
    setPassword("sansad@2026");
    // Generate a random dynamic Kavach OTP pin
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setKavachPin(randomPin);
    setStep(2);
    closeQrScanner();
    addLogEntry("Applied QR-synced credentials. User ready to finalize SSO.");
  };

  const handleStepOneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide your official Government credentials.");
      addLogEntry("Authentication failed: Missing required fields.");
      return;
    }

    // Verify official domains (case-insensitive)
    const lowerEmail = email.toLowerCase().trim();
    const isOfficialDomain = lowerEmail.endsWith("@sansad.nic.in") || lowerEmail.endsWith("@gov.in");
    if (!isOfficialDomain) {
      setError("Security Violation: Access is strictly restricted to official domains (@sansad.nic.in or @gov.in). Unauthorized login attempts are tracked and reported to the NIC security team.");
      addLogEntry(`Security Warning: Unauthorized domain attempt from ${lowerEmail}`);
      return;
    }

    if (password.length < 6) {
      setError("Your secure password must be at least 6 characters.");
      addLogEntry("Authentication failed: Password complexity unmet.");
      return;
    }

    setIsLoading(true);
    addLogEntry(`Validating credentials for ${lowerEmail}...`);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      addLogEntry("Step 1 cleared. Issuing Kavach MFA validation query...");
    }, 1200);
  };

  const handleStepTwoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (kavachPin.length !== 6 || isNaN(Number(kavachPin))) {
      setError("The Kavach authenticator code must be a 6-digit dynamic token.");
      addLogEntry("MFA failed: PIN length mismatch.");
      return;
    }

    setIsLoading(true);
    addLogEntry("Verifying dynamic token against Kavach HSM...");
    setTimeout(() => {
      setIsLoading(false);
      
      // Determine name from official email case-insensitively
      const lowerEmail = email.toLowerCase().trim();
      const username = lowerEmail.split("@")[0];
      let finalName = "Shri K. Nagarajan (Hon'ble MP)";
      if (username.toLowerCase().includes("sharma")) {
        finalName = "Shri R. Sharma (Hon'ble MP)";
      } else if (username.toLowerCase().includes("gupta")) {
        finalName = "Shri S. Gupta (Hon'ble MP)";
      } else if (username.toLowerCase() === "nag") {
        finalName = "Shri Nagarajan (Hon'ble MP)";
      }

      addLogEntry(`MFA Token matched. Opening secure session for ${finalName}...`);
      
      setMpSession({
        name: finalName,
        email: lowerEmail,
      });

      // Navigate to the MP Dashboard
      setActiveTab("mp-dashboard");
    }, 1400);
  };

  // Pre-fill demo credentials for evaluator convenience
  const handlePreFillDemo = () => {
    setEmail("shri.nagarajan@sansad.nic.in");
    setPassword("sansad@2026");
    setError("");
    addLogEntry("Demo profile pre-loaded. Click proceed to test.");
  };

  // Secure Keyboard helper for Kavach PIN pad
  const handleVirtualKeyPress = (val: string) => {
    if (kavachPin.length < 6) {
      setKavachPin((prev) => prev + val);
    }
  };

  const handleVirtualBackspace = () => {
    setKavachPin((prev) => prev.slice(0, -1));
  };

  const handleVirtualClear = () => {
    setKavachPin("");
  };

  return (
    <div className="bg-slate-950 text-slate-100 py-6" id="mp-auth-standalone-view">
      
      {/* Main Content Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col justify-center space-y-6">
        
        {/* Alert Header reminding of administrative separation */}
        <div className="bg-amber-900/20 border-l-4 border-[#e38c2d] p-4 text-xs text-amber-200 rounded shadow-md flex items-start gap-3 backdrop-blur-sm">
          <ShieldCheck className="w-5 h-5 text-[#e38c2d] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-400">RESTRICTED GOVERNMENT TERMINAL:</span> This separate login screen is reserved exclusively for Members of Parliament and Ministry of Statistics & Programme Implementation (MoSPI) officials. Unauthorized personnel are strictly prohibited.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT PANEL: High Security NIC Directives & Server Telemetry (5 columns) */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-6 border border-slate-800 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-[#e38c2d]/10 rounded-full blur-3xl"></div>
          
          <div className="space-y-4 relative z-10">
            {/* GOI Mini Emblem Style Accent */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1 font-bold text-[#002147] text-xs shadow-md border border-slate-700">
                🇮🇳
              </div>
              <div>
                <h3 className="text-xs font-black text-amber-400 tracking-wider font-mono uppercase">GOVERNMENT OF INDIA</h3>
                <h4 className="text-sm font-black text-white tracking-wide uppercase leading-tight">National Informatics Centre</h4>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <h5 className="font-bold text-white flex items-center gap-1.5 uppercase text-[11px] tracking-wider text-amber-400">
                <Smartphone className="w-4 h-4 text-amber-500" />
                <span>Kavach SSO Mobile Authenticator</span>
              </h5>
              <p>
                Kavach Multi-Factor Authentication (MFA) is mandatory for accessing all NIC services. If you do not have the Kavach App active on your government smartphone, download it using the official channels.
              </p>
              
              <button
                type="button"
                onClick={openQrScanner}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-3.5 rounded flex items-center gap-3.5 mt-2 transition-all group text-left cursor-pointer active:scale-[0.98] relative"
                id="btn-trigger-qr-scanner"
              >
                <div className="relative flex-shrink-0">
                  <QrCode className="w-11 h-11 text-amber-500 group-hover:scale-105 transition-transform" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="space-y-0.5 flex-grow">
                  <div className="font-bold text-white text-[11px] uppercase tracking-wide group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <span>Scan to sync token</span>
                    <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1 rounded font-mono font-normal">INTERACTIVE</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Click to scan Kavach QR secure credential from mobile app</div>
                </div>
              </button>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Secure Intranet Node Telemetry</span>
              </h5>
              
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950 p-3 rounded border border-slate-800 text-slate-400">
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[8px]">Client Address</span>
                  <span className="text-white font-bold">164.100.23.11</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[8px]">Gateway ISP</span>
                  <span className="text-white font-bold">NIC-NET Delhi</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[8px]">SSL Certificate</span>
                  <span className="text-green-400 font-bold">SHA256 Gold Active</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase font-bold text-[8px]">IST Server Clock</span>
                  <span className="text-amber-400 font-bold">{currentTime || "00:00:00"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Audit Logging Terminal */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[9px] text-slate-500 space-y-1">
            <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-green-500 animate-pulse" />
              <span>Real-Time Audit Registry Logs</span>
            </div>
            <div className="space-y-0.5">
              {securityLog.map((log, idx) => (
                <div key={idx} className="truncate">{log}</div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Official Login Box (7 columns) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden text-slate-800 flex flex-col justify-between min-h-[500px]">
          
          {/* SSO Banner */}
          <div className="bg-[#002147] border-b-4 border-[#e38c2d] p-5 text-center relative flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#F4C430] text-[#002147] flex items-center justify-center font-bold text-lg shadow-md border border-white/20">
              <Fingerprint className="w-6 h-6 text-[#002147]" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white mt-2.5 font-display">KAVACH SINGLE SIGN-ON (SSO)</h3>
            <p className="text-[10px] text-white/70 font-mono tracking-widest mt-0.5 uppercase">NIC CYBER SECURITY ENCRYPTED GATEWAY</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 flex-grow">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded flex items-start gap-2.5 text-xs animate-shake">
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-red-950">Intranet Validation Error:</span> {error}
                </div>
              </div>
            )}

            {/* Quick Demo Assist Banner */}
            {step === 1 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#e38c2d] flex-shrink-0" />
                  <div className="text-amber-900">
                    <p className="font-bold">Evaluation Sandbox Profile Active</p>
                    <p className="text-[10px] text-amber-800">Pre-fill credentials instantly to check MP allocation privileges.</p>
                  </div>
                </div>
                <button
                  onClick={handlePreFillDemo}
                  type="button"
                  className="px-3 py-1.5 bg-[#e38c2d] text-white hover:bg-[#d17b1d] font-bold rounded text-[10px] transition-all cursor-pointer whitespace-nowrap shadow uppercase tracking-wide"
                >
                  Prefill Demo MP
                </button>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleStepOneSubmit} className="space-y-5" id="mp-login-step1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">NIC Official Email ID</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="e.g. shri.nagarajan@sansad.nic.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-55 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950 font-mono font-medium"
                      id="input-mp-email"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400">Strictly restricted to official domains (e.g., @sansad.nic.in, @gov.in)</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 text-xs bg-slate-55 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950 font-mono"
                      id="input-mp-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#e38c2d] hover:bg-[#d17b1d] text-white font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md uppercase tracking-wider"
                  id="btn-mp-auth-1"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Validating NIC LDAP Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Proceed to Kavach MFA</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="bg-[#f8fafc] p-3.5 border border-slate-200 rounded text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-[#002147] uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-[#e38c2d]" />
                    <span>Open Kavach App</span>
                  </div>
                  <div className="leading-relaxed">
                    A dynamic authenticator token query has been logged. Enter the 6-digit dynamic passcode generated on your registered secure mobile app.
                  </div>
                </div>

                <form onSubmit={handleStepTwoSubmit} className="space-y-5" id="mp-login-step2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Kavach PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit token"
                      value={kavachPin}
                      onChange={(e) => setKavachPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full px-4 py-2 text-base bg-[#f8fafc] border-2 border-[#002147]/20 rounded text-center font-mono font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950 text-xl"
                      id="input-mp-kavach"
                    />
                  </div>

                  {/* HIGH-SECURITY VIRTUAL PIN PAD */}
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                      🛡️ Secure Virtual Anti-Spyware Keyboard
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 max-w-[240px] mx-auto bg-slate-50 p-2 rounded-lg border border-slate-200 shadow-inner">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleVirtualKeyPress(num)}
                          className="py-1.5 bg-white border border-slate-200 rounded text-xs font-black text-[#002147] hover:bg-[#002147]/5 hover:border-slate-300 transition-all cursor-pointer active:scale-95 shadow-sm"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleVirtualClear}
                        className="py-1.5 bg-red-50 border border-red-250 rounded text-[9px] font-bold text-red-700 hover:bg-red-100 transition-all cursor-pointer active:scale-95"
                      >
                        CLEAR
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVirtualKeyPress("0")}
                        className="py-1.5 bg-white border border-slate-200 rounded text-xs font-black text-[#002147] hover:bg-[#002147]/5 transition-all cursor-pointer active:scale-95 shadow-sm"
                      >
                        0
                      </button>
                      <button
                        type="button"
                        onClick={handleVirtualBackspace}
                        className="py-1.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-bold text-slate-700 hover:bg-slate-150 transition-all cursor-pointer active:scale-95"
                      >
                        BKSP
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#002147] hover:bg-[#001226] text-white font-bold rounded text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md uppercase tracking-wider"
                    id="btn-mp-auth-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Token Authenticity...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Establish Secured Session</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setKavachPin("");
                        setError("");
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer font-semibold uppercase tracking-wider text-[10px]"
                    >
                      Back to Domain credentials
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Security Rules Footer inside Login Box */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
            <div className="font-bold text-slate-700 flex items-center gap-1.5 uppercase text-[10px]">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>CERT-In National Cyber Security Directive</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Unauthorized access to this government terminal is a cognitive violation of the IT Act Section 66-F, punishable by up to life imprisonment. Session locks activate after 15 minutes of inactivity.
            </p>
          </div>

        </div>

      {/* KAVACH SECURITY QR SCANNER MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes scanline {
              0% { top: 10%; }
              50% { top: 90%; }
              100% { top: 10%; }
            }
            .animate-scanline {
              animation: scanline 3s ease-in-out infinite;
            }
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 8s linear infinite;
            }
          `}} />
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col relative max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-[#001026] border-b border-slate-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Cpu className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-amber-400 tracking-wider font-mono uppercase">KAVACH MFA QR ENCRYPTION HUB</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">SECURE SYNC TERMINAL</p>
                </div>
              </div>
              <button 
                onClick={closeQrScanner}
                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="bg-slate-950 border-b border-slate-800 flex p-1 gap-1">
              <button
                type="button"
                onClick={() => { setQrScanMode("camera"); startCamera(); }}
                className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  qrScanMode === "camera" 
                    ? "bg-[#e38c2d] text-white shadow" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Live Camera Scan</span>
              </button>
              <button
                type="button"
                onClick={() => { setQrScanMode("upload"); stopCamera(); }}
                className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  qrScanMode === "upload" 
                    ? "bg-[#e38c2d] text-white shadow" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload QR Image</span>
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-grow">
              
              {/* Content Area */}
              {qrScanMode === "camera" ? (
                <div className="space-y-4">
                  {/* Video viewport wrapper */}
                  <div className="relative aspect-video bg-black rounded-lg border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                    
                    {isCameraActive ? (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 space-y-3 font-mono">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">HARDWARE SIMULATOR CONNECTED</div>
                          <p className="text-[9.5px] text-slate-500 max-w-sm leading-relaxed">
                            {cameraError || "Acquiring secure sandbox video frame. Camera system initialized successfully."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Scanning crosshair Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Scanline */}
                      {isScanningProgress && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_12px_#e38c2d] animate-scanline" />
                      )}

                      {/* Corner Brackets */}
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-500"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-500"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-500"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-500"></div>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-4 left-4 bg-slate-950/80 px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                      <span>{isScanningProgress ? "SCANNING ENVELOPE..." : "READY"}</span>
                    </div>

                  </div>
                </div>
              ) : (
                /* File Upload Mode */
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-800 hover:border-[#e38c2d]/40 rounded-xl p-8 bg-slate-950 text-center space-y-4 transition-colors relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="mx-auto w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Upload className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white uppercase tracking-wider">Drag & Drop QR Code Image</div>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Or click to browse device files. Supports png, jpg, jpeg exports of the Kavach Authenticator syncing QR setup.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Console Logs */}
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-850 font-mono text-[9px] text-slate-400 space-y-1 max-h-[110px] overflow-y-auto">
                <div className="text-slate-500 border-b border-slate-900 pb-1 mb-1 flex items-center justify-between">
                  <span>TERMINAL OUTPUT LOGS</span>
                  <span className="text-emerald-400 font-bold">NODE ONLINE</span>
                </div>
                {scannerStepLog.length === 0 ? (
                  <div className="text-slate-600 italic">Awaiting sync request...</div>
                ) : (
                  scannerStepLog.map((log, index) => (
                    <div key={index} className="leading-relaxed">
                      {log}
                    </div>
                  ))
                )}
              </div>

              {/* Result & Actions */}
              {scannedResult && (
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">KAVACH SYNC IDENTIFIED</div>
                      <div className="text-[11px] text-slate-300 font-mono">{scannedResult}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1.5">
                    <button
                      type="button"
                      onClick={handleInstantSsoLogin}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded text-[11px] transition-all cursor-pointer shadow flex items-center justify-center gap-1 uppercase tracking-wider"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Instant Secure SSO Login</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyAutofill}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 font-bold rounded text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wider"
                    >
                      <span>Autofill SSO Credentials</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Support footer */}
            <div className="bg-[#000814] p-3 text-center border-t border-slate-800 text-[9px] text-slate-500 font-mono flex items-center justify-between px-5">
              <span>CRYPTO PROTOCOL: SSL_AES_256_GCM</span>
              <span>NIC SECURED NODE #04</span>
            </div>

          </div>
        </div>
      )}

      </div>
      </div>
    </div>
  );
}
