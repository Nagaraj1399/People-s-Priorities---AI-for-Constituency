import React, { useState, useEffect } from "react";
import { Language } from "./types";

export const OFFICIAL_LANGUAGES: Language[] = [
  { code: "en", nativeName: "English", englishName: "English" },
  { code: "hi", nativeName: "हिन्दी", englishName: "Hindi" },
  { code: "bn", nativeName: "বাংলা", englishName: "Bengali" },
  { code: "te", nativeName: "తెలుగు", englishName: "Telugu" },
  { code: "mr", nativeName: "मराठी", englishName: "Marathi" },
  { code: "ta", nativeName: "தமிழ்", englishName: "Tamil" },
  { code: "ur", nativeName: "اردو", englishName: "Urdu" },
  { code: "gu", nativeName: "ગુજરાતી", englishName: "Gujarati" },
  { code: "kn", nativeName: "ಕನ್ನಡ", englishName: "Kannada" },
  { code: "or", nativeName: "ଓଡ଼ିଆ", englishName: "Odia" },
  { code: "ml", nativeName: "മലയാളം", englishName: "Malayalam" },
  { code: "pa", nativeName: "ਪੰਜਾਬੀ", englishName: "Punjabi" },
  { code: "as", nativeName: "অসমীয়া", englishName: "Assamese" },
  { code: "ma", nativeName: "मैथिली", englishName: "Maithili" },
  { code: "ks", nativeName: "کٲشُر", englishName: "Kashmiri" },
  { code: "sd", nativeName: "سنڌي", englishName: "Sindhi" },
  { code: "sa", nativeName: "संस्कृतम्", englishName: "Sanskrit" },
  { code: "ne", nativeName: "नेपाली", englishName: "Nepali" },
  { code: "ko", nativeName: "कोंकणी", englishName: "Konkani" },
  { code: "bo", nativeName: "बोडो", englishName: "Bodo" },
  { code: "do", nativeName: "डोगरी", englishName: "Dogri" },
  { code: "sat", nativeName: "संताली", englishName: "Santali" },
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    portalName: "National Citizen Redressal & Project Prioritisation Portal",
    ministry: "Ministry of Statistics, Programme Implementation & National Informatics Centre",
    tagline: "Satyamev Jayate • Transparent Administration for Citizen Prosperity",
    welcome: "Welcome to the Unified National Redressal Platform",
    subWelcome: "Express grievances, request local development projects, and monitor MPLADS sanctioning transparently.",
    citizenLogin: "Citizen Login / Register",
    officialLogin: "NIC Kavach Login (Official)",
    activeGrievances: "Active Grievances",
    sanctionedFunds: "Sanctioned Funds (Lakhs)",
    totalProjects: "Prioritised Projects",
    resolvedGrievances: "Resolved Grievances",
    submitGrievance: "Submit New Grievance",
    trackStatus: "Track Submissions",
    kavachBadge: "NIC Verified Security Environment • Kavach SSO Integration",
    tickerTitle: "Gov Alert Ticker",
    tickerBody: "Note: Under NIC guidelines, all Members of Parliament must utilize official @sansad.nic.in credentials linked to their Kavach MFA application. Citizen grievances require 10-digit authentic phone validation.",
    howItWorks: "How It Works: Integrated Administrative Framework",
    step1Title: "Citizen Voice",
    step1Desc: "Citizens submit infrastructural challenges via textual description, audio recordings (with automated AI transcribing), or geotagged media.",
    step2Title: "Gemini API Scoring",
    step2Desc: "Gemini classifies proposals, parses keywords, assesses national census indexes and maps urgency ratings into an AI priority score.",
    step3Title: "MP Fund Sanction",
    step3Desc: "Hon'ble MPs review highly-prioritized proposals, allocate MPLADS funds securely via verified digital Kavach authorization.",
    recentClearances: "Recent Development Clearances (MoSPI Dashboard)",
    gatewayTitle: "NIC Secured Gateway Selector • Kavach SSO Enforced",
    mainHeading: "National Citizen Redressal & Project Prioritisation Portal",
    welcomeDesc: "Welcome to the unified digital administration portal of the Government of India. In accordance with national cyber security directives, all public records and administrative metrics require identity authorization.",
    citizenGateTitle: "CPGRAMS Citizen Gate",
    citizenGateSub: "Public Redressal Node",
    citizenGateDesc: "Dedicated gateway for residents of India to voice community grievances, upload geotagged photo evidence, record verbal suggestion requests, and track municipal resolution progress.",
    citizenGateBtn: "Authenticate Citizen Access",
    mpGateTitle: "MoSPI Hon'ble MP Gate",
    mpGateSub: "Secured Administrative Node",
    mpGateDesc: "Restricted portal for Members of Parliament and Ministry of Statistics & Programme Implementation (MoSPI) officers to review citizen inputs, set weight formulas, and sanction funds.",
    mpGateBtn: "Official MP Secure Login",
    securityAdvisory: "CYBERSECURITY ADVISORY (IT ACT SEC 66-F)",
    securityAdvisoryDesc: "Access to this system is monitored. Any unauthorized attempts to bypass, intercept or falsify credentials on either the Citizen or MP portal gates will be logged with trace IP and reported directly to the Cyber Crime Investigation Cell (CERT-In).",
    complianceChecklist: "NIC Resident Compliance Checklist",
    botPrevention: "Bot prevention check: enabled.",
    ispRouting: "ISP routing location validation: validated.",
    doubleLayerEncryption: "Double-layer encryption (SSL-256) session binding active.",
    navOverview: "1. Overview",
    navCitizenAccess: "2. Citizen Access",
    navSubmitGrievance: "3. Submit Grievance",
    navHeatmap: "4. Regional Heatmap",
    navMpHeatmap: "2. Regional Heatmap",
    navMpDashboard: "3. MP Dashboard",
    navFormula: "4. Formula Settings",
    navPrioritize: "5. Prioritize & Sanction",
    navMpLogin: "Hon'ble MP Login (Kavach Gateway)",
    footerRegistry: "National Informatics Centre (NIC) Portal Registry",
    footerDesign: "Designed & developed for the Ministry of Statistics and Programme Implementation (MoSPI), Government of India.",
    footerRights: "© 2026 Digital India Initiative. All Rights Reserved.",
    footerPlatform: "Built by CloudSentinels team",
    citizenLabel: "Citizen",
    logoutLabel: "Logout",
    mpLabel: "Hon'ble MP",
    govSecureLock: "NIC GOVERNMENT SECURED INTRANET NODE — SSL 256-BIT SESSION LOCK",
    exitGateway: "Exit to Gateway Selector",
    portalLockEnforced: "NIC PORTAL LOCK — SEPARATE PUBLIC & MP ADMINISTRATIVE GATEWAYS ENFORCED",
    gatewaySelectorBtn: "Gateway Selector",
    govtOf: "GOVT OF",
    india: "INDIA",
  },
  hi: {
    portalName: "राष्ट्रीय नागरिक शिकायत निवारण एवं परियोजना प्राथमिकता पोर्टल",
    ministry: "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय एवं राष्ट्रीय सूचना विज्ञान केंद्र",
    tagline: "सत्यमेव जयते • नागरिक समृद्धि के लिए पारदर्शी प्रशासन",
    welcome: "एकीकृत राष्ट्रीय शिकायत निवारण मंच पर आपका स्वागत है",
    subWelcome: "शिकायतें व्यक्त करें, स्थानीय विकास परियोजनाओं का अनुरोध करें और पारदर्शी रूप से एमपीलैड्स (MPLADS) मंजूरी की निगरानी करें।",
    citizenLogin: "नागरिक लॉगिन / पंजीकरण",
    officialLogin: "एनआईसी कवच लॉगिन (आधिकारिक)",
    activeGrievances: "सक्रिय शिकायतें",
    sanctionedFunds: "स्वीकृत निधि (लाख)",
    totalProjects: "प्राथमिकता प्राप्त परियोजनाएं",
    resolvedGrievances: "सुलझाई गई शिकायतें",
    submitGrievance: "नई शिकायत दर्ज करें",
    trackStatus: "जमा विवरण ट्रैक करें",
    kavachBadge: "एनआईसी सत्यापित सुरक्षा वातावरण • कवच एसएसओ एकीकरण",
    tickerTitle: "सरकारी अलर्ट टिकर",
    tickerBody: "नोट: एनआईसी दिशानिर्देशों के तहत, सभी सांसदों को अपने कवच एमएफए एप्लिकेशन से जुड़े आधिकारिक @sansad.nic.in क्रेडेंशियल्स का उपयोग करना चाहिए। नागरिक शिकायतों के लिए 10-अंकीय प्रामाणिक फोन सत्यापन आवश्यक है।",
    howItWorks: "यह कैसे काम करता है: एकीकृत प्रशासनिक ढांचा",
    mpGateSub: "सुरक्षित प्रशासनिक नोड",
    mpGateDesc: "संसद सदस्यों और सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI) के अधिकारियों के लिए नागरिक इनपुट की समीक्षा करने, प्राथमिकता सूत्र निर्धारित करने और फंड स्वीकृत करने के लिए प्रतिबंधित पोर्टल।",
    mpGateBtn: "आधिकारिक सांसद सुरक्षित लॉगिन",
    securityAdvisory: "साइबर सुरक्षा सलाह (आईटी अधिनियम धारा 66-एफ)",
    securityAdvisoryDesc: "इस प्रणाली तक पहुंच की निगरानी की जाती है। नागरिक या सांसद पोर्टल गेटों पर क्रेडेंशियल्स को बायपास करने, बाधित करने या गलत साबित करने के किसी भी अनधिकृत प्रयास को ट्रेस आईपी के साथ दर्ज किया जाएगा और सीधे साइबर अपराध जांच सेल (CERT-In) को सूचित किया जाएगा।",
    complianceChecklist: "एनआईसी निवासी अनुपालन चेकलिस्ट",
    botPrevention: "बॉट रोकथाम जांच: सक्षम।",
    ispRouting: "आईएसपी रूटिंग स्थान सत्यापन: सत्यापित।",
    doubleLayerEncryption: "डबल-लेयर एन्क्रिप्शन (एसएसएल-256) सत्र बाइंडिंग सक्रिय।",
    navOverview: "१. अवलोकन",
    navCitizenAccess: "२. नागरिक पहुंच",
    navSubmitGrievance: "३. शिकायत दर्ज करें",
    navHeatmap: "४. क्षेत्रीय हीटमैप",
    navMpHeatmap: "२. क्षेत्रीय हीटमैप",
    navMpDashboard: "३. सांसद डैशबोर्ड",
    navFormula: "४. फॉर्मूला सेटिंग्स",
    navPrioritize: "५. प्राथमिकता और मंजूरी",
    navMpLogin: "माननीय सांसद लॉगिन (कवच गेटवे)",
    footerRegistry: "राष्ट्रीय सूचना विज्ञान केंद्र (NIC) पोर्टल रजिस्ट्री",
    footerDesign: "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI), भारत सरकार के लिए डिज़ाइन और विकसित।",
    footerRights: "© 2026 डिजिटल इंडिया पहल। सर्वाधिकार सुरक्षित।",
    footerPlatform: "क्लाउडसेंटिनेल्स टीम द्वारा निर्मित",
    citizenLabel: "नागरिक",
    logoutLabel: "लॉगआउट",
    mpLabel: "माननीय सांसद",
    govSecureLock: "एनआईसी सरकारी सुरक्षित इंट्रानेट नोड - एसएसएल 256-बिट सत्र लॉक",
    exitGateway: "गेटवे चयनकर्ता पर वापस जाएं",
    portalLockEnforced: "एनआईसी पोर्टल लॉक - अलग सार्वजनिक और सांसद प्रशासनिक गेटवे लागू",
    gatewaySelectorBtn: "गेटवे चयनकर्ता",
    govtOf: "भारत",
    india: "सरकार",
  },
  bn: {
    portalName: "জাতীয় নাগরিক অভিযোগ প্রতিকার এবং প্রকল্প অগ্রাধিকার পোর্টাল",
    ministry: "পরিসংখ্যান ও কর্মসূচি বাস্তবায়ন মন্ত্রক এবং জাতীয় তথ্যবিজ্ঞান কেন্দ্র",
    tagline: "সত্যমেব জয়তে • নাগরিক সমৃদ্ধির জন্য স্বচ্ছ প্রশাসন",
    welcome: "একীকৃত জাতীয় অভিযোগ প্রতিকার মঞ্চে আপনাকে স্বাগত",
    subWelcome: "অভিযোগ প্রকাশ করুন, স্থানীয় উন্নয়ন প্রকল্পের জন্য অনুরোধ করুন এবং স্বচ্ছভাবে MPLADS মঞ্জুরির তদারকি করুন।",
    citizenLogin: "নাগরিক লগইন / নিবন্ধন",
    officialLogin: "NIC কবচ লগইন (অফিসিয়াল)",
    activeGrievances: "সক্রিয় অভিযোগ",
    sanctionedFunds: "মঞ্জুরীকৃত তহবিল (লক্ষ)",
    totalProjects: "অগ্রাধিকারপ্রাপ্ত প্রকল্প",
    resolvedGrievances: "মীমাংসিত অভিযোগ",
    submitGrievance: "নতুন অভিযোগ জমা দিন",
    trackStatus: "জমা বিবরণী ট্র্যাক করুন",
    navOverview: "১. ওভারভিউ",
    navCitizenAccess: "২. নাগরিক অ্যাক্সেস",
    navSubmitGrievance: "৩. অভিযোগ জমা দিন",
    navHeatmap: "৪. আঞ্চলিক হিটম্যাপ",
    navMpHeatmap: "২. আঞ্চলিক হিটম্যাপ",
    navMpDashboard: "৩. এমপি ড্যাশবোর্ড",
    navFormula: "৪. ফর্মুলা সেটিংস",
    navPrioritize: "৫. অগ্রাধিকার ও অনুমোদন",
    navMpLogin: "মাননীয় এমপি লগইন (কবচ গেটওয়ে)",
    footerRegistry: "জাতীয় তথ্যবিজ্ঞান কেন্দ্র (NIC) पोर्टल रजिस्ट्री",
    footerDesign: "পরিসংখ্যান ও কর্মসূচি বাস্তবায়ন মন্ত্রক (MoSPI), ভারত সরকারের জন্য ডিজাইন ও তৈরি।",
    footerRights: "© 2026 ডিজিটাল ইন্ডিয়া উদ্যোগ। সর্বস্বত্ব সংরক্ষিত।",
    footerPlatform: "ক্লাউডসেন্টিমেলস টিম দ্বারা নির্মিত",
    citizenLabel: "নাগরিক",
    logoutLabel: "লগআউট",
    mpLabel: "মাননীয় এমপি",
    govSecureLock: "NIC ভারত সরকার সুরক্ষিত ইন্ট্রানেট নোড — SSL 256-বিট সেশন লক",
    exitGateway: "গেটওয়ে সিলেক্টরে ফিরে যান",
    portalLockEnforced: "NIC পোর্টাল লক — আলাদা সাধারণ এবং এমপি প্রশাসনিক গেটওয়ে প্রয়োগ করা হয়েছে",
    gatewaySelectorBtn: "গেটওয়ে সিলেক্টর",
    govtOf: "ভারত",
    india: "সরকার",
  },
  te: {
    portalName: "జాతీయ పౌర ఫిర్యాదుల పరిష్కారం & ప్రాజెక్ట్ ప్రాధాన్యత పోర్టల్",
    ministry: "గణాంకాలు, కార్యక్రమ అమలు మంత్రిత్వ శాఖ & నేషనల్ ఇన్ఫర్మాటిక్స్ సెంటర్",
    tagline: "సత్యమేవ జయతే • పౌర శ్రేయస్సు కోసం పారదర్శక పరిపాలన",
    welcome: "ఏకీకృత జాతీయ ఫిర్యాదుల పరిష్కార వేదికకు స్వాగతం",
    subWelcome: "ఫిర్యాదులను వ్యక్తం చేయండి, స్థానిక అభివృద్ధి ప్రాజెక్టులను అభ్యర్థించండి మరియు MPLADS నిధులను పారదర్శకంగా పర్యవేక్షించండి.",
    citizenLogin: "పౌరుల లాగిన్ / రిజిస్ట్రేషన్",
    officialLogin: "NIC కవచ్ లాగిన్ (అధికారిక)",
    activeGrievances: "క్రియాశీల ఫిర్యాదులు",
    sanctionedFunds: "మంజూరైన నిధులు (లక్షల్లో)",
    totalProjects: "ప్రాధాన్యత పొందిన ప్రాజెక్టులు",
    resolvedGrievances: "పరిష్కరించబడిన ఫిర్యాదులు",
    submitGrievance: "కొత్త ఫిర్యాదును సమర్పించండి",
    trackStatus: "సమర్పణలను ట్రాక్ చేయండి",
    navOverview: "1. అవలోకనం",
    navCitizenAccess: "2. పౌర యాక్సెస్",
    navSubmitGrievance: "3. ఫిర్యాదును సమర్పించండి",
    navHeatmap: "4. ప్రాంతీయ హీట్‌మ్యాప్",
    navMpHeatmap: "2. ప్రాంతీయ హీట్‌మ్యాప్",
    navMpDashboard: "3. ఎంపీ డాష్‌బోర్డ్",
    navFormula: "4. ఫార్ములా సెట్టింగులు",
    navPrioritize: "5. ప్రాధాత్యత & మంజూరు",
    navMpLogin: "గౌరవనీయ ఎంపీ లాగిన్ (కవచ్ గేట్‌వే)",
    footerRegistry: "నేషనల్ ఇన్ఫర్మాటిక్స్ సెంటర్ (NIC) పోర్టల్ రిజిస్ట్రీ",
    footerDesign: "గణాంకాలు మరియు కార్యక్రమ అమలు మంత్రిత్వ శాఖ (MoSPI), భారత ప్రభుత్వం కొరకు రూపొందించబడింది & అభివృద్ధి చేయబడింది.",
    footerRights: "© 2026 డిజిటల్ ఇండియా ఇనిషియేటివ్. అన్ని హక్కులూ ప్రత్యేకించుకోబడినవి.",
    footerPlatform: "క్లౌడ్‌సెంటినెల్స్ బృందం నిర్మించింది",
    citizenLabel: "పౌరుడు",
    logoutLabel: "లాగౌట్",
    mpLabel: "గౌరవనీయ ఎంపీ",
    govSecureLock: "NIC భారత ప్రభుత్వం సురక్షిత ఇంట్రానెట్ నోడ్ — SSL 256-బిట్ సెషన్ లాక్",
    exitGateway: "గేట్‌వే సెలెక్టర్‌కు నిష్క్రమించండి",
    portalLockEnforced: "NIC పోర్టల్ లాక్ — ప్రత్యేక పబ్లిక్ & ఎంపీ అడ్మినిస్ట్రేటివ్ గేట్‌వేలు అమలు చేయబడ్డాయి",
    gatewaySelectorBtn: "గేట్‌వే సెలెక్టర్",
    govtOf: "భారత",
    india: "ప్రభుత్వం",
  },
  ta: {
    portalName: "தேசிய குடிமக்கள் குறைதீர்ப்பு மற்றும் திட்ட முன்னுரிமை போர்டல்",
    ministry: "புள்ளியியல், திட்ட அமலாக்க அமைச்சகம் மற்றும் தேசிய தகவலியல் மையம்",
    tagline: "வாய்மையே வெல்லும் • குடிமக்கள் நல்வாழ்விற்கான வெளிப்படையான நிர்வாகம்",
    welcome: "ஒருங்கிணைந்த தேசிய குறைதீர்ப்பு தளத்திற்கு உங்களை வரவேற்கிறோம்",
    subWelcome: "குறைகளைத் தெரிவிக்கவும், உள்ளூர் வளர்ச்சித் திட்டங்களைக் கோரவும் மற்றும் MPLADS நிதியுதவிகளை வெளிப்படையாகக் கண்காணிக்கவும்.",
    citizenLogin: "குடிமகன் உள்நுழைவு / பதிவு",
    officialLogin: "NIC கவாச் உள்நுழைவு (அதிகாரப்பூர்வ)",
    activeGrievances: "செயலில் உள்ள குறைகள்",
    sanctionedFunds: "அங்கீகரிக்கப்பட்ட நிதி (இலட்சத்தில்)",
    totalProjects: "முன்னூரிமை அளிக்கப்பட்ட திட்டங்கள்",
    resolvedGrievances: "தீர்க்கப்பட்ட குறைகள்",
    submitGrievance: "புதிய குறையைச் சமர்ப்பிக்கவும்",
    trackStatus: "சமர்ப்பிப்புகளைக் கண்காணிக்கவும்",
    navOverview: "1. கண்ணோட்டம் (Overview)",
    navCitizenAccess: "2. குடிமக்கள் அணுகல் (Citizen Access)",
    navSubmitGrievance: "3. குறை சமர்ப்பிக்கவும் (Submit Grievance)",
    navHeatmap: "4. பிராந்திய வெப்ப வரைபடம் (Regional Heatmap)",
    navMpHeatmap: "2. பிராந்திய வெப்ப வரைபடம் (Regional Heatmap)",
    navMpDashboard: "3. எம்பி டேஷ்போர்டு (MP Dashboard)",
    navFormula: "4. ஃபார்முலா அமைப்புகள் (Formula Settings)",
    navPrioritize: "5. முன்னுரிமை மற்றும் ஒப்புதல் (Prioritize)",
    navMpLogin: "மாண்புமிகு எம்பி லாகின் (Kavach Gateway)",
    footerRegistry: "தேசிய தகவலியல் மையம் (NIC) போர்டல் பதிவகம்",
    footerDesign: "புள்ளியியல் மற்றும் திட்ட அமலாக்க அமைச்சகம் (MoSPI), இந்திய அரசாங்கத்திற்காக வடிவமைக்கப்பட்டு உருவாக்கப்பட்டது.",
    footerRights: "© 2026 டிஜிட்டல் இந்தியா முன்முயற்சி. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    footerPlatform: "CloudSentinels குழுவால் உருவாக்கப்பட்டது",
    citizenLabel: "குடிமகன்",
    logoutLabel: "வெளியேறு",
    mpLabel: "மாண்புமிகு எம்பி",
    govSecureLock: "என்ஐசி அரசு பாதுகாப்பான இன்டரானெட் முனை — எஸ்எஸ்எல் 256-பிட் அமர்வு பூட்டு",
    exitGateway: "நுழைவாயில் தேர்வுக்குத் திரும்பு",
    portalLockEnforced: "என்ஐசி போர்டல் பூட்டு — தனி பொது மற்றும் எம்பி நிர்வாக நுழைவாயில்கள் அமலாக்கப்பட்டுள்ளன",
    gatewaySelectorBtn: "நுழைவாயில் தேர்வு",
    govtOf: "இந்திய",
    india: "அரசு",
  },
  mr: {
    portalName: "राष्ट्रीय नागरिक तक्रार निवारण आणि प्रकल्प प्राधान्यीकरण पोर्टल",
    ministry: "सांख्यिकी, कार्यक्रम अंमलबजावणी मंत्रालय आणि राष्ट्रीय सूचना विज्ञान केंद्र",
    tagline: "सत्यमेव जयते • नागरिक समृद्धीसाठी पारदर्शक प्रशासन",
    welcome: "एकीकृत राष्ट्रीय तक्रार निवारण मंचावर आपले स्वागत आहे",
    subWelcome: "तक्रारी नोंदवा, स्थानिक विकास प्रकल्पांची विनंती करा आणि पारदर्शकपणे खासदार निधी (MPLADS) मंजुरीचे निरीक्षण करा.",
    citizenLogin: "नागरीक लॉगिन / नोंदणी",
    officialLogin: "एनआयसी कवच लॉगिन (अधिकृत)",
    activeGrievances: "सक्रिय तक्रारी",
    sanctionedFunds: "मंजूर निधी (लाखात)",
    totalProjects: "प्राधान्य दिलेले प्रकल्प",
    resolvedGrievances: "निवारण केलेल्या तक्रारी",
    submitGrievance: "नवीन तक्रार दाखल करा",
    trackStatus: "अर्ज स्थितीचा मागोवा घ्या",
    kavachBadge: "एनआयसी सत्यापित सुरक्षा वातावरण • कवच एसएसओ एकत्रीकरण",
    tickerTitle: "सरकारी अलर्ट टिकर",
    tickerBody: "टीप: एनआयसी मार्गदर्शक तत्त्वांच्या अंतर्गत, सर्व खासदारांनी त्यांच्या कवच एमएफए ॲप्लिकेशनशी जोडलेल्या अधिकृत @sansad.nic.in क्रेडेंशियल्स का वापर केला पाहिजे. नागरिक तक्रारींसाठी १०-अंकी अस्सल फोन पडताळणी आवश्यक आहे.",
    howItWorks: "हे कसे कार्य करते: एकीकृत प्रशासकीय फ्रेमवर्क",
    step1Title: "नागरिक आवाज",
    step1Desc: "नागरिक लेखी वर्णन, ऑडिओ रेकॉर्डिंग (स्वयंचलित एआय ट्रान्सक्रिप्शनसह), किंवा जिओटॅग केलेल्या मीडियाद्वारे पायाभूत आव्हाने सादर करतात.",
    step2Title: "जेमिनी एआय स्कोरिंग",
    step2Desc: "जेमिनी प्रस्तावांचे वर्गीकरण करते, कीवर्डचे विश्लेषण करते, राष्ट्रीय जनगणना निर्देशांकांचे मूल्यांकन करते आणि त्वरितता रेटिंग एआय प्राधान्य स्कोअरमध्ये मॅप करते.",
    step3Title: "खासदार निधी मंजुरी",
    step3Desc: "सन्माननीय खासदार अत्यंत प्राधान्य दिलेल्या प्रस्तावांचे पुनरावलोकन करतात, सत्यापित डिजिटल कवच अधिकृततेद्वारे सुरक्षितपणे खासदार निधी (MPLADS) वाटप करतात.",
    recentClearances: "अलीकडील विकास मंजुरी (MoSPI डॅशबोर्ड)",
    footerRegistry: "राष्ट्रीय सूचना विज्ञान केंद्र (NIC) पोर्टल रजिस्ट्री",
    footerDesign: "सांख्यिकी आणि कार्यक्रम अंमलबजावणी मंत्रालय (MoSPI), भारत सरकारसाठी डिझाइन आणि विकसित.",
    footerRights: "© २०२६ डिजिटल इंडिया पुढाकार. सर्व हक्क राखीव.",
    footerPlatform: "क्लाऊडसेंटिनेल्स संघाने तयार केले",
  },
  gu: {
    portalName: "રાષ્ટ્રીય નાગરિક ફરિયાદ નિવારણ અને પ્રોજેક્ટ પ્રાથમિકતા પોર્ટલ",
    ministry: "આંકડાશાસ્ત્ર, કાર્યક્રમ અમલીકરણ મંત્રાલય અને રાષ્ટ્રીય સૂચના વિજ્ઞાન કેન્દ્ર",
    tagline: "સત્યમેવ જયતે • નાગરિક સમૃદ્ધિ માટે પારદર્શક વહીવટ",
    welcome: "એકીકૃત રાષ્ટ્રીય ફરિયાદ નિવારણ મંચ પર આપનું સ્વાગત છે",
    subWelcome: "ફરિયાદો રજૂ કરો, સ્થાનિક વિકાસ પ્રોજેક્ટ્સ માટે વિનંती કરો અને પારદર્શક રીતે સાંસદ ભંડોળ (MPLADS) મંજૂરી પર નજર રાખો.",
    citizenLogin: "નાગરિક લોગિન / નોંધણી",
    officialLogin: "NIC કવચ લોગિન (સત્તાવાર)",
    activeGrievances: "સક્રિય ફરિયાદો",
    sanctionedFunds: "મંજૂર ભંડોળ (લાખમાં)",
    totalProjects: "પ્રાથમિકતા ધરાવતા પ્રોજેક્ટ્સ",
    resolvedGrievances: "નિવારણ થયેલ ફરિયાદો",
    submitGrievance: "નવી ફરિયાદ સબમિટ કરો",
    trackStatus: "સ્થિતિ ટ્રૅક કરો",
    footerRegistry: "રાષ્ટ્રીય સૂચના વિજ્ઞાન કેન્દ્ર (NIC) પોર્ટલ રજિસ્ટ્રી",
    footerDesign: "આંકડાશાસ્ત્ર અને કાર્યક્રમ અમલીકરણ મંત્રાલય (MoSPI), ભારત સરકાર માટે ડિઝાઇન અને વિકસિત.",
    footerRights: "© ૨૦૨૬ ડિજિટલ ઇન્ડિયા પહેલ. સર્વાધિકાર સુરક્ષિત.",
    footerPlatform: "ક્લાઉડસેન્ટિનેલ્સ ટીમ દ્વારા નિર્મિત",
  },
  kn: {
    portalName: "ರಾಷ್ಟ್ರೀಯ ನಾಗರಿಕ ಕುಂದುಕೊರತೆಗಳ ನಿವಾರಣೆ ಮತ್ತು ಯೋಜನೆ ಆದ್ಯತಾ ಪೋರ್ಟಲ್",
    ministry: "ಸಂಖ್ಯಾಶಾಸ್ತ್ರ, ಕಾರ್ಯಕ್ರಮ ಅನುಷ್ಠಾನ ಸಚಿವಾಲಯ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಮಾಹಿತಿ ಕೇಂದ್ರ",
    tagline: "ಸತ್ಯಮೇವ ಜಯತೇ • ನಾಗರಿಕರ ಸಮೃದ್ಧಿಗಾಗಿ ಪಾರದರ್ಶಕ ಆಡಳಿತ",
    welcome: "ಏಕೀಕೃತ ರಾಷ್ಟ್ರೀಯ ಕುಂದುಕೊರತೆ ನಿವಾರಣಾ ವೇದಿಕೆಗೆ ಸುಸ್ವಾಗತ",
    subWelcome: "ಕುಂದುಕೊರತೆಗಳನ್ನು ಸಲ್ಲಿಸಿ, ಸ್ಥಳೀಯ ಅಭಿವೃದ್ಧಿ ಯೋಜನೆಗಳನ್ನು ವಿನಂತಿಸಿ ಮತ್ತು ಸಂಸದರ ನಿಧಿ (MPLADS) ಮಂಜೂರಾತಿಯನ್ನು ಪಾರದರ್ಶಕವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",
    citizenLogin: "ನಾಗರಿಕ ಲಾಗಿನ್ / ನೋಂದಣಿ",
    officialLogin: "NIC ಕವಚ ಲಾಗಿನ್ (ಅಧಿಕೃತ)",
    activeGrievances: "ಸಕ್ರಿಯ ಕುಂದುಕೊರತೆಗಳು",
    sanctionedFunds: "ಮಂಜೂರಾದ ನಿಧಿ (ಲಕ್ಷಗಳಲ್ಲಿ)",
    totalProjects: "ಆದ್ಯತೆ ನೀಡಲಾದ ಯೋಜನೆಗಳು",
    resolvedGrievances: "ಪರಿಹರಿಸಲಾದ ಕುಂದುಕೊರತೆಗಳು",
    submitGrievance: "ಹೊಸ ಕುಂದುಕೊರತೆ ಸಲ್ಲಿಸಿ",
    trackStatus: "ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    footerRegistry: "ರಾಷ್ಟ್ರೀಯ ಮಾಹಿತಿ ಕೇಂದ್ರ (NIC) ಪೋರ್ಟಲ್ ನೋಂದಣಿ",
    footerDesign: "ಸಂಖ್ಯಾಶಾಸ್ತ್ರ ಮತ್ತು ಕಾರ್ಯಕ್ರಮ ಅನುಷ್ಠಾನ ಸಚಿವಾಲಯ (MoSPI), ಭಾರತ ಸರ್ಕಾರಕ್ಕಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ ಮತ್ತು ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆ.",
    footerRights: "© ೨೦೨೬ ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ ಉಪಕ್ರಮ. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    footerPlatform: "ಕ್ಲೌಡ್ ಸೆಂಟಿನೆಲ್ಸ್ ತಂಡದಿಂದ ನಿರ್ಮಿಸಲ್ಪಟ್ಟಿದೆ",
  },
  or: {
    portalName: "ଜାତୀୟ ନାଗରିକ ଅଭିଯୋଗ ନିରାକରଣ ଏବଂ ପ୍ରକଳ୍ପ ପ୍ରାଥମିକତା ପୋର୍ଟାଲ",
    ministry: "ପରିସଂଖ୍ୟାନ, କାର୍ଯ୍ୟକ୍ରମ କାର୍ଯ୍ୟାନ୍ୱୟନ ମନ୍ତ୍ରଣାଳୟ ଏବଂ ଜାତୀୟ ସୂଚନା ବିଜ୍ଞାନ କେନ୍ଦ୍ର",
    tagline: "ସତ୍ୟମେବ ଜୟତେ • ନାଗରିକ ସମୃଦ୍ଧି ପାଇଁ ସ୍ୱଚ୍ଛ ପ୍ରଶାସନ",
    welcome: "ଏକୀକୃତ ଜାତୀୟ ଅଭିଯୋଗ ନିରାକରଣ ମଞ୍ଚକୁ ସ୍ୱାଗତ",
    subWelcome: "ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତុ, ସ୍ଥାନୀୟ ବିକାଶ ପ୍ରକଳ୍ପ ପାଇଁ ଅନୁରୋଧ କରନ୍ତୁ ଏବଂ ସ୍ୱଚ୍ଛ ଭାବରେ ସାଂସଦ ପାଣ୍ଠି (MPLADS) ମଞ୍ջୁରୀର ତଦାରଖ କରନ୍ତು ।",
    citizenLogin: "ନାଗରିକ ଲଗଇନ୍ / ପଞ୍ଜୀକରଣ",
    officialLogin: "NIC କବଚ ଲଗଇନ୍ (ଆଧିକାରିକ)",
    activeGrievances: "ସକ୍ରିୟ ଅଭିଯୋଗ",
    sanctionedFunds: "ମଞ୍ଜୁରୀପ୍ରାପ୍ତ ପାଣ୍ଠି (ଲକ୍ଷରେ)",
    totalProjects: "ପ୍ରାଥମିକତା ପ୍ରାପ୍ત ପ୍ରକଳ୍ପ",
    resolvedGrievances: "ସମାଧାନ ହୋଇଥିବା ଅଭିଯୋਗ",
    submitGrievance: "ନୂଆ ଅଭିଯୋਗ ଦାଖଲ କରନ୍ତុ",
    trackStatus: "ସ୍ଥିତି ଟ୍ରาକ୍ କରନ୍ତୁ",
    footerRegistry: "ରାଷ୍ଟ୍ରୀୟ ସୂଚନା ବିଜ୍ଞାନ କେନ୍ଦ୍ର (NIC) ପୋର୍ଟାଲ୍ ରେଜିଷ୍ଟ୍ରି",
    footerDesign: "ପରିସଂଖ୍ୟାନ ଏବଂ କାର୍ଯ୍ୟକ୍ରମ କାର୍ଯ୍ୟାନ୍ୱୟନ ମନ୍ତ୍ରଣାଳୟ (MoSPI), ଭାରତ ସରକାରଙ୍କ ପାଇଁ ଡିଜାଇନ୍ ଏବଂ ବିକଶିତ |",
    footerRights: "© ୨୦୨୬ ଡିଜିଟାଲ୍ ଇଣ୍ଡିଆ ପଦକ୍ଷେପ | ସର୍ବାଧିକାର ସୁମୁଦ୍ରିତ |",
    footerPlatform: "କ୍ଲାଉଡ୍ ସେଣ୍ଟିନେଲ୍ସ ଦଳ ଦ୍ୱାରା ନିର୍ମିତ",
  },
  ml: {
    portalName: "ദേശീയ പൗര പരാതി പരിഹാരവും പദ്ധതി മുൻഗണനാ പോർട്ടലും",
    ministry: "സ്ഥിതിവിവരക്കണക്ക്, പദ്ധതി നടപ്പാക്കൽ മന്ത്രാലയവും നാഷണൽ ഇൻഫർമാറ്റിക്സ് സെന്ററും",
    tagline: "സത്യമേവ ജയതേ • പൗരസമൃദ്ധിക്കായി സുതാര്യമായ ഭരണം",
    welcome: "ഏകീകൃത ദേശീയ പരാതി പരിഹാര പ്ലാറ്റ്‌ഫോമിലേക്ക് സ്വാഗതം",
    subWelcome: "പരാതികൾ രേഖപ്പെടുത്തുക, പ്രാദേശിക വികസന പദ്ധതികൾ അഭ്യർത്ഥിക്കുക, എംപി ഫണ്ട് (MPLADS) അനുവദിക്കുന്നത് സുതാര്യമായി നിരീക്ഷിക്കുക.",
    citizenLogin: "പൗര ലോഗിൻ / രജിസ്ട്രേഷൻ",
    officialLogin: "NIC കവച് ലോഗിൻ (ഔദ്യോഗികം)",
    activeGrievances: "സജീവ പരാതികൾ",
    sanctionedFunds: "അനുവദിച്ച ഫണ്ട് (ലക്ഷത്തിൽ)",
    totalProjects: "മുൻഗണന നൽകിയ പദ്ധതികൾ",
    resolvedGrievances: "പരിഹരിച്ച പരാതികൾ",
    submitGrievance: "പുതിയ പരാതി സമർപ്പിക്കുക",
    trackStatus: "സ്ഥിതി നിരീക്ഷിക്കുക",
    footerRegistry: "നാഷണൽ ഇൻഫർമാറ്റിക്സ് സെന്റർ (NIC) പോർട്ടൽ രജിസ്ട്രി",
    footerDesign: "മിനിസ്ട്രി ഓഫ് സ്റ്റാറ്റിസ്റ്റിക്സ് ആൻഡ് പ്രോഗ്രാം ഇംപ്ലിമെന്റേഷൻ (MoSPI), ഭാരത സർക്കാരിനായി രൂപകൽപ്പന ചെയ്ത് വികസിപ്പിച്ചത്.",
    footerRights: "© 2026 ഡിജിറ്റൽ ഇന്ത്യ സംരംഭം. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.",
    footerPlatform: "ക്ലൗഡ് സെന്റിനൽസ് ടീം നിർമ്മിച്ചത്",
  },
  pa: {
    portalName: "ਰਾਸ਼ਟਰੀ ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਅਤੇ ਪ੍ਰੋਜੈਕਟ ਤਰਜੀਹ ਪੋਰਟਲ",
    ministry: "ਅੰਕੜਾ ਅਤੇ ਪ੍ਰੋਗਰਾਮ ਲਾਗੂਕਰਨ ਮੰਤਰਾਲਾ ਅਤੇ ਰਾਸ਼ਟਰੀ ਸੂਚਨਾ ਵਿਗਿਆਨ ਕੇਂਦਰ",
    tagline: "ਸਤਿਆਮੇਵ ਜੈਤੇ • ਨਾਗਰਿਕ ਖੁਸ਼ਹਾਲੀ ਲਈ ਪਾਰਦਰਸ਼ੀ ਪ੍ਰਸ਼ਾਸਨ",
    welcome: "ਏਕੀਕ੍ਰਿਤ ਰਾਸ਼ਟਰੀ ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਪਲੇਟਫਾਰਮ 'ਤੇ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
    subWelcome: "ਸ਼ਿਕਾਇਤਾਂ ਦਰਜ ਕਰੋ, ਸਥਾਨਕ ਵਿਕਾਸ ਪ੍ਰੋਜੈਕਟਾਂ ਦੀ ਬੇਨਤੀ ਕਰੋ ਅਤੇ ਸੰਸਦ ਮੈਂਬਰ ਫੰਡ (MPLADS) ਦੀ ਮਨਜ਼ੂਰੀ ਦੀ ਪਾਰਦਰਸ਼ੀ ਢੰਗ ਨਾਲ ਨਿਗਰਾਨੀ ਕਰੋ।",
    citizenLogin: "ਨਾਗਰਿਕ ਲੌਗਇਨ / ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
    officialLogin: "NIC ਕਵਚ ਲੌਗਇਨ (ਅਧਿਕਾਰਤ)",
    activeGrievances: "ਸਰਗਰਮ ਸ਼ਿਕਾਇਤਾਂ",
    sanctionedFunds: "ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਫੰਡ (ਲੱਖਾਂ ਵਿੱਚ)",
    totalProjects: "ਤਰਜੀਹੀ ਪ੍ਰੋਜੈਕਟ",
    resolvedGrievances: "ਹੱਲ ਕੀਤੀਆਂ ਸ਼ਿਕਾਇਤਾਂ",
    submitGrievance: "ਨਵੀਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ",
    trackStatus: "ਸਥਿਤੀ ਨੂੰ ਟ੍ਰੈਕ ਕਰੋ",
    footerRegistry: "ਰਾਸ਼ਟਰੀ ਸੂਚਨਾ ਵਿਗਿਆਨ ਕੇਂਦਰ (NIC) ਪੋਰਟਲ ਰਜਿਸਟਰੀ",
    footerDesign: "ਅੰਕੜਾ ਅਤੇ ਪ੍ਰੋਗਰਾਮ ਲਾਗੂਕਰਨ ਮੰਤਰਾਲੇ (MoSPI), ਭਾਰਤ ਸਰਕਾਰ ਲਈ ਤਿਆਰ ਅਤੇ ਵਿਕਸਤ ਕੀਤਾ ਗਿਆ ਹੈ।",
    footerRights: "© 2026 ਡਿਜੀਟਲ ਇੰਡੀਆ ਪਹਿਲਕਦਮੀ। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।",
    footerPlatform: "ਕਲਾਊਡਸੈਂਟੀਨਲਜ਼ ਟੀਮ ਦੁਆਰਾ ਬਣਾਇਆ ਗਿਆ",
  },
  as: {
    portalName: "ৰাষ্ট্ৰীয় নাগৰিক অভিযোগ নিবাৰণ আৰু প্ৰকল্প অগ্ৰাধিকাৰ পৰ্টেল",
    ministry: "পৰিসংখ্যা আৰু কাৰ্যসূচী ৰূপায়ণ মন্ত্ৰালয় আৰু ৰাষ্ট্ৰীয় তথ্যবিজ্ঞান কেন্দ্ৰ",
    tagline: "সত্যমেৱ জয়তে • নাগৰিকৰ সমৃদ্ধিৰ বাবে স্বচ্ছ প্ৰশাসন",
    welcome: "একীকৃত ৰাষ্ট্ৰীয় অভিযোগ নিবাৰণ মঞ্চলৈ স্বাগতম",
    subWelcome: "অভিযোগ দাখিল কৰক, স্থানীয় উন্নয়ন প্ৰকল্পৰ বাবে অনুৰোধ কৰক আৰু স্বচ্ছভাৱে সাংসদ পুঁজি (MPLADS) অনুমোদন নিৰীক্ষণ কৰক।",
    citizenLogin: "নাগৰিক লগইন / পঞ্জীয়ন",
    officialLogin: "NIC কবচ লগইন (আঞ্চলিক/চৰকাৰী)",
    activeGrievances: "সক্ৰিয় অভিযোগ",
    sanctionedFunds: "অনুমোদিত পুঁজি (লাখত)",
    totalProjects: "অগ্ৰাধিকাৰপ্ৰাপ্ত প্ৰকল্প",
    resolvedGrievances: "সমাধান হোৱা অভিযোগ",
    submitGrievance: "নতুন অভিযোগ দাখিল কৰক",
    trackStatus: "স্থিতি ট্ৰেক কৰক",
    footerRegistry: "ৰাষ্ট্ৰীয় সূচনা বিজ্ঞান কেন্দ্ৰ (NIC) প’ৰ্টেল ৰেজিষ্ট্ৰী",
    footerDesign: "পৰিসংখ্যা আৰু কাৰ্যসূচী ৰূপায়ণ মন্ত্ৰালয় (MoSPI), ভাৰত চৰকাৰৰ বাবে ডিজাইন আৰু বিকশিত কৰা হৈছে।",
    footerRights: "© 2026 ডিজিটেল ইণ্ডিয়া পদক্ষেপ। সৰ্বস্বত্ব সংৰক্ষিত।",
    footerPlatform: "ক্লাউডচেন্টিনেলছ দলৰ দ্বাৰা নিৰ্মিত",
  },
  ur: {
    portalName: "قومی شہری شکایات کے ازالے اور پروجیکٹ ترجیحی پورٹل",
    ministry: "وزارت شماریات، پروگرام کے نفاذ اور نیشنل انفارمیٹکس سینٹر",
    tagline: "ستیہ میو جیتے • شہریوں کی خوشحالی کے لیے شفاف انتظامیہ",
    welcome: "متحدہ قومی شکایت کے ازالے کے پلیٹ فارم پر خوش آمدید",
    subWelcome: "شکایات درج کریں، مقامی ترقیاتی منصوبوں کی درخواست کریں اور شفاف طریقے سے MPLADS فنڈز کی منظوری کی نگرانی کریں۔",
    citizenLogin: "شہری لاگ ان / رجسٹریشن",
    officialLogin: "این آئی سی کوچ لاگ ان (آفیشل)",
    activeGrievances: "سرگرم شکایات",
    sanctionedFunds: "منظور شدہ فنڈز (لاکھ میں)",
    totalProjects: "ترجیحی منصوبے",
    resolvedGrievances: "حل شدہ شکایات",
    submitGrievance: "نئی شکایت جمع کریں",
    trackStatus: "اسٹیٹس ٹریک کریں",
    footerRegistry: "نیشنل انفارمیٹکس سینٹر (NIC) پورٹل رجسٹری",
    footerDesign: "وزارت شماریات اور پروگرام کے نفاذ (MoSPI)، حکومت ہند کے لیے ڈیزائن اور تیار کیا گیا ہے۔",
    footerRights: "© 2026 ڈیجیٹل انڈیا اقدام۔ جملہ حقوق محفوظ ہیں۔",
    footerPlatform: "کلاؤڈ سینٹینلز ٹیم کے ذریعہ بنایا گیا ہے",
  },
  ma: {
    portalName: "राष्ट्रीय नागरिक शिकायत निवारण आ परियोजना प्राथमिकता पोर्टल",
    ministry: "सांख्यिकी आ कार्यक्रम कार्यान्वयन मंत्रालय आ राष्ट्रीय सूचना विज्ञान केंद्र",
    tagline: "सत्यमेव जयते • नागरिक समृद्धि लेल पारदर्शी प्रशासन",
    welcome: "एकीकृत राष्ट्रीय शिकायत निवारण मंच पर अहाँक स्वागत अछि",
    subWelcome: "शिकायत दर्ज करू, स्थानीय विकास परियोजनाक अनुरोध करू आ पारदर्शी रूप सँ सांसद निधिक मंजूरीक निगरानी करू।",
    citizenLogin: "नागरिक लॉगिन / पंजीकरण",
    officialLogin: "एनआईसी कवच लॉगिन (आधिकारिक)",
    activeGrievances: "सक्रिय शिकायत",
    sanctionedFunds: "मंजूर निधि (लाख में)",
    totalProjects: "प्राथमिकता प्राप्त परियोजना",
    resolvedGrievances: "मंजूर शिकायत",
    submitGrievance: "नब शिकायत दर्ज करू",
    trackStatus: "ट्रैक करू",
    footerRegistry: "राष्ट्रीय सूचना विज्ञान केंद्र (NIC) पोर्टल रजिस्ट्री",
    footerDesign: "सांख्यिकी आ कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI), भारत सरकारक लेल डिजाइन आ विकसित।",
    footerRights: "© २०२६ डिजिटल इंडिया पहल। सर्वाधिकार सुरक्षित।",
    footerPlatform: "क्लाउडसेंटिनेल्स टीम द्वारा निर्मित",
  },
  ks: {
    portalName: "قومی شہری شکایت निवारण تہٕ پروجیکٹ ترجیح پورٹل",
    ministry: "وزارت شماریات، پروگرام نفاذ تہٕ نیشنل انفارمیٹکس سینٹر",
    tagline: "ستیہ میو جیتے • شہری خوشحالی خاطرء شفاف انتظامیہ",
    welcome: "متحدہ قومی شکایت ازالہ پلیٹ فارمس پیٹھ خوش آمدید",
    subWelcome: "شکایات درج کریو، مقامی ترقیاتی پروجیکٹن ہنز درخواست करیو تہٕ شفاف طریقے سان MPLADS فنڈز منزوری ہنز نگرانی کریو۔",
    citizenLogin: "شہری لاگ ان / رجسٹریشن",
    officialLogin: "این آئی سی کوچ لاگ ان (سرکاری)",
    activeGrievances: "سرگرم شکایات",
    sanctionedFunds: "منظور شدہ فنڈز (لاکھ منز)",
    totalProjects: "ترجیحی منصوبے",
    resolvedGrievances: "حل شدہ شکایات",
    submitGrievance: "نو شکایت جمع کریو",
    trackStatus: "ٹریک کریو",
    footerRegistry: "نیشنل انفارمیٹکس سینٹر (NIC) پورٹل رجسٹری",
    footerDesign: "وزارت شماریات تہٕ پروگرام نفاذ (MoSPI)، حکومت ہند خاطرء ڈیزائن تہٕ تیار۔",
    footerRights: "© २०२६ ڈیجیٹل انڈیا اقدام۔ جملہ حقوق محفوظ۔",
    footerPlatform: "کلاؤڈ سینٹینلز ٹیم۔",
  },
  sd: {
    portalName: "قومي شهري شڪايت نوارڻ ۽ پروجيڪٽ ترجيحي پورٽل",
    ministry: "وزارت شماريات، پروگرام تي عمل درآمد ۽ نيشنل انفارميٽڪس سينٽر",
    tagline: "سچائي جي فتح • شهري خوشحالي لاءِ شفاف انتظاميا",
    welcome: "گڏيل قومي شڪايत نوارڻ واري پليٽ فارم تي ڀليڪار",
    subWelcome: "شڪايتون داخل ڪريو، مقامي ترقياتي منصوبن جي درخواست ڪريو ۽ شفاف طريقي سان MPLADS فنڊز جي منظوري جي نگراني ڪريو.",
    citizenLogin: "شهري لاگ ان / رجسٽريشن",
    officialLogin: "NIC ڪوچ لاگ ان (سرڪاري)",
    activeGrievances: "سرگرم شڪايتون",
    sanctionedFunds: "منظور ٿيل فنڊز (لکن ۾)",
    totalProjects: "ترجيحي منصوبا",
    resolvedGrievances: "حل ٿيل شڪايتون",
    submitGrievance: "نئين شڪايت داخل ڪريو",
    trackStatus: "ٽريڪ ڪريو",
    footerRegistry: "قومي شهري معلوماتي مرڪز (NIC) پورٽل رجسٽري",
    footerDesign: "وزارت شماريات ۽ پروگرام تي عمل درآمد (MoSPI)، حکومت هند پاران تيار ڪيل.",
    footerRights: "© २०२६ ڊيجيٽل انڊيا اقدام. سڀئي حق محفوظ آهن.",
    footerPlatform: "ڪلاؤڊ سينٽينلز پاران ٺاهيل",
  },
  sa: {
    portalName: "राष्ट्रीयनागरिकशिकायतनिवारण-परियोजनाप्राथमिकताप्रकोष्ठः",
    ministry: "सांख्यिकी-कार्यक्रमकार्यान्वयनमन्त्रालयः च राष्ट्रियसूचनाविज्ञानकेन्द्रम्",
    tagline: "सत्यमेव जयते • नागरिकसमृद्धये पारदर्शिशासनम्",
    welcome: "एकीकृतराष्ट्रियशिकायतनिवारणमञ्चे स्वागतम्",
    subWelcome: "शिकायतं पञ्जीकुरुत, स्थानीयविकासपरियोजनाभ्यः अनुरोधं कुरुत तथा च पारदर्शिरूपेण सांसदनिधेः स्वीकृतिं पश्यत।",
    citizenLogin: "नागरिकप्रवेशः / पञ्जीकरणम्",
    officialLogin: "एनआईसी कवच प्रवेशः (आधिकारिकः)",
    activeGrievances: "सक्रियशिकायतः",
    sanctionedFunds: "स्वीकृतनिधिः (लक्षे)",
    totalProjects: "प्राथमिकताप्राप्तपरियोजनाः",
    resolvedGrievances: "निवारितशिकायतः",
    submitGrievance: "नूतनशिकायतं प्रेषयतु",
    trackStatus: "स्थितिं पश्यतु",
    footerRegistry: "राष्ट्रियसूचनाविज्ञानकेन्द्रम् (NIC) पोर्टल पञ्जीकरणम्",
    footerDesign: "सांख्यिकी-कार्यक्रमकार्यान्वयनमन्त्रालयाय (MoSPI), भारतसर्वकाराय परिकल्पितं विकसितं च।",
    footerRights: "© २०२६ डिजिटल-इण्डिया-प्रयासः। सर्वाधिकारसुरक्षितः।",
    footerPlatform: "क्लाउडसेन्टिनेल्स-दलेन रचितम्",
  },
  ne: {
    portalName: "राष्ट्रिय नागरिक गुनासो निवारण तथा आयोजना प्राथमिकता पोर्टल",
    ministry: "तथ्याङ्क, कार्यक्रम कार्यान्वयन मन्त्रालय र राष्ट्रिय सूचना विज्ञान केन्द्र",
    tagline: "सत्यमेव जयते • नागरिक समृद्धिका लागि पारदर्शी प्रशासन",
    welcome: "एकीकृत राष्ट्रिय गुनासो निवारण मञ्चमा स्वागत छ",
    subWelcome: "गुनासोहरू दर्ता गर्नुहोस्, स्थानीय विकास आयोजनाहरूको अनुरोध गर्नुहोस् र पारदर्शी रूपमा सांसद कोष (MPLADS) स्वीकृतिको निगरानी गर्नुहोस्।",
    citizenLogin: "नागरिक लगइन / दर्ता",
    officialLogin: "एनआईसी कवच लगइन (आधिकारिक)",
    activeGrievances: "सक्रिय गुनासोहरू",
    sanctionedFunds: "स्वीकृत कोष (लाखमा)",
    totalProjects: "प्राथमिकता प्राप्त आयोजनाहरू",
    resolvedGrievances: "समाधान गरिएका गुनासोहरू",
    submitGrievance: "नयाँ गुनासो दर्ता गर्नुहोस्",
    trackStatus: "स्थिति ट्र्याक गर्नुहोस्",
    footerRegistry: "राष्ट्रिय सूचना विज्ञान केन्द्र (NIC) पोर्टल रजिस्ट्री",
    footerDesign: "तथ्याङ्क र कार्यक्रम कार्यान्वयन मन्त्रालय (MoSPI), भारत सरकारका लागि डिजाइन र विकसित।",
    footerRights: "© २०२६ डिजिटल इन्डिया प्रयास। सर्वाधिकार सुरक्षित।",
    footerPlatform: "क्लाउडसेन्टिनेल्स टिमद्वारा निर्मित",
  },
  ko: {
    portalName: "राष्ट्रीय नागरिक कागाळ निवारण आनी प्रकल्प प्राधान्य पोर्टल",
    ministry: "सांख्यिकी, कार्यक्रम अंमलबजावणी मंत्रालय आनी राष्ट्रीय सूचना विज्ञान केंद्र",
    tagline: "सत्यमेव जयते • नागरिकांचे गिरेस्तकाये खातीर पारदर्शक प्रशासन",
    welcome: "एकीकृत राष्ट्रीय कागाळ निवारण मंचाचेर तुमचें स्वागत आसा",
    subWelcome: "कागाळी नोंद करात, थळाव्या विकास प्रकल्पां खातीर मागणी करात आनी पारदर्शकपणान खासदार निधी (MPLADS) मंजुरीचेर देखरेख दवरात.",
    citizenLogin: "नागरीक लॉगिन / नोंदणी",
    officialLogin: "एनआयसी कवच लॉगिन (आधिकारिक)",
    activeGrievances: "सक्रिय कागाळी",
    sanctionedFunds: "मंजूर निधी (लाखांनी)",
    totalProjects: "प्राधान्य दिल्ले प्रकल्प",
    resolvedGrievances: "निवारण केल्ल्यो कागाळी",
    submitGrievance: "नवी कागाळ दाखल करात",
    trackStatus: "स्थिती ट्रॅक करात",
    footerRegistry: "राष्ट्रीय सूचना विज्ञान केंद्र (NIC) पोर्टल नोंदणी",
    footerDesign: "सांख्यिकी आनी कार्यक्रम अंमलबजावणी मंत्रालय (MoSPI), भारत सरकारा खातीर डिझाइन आनी विकसित केल्लें।",
    footerRights: "© २०२६ डिजिटल इंडिया उपक्रम. सगळे हक्क दवरले.",
    footerPlatform: "क्लाउड सेंटिनेल्स पंगडान तयार केलां",
  },
  bo: {
    portalName: "हारियारि सुबुं संखारि सुस्रांनाय आरो हाबाफारि सिगांथि अनथाय पर्टेल",
    ministry: "अनथाय आरो हाबाफारि मावफुंनाय मन्थ्रालय आरो हारियारि सुबुं सोंथाय केन्द",
    tagline: "सत्यमेव जयते • सुबुं गोजोन्नायनि थाखाय रोखा सामलायनाय",
    welcome: "हारियारि सुबुं संखारि सुस्रांनाय मंचाव बरायबाय",
    subWelcome: "संखारि फोरमाय, थावनि जौगानाय हाबाफारिनि थाखाय खावलाय आरो एमपीलेड्स (MPLADS) अनथायखौ रोखाबै नदर लाखि।",
    citizenLogin: "सुबुं लॉगिन / रेजिष्ट्रेसन",
    officialLogin: "एनआइसी कवच लॉगिन (आधिकारिक)",
    activeGrievances: "सोलिगासिनो थानाय संखारिफोर",
    sanctionedFunds: "मंजूर जाबाय अनथाय (लाख आव)",
    totalProjects: "सिगांथि होनाय हाबाफारिफोर",
    resolvedGrievances: "सुस्रांनाय संखारिफोर",
    submitGrievance: "गोदान संखारि सुबमिट खालाम",
    trackStatus: "थासारि नायगिर",
    footerRegistry: "हारियारि सुबुं सोंथाय केन्द (NIC) पर्टेल रेजिष्ट्रेसन",
    footerDesign: "अनथाय आरो हाबाफारि मावफुंनाय मन्थ्रालय (MoSPI), भारत सरकारनि थाखाय रोखाबै सोरजिबाय।",
    footerRights: "© २०२६ डिजिटल इन्डिया हाबाफारि। गासैबो मोनथाय लाखिनाय जाबाय।",
    footerPlatform: "क्लाउड सेन्टिनेल्स हान्जाजों सोरजिनाय",
  },
  do: {
    portalName: "राष्ट्रीय नागरिक शिकायत निवारण ते प्रोजेक्ट प्राथमिकता पोर्टल",
    ministry: "सांख्यिकी ते कार्यक्रम कार्यान्वयन मंत्रालय ते राष्ट्रीय सूचना विज्ञान केंद्र",
    tagline: "सत्यमेव जयते • नागरिक खुशहाली लेई पारदर्शी प्रशासन",
    welcome: "एकीकृत राष्ट्रीय शिकायत निवारण मंच पर तुंदा स्वागत ऐ",
    subWelcome: "शिकायत दर्ज करो, स्थानीय विकास प्रोजेक्टें दी अपील करो ते पारदर्शी तरीके कन्ने सांसद निधि (MPLADS) मंजूरी दी निगरानी करो।",
    citizenLogin: "नागरिक लॉगिन / पंजीकरण",
    officialLogin: "एनआईसी कवच लॉगिन (सरकारी)",
    activeGrievances: "सक्रिय शिकायतें",
    sanctionedFunds: "मंजूर निधि (लाखें च)",
    totalProjects: "प्राथमिकता आले प्रोजेक्ट",
    resolvedGrievances: "हल कीतियां गदियां शिकायतें",
    submitGrievance: "नमीं शिकायत दर्ज करो",
    trackStatus: "स्थिति जांचो",
    footerRegistry: "राष्ट्रीय सूचना विज्ञान केंद्र (NIC) पोर्टल रजिस्ट्री",
    footerDesign: "सांख्यिकी ते कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI), भारत सरकार लेई परिकल्पित ते विकसित।",
    footerRights: "© २०२६ डिजिटल इंडिया पहल। सारे अधिकार सुरक्षित।",
    footerPlatform: "क्लाउडसेंटिनेल्स टीम आसेआ निर्मित",
  },
  sat: {
    portalName: "ᱫᱤᱥᱚᱢ ᱦᱚᱲ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱚᱞᱦᱮ ᱟᱨ ᱯᱨᱚᱡᱮᱠᱴ ᱞᱟᱦᱟᱱᱛᱤ ᱯᱚᱨᱴᱟᱞ",
    ministry: "ᱥᱟंख्यिकी ᱟᱨ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ ᱥᱟᱹᱛ ᱢᱚᱱᱛᱨᱟᱞᱚᱭ ᱟᱨ ᱱᱮᱥᱱᱟᱞ ᱤᱱᱯᱷᱚᱨᱢᱮᱴᱤᱠᱥ ᱥᱮᱱᱴᱟᱨ",
    tagline: "ᱥᱚᱛᱭᱚᱢᱮᱵᱚ ᱡᱚᱭᱚᱛᱮ • ᱦᱚᱲ ᱞᱟᱦᱟᱱᱛᱤ ᱞᱟᱹᱜᱤᱫ ᱥᱚᱫᱚᱨ ᱥᱟᱥᱚᱱ",
    welcome: "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱚᱞᱦᱮ ᱢᱮᱞᱟᱝᱠᱤ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ",
    subWelcome: "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱚᱫᱚᱨ ᱢᱮ, ᱞᱟᱦᱟᱱᱛᱤ ᱠᱟᱹᱢᱤ ᱱᱮᱦᱚᱨ ᱢᱮ ᱟᱨ ᱥᱚᱫᱚᱨ ᱞᱮᱠᱟᱛᱮ ᱮᱢ.ᱯᱤ ᱯᱷᱟᱱᱰ (MPLADS) ᱧᱮᱞ ᱫᱚᱦᱚᱭ ᱢᱮ ᱾",
    citizenLogin: "ᱦᱚᱲ ᱞᱚᱜᱤᱱ / ᱨᱮᱡᱤᱥᱴᱨᱮᱥᱚᱱ",
    officialLogin: "ᱮᱱ.ᱟᱭᱤ.ᱥᱤ ᱠᱚᱵᱚᱪ ᱞᱚᱜᱤᱱ (ᱥᱚᱨᱠᱟᱨᱤ)",
    activeGrievances: "ᱪᱟᱹᱞᱩ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱚ",
    sanctionedFunds: "ᱢᱚᱱᱡᱩᱨ ᱯᱷᱟᱱᱰ (ᱞᱟᱠᱷ ᱨᱮ)",
    totalProjects: "ᱞᱟᱦᱟᱱᱛᱤ ᱠᱟᱹᱢᱤ ᱠᱚ",
    resolvedGrievances: "ᱥᱚᱞᱦᱮ ᱟᱠᱟᱱ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱚ",
    submitGrievance: "ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱚᱫᱚᱨ ᱢᱮ",
    trackStatus: "ᱛᱷᱟᱥᱤ ᱧᱮᱞ ᱢᱮ",
    footerRegistry: "ᱱᱮᱥᱱᱟᱞ ᱤᱱᱯᱷᱚᱨᱢᱮᱴᱤᱠᱥ ᱥᱮᱱᱴᱟᱨ (NIC) ᱯᱚᱨᱴᱟᱞ ᱨᱮᱡᱤᱥᱴᱨᱤ",
    footerDesign: "ᱥᱟंख्यिकी ᱟᱨ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ ᱥᱟᱹᱛ ᱢᱚᱱᱛᱨᱟᱞᱚᱭ (MoSPI), ᱵᱷᱟᱨᱚᱛ ᱥᱚᱨᱠᱟᱨ ᱞᱟᱹᱜᱤᱫ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱ ᱾",
    footerRights: "© ᱒᱐᱒᱖ ᱰᱤᱡᱤᱴᱟᱞ ᱤᱱᱰᱤᱭᱟ ᱠᱟᱹᱢᱤ ᱾ ᱡᱚᱛᱚ ᱟᱹᱭᱫᱟᱹᱨᱤ ᱵᱟᱧᱪᱟᱣ ᱢᱮᱱᱟᱜᱼᱟ ᱾",
    footerPlatform: "ᱠᱞᱟᱩᱰ ᱥᱮᱱᱴᱤᱱᱮᱞᱥ ᱫᱚᱞ ᱦᱚᱛᱮᱛᱮ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱ ᱾",
  }
};

