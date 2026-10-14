import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Check, 
  MapPin, 
  IndianRupee, 
  ExternalLink,
  Scale,
  X
} from 'lucide-react';
import { useTourismFlow } from '../context/TourismFlowContext';
import { HYDERABAD_ATTRACTIONS, ALTERNATIVE_COMPARISONS } from '../data/hyderabadData';
import { Attraction, AlternativeComparison } from '../types/tourism';
import { TourismImpactModal } from './TourismImpactModal';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Crafts', label: 'Crafts & Handloom' },
  { id: 'Food', label: 'Culinary Traditions' },
  { id: 'Culture', label: 'Art & Heritage' },
];

export const LocalDiscovery: React.FC = () => {
  const { 
    businesses,
    addAttractionToTrip, 
    itinerary,
    setActiveTab,
    logEvent,
    selectedAttractionForImpact,
    setSelectedAttractionForImpact
  } = useTourismFlow();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [selectedComparison, setSelectedComparison] = useState<AlternativeComparison | null>(null);

  // Take curated, authentic local experiences and sync with updated businesses from Business Hub
  const curatedSixExperiences = HYDERABAD_ATTRACTIONS
    .filter(a => a.isLocalGem)
    .slice(0, 6)
    .map(attraction => {
      const matchedBiz = businesses.find(b => 
        (attraction.businessId && b.id === attraction.businessId) || 
        b.id.includes(attraction.id) || 
        attraction.id.includes(b.id.replace('biz_', '')) ||
        b.name.toLowerCase().includes(attraction.name.toLowerCase().split('—')[0].trim().toLowerCase())
      );
      if (matchedBiz) {
        return {
          ...attraction,
          name: matchedBiz.name,
          category: matchedBiz.category,
          location: matchedBiz.location,
          description: matchedBiz.shortDescription || matchedBiz.story || attraction.description,
          tags: matchedBiz.tags || attraction.tags
        };
      }
      return attraction;
    });

  const displayedExperiences = curatedSixExperiences.filter(a => {
    return selectedCategory === 'all' || a.category === selectedCategory;
  });

  const handleAddToTrip = (attraction: Attraction) => {
    if (!itinerary || itinerary.length === 0) {
      setAddedNotice(`Plan a trip in the planner first before adding stops.`);
      setTimeout(() => setAddedNotice(null), 3000);
      return;
    }

    const success = addAttractionToTrip(attraction, 1);
    if (success) {
      setAddedNotice(`Added "${attraction.name.split('—')[0].split('&')[0].trim()}" to Day 1!`);
    } else {
      setAddedNotice(`Already in your itinerary.`);
    }
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
            <span>Discover Local</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
            Curated Local Experiences
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-xl">
            6 handpicked authentic artisans, workshops, and heritage spots across Hyderabad.
          </p>
        </div>

        {/* Alternative Comparison button */}
        <button
          onClick={() => setSelectedComparison(ALTERNATIVE_COMPARISONS[0])}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Scale className="w-3.5 h-3.5 text-amber-700" />
          <span>Discover an Alternative</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notice Toast */}
      {addedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-900 text-white text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{addedNotice}</span>
          </div>
          <button
            onClick={() => setActiveTab('planner')}
            className="underline text-emerald-200 hover:text-white text-xs font-semibold cursor-pointer"
          >
            Open Itinerary →
          </button>
        </div>
      )}

      {/* Exactly 6 Compact Experience Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedExperiences.map((attraction) => (
          <div
            key={attraction.id}
            onClick={() => logEvent('view', attraction.category, attraction.id, attraction.name)}
            className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Compact Image */}
            <div className="relative h-44 overflow-hidden bg-stone-100">
              <img
                src={attraction.image}
                alt={attraction.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-stone-900 uppercase tracking-wider shadow-xs">
                  {attraction.category}
                </span>
              </div>
              <div className="absolute bottom-2.5 right-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-950/80 text-white">
                  ₹{attraction.avgCost} INR
                </span>
              </div>
            </div>

            {/* Compact Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display line-clamp-1 group-hover:text-emerald-900 transition-colors">
                  {attraction.name}
                </h3>
                <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>{attraction.district}</span>
                </p>
                <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                  {attraction.description}
                </p>
              </div>

              {/* Actions: Why Recommended + Add to Trip */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAttractionForImpact(attraction);
                  }}
                  className="text-xs font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Why this?</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToTrip(attraction);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Trip</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Discover an Alternative Simple Modal */}
      {selectedComparison && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-stone-200 space-y-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedComparison(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" />
                <span>Alternative Discovery</span>
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-display mt-0.5">
                Popular Sight vs. Authentic Gem
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-stone-400">Popular Landmark</span>
                <h4 className="font-bold text-sm text-stone-900">{selectedComparison.popularName}</h4>
                <p className="text-stone-600 line-clamp-2">{selectedComparison.popularHighlight}</p>
                <div className="text-[11px] text-stone-500 pt-1">
                  Crowd: <strong className="text-amber-800">{selectedComparison.popularCrowd}</strong> • Cost: ₹{selectedComparison.popularAvgCost}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-emerald-800">★ Recommended Alternative</span>
                <h4 className="font-bold text-sm text-emerald-950">{selectedComparison.alternativeName}</h4>
                <p className="text-emerald-900 line-clamp-2">{selectedComparison.alternativeHighlight}</p>
                <div className="text-[11px] text-emerald-800 pt-1">
                  Crowd: <strong>{selectedComparison.alternativeCrowd}</strong> • Save: ₹{selectedComparison.costSavingsInr}
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-stone-200/80">
              <strong>Why choose this:</strong> {selectedComparison.whyChooseAlternative}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedComparison(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Impact Explanation Modal */}
      {selectedAttractionForImpact && (
        <TourismImpactModal
          attraction={selectedAttractionForImpact}
          onClose={() => setSelectedAttractionForImpact(null)}
        />
      )}

    </div>
  );
};
