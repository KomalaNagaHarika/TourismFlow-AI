import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Attraction, 
  DayPlan, 
  TripPreferences, 
  AnalyticsEvent, 
  LocalBusiness, 
  AlternativeComparison,
  ImpactBreakdown 
} from '../types/tourism';
import { 
  HYDERABAD_ATTRACTIONS, 
  DEMO_LOCAL_BUSINESSES, 
  ALTERNATIVE_COMPARISONS 
} from '../data/hyderabadData';

interface TourismFlowContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: 'home' | 'planner' | 'discover' | 'business' | 'insights';
  setActiveTab: (tab: 'home' | 'planner' | 'discover' | 'business' | 'insights') => void;
  
  // Trip Planner State
  preferences: TripPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<TripPreferences>>;
  itinerary: DayPlan[] | null;
  setItinerary: React.Dispatch<React.SetStateAction<DayPlan[] | null>>;
  itineraryDestination: string | null;
  setItineraryDestination: (dest: string | null) => void;
  originalGeneratedItinerary: DayPlan[] | null;
  setOriginalGeneratedItinerary: (plan: DayPlan[] | null) => void;
  savedTrips: { id: string; name: string; date: string; plan: DayPlan[]; preferences: TripPreferences }[];
  saveCurrentTrip: () => void;
  deleteSavedTrip: (id: string) => void;
  updateCurrentTripPlan: (updatedPlan: DayPlan[]) => void;
  addAttractionToTrip: (attraction: Attraction, targetDay?: number) => boolean;
  
  // Discovery & Bookmarks
  savedAttractionIds: string[];
  toggleSaveAttraction: (attractionId: string) => void;
  
  // Local Business Hub
  businesses: LocalBusiness[];
  activeBusinessId: string;
  setActiveBusinessId: (id: string) => void;
  updateBusiness: (updated: LocalBusiness) => void;
  updateBusinessProduct: (businessId: string, product: any) => void;
  addBusinessProduct: (businessId: string, product: any) => void;
  
  // Impact Engine & Analytics
  events: AnalyticsEvent[];
  logEvent: (type: AnalyticsEvent['type'], category: string, entityId?: string, entityName?: string, details?: any) => void;
  selectedAttractionForImpact: Attraction | null;
  setSelectedAttractionForImpact: (attraction: Attraction | null) => void;
  
  // Alternative Discovery Modal
  activeAlternative: AlternativeComparison | null;
  setActiveAlternative: (alt: AlternativeComparison | null) => void;

  // Reset demo
  resetDemoData: () => void;
}

const DEFAULT_PREFERENCES: TripPreferences = {
  destination: 'Hyderabad, Telangana',
  days: 2,
  startDate: new Date().toISOString().split('T')[0],
  arrivalTime: '09:00 AM',
  departureTime: '08:00 PM',
  travelersCount: 3,
  groupType: 'Family with Children',
  budgetInr: 8000,
  interests: ['Heritage', 'Food', 'Culture', 'Crafts'],
  transportPref: 'Cab / Rideshare',
  walkingPace: 'Relaxed & Accessible',
  crowdPref: 'Fewer Crowds & Authentic Gems',
};

const TourismFlowContext = createContext<TourismFlowContextType | undefined>(undefined);

