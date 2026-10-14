import { Attraction, DayPlan, TripPreferences, Category } from '../types/tourism';
import { HYDERABAD_ATTRACTIONS } from './hyderabadData';

// --- Destination Matchers ---

export function isDestinationHyderabad(destination: string): boolean {
  const norm = destination.toLowerCase().trim();
  return (
    norm.includes('hyderabad') ||
    norm.includes('secunderabad') ||
    norm.includes('charminar') ||
    norm.includes('telangana')
  );
}

export function isDestinationVisakhapatnam(destination: string): boolean {
  const norm = destination.toLowerCase().trim();
  return (
    norm.includes('visakhapatnam') ||
    norm.includes('vizag') ||
    norm.includes('waltair')
  );
}

export function isDestinationJaipur(destination: string): boolean {
  const norm = destination.toLowerCase().trim();
  return norm.includes('jaipur') || norm.includes('pink city') || norm.includes('rajasthan');
}

export function isDestinationBengaluru(destination: string): boolean {
  const norm = destination.toLowerCase().trim();
  return norm.includes('bengaluru') || norm.includes('bangalore') || norm.includes('karnataka');
}

export function isDestinationGoa(destination: string): boolean {
  const norm = destination.toLowerCase().trim();
  return norm.includes('goa') || norm.includes('panaji') || norm.includes('panjim') || norm.includes('calangute');
}

export function isDestinationDelhi(destination: string): boolean {
  const norm = destination.toLowerCase().trim();
  return norm.includes('delhi') || norm.includes('new delhi') || norm.includes('ncr');
}

export function isDestinationMumbai(destination: string): boolean {
  const norm = destination.toLowerCase().trim();
  return norm.includes('mumbai') || norm.includes('bombay') || norm.includes('maharashtra');
}

export function isDestinationKochi(destination: string): boolean {
  const norm = destination.toLowerCase().trim();
  return norm.includes('kochi') || norm.includes('cochin') || norm.includes('kerala');
}

// --- Curated Itinerary Generators ---

// 1. Visakhapatnam
export function generateVisakhapatnamItinerary(prefs: TripPreferences): DayPlan[] {
  const daysCount = Math.min(Math.max(prefs.days || 2, 1), 4);
  const days: DayPlan[] = [];

  for (let d = 1; d <= daysCount; d++) {
    if (d === 1) {
      days.push({
        day: 1,
        theme: 'RK Beach Marine Drive, INS Kursura Submarine & Kailasagiri Ropeway',
        districtFocus: 'Visakhapatnam Coastal Strip & Urban Overlook',
        travelTips: 'Great sea breeze along Beach Road. Auto rickshaws or taxis are ideal for the marine drive.',
        dayCost: { transport: 220, entryFees: 170, food: 550, artisanBuffer: 300, total: 1240 },
        activities: [
          {
            id: 'viz_1_1',
            time: '09:00 AM – 11:00 AM',
            activity: 'Kailasagiri Hilltop Park & Panoramic Ropeway',
            duration: '2 hrs',
            cost: 100,
            reason: 'Ride the aerial cable car to the 360-foot hilltop for sweeping views of the Bay of Bengal coastline.',
            transport: 'Cab / Auto to Kailasagiri base station',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Hilltop coconut water and Andhra snack kiosk',
            mapsLink: 'https://maps.google.com/?q=Kailasagiri,+Visakhapatnam',
            category: 'Nature',
            isLocalGem: false,
            impactScore: 88,
            impactReason: 'Eco-park supporting municipal conservation and local guides.'
          },
          {
            id: 'viz_1_2',
            time: '11:30 AM – 01:00 PM',
            activity: 'INS Kursura Submarine Museum & Sea Harrier Enclave',
            duration: '1.5 hrs',
            cost: 70,
            reason: 'Walk through an actual Russian-built 91-meter submarine preserved right on RK Beach sands guided by retired naval veterans.',
            transport: '10-minute auto ride down coastal Beach Road',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'RK Beach promenade fruit stalls and tea kiosks',
            mapsLink: 'https://maps.google.com/?q=INS+Kursura+Submarine+Museum,+Visakhapatnam',
            category: 'Culture',
            isLocalGem: false,
            impactScore: 92,
            impactReason: 'Preserves naval heritage with retired veteran sailors acting as guides.'
          },
          {
            id: 'viz_1_3',
            time: '01:15 PM – 02:30 PM',
            activity: 'Authentic Andhra Seafood & Bamboo Chicken at Sea Inn (Raju Gaari Dhaba)',
            duration: '1.25 hrs',
            cost: 350,
            reason: 'Feast on freshly caught Vanjaram fish fry, Royyala Iguru prawns, and tribal-spiced bamboo chicken.',
            transport: '8-minute auto ride to Sagar Nagar',
            travelTimeMinutes: 8,
            nearbyFoodOrRest: 'Breezy coastal oceanfront seating',
            mapsLink: 'https://maps.google.com/?q=Sea+Inn+Raju+Gari+Dhaba,+Sagar+Nagar,+Visakhapatnam',
            category: 'Food',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Partners directly with local coastal fisherfolk and promotes indigenous cooking.'
          },
          {
            id: 'viz_1_4',
            time: '03:15 PM – 05:00 PM',
            activity: 'Etikoppaka GI-Tagged Wooden Lacquer Toy Workshop Demonstration',
            duration: '1.75 hrs',
            cost: 200,
            reason: 'Watch master artisans turn Ankudu wood on spinning lathes and apply organic vegetable dyes and seed lac.',
            transport: '12-minute auto to beach craft pavilion',
            travelTimeMinutes: 12,
            nearbyFoodOrRest: 'Artisan tea stall with hot ginger chai and banana bajji',
            mapsLink: 'https://maps.google.com/?q=Etikoppaka+Toys,+Visakhapatnam',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 98,
            impactReason: '100% of purchases go directly to 200 rural artisanal families preserving a 400-year GI craft.'
          }
        ]
      });
    } else if (d === 2) {
      days.push({
        day: 2,
        theme: 'Rushikonda Blue Flag Beach, Thotlakonda Buddhist Monastic Ruins & Bheemili Heritage',
        districtFocus: 'North Coastal Heritage & Golden Beaches',
        travelTips: 'Wear light sun protection. The coastal scenic route along Bheemunipatnam is one of the prettiest drives in India.',
        dayCost: { transport: 260, entryFees: 80, food: 480, artisanBuffer: 250, total: 1070 },
        activities: [
          {
            id: 'viz_2_1',
            time: '08:30 AM – 10:30 AM',
            activity: 'Rushikonda Beach & Coastal Watersport Guild',
            duration: '2 hrs',
            cost: 150,
            reason: 'Pristine Blue Flag-certified golden cove flanked by green hills, offering kayaking and fresh coastal coconut water.',
            transport: '15-minute coastal cab to Rushikonda',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Beach shacks serving piping hot poori bhaji and coconut water',
            mapsLink: 'https://maps.google.com/?q=Rushikonda+Beach,+Visakhapatnam',
            category: 'Nature',
            isLocalGem: true,
            impactScore: 90,
            impactReason: 'Sustains local traditional catamaran fishermen who offer certified water recreation.'
          },
          {
            id: 'viz_2_2',
            time: '11:00 AM – 12:45 PM',
            activity: 'Thotlakonda 2000-Year-Old Hinayana Buddhist Monastic Complex',
            duration: '1.75 hrs',
            cost: 40,
            reason: 'Perched on a quiet hill 128m above the sea, explore stupas, rock-cut cisterns, and viharas used by ancient Buddhist monks.',
            transport: '10-minute drive uphill towards Bheemili',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Hilltop archaeological garden rest sheds',
            mapsLink: 'https://maps.google.com/?q=Thotlakonda,+Visakhapatnam',
            category: 'Heritage',
            isLocalGem: true,
            impactScore: 94,
            impactReason: 'Under-visited heritage monument where ticket revenue directly finances ASI stone conservation.'
          },
          {
            id: 'viz_2_3',
            time: '01:15 PM – 02:45 PM',
            activity: 'Traditional Rayalaseema & Coastal Andhra Thali at Venkatadri Vantillu',
            duration: '1.5 hrs',
            cost: 320,
            reason: 'Tasting menu featuring Gongura mutton/paneer, Gutti Vankaya curry, and Natu Kodi pulusu served on plantain leaf.',
            transport: '15-minute ride back into MVP Colony',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'MVP Colony garden neighborhood cafes',
            mapsLink: 'https://maps.google.com/?q=Venkatadri+Vantillu,+Visakhapatnam',
            category: 'Food',
            isLocalGem: true,
            impactScore: 91,
            impactReason: 'Celebrates traditional Andhra heritage recipes and procures millets from tribal cooperatives.'
          }
        ]
      });
    } else if (d === 3) {
      days.push({
        day: 3,
        theme: 'Simhachalam Hill Shrine & Araku Valley Tribal Coffee Enclave',
        districtFocus: 'Western Ghats Foothills & Sacred Groves',
        travelTips: 'Start early to enjoy the morning mountain mist. Great day for buying GI-certified Araku Arabica coffee beans.',
        dayCost: { transport: 350, entryFees: 120, food: 500, artisanBuffer: 400, total: 1370 },
        activities: [
          {
            id: 'viz_3_1',
            time: '08:00 AM – 10:30 AM',
            activity: 'Simhachalam Varaha Lakshmi Narasimha Temple',
            duration: '2.5 hrs',
            cost: 50,
            reason: 'Ancient 11th-century hill shrine featuring exquisite Kalinga-Chola stone pillar architecture covered in sandalwood paste.',
            transport: '30-minute cab to Simhachalam Hill base',
            travelTimeMinutes: 30,
            nearbyFoodOrRest: 'Temple sweet prasadam counters and tender coconut vendors',
            mapsLink: 'https://maps.google.com/?q=Simhachalam+Temple,+Visakhapatnam',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 89,
            impactReason: 'Supports over 80 traditional temple garland weavers and stone sculptors.'
          },
          {
            id: 'viz_3_2',
            time: '11:30 AM – 02:30 PM',
            activity: 'Borra Caves & Araku Tribal Coffee Enclave',
            duration: '3 hrs',
            cost: 120,
            reason: 'One million-year-old subterranean limestone caves descending 80 meters deep with dramatic illuminated stalagmite pillars and organic tribal Arabica coffee stalls.',
            transport: 'Picturesque mountain drive or scenic Vistadome train line',
            travelTimeMinutes: 60,
            nearbyFoodOrRest: 'Araku tribal women cooking organic bamboo chicken and fresh ginger tea',
            mapsLink: 'https://maps.google.com/?q=Borra+Caves,+Visakhapatnam',
            category: 'Nature',
            isLocalGem: true,
            impactScore: 97,
            impactReason: 'Direct market livelihood for tribal Adivasi farmers growing shade-grown fair-trade organic coffee.'
          }
        ]
      });
    } else {
      days.push({
        day: 4,
        theme: 'Ross Hill Three Sacred Peaks, Port Overlook & Jagadamba Heritage Bazaars',
        districtFocus: 'Old Visakhapatnam Port & Jagadamba Commercial Quarter',
        travelTips: 'Great day for photography of traditional fishing dhows and picking up local handicraft gifts.',
        dayCost: { transport: 180, entryFees: 60, food: 420, artisanBuffer: 350, total: 1010 },
        activities: [
          {
            id: 'viz_4_1',
            time: '09:30 AM – 11:30 AM',
            activity: 'Ross Hill & Port Viewpoint (Three Hills of Harmony)',
            duration: '2 hrs',
            cost: 30,
            reason: 'Explore the historic ridge where a church, mosque, and temple stand on three adjacent hills overlooking India’s oldest natural port.',
            transport: 'Auto to Port area',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Old Town harbor tea stalls and traditional Andhra sweet shops',
            mapsLink: 'https://maps.google.com/?q=Ross+Hill,+Visakhapatnam',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 93,
            impactReason: 'Symbol of communal interfaith heritage and historic port conservation.'
          },
          {
            id: 'viz_4_2',
            time: '12:00 PM – 02:30 PM',
            activity: 'Jagadamba Heritage Bazaar & Handicraft Embellishers',
            duration: '2.5 hrs',
            cost: 150,
            reason: 'Bustling traditional market for handwoven Uppada silk sarees, brass lamps, and coastal cashew confectioneries.',
            transport: '10-minute auto to Jagadamba Centre',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Iconic local tiffin halls serving hot ghee idlis and filter coffee',
            mapsLink: 'https://maps.google.com/?q=Jagadamba+Junction,+Visakhapatnam',
            category: 'Shopping',
            isLocalGem: true,
            impactScore: 91,
            impactReason: 'Direct market purchases from independent family merchants.'
          }
        ]
      });
    }
  }

  return days;
}

