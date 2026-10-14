import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Users, 
  Sliders, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  IndianRupee, 
  Clock, 
  Building2, 
  Activity,
  ArrowUpRight,
  Filter,
  Info
} from 'lucide-react';
import { useTourismFlow } from '../context/TourismFlowContext';

type SupportedDestination = 'All Destinations' | 'Hyderabad' | 'Jaipur' | 'Goa' | 'Visakhapatnam';

interface DestinationInsightData {
  city: string;
  state: string;
  baseVisitorsPerDay: number;
  baseLocalSpendPerCapita: number;
  localMultiplier: number;
  iconicBottleneckName: string;
  dispersedGemName: string;
  zones: {
    name: string;
    type: 'Iconic Core' | 'Artisan Cluster' | 'Heritage Garden' | 'Culinary District';
    baseCapacityPct: number;
    crowdStatus: 'Optimal' | 'Approaching Capacity' | 'High Congestion';
  }[];
  peakHours: string;
  offPeakHours: string;
  recommendedMitigation: string;
  categories: { name: string; share: number; color: string }[];
}

const DESTINATION_INSIGHTS: Record<SupportedDestination, DestinationInsightData> = {
  'All Destinations': {
    city: 'All Monitored Regions',
    state: 'National Historic Corridors',
    baseVisitorsPerDay: 42000,
    baseLocalSpendPerCapita: 1850,
    localMultiplier: 2.15,
    iconicBottleneckName: 'Major Heritage Gateways & Forts',
    dispersedGemName: 'Artisan Quarters & Garden Necropolises',
    zones: [
      { name: 'Historic Monolithic Monuments', type: 'Iconic Core', baseCapacityPct: 88, crowdStatus: 'High Congestion' },
      { name: 'Traditional Artisan & Handloom Guilds', type: 'Artisan Cluster', baseCapacityPct: 44, crowdStatus: 'Optimal' },
      { name: 'Heritage Open Gardens & Tombs', type: 'Heritage Garden', baseCapacityPct: 32, crowdStatus: 'Optimal' },
      { name: 'Neighborhood Culinary Corridors', type: 'Culinary District', baseCapacityPct: 68, crowdStatus: 'Approaching Capacity' }
    ],
    peakHours: '11:00 AM – 01:30 PM & 05:00 PM – 07:30 PM',
    offPeakHours: '07:00 AM – 09:30 AM',
    recommendedMitigation: 'Expand early-morning ticket discounts by 25% to disperse 35% of peak visitors into neighborhood artisan lanes.',
    categories: [
      { name: 'Artisan Crafts & Handloom Direct', share: 36, color: 'bg-emerald-800' },
      { name: 'Heritage Street Food & Samovar Bakeries', share: 29, color: 'bg-amber-600' },
      { name: 'Monument Entry & Conservation Dues', share: 21, color: 'bg-stone-700' },
      { name: 'Guided Neighborhood Walking Tours', share: 14, color: 'bg-teal-700' }
    ]
  },
  'Hyderabad': {
    city: 'Hyderabad',
    state: 'Telangana',
    baseVisitorsPerDay: 18500,
    baseLocalSpendPerCapita: 1950,
    localMultiplier: 2.3,
    iconicBottleneckName: 'Charminar & Golkonda Citadel',
    dispersedGemName: 'Paigah Tombs & Shilparamam Village',
    zones: [
      { name: 'Charminar & Mecca Masjid Core', type: 'Iconic Core', baseCapacityPct: 92, crowdStatus: 'High Congestion' },
      { name: 'Laad Bazaar Lacquer & Zari Studios', type: 'Artisan Cluster', baseCapacityPct: 58, crowdStatus: 'Optimal' },
      { name: 'Paigah Tombs & Badshahi Ashurkhana', type: 'Heritage Garden', baseCapacityPct: 24, crowdStatus: 'Optimal' },
      { name: 'Moazzam Jahi & Pathergatti Arcades', type: 'Culinary District', baseCapacityPct: 64, crowdStatus: 'Approaching Capacity' }
    ],
    peakHours: '11:30 AM – 01:30 PM (Noon heat & queues)',
    offPeakHours: '06:30 AM – 09:00 AM (Serene breakfast walks)',
    recommendedMitigation: 'Route mid-day Charminar crowds toward the tranquil 400-year-old Badshahi Ashurkhana and Chowmahalla gardens.',
    categories: [
      { name: 'Lacquer Bangles & Pochampally Ikat', share: 38, color: 'bg-emerald-800' },
      { name: 'Irani Zafrani Chai & Hyderabadi Dum Dining', share: 31, color: 'bg-amber-600' },
      { name: 'Nizam Palace & Fort Archives', share: 19, color: 'bg-stone-700' },
      { name: 'Old City Historian Walking Guides', share: 12, color: 'bg-teal-700' }
    ]
  },
  'Jaipur': {
    city: 'Jaipur',
    state: 'Rajasthan',
    baseVisitorsPerDay: 22000,
    baseLocalSpendPerCapita: 2400,
    localMultiplier: 2.45,
    iconicBottleneckName: 'Hawa Mahal & Amber Palace Ramparts',
    dispersedGemName: 'Sanganer Block Printers & Panna Meena Kund',
    zones: [
      { name: 'Hawa Mahal & Badi Chaupar Junction', type: 'Iconic Core', baseCapacityPct: 94, crowdStatus: 'High Congestion' },
      { name: 'Sanganer Block Print & Blue Pottery Hub', type: 'Artisan Cluster', baseCapacityPct: 42, crowdStatus: 'Optimal' },
      { name: 'Panna Meena Ka Kund & Stepwells', type: 'Heritage Garden', baseCapacityPct: 35, crowdStatus: 'Optimal' },
      { name: 'Johari Bazaar Traditional Sweetmakers', type: 'Culinary District', baseCapacityPct: 76, crowdStatus: 'Approaching Capacity' }
    ],
    peakHours: '10:30 AM – 02:00 PM',
    offPeakHours: '07:30 AM – 09:30 AM',
    recommendedMitigation: 'Incentivize sunrise stepwell photography to relieve midday pressure from the central bazaar choke points.',
    categories: [
      { name: 'Block Print Textiles & Blue Pottery', share: 42, color: 'bg-emerald-800' },
      { name: 'Rajasthani Thali & Ghewar Street Food', share: 26, color: 'bg-amber-600' },
      { name: 'Amber Citadel & Jantar Mantar Access', share: 20, color: 'bg-stone-700' },
      { name: 'Pink City Heritage Storytelling', share: 12, color: 'bg-teal-700' }
    ]
  },
  'Goa': {
    city: 'Goa Coastal & Inland',
    state: 'Goa',
    baseVisitorsPerDay: 28000,
    baseLocalSpendPerCapita: 2850,
    localMultiplier: 2.1,
    iconicBottleneckName: 'Baga-Calangute Strip & Aguada Fort',
    dispersedGemName: 'Fontainhas Latin Quarter & Spice Plantations',
    zones: [
      { name: 'North Coastal Strip (Calangute-Baga)', type: 'Iconic Core', baseCapacityPct: 96, crowdStatus: 'High Congestion' },
      { name: 'Fontainhas Azulejo Tile & Bakery Walk', type: 'Artisan Cluster', baseCapacityPct: 54, crowdStatus: 'Optimal' },
      { name: 'Ponda Organic Spice Plantations', type: 'Heritage Garden', baseCapacityPct: 38, crowdStatus: 'Optimal' },
      { name: 'Panjim Riverfront & Chorao Mangroves', type: 'Culinary District', baseCapacityPct: 48, crowdStatus: 'Optimal' }
    ],
    peakHours: '04:30 PM – 08:30 PM (Sunset beach vehicular congestion)',
    offPeakHours: '08:00 AM – 11:00 AM',
    recommendedMitigation: 'Channel midday tourists to inland organic spice plantations and Latin quarter heritage bakeries to alleviate coastal gridlock.',
    categories: [
      { name: 'Spice Farming & Azulejo Handcrafts', share: 32, color: 'bg-emerald-800' },
      { name: 'Goan Fish Curry & Traditional Bakeries', share: 35, color: 'bg-amber-600' },
      { name: 'Portuguese Forts & Church Preservation', share: 18, color: 'bg-stone-700' },
      { name: 'Mangrove Kayaking & Nature Trails', share: 15, color: 'bg-teal-700' }
    ]
  },
  'Visakhapatnam': {
    city: 'Visakhapatnam (Vizag)',
    state: 'Andhra Pradesh',
    baseVisitorsPerDay: 12000,
    baseLocalSpendPerCapita: 1450,
    localMultiplier: 1.95,
    iconicBottleneckName: 'RK Beach & Submarine Museum Promenade',
    dispersedGemName: 'Kailasagiri Hilltop & Thotlakonda Buddhist Ruins',
    zones: [
      { name: 'RK Beach Promenade & INS Kursura', type: 'Iconic Core', baseCapacityPct: 86, crowdStatus: 'High Congestion' },
      { name: 'Etikoppaka Lacquer Toy Cooperative', type: 'Artisan Cluster', baseCapacityPct: 34, crowdStatus: 'Optimal' },
      { name: 'Thotlakonda & Bavikonda Buddhist Monasteries', type: 'Heritage Garden', baseCapacityPct: 22, crowdStatus: 'Optimal' },
      { name: 'Dolphin’s Nose Lighthouse Cliff', type: 'Culinary District', baseCapacityPct: 45, crowdStatus: 'Optimal' }
    ],
    peakHours: '05:00 PM – 08:00 PM (Beach promenade evening wave)',
    offPeakHours: '06:30 AM – 09:30 AM',
    recommendedMitigation: 'Distribute afternoon coastal visitors toward the clifftop ropeway at Kailasagiri and GI Etikoppaka wooden toy workshops.',
    categories: [
      { name: 'Etikoppaka Natural Lacquer Toys', share: 30, color: 'bg-emerald-800' },
      { name: 'Coastal Andhra Seafood & Putharekulu', share: 34, color: 'bg-amber-600' },
      { name: 'Maritime & Naval Heritage Entry', share: 22, color: 'bg-stone-700' },
      { name: 'Buddhist Monastic Archaeo-Tours', share: 14, color: 'bg-teal-700' }
    ]
  }
};

