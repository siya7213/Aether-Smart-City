import React, { useState } from 'react';
import { 
  Building2, 
  Volume2, 
  Square, 
  Clock, 
  Ticket, 
  BookOpen, 
  Share2, 
  Check, 
  Search,
  MapPin,
  Sparkles
} from 'lucide-react';
import { CityInfo, Landmark, HeritageCategory, LanguageCode } from '../types';
import { t } from '../utils/i18n';

interface ModuleHeritageProps {
  currentCity: CityInfo;
  landmarks: Landmark[];
  currentLang: LanguageCode;
}

export const ModuleHeritage: React.FC<ModuleHeritageProps> = ({
  currentCity,
  landmarks,
  currentLang,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<HeritageCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAudioLandmarkId, setActiveAudioLandmarkId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Play spoken audio guide using browser speech synthesis
  const handlePlayAudio = (lm: Landmark) => {
    if (activeAudioLandmarkId === lm.id && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveAudioLandmarkId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const speechText = `Welcome to ${lm.name} in ${currentCity.name}. ${lm.audioGuideScript}. ${lm.history || ''}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find((v) => v.lang.startsWith(currentLang)) || voices[0];
    if (targetVoice) utterance.voice = targetVoice;

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveAudioLandmarkId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveAudioLandmarkId(null);
    };

    window.speechSynthesis.speak(utterance);
    setActiveAudioLandmarkId(lm.id);
    setIsSpeaking(true);
  };

  const handleStopAudio = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setActiveAudioLandmarkId(null);
  };

  const handleShare = (lm: Landmark) => {
    navigator.clipboard.writeText(`${lm.name} in ${currentCity.name} - ${lm.description}`);
    setCopiedId(lm.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLandmarks = landmarks.filter((lm) => {
    const matchesCat = selectedCategory === 'All' || lm.category === selectedCategory;
    const matchesQuery =
      lm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lm.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const categories: (HeritageCategory | 'All')[] = [
    'All',
    'Architectural',
    'Sacred',
    'Living',
    'Culinary',
    'Museum',
    'Natural',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-500/15 text-amber-300 border border-amber-500/20">
                Sights & Landmarks
              </span>
              <span className="text-xs text-slate-400">
                {currentCity.name}, {currentCity.state}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {t('heritage_title', currentLang)}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Discover top monuments, sacred shrines, traditional bazaars, culinary institutions, and natural sanctuaries in {currentCity.name}.
            </p>
          </div>

          {/* Active Audio Indicator */}
          {isSpeaking && (
            <div className="flex items-center gap-3 bg-amber-500/20 border border-amber-400/40 px-4 py-2.5 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-3 bg-amber-400 rounded-full animate-pulse"></span>
                <span className="w-1.5 h-5 bg-cyan-400 rounded-full animate-pulse delay-75"></span>
                <span className="w-1.5 h-2.5 bg-amber-400 rounded-full animate-pulse delay-150"></span>
              </div>
              <span className="text-xs font-bold text-amber-300">Audio Guide Playing</span>
              <button
                onClick={handleStopAudio}
                className="p-1 rounded bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                title="Stop Audio"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-black shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
              }`}
            >
              {cat === 'All' ? t('filter_all', currentLang) : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search sights, shrines, food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Landmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLandmarks.map((lm) => {
          const isCurrentAudio = activeAudioLandmarkId === lm.id && isSpeaking;

          return (
            <div
              key={lm.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Landmark Image */}
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={lm.imageUrl}
                  alt={lm.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    {lm.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => handleShare(lm)}
                    className="p-1.5 rounded-lg bg-black/70 backdrop-blur-md text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                    title="Share details"
                  >
                    {copiedId === lm.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="text-amber-300 font-bold">⭐ {lm.rating} / 5.0</span>
                  <span className="bg-black/60 px-2 py-0.5 rounded text-slate-300 text-[11px]">
                    {lm.ticketPrice}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                    {lm.name}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {lm.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-400 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{t('opening_hours', currentLang)}: <b className="text-slate-200">{lm.visitingHours}</b></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span className="line-clamp-1">Style: <b className="text-slate-200">{lm.architecturalStyle}</b></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handlePlayAudio(lm)}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCurrentAudio
                        ? 'bg-red-500 hover:bg-red-400 text-white shadow-md'
                        : 'bg-amber-400 hover:bg-amber-300 text-black shadow-md'
                    }`}
                  >
                    {isCurrentAudio ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>{t('stop_audio', currentLang)}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t('play_audio_guide', currentLang)}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedLandmark(lm)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                    title="View Full Sights Details"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Landmark Modal */}
      {selectedLandmark && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-amber-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative h-60 bg-slate-950">
              <img
                src={selectedLandmark.imageUrl}
                alt={selectedLandmark.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/40" />
              <button
                onClick={() => setSelectedLandmark(null)}
                className="absolute top-4 right-4 bg-black/70 text-white rounded-full p-2 hover:bg-black font-bold cursor-pointer"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                  {selectedLandmark.category}
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-2">
                  {selectedLandmark.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">
                  Overview & Highlights
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedLandmark.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-wider text-cyan-400 font-bold mb-1">
                  History & Culture
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedLandmark.history}
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs uppercase text-amber-300 font-bold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  Audio Guide Script
                </h4>
                <p className="text-xs text-slate-400 italic">
                  "{selectedLandmark.audioGuideScript}"
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">VISITING HOURS</span>
                  <span className="font-bold text-white">{selectedLandmark.visitingHours}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">ENTRY TICKET</span>
                  <span className="font-bold text-white">{selectedLandmark.ticketPrice}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">LOCATION</span>
                  <span className="text-cyan-300 font-mono">
                    {selectedLandmark.lat.toFixed(4)}, {selectedLandmark.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handlePlayAudio(selectedLandmark)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-black shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Audio Guide</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