// 2. Jaipur
export function generateJaipurItinerary(prefs: TripPreferences): DayPlan[] {
  const daysCount = Math.min(Math.max(prefs.days || 2, 1), 4);
  const days: DayPlan[] = [];

  for (let d = 1; d <= daysCount; d++) {
    if (d === 1) {
      days.push({
        day: 1,
        theme: 'Pink City Walled City, Hawa Mahal & Johari Bazaar Blue Pottery Guild',
        districtFocus: 'Old Walled City of Jaipur (UNESCO World Heritage Site)',
        travelTips: 'The walled city is best explored on foot or by electric rickshaw. Shop for textiles directly from artisan cooperatives.',
        dayCost: { transport: 200, entryFees: 250, food: 550, artisanBuffer: 400, total: 1400 },
        activities: [
          {
            id: 'jpr_1_1',
            time: '08:30 AM – 10:00 AM',
            activity: 'Hawa Mahal (Palace of Winds) & Morning Chai at Wind View Cafe',
            duration: '1.5 hrs',
            cost: 100,
            reason: 'Admire the 953 honeycombed jharokhas designed for royal court women to view street life without being seen.',
            transport: 'Auto to Badi Chaupar',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Traditional masala chai brewed with fresh saffron and ginger',
            mapsLink: 'https://maps.google.com/?q=Hawa+Mahal,+Jaipur',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 90,
            impactReason: 'UNESCO heritage preservation supporting city heritage guides.'
          },
          {
            id: 'jpr_1_2',
            time: '10:30 AM – 01:00 PM',
            activity: 'City Palace of Jaipur & Jantar Mantar Astronomical Observatory',
            duration: '2.5 hrs',
            cost: 200,
            reason: 'Exquisite fusion of Rajput and Mughal architecture, housing royal textiles, armoury, and the world’s largest stone sundial.',
            transport: '5-minute walk through Sireh Deori bazaar',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Palace courtyard herbal drinks and rose sherbet',
            mapsLink: 'https://maps.google.com/?q=City+Palace,+Jaipur',
            category: 'Culture',
            isLocalGem: false,
            impactScore: 92,
            impactReason: 'Museum trusts funding local craft schools and traditional miniature painters.'
          },
          {
            id: 'jpr_1_3',
            time: '01:15 PM – 02:30 PM',
            activity: 'Authentic Rajasthani Thali & Pyaaz Kachori at Laxmi Mishthan Bhandar (LMB)',
            duration: '1.25 hrs',
            cost: 450,
            reason: 'Historic Johari Bazaar institution serving crispy onion kachoris, Dal Baati Churma, and Ghewar sweet soaked in saffron syrup.',
            transport: '7-minute stroll into Johari Bazaar',
            travelTimeMinutes: 7,
            nearbyFoodOrRest: 'Historic sweet confectionery counter',
            mapsLink: 'https://maps.google.com/?q=Laxmi+Mishthan+Bhandar,+Johari+Bazar,+Jaipur',
            category: 'Food',
            isLocalGem: true,
            impactScore: 94,
            impactReason: 'Preserves 80-year-old confectionery recipes and sources dairy from local pastoral cooperatives.'
          },
          {
            id: 'jpr_1_4',
            time: '03:00 PM – 05:30 PM',
            activity: 'Jaipur Blue Pottery & Block Printing Master Guild at Sanganer / Johari Arcade',
            duration: '2.5 hrs',
            cost: 250,
            reason: 'Interactive demonstration of GI-tagged Jaipur Blue Pottery made with quartz stone paste and natural metal oxide glazes.',
            transport: 'Auto to artisan quarter',
            travelTimeMinutes: 12,
            nearbyFoodOrRest: 'Artisan tea stall with kulhad chai and roasted lentils',
            mapsLink: 'https://maps.google.com/?q=Kripal+Kumbh+Blue+Pottery,+Jaipur',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 98,
            impactReason: 'Direct support to national awardee craft families reviving Persian-Turkic glazing traditions.'
          }
        ]
      });
    } else if (d === 2) {
      days.push({
        day: 2,
        theme: 'Amber Fort Citadel, Panna Meena Ka Kund Stepwell & Anokhi Hand Block Museum',
        districtFocus: 'Amer Historic Ridge & Aravalli Foothills',
        travelTips: 'Arrive early at Amber Fort to beat afternoon warmth. Step inside Panna Meena Stepwell for geometric symmetry.',
        dayCost: { transport: 280, entryFees: 220, food: 500, artisanBuffer: 350, total: 1350 },
        activities: [
          {
            id: 'jpr_2_1',
            time: '08:30 AM – 11:30 AM',
            activity: 'Amber Fort (Amer Palace) & Sheesh Mahal Mirror Hall',
            duration: '3 hrs',
            cost: 150,
            reason: 'Massive 16th-century sandstone fortress perched over Maota Lake with the world-famous Hall of Mirrors (Sheesh Mahal).',
            transport: 'Cab / Jeep to Amber Fort gate',
            travelTimeMinutes: 25,
            nearbyFoodOrRest: 'Courtyard cafe with cold lassi and mint nimbu pani',
            mapsLink: 'https://maps.google.com/?q=Amer+Fort,+Jaipur',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 91,
            impactReason: 'Finances state heritage conservation along the Aravalli hills.'
          },
          {
            id: 'jpr_2_2',
            time: '12:00 PM – 01:15 PM',
            activity: 'Panna Meena Ka Kund 16th-Century Stepwell & Ancient Amer Town',
            duration: '1.25 hrs',
            cost: 50,
            reason: 'Mesmerizing criss-cross geometric staircases engineered to catch monsoon rain runoff in the ancient town of Amer.',
            transport: '5-minute auto down into Amer old village',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Village tea stalls under shady neem trees',
            mapsLink: 'https://maps.google.com/?q=Panna+Meena+ka+Kund,+Jaipur',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 96,
            impactReason: 'Draws travelers into overlooked historic Amer village supporting local homestays and street vendors.'
          },
          {
            id: 'jpr_2_3',
            time: '01:30 PM – 03:00 PM',
            activity: 'Anokhi Museum of Hand Printing & Organic Cafe',
            duration: '1.5 hrs',
            cost: 120,
            reason: 'Dedicated to preserving the ancient Rajasthani art of woodblock carving and natural vegetable printing on pure cotton.',
            transport: '3-minute walk from stepwell',
            travelTimeMinutes: 3,
            nearbyFoodOrRest: 'Museum courtyard garden cafe serving organic millet wraps and iced tea',
            mapsLink: 'https://maps.google.com/?q=Anokhi+Museum+of+Hand+Printing,+Jaipur',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 97,
            impactReason: 'Empowers rural women block-printers and natural dye growers across Bagru and Sanganer.'
          }
        ]
      });
    } else {
      days.push({
        day: d,
        theme: d === 3 ? 'Nahargarh Fort Sunset, Jal Mahal Lake & Albert Hall Indo-Saracenic Museum' : 'Galtaji Monkey Temple, Sisodia Rani Gardens & Bapu Bazaar Textiles',
        districtFocus: d === 3 ? 'Aravalli Ridge & Ram Niwas Gardens' : 'Eastern Pass & Traditional Cloth Bazaars',
        travelTips: 'Great for panoramic photography and picking up Jaipur quilts (Jaipuri Razai).',
        dayCost: { transport: 240, entryFees: 150, food: 450, artisanBuffer: 300, total: 1140 },
        activities: [
          {
            id: `jpr_${d}_1`,
            time: '09:30 AM – 12:00 PM',
            activity: d === 3 ? 'Albert Hall Museum & Ram Niwas Gardens' : 'Galtaji Ancient Sun Temple & Sacred Kunds',
            duration: '2.5 hrs',
            cost: 100,
            reason: d === 3 ? 'Oldest museum in Rajasthan, masterpiece of Indo-Saracenic architecture with miniature paintings and pottery.' : 'Ancient temple carved between rocky granite cliffs with natural spring pools.',
            transport: 'Cab / Auto',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Ram Niwas garden tea stalls',
            mapsLink: d === 3 ? 'https://maps.google.com/?q=Albert+Hall+Museum,+Jaipur' : 'https://maps.google.com/?q=Galtaji+Temple,+Jaipur',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 92,
            impactReason: 'Direct support to municipal arts preservation.'
          },
          {
            id: `jpr_${d}_2`,
            time: '01:00 PM – 03:00 PM',
            activity: 'Bapu Bazaar Handloom Textiles & Mojari Leather Footwear Artisans',
            duration: '2 hrs',
            cost: 150,
            reason: 'Vibrant pink arcade market for authentic camel leather juttis, bandhej tie-dye dupattas, and feather-light cotton quilts.',
            transport: '10-minute auto to Chaura Rasta',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Traditional falooda and kulfi counters',
            mapsLink: 'https://maps.google.com/?q=Bapu+Bazar,+Jaipur',
            category: 'Shopping',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Direct income to generational leather cobblers and tie-dye artisans.'
          }
        ]
      });
    }
  }

  return days;
}

