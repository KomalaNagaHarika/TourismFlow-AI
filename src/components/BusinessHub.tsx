import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Eye, 
  Bookmark, 
  MousePointerClick, 
  PlusCircle,
  Sparkles, 
  Plus, 
  Check, 
  MapPin, 
  IndianRupee, 
  X,
  Edit3,
  TrendingUp,
  Clock,
  Compass,
  AlertCircle,
  Loader2,
  Tag,
  Store,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useTourismFlow } from '../context/TourismFlowContext';
import { HYDERABAD_ATTRACTIONS } from '../data/hyderabadData';
import { LocalBusiness, Category, District } from '../types/tourism';

export const BusinessHub: React.FC = () => {
  const { 
    businesses, 
    activeBusinessId, 
    setActiveBusinessId, 
    updateBusiness,
    addAttractionToTrip, 
    itinerary,
    setActiveTab,
    events,
    logEvent 
  } = useTourismFlow();

  // Selected business
  const activeBusiness = businesses.find(b => b.id === activeBusinessId) || businesses[0] || {} as LocalBusiness;

  // Track state for Advisor Recommendations
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [recommendations, setRecommendations] = useState<{ title: string; why: string; tag: string }[] | null>(null);

  // Listing editor state
  const [isEditingListing, setIsEditingListing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'Crafts' as Category,
    shortDescription: '',
    location: '',
    indicativePriceRange: '',
    tagsString: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Toast notice
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // When active business changes, load form values and reset generated advice
  useEffect(() => {
    if (activeBusiness) {
      setEditForm({
        name: activeBusiness.name || '',
        category: activeBusiness.category || 'Crafts',
        shortDescription: activeBusiness.shortDescription || activeBusiness.story?.slice(0, 100) || '',
        location: activeBusiness.location || '',
        indicativePriceRange: activeBusiness.indicativePriceRange || '₹300 – ₹800',
        tagsString: (activeBusiness.tags || ['Artisan', 'Heritage', 'Handmade']).join(', ')
      });
      setFormErrors({});
      // Set initial recommendations grounded in current business
      setRecommendations(getDefaultRecommendations(activeBusiness));
    }
  }, [activeBusiness?.id]);

  // Real-time prototype interactions tracked for this specific business
  const liveViews = events.filter(e => e.type === 'view' && (e.entityId === activeBusiness.id || e.entityName === activeBusiness.name)).length;
  const liveSaves = events.filter(e => e.type === 'save' && (e.entityId === activeBusiness.id || e.entityName === activeBusiness.name)).length;
  const liveTripAdditions = events.filter(e => e.type === 'trip_add' && (e.entityId === activeBusiness.id || e.entityName === activeBusiness.name)).length;
  const liveClicks = events.filter(e => e.type === 'advisor_query' && (e.entityId === activeBusiness.id)).length;

  const totalViews = (activeBusiness.metrics?.views || 250) + liveViews;
  const totalSaves = (activeBusiness.metrics?.saves || 65) + liveSaves;
  const totalTripAdditions = (activeBusiness.metrics?.tripAdditions || 32) + liveTripAdditions;
  const totalClicks = (activeBusiness.metrics?.listingClicks || 90) + liveClicks + (liveTripAdditions * 2);

  // Fallback / Grounded default recommendations for each business
  function getDefaultRecommendations(biz: LocalBusiness) {
    if (biz.category === 'Food') {
      return [
        {
          tag: 'Menu & Packaging',
          title: 'Introduce a "Morning Breakfast Flight" with Souvenir Chai Tumbler',
          why: 'Breakfast walking queries peak between 06:30 AM and 09:00 AM. Pairing hot Osmania biscuits with a branded clay cup increases average order value by ~₹140.'
        },
        {
          tag: 'Pricing Transparency',
          title: 'Display Clear Pre-Set Pricing for Gift-Boxed Tins',
          why: 'Tourists frequently hesitate when price tags are not visible. Clear ₹280 tin pricing removes purchase friction and speeds up takeaway queues.'
        },
        {
          tag: 'Cultural Storytelling',
          title: 'Highlight Wood-Fired Heritage Technique in First Sentence',
          why: 'Modern consumers actively seek traditional unhurried methods; stating "30-year wood-deck baking" distinguishes you from commercial industrial bakeries.'
        }
      ];
    } else if (biz.category === 'Crafts') {
      return [
        {
          tag: 'Experience Package',
          title: 'Offer a 30-Minute "Live Artisan Fitting & Sparkle Touch"',
          why: 'Tourists on tight 2-day itineraries often skip 90-minute masterclasses. A compact 30-minute ₹350 workshop lets them create a custom keepsake without delaying their day.'
        },
        {
          tag: 'Heritage Proof',
          title: 'Promote GI Tag Certification & Master Lineage Prominently',
          why: 'Authenticity is the #1 criterion for cultural travelers looking to avoid mass-produced machine wares; GI authenticity badges drive 40% higher saves.'
        },
        {
          tag: 'Family Combo',
          title: 'Bundle a "Family Keepsake Box" (2 Adult + 1 Child Keepsake)',
          why: 'Family groups represent 48% of TourismFlow trip plans; bundled packages help capture multi-generational tourist groups.'
        }
      ];
    } else if (biz.category === 'Culture') {
      return [
        {
          tag: 'Timing Optimization',
          title: 'Promote Early Dawn 06:30 AM Guided Photo Walks',
          why: 'Summer and afternoon heat discourage street walking; early morning photo sessions capture pristine Old City light before traffic opens.'
        },
        {
          tag: 'Price Range Clarity',
          title: 'Add Flat Per-Group Private Buyout Rates (₹2,200)',
          why: 'Honeymooners and elder groups prefer flexible private pacing; listing an indicative private tier boosts direct inquiries by 32%.'
        },
        {
          tag: 'Local Collaboration',
          title: 'Partner with Traditional Samovar Cafes for Mid-Walk Rest Stops',
          why: 'Including an authentic tea tasting midway through the walking route reduces physical fatigue and creates memorable social moments.'
        }
      ];
    } else {
      return [
        {
          tag: 'Micro-Offer',
          title: 'Create a 3-Piece Miniature Travel Flacon Gift Set (₹650)',
          why: 'Air-travel friendly 10ml bottles solve airline liquid limits and provide attractive gifts for domestic and international visitors.'
        },
        {
          tag: 'Listing Refinement',
          title: 'Emphasize Ancient Copper Hydro-Distillation Process',
          why: 'Discerning tourists seek botanical, alcohol-free formulations; explaining the traditional steam distillation builds strong quality perception.'
        },
        {
          tag: 'B2B Synergy',
          title: 'Supply Mini Welcoming Samples to Heritage Boutique Stays',
          why: 'Cross-promoting with neighborhood guest houses places your aroma directly in front of affluent heritage travelers.'
        }
      ];
    }
  }

  // Generate Recommendations with AI (Gemini) or Heuristic Fallback
  const handleGenerateRecommendations = async () => {
    setIsGeneratingAdvice(true);
    logEvent('advisor_query', activeBusiness.category, activeBusiness.id, activeBusiness.name);

    try {
      const res = await fetch('/api/business-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business: {
            name: activeBusiness.name,
            category: activeBusiness.category,
            story: activeBusiness.shortDescription || activeBusiness.story,
            products: activeBusiness.products,
            priceRange: activeBusiness.indicativePriceRange
          },
          demoMetrics: {
            views: totalViews,
            saves: totalSaves,
            tripAdditions: totalTripAdditions,
            clicks: totalClicks
          },
          popularInterests: ['Heritage', 'Authentic Local Crafts', 'Culinary Traditions', 'Slow Walking Tours']
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length >= 3) {
          setRecommendations(data.suggestions.slice(0, 3).map((s: any) => ({
            tag: s.category || 'Strategic Tip',
            title: s.title,
            why: s.advice || s.expectedImpact
          })));
          setToastNotice('AI recommendations refreshed for ' + activeBusiness.name);
          setTimeout(() => setToastNotice(null), 3000);
          return;
        }
      }
    } catch {
      // Gracefully fall back to rich grounded rule-based recommendations
    } finally {
      setIsGeneratingAdvice(false);
    }

    // Grounded fallback
    setRecommendations(getDefaultRecommendations(activeBusiness));
    setToastNotice('Refreshed smart recommendations for ' + activeBusiness.name);
    setTimeout(() => setToastNotice(null), 3000);
  };

  // Save Listing Changes
  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!editForm.name.trim()) errors.name = 'Business name is required.';
    if (!editForm.shortDescription.trim()) errors.shortDescription = 'Short description is required.';
    if (!editForm.location.trim()) errors.location = 'Location is required.';
    if (!editForm.indicativePriceRange.trim()) errors.indicativePriceRange = 'Price range is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updatedTags = editForm.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const updatedBusiness: LocalBusiness = {
      ...activeBusiness,
      name: editForm.name.trim(),
      category: editForm.category,
      shortDescription: editForm.shortDescription.trim(),
      location: editForm.location.trim(),
      indicativePriceRange: editForm.indicativePriceRange.trim(),
      tags: updatedTags.length > 0 ? updatedTags : activeBusiness.tags
    };

    updateBusiness(updatedBusiness);
    setIsEditingListing(false);
    setShowPreviewModal(false);
    setToastNotice(`Successfully saved changes for "${updatedBusiness.name}"!`);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const handleAddBusinessToTrip = () => {
    if (!itinerary || itinerary.length === 0) {
      setToastNotice(`Please generate an itinerary first in "Plan a Trip" before adding.`);
      setTimeout(() => setToastNotice(null), 3000);
      return;
    }

    // Match attraction or construct mock attraction item
    const matchedAttraction = HYDERABAD_ATTRACTIONS.find(a => 
      a.id.includes(activeBusiness.id.replace('biz_', '')) || 
      a.name.toLowerCase().includes(activeBusiness.name.toLowerCase().split(' ')[0])
    ) || {
      id: `attr_${activeBusiness.id}`,
      name: activeBusiness.name,
      category: activeBusiness.category,
      district: (activeBusiness.district as District) || 'Old City',
      location: activeBusiness.location,
      avgCost: parseInt(activeBusiness.indicativePriceRange?.replace(/[^0-9]/g, '') || '350', 10),
      duration: '1 hour',
      durationMinutes: 60,
      bestTime: '11:00 AM – 06:00 PM',
      isLocalGem: true,
      crowdLevel: 'Low' as const,
      description: activeBusiness.shortDescription || activeBusiness.story,
      whyVisit: `Direct encounter with ${activeBusiness.artisanOwner} supporting authentic traditional enterprise.`,
      culturalImpact: activeBusiness.heritageTradition,
      image: activeBusiness.image || 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80',
      tags: activeBusiness.tags || ['Artisan', 'Verified Local'],
      openingHours: activeBusiness.contact?.hours || '10:00 AM – 08:00 PM',
      coordinates: { lat: 17.3616, lng: 78.4747 },
      googleMapsQuery: encodeURIComponent(`${activeBusiness.name}, ${activeBusiness.location}`)
    };

    const added = addAttractionToTrip(matchedAttraction, 1);
    if (added) {
      logEvent('trip_add', activeBusiness.category, activeBusiness.id, activeBusiness.name);
      setToastNotice(`Added "${activeBusiness.name}" to Day 1 of your trip!`);
    } else {
      setToastNotice(`"${activeBusiness.name}" is already in your itinerary.`);
    }
    setTimeout(() => setToastNotice(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Business Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Store className="w-3.5 h-3.5 text-amber-800" />
            <span>Business Hub • Merchant Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tracking-tight">
            Local Business & Artisan Management Dashboard
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Manage your discoverability, analyze traveler engagement, and receive tailored AI suggestions to maximize sustainable footfall.
          </p>
        </div>

        {/* Business Selector Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start md:self-auto bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-500 uppercase px-2.5">
            Active Business:
          </span>
          <select
            value={activeBusinessId}
            onChange={(e) => {
              setActiveBusinessId(e.target.value);
              logEvent('view', 'BusinessSelector', e.target.value);
            }}
            className="bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 cursor-pointer shadow-xs"
          >
            {businesses.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.category})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Demo Label Notice */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Simulated Prototype Data:</strong> Profiles and baseline interactions are curated for demonstration purposes. Newly recorded session actions update in real time.
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/60 px-2 py-0.5 rounded-md shrink-0">
          Demo Sandbox
        </span>
      </div>

      {/* Toast Notice */}
      {toastNotice && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastNotice}</span>
          </div>
          <button
            onClick={() => setActiveTab('planner')}
            className="underline text-emerald-200 hover:text-white text-xs font-semibold cursor-pointer shrink-0 ml-4"
          >
            View in Itinerary →
          </button>
        </div>
      )}

      {/* Active Business Hero Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-1">
            {/* Business Image / Thumbnail */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-xs">
              <img 
                src={activeBusiness.image || 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80'} 
                alt={activeBusiness.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-900/80 text-white">
                {activeBusiness.category}
              </span>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
                  {activeBusiness.name}
                </h2>
                <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200/60">
                  Verified Local
                </span>
              </div>

              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{activeBusiness.location}</span>
                <span className="text-stone-300">•</span>
                <span className="font-semibold text-stone-700">Artisan: {activeBusiness.artisanOwner}</span>
              </p>

              <p className="text-xs text-stone-600 leading-relaxed max-w-2xl pt-0.5">
                {activeBusiness.shortDescription || activeBusiness.story}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <div className="inline-flex items-center gap-1 font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                  <IndianRupee className="w-3 h-3 text-emerald-700" />
                  <span>Price Range: {activeBusiness.indicativePriceRange}</span>
                </div>

                <div className="flex items-center gap-1.5 text-stone-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[11px] text-stone-600">{activeBusiness.contact?.hours || '10:30 AM – 08:30 PM'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons for this Business */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100">
            <button
              onClick={() => setIsEditingListing(!isEditingListing)}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-stone-600" />
              <span>{isEditingListing ? 'Close Editor' : 'Improve My Listing'}</span>
            </button>

            <button
              onClick={handleAddBusinessToTrip}
              className="px-4 py-2.5 rounded-xl bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Traveler Plan</span>
            </button>
          </div>

        </div>

        {/* Tags bar */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3" />
            <span>Tags:</span>
          </span>
          {(activeBusiness.tags || ['Artisan', 'Handmade', 'GI Craft']).map((t, idx) => (
            <span key={idx} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Compact "Improve My Listing" Editor (Conditional Accordion) */}
      {isEditingListing && (
        <div className="bg-stone-50 rounded-3xl p-6 sm:p-7 border-2 border-emerald-700/30 shadow-sm animate-in fade-in duration-200 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-800" />
                <span>Improve My Listing Editor</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Update details for <strong>{activeBusiness.name}</strong>. Changes update in real time across the Business Hub and Discover Local.
              </p>
            </div>
            <button
              onClick={() => setIsEditingListing(false)}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveListing} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Business Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Business Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                  placeholder="e.g. Haji & Sons Lacquer Workshop"
                />
                {formErrors.name && <p className="text-[11px] text-rose-600">{formErrors.name}</p>}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Category <span className="text-rose-600">*</span>
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value as Category })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs cursor-pointer"
                >
                  <option value="Crafts">Crafts & Handloom</option>
                  <option value="Food">Food & Culinary Traditions</option>
                  <option value="Culture">Art, Heritage & Guides</option>
                  <option value="Shopping">Regional Products & Shopping</option>
                </select>
              </div>

              {/* Indicative Price Range */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Indicative Price Range <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.indicativePriceRange}
                  onChange={(e) => setEditForm({ ...editForm, indicativePriceRange: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                  placeholder="e.g. ₹250 – ₹650"
                />
                {formErrors.indicativePriceRange && <p className="text-[11px] text-rose-600">{formErrors.indicativePriceRange}</p>}
              </div>

            </div>

            {/* Location & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Location / Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                  placeholder="e.g. Shop 14, Laad Bazaar, near Charminar"
                />
                {formErrors.location && <p className="text-[11px] text-rose-600">{formErrors.location}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Experience Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.tagsString}
                  onChange={(e) => setEditForm({ ...editForm, tagsString: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                  placeholder="e.g. Live Workshop, GI Craft, Family Friendly"
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Short Description (1-2 sentences for discovery cards) <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={2}
                value={editForm.shortDescription}
                onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 shadow-xs"
                placeholder="Describe what makes this experience distinctive and memorable for visitors..."
              />
              {formErrors.shortDescription && <p className="text-[11px] text-rose-600">{formErrors.shortDescription}</p>}
            </div>

            {/* Action Buttons: Preview, Save Changes, Cancel */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Preview Card
              </button>

              <button
                type="button"
                onClick={() => setIsEditingListing(false)}
                className="px-4 py-2 rounded-xl bg-transparent text-stone-600 text-xs font-bold hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4 Compact Metric Cards (Profile Views, Saves, Trip Additions, Listing Clicks) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Business Performance Overview
          </h3>
          <span className="text-[11px] text-stone-400">
            Combined demo historical baseline + live session events
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Profile Views */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Profile Views</p>
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-extrabold text-stone-900 font-display">{totalViews}</p>
              <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                +{liveViews} in this user session
              </p>
            </div>
          </div>

          {/* 2. Saves */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Saves</p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
                <Bookmark className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-extrabold text-stone-900 font-display">{totalSaves}</p>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                +{liveSaves} bookmarked recently
              </p>
            </div>
          </div>

          {/* 3. Trip Additions */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Trip Additions</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-800">
                <PlusCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-extrabold text-stone-900 font-display">{totalTripAdditions}</p>
              <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                +{liveTripAdditions} added to user itineraries
              </p>
            </div>
          </div>

          {/* 4. Listing Clicks */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Listing Clicks</p>
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-800">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-extrabold text-stone-900 font-display">{totalClicks}</p>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                Inquiries & detail previews
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Middle Row: AI Business Advisor & Local Business Opportunity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Improve My Business — AI Business Advisor */}
        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between space-y-5 border border-emerald-900">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    Improve My Business — AI Business Advisor
                  </h3>
                  <p className="text-[11px] text-emerald-200/80">
                    Smart recommendations tailored for {activeBusiness.name}
                  </p>
                </div>
              </div>

              {/* Generate Recommendations Action Button */}
              <button
                onClick={handleGenerateRecommendations}
                disabled={isGeneratingAdvice}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isGeneratingAdvice ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>

            {/* 3 Specific Actionable Recommendations */}
            <div className="space-y-3 mt-4">
              {recommendations?.map((rec, i) => (
                <div key={i} className="bg-emerald-900/60 p-3.5 rounded-2xl border border-emerald-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-800 text-amber-300">
                      {rec.tag}
                    </span>
                    <span className="text-[10px] text-emerald-300/80 font-mono">Tip #{i + 1}</span>
                  </div>
                  <p className="text-xs font-bold text-white font-display">
                    {rec.title}
                  </p>
                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    <strong>Why it helps:</strong> {rec.why}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-emerald-300/60 italic flex items-center justify-between border-t border-emerald-900">
            <span>Powered by Gemini & TourismFlowHeuristics</span>
            <span>Refreshes dynamically with merchant parameters</span>
          </div>
        </div>

        {/* Local Business Opportunity (Opportunities & Insights) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display">
                  Local Business Opportunities & Insights
                </h3>
                <p className="text-xs text-stone-500">
                  Data-driven demand signals for {activeBusiness.district || 'Hyderabad Central'}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 mt-5">
              
              {/* High Demand Peak Hours */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                  <Clock className="w-3.5 h-3.5 text-emerald-800" />
                  <span>High-Demand Peak Window</span>
                </div>
                <p className="text-xs text-stone-700 font-medium">
                  {activeBusiness.opportunities?.peakHours || '04:00 PM – 08:30 PM (Evening footfall surge)'}
                </p>
                <p className="text-[11px] text-stone-500">
                  Target this window for live demonstrations and fast-order cashier setups.
                </p>
              </div>

              {/* Matching Visitor Interests */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                  <Compass className="w-3.5 h-3.5 text-amber-700" />
                  <span>Visitor Demographics & Match</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {(activeBusiness.opportunities?.matchingInterests || ['Craft Workshops', 'Heritage Architecture', 'Cultural Dining']).map((interest, idx) => (
                    <span key={idx} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-stone-300 text-stone-800">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & Promotion Tips */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Pricing & Promotion Advice</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {activeBusiness.opportunities?.pricingTips || 'Offer off-peak morning incentives to smooth footfall across operating hours.'}
                </p>
              </div>

            </div>
          </div>

          <p className="text-[11px] text-stone-400 italic pt-2 border-t border-stone-100">
            *Insights calculated using cluster footfall and trip search telemetry.
          </p>
        </div>

      </div>

      {/* Grid of All Sample Local Businesses (4–6 profiles with switch & view details) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">
              All Partnered Local Businesses ({businesses.length})
            </h2>
            <p className="text-xs text-stone-500">
              Click any business card below to switch dashboard context and manage its profile.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-900">
            4-6 Realistic Profiles Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {businesses.map((biz) => {
            const isSelected = biz.id === activeBusinessId;

            return (
              <div
                key={biz.id}
                onClick={() => {
                  setActiveBusinessId(biz.id);
                  logEvent('view', biz.category, biz.id, biz.name);
                }}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-3 cursor-pointer group ${
                  isSelected 
                    ? 'border-emerald-700 ring-2 ring-emerald-700/20 shadow-md bg-emerald-50/10' 
                    : 'border-stone-200/90 hover:border-stone-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {biz.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-900">
                      {biz.indicativePriceRange}
                    </span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                      <img 
                        src={biz.image || 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=400&q=80'} 
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 font-display line-clamp-1 group-hover:text-emerald-900 transition-colors">
                        {biz.name}
                      </h4>
                      <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="line-clamp-1">{biz.location}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 mt-3 leading-relaxed">
                    {biz.shortDescription || biz.story}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className={`font-bold ${isSelected ? 'text-emerald-800' : 'text-stone-500 group-hover:text-stone-900'}`}>
                    {isSelected ? '✓ Currently Managing' : 'Select Business →'}
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {biz.metrics?.views || 300} views
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal for Listing Improvement */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 relative">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                Live Listing Preview
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-display mt-2">
                {editForm.name || activeBusiness.name}
              </h3>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{editForm.location || activeBusiness.location}</span>
              </p>
            </div>

            <div className="h-40 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img 
                src={activeBusiness.image} 
                alt={editForm.name} 
                className="w-full h-full object-cover" 
              />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {editForm.shortDescription || activeBusiness.shortDescription}
            </p>

            <div className="p-3.5 rounded-xl bg-stone-50 text-xs text-stone-700 space-y-1.5 border border-stone-200">
              <div className="flex justify-between">
                <span>Indicative Price:</span>
                <strong className="font-mono text-emerald-900">{editForm.indicativePriceRange || activeBusiness.indicativePriceRange}</strong>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <strong className="text-stone-800">{editForm.category}</strong>
              </div>
              <div className="flex justify-between">
                <span>Tags:</span>
                <span className="text-stone-500 text-[11px] truncate max-w-[220px]">
                  {editForm.tagsString || (activeBusiness.tags || []).join(', ')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={(e) => {
                  setShowPreviewModal(false);
                  handleSaveListing(e);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-800 cursor-pointer"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
