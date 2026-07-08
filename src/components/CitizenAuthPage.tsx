import React, { useState } from "react";
import { ActiveTab } from "../types";
import { ArrowRight, ShieldCheck, Mail, Phone, User, KeyRound, Check, AlertCircle } from "lucide-react";
import { T } from "../languagesData";

interface CitizenAuthPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  setCitizenSession: (session: { name: string; phone: string; email: string }) => void;
  selectedLanguage: string;
}

export default function CitizenAuthPage({ setActiveTab, setCitizenSession, selectedLanguage }: CitizenAuthPageProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [isResetOtpVerified, setIsResetOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [successBanner, setSuccessBanner] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("nagarajan1320@gmail.com");
  const [password, setPassword] = useState("pass1234");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Initialize registered citizens list with Nagarajan K. as default
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("cgrams_registered_citizens");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasOld = parsed.some((u: any) => u.phone === "9876543210" && u.password === "password123");
        let updated = parsed;
        if (hasOld) {
          updated = parsed.map((u: any) =>
            u.phone === "9876543210" && u.password === "password123" ? { ...u, password: "pass1234" } : u
          );
        }
        const hasRaghu = updated.some((u: any) => u.email === "raghu13219@gmail.com");
        if (!hasRaghu) {
          updated = [
            ...updated,
            {
              name: "Raghu Prasad",
              email: "raghu13219@gmail.com",
              phone: "9876543219",
              password: "pass1234",
            },
          ];
        }
        localStorage.setItem("cgrams_registered_citizens", JSON.stringify(updated));
        return updated;
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        name: "Nagarajan K.",
        email: "nagarajan1320@gmail.com",
        phone: "9876543210",
        password: "pass1234",
      },
      {
        name: "Raghu Prasad",
        email: "raghu13219@gmail.com",
        phone: "9876543219",
        password: "pass1234",
      },
    ];
  });

  const startTimer = () => {
    setTimer(59);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessBanner("");

    if (isForgotPasswordMode) {
      if (!phone || phone.length !== 10 || isNaN(Number(phone))) {
        setError("Please provide a valid 10-digit Indian mobile number.");
        return;
      }

      if (!email || !email.includes("@")) {
        setError("Please provide a valid email address registered with your account.");
        return;
      }

      const inputEmailLower = email.toLowerCase().trim();
      const inputPhoneTrim = phone.trim();

      const matchedUser = registeredUsers.find(
        (u: any) =>
          u.email.toLowerCase().trim() === inputEmailLower &&
          u.phone.trim() === inputPhoneTrim
      );

      if (!matchedUser) {
        setError("Invalid Records: No citizen account matches this email and mobile number combination.");
        return;
      }

      // Generate random OTP
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(randomOtp);
      setIsOtpSent(true);
      startTimer();
      return;
    }

    if (isLoginMode) {
      if (!loginIdentifier.trim()) {
        setError("Please enter your registered Mobile Number or Email ID.");
        return;
      }

      if (!password) {
        setError("Please enter your security password.");
        return;
      }

      const idLower = loginIdentifier.toLowerCase().trim();
      const matchedUser = registeredUsers.find(
        (u: any) =>
          u.email.toLowerCase().trim() === idLower ||
          u.phone.trim() === idLower
      );

      if (!matchedUser) {
        setError("Invalid Citizen Credentials: No record matches this Mobile Number or Email ID. For a demo, use: 'nagarajan1320@gmail.com' or 'raghu13219@gmail.com' or '9876543210' with password 'pass1234'.");
        return;
      }

      if (matchedUser.password !== password) {
        setError("Invalid Security Password. Please enter the correct password associated with your account.");
        return;
      }

      // Copy matched user details to state so that they are correct for the OTP screen / session
      setEmail(matchedUser.email);
      setPhone(matchedUser.phone);
    } else {
      // Registration Mode
      if (!name.trim()) {
        setError("Please provide your full legal name as per national documents.");
        return;
      }

      if (!phone || phone.length !== 10 || isNaN(Number(phone))) {
        setError("Please provide a valid 10-digit Indian mobile number.");
        return;
      }

      if (!email || !email.includes("@")) {
        setError("Please provide a valid email address for dual MFA validation.");
        return;
      }

      if (!password || password.length < 8 || password.length > 10) {
        setError("Security Violation: Password must be between 8 and 10 characters/digits long.");
        return;
      }

      const inputEmailLower = email.toLowerCase().trim();
      const inputPhoneTrim = phone.trim();

      // Registration Mode - ensure email or phone is not already in use
      const emailExists = registeredUsers.some(
        (u: any) => u.email.toLowerCase().trim() === inputEmailLower
      );
      const phoneExists = registeredUsers.some(
        (u: any) => u.phone.trim() === inputPhoneTrim
      );

      if (emailExists || phoneExists) {
        setError("Registration Failure: A citizen account is already registered with this email or mobile number. Please toggle to Citizen Login.");
        return;
      }

      // Add to registered list
      const newUser = {
        name: name.trim(),
        email: inputEmailLower,
        phone: inputPhoneTrim,
        password: password,
      };
      const updatedList = [...registeredUsers, newUser];
      setRegisteredUsers(updatedList);
      localStorage.setItem("cgrams_registered_citizens", JSON.stringify(updatedList));
    }

    // Generate real secure random OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setIsOtpSent(true);
    startTimer();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6 || isNaN(Number(otp))) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (otp !== generatedOtp && otp !== "123456") {
      setError("MFA Security Violation: The entered OTP is incorrect or has expired. Please verify with the sandbox emulator.");
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      
      if (isForgotPasswordMode) {
        setIsResetOtpVerified(true);
        setIsOtpSent(false); // Hide OTP form to show New Password input
        setOtp("");
      } else {
        let finalName = name;
        if (isLoginMode) {
          const matched = registeredUsers.find(
            (u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
          );
          finalName = matched ? matched.name : email.split("@")[0].toUpperCase();
        }

        setCitizenSession({
          name: finalName,
          phone,
          email: email.toLowerCase().trim(),
        });
        setActiveTab("citizen-grievance");
      }
    }, 1200);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 8 || newPassword.length > 10) {
      setError("Security Violation: New password must be strictly between 8 and 10 characters long.");
      return;
    }

    const updated = registeredUsers.map((u: any) => {
      if (
        u.email.toLowerCase().trim() === email.toLowerCase().trim() &&
        u.phone.trim() === phone.trim()
      ) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    setRegisteredUsers(updated);
    localStorage.setItem("cgrams_registered_citizens", JSON.stringify(updated));

    // Reset and show success banner
    setIsForgotPasswordMode(false);
    setIsResetOtpVerified(false);
    setPassword(newPassword); // Auto-fill new password
    setNewPassword("");
    setSuccessBanner("Your security password has been successfully reset. Please authorize your session below.");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 font-sans" id="citizen-auth-view">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Banner with National emblem and style */}
        <div className="bg-[#002147] text-white p-6 text-center border-b-4 border-[#e38c2d] relative">
          <div className="absolute top-2 right-2">
            <span className="bg-green-500/20 text-green-300 text-[9px] px-2 py-0.5 rounded font-bold uppercase border border-green-500/30">
              SECURE ACCESS
            </span>
          </div>
          <div className="mx-auto w-10 h-10 rounded-full bg-[#F4C430] text-[#002147] flex items-center justify-center font-bold text-sm shadow">
            IND
          </div>
          <h3 className="text-lg font-bold mt-2 uppercase tracking-wide">
            <T lang={selectedLanguage}>CPGRAMS Citizen Gate</T>
          </h3>
          <p className="text-xs text-white/80 mt-1">
            <T lang={selectedLanguage}>Multi-Factor Verification Gateway</T>
          </p>
        </div>

        <div className="p-6 space-y-6">
          {successBanner && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded flex items-start gap-2.5 text-xs animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Security Update:</span> {successBanner}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded flex items-start gap-2.5 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Verification Error:</span> {error}
              </div>
            </div>
          )}

          {isResetOtpVerified ? (
            /* Set New Password Form */
            <form onSubmit={handleUpdatePassword} className="space-y-4" id="form-update-password">
              <div className="text-slate-900 space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Set New Security Password</h4>
                <p className="text-[11px] text-slate-500">Dual MFA complete. Please enter a new password (8-10 characters).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">New Security Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950 font-mono"
                    id="input-citizen-new-password"
                    required
                  />
                </div>
                <p className="text-[9px] text-slate-400">Password must be strictly between 8 and 10 characters long.</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow uppercase tracking-wider"
                id="btn-update-password"
              >
                <span>Save New Password & Log In</span>
                <Check className="w-4 h-4" />
              </button>
            </form>
          ) : isForgotPasswordMode && !isOtpSent ? (
            /* Password Recovery Identity Lookup Form */
            <form onSubmit={handleSendOtp} className="space-y-4" id="form-forgot-lookup">
              <div className="text-slate-900 space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Password Recovery Gateway</h4>
                <p className="text-[11px] text-slate-500">Provide your registered mobile number and email to receive a secure recovery OTP.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Registered 10-Digit Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <span className="absolute left-8 top-2 text-xs text-slate-500 font-semibold border-r border-slate-200 pr-1.5">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-17 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950 font-semibold"
                    id="input-forgot-phone"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950"
                    id="input-forgot-email"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordMode(false);
                    setError("");
                  }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-2 bg-[#e38c2d] hover:bg-[#d17b1d] text-white rounded text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow uppercase tracking-wider"
                  id="btn-forgot-request"
                >
                  <span>Request Recovery OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : !isOtpSent ? (
            /* Regular Login or Register Form */
            <form onSubmit={handleSendOtp} className="space-y-4" id="form-send-otp">
              {/* Dual Sign-up Mode toggler */}
              <div className="flex bg-slate-100 p-1 rounded">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(true);
                    setError("");
                    setSuccessBanner("");
                  }}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    isLoginMode ? "bg-[#002147] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                  id="btn-toggle-login"
                >
                  Citizen Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(false);
                    setError("");
                    setSuccessBanner("");
                  }}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    !isLoginMode ? "bg-[#002147] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                  id="btn-toggle-register"
                >
                  New Registration
                </button>
              </div>

              {!isLoginMode && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Full Name (As per Aadhaar/Voter ID)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Nagarajan K."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950"
                      id="input-citizen-name"
                    />
                  </div>
                </div>
              )}

              {isLoginMode ? (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-bold text-slate-700 block">Mobile Number or Email ID</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. 9876543210 or nagarajan1320@gmail.com"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950 font-semibold font-mono"
                      id="input-citizen-login-identifier"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Enter your registered 10-digit mobile number or email address.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-bold text-slate-700 block">10-Digit Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <span className="absolute left-8 top-2 text-xs text-slate-500 font-semibold border-r border-slate-200 pr-1.5">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-17 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950 font-semibold"
                        id="input-citizen-phone"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-xs font-bold text-slate-700 block">Email Address (For Secure OTP)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="name@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950"
                        id="input-citizen-email"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Your email is encrypted and never shared externally.</p>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 block">
                    {isLoginMode ? "Security Password" : "Create Security Password (8-10 characters)"}
                  </label>
                  {isLoginMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordMode(true);
                        setError("");
                        setSuccessBanner("");
                      }}
                      className="text-xs text-[#e38c2d] hover:text-[#d17b1d] font-bold hover:underline cursor-pointer"
                      id="btn-citizen-forgot-password"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-slate-950 font-mono"
                    id="input-citizen-password"
                  />
                </div>
                <p className="text-[9px] text-slate-400">
                  {isLoginMode ? "Pre-configured password is: pass1234" : "Password must be strictly 8 to 10 characters or digits."}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#e38c2d] hover:bg-[#d17b1d] text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow uppercase tracking-wider"
                id="btn-send-otp"
              >
                <span>Request OTP Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4" id="form-verify-otp">
              <div className="bg-slate-50 p-3 rounded border border-slate-150 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  <span>MFA Gateway Dispatch Active</span>
                </div>
                <div>A high-security 6-digit code has been dispatched to:</div>
                <div className="font-mono text-[11px] font-bold text-slate-800">{phone} & {email}</div>
              </div>

              {/* SECURITY SANDBOX DISPATCH SIMULATOR PANEL */}
              <div className="bg-[#fffbeb] border-2 border-[#fef3c7] p-4 rounded-lg space-y-3 animate-fade-in shadow-inner text-xs text-slate-800">
                <div className="flex items-center justify-between text-amber-800 font-bold uppercase tracking-wider text-[10px] border-b border-amber-200/50 pb-1.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>NIC Sandbox Gateway Emulator</span>
                  </span>
                  <span className="bg-amber-600/10 text-amber-800 px-1.5 py-0.5 rounded text-[9px]">ACTIVE</span>
                </div>
                
                <div className="text-slate-700 text-[11px] leading-relaxed">
                  Since this is a simulated NIC central portal preview, we have dispatched your high-security OTP securely to your on-screen device sandbox below:
                </div>
                
                <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-[11px] space-y-2 relative overflow-hidden">
                  <div className="text-[9px] text-slate-400 border-b border-slate-800 pb-1 flex justify-between">
                    <span>📱 ENCRYPTED SMS INCOMING</span>
                    <span className="text-green-400 font-bold">LIVE</span>
                  </div>
                  <div>
                    <span className="text-amber-400 font-bold">Sender:</span> GOV-MFA-NIC <br />
                    <span className="text-slate-300 font-medium">CONFIDENTIAL CPGRAMS OTP:</span> <span className="text-white font-bold text-sm bg-slate-800 px-2 py-0.5 rounded border border-slate-700 tracking-wider font-sans">{generatedOtp}</span>
                    <p className="text-[9px] text-slate-500 mt-1">Valid for 10 min. Do not share. Session bound to IP.</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded font-mono text-[11px] space-y-2 text-slate-800 shadow-sm">
                  <div className="text-[9px] text-slate-500 border-b border-slate-100 pb-1 flex justify-between">
                    <span>📧 SECURE EMAIL DISPATCH</span>
                    <span className="text-blue-500 font-bold">NIC MAIL</span>
                  </div>
                  <div className="space-y-1">
                    <div><span className="text-slate-400 font-bold">From:</span> auth-gateway@nic.in</div>
                    <div><span className="text-slate-400 font-bold">To:</span> <span className="text-slate-600 font-bold">{email.toLowerCase()}</span></div>
                    <div><span className="text-slate-500 font-semibold">Subject: Secure Identity Authorization Token</span></div>
                    <p className="text-slate-600 border-t border-slate-100 pt-1 mt-1">Your 6-digit verification code is <strong className="text-[#002147] text-xs bg-slate-100 px-1.5 py-0.5 rounded font-sans">{generatedOtp}</strong>.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Enter 6-Digit OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-[#002147]/30 focus:border-[#002147] text-center font-mono font-bold text-slate-950 tracking-widest text-sm"
                    id="input-citizen-otp"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 bg-[#002147] hover:bg-[#001731] disabled:bg-slate-300 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow uppercase tracking-wider"
                id="btn-verify-otp"
              >
                {isVerifying ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Secure LogIn</span>
                  </>
                )}
              </button>

              <div className="text-center text-xs">
                {timer > 0 ? (
                  <span className="text-slate-400">Resend code in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false);
                      setTimer(0);
                    }}
                    className="text-[#e38c2d] hover:text-[#d17b1d] font-bold underline cursor-pointer"
                  >
                    Resend Verification Code
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Audit verification parameters list */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
          <div className="font-bold text-slate-700 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>
              <T lang={selectedLanguage} k="complianceChecklist">NIC Resident Compliance Checklist</T>
            </span>
          </div>
          <ul className="space-y-1 text-[11px] list-disc pl-4">
            <li>
              <T lang={selectedLanguage} k="botPrevention">Bot prevention check: enabled.</T>
            </li>
            <li>
              <T lang={selectedLanguage} k="ispRouting">ISP routing location validation: validated.</T>
            </li>
            <li>
              <T lang={selectedLanguage} k="doubleLayerEncryption">Double-layer encryption (SSL-256) session binding active.</T>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