// 3. Bengaluru (Bangalore)
export function generateBengaluruItinerary(prefs: TripPreferences): DayPlan[] {
  const daysCount = Math.min(Math.max(prefs.days || 2, 1), 4);
  const days: DayPlan[] = [];

  for (let d = 1; d <= daysCount; d++) {
    if (d === 1) {
      days.push({
        day: 1,
        theme: 'Lalbagh Glass House, Basavanagudi Heritage & Vidyarthi Bhavan Crispy Masala Dosa',
        districtFocus: 'South Bengaluru Heritage Quarter & Historic Botanical Gardens',
        travelTips: 'Use Namma Metro (Green Line) to beat South Bangalore traffic. Basavanagudi is exceptionally pedestrian friendly.',
        dayCost: { transport: 180, entryFees: 120, food: 480, artisanBuffer: 250, total: 1030 },
        activities: [
          {
            id: 'blr_1_1',
            time: '07:30 AM – 10:00 AM',
            activity: 'Lalbagh Botanical Gardens & 1889 Crystal Glass House',
            duration: '2.5 hrs',
            cost: 50,
            reason: 'Stroll through 240 acres of century-old tropical trees, lotus ponds, and the London Crystal Palace-inspired glass house.',
            transport: 'Metro to Lalbagh Station',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Fresh tender coconut and hopcoms fruit juice stalls at West Gate',
            mapsLink: 'https://maps.google.com/?q=Lalbagh+Botanical+Garden,+Bengaluru',
            category: 'Nature',
            isLocalGem: false,
            impactScore: 91,
            impactReason: 'State ecological reserve conserving over 1,800 exotic and native botanical species.'
          },
          {
            id: 'blr_1_2',
            time: '10:30 AM – 12:00 PM',
            activity: 'Crispy Benne Masala Dosa & Filter Coffee at Vidyarthi Bhavan',
            duration: '1.5 hrs',
            cost: 180,
            reason: 'Iconic 1943 Gandhi Bazaar eatery where servers balance 15 thick golden butter dosas served with cool coconut chutney.',
            transport: '8-minute stroll into Gandhi Bazaar',
            travelTimeMinutes: 8,
            nearbyFoodOrRest: 'Traditional filter coffee served in stainless steel dabara sets',
            mapsLink: 'https://maps.google.com/?q=Vidyarthi+Bhavan,+Gandhi+Bazar,+Bengaluru',
            category: 'Food',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Cultural culinary landmark supporting third-generation kitchen artisans and local dairy producers.'
          },
          {
            id: 'blr_1_3',
            time: '12:30 PM – 02:30 PM',
            activity: 'Bull Temple (Dodda Basavana Gudi) & Mysore Silk Handloom Weaver Showroom',
            duration: '2 hrs',
            cost: 150,
            reason: '16th-century monolithic Nandi statue carved out of a single granite rock, followed by pure Mysore silk weaving displays.',
            transport: '5-minute auto',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Bugle Rock park cafes',
            mapsLink: 'https://maps.google.com/?q=Bull+Temple,+Basavanagudi,+Bengaluru',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 93,
            impactReason: 'Direct support to Karnataka handloom silk weaver guilds and temple flower growers.'
          }
        ]
      });
    } else {
      days.push({
        day: d,
        theme: d === 2 ? 'Cubbon Park, Bangalore Palace & Malleshwaram Traditional Filter Coffee Trail' : 'National Gallery of Modern Art, Tipu Sultan Summer Palace & Russell Market',
        districtFocus: d === 2 ? 'Central Garden City & North Heritage Enclave' : 'Cantonment & Old Pete Commercial Quarter',
        travelTips: 'Cubbon Park is vehicle-free on weekends. Great for morning birdwatching and art galleries.',
        dayCost: { transport: 220, entryFees: 250, food: 500, artisanBuffer: 300, total: 1270 },
        activities: [
          {
            id: `blr_${d}_1`,
            time: '09:00 AM – 11:30 AM',
            activity: d === 2 ? 'Bangalore Palace & Tudor-Style Wooden Ballrooms' : 'Cubbon Park & State Central Library',
            duration: '2.5 hrs',
            cost: 250,
            reason: d === 2 ? 'Imposing 1878 royal estate inspired by Windsor Castle featuring Gothic stained glass and royal carriages.' : '300-acre green lung of Bangalore flanked by red brick Victorian colonial institutions.',
            transport: 'Cab / Metro to Cubbon Park or Palace',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Park bakery kiosks and filter coffee carts',
            mapsLink: d === 2 ? 'https://maps.google.com/?q=Bangalore+Palace,+Bengaluru' : 'https://maps.google.com/?q=Cubbon+Park,+Bengaluru',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 89,
            impactReason: 'Preserves royal historical collections and public city canopy.'
          },
          {
            id: `blr_${d}_2`,
            time: '12:30 PM – 03:00 PM',
            activity: 'Malleshwaram 8th Cross Flower & Sandalwood Artisan Bazaars (Veena Stores)',
            duration: '2.5 hrs',
            cost: 160,
            reason: 'Traditional Kannadiga cultural enclave famous for fragrant jasmine garlands, Mysore sandalwood soaps, and Veena Stores hot idli-vada.',
            transport: '15-minute cab to Malleshwaram',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Steaming hot rice idlis with thick mint-coconut chutney',
            mapsLink: 'https://maps.google.com/?q=Veena+Stores,+Malleshwaram,+Bengaluru',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 96,
            impactReason: 'Sustains over 50 generational flower garland stringers and artisan condiment makers.'
          }
        ]
      });
    }
  }

  return days;
}

