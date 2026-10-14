import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Briefcase, 
  BarChart3, 
  MapPin, 
  ChevronRight
} from 'lucide-react';
import { useTourismFlow } from '../context/TourismFlowContext';

export const HeroSection: React.FC = () => {
  const { setActiveTab, setRole } = useTourismFlow();

  return (
    <div className="space-y-16 py-10 sm:py-16">
      
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-semibold tracking-wide shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>TourismFlow AI • Smart Tourism Platform</span>
        </div>

        {/* Clear Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight font-display leading-tight">
          Explore Smarter. <span className="text-emerald-900 font-normal italic">Discover Local.</span>
        </h1>

        {/* One short sentence */}
        <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
          AI-powered trip itineraries and local discovery that connect curious travelers directly with authentic artisans and culinary heritage.
        </p>

        {/* Primary and Secondary Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => {
              setRole('Tourist');
              setActiveTab('planner');
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-900 text-white font-bold text-sm shadow-md hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Plan My Trip</span>
            <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => {
              setRole('Tourist');
              setActiveTab('discover');
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-stone-800 font-semibold text-sm border border-stone-200 hover:bg-stone-50 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-800" />
            <span>Discover Local</span>
          </button>
        </div>

        {/* 3 Quick Stat Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>46% Local Gem Discovery Rate</span>
          </span>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <span>Zero-Zigzag Clustered Transit</span>
          <span className="text-stone-300 hidden sm:inline">•</span>
          <span>Direct Artisan Livelihood Support</span>
        </div>

      </section>

      {/* 3 Short Feature Highlights */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Highlight 1: Smart Itineraries */}
          <div 
            onClick={() => { setRole('Tourist'); setActiveTab('planner'); }}
            className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-display">Smart Itineraries</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Custom day-by-day plans clustered by district to save travel time, complete with cost breakdowns and real-time Adaptive Plan Repair.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-emerald-900 group-hover:gap-1 transition-all pt-1">
              <span>Create Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Highlight 2: Local Experiences */}
          <div 
            onClick={() => { setRole('Tourist'); setActiveTab('discover'); }}
            className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-display">Local Experiences</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Curated master workshops, handlooms, and heritage bakeries with transparent impact scoring and one-click additions to your trip.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-amber-900 group-hover:gap-1 transition-all pt-1">
              <span>Browse Experiences</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Highlight 3: Tourism Insights */}
          <div 
            onClick={() => { setRole('Authority'); setActiveTab('insights'); }}
            className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-900 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-display">Tourism Insights</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Privacy-guaranteed aggregated data that reveals visitor patterns, balances crowd density, and highlights under-served artisan categories.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-teal-900 group-hover:gap-1 transition-all pt-1">
              <span>View Insights</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>
      </section>

    </div>
  );
};
