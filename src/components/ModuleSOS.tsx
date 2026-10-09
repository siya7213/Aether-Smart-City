import React, { useState } from 'react';
import { 
  PhoneCall, 
  MapPin, 
  Share2, 
  Check, 
  Copy, 
  Send, 
  Flame, 
  Heart, 
  ShieldAlert, 
  Car, 
  Compass, 
  Droplet,
  Users,
  Baby
} from 'lucide-react';
import { CityInfo, LanguageCode } from '../types';
import { t } from '../utils/i18n';

interface ModuleSOSProps {
  currentCity: CityInfo;
  currentLang: LanguageCode;
}

export const ModuleSOS: React.FC<ModuleSOSProps> = ({ currentCity, currentLang }) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [activeCallNotice, setActiveCallNotice] = useState<string | null>(null);

  const coordsString = `${currentCity.lat.toFixed(4)}° N, ${currentCity.lng.toFixed(4)}° E`;

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(`Emergency Location in ${currentCity.name}: ${coordsString}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const emergencySmsText = `EMERGENCY SOS: I need urgent assistance in ${currentCity.name}. My current approximate coordinates are ${coordsString}. Emergency contacts: Police ${currentCity.emergency.police}, Ambulance ${currentCity.emergency.ambulance}.`;
  const smsHref = `sms:${currentCity.emergency.police}?body=${encodeURIComponent(emergencySmsText)}`;

  const contactsList = [
    {
      id: 'police',
      name: 'Police Emergency',
      number: currentCity.emergency.police,
      desc: 'Immediate law enforcement & 24/7 patrol dispatch',
      color: 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30',
      btnColor: 'bg-red-600 hover:bg-red-500 text-white',
      icon: ShieldAlert,
    },
    {
      id: 'ambulance',
      name: 'Ambulance & Trauma Care',
      number: currentCity.emergency.ambulance,
      desc: 'Government emergency ambulance & paramedical service',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30',
      btnColor: 'bg-amber-600 hover:bg-amber-500 text-white',
      icon: Heart,
    },
    {
      id: 'fire',
      name: 'Fire & Rescue Service',
      number: currentCity.emergency.fire,
      desc: 'City fire station & emergency search/rescue squad',
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/40 hover:bg-orange-500/30',
      btnColor: 'bg-orange-600 hover:bg-orange-500 text-white',
      icon: Flame,
    },
    {
      id: 'women',
      name: 'Women Safety Helpline',
      number: currentCity.emergency.womenHelpline,
      desc: '24/7 National Women Commission emergency response',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/40 hover:bg-purple-500/30',
      btnColor: 'bg-purple-600 hover:bg-purple-500 text-white',
      icon: Users,
    },
    {
      id: 'senior',
      name: 'Senior Citizens Helpline',
      number: currentCity.emergency.seniorHelpline,
      desc: 'Dedicated elder assistance, medical dispatch & protection',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30',
      btnColor: 'bg-blue-600 hover:bg-blue-500 text-white',
      icon: Users,
    },
    {
      id: 'child',
      name: 'Childline Helpline',
      number: currentCity.emergency.childHelpline,
      desc: 'Emergency protection and care for children in distress',
      color: 'bg-pink-500/20 text-pink-400 border-pink-500/40 hover:bg-pink-500/30',
      btnColor: 'bg-pink-600 hover:bg-pink-500 text-white',
      icon: Baby,
    },
    {
      id: 'disaster',
      name: 'Disaster Management Cell',
      number: currentCity.emergency.disasterMgmt,
      desc: `${currentCity.name} Municipal Disaster & Flood Control Cell`,
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/30',
      btnColor: 'bg-cyan-600 hover:bg-cyan-500 text-white',
      icon: ShieldAlert,
    },
    {
      id: 'tourist',
      name: 'Tourist Police & Helpline',
      number: currentCity.emergency.touristHelpline,
      desc: 'Visitor assistance, travel guidance & verification',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30',
      btnColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      icon: Compass,
    },
    {
      id: 'blood',
      name: 'Blood Bank & Emergency Health',
      number: currentCity.emergency.bloodBank,
      desc: 'State health department 24/7 blood availability helpline',
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30',
      btnColor: 'bg-rose-600 hover:bg-rose-500 text-white',
      icon: Droplet,
    },
    {
      id: 'accident',
      name: 'Highway & Road Accident',
      number: currentCity.emergency.roadAccident,
      desc: 'Expressway safety patrol and towing assistance',
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 hover:bg-yellow-500/30',
      btnColor: 'bg-yellow-600 hover:bg-yellow-500 text-white',
      icon: Car,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-red-500/20 text-red-300 border border-red-500/30 font-semibold">
                24/7 EMERGENCY ASSISTANCE
              </span>
              <span className="text-xs text-slate-400">
                {currentCity.name}, {currentCity.state}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {t('sos_title', currentLang)}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              One-touch direct dialing for police, medical trauma, fire brigade, women safety, and city disaster rescue teams.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyLocation}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer shadow-sm transition-all"
            >
              {copiedCoords ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Location Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>Copy Coordinates</span>
                </>
              )}
            </button>

            <a
              href={smsHref}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Live Location via SMS</span>
            </a>
          </div>
        </div>
      </div>

      {/* Live Location Card */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white">Your Registered Location</div>
            <div className="text-slate-400">
              {currentCity.name} Center • <span className="text-cyan-400 font-mono">{coordsString}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Emergency services actively dispatched in this region</span>
        </div>
      </div>

      {/* Call Notice Feedback Toast */}
      {activeCallNotice && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <span>Connecting dialer for: <b>{activeCallNotice}</b></span>
          <button onClick={() => setActiveCallNotice(null)} className="text-emerald-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* All Emergency Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactsList.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-md flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${c.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-base font-extrabold text-white font-mono tracking-wider">
                    {c.number}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">{c.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{c.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <a
                  href={`tel:${c.number.replace(/[^0-9]/g, '') || c.number}`}
                  onClick={() => setActiveCallNotice(c.name)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${c.btnColor}`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {c.number}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