// 4. Goa
export function generateGoaItinerary(prefs: TripPreferences): DayPlan[] {
  const daysCount = Math.min(Math.max(prefs.days || 2, 1), 4);
  const days: DayPlan[] = [];

  for (let d = 1; d <= daysCount; d++) {
    if (d === 1) {
      days.push({
        day: 1,
        theme: 'Fontainhas Latin Quarter Heritage Walk, Old Goa Basilicas & Mandovi Sunset',
        districtFocus: 'Panaji Heritage Zone & UNESCO Old Goa Churches',
        travelTips: 'Fontainhas is best walked early morning or late afternoon for bright Portuguese architecture photos.',
        dayCost: { transport: 250, entryFees: 80, food: 650, artisanBuffer: 300, total: 1280 },
        activities: [
          {
            id: 'goa_1_1',
            time: '08:30 AM – 10:30 AM',
            activity: 'Fontainhas Latin Quarter & Portuguese Azulejos Tile Studio Walk',
            duration: '2 hrs',
            cost: 100,
            reason: 'Wander pastel-hued ochre and indigo colonial villas with oyster-shell windows and hand-painted Portuguese ceramic tiles.',
            transport: 'Stroll in Central Panaji',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Traditional Goan bakeries serving hot poi bread and Bebinca cake',
            mapsLink: 'https://maps.google.com/?q=Fontainhas,+Panaji,+Goa',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 96,
            impactReason: 'Supports heritage restoration trusts and generational Azulejo ceramic tile painters.'
          },
          {
            id: 'goa_1_2',
            time: '11:15 AM – 01:15 PM',
            activity: 'Basilica of Bom Jesus & Se Cathedral (UNESCO World Heritage)',
            duration: '2 hrs',
            cost: 50,
            reason: '400-year-old Baroque cathedral preserving the mortal remains of St. Francis Xavier with gilded wood-carved altars.',
            transport: '15-minute cab along NH748',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Coconut water and sugarcane juice under shaded banyan groves',
            mapsLink: 'https://maps.google.com/?q=Basilica+of+Bom+Jesus,+Old+Goa',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 92,
            impactReason: 'UNESCO heritage protection supporting professional local historians.'
          },
          {
            id: 'goa_1_3',
            time: '01:30 PM – 03:00 PM',
            activity: 'Authentic Goan Fish Thali & Kokum Sol Kadi at Kokni Kanteen',
            duration: '1.5 hrs',
            cost: 450,
            reason: 'Traditional clay-pot cooked Kingfish rava fry, prawn curry with red Goan rice, and refreshing tart Kokum digestive Sol Kadi.',
            transport: 'Cab back into Panaji old town',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Veranda seating in a restored 1970s heritage tavern',
            mapsLink: 'https://maps.google.com/?q=Kokni+Kanteen,+Panaji,+Goa',
            category: 'Food',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Partners directly with Betim small-boat artisanal fisherfolk and uses organic local spices.'
          }
        ]
      });
    } else {
      days.push({
        day: d,
        theme: d === 2 ? 'Aguada Fort Coastal Bastion, Sinquerim Coves & Mario Miranda Art Gallery' : 'Sahakari Spice Plantation, Dudhsagar Foothills & Traditional Feni Distillery',
        districtFocus: d === 2 ? 'Bardez Coastal Ridge & Fortifications' : 'Ponda Spice Belt & Western Ghats Foothills',
        travelTips: 'Rent a scooter or book a reliable local taxi. Try cashew feni tasting at certified local distilleries.',
        dayCost: { transport: 300, entryFees: 150, food: 600, artisanBuffer: 350, total: 1400 },
        activities: [
          {
            id: `goa_${d}_1`,
            time: '09:00 AM – 11:30 AM',
            activity: d === 2 ? 'Fort Aguada & 17th-Century Portuguese Ocean Lighthouse' : 'Sahakari Organic Spice Plantation & Elephant Trail',
            duration: '2.5 hrs',
            cost: 100,
            reason: d === 2 ? 'Historic stone ramparts guarding the Mandovi river mouth with sweeping views across the Arabian Sea.' : 'Guided walk through nutmeg, cinnamon, vanilla, and peri-peri pepper groves.',
            transport: 'Cab / Scooter along coastal drive',
            travelTimeMinutes: 25,
            nearbyFoodOrRest: 'Cliffside ocean cafes with fresh watermelon juice',
            mapsLink: d === 2 ? 'https://maps.google.com/?q=Fort+Aguada,+Goa' : 'https://maps.google.com/?q=Sahakari+Spice+Farm,+Ponda,+Goa',
            category: 'Nature',
            isLocalGem: false,
            impactScore: 90,
            impactReason: 'Preserves coastal ramparts and certified eco-farming cooperatives.'
          },
          {
            id: `goa_${d}_2`,
            time: '12:30 PM – 03:00 PM',
            activity: 'Mario Miranda Illustrative Art Gallery & Cashew Chikki Artisan Market',
            duration: '2 hrs',
            cost: 150,
            reason: 'Celebrating Goa’s iconic cartoonist Mario Miranda, followed by small-batch cashew and kokum artisan tastings.',
            transport: '10-minute drive into Porvorim',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Garden bakery serving warm Goan choris pao and coffee',
            mapsLink: 'https://maps.google.com/?q=Mario+Gallery,+Porvorim,+Goa',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 97,
            impactReason: 'Direct support to Goan visual artists and family-owned cashew processing cottages.'
          }
        ]
      });
    }
  }

  return days;
}

