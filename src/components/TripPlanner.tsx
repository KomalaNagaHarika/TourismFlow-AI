import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  IndianRupee, 
  Compass, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  Bookmark, 
  Share2, 
  Check, 
  AlertTriangle, 
  Car, 
  Utensils, 
  Info, 
  Footprints,
  ExternalLink,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  X,
  Save,
  RotateCcw
} from 'lucide-react';
import { useTourismFlow } from '../context/TourismFlowContext';
import { Category, PlanRepairType, RepairResult, DayPlan, ItineraryItem } from '../types/tourism';
import { HYDERABAD_ATTRACTIONS } from '../data/hyderabadData';
import { getCuratedDestinationItinerary } from '../data/destinationData';
import { TourismImpactModal } from './TourismImpactModal';

const INTEREST_OPTIONS: { id: Category; label: string; icon: string }[] = [
  { id: 'Heritage', label: 'Monuments & Heritage', icon: '🏛️' },
  { id: 'Food', label: 'Culinary & Irani Chai', icon: '☕' },
  { id: 'Crafts', label: 'Handloom & Artisans', icon: '🧶' },
  { id: 'Culture', label: 'Palaces & Museums', icon: '🕌' },
  { id: 'Nature', label: 'Lakes & Rock Formations', icon: '🌿' },
  { id: 'Shopping', label: 'Traditional Bazaars', icon: '🛍️' },
];

