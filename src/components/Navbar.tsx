import React, { useState } from 'react';
import { 
  Building2, 
  Compass, 
  ShieldCheck, 
  BarChart3, 
  AlertTriangle, 
  Globe2, 
  MapPin, 
  PhoneCall, 
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { CityInfo, LanguageCode } from '../types';
import { INDIAN_CITIES_REGISTRY } from '../data/cities';
import { LANGUAGES, t } from '../utils/i18n';

interface NavbarProps {
  currentCity: CityInfo;
  onSelectCity: (city: CityInfo) => void;
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onSelectCity,
  currentLang,
  onSelectLang,
  activeTab,
  onSelectTab,
}) => {
  const [citySearch, setCitySearch] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);

  const filteredCities = INDIAN_CITIES_REGISTRY.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.state.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <>
      <header className="bg-[#0a0e17]/95 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & City Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  {t('app_title', currentLang)}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                  {currentCity.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t('app_subtitle', currentLang)}
              </p>
            </div>
          </div>

          {/* Right Controls: City Selector, Language Selector, Emergency SOS */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* City Selector Button */}
            <button
              onClick={() => setShowCityModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 border border-slate-700/80 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 transition-all cursor-pointer shadow-sm"
              title="Change City"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-white font-bold">{currentCity.name}</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">({currentCity.state})</span>
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <select
                aria-label="Select Language"
                value={currentLang}
                onChange={(e) => onSelectLang(e.target.value as LanguageCode)}
                className="appearance-none bg-slate-800/90 border border-slate-700/80 hover:border-cyan-400 text-slate-200 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-cyan-400 cursor-pointer font-medium"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
              <Globe2 className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Emergency SOS Button */}
            <button
              onClick={() => onSelectTab('sos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sos'
                  ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'bg-red-600/90 hover:bg-red-500 text-white border border-red-500 shadow-md animate-pulse'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'explore', label: t('tab_explore', currentLang), icon: Compass },
            { id: 'heritage', label: t('tab_heritage', currentLang), icon: Building2 },
            { id: 'safenav', label: t('tab_safe_nav', currentLang), icon: ShieldCheck },
            { id: 'analytics', label: t('tab_analytics', currentLang), icon: BarChart3 },
            { id: 'triage', label: t('tab_triage', currentLang), icon: AlertTriangle },
            { id: 'sos', label: t('tab_sos', currentLang), icon: HeartPulse, isRed: true },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? tab.isRed
                      ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                    : tab.isRed
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-950/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive && !tab.isRed ? 'text-black' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* City Switcher Modal */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-cyan-500/40 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  Select City ({INDIAN_CITIES_REGISTRY.length} Major Indian Cities)
                </h3>
                <p className="text-xs text-slate-400">
                  Switch instantly to view local sights, safe navigation, and emergency helplines.
                </p>
              </div>
              <button
                onClick={() => setShowCityModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 border-b border-slate-800">
              <input
                type="text"
                placeholder="Search city name or state (e.g., Pune, Mumbai, Jaipur, Bengaluru, Solapur)..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                autoFocus
              />
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh]">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectCity(city);
                    setShowCityModal(false);
                  }}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    currentCity.id === city.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{city.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      Tier {city.tier}
                    </span>
                  </div>
                  <p className="text-xs text-cyan-400/80 font-medium">{city.state}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{city.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