// 5. Delhi
export function generateDelhiItinerary(prefs: TripPreferences): DayPlan[] {
  const daysCount = Math.min(Math.max(prefs.days || 2, 1), 4);
  const days: DayPlan[] = [];

  for (let d = 1; d <= daysCount; d++) {
    if (d === 1) {
      days.push({
        day: 1,
        theme: 'Shahjahanabad Walled Old Delhi, Jama Masjid & Chandni Chowk Culinary Trail',
        districtFocus: 'Old Delhi / Shahjahanabad Heritage Precinct',
        travelTips: 'Take the Delhi Metro (Yellow Line) to Chandni Chowk. Use electric rickshaws for narrow haveli lanes.',
        dayCost: { transport: 150, entryFees: 100, food: 500, artisanBuffer: 300, total: 1050 },
        activities: [
          {
            id: 'del_1_1',
            time: '08:30 AM – 10:30 AM',
            activity: 'Jama Masjid & Minaret Panorama over Mughal Old Delhi',
            duration: '2 hrs',
            cost: 50,
            reason: 'India’s largest Mughal congregational mosque built by Emperor Shah Jahan in 1656 out of red sandstone and white marble.',
            transport: 'Metro to Jama Masjid Gate 2',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Matia Mahal tea counters serving saffron cardamom chai',
            mapsLink: 'https://maps.google.com/?q=Jama+Masjid,+Old+Delhi',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 92,
            impactReason: 'National heritage icon sustaining local electric rickshaw operators and guides.'
          },
          {
            id: 'del_1_2',
            time: '11:00 AM – 01:00 PM',
            activity: 'Khari Baoli Asia’s Largest Spice Market & Kinari Bazaar Wedding Trimmings',
            duration: '2 hrs',
            cost: 100,
            reason: 'Immerse your senses in centuries-old wholesale lanes piled high with saffron, dried mulberries, whole mace, and hand-embroidered zari borders.',
            transport: '5-minute cycle rickshaw through Ballimaran',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Famous Jalebi Wala piping hot jalebis fried in pure desi ghee',
            mapsLink: 'https://maps.google.com/?q=Khari+Baoli+Spice+Market,+Delhi',
            category: 'Shopping',
            isLocalGem: true,
            impactScore: 97,
            impactReason: 'Direct trade with fourth-generation spice merchants and hand-sewn lace needleworkers.'
          },
          {
            id: 'del_1_3',
            time: '01:15 PM – 02:45 PM',
            activity: 'Historic Mughlai Feast at Karim’s (Est. 1913) or Al Jawahar',
            duration: '1.5 hrs',
            cost: 400,
            reason: 'Tender Mutton Korma, Badam Pasanda, and fresh tandoori Khamiri roti baked in coal pits according to royal Mughal palace recipes.',
            transport: 'Short stroll opposite Jama Masjid Gate 1',
            travelTimeMinutes: 3,
            nearbyFoodOrRest: 'Traditional Rooh Afza sherbet and shahi tukda sweet stalls',
            mapsLink: 'https://maps.google.com/?q=Karim%27s,+Gali+Kababiya,+Jama+Masjid,+Delhi',
            category: 'Food',
            isLocalGem: true,
            impactScore: 94,
            impactReason: 'Century-old culinary heritage preserving authentic Mughal culinary craftsmanship.'
          }
        ]
      });
    } else {
      days.push({
        day: d,
        theme: d === 2 ? 'Qutub Minar 12th-Century Complex, Mehrauli Stepwells & Dilli Haat Artisan Village' : 'Humayun’s Tomb Garden Tomb, Sunder Nursery Biodiversity & Khan Market',
        districtFocus: d === 2 ? 'South Delhi Heritage & Craft Enclaves' : 'Central Nizamuddin & Imperial Green Corridors',
        travelTips: 'Dilli Haat provides authentic crafts directly from artisans rotating from all 28 Indian states.',
        dayCost: { transport: 220, entryFees: 200, food: 550, artisanBuffer: 400, total: 1370 },
        activities: [
          {
            id: `del_${d}_1`,
            time: '09:00 AM – 11:30 AM',
            activity: d === 2 ? 'Qutub Minar & 4th-Century Rustless Iron Pillar' : 'Humayun’s Tomb (Precursor to the Taj Mahal) & Sunder Nursery',
            duration: '2.5 hrs',
            cost: 80,
            reason: d === 2 ? '73-meter fluted red sandstone minaret with intricate calligraphic inscriptions and the enigmatic iron pillar.' : 'First magnificent Mughal garden tomb set in a 90-acre heritage botanical park.',
            transport: 'Metro to Qutub Minar or JLN Stadium',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Heritage garden cafe serving fresh salads and cold coffee',
            mapsLink: d === 2 ? 'https://maps.google.com/?q=Qutub+Minar,+Delhi' : 'https://maps.google.com/?q=Humayuns+Tomb,+Delhi',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 93,
            impactReason: 'UNESCO heritage conservation and biodiversity restoration.'
          },
          {
            id: `del_${d}_2`,
            time: '12:30 PM – 03:30 PM',
            activity: 'Dilli Haat INA Government Craft Bazaar & State Food Pavilions',
            duration: '3 hrs',
            cost: 200,
            reason: 'Open-air craft bazaar where rural weavers, woodcarvers, and potters from across India sell goods directly with no middlemen.',
            transport: 'Metro / Auto to INA',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Authentic state food stalls: Rajasthani pyaz kachori, Sikkimese momos, and Assamese tea',
            mapsLink: 'https://maps.google.com/?q=Dilli+Haat+INA,+Delhi',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 99,
            impactReason: '100% fair trade supporting smallholder rural artisans from marginalized communities across India.'
          }
        ]
      });
    }
  }

  return days;
}

// 6. Mumbai
export function generateMumbaiItinerary(prefs: TripPreferences): DayPlan[] {
  const daysCount = Math.min(Math.max(prefs.days || 2, 1), 4);
  const days: DayPlan[] = [];

  for (let d = 1; d <= daysCount; d++) {
    if (d === 1) {
      days.push({
        day: 1,
        theme: 'Gateway of India, Colaba Causeway Craft Stalls & Iconic Parsi Irani Cafe Breakfast',
        districtFocus: 'South Mumbai Heritage Precinct & Apollo Bunder',
        travelTips: 'South Mumbai is ideal for walking. Marvel at Victorian Gothic and Art Deco buildings.',
        dayCost: { transport: 180, entryFees: 150, food: 600, artisanBuffer: 350, total: 1280 },
        activities: [
          {
            id: 'mum_1_1',
            time: '08:30 AM – 10:00 AM',
            activity: 'Brun Maska, Bun Omelette & Irani Chai at B. Merwan or Kyani & Co. (Est. 1904)',
            duration: '1.5 hrs',
            cost: 150,
            reason: 'Step into Mumbai’s oldest surviving Irani cafe with bentwood chairs, mirrored walls, and freshly baked mawa cakes.',
            transport: 'Cab to Metro Cinema / Marine Lines',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Traditional bakery counter with freshly baked ginger biscuits',
            mapsLink: 'https://maps.google.com/?q=Kyani+%26+Co.,+Marine+Lines,+Mumbai',
            category: 'Food',
            isLocalGem: true,
            impactScore: 96,
            impactReason: 'Preserves the fast-disappearing Parsi-Irani culinary heritage of vintage Bombay.'
          },
          {
            id: 'mum_1_2',
            time: '10:30 AM – 12:30 PM',
            activity: 'Gateway of India & Taj Mahal Palace Heritage Promenade',
            duration: '2 hrs',
            cost: 50,
            reason: '26-meter basalt arch overlooking the Arabian Sea, built to commemorate King George V, flanked by the 1903 iconic Taj hotel.',
            transport: '10-minute taxi to Apollo Bunder',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Promenade breeze and roasted spiced corn (bhutta)',
            mapsLink: 'https://maps.google.com/?q=Gateway+of+India,+Mumbai',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 91,
            impactReason: 'Historic coastal harbor landmark and licensed tourist guides.'
          },
          {
            id: 'mum_1_3',
            time: '01:00 PM – 03:30 PM',
            activity: 'Colaba Causeway Antique Arcades & Sassoon Docks Fisherfolk Guild',
            duration: '2.5 hrs',
            cost: 200,
            reason: 'Bustling tree-lined bazaar for handcrafted brassware, vintage coins, and coastal Koli fishing community life.',
            transport: '5-minute stroll into Colaba Causeway',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Cafe Mondegar vintage jukebox and coastal seafood counters',
            mapsLink: 'https://maps.google.com/?q=Colaba+Causeway,+Mumbai',
            category: 'Shopping',
            isLocalGem: true,
            impactScore: 94,
            impactReason: 'Direct livelihood to indigenous Koli coastal fisherfolk and independent handicraft traders.'
          }
        ]
      });
    } else {
      days.push({
        day: d,
        theme: d === 2 ? 'Kala Ghoda Art District, Chhatrapati Shivaji Maharaj Vastu Sangrahalaya & Marine Drive' : 'Elephanta Caves UNESCO Rock-Cut Temples & Bandra Portuguese Village',
        districtFocus: d === 2 ? 'Fort & Marine Drive Art Deco Promenade' : 'Mumbai Harbor & Bandra West Historic Villages',
        travelTips: 'Marine Drive is magical at sunset. Walk the Queen’s Necklace promenade.',
        dayCost: { transport: 220, entryFees: 200, food: 550, artisanBuffer: 300, total: 1270 },
        activities: [
          {
            id: `mum_${d}_1`,
            time: '09:30 AM – 12:30 PM',
            activity: d === 2 ? 'Kala Ghoda Arts Precinct & CSMVS Museum' : 'Elephanta Island UNESCO 6th-Century Shiva Cave Temples',
            duration: '3 hrs',
            cost: 150,
            reason: d === 2 ? 'Premier cultural quarter packed with independent art galleries, Indo-Saracenic museum, and blue synagogue.' : 'Scenic 1-hour ferry ride from Gateway of India to monolithic 7-meter Sadashiva rock sculptures.',
            transport: d === 2 ? 'Taxi to Fort' : 'Ferry from Gateway of India',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Artisan bakery cafes and fresh coconut stalls',
            mapsLink: d === 2 ? 'https://maps.google.com/?q=Kala+Ghoda,+Mumbai' : 'https://maps.google.com/?q=Elephanta+Caves,+Mumbai',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Promotes contemporary Indian visual arts and island conservation.'
          },
          {
            id: `mum_${d}_2`,
            time: '03:30 PM – 06:30 PM',
            activity: 'Marine Drive Sunset Promenade & Girgaon Chowpatty Kulfi',
            duration: '3 hrs',
            cost: 120,
            reason: '3.6 km crescent boulevard famous as the Queen’s Necklace, watching the sunset over Back Bay with authentic Chowpatty malai kulfi.',
            transport: 'Taxi to Marine Drive',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Beachside pav bhaji and hand-churned pistachio kulfi',
            mapsLink: 'https://maps.google.com/?q=Marine+Drive,+Mumbai',
            category: 'Nature',
            isLocalGem: false,
            impactScore: 92,
            impactReason: 'Public urban waterfront recreation and local street food vendors.'
          }
        ]
      });
    }
  }

  return days;
}