export const TripPlanner: React.FC = () => {
  const { 
    preferences, 
    setPreferences, 
    itinerary, 
    setItinerary, 
    itineraryDestination,
    setItineraryDestination,
    originalGeneratedItinerary,
    setOriginalGeneratedItinerary,
    saveCurrentTrip,
    updateCurrentTripPlan,
    logEvent,
    selectedAttractionForImpact,
    setSelectedAttractionForImpact
  } = useTourismFlow();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sourceNotice, setSourceNotice] = useState('');
  const [itinerarySource, setItinerarySource] = useState('');
  const [activeDayTab, setActiveDayTab] = useState<number>(1);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Plan Repair State
  const [repairing, setRepairing] = useState(false);
  const [repairResult, setRepairResult] = useState<RepairResult | null>(null);
  const [showRepairPanel, setShowRepairPanel] = useState(false);
  const [selectedRepairType, setSelectedRepairType] = useState<PlanRepairType>('late_start');
  const [repairDetails, setRepairDetails] = useState('');

  // Editing Itinerary State
  const [isEditing, setIsEditing] = useState(false);
  const [draftItinerary, setDraftItinerary] = useState<DayPlan[] | null>(null);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [targetAddDay, setTargetAddDay] = useState<number>(1);
  const [newLocationForm, setNewLocationForm] = useState<{
    placeName: string;
    cityAddress: string;
    category: Category;
    duration: string;
    cost: number;
    notes: string;
  }>({
    placeName: '',
    cityAddress: preferences.destination || '',
    category: 'Culture',
    duration: '1.5 hrs',
    cost: 0,
    notes: '',
  });
  const [addLocationError, setAddLocationError] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  // Active working plan: either draft (if editing) or saved itinerary
  const activeWorkingPlan = isEditing && draftItinerary ? draftItinerary : itinerary;

  // Handle Form Submission / Generation
  const handleGenerateItinerary = async () => {
    setIsGenerating(true);
    setErrorMsg('');
    setSourceNotice('');
    setRepairResult(null);
    setIsEditing(false);
    setDraftItinerary(null);
    // Explicitly reset existing itinerary to avoid showing previous destination data
    setItinerary(null);
    setItineraryDestination(null);

    const destClean = preferences.destination.trim();
    setGenerationStep(`Analyzing travel party, budget & pace for ${destClean}...`);
    const stepTimer1 = setTimeout(() => {
      setGenerationStep(`Clustering authentic attractions geographically in ${destClean}...`);
    }, 600);
    const stepTimer2 = setTimeout(() => {
      setGenerationStep(`Injecting local artisan workshops & culinary gems native to ${destClean}...`);
    }, 1200);

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonErr) {
          console.warn('JSON parse error from server:', jsonErr);
          data = null;
        }
      } else {
        // Non-JSON response (e.g., HTML 404/500 error page from server or Vercel edge)
        const rawText = await response.text();
        console.warn(`Received non-JSON response (HTTP ${response.status}):`, rawText.slice(0, 150));
      }

      // Check if server returned a successful valid plan
      if (response.ok && data && Array.isArray(data.days) && data.days.length > 0) {
        setItinerary(data.days);
        setItineraryDestination(destClean);
        setOriginalGeneratedItinerary(data.days);
        setItinerarySource(data.source || `TourismFlow AI (${destClean})`);
        if (data.notice) {
          setSourceNotice(data.notice);
        }
        setActiveDayTab(1);
        logEvent('itinerary_gen', 'SmartPlanner', `plan_${Date.now()}`, `${preferences.days}-Day Itinerary for ${destClean}`);
        return;
      }

      // If we reach here, server request either returned an error or was not JSON
      let serverErrorMsg = data?.error;
      if (!serverErrorMsg) {
        if (response.status === 404) {
          serverErrorMsg = `The itinerary API endpoint was not reachable (HTTP 404). If running on Vercel, verify that serverless functions are deployed.`;
        } else if (response.status === 500) {
          serverErrorMsg = `The server encountered an internal issue (HTTP 500) while generating your itinerary.`;
        } else if (response.status === 503) {
          serverErrorMsg = `The AI model is currently experiencing high demand (HTTP 503). Please retry in a few moments.`;
        } else {
          serverErrorMsg = `Itinerary service returned status ${response.status}.`;
        }
      }

      // Safe Graceful Fallback for verified destinations:
      // Check if this EXACT destination is in our curated sample catalog
      const exactCurated = getCuratedDestinationItinerary(preferences);
      if (exactCurated) {
        setItinerary(exactCurated.days);
        setItineraryDestination(destClean);
        setOriginalGeneratedItinerary(exactCurated.days);
        setItinerarySource(exactCurated.source);
        setSourceNotice(`Loaded verified curated local itinerary for ${destClean}. (${serverErrorMsg})`);
        setActiveDayTab(1);
        logEvent('itinerary_gen', 'SmartPlanner', `plan_${Date.now()}`, `Curated fallback for ${destClean}`);
        return;
      }

      // Destination is NOT in curated catalog and live AI failed:
      // Never silently substitute with an unrelated destination!
      setItinerary(null);
      setItineraryDestination(null);
      throw new Error(
        serverErrorMsg ||
        `Could not generate recommendations for "${destClean}". This destination is not currently in our local sample dataset, and the AI service is temporarily unavailable. Please retry in a moment or explore supported sample destinations: Hyderabad, Visakhapatnam, Jaipur, Bengaluru, Goa, Delhi, Mumbai, or Kochi.`
      );
    } catch (err: any) {
      console.error('Trip plan generation error:', err);
      setErrorMsg(err.message || `Unable to generate recommendations for "${preferences.destination}".`);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
    }
  };

  // Handle Adaptive Plan Repair
  const handleRunRepair = async (typeToRun?: PlanRepairType) => {
    if (!itinerary || itinerary.length === 0) return;

    const chosenType = typeToRun || selectedRepairType;
    setRepairing(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/repair-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan: itinerary,
          repairType: chosenType,
          preferences,
          problemDetails: repairDetails,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let result: RepairResult | null = null;
      if (contentType.includes('application/json')) {
        try {
          result = await response.json();
        } catch (jsonErr) {
          console.warn('Repair JSON parse error:', jsonErr);
        }
      }

      if (!response.ok || !result || !result.revisedPlan) {
        throw new Error(`Plan repair service returned status ${response.status}`);
      }

      setRepairResult(result);
      setItinerary(result.revisedPlan);
      logEvent('plan_repair', 'AdaptiveAI', `repair_${chosenType}`, result.changeSummary);
    } catch (err: any) {
      console.error('Plan repair error:', err);
      setErrorMsg('Could not run plan repair. Please retry in a moment.');
    } finally {
      setRepairing(false);
    }
  };

  // --- Itinerary Editing Helpers ---

  const handleStartEditing = () => {
    if (!itinerary) return;
    setDraftItinerary(JSON.parse(JSON.stringify(itinerary)));
    setIsEditing(true);
    setEditSuccessMsg('');
  };

  const handleCancelEditing = () => {
    setDraftItinerary(null);
    setIsEditing(false);
  };

  // Recalculates cost breakdown for a given day
  const recalculateDayCosts = (day: DayPlan): DayPlan => {
    const totalActivityCosts = day.activities.reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
    const entryFees = totalActivityCosts;
    const transport = day.dayCost?.transport || 200;
    const food = day.dayCost?.food || 450;
    const artisanBuffer = day.dayCost?.artisanBuffer || 250;
    const total = transport + entryFees + food + artisanBuffer;

    return {
      ...day,
      dayCost: {
        transport,
        entryFees,
        food,
        artisanBuffer,
        total
      }
    };
  };

  const handleResetToOriginal = () => {
    if (originalGeneratedItinerary) {
      const cloned = JSON.parse(JSON.stringify(originalGeneratedItinerary));
      setItinerary(cloned);
      setDraftItinerary(cloned);
      setEditSuccessMsg('Reverted itinerary to original generated plan.');
      setTimeout(() => setEditSuccessMsg(''), 4000);
    }
  };

  const handleUpdateActivityField = (dayNumber: number, actIndex: number, field: string, value: any) => {
    if (!draftItinerary) return;

    const updated = draftItinerary.map(day => {
      if (day.day !== dayNumber) return day;
      const updatedActs = [...day.activities];
      const prev = updatedActs[actIndex];
      const newAct = {
        ...prev,
        [field]: field === 'cost' ? Number(value) || 0 : value
      };
      // Keep mapsLink in sync if activity name is updated
      if (field === 'activity' && typeof value === 'string' && value.trim()) {
        newAct.mapsLink = `https://maps.google.com/?q=${encodeURIComponent(value.trim() + ', ' + (preferences.destination || ''))}`;
      }
      updatedActs[actIndex] = newAct;
      return recalculateDayCosts({ ...day, activities: updatedActs });
    });

    setDraftItinerary(updated);
  };

  const handleMoveActivity = (dayNumber: number, index: number, direction: 'up' | 'down') => {
    if (!draftItinerary) return;

    const updated = draftItinerary.map(day => {
      if (day.day !== dayNumber) return day;
      const acts = [...day.activities];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= acts.length) return day;

      const temp = acts[index];
      acts[index] = acts[targetIndex];
      acts[targetIndex] = temp;

      return { ...day, activities: acts };
    });

    setDraftItinerary(updated);
  };

  // Move an attraction to another day
  const handleMoveActivityToDay = (fromDayNumber: number, actIndex: number, toDayNumber: number) => {
    if (!draftItinerary || fromDayNumber === toDayNumber) return;

    const sourceDay = draftItinerary.find(d => d.day === fromDayNumber);
    if (!sourceDay || !sourceDay.activities[actIndex]) return;

    const activityToMove = { ...sourceDay.activities[actIndex] };

    const updated = draftItinerary.map(day => {
      if (day.day === fromDayNumber) {
        const remaining = day.activities.filter((_, idx) => idx !== actIndex);
        return recalculateDayCosts({ ...day, activities: remaining });
      }
      if (day.day === toDayNumber) {
        const added = [...day.activities, activityToMove];
        return recalculateDayCosts({ ...day, activities: added });
      }
      return day;
    });

    setDraftItinerary(updated);
  };

  const handleRemoveActivity = (dayNumber: number, index: number) => {
    if (!draftItinerary) return;

    const updated = draftItinerary.map(day => {
      if (day.day !== dayNumber) return day;
      const acts = day.activities.filter((_, i) => i !== index);
      return recalculateDayCosts({ ...day, activities: acts });
    });

    setDraftItinerary(updated);
  };

  const handleOpenAddLocation = (dayNum = activeDayTab) => {
    setTargetAddDay(dayNum);
    setNewLocationForm({
      placeName: '',
      cityAddress: preferences.destination || '',
      category: 'Culture',
      duration: '1.5 hrs',
      cost: 0,
      notes: '',
    });
    setAddLocationError('');
    setShowAddLocationModal(true);
  };

  const handleAddLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationForm.placeName.trim()) {
      setAddLocationError('Place name is required.');
      return;
    }
    if (!newLocationForm.cityAddress.trim()) {
      setAddLocationError('City or address is required.');
      return;
    }

    const currentBase = draftItinerary || itinerary;
    if (!currentBase) return;

    const newActivity: ItineraryItem = {
      id: `act_custom_${Date.now()}`,
      time: '03:30 PM – 05:00 PM',
      activity: newLocationForm.placeName.trim(),
      duration: newLocationForm.duration.trim() || '1.5 hrs',
      cost: Number(newLocationForm.cost) || 0,
      reason: newLocationForm.notes.trim() || `Custom destination in ${newLocationForm.cityAddress.trim()} added by traveler.`,
      transport: 'Local transit / short walk',
      travelTimeMinutes: 10,
      nearbyFoodOrRest: `Local restaurants & tea stalls around ${newLocationForm.cityAddress.trim()}`,
      mapsLink: `https://maps.google.com/?q=${encodeURIComponent(newLocationForm.placeName.trim() + ', ' + newLocationForm.cityAddress.trim())}`,
      category: newLocationForm.category || 'Culture',
      isLocalGem: true,
      impactScore: 92,
      impactReason: 'Custom independent travel destination.'
    };

    const targetDayIndex = Math.min(Math.max(targetAddDay - 1, 0), currentBase.length - 1);
    const updated = currentBase.map((day, idx) => {
      if (idx !== targetDayIndex) return day;
      const acts = [...day.activities, newActivity];
      return recalculateDayCosts({ ...day, activities: acts });
    });

    if (isEditing) {
      setDraftItinerary(updated);
    } else {
      setDraftItinerary(updated);
      setIsEditing(true);
    }

    setShowAddLocationModal(false);
  };

  const handleSaveEditedItinerary = () => {
    if (!draftItinerary) return;

    updateCurrentTripPlan(draftItinerary);
    setItinerary(draftItinerary);
    setIsEditing(false);
    setDraftItinerary(null);

    setEditSuccessMsg('Itinerary changes saved and costs recalculated successfully!');
    setTimeout(() => setEditSuccessMsg(''), 4000);
  };

  const handleInterestToggle = (cat: Category) => {
    setPreferences(prev => {
      const exists = prev.interests.includes(cat);
      const newInterests = exists 
        ? prev.interests.filter(i => i !== cat)
        : [...prev.interests, cat];
      return { ...prev, interests: newInterests.length > 0 ? newInterests : [cat] };
    });
  };

  const handleSaveTrip = () => {
    saveCurrentTrip();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  // Find attraction object for modal inspection
  const openImpactExplanationForActivity = (activity: any) => {
    const found = HYDERABAD_ATTRACTIONS.find(a => 
      a.id === activity.attractionId || 
      a.name.toLowerCase().includes(activity.activity.toLowerCase()) ||
      activity.activity.toLowerCase().includes(a.name.toLowerCase())
    );

    if (found) {
      setSelectedAttractionForImpact(found);
    } else {
      setSelectedAttractionForImpact({
        id: activity.id || 'custom',
        name: activity.activity,
        category: activity.category || 'Culture',
        district: 'Old City',
        location: preferences.destination || 'India',
        avgCost: activity.cost || 100,
        duration: activity.duration || '1.5 hrs',
        durationMinutes: 90,
        bestTime: 'Morning or Afternoon',
        isLocalGem: activity.isLocalGem || true,
        crowdLevel: activity.isLocalGem ? 'Low' : 'Moderate',
        description: activity.reason,
        whyVisit: activity.reason,
        culturalImpact: activity.impactReason || 'Supports local tourism and neighborhood vendors.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
        tags: ['Curated Stop'],
        openingHours: '09:00 AM – 06:00 PM',
        coordinates: { lat: 17.6868, lng: 83.2185 },
        googleMapsQuery: activity.activity + ', ' + preferences.destination
      });
    }
  };

  const activeDayPlan = activeWorkingPlan?.find(d => d.day === activeDayTab) || activeWorkingPlan?.[0];
  const totalCalculatedCost = activeWorkingPlan?.reduce((sum, d) => sum + (d.dayCost?.total || 0), 0) || 0;
  const totalLocationsCount = activeWorkingPlan?.reduce((sum, d) => sum + d.activities.length, 0) || 0;
  const isBudgetExceeded = totalCalculatedCost > preferences.budgetInr;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
            <span>Smart Trip Planner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-display">
            Plan Your {preferences.destination.split(',')[0].trim() || 'Trip'} Experience
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-xl">
            Custom-designed with geographical clustering to prevent transit fatigue and prioritize authentic artisan livelihoods.
          </p>
        </div>

        {/* Quick presets for testing */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setPreferences({
                ...preferences,
                destination: 'Hyderabad, Telangana',
                days: 2,
                groupType: 'Family with Children',
                budgetInr: 8000,
                interests: ['Heritage', 'Food', 'Culture', 'Crafts'],
                walkingPace: 'Relaxed & Accessible',
                crowdPref: 'Fewer Crowds & Authentic Gems'
              });
            }}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Hyderabad
          </button>
          <button
            onClick={() => {
              setPreferences({
                ...preferences,
                destination: 'Visakhapatnam, Andhra Pradesh',
                days: 2,
                groupType: 'Family with Children',
                budgetInr: 7500,
                interests: ['Nature', 'Food', 'Culture', 'Crafts'],
                walkingPace: 'Moderate',
                crowdPref: 'Balanced Mix'
              });
            }}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Visakhapatnam
          </button>
          <button
            onClick={() => {
              setPreferences({
                ...preferences,
                destination: 'Jaipur, Rajasthan',
                days: 2,
                groupType: 'Couple / Honeymoon',
                budgetInr: 9000,
                interests: ['Heritage', 'Culture', 'Crafts', 'Shopping'],
                walkingPace: 'Moderate',
                crowdPref: 'Balanced Mix'
              });
            }}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Jaipur
          </button>
          <button
            onClick={() => {
              setPreferences({
                ...preferences,
                destination: 'Bengaluru, Karnataka',
                days: 2,
                groupType: 'Solo Explorer',
                budgetInr: 6000,
                interests: ['Nature', 'Food', 'Culture', 'Shopping'],
                walkingPace: 'Active Exploration',
                crowdPref: 'Fewer Crowds & Authentic Gems'
              });
            }}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Bengaluru
          </button>
          <button
            onClick={() => {
              setPreferences({
                ...preferences,
                destination: 'Goa',
                days: 2,
                groupType: 'Group of Friends',
                budgetInr: 10000,
                interests: ['Nature', 'Culture', 'Food', 'Crafts'],
                walkingPace: 'Relaxed & Accessible',
                crowdPref: 'Balanced Mix'
              });
            }}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Goa
          </button>
        </div>
      </div>

      {/* Main Input Configuration Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-800" />
              <span>Destination</span>
            </label>
            <input
              type="text"
              value={preferences.destination}
              onChange={(e) => setPreferences({ ...preferences, destination: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              placeholder="e.g. Visakhapatnam, Jaipur, Bengaluru, or Paris"
            />
            {itinerary && itineraryDestination && preferences.destination.toLowerCase().trim() !== itineraryDestination.toLowerCase().trim() && (
              <p className="text-[11px] text-amber-800 font-medium">
                ⚡ Current plan is for <strong>{itineraryDestination}</strong>. Click Generate to build for <strong>{preferences.destination}</strong>.
              </p>
            )}
          </div>

          {/* Days Count */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              <span>Trip Duration</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, days: d })}
                  className={`py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    preferences.days === d
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {d} {d === 1 ? 'Day' : 'Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Group Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-800" />
              <span>Travel Party</span>
            </label>
            <select
              value={preferences.groupType}
              onChange={(e: any) => setPreferences({ ...preferences, groupType: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 cursor-pointer"
            >
              <option value="Family with Children">Family with Children (4 pax)</option>
              <option value="Solo Explorer">Solo Explorer (1 pax)</option>
              <option value="Couple / Honeymoon">Couple / Honeymoon (2 pax)</option>
              <option value="Group of Friends">Group of Friends (3-5 pax)</option>
              <option value="Senior Friendly">Senior Friendly / Accessible</option>
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-800" />
                <span>Total Budget</span>
              </label>
              <span className="text-xs font-bold text-emerald-900 font-mono">
                ₹{preferences.budgetInr.toLocaleString('en-IN')} INR
              </span>
            </div>
            <input
              type="range"
              min={2500}
              max={30000}
              step={500}
              value={preferences.budgetInr}
              onChange={(e) => setPreferences({ ...preferences, budgetInr: Number(e.target.value) })}
              className="w-full accent-emerald-900 py-3 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>₹2,500</span>
              <span>₹15,000</span>
              <span>₹30,000</span>
            </div>
          </div>

        </div>

        {/* Interests Pills */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Select Your Interests (Multi-Select)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {INTEREST_OPTIONS.map((item) => {
              const selected = preferences.interests.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleInterestToggle(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    selected
                      ? 'bg-emerald-900 text-white shadow-sm ring-2 ring-emerald-900/30'
                      : 'bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Preferences: Transport, Pace, Crowds */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-stone-100">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-stone-500" />
              <span>Transport Preference</span>
            </label>
            <select
              value={preferences.transportPref}
              onChange={(e: any) => setPreferences({ ...preferences, transportPref: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900"
            >
              <option value="Cab / Rideshare">Cab / Rideshare (Uber/Ola)</option>
              <option value="Metro & Public Bus">Metro & Public Bus (Budget)</option>
              <option value="Mixed / Walkable">Mixed / Walkable Transit</option>
              <option value="Auto Rickshaw & Walking">Auto Rickshaw & Walking</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-stone-500" />
              <span>Walking & Accessibility Pace</span>
            </label>
            <select
              value={preferences.walkingPace}
              onChange={(e: any) => setPreferences({ ...preferences, walkingPace: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900"
            >
              <option value="Relaxed & Accessible">Relaxed & Accessible (Elders/Kids)</option>
              <option value="Moderate">Moderate (Standard sightseeing)</option>
              <option value="Active Exploration">Active Exploration (10,000+ steps)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-stone-500" />
              <span>Crowd & Experience Style</span>
            </label>
            <select
              value={preferences.crowdPref}
              onChange={(e: any) => setPreferences({ ...preferences, crowdPref: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900"
            >
              <option value="Fewer Crowds & Authentic Gems">Fewer Crowds & Authentic Gems</option>
              <option value="Balanced Mix">Balanced Mix (Icons + Local Gems)</option>
              <option value="All Major Iconic Landmarks">All Major Iconic Landmarks</option>
            </select>
          </div>

        </div>

        {/* Generate Button & Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-stone-500">
            {isGenerating ? (
              <span className="flex items-center gap-2 text-emerald-800 font-semibold animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{generationStep || `Building itinerary for ${preferences.destination}...`}</span>
              </span>
            ) : (
              <span>Destination: <strong>{preferences.destination}</strong></span>
            )}
          </div>

          <button
            onClick={handleGenerateItinerary}
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-900 text-white font-bold text-sm shadow-md hover:bg-emerald-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Architecting Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{itinerary ? `Regenerate for ${preferences.destination.split(',')[0].trim()}` : `Generate Itinerary for ${preferences.destination.split(',')[0].trim()}`}</span>
              </>
            )}
          </button>
        </div>

        {/* Clear Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-800 text-xs flex items-start gap-3 border border-red-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-bold">Itinerary Generation Notice:</strong>
              <p className="leading-relaxed">{errorMsg}</p>
              <button
                onClick={handleGenerateItinerary}
                className="mt-2 px-3 py-1 bg-red-800 text-white font-bold rounded-lg hover:bg-red-900 transition-colors"
              >
                Retry Generation
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Edit Success Toast */}
      {editSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white text-xs font-bold flex items-center gap-2 shadow-md animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{editSuccessMsg}</span>
        </div>
      )}

      {/* Generated Itinerary Section */}
      {activeWorkingPlan && activeWorkingPlan.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Itinerary Header Bar */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {isEditing ? 'Editing Mode Active' : 'Confirmed Itinerary'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                  {totalLocationsCount} Planned Locations
                </span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 font-display">
                {itineraryDestination || preferences.destination} — {preferences.days} Days for {preferences.groupType}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Total Estimated Cost: <strong className="text-emerald-900 font-mono">₹{totalCalculatedCost.toLocaleString('en-IN')}</strong> of ₹{preferences.budgetInr.toLocaleString('en-IN')} budget
              </p>
              {sourceNotice && (
                <div className="mt-2.5 text-xs px-3 py-1.5 rounded-xl bg-amber-50/90 text-amber-900 border border-amber-200/80 flex items-center gap-1.5 font-medium">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{sourceNotice}</span>
                </div>
              )}
            </div>

            {/* Quick Actions Bar with EDIT ITINERARY button */}
            <div className="flex flex-wrap items-center gap-2.5">
              {!isEditing ? (
                <>
                  {/* Edit Itinerary Button */}
                  <button
                    onClick={handleStartEditing}
                    className="px-4 py-2.5 rounded-xl bg-emerald-900 text-white text-xs font-bold shadow-sm hover:bg-emerald-800 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-amber-300" />
                    <span>Edit Itinerary</span>
                  </button>

                  <button
                    onClick={() => handleOpenAddLocation(activeDayTab)}
                    className="px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Location</span>
                  </button>

                  <button
                    onClick={handleSaveTrip}
                    className="px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span>{savedSuccess ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>Share</span>
                  </button>

                  <button
                    onClick={() => setShowRepairPanel(!showRepairPanel)}
                    className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 border border-amber-300/60 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Plan Repair AI</span>
                  </button>
                </>
              ) : (
                /* Active Editing Mode Controls */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAddLocation(activeDayTab)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold hover:bg-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Location</span>
                  </button>

                  {originalGeneratedItinerary && (
                    <button
                      type="button"
                      onClick={handleResetToOriginal}
                      className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title="Reset edits to original generated plan"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                      <span className="hidden sm:inline">Reset</span>
                    </button>
                  )}

                  <button
                    onClick={handleCancelEditing}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveEditedItinerary}
                    className="px-5 py-2 rounded-xl bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-800 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Budget Warning Banner if Exceeded */}
          {isBudgetExceeded && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0" />
                <span>
                  <strong>Budget Alert:</strong> Total estimated costs (₹{totalCalculatedCost.toLocaleString('en-IN')}) exceed your ₹{preferences.budgetInr.toLocaleString('en-IN')} trip budget by <strong>₹{(totalCalculatedCost - preferences.budgetInr).toLocaleString('en-IN')}</strong>.
                </span>
              </div>
              <span className="text-[11px] text-amber-800 font-medium hidden sm:inline">
                Adjust item costs or increase your budget setting.
              </span>
            </div>
          )}

          {/* Adaptive Itinerary / Plan Repair AI Dropdown Panel */}
          {showRepairPanel && !isEditing && (
            <div className="bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 space-y-6 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
                    <span>Real-World Scenario Adjustment</span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 font-display">
                    Adaptive Plan Repair AI
                  </h3>
                  <p className="text-xs text-stone-600 max-w-2xl mt-1">
                    Select any unexpected problem. Gemini will restructure your timings, swap costly stops for high-value alternatives, or introduce rest buffers.
                  </p>
                </div>

                <button
                  onClick={() => setShowRepairPanel(false)}
                  className="text-stone-400 hover:text-stone-700 p-1 text-sm font-semibold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Problem Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'late_start' as PlanRepairType, label: 'We started late (+1.5 hrs)', icon: '⏰' },
                  { id: 'budget_decreased' as PlanRepairType, label: 'Our budget has decreased', icon: '📉' },
                  { id: 'fewer_crowds' as PlanRepairType, label: 'We want fewer crowded places', icon: '🌿' },
                  { id: 'more_rest' as PlanRepairType, label: 'Someone in group needs rest', icon: '🪑' },
                  { id: 'attraction_closed' as PlanRepairType, label: 'One attraction is closed', icon: '🚫' },
                  { id: 'skip_stop' as PlanRepairType, label: 'We want to skip a stop', icon: '⏭️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedRepairType(item.id);
                      handleRunRepair(item.id);
                    }}
                    disabled={repairing}
                    className={`p-3.5 rounded-2xl text-left border text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      selectedRepairType === item.id
                        ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                        : 'bg-white border-amber-200/80 text-stone-800 hover:bg-amber-100/50'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Repair Result Banner */}
              {repairResult && (
                <div className="p-5 rounded-2xl bg-white border border-amber-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Adaptive Adjustment Applied</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-700">
                      Cost Impact: {repairResult.costDifference < 0 ? `Saved ₹${Math.abs(repairResult.costDifference)}` : 'Neutral'}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-stone-800 leading-relaxed">
                    {repairResult.changeSummary}
                  </p>

                  <p className="text-xs text-stone-500">
                    <strong>Schedule difference:</strong> {repairResult.scheduleDifference}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Day Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-stone-200 gap-2">
            <div className="flex gap-2">
              {activeWorkingPlan.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDayTab(day.day)}
                  className={`pb-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                    activeDayTab === day.day
                      ? 'border-emerald-900 text-emerald-900'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  <span>Day {day.day}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono">
                    {day.activities.length} Stops
                  </span>
                </button>
              ))}
            </div>

            {isEditing && (
              <button
                onClick={() => handleOpenAddLocation(activeDayTab)}
                className="text-xs font-bold text-emerald-900 hover:text-emerald-700 pb-2 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stop to Day {activeDayTab}</span>
              </button>
            )}
          </div>

          {/* Active Day Card & Timeline */}
          {activeDayPlan && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Cols: Timeline Activities */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Day Theme Banner */}
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Focus: {activeDayPlan.districtFocus}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">Day {activeDayPlan.day} of {activeWorkingPlan.length}</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 font-display mt-1">
                    {activeDayPlan.theme}
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{activeDayPlan.travelTips}</span>
                  </p>
                </div>

                {/* Timeline Stops */}
                <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-900/20 space-y-6">
                  {activeDayPlan.activities.map((act, idx) => (
                    <div key={act.id || idx} className="relative group">
                      
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-4 border-white ${
                        act.isLocalGem ? 'bg-amber-600 ring-2 ring-amber-300' : 'bg-emerald-900'
                      }`} />

                      {/* Normal Display Card */}
                      {!isEditing ? (
                        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
                          
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md">
                                {act.time}
                              </span>
                              <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {act.duration}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {act.isLocalGem && (
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                  Local Gem
                                </span>
                              )}
                              <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                                {act.category}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-bold text-stone-900 font-display">
                              {act.activity}
                            </h4>
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                              {act.reason}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100 text-xs">
                            <div className="flex items-center gap-2 text-stone-600">
                              <IndianRupee className="w-3.5 h-3.5 text-stone-400" />
                              <span>
                                Cost: <strong className="text-stone-900 font-mono">₹{act.cost}</strong>/pax
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-stone-600">
                              <Car className="w-3.5 h-3.5 text-stone-400" />
                              <span className="truncate" title={act.transport}>
                                {act.transport} {act.travelTimeMinutes ? `(${act.travelTimeMinutes}m)` : ''}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-stone-600">
                              <Utensils className="w-3.5 h-3.5 text-stone-400" />
                              <span className="truncate" title={act.nearbyFoodOrRest}>
                                {act.nearbyFoodOrRest}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                            <button
                              onClick={() => openImpactExplanationForActivity(act)}
                              className="font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>Why was this recommended?</span>
                            </button>

                            <a
                              href={act.mapsLink || `https://maps.google.com/?q=${encodeURIComponent(act.activity + ', ' + preferences.destination)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1"
                            >
                              <span>Google Maps</span>
                              <ExternalLink className="w-3 h-3 text-stone-400" />
                            </a>
                          </div>

                        </div>
                      ) : (
                        /* Editable Itinerary Item Card */
                        <div className="bg-white rounded-2xl p-5 border-2 border-emerald-600/40 shadow-sm space-y-4">
                          
                          {/* Order Shift Controls, Day Switcher & Delete */}
                          <div className="flex flex-wrap items-center justify-between bg-stone-50 p-2.5 rounded-xl text-xs gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">
                                Stop #{idx + 1}
                              </span>
                              {activeWorkingPlan.length > 1 && (
                                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                                  <span className="text-[10px] text-stone-400 font-medium">Day:</span>
                                  <select
                                    value={activeDayPlan.day}
                                    onChange={(e) => handleMoveActivityToDay(activeDayPlan.day, idx, Number(e.target.value))}
                                    className="font-bold text-emerald-900 bg-transparent text-xs focus:outline-none cursor-pointer"
                                    title="Move this attraction to another day"
                                  >
                                    {activeWorkingPlan.map(d => (
                                      <option key={d.day} value={d.day}>Day {d.day}</option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleMoveActivity(activeDayPlan.day, idx, 'up')}
                                disabled={idx === 0}
                                title="Move Earlier in Day"
                                className="px-2 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 disabled:opacity-30 cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Up</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleMoveActivity(activeDayPlan.day, idx, 'down')}
                                disabled={idx === activeDayPlan.activities.length - 1}
                                title="Move Later in Day"
                                className="px-2 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 disabled:opacity-30 cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Down</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveActivity(activeDayPlan.day, idx)}
                                title="Remove Stop"
                                className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer flex items-center gap-1 text-[11px] font-bold ml-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>

                          {/* Editable Attraction Name */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase text-stone-500">Attraction / Activity Name</label>
                            <input
                              type="text"
                              value={act.activity}
                              onChange={(e) => handleUpdateActivityField(activeDayPlan.day, idx, 'activity', e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                            />
                          </div>

                          {/* Time, Duration & Cost grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold uppercase text-stone-500">Planned Time</label>
                              <input
                                type="text"
                                value={act.time}
                                onChange={(e) => handleUpdateActivityField(activeDayPlan.day, idx, 'time', e.target.value)}
                                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold uppercase text-stone-500">Duration</label>
                              <input
                                type="text"
                                value={act.duration}
                                onChange={(e) => handleUpdateActivityField(activeDayPlan.day, idx, 'duration', e.target.value)}
                                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-medium"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold uppercase text-stone-500">Cost (₹ INR)</label>
                              <input
                                type="number"
                                min={0}
                                value={act.cost}
                                onChange={(e) => handleUpdateActivityField(activeDayPlan.day, idx, 'cost', e.target.value)}
                                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-emerald-900"
                              />
                            </div>
                          </div>

                          {/* Editable Reason / Description */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase text-stone-500">Description / Recommendation Reason</label>
                            <textarea
                              rows={2}
                              value={act.reason}
                              onChange={(e) => handleUpdateActivityField(activeDayPlan.day, idx, 'reason', e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700"
                            />
                          </div>

                        </div>
                      )}

                    </div>
                  ))}
                </div>

                {/* Add Stop Button at Bottom of Timeline */}
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenAddLocation(activeDayPlan.day)}
                    className="w-full py-3.5 border-2 border-dashed border-stone-300 hover:border-emerald-700 rounded-2xl text-stone-600 hover:text-emerald-900 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                  >
                    <Plus className="w-4 h-4 text-emerald-800" />
                    <span>Add New Stop to Day {activeDayPlan.day}</span>
                  </button>
                </div>

              </div>

              {/* Right Col: Cost Breakdown Card */}
              <div className="space-y-6">
                
                <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                      Day {activeDayPlan.day} Cost Breakdown
                    </h3>
                    {isEditing && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Auto-Recalculating
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-600 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-stone-400" />
                        <span>Transport & Cabs</span>
                      </span>
                      <span className="font-mono font-bold text-stone-900">
                        ₹{activeDayPlan.dayCost?.transport || 200}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>Attractions & Entry Tickets</span>
                      </span>
                      <span className="font-mono font-bold text-stone-900">
                        ₹{activeDayPlan.dayCost?.entryFees || 0}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-600 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-stone-400" />
                        <span>Meals & Refreshments</span>
                      </span>
                      <span className="font-mono font-bold text-stone-900">
                        ₹{activeDayPlan.dayCost?.food || 450}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-600 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Artisan & Incidentals Buffer</span>
                      </span>
                      <span className="font-mono font-bold text-stone-900">
                        ₹{activeDayPlan.dayCost?.artisanBuffer || 250}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 text-sm font-bold text-stone-900">
                      <span>Day Total</span>
                      <span className="font-mono text-emerald-900">
                        ₹{activeDayPlan.dayCost?.total || 900}
                      </span>
                    </div>
                  </div>

                  {/* Trip Budget Gauge */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                      <span>Overall Trip Budget Used</span>
                      <span className={`font-bold font-mono ${isBudgetExceeded ? 'text-amber-800' : 'text-emerald-900'}`}>
                        ₹{totalCalculatedCost.toLocaleString('en-IN')} / ₹{preferences.budgetInr.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isBudgetExceeded ? 'bg-amber-600' : 'bg-emerald-800'
                        }`}
                        style={{ width: `${Math.min(100, Math.round((totalCalculatedCost / preferences.budgetInr) * 100))}%` }}
                      />
                    </div>
                    {isBudgetExceeded ? (
                      <p className="text-[11px] text-amber-800 font-bold mt-1.5">
                        ⚠️ Exceeds budget by ₹{(totalCalculatedCost - preferences.budgetInr).toLocaleString('en-IN')}
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-800 font-medium mt-1.5">
                        ✓ ₹{(preferences.budgetInr - totalCalculatedCost).toLocaleString('en-IN')} remaining within budget.
                      </p>
                    )}
                  </div>

                  {/* Edit Controls in Side Card */}
                  {isEditing && (
                    <div className="pt-4 border-t border-stone-200 flex flex-col gap-2">
                      <button
                        onClick={handleSaveEditedItinerary}
                        className="w-full py-2.5 rounded-xl bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-800 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5 text-amber-300" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={handleCancelEditing}
                        className="w-full py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 cursor-pointer"
                      >
                        Cancel Editing
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* Add Custom Location Modal */}
      {showAddLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddLocationModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Plus className="w-3 h-3" />
                <span>Add Custom Location</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-display">
                Add Attraction or Experience
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Include a custom restaurant, workshop, or stop for {preferences.destination}.
              </p>
            </div>

            {addLocationError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs flex items-center gap-2 border border-red-200 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{addLocationError}</span>
              </div>
            )}

            <form onSubmit={handleAddLocationSubmit} className="space-y-4 text-xs">
              
              {/* Field 1: Place name (Required) */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">
                  Place Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newLocationForm.placeName}
                  onChange={(e) => setNewLocationForm({ ...newLocationForm, placeName: e.target.value })}
                  placeholder="e.g. Yarada Beach or Submarine Museum"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              {/* Field 2: City or Address (Required) */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">
                  City or Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newLocationForm.cityAddress}
                  onChange={(e) => setNewLocationForm({ ...newLocationForm, cityAddress: e.target.value })}
                  placeholder="e.g. Beach Road, Visakhapatnam"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              {/* Duration and Cost Grid */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Field 3: Estimated visit duration (Optional) */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">
                    Visit Duration (Optional)
                  </label>
                  <input
                    type="text"
                    value={newLocationForm.duration}
                    onChange={(e) => setNewLocationForm({ ...newLocationForm, duration: e.target.value })}
                    placeholder="e.g. 1.5 hrs"
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium"
                  />
                </div>

                {/* Field 4: Estimated cost in INR (Optional) */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">
                    Estimated Cost ₹ (Optional)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newLocationForm.cost}
                    onChange={(e) => setNewLocationForm({ ...newLocationForm, cost: Number(e.target.value) })}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-900"
                  />
                </div>

              </div>

              {/* Category & Target Day Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Category</label>
                  <select
                    value={newLocationForm.category}
                    onChange={(e) => setNewLocationForm({ ...newLocationForm, category: e.target.value as Category })}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer"
                  >
                    <option value="Heritage">Heritage & Monuments</option>
                    <option value="Food">Food & Dining</option>
                    <option value="Culture">Culture & Palaces</option>
                    <option value="Crafts">Crafts & Artisans</option>
                    <option value="Nature">Nature & Outdoors</option>
                    <option value="Shopping">Shopping & Bazaars</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Target Day</label>
                  <select
                    value={targetAddDay}
                    onChange={(e) => setTargetAddDay(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer"
                  >
                    {(activeWorkingPlan || [1]).map((d: any) => {
                      const dayNum = typeof d === 'number' ? d : d.day;
                      return (
                        <option key={dayNum} value={dayNum}>Day {dayNum}</option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Field 5: Notes / Reason (Optional) */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">
                  Notes / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newLocationForm.notes}
                  onChange={(e) => setNewLocationForm({ ...newLocationForm, notes: e.target.value })}
                  placeholder="e.g. Great coastal sunset photography spot recommended by local guide..."
                  className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLocationModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-900 text-white font-bold hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
                >
                  Add to Day {targetAddDay}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Tourism Impact Modal */}
      {selectedAttractionForImpact && (
        <TourismImpactModal
          attraction={selectedAttractionForImpact}
          onClose={() => setSelectedAttractionForImpact(null)}
        />
      )}

    </div>
  );
};
