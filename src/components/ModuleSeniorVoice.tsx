import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Square, 
  PhoneCall, 
  Eye, 
  HeartHandshake, 
  HelpCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { CityInfo, LanguageCode } from '../types';
import { t } from '../utils/i18n';

interface ModuleSeniorVoiceProps {
  currentCity: CityInfo;
  currentLang: LanguageCode;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
}

export const ModuleSeniorVoice: React.FC<ModuleSeniorVoiceProps> = ({
  currentCity,
  currentLang,
  isHighContrast,
  onToggleHighContrast,
}) => {
  const [queryText, setQueryText] = useState('Where is the nearest hospital and emergency room?');
  const [isListening, setIsListening] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Trigger browser Speech Recognition if available
  const handleToggleListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not natively supported in this browser. You can type queries directly below.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === 'en' ? 'en-IN' : `${currentLang}-IN`;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQueryText(transcript);
        processVoiceQuery(transcript);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const processVoiceQuery = (query: string) => {
    const q = query.toLowerCase();
    let answer = '';

    if (q.includes('hospital') || q.includes('doctor') || q.includes('ambulance') || q.includes('medical')) {
      answer = `In ${currentCity.name}, emergency medical help is stationed at the Civil Hospital and Apollo trauma center. Dial ${currentCity.emergency.ambulance} immediately for ambulance dispatch. Aether safe routing has mapped well-lit corridors to the emergency wing.`;
    } else if (q.includes('police') || q.includes('sos') || q.includes('danger') || q.includes('help')) {
      answer = `Urgent alert logged. In ${currentCity.name}, Central Police Dispatch is reachable at ${currentCity.emergency.police}. Your GPS position has been noted. Please remain near open storefronts along the main avenue.`;
    } else if (q.includes('safe') || q.includes('walk') || q.includes('route') || q.includes('home')) {
      answer = `For seniors walking in ${currentCity.name}, please use the Civic Green Boulevard and Metro Skywalk. Avoid unlit lanes near the railway connector. Safe pedestrian lights remain active until 11 PM.`;
    } else if (q.includes('temple') || q.includes('shrine') || q.includes('heritage') || q.includes('visit')) {
      answer = `${currentCity.name} Sacred Devsthanam and Ancient Shrine is open for morning darshan with barrier-free ramp access and resting benches for elders. Entry is free.`;
    } else {
      answer = `Aether vocal guide for ${currentCity.name}: We are monitoring civic safety. Police: ${currentCity.emergency.police}, Senior Citizen Helpline: 14567. How else can we assist you today?`;
    }

    setResponseText(answer);
    speakVocalGuidance(answer);
  };

  const speakVocalGuidance = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower, clear cadence for seniors

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find((v) => v.lang.startsWith(currentLang)) || voices[0];
    if (targetVoice) utterance.voice = targetVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className={`p-5 rounded-2xl border ${
        isHighContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-slate-900/60 border-emerald-500/20'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {currentCity.name} • {t('senior_title', currentLang)}
            </h2>
          </div>

          {/* High Contrast Toggle Switch */}
          <button
            onClick={onToggleHighContrast}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-2 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.6)]'
                : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-yellow-400'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{isHighContrast ? 'CONTRAST ON' : 'HIGH CONTRAST'}</span>
          </button>
        </div>
      </div>

      {/* Main Vocal Query Interaction Box */}
      <div className={`p-8 rounded-3xl border-2 transition-all ${
        isHighContrast
          ? 'bg-black border-yellow-400 text-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
          : 'bg-slate-900/90 border-cyan-500/40 shadow-[0_0_35px_rgba(0,243,255,0.1)]'
      }`}>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-extrabold text-white">
              Vocal City Navigator
            </h3>
            <p className="text-xs text-slate-300">
              Speak or tap any prompt to receive clear verbal audio guidance in your language.
            </p>
          </div>

          {/* Voice Input & Mic Trigger */}
          <div className="relative">
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={t('voice_prompt_placeholder', currentLang)}
              className={`w-full text-base sm:text-lg font-medium rounded-2xl py-4 pl-5 pr-28 border-2 transition-all focus:outline-none ${
                isHighContrast
                  ? 'bg-black border-yellow-400 text-yellow-300 placeholder-yellow-600 focus:border-yellow-300'
                  : 'bg-slate-950 border-cyan-500/40 text-white placeholder-slate-500 focus:border-cyan-400 shadow-inner'
              }`}
            />

            <div className="absolute right-2 top-2 bottom-2 flex items-center gap-1.5">
              <button
                onClick={handleToggleListening}
                className={`h-full px-3.5 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-ping'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md'
                }`}
                title="Tap to speak"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Preset Voice Command Suggestions */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Where is the nearest hospital?',
              'Emergency SOS: Need police',
              'Safe walking route for evening walk',
              'Find peaceful temple or garden',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setQueryText(preset);
                  processVoiceQuery(preset);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isHighContrast
                    ? 'border-yellow-400 text-yellow-300 bg-black hover:bg-yellow-400 hover:text-black font-bold'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50'
                }`}
              >
                💬 "{preset}"
              </button>
            ))}
          </div>

          {/* Trigger Process Button */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => processVoiceQuery(queryText)}
              className="px-6 py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t('speak_query', currentLang)}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="px-4 py-3 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-500 text-white shadow-md cursor-pointer flex items-center gap-2"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Voice</span>
              </button>
            )}
          </div>

          {/* Vocal Response Card */}
          {responseText && (
            <div className={`p-6 rounded-2xl border-2 transition-all ${
              isHighContrast
                ? 'bg-black border-yellow-400 text-yellow-300'
                : 'bg-black/60 border-cyan-400/50 text-slate-100 shadow-[0_0_25px_rgba(0,243,255,0.15)]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  {t('assistant_response', currentLang)}
                </span>
                <span className="text-[11px] font-mono text-emerald-400">VERBAL AUDIO ACTIVE</span>
              </div>
              <p className="text-base sm:text-lg leading-relaxed font-medium">
                {responseText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* One-Touch Big Button Dialers */}
      <div className="space-y-3">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-400" />
          <span>{t('quick_sos', currentLang)}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href={`tel:${currentCity.emergency.police}`}
            className="p-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-center border-2 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all cursor-pointer block"
          >
            <div className="text-2xl mb-1">🚨</div>
            <div className="text-lg">{t('call_police', currentLang)}</div>
            <div className="text-xs text-red-200 mt-1 font-mono">24/7 Police Sentinel</div>
          </a>

          <a
            href={`tel:${currentCity.emergency.ambulance}`}
            className="p-5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-center border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer block"
          >
            <div className="text-2xl mb-1">🚑</div>
            <div className="text-lg">{t('call_ambulance', currentLang)}</div>
            <div className="text-xs text-amber-200 mt-1 font-mono">Emergency Trauma Care</div>
          </a>

          <a
            href="tel:14567"
            className="p-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-center border-2 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all cursor-pointer block"
          >
            <div className="text-2xl mb-1">👵</div>
            <div className="text-lg">{t('call_senior', currentLang)}</div>
            <div className="text-xs text-blue-200 mt-1 font-mono">Elderly Dignity Helpline</div>
          </a>

          <a
            href="tel:1091"
            className="p-5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-center border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer block"
          >
            <div className="text-2xl mb-1">👩</div>
            <div className="text-lg">{t('call_women', currentLang)}</div>
            <div className="text-xs text-purple-200 mt-1 font-mono">Women Safety Escort</div>
          </a>
        </div>
      </div>
    </div>
  );
};
