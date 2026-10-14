import React from 'react';
import { TourismFlowProvider, useTourismFlow } from './context/TourismFlowContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TripPlanner } from './components/TripPlanner';
import { LocalDiscovery } from './components/LocalDiscovery';
import { BusinessHub } from './components/BusinessHub';
import { TourismInsights } from './components/TourismInsights';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Briefcase, 
  BarChart3, 
  RotateCcw, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, activeTab, setActiveTab, setRole, resetDemoData } = useTourismFlow();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-emerald-900 selection:text-white">
      
      {/* Top Demo Mode Banner */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">Interactive Demo Platform:</span>
            <span className="text-stone-300">
              {role === 'Tourist' && 'Tourist Mode — Plan trips, repair itineraries & discover artisans'}
              {role === 'Business' && 'Local Business Mode — Real-time demo metrics & AI Business Advisor'}
              {role === 'Authority' && 'Tourism Authority Mode — Macro footfall concentration & supply gap intelligence'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-stone-400">Curated Dataset: Hyderabad, Telangana</span>
            <button
              onClick={resetDemoData}
              className="text-stone-300 hover:text-white flex items-center gap-1 underline underline-offset-2"
              title="Reset demo storage and sample states"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && <HeroSection />}
        {activeTab === 'planner' && <TripPlanner />}
        {activeTab === 'discover' && <LocalDiscovery />}
        {activeTab === 'business' && <BusinessHub />}
        {activeTab === 'insights' && <TourismInsights />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-900 flex items-center justify-center text-amber-300">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-stone-900 font-display">TourismFlow AI</span>
            <span className="text-stone-300">•</span>
            <span>Explore Smarter. Discover Local.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Hyderabad, Telangana</span>
            <span>•</span>
            <span>Powered by Gemini 3.8 Flash & Tourism Impact Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <TourismFlowProvider>
      <AppContent />
    </TourismFlowProvider>
  );
}
