import React, { useState, useEffect, useMemo } from 'react';
import { CityInfo, LanguageCode, IncidentReport, ReviewItem } from './types';
import { INDIAN_CITIES_REGISTRY } from './data/cities';
import { generateDynamicCityData } from './data/cityDataGenerator';
import { Navbar } from './components/Navbar';
import { ModuleExplore } from './components/ModuleExplore';
import { ModuleHeritage } from './components/ModuleHeritage';
import { ModuleSafeNav } from './components/ModuleSafeNav';
import { ModuleAnalytics } from './components/ModuleAnalytics';
import { ModuleTriage } from './components/ModuleTriage';
import { ModuleSOS } from './components/ModuleSOS';

export default function App() {
  // Global State
  const [currentCity, setCurrentCity] = useState<CityInfo>(
    INDIAN_CITIES_REGISTRY.find((c) => c.id === 'mumbai') || INDIAN_CITIES_REGISTRY[0]
  );
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<string>('explore');

  // Dynamic Dataset for Current City
  const initialDataset = useMemo(() => {
    return generateDynamicCityData(currentCity);
  }, [currentCity]);

  // Live mutable state for reviews and incidents
  const [reviews, setReviews] = useState<ReviewItem[]>(initialDataset.reviews);
  const [incidents, setIncidents] = useState<IncidentReport[]>(initialDataset.incidents);

  // Sync state whenever city changes
  useEffect(() => {
    const freshData = generateDynamicCityData(currentCity);
    setReviews(freshData.reviews);
    setIncidents(freshData.incidents);
  }, [currentCity]);

  const handleAddReview = (newRev: ReviewItem) => {
    setReviews((prev) => [newRev, ...prev]);
  };

  const handleAddIncident = (newInc: IncidentReport) => {
    setIncidents((prev) => [newInc, ...prev]);
  };

  const handleUpvoteIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, upvotes: inc.upvotes + 1 } : inc))
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation Bar */}
      <div>
        <Navbar
          currentCity={currentCity}
          onSelectCity={setCurrentCity}
          currentLang={currentLang}
          onSelectLang={setCurrentLang}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Main Content View */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 pb-16 w-full">
          {activeTab === 'explore' && (
            <ModuleExplore
              currentCity={currentCity}
              currentLang={currentLang}
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          )}

          {activeTab === 'heritage' && (
            <ModuleHeritage
              currentCity={currentCity}
              landmarks={initialDataset.landmarks}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'safenav' && (
            <ModuleSafeNav
              currentCity={currentCity}
              nodes={initialDataset.nodes}
              incidents={incidents}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'analytics' && (
            <ModuleAnalytics
              currentCity={currentCity}
              neighborhoods={initialDataset.neighborhoods}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'triage' && (
            <ModuleTriage
              currentCity={currentCity}
              incidents={incidents}
              onAddIncident={handleAddIncident}
              onUpvoteIncident={handleUpvoteIncident}
              currentLang={currentLang}
            />
          )}

          {activeTab === 'sos' && (
            <ModuleSOS
              currentCity={currentCity}
              currentLang={currentLang}
            />
          )}
        </main>
      </div>

      {/* Clean Consumer Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b12] py-5 px-4 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">Aether City</span>
            <span className="text-slate-600">•</span>
            <span>Your smart companion for exploring, navigating, and living in {currentCity.name}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>{currentCity.name}, {currentCity.state}</span>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setActiveTab('sos')}
              className="text-red-400 hover:text-red-300 font-semibold cursor-pointer"
            >
              Emergency Helplines
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
