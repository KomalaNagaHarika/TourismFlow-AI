import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Briefcase, 
  BarChart3, 
  Menu, 
  X, 
  Layers, 
  Calendar,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useTourismFlow } from '../context/TourismFlowContext';
import { UserRole } from '../types/tourism';

export const Navbar: React.FC = () => {
  const { role, setRole, activeTab, setActiveTab, events, savedTrips } = useTourismFlow();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const localGemEvents = events.filter(e => e.type === 'trip_add' || e.type === 'save').length;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-900 flex items-center justify-center text-amber-200 shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-stone-900 font-display">TourismFlow</span>
                <span className="text-xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wider">AI</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">Smart Tourism & Local Economy Engine</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1.5 rounded-full border border-stone-200/70 text-sm">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-emerald-950 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'planner'
                  ? 'bg-emerald-900 text-white shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Plan a Trip
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'discover'
                  ? 'bg-white text-emerald-950 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Discover Local
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'business'
                  ? 'bg-white text-emerald-950 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
              Business Hub
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'insights'
                  ? 'bg-white text-emerald-950 shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-teal-700" />
              Tourism Insights
            </button>
          </nav>

          {/* Right Action & Demo Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Live Impact Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Impact Engine Active</span>
            </div>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <select
                value={role}
                onChange={(e) => {
                  const newRole = e.target.value as UserRole;
                  setRole(newRole);
                  if (newRole === 'Business') setActiveTab('business');
                  if (newRole === 'Authority') setActiveTab('insights');
                  if (newRole === 'Tourist' && activeTab !== 'planner' && activeTab !== 'discover') setActiveTab('planner');
                }}
                className="appearance-none cursor-pointer pl-3 pr-8 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-stone-900 text-stone-100 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all border border-stone-800 shadow-sm"
              >
                <option value="Tourist">Demo: Tourist</option>
                <option value="Business">Demo: Local Business</option>
                <option value="Authority">Demo: Tourism Authority</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FAF8F5] px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium ${activeTab === 'home' ? 'bg-stone-200 text-stone-900 font-bold' : 'text-stone-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => { setActiveTab('planner'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center justify-between ${activeTab === 'planner' ? 'bg-emerald-900 text-white font-bold' : 'text-stone-700'}`}
          >
            <span>Plan a Trip</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </button>
          <button
            onClick={() => { setActiveTab('discover'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium ${activeTab === 'discover' ? 'bg-stone-200 text-stone-900 font-bold' : 'text-stone-700'}`}
          >
            Discover Local Experiences
          </button>
          <button
            onClick={() => { setActiveTab('business'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium ${activeTab === 'business' ? 'bg-stone-200 text-stone-900 font-bold' : 'text-stone-700'}`}
          >
            Local Business Hub
          </button>
          <button
            onClick={() => { setActiveTab('insights'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium ${activeTab === 'insights' ? 'bg-stone-200 text-stone-900 font-bold' : 'text-stone-700'}`}
          >
            Tourism Authority Insights
          </button>
        </div>
      )}
    </header>
  );
};