export function getTranslation(lang: string, key: string): string {
  const translationsForLang = TRANSLATIONS[lang] || TRANSLATIONS["en"];
  return translationsForLang[key] || TRANSLATIONS["en"][key] || key;
}

interface BatchRequest {
  text: string;
  resolve: (translated: string) => void;
}

let batchQueue: BatchRequest[] = [];
let batchTimeout: any = null;
let currentTargetLang: string = "";

function processBatchQueue() {
  if (batchQueue.length === 0) return;

  const queueToProcess = [...batchQueue];
  const lang = currentTargetLang;

  // Clear queue
  batchQueue = [];
  batchTimeout = null;

  const textsToTranslate = queueToProcess.map(req => req.text);

  fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts: textsToTranslate, targetLang: lang }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Translation batch request failed");
      return res.json();
    })
    .then((data) => {
      const translatedTexts = data.translatedTexts || textsToTranslate;
      queueToProcess.forEach((req, idx) => {
        const translated = translatedTexts[idx] || req.text;
        req.resolve(translated);
      });
    })
    .catch((err) => {
      console.warn("Batch translation failed, using default texts", err);
      // Resolve all with original texts
      queueToProcess.forEach(req => {
        req.resolve(req.text);
      });
    });
}

function queueTranslation(text: string, lang: string): Promise<string> {
  return new Promise((resolve) => {
    if (currentTargetLang !== lang) {
      if (batchTimeout) {
        clearTimeout(batchTimeout);
        processBatchQueue();
      }
      currentTargetLang = lang;
    }

    batchQueue.push({ text, resolve });

    if (!batchTimeout) {
      batchTimeout = setTimeout(processBatchQueue, 50); // 50ms debounce
    }
  });
}