export const TourismFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('Tourist');
  const [activeTab, setActiveTab] = useState<'home' | 'planner' | 'discover' | 'business' | 'insights'>('home');
  const [preferences, setPreferences] = useState<TripPreferences>(() => {
    const saved = localStorage.getItem('tf_preferences');
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  const [itinerary, setItinerary] = useState<DayPlan[] | null>(() => {
    const saved = localStorage.getItem('tf_current_itinerary');
    return saved ? JSON.parse(saved) : null;
  });

  const [itineraryDestination, setItineraryDestination] = useState<string | null>(() => {
    return localStorage.getItem('tf_current_itinerary_destination') || null;
  });

  const [originalGeneratedItinerary, setOriginalGeneratedItinerary] = useState<DayPlan[] | null>(() => {
    const saved = localStorage.getItem('tf_original_itinerary');
    return saved ? JSON.parse(saved) : null;
  });

  const [savedTrips, setSavedTrips] = useState<any[]>(() => {
    const saved = localStorage.getItem('tf_saved_trips');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedAttractionIds, setSavedAttractionIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tf_saved_attractions');
    return saved ? JSON.parse(saved) : ['laad-bazaar-bangles', 'nimrah-cafe'];
  });

  const [businesses, setBusinesses] = useState<LocalBusiness[]>(() => {
    const saved = localStorage.getItem('tf_businesses');
    return saved ? JSON.parse(saved) : DEMO_LOCAL_BUSINESSES;
  });

  const [activeBusinessId, setActiveBusinessId] = useState<string>('biz_haji_bangles');

  const [events, setEvents] = useState<AnalyticsEvent[]>(() => {
    const saved = localStorage.getItem('tf_events');
    if (saved) return JSON.parse(saved);
    // Baseline historical seed events for realistic authority dashboard
    const now = Date.now();
    return [
      { id: 'ev_01', timestamp: now - 86400000 * 2, type: 'view', category: 'Heritage', entityId: 'charminar', entityName: 'Charminar' },
      { id: 'ev_02', timestamp: now - 86400000 * 2, type: 'view', category: 'Crafts', entityId: 'laad-bazaar-bangles', entityName: 'Laad Bazaar Bangles' },
      { id: 'ev_03', timestamp: now - 86400000 * 1.5, type: 'save', category: 'Crafts', entityId: 'laad-bazaar-bangles', entityName: 'Laad Bazaar Bangles' },
      { id: 'ev_04', timestamp: now - 86400000 * 1.2, type: 'view', category: 'Food', entityId: 'nimrah-cafe', entityName: 'Nimrah Café' },
      { id: 'ev_05', timestamp: now - 86400000 * 1, type: 'trip_add', category: 'Food', entityId: 'nimrah-cafe', entityName: 'Nimrah Café' },
      { id: 'ev_06', timestamp: now - 86400000 * 0.8, type: 'view', category: 'Heritage', entityId: 'golkonda-fort', entityName: 'Golkonda Fort' },
      { id: 'ev_07', timestamp: now - 86400000 * 0.5, type: 'save', category: 'Culture', entityId: 'paigah-tombs', entityName: 'Paigah Tombs' },
      { id: 'ev_08', timestamp: now - 86400000 * 0.3, type: 'itinerary_gen', category: 'Heritage', entityName: '2-Day Family Hyderabad Trip' },
    ];
  });

  const [selectedAttractionForImpact, setSelectedAttractionForImpact] = useState<Attraction | null>(null);
  const [activeAlternative, setActiveAlternative] = useState<AlternativeComparison | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('tf_preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    if (itinerary) {
      localStorage.setItem('tf_current_itinerary', JSON.stringify(itinerary));
    } else {
      localStorage.removeItem('tf_current_itinerary');
    }
  }, [itinerary]);

  useEffect(() => {
    if (itineraryDestination) {
      localStorage.setItem('tf_current_itinerary_destination', itineraryDestination);
    } else {
      localStorage.removeItem('tf_current_itinerary_destination');
    }
  }, [itineraryDestination]);

  useEffect(() => {
    if (originalGeneratedItinerary) {
      localStorage.setItem('tf_original_itinerary', JSON.stringify(originalGeneratedItinerary));
    } else {
      localStorage.removeItem('tf_original_itinerary');
    }
  }, [originalGeneratedItinerary]);

  useEffect(() => {
    localStorage.setItem('tf_saved_trips', JSON.stringify(savedTrips));
  }, [savedTrips]);

  useEffect(() => {
    localStorage.setItem('tf_saved_attractions', JSON.stringify(savedAttractionIds));
  }, [savedAttractionIds]);

  useEffect(() => {
    localStorage.setItem('tf_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('tf_events', JSON.stringify(events));
  }, [events]);

  const logEvent = (
    type: AnalyticsEvent['type'], 
    category: string, 
    entityId?: string, 
    entityName?: string, 
    details?: any
  ) => {
    const newEvent: AnalyticsEvent = {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      type,
      category,
      entityId,
      entityName,
      details
    };

    setEvents(prev => [newEvent, ...prev]);

    // Also update business metrics if linked
    if (entityId) {
      setBusinesses(prev => prev.map(biz => {
        const matchesAttraction = HYDERABAD_ATTRACTIONS.find(a => a.id === entityId && a.businessId === biz.id);
        const matchesBizDirectly = biz.id === entityId;
        
        if (matchesAttraction || matchesBizDirectly) {
          const metrics = { ...biz.metrics };
          if (type === 'view') metrics.views += 1;
          if (type === 'save') metrics.saves += 1;
          if (type === 'trip_add') metrics.tripAdditions += 1;
          return { ...biz, metrics };
        }
        return biz;
      }));
    }
  };

  const toggleSaveAttraction = (attractionId: string) => {
    const isSaved = savedAttractionIds.includes(attractionId);
    const attraction = HYDERABAD_ATTRACTIONS.find(a => a.id === attractionId);

    if (isSaved) {
      setSavedAttractionIds(prev => prev.filter(id => id !== attractionId));
    } else {
      setSavedAttractionIds(prev => [...prev, attractionId]);
      if (attraction) {
        logEvent('save', attraction.category, attraction.id, attraction.name);
      }
    }
  };

  const saveCurrentTrip = () => {
    if (!itinerary) return;
    const newTrip = {
      id: `trip_${Date.now()}`,
      name: `${preferences.destination} (${preferences.days} Days • ${preferences.groupType})`,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      plan: itinerary,
      preferences: { ...preferences }
    };
    setSavedTrips(prev => [newTrip, ...prev]);
    logEvent('save', 'TripPlan', newTrip.id, newTrip.name);
  };

  const deleteSavedTrip = (id: string) => {
    setSavedTrips(prev => prev.filter(t => t.id !== id));
  };

  const updateCurrentTripPlan = (updatedPlan: DayPlan[]) => {
    setItinerary(updatedPlan);
    localStorage.setItem('tf_current_itinerary', JSON.stringify(updatedPlan));
    
    // Also update matching saved trip if one exists
    setSavedTrips(prev => prev.map(trip => {
      if (trip.preferences.destination.toLowerCase().trim() === preferences.destination.toLowerCase().trim() &&
          trip.preferences.days === preferences.days) {
        return { ...trip, plan: updatedPlan };
      }
      return trip;
    }));
  };

  const addAttractionToTrip = (attraction: Attraction, targetDay = 1): boolean => {
    if (!itinerary || itinerary.length === 0) {
      return false;
    }

    const dayIndex = Math.min(Math.max(targetDay - 1, 0), itinerary.length - 1);
    const day = itinerary[dayIndex];

    // Check if already in day
    if (day.activities.some(a => a.attractionId === attraction.id || a.activity.includes(attraction.name))) {
      return false;
    }

    const newItem = {
      id: `act_${Date.now()}`,
      time: '04:30 PM – 05:45 PM',
      activity: attraction.name,
      duration: attraction.duration,
      cost: attraction.avgCost,
      reason: attraction.whyVisit,
      transport: '10-minute transit in district cluster',
      travelTimeMinutes: 10,
      nearbyFoodOrRest: 'Local refreshing beverage stalls',
      mapsLink: `https://maps.google.com/?q=${encodeURIComponent(attraction.googleMapsQuery || attraction.name)}`,
      attractionId: attraction.id,
      category: attraction.category,
      isLocalGem: attraction.isLocalGem,
      impactScore: attraction.isLocalGem ? 97 : 85,
      impactReason: attraction.culturalImpact
    };

    const updatedPlan = [...itinerary];
    updatedPlan[dayIndex] = {
      ...day,
      activities: [...day.activities, newItem],
      dayCost: {
        ...day.dayCost,
        entryFees: day.dayCost.entryFees + attraction.avgCost,
        total: day.dayCost.total + attraction.avgCost
      }
    };

    setItinerary(updatedPlan);
    logEvent('trip_add', attraction.category, attraction.id, attraction.name);
    return true;
  };

  const updateBusinessProduct = (businessId: string, updatedProduct: any) => {
    setBusinesses(prev => prev.map(biz => {
      if (biz.id !== businessId) return biz;
      return {
        ...biz,
        products: biz.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      };
    }));
  };

  const addBusinessProduct = (businessId: string, product: any) => {
    setBusinesses(prev => prev.map(biz => {
      if (biz.id !== businessId) return biz;
      return {
        ...biz,
        products: [...biz.products, { ...product, id: `p_${Date.now()}` }]
      };
    }));
  };

  const updateBusiness = (updated: LocalBusiness) => {
    setBusinesses(prev => prev.map(biz => biz.id === updated.id ? updated : biz));
  };

  const resetDemoData = () => {
    localStorage.clear();
    setPreferences(DEFAULT_PREFERENCES);
    setItinerary(null);
    setItineraryDestination(null);
    setOriginalGeneratedItinerary(null);
    setSavedTrips([]);
    setSavedAttractionIds(['laad-bazaar-bangles', 'nimrah-cafe']);
    setBusinesses(DEMO_LOCAL_BUSINESSES);
  };

  return (
    <TourismFlowContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        preferences,
        setPreferences,
        itinerary,
        setItinerary,
        itineraryDestination,
        setItineraryDestination,
        originalGeneratedItinerary,
        setOriginalGeneratedItinerary,
        savedTrips,
        saveCurrentTrip,
        deleteSavedTrip,
        updateCurrentTripPlan,
        addAttractionToTrip,
        savedAttractionIds,
        toggleSaveAttraction,
        businesses,
        activeBusinessId,
        setActiveBusinessId,
        updateBusiness,
        updateBusinessProduct,
        addBusinessProduct,
        events,
        logEvent,
        selectedAttractionForImpact,
        setSelectedAttractionForImpact,
        activeAlternative,
        setActiveAlternative,
        resetDemoData,
      }}
    >
      {children}
    </TourismFlowContext.Provider>
  );
};

export const useTourismFlow = () => {
  const context = useContext(TourismFlowContext);
  if (!context) {
    throw new Error('useTourismFlow must be used within a TourismFlowProvider');
  }
  return context;
};