// 7. Kochi (Kerala)
export function generateKochiItinerary(prefs: TripPreferences): DayPlan[] {
  const daysCount = Math.min(Math.max(prefs.days || 2, 1), 4);
  const days: DayPlan[] = [];

  for (let d = 1; d <= daysCount; d++) {
    if (d === 1) {
      days.push({
        day: 1,
        theme: 'Fort Kochi Chinese Fishing Nets, St. Francis Church & Malabar Spice Warehouse Trail',
        districtFocus: 'Fort Kochi Historic Waterfront & Colonial Enclave',
        travelTips: 'Rent bicycles in Fort Kochi for easy exploration along shaded rain-tree streets.',
        dayCost: { transport: 150, entryFees: 80, food: 550, artisanBuffer: 300, total: 1080 },
        activities: [
          {
            id: 'koc_1_1',
            time: '08:30 AM – 10:30 AM',
            activity: 'Cantilevered Chinese Fishing Nets (Cheena Vala) at Vasco da Gama Square',
            duration: '2 hrs',
            cost: 50,
            reason: 'Operated by local fishermen for 600 years, watch huge 20-meter bamboo and teak nets dip into the Arabian Sea.',
            transport: 'Walk in Fort Kochi',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Fresh coconut water and banana fritters (pazham pori)',
            mapsLink: 'https://maps.google.com/?q=Chinese+Fishing+Nets,+Fort+Kochi',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 94,
            impactReason: 'Direct tip and catch purchase livelihood for traditional fishermen.'
          },
          {
            id: 'koc_1_2',
            time: '11:00 AM – 01:00 PM',
            activity: 'Mattancherry Dutch Palace & 1568 Paradesi Jewish Synagogue in Jew Town',
            duration: '2 hrs',
            cost: 60,
            reason: 'Breathtaking Ramayana murals in the royal palace and hand-painted 18th-century willow porcelain floor tiles in the synagogue.',
            transport: '10-minute auto / ferry ride to Mattancherry',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Historic Jew Town spice cafes scented with ginger, pepper, and cardamom',
            mapsLink: 'https://maps.google.com/?q=Mattancherry+Palace,+Kochi',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 97,
            impactReason: 'Preserves the rare multicultural Jewish and Malabar spice heritage.'
          },
          {
            id: 'koc_1_3',
            time: '01:15 PM – 02:45 PM',
            activity: 'Traditional Kerala Banana Leaf Sadhya & Karimeen Pollichathu at Seagull',
            duration: '1.5 hrs',
            cost: 400,
            reason: 'Pearl spot fish marinated in spicy shallot paste, wrapped in banana leaf and grilled, accompanied by unpolished red rice and sambar.',
            transport: '5-minute auto back to Fort Kochi waterfront',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Waterfront deck watching passing shipping vessels and dolphins',
            mapsLink: 'https://maps.google.com/?q=Hotel+Seagull,+Fort+Kochi',
            category: 'Food',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Supports Vembanad lake artisanal fishermen and traditional Kerala spice farmers.'
          }
        ]
      });
    } else {
      days.push({
        day: d,
        theme: d === 2 ? 'Kathakali Traditional Makeup & Theatre Performance, Kumbalangi Eco-Village' : 'Alappuzha Backwater Country Canoe Ride & Coir Handicraft Cooperative',
        districtFocus: d === 2 ? 'Kerala Cultural Theatre & Integrated Eco-Tourism' : 'Vembanad Backwaters & Coir Artisans',
        travelTips: 'Arrive 1 hour early at the Kathakali theatre to watch the elaborate natural facial makeup process.',
        dayCost: { transport: 250, entryFees: 200, food: 500, artisanBuffer: 350, total: 1300 },
        activities: [
          {
            id: `koc_${d}_1`,
            time: '09:30 AM – 12:30 PM',
            activity: d === 2 ? 'Kumbalangi Model Integrated Tourism Village' : 'Backwater Canoe Navigation in Narrow Mangrove Canals',
            duration: '3 hrs',
            cost: 150,
            reason: d === 2 ? 'India’s first designated eco-tourism village where travelers see crab farming, coir yarn spinning, and country boat building.' : 'Quiet electric or hand-paddled canoe through pristine village canals fringed by swaying coconut palms.',
            transport: 'Cab to Kumbalangi or jetty',
            travelTimeMinutes: 30,
            nearbyFoodOrRest: 'Village fresh toddy shop delicacies and coconut water',
            mapsLink: d === 2 ? 'https://maps.google.com/?q=Kumbalangi+Integrated+Tourism+Village,+Kochi' : 'https://maps.google.com/?q=Vembanad+Lake,+Kochi',
            category: 'Nature',
            isLocalGem: true,
            impactScore: 98,
            impactReason: '100% community-owned eco-tourism direct to rural homestay and coir worker families.'
          },
          {
            id: `koc_${d}_2`,
            time: '05:00 PM – 07:30 PM',
            activity: 'Kerala Kathakali Centre Classical Dance & Facial Pigment Art',
            duration: '2.5 hrs',
            cost: 200,
            reason: 'Witness ancient 17th-century classical temple drama, facial expression (Navarasas), and live percussion with natural stone makeup.',
            transport: 'Auto to Fort Kochi cultural centre',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Boutique art cafe with herbal ginger tea and cardamom cake',
            mapsLink: 'https://maps.google.com/?q=Kerala+Kathakali+Centre,+Fort+Kochi',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 96,
            impactReason: 'Direct support to hereditary Kathakali artists and Chenda drum musicians.'
          }
        ]
      });
    }
  }

  return days;
}

