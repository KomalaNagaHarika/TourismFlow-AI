export type UserRole = 'Tourist' | 'Business' | 'Authority';

export type Category = 'Heritage' | 'Food' | 'Culture' | 'Crafts' | 'Nature' | 'Shopping';

export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Unknown';

export type District = 'Old City' | 'Golkonda' | 'Central Hyderabad' | 'Secunderabad' | 'Hitec City & Madhapur';

export interface Attraction {
  id: string;
  name: string;
  category: Category;
  district: District;
  location: string;
  avgCost: number; // in INR
  duration: string;
  durationMinutes: number;
  bestTime: string;
  isLocalGem: boolean;
  crowdLevel: CrowdLevel;
  description: string;
  whyVisit: string;
  culturalImpact: string;
  image: string;
  tags: string[];
  openingHours: string;
  coordinates: { lat: number; lng: number };
  googleMapsQuery: string;
  businessId?: string;
  artisanName?: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  activity: string;
  duration: string;
  cost: number;
  reason: string;
  transport: string;
  travelTimeMinutes: number;
  nearbyFoodOrRest: string;
  mapsLink: string;
  attractionId?: string;
  category: Category;
  isLocalGem: boolean;
  impactScore?: number;
  impactReason?: string;
}

export interface DayCostBreakdown {
  transport: number;
  entryFees: number;
  food: number;
  artisanBuffer: number;
  total: number;
}

export interface DayPlan {
  day: number;
  dateStr?: string;
  theme: string;
  districtFocus: string;
  activities: ItineraryItem[];
  dayCost: DayCostBreakdown;
  travelTips: string;
}

export interface TripPreferences {
  destination: string;
  days: number;
  startDate: string;
  arrivalTime: string;
  departureTime: string;
  travelersCount: number;
  groupType: 'Family with Children' | 'Solo Explorer' | 'Couple / Honeymoon' | 'Group of Friends' | 'Senior Friendly';
  budgetInr: number;
  interests: Category[];
  transportPref: 'Cab / Rideshare' | 'Metro & Public Bus' | 'Mixed / Walkable' | 'Auto Rickshaw & Walking';
  walkingPace: 'Relaxed & Accessible' | 'Moderate' | 'Active Exploration';
  crowdPref: 'Fewer Crowds & Authentic Gems' | 'Balanced Mix' | 'All Major Iconic Landmarks';
}

export type PlanRepairType = 
  | 'late_start'
  | 'budget_decreased'
  | 'attraction_closed'
  | 'fewer_crowds'
  | 'more_rest'
  | 'skip_stop';

export interface PlanRepairExplanation {
  activityName: string;
  actionTaken: 'rescheduled' | 'swapped' | 'shortened' | 'removed' | 'added_rest';
  details: string;
}

export interface RepairResult {
  revisedPlan: DayPlan[];
  changeSummary: string;
  costDifference: number; // e.g. -450 or +0
  scheduleDifference: string;
  changes: PlanRepairExplanation[];
  isDemoFallback?: boolean;
}

export interface AlternativeComparison {
  id: string;
  popularName: string;
  popularCategory: Category;
  popularAvgCost: number;
  popularCrowd: CrowdLevel;
  popularHighlight: string;
  alternativeName: string;
  alternativeCategory: Category;
  alternativeAvgCost: number;
  alternativeCrowd: CrowdLevel;
  alternativeHighlight: string;
  costSavingsInr: number;
  whyChooseAlternative: string;
  distanceKm: string;
}

export interface LocalBusinessProduct {
  id: string;
  title: string;
  price: number;
  duration?: string;
  desc: string;
  isPopular?: boolean;
}

export interface LocalBusiness {
  id: string;
  name: string;
  artisanOwner: string;
  category: Category;
  location: string;
  district: string;
  story: string;
  shortDescription?: string;
  indicativePriceRange?: string;
  image?: string;
  tags?: string[];
  yearEstablished: number;
  heritageTradition: string;
  products: LocalBusinessProduct[];
  offers: string[];
  contact: {
    phone: string;
    address: string;
    hours: string;
  };
  metrics: {
    views: number;
    saves: number;
    impressions: number;
    tripAdditions: number;
    listingClicks?: number;
  };
  rating: number;
  reviewCount: number;
  verifiedLocal: boolean;
  opportunities?: {
    peakHours: string;
    matchingInterests: string[];
    pricingTips: string;
    demandTrend: string;
  };
}

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  type: 'view' | 'save' | 'trip_add' | 'itinerary_gen' | 'plan_repair' | 'advisor_query';
  category: string;
  entityId?: string;
  entityName?: string;
  details?: Record<string, any>;
}

export interface ImpactBreakdown {
  interestMatchScore: number; // 0-100
  affordabilityScore: number; // 0-100
  geographicClusteringScore: number; // 0-100
  crowdBalancingBonus: number; // 0-100
  localEconomyImpactScore: number; // 0-100
  overallScore: number; // 0-100
  explanation: string;
}
