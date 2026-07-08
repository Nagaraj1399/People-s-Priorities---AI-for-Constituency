export type LanguageCode =
  | "en" | "hi" | "bn" | "te" | "mr" | "ta" | "ur" | "gu" | "kn" | "or" | "ml" | "pa" | "as" | "ma" | "ks" | "sd" | "sa" | "ne" | "ko" | "bo" | "do" | "sat";

export interface Language {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
}

export interface Grievance {
  id: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  title: string;
  description: string;
  category: string;
  status: "Submitted" | "In Review" | "Under Investigation" | "Sanctioned" | "Resolved";
  submittedAt: string;
  priorityScore: number;
  remarks: string;
  location: string;
  voiceUrl?: string;
  photoUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  estimatedCost: number; // in INR Lakhs
  category: string;
  urgencyLevel: "Critical" | "High" | "Medium" | "Low";
  regionalCensusFactor: number; // 0.1 to 1.0 (backward index)
  citizenBackingCount: number;
  priorityScore: number;
  status: "Pending Prioritization" | "Approved" | "Sanctioned" | "Declined";
  location: string;
  sanctorName?: string;
  sanctionedAmount?: number;
}

export interface FormulaWeights {
  urgencyWeight: number;
  costWeight: number;
  censusWeight: number;
  citizenBackingWeight: number;
}

export interface RegionalDataset {
  censusIndex: number;
  humidity: string;
  aqi: number;
  rainfallMm: number;
}

export type ActiveTab =
  | "landing"
  | "citizen-auth"
  | "citizen-grievance"
  | "regional-heatmap"
  | "mp-auth"
  | "mp-dashboard"
  | "logic-config"
  | "project-prioritization";