// 8. Hyderabad
export function generateHyderabadItinerary(prefs: TripPreferences): DayPlan[] {
  const daysCount = Math.min(Math.max(prefs.days || 2, 1), 4);
  const days: DayPlan[] = [];

  for (let d = 1; d <= daysCount; d++) {
    if (d === 1) {
      days.push({
        day: 1,
        theme: 'Charminar Minarets, Laad Bazaar Artisans & Royal Nizami Flavors',
        districtFocus: 'Old City & Musi River Basin',
        travelTips: 'Wear comfortable walking shoes for historic paved alleys. Best to take metro to MGBS or cab directly to Charminar.',
        dayCost: { transport: 220, entryFees: 150, food: 650, artisanBuffer: 400, total: 1420 },
        activities: [
          {
            id: 'act_1_1',
            time: '09:00 AM – 10:30 AM',
            activity: 'Charminar & Historic Bazaar Arcades',
            duration: '1.5 hrs',
            cost: 50,
            reason: 'Climb the historic minaret balconies early to beat midday queues and photograph Old City waking up.',
            transport: prefs.transportPref?.includes('Cab') ? 'Cab / Auto to Charminar Gate' : 'Metro to MGBS station + 10-min shared electric rickshaw',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Nimrah Café right across the western archway',
            mapsLink: 'https://maps.google.com/?q=Charminar,+Hyderabad',
            attractionId: 'charminar',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 84,
            impactReason: 'Core heritage monument anchoring surrounding independent marketplace traders.'
          },
          {
            id: 'act_1_2',
            time: '10:30 AM – 11:30 AM',
            activity: 'Nimrah Café & Heritage Bakery (Morning Irani Chai & Osmania Tasting)',
            duration: '1 hr',
            cost: 120,
            reason: 'Quintessential Hyderabad culinary tradition; piping hot Zafrani Chai paired with oven-fresh Osmania & Tie biscuits.',
            transport: '2-minute leisurely walk across Charminar plaza',
            travelTimeMinutes: 2,
            nearbyFoodOrRest: 'Mecca Masjid peaceful fountain courtyard nearby for rest',
            mapsLink: 'https://maps.google.com/?q=Nimrah+Cafe+and+Bakery,+Charminar',
            attractionId: 'nimrah-cafe',
            category: 'Food',
            isLocalGem: true,
            impactScore: 96,
            impactReason: 'Puts travel spend directly into beloved 30-year local family-run bakery preserving Deccani baking heritage.'
          },
          {
            id: 'act_1_3',
            time: '11:45 AM – 01:15 PM',
            activity: 'Laad Bazaar Lacquer & Zari Artisan Studios (Live Craft Session)',
            duration: '1.5 hrs',
            cost: 250,
            reason: 'Witness 4th-generation master craftsmen mould heated natural tree-resin lacquer and set glittering stones by hand.',
            transport: 'Short 3-minute stroll down covered Laad Bazaar lane',
            travelTimeMinutes: 3,
            nearbyFoodOrRest: 'Fruit juice and sweet coconut water stalls along the alley',
            mapsLink: 'https://maps.google.com/?q=Laad+Bazaar,+Charminar,+Hyderabad',
            attractionId: 'laad-bazaar-bangles',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 98,
            impactReason: 'Direct artisan patronage supporting over 120 women crafts families and combating synthetic mass imports.'
          },
          {
            id: 'act_1_4',
            time: '01:30 PM – 02:45 PM',
            activity: 'Hotel Shadab Traditional Dum Biryani Lunch',
            duration: '1.25 hrs',
            cost: 380,
            reason: 'Legendary Bawarchi-cooked mutton/chicken Dum Biryani paired with fragrant Mirchi Ka Salan and creamy double ka meetha.',
            transport: '7-minute auto rickshaw ride along High Court road',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Air-conditioned family dining floor with fresh lime soda',
            mapsLink: 'https://maps.google.com/?q=Hotel+Shadab,+High+Court+Rd,+Hyderabad',
            attractionId: 'shadaab-biryani',
            category: 'Food',
            isLocalGem: true,
            impactScore: 92,
            impactReason: 'Locally owned dining landmark sourcing spices from traditional Old City wholesale mandi.'
          },
          {
            id: 'act_1_5',
            time: '03:15 PM – 05:15 PM',
            activity: 'Chowmahalla Palace & Royal Nizam Vintage Carriage Courtyard',
            duration: '2 hrs',
            cost: 150,
            reason: 'Relaxed afternoon exploring grand ceremonial halls, 1912 vintage Rolls Royce, and fountains without heavy stairs.',
            transport: '10-minute auto ride back through Khilwat',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Palace heritage cafe serving herbal infusions in garden',
            mapsLink: 'https://maps.google.com/?q=Chowmahalla+Palace,+Hyderabad',
            attractionId: 'chowmahalla-palace',
            category: 'Culture',
            isLocalGem: false,
            impactScore: 89,
            impactReason: 'Restored royal trust supporting local cultural music preservation and archive artisans.'
          }
        ]
      });
    } else if (d === 2) {
      days.push({
        day: 2,
        theme: 'Golkonda Acoustic Ramparts & Qutb Shahi Royal Gardens',
        districtFocus: 'Western Heritage Fortresses & Craft Enclaves',
        travelTips: 'Hire a licensed local storyteller guide at Golkonda entrance. Start at Fateh Darwaza to test the clapping acoustic resonance.',
        dayCost: { transport: 250, entryFees: 200, food: 580, artisanBuffer: 350, total: 1380 },
        activities: [
          {
            id: 'act_2_1',
            time: '09:00 AM – 12:00 PM',
            activity: 'Golkonda Fort Acoustic Architecture & Citadel Hike',
            duration: '3 hrs',
            cost: 100,
            reason: 'Explore the 13th-century acoustic signaling system, Diamond Vaults, and panoramic hilltop views of the twin cities.',
            transport: 'Cab directly to Golkonda Balahissar Gate',
            travelTimeMinutes: 25,
            nearbyFoodOrRest: 'Citadel lower lawn cafe with bottled water and fresh buttermilk',
            mapsLink: 'https://maps.google.com/?q=Golkonda+Fort,+Hyderabad',
            attractionId: 'golkonda-fort',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 91,
            impactReason: 'Sustains 45 registered heritage guides and local conservation trusts.'
          },
          {
            id: 'act_2_2',
            time: '12:15 PM – 01:45 PM',
            activity: 'Qutb Shahi Royal Necropolis & Restored Gardens',
            duration: '1.5 hrs',
            cost: 80,
            reason: 'Tranquil garden mausoleums just 1.5km from the fort with minimal crowds, shaded banyan trees, and ornate stone jali carving.',
            transport: '5-minute auto ride from Golkonda gate',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Shaded pavilion lawns ideal for restful pause',
            mapsLink: 'https://maps.google.com/?q=Qutb+Shahi+Tombs,+Hyderabad',
            attractionId: 'qutb-shahi-tombs',
            category: 'Heritage',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Direct partnership with Aga Khan Trust for Culture employing master stone carvers.'
          },
          {
            id: 'act_2_3',
            time: '02:00 PM – 03:15 PM',
            activity: 'Traditional Deccani Lunch & Spiced Lassi at Toli Chowki',
            duration: '1.25 hrs',
            cost: 320,
            reason: 'Savor regional specialties like Talawa Gosht or vegetarian Khatti Dal and Bagara Baingan at local family kitchen.',
            transport: '8-minute cab down Toli Chowki heritage corridor',
            travelTimeMinutes: 8,
            nearbyFoodOrRest: 'Famous local bakery sweet counters adjacent to restaurant',
            mapsLink: 'https://maps.google.com/?q=Toli+Chowki,+Hyderabad',
            category: 'Food',
            isLocalGem: true,
            impactScore: 91,
            impactReason: 'Circulates travel revenue into non-mall community dining.'
          },
          {
            id: 'act_2_4',
            time: '04:00 PM – 06:30 PM',
            activity: 'Shilparamam Rural Arts & Handloom Village',
            duration: '2.5 hrs',
            cost: 150,
            reason: 'Interactive pottery wheel sessions, live Dhokra brass casters, and direct handloom saree weavers in village settings.',
            transport: '18-minute cab to Madhapur',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Open-air village snack kiosks serving mirchi bajji and hot filter coffee',
            mapsLink: 'https://maps.google.com/?q=Shilparamam,+Madhapur,+Hyderabad',
            attractionId: 'shilparamam-crafts',
            category: 'Crafts',
            isLocalGem: false,
            impactScore: 97,
            impactReason: 'Empowers over 200 visiting rural artisan households with zero commission on handmade wares.'
          }
        ]
      });
    } else if (d === 3) {
      days.push({
        day: 3,
        theme: 'Intricate Stucco Lace, GI-Tagged Ikat Weavers & Clock Tower Treats',
        districtFocus: 'Central Hyderabad & Abids Precinct',
        travelTips: 'Great day for souvenir collectors and textile enthusiasts seeking authentic GI-tagged handlooms.',
        dayCost: { transport: 240, entryFees: 120, food: 520, artisanBuffer: 600, total: 1480 },
        activities: [
          {
            id: 'act_3_1',
            time: '09:30 AM – 11:30 AM',
            activity: 'Paigah Tombs — Intricate Stucco & Mosaic Sanctuary',
            duration: '2 hrs',
            cost: 40,
            reason: 'Marvel at 27 unique, unrepeated geometric lime-mortar stucco floral screens in serene, uncrowded nobility grounds.',
            transport: 'Cab to Santoshnagar',
            travelTimeMinutes: 25,
            nearbyFoodOrRest: 'Traditional local chai and bun stalls at Santoshnagar square',
            mapsLink: 'https://maps.google.com/?q=Paigah+Tombs,+Santoshnagar,+Hyderabad',
            attractionId: 'paigah-tombs',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 98,
            impactReason: 'Channels tourism interest away from congested central zones into historically overlooked community sites.'
          },
          {
            id: 'act_3_2',
            time: '12:00 PM – 01:15 PM',
            activity: 'Badshahi Ashurkhana Enamelled Mosaic Hall (Est. 1594)',
            duration: '1.25 hrs',
            cost: 0,
            reason: 'Gaze at 430-year-old brilliant Persian lapis lazuli and turquoise tile mosaics with zero commercial clutter.',
            transport: '15-minute cab along Musi river road',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Pathar Gatti historical sweet shops nearby',
            mapsLink: 'https://maps.google.com/?q=Badshahi+Ashurkhana,+Hyderabad',
            attractionId: 'badshahi-ashurkhana',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Preserves rare Deccani Kashani tile work and supports neighborhood heritage trust.'
          },
          {
            id: 'act_3_3',
            time: '01:30 PM – 02:45 PM',
            activity: 'Heritage Thali Lunch at Abids & Famous Fruit Ice Cream',
            duration: '1.25 hrs',
            cost: 260,
            reason: 'South Indian banana leaf lunch followed by 100% hand-churned seasonal Sitaphal (custard apple) ice cream at 1951 Moazzam Jahi market.',
            transport: '7-minute auto to Moazzam Jahi Market',
            travelTimeMinutes: 7,
            nearbyFoodOrRest: 'Moazzam Jahi granite clock tower courtyard benches',
            mapsLink: 'https://maps.google.com/?q=Famous+Ice+Cream,+Moazzam+Jahi+Market,+Hyderabad',
            attractionId: 'famous-ice-cream',
            category: 'Food',
            isLocalGem: true,
            impactScore: 94,
            impactReason: 'Celebrates artisanal hand-churned ice cream and supports restored municipal market merchants.'
          },
          {
            id: 'act_3_4',
            time: '03:15 PM – 05:30 PM',
            activity: 'Pochampally Ikat Handloom Cooperative Showroom & Loom Demo',
            duration: '2.25 hrs',
            cost: 250,
            reason: 'Direct artisan-run cooperative where you learn the mathematical tie-and-dye Ikat resist technique directly from master weavers.',
            transport: '10-minute walk through historic Abids shopping arcade',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Abids vintage Irani cafes with filter coffee',
            mapsLink: 'https://maps.google.com/?q=Pochampally+Handloom+House,+Abids,+Hyderabad',
            attractionId: 'pochampally-weavers-coop',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 99,
            impactReason: 'Certified 100% fair trade; directly finances weaver pensions and pit loom upgrades in Nalgonda rural clusters.'
          }
        ]
      });
    } else {
      days.push({
        day: 4,
        theme: 'National Art Treasures, Jade Antiques & Hussain Sagar Lake Vista',
        districtFocus: 'Darulshifa & Tank Bund Promenade',
        travelTips: 'Arrive at Salar Jung museum before 11:30 AM to secure a spot for the iconic mechanical clock chiming at noon.',
        dayCost: { transport: 220, entryFees: 180, food: 550, artisanBuffer: 300, total: 1250 },
        activities: [
          {
            id: 'act_4_1',
            time: '10:00 AM – 01:00 PM',
            activity: 'Salar Jung Museum & 19th-Century Musical Clock',
            duration: '3 hrs',
            cost: 100,
            reason: 'Witness the Veiled Rebecca in Italian marble, royal Deccani jade daggers, and the famous British miniature mechanical clock.',
            transport: 'Cab / Metro to Salar Jung station',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Museum indoor cafeteria and landscaped river gardens',
            mapsLink: 'https://maps.google.com/?q=Salar+Jung+Museum,+Hyderabad',
            attractionId: 'salar-jung-museum',
            category: 'Culture',
            isLocalGem: false,
            impactScore: 86,
            impactReason: 'Premier national art institution supporting student educational excursions.'
          },
          {
            id: 'act_4_2',
            time: '01:30 PM – 02:45 PM',
            activity: 'Authentic Andhra Meals at Tank Bund / Secretariat Road',
            duration: '1.25 hrs',
            cost: 280,
            reason: 'Spicy Gongura chutney, Gunpowder ghee rice, and fresh curd served on fresh plantain leaf.',
            transport: '12-minute cab to Tank Bund road',
            travelTimeMinutes: 12,
            nearbyFoodOrRest: 'Lake promenade gardens right across the road',
            mapsLink: 'https://maps.google.com/?q=Tank+Bund,+Hyderabad',
            category: 'Food',
            isLocalGem: true,
            impactScore: 90,
            impactReason: 'Regional farm-to-table dining celebrating Telangana spice traditions.'
          },
          {
            id: 'act_4_3',
            time: '03:30 PM – 06:00 PM',
            activity: 'Hussain Sagar Lake & Monolithic Buddha Boat Ferry',
            duration: '2.5 hrs',
            cost: 120,
            reason: 'Scenic ferry ride across the 450-year-old lake to stand beneath the 18-meter single-granite rock Buddha statue.',
            transport: '5-minute stroll to Lumbini Park boat jetty',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Evening boat deck breeze and snack kiosks on Tank Bund promenade',
            mapsLink: 'https://maps.google.com/?q=Hussain+Sagar,+Hyderabad',
            category: 'Nature',
            isLocalGem: false,
            impactScore: 88,
            impactReason: 'Municipal public space supporting eco-ferry operators and public recreation.'
          }
        ]
      });
    }
  }

  return days;
}