export const TourismInsights: React.FC = () => {
  const { events } = useTourismFlow();

  // State: Selected Destination Filter
  const [selectedDestination, setSelectedDestination] = useState<SupportedDestination>('Hyderabad');

  // State: Tourist Influx Simulation Slider (percentage multiplier from 50% to 250%)
  const [simulationMultiplier, setSimulationMultiplier] = useState<number>(100);

  const activeData = DESTINATION_INSIGHTS[selectedDestination];

  // Dynamic calculations based on simulation slider
  const simulatedVisitors = Math.round((activeData.baseVisitorsPerDay * simulationMultiplier) / 100);
  const multiplierFactor = simulationMultiplier / 100;

  // Local Spend calculation: (visitors * per capita * multiplier)
  const totalSpendRaw = simulatedVisitors * activeData.baseLocalSpendPerCapita;
  const totalLocalEconomyImpact = Math.round(totalSpendRaw * activeData.localMultiplier);
  const totalSpendInLakhsOrCrores = totalLocalEconomyImpact >= 10000000
    ? `₹${(totalLocalEconomyImpact / 10000000).toFixed(2)} Cr`
    : `₹${(totalLocalEconomyImpact / 100000).toFixed(1)} Lakhs`;

  // Percentage spent directly at small indie businesses/artisans
  // Baseline is 56%, improved with TourismFlow dispersal routing
  const smallBusinessSharePct = Math.min(68, Math.round(52 + (events.length > 5 ? 8 : 4)));

  // Crowd dispersion index (0-100)
  // Higher is better dispersion. Overcrowding at high multipliers decreases dispersion unless managed.
  const dispersionScore = Math.max(
    38,
    Math.min(96, Math.round(86 - (simulationMultiplier > 140 ? (simulationMultiplier - 140) * 0.35 : 0) + (events.length * 0.5)))
  );

  // Sustainability & Congestion Index (0-100, where < 50 is Safe, 50-75 is Moderate, > 75 is Warning)
  const congestionIndex = Math.min(98, Math.round(38 * (simulationMultiplier / 100)));

  const congestionStatus = congestionIndex < 50 
    ? { label: 'Sustainable / Low Pressure', color: 'text-emerald-800 bg-emerald-100 border-emerald-300', dot: 'bg-emerald-600' }
    : congestionIndex < 75 
    ? { label: 'Moderate Footfall Pressure', color: 'text-amber-800 bg-amber-100 border-amber-300', dot: 'bg-amber-600' }
    : { label: 'High Overtourism Alert', color: 'text-rose-800 bg-rose-100 border-rose-300', dot: 'bg-rose-600' };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header & Destination Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-teal-800" />
            <span>Tourism Insights • Authority & Stakeholder Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tracking-tight">
            Macro Visitor Dispersion & Economic Impact Dashboard
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Real-time footfall monitoring, small-business wealth retention, and overtourism mitigation for municipal planners.
          </p>
        </div>

        {/* Destination Filter Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-white p-1.5 rounded-2xl border border-stone-300 shadow-xs">
          <Filter className="w-4 h-4 text-stone-400 ml-2" />
          <span className="text-xs font-bold text-stone-500">Destination:</span>
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value as SupportedDestination)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-700 cursor-pointer"
          >
            <option value="Hyderabad">Hyderabad, Telangana</option>
            <option value="Jaipur">Jaipur, Rajasthan</option>
            <option value="Goa">Goa (Coastal & Inland)</option>
            <option value="Visakhapatnam">Visakhapatnam, Andhra Pradesh</option>
            <option value="All Destinations">All Monitored Regions</option>
          </select>
        </div>
      </div>

      {/* Interactive Simulation Influx Control Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">
                Tourist Influx Simulation Controller
              </h3>
              <p className="text-xs text-stone-500">
                Adjust daily visitor volume to forecast congestion spikes and local merchant revenue flow.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${congestionStatus.color}`}>
              <span className={`w-2 h-2 rounded-full ${congestionStatus.dot} animate-pulse`} />
              <span>{congestionStatus.label}</span>
            </span>
            <button
              onClick={() => setSimulationMultiplier(100)}
              className="text-xs text-stone-400 hover:text-stone-700 underline font-semibold cursor-pointer"
            >
              Reset (100%)
            </button>
          </div>
        </div>

        {/* Slider Input with Dynamic Indicator */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-stone-500">Simulated Daily Footfall:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-teal-900">
                {simulatedVisitors.toLocaleString()} tourists / day
              </span>
              <span className="text-stone-400 text-xs">({simulationMultiplier}% of baseline)</span>
            </div>
          </div>

          <input
            type="range"
            min="50"
            max="250"
            step="10"
            value={simulationMultiplier}
            onChange={(e) => setSimulationMultiplier(Number(e.target.value))}
            className="w-full h-2.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-teal-800"
          />

          <div className="flex justify-between text-[11px] text-stone-400 font-mono">
            <span>Low Season (50%)</span>
            <span>Normal Seasonal Baseline (100%)</span>
            <span>Peak Festival Surge (250%)</span>
          </div>
        </div>
      </div>

      {/* 4 Core Macro Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Estimated Local Spend */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Projected Local Economy Spend
            </p>
            <p className="text-2xl font-extrabold text-stone-900 font-display mt-1">
              {totalSpendInLakhsOrCrores}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-emerald-800 flex items-center justify-between font-medium">
            <span>{activeData.localMultiplier}x local economic multiplier</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" />
          </div>
        </div>

        {/* Card 2: Small / Indie Business Multiplier */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Small Merchant Share
            </p>
            <p className="text-2xl font-extrabold text-emerald-900 font-display mt-1">
              {smallBusinessSharePct}%
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
            Spent at independent artisans & cafes vs corporate package chains
          </div>
        </div>

        {/* Card 3: Footfall Dispersion Score */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Dispersibility Index
            </p>
            <p className="text-2xl font-extrabold text-teal-800 font-display mt-1">
              {dispersionScore} <span className="text-xs text-stone-400 font-normal">/ 100</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
            {dispersionScore > 75 ? 'Healthy distribution across zones' : 'Bottlenecks forming at central gates'}
          </div>
        </div>

        {/* Card 4: Overtourism & Congestion Score */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Congestion Index
            </p>
            <p className="text-2xl font-extrabold text-stone-900 font-display mt-1">
              {congestionIndex} <span className="text-xs text-stone-400 font-normal">/ 100</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] font-medium flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${congestionStatus.dot}`} />
            <span className="text-stone-600">{congestionStatus.label}</span>
          </div>
        </div>

      </div>

      {/* Zone Crowding Heatmap Breakdown & Popular Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Footfall & Crowding Zone Heatmap Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">
                Zone Footfall & Capacity Load
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Current simulated load across monitored districts in {activeData.city}.
              </p>
            </div>
            <span className="text-[11px] font-mono text-stone-400">Capacity Load</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {activeData.zones.map((zone, idx) => {
              // Calculate adjusted load based on simulation
              const adjustedLoad = Math.min(100, Math.round(zone.baseCapacityPct * multiplierFactor));
              const loadColor = adjustedLoad >= 90 
                ? 'bg-rose-600' 
                : adjustedLoad >= 65 
                ? 'bg-amber-600' 
                : 'bg-emerald-700';

              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{zone.name}</span>
                      <span className="ml-2 text-[10px] uppercase font-bold text-stone-400 px-1.5 py-0.5 rounded bg-white">
                        {zone.type}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-stone-800">{adjustedLoad}% Load</span>
                  </div>

                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${loadColor}`}
                      style={{ width: `${adjustedLoad}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>
                      {adjustedLoad >= 90 ? '⚠️ Critical queue delays' : adjustedLoad >= 65 ? '⚡ Busy visitor flow' : '✓ Unhurried visitor capacity'}
                    </span>
                    <span className="italic">{adjustedLoad < 65 ? 'Available for rerouting' : 'Limit further tour arrivals'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Peak Window Alert */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-800" />
              <span>Peak Window: <strong>{activeData.peakHours}</strong></span>
            </span>
            <span className="text-[11px] text-amber-800 font-semibold">
              Best Off-Peak: {activeData.offPeakHours}
            </span>
          </div>
        </div>

        {/* Economic Spend Distribution by Category */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 font-display">
                Tourist Spend Distribution by Sector
              </h3>
              <span className="text-xs text-stone-400">Regional economy retention</span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Breakdown of tourist rupees circulating through {activeData.city}'s local ecosystem.
            </p>

            <div className="space-y-4 pt-4">
              {activeData.categories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-800 font-semibold">{cat.name}</span>
                    <span className="font-mono font-bold text-stone-900">{cat.share}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                      style={{ width: `${cat.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overtourism Mitigation Policy Recommendation */}
          <div className="p-4 rounded-2xl bg-teal-950 text-white space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Authority Action Recommendation
              </span>
            </div>
            <p className="text-xs text-teal-100/90 leading-relaxed">
              {activeData.recommendedMitigation}
            </p>
          </div>
        </div>

      </div>

      {/* Transparent Methodology & Demo Sandbox Disclosure */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-stone-200/80 space-y-3 text-xs text-stone-600">
        <div className="flex items-center gap-2 text-stone-900 font-bold">
          <Info className="w-4 h-4 text-emerald-800" />
          <span>Tourism Authority Methodology & Simulation Sandbox Notes</span>
        </div>
        <p className="leading-relaxed">
          The metrics displayed above combine historical baseline datasets with real-time heuristic modeling. Influx simulation models estimate how dynamic routing interventions (such as TourismFlow AI’s automated alternative gem recommendations) divert footfall from high-stress monuments into neighborhood artisan cooperatives.
        </p>
        <p className="text-[11px] text-stone-400 italic">
          *All figures represent simulated demonstration data created for hackathon prototyping and municipal feasibility analysis.
        </p>
      </div>

    </div>
  );
};