export function useTranslation(key: string, defaultText: string, lang: string): string {
  const actualKey = key || defaultText;

  // Resolve the translation value synchronously
  const getResolvedValue = (l: string, k: string) => {
    // 1. Static translations dictionary
    const translationsForLang = TRANSLATIONS[l];
    if (translationsForLang && translationsForLang[k]) {
      return translationsForLang[k];
    }
    // 2. English fallback
    if (l === "en") {
      return TRANSLATIONS["en"]?.[k] || defaultText;
    }
    // 3. Check localStorage cache
    const cacheKey = `cgrams_trans_${l}_${k}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return cached;
    }
    // 4. Return english translation/default text as temporary fallback before async fetch
    return TRANSLATIONS["en"]?.[k] || defaultText;
  };

  const [translatedText, setTranslatedText] = useState(() => getResolvedValue(lang, actualKey));
  const [prevLang, setPrevLang] = useState(lang);
  const [prevKey, setPrevKey] = useState(actualKey);

  let renderedText = translatedText;

  // Synchronously update state during render if lang or key changes to prevent UI flickering or stale translation
  if (lang !== prevLang || actualKey !== prevKey) {
    setPrevLang(lang);
    setPrevKey(actualKey);
    const newVal = getResolvedValue(lang, actualKey);
    setTranslatedText(newVal);
    renderedText = newVal;
  }

  useEffect(() => {
    // If it's statically translated or already in cache, no need to trigger async fetch
    const staticTrans = TRANSLATIONS[lang]?.[actualKey];
    if (staticTrans) return;

    if (lang === "en" || !defaultText.trim()) return;

    const cacheKey = `cgrams_trans_${lang}_${actualKey}`;
    if (localStorage.getItem(cacheKey)) return;

    let isMounted = true;
    queueTranslation(defaultText, lang)
      .then((translated) => {
        if (isMounted) {
          setTranslatedText(translated);
          localStorage.setItem(cacheKey, translated);
        }
      })
      .catch((err) => {
        console.warn("Translation failed, using default text", err);
      });

    return () => {
      isMounted = false;
    };
  }, [actualKey, defaultText, lang]);

  return renderedText;
}

interface TProps {
  children: string;
  lang: string;
  k?: string;
}

export function T({ children, lang, k }: TProps) {
  const translated = useTranslation(k || "", children, lang);
  return React.createElement(React.Fragment, null, translated);
}