// --- Master Curated Destination Dispatcher ---

export function getCuratedDestinationItinerary(prefs: TripPreferences): { days: DayPlan[]; source: string } | null {
  const dest = prefs.destination || '';

  if (isDestinationHyderabad(dest)) {
    return {
      days: generateHyderabadItinerary(prefs),
      source: 'Curated Hyderabad Impact Engine',
    };
  }

  if (isDestinationVisakhapatnam(dest)) {
    return {
      days: generateVisakhapatnamItinerary(prefs),
      source: 'Curated Visakhapatnam Impact Engine',
    };
  }

  if (isDestinationJaipur(dest)) {
    return {
      days: generateJaipurItinerary(prefs),
      source: 'Curated Jaipur Pink City Impact Engine',
    };
  }

  if (isDestinationBengaluru(dest)) {
    return {
      days: generateBengaluruItinerary(prefs),
      source: 'Curated Bengaluru Heritage Impact Engine',
    };
  }

  if (isDestinationGoa(dest)) {
    return {
      days: generateGoaItinerary(prefs),
      source: 'Curated Goa Coastal & Latin Quarter Impact Engine',
    };
  }

  if (isDestinationDelhi(dest)) {
    return {
      days: generateDelhiItinerary(prefs),
      source: 'Curated Delhi Shahjahanabad & Craft Impact Engine',
    };
  }

  if (isDestinationMumbai(dest)) {
    return {
      days: generateMumbaiItinerary(prefs),
      source: 'Curated Mumbai Heritage & Bazaars Impact Engine',
    };
  }

  if (isDestinationKochi(dest)) {
    return {
      days: generateKochiItinerary(prefs),
      source: 'Curated Kochi Malabar Spice & Backwaters Impact Engine',
    };
  }

  return null;
}
