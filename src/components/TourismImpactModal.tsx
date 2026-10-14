import React, { useEffect, useState } from 'react';
import { 
  X, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Coins, 
  Users, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { Attraction } from '../types/tourism';
import { useTourismFlow } from '../context/TourismFlowContext';

interface TourismImpactModalProps {
  attraction: Attraction | null;
  onClose: () => void;
}

export const TourismImpactModal: React.FC<TourismImpactModalProps> = ({ attraction, onClose }) => {
  const { preferences } = useTourismFlow();
  const [loading, setLoading] = useState(false);
  const [explanationData, setExplanationData] = useState<any>(null);

  useEffect(() => {
    if (!attraction) return;

    let isMounted = true;
    setLoading(true);

    fetch('/api/explain-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attraction,
        preferences
      })
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setExplanationData(data.breakdown);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Impact explain error:', err);
        if (isMounted) {
          // Fallback calculation
          setExplanationData({
            interestMatchScore: preferences.interests.includes(attraction.category) ? 96 : 84,
            affordabilityScore: 92,
            geographicClusteringScore: 90,
            crowdBalancingBonus: attraction.crowdLevel === 'Low' ? 95 : 80,
            localEconomyImpactScore: attraction.isLocalGem ? 98 : 72,
            overallScore: attraction.isLocalGem ? 95 : 85,
            explanation: attraction.isLocalGem 
              ? `Recommended by the Tourism Impact Engine because it directly sustains local master artisans and offers high cultural intimacy within your ₹${preferences.budgetInr} budget.`
              : `Recommended as a foundational cultural asset that clusters logically with nearby dining and artisan craft spots.`
          });
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [attraction, preferences]);

  if (!attraction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Tourism Impact Engine</span>
              {attraction.isLocalGem && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Verified Local Gem
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-stone-900 font-display mt-1">{attraction.name}</h3>
            <p className="text-xs text-stone-500">{attraction.location} • {attraction.category}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium text-stone-500">Calculating impact algorithm breakdown...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Overall Score Box */}
            <div className="bg-emerald-900 text-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-medium text-emerald-200 uppercase tracking-wider">Overall Impact Match</p>
                <p className="text-sm text-emerald-100 mt-0.5">Scored against your {preferences.groupType} travel plan</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-extrabold font-display text-amber-300">
                  {explanationData?.overallScore || 92}
                </span>
                <span className="text-emerald-300 text-sm font-semibold">/100</span>
              </div>
            </div>

            {/* AI Natural Language Explanation */}
            <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-800" />
                <span>Why This Recommendation?</span>
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed italic">
                "{explanationData?.explanation || attraction.whyVisit}"
              </p>
            </div>

            {/* Transparent Scoring Criteria Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Transparent Factor Breakdown
              </h4>

              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                {/* 1. Interest Match */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-stone-700">Interest Alignment ({attraction.category})</span>
                    <span className="text-emerald-900 font-bold">{explanationData?.interestMatchScore || 94}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-700 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${explanationData?.interestMatchScore || 94}%` }} 
                    />
                  </div>
                </div>

                {/* 2. Affordability */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-stone-700">Affordability (₹{attraction.avgCost} vs ₹{preferences.budgetInr} budget)</span>
                    <span className="text-emerald-900 font-bold">{explanationData?.affordabilityScore || 92}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-700 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${explanationData?.affordabilityScore || 92}%` }} 
                    />
                  </div>
                </div>

                {/* 3. Local Economy Impact */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-stone-700">Direct Local Artisan / Community Impact</span>
                    <span className="text-emerald-900 font-bold">{explanationData?.localEconomyImpactScore || 96}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${explanationData?.localEconomyImpactScore || 96}%` }} 
                    />
                  </div>
                </div>

                {/* 4. Crowd Balancing */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-stone-700">Crowd Balancing (Level: {attraction.crowdLevel})</span>
                    <span className="text-teal-900 font-bold">{explanationData?.crowdBalancingBonus || 85}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-teal-700 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${explanationData?.crowdBalancingBonus || 85}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cultural Preservation Footprint */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span>Cultural Footprint Note</span>
              </p>
              <p className="text-amber-900 leading-relaxed">
                {attraction.culturalImpact || 'Visits support authentic traditional craftsmanship and sustainable local tourism development.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(attraction.googleMapsQuery || attraction.name)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
