export type LanguageCode = 
  | 'en' // English
  | 'hi' // Hindi
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'bn' // Bengali
  | 'kn' // Kannada
  | 'gu' // Gujarati
  | 'ml' // Malayalam
  | 'pa'; // Punjabi

export interface EmergencyContacts {
  police: string;
  ambulance: string;
  fire: string;
  womenHelpline: string;
  seniorHelpline: string;
  childHelpline: string;
  disasterMgmt: string;
  touristHelpline: string;
  bloodBank: string;
  roadAccident: string;
}

export interface CityInfo {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  tier: 1 | 2 | 3;
  description: string;
  emergency: EmergencyContacts;
}

export type HeritageCategory = 
  | 'Architectural'
  | 'Sacred'
  | 'Living'
  | 'Culinary'
  | 'Museum'
  | 'Natural';

export interface Landmark {
  id: string;
  cityId: string;
  name: string;
  category: HeritageCategory;
  description: string;
  history: string;
  architecturalStyle: string;
  imageUrl: string;
  audioGuideScript: string;
  visitingHours: string;
  ticketPrice: string;
  rating: number;
  lat: number;
  lng: number;
}

export interface Neighborhood {
  id: string;
  cityId: string;
  name: string;
  safetyScore: number;     // 0 - 100
  greeneryScore: number;   // 0 - 100
  mobilityScore: number;   // 0 - 100
  healthcareScore: number; // 0 - 100
  civicScore: number;      // 0 - 100
  populationDensity: number; // per sq km
  aqi: number;
  lat: number;
  lng: number;
}

export type HazardCategory = 
  | 'Pothole'
  | 'Streetlight Failure'
  | 'Water Pipe Leak'
  | 'Garbage Overflow'
  | 'Fallen Tree / Debris'
  | 'Broken Footpath'
  | 'Open Manhole';

export type IncidentStatus = 'Reported' | 'In Review' | 'Dispatched' | 'Resolved';

export interface IncidentReport {
  id: string;
  cityId: string;
  title: string;
  category: HazardCategory;
  description: string;
  severity: 1 | 2 | 3 | 4 | 5;
  lat: number;
  lng: number;
  address: string;
  status: IncidentStatus;
  upvotes: number;
  reportedAt: string;
  department: string;
  reporterBadge?: string;
}

export interface ReviewItem {
  id: string;
  cityId: string;
  author: string;
  isVerifiedResident: boolean;
  residentBadgeId?: string;
  type: 'tourist' | 'residential';
  title: string;
  content: string;
  rating: number;
  timestamp: string;
  upvotes: number;
  categoryTag: string;
}

export interface PathNode {
  id: string;
  lat: number;
  lng: number;
  name: string;
  hazardRisk: number; // 0.0 to 1.0
}
