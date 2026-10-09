import React, { useState } from 'react';
import { 
  AlertTriangle, 
  PlusCircle, 
  ThumbsUp, 
  CheckCircle, 
  Clock, 
  Truck, 
  MapPin, 
  Camera, 
  Filter,
  Check
} from 'lucide-react';
import { CityInfo, LanguageCode, IncidentReport, HazardCategory, IncidentStatus } from '../types';
import { t } from '../utils/i18n';
import { MapView } from './MapView';

interface ModuleTriageProps {
  currentCity: CityInfo;
  incidents: IncidentReport[];
  onAddIncident: (incident: IncidentReport) => void;
  onUpvoteIncident: (id: string) => void;
  currentLang: LanguageCode;
}

export const ModuleTriage: React.FC<ModuleTriageProps> = ({
  currentCity,
  incidents,
  onAddIncident,
  onUpvoteIncident,
  currentLang,
}) => {
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HazardCategory>('Pothole');
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [isPhotoAttached, setIsPhotoAttached] = useState(false);
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'All'>('All');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    let dept = 'Public Works Department (PWD)';
    if (category === 'Streetlight Failure') dept = 'Municipal Electrical Division';
    else if (category === 'Water Pipe Leak') dept = 'Water Supply & Sewerage Board';
    else if (category === 'Garbage Overflow') dept = 'Solid Waste Management';
    else if (category === 'Open Manhole') dept = 'Drainage & Stormwater Wing';

    const newReport: IncidentReport = {
      id: `${currentCity.id}-inc-${Date.now()}`,
      cityId: currentCity.id,
      title: title.trim(),
      category,
      description: description.trim(),
      severity,
      lat: currentCity.lat + (Math.random() * 0.02 - 0.01),
      lng: currentCity.lng + (Math.random() * 0.02 - 0.01),
      address: address.trim() || `${currentCity.name} Central Sector`,
      status: 'Reported',
      upvotes: 1,
      reportedAt: 'Just now',
      department: dept,
      reporterBadge: `Resident #${Math.floor(100 + Math.random() * 900)}`,
    };

    onAddIncident(newReport);
    setTitle('');
    setDescription('');
    setAddress('');
    setIsPhotoAttached(false);
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 3000);
  };

  const filteredIncidents = incidents.filter(
    (inc) => statusFilter === 'All' || inc.status === statusFilter
  );

  const mapMarkers = filteredIncidents.map((inc) => ({
    id: inc.id,
    lat: inc.lat,
    lng: inc.lng,
    title: inc.title,
    type: 'hazard' as const,
    severity: inc.severity,
    category: inc.category,
    popupHtml: `
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
        <span style="background: #ef4444; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">
          URGENCY ${inc.severity}/5
        </span>
        <h4 style="margin: 4px 0; color: #fff; font-size: 13px;">${inc.title}</h4>
        <div style="color: #94a3b8; font-size: 11px;">Category: ${inc.category}</div>
        <div style="color: #00f3ff; font-size: 11px;">Status: ${inc.status}</div>
      </div>
    `,
  }));

  const hazardCategories: HazardCategory[] = [
    'Pothole',
    'Streetlight Failure',
    'Water Pipe Leak',
    'Garbage Overflow',
    'Fallen Tree / Debris',
    'Broken Footpath',
    'Open Manhole',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-rose-500/15 text-rose-300 border border-rose-500/20">
                Civic Community Action
              </span>
              <span className="text-xs text-slate-400">
                {currentCity.name}, {currentCity.state}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {t('triage_title', currentLang)}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Report potholes, dark streetlights, water leaks, or garbage overflow to notify municipal response teams and warn fellow commuters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-rose-300">
              {incidents.length} Active Local Reports
            </span>
          </div>
        </div>
      </div>

      {submittedNotice && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Your civic issue has been logged and pinned to the live city map!</span>
        </div>
      )}

      {/* Grid: Reporting Form & Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <PlusCircle className="w-5 h-5 text-rose-400" />
              <span>{t('report_hazard', currentLang)}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken streetlight on main road"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">{t('hazard_type', currentLang)}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HazardCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                  >
                    {hazardCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    {t('severity', currentLang)} ({severity}/5)
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value) as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                  >
                    <option value={5}>High (Level 5)</option>
                    <option value={4}>Substantial (Level 4)</option>
                    <option value={3}>Moderate (Level 3)</option>
                    <option value={2}>Low (Level 2)</option>
                    <option value={1}>Minor (Level 1)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Address / Landmark</label>
                <input
                  type="text"
                  placeholder={`e.g. Near Metro Station, ${currentCity.name}`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">{t('description', currentLang)}</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue: exact spot, safety risk to two-wheelers or pedestrians, time noticed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-black/40 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsPhotoAttached(!isPhotoAttached)}
                  className={`flex items-center gap-2 text-xs font-medium cursor-pointer ${
                    isPhotoAttached ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{isPhotoAttached ? 'Photo Attached (issue_photo.jpg)' : 'Attach Photo'}</span>
                </button>
                <span className="text-[11px] text-slate-500">
                  Auto-coordinates applied
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-all cursor-pointer"
              >
                {t('submit_report', currentLang)}
              </button>
            </form>
          </div>
        </div>

        {/* Live Map (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{t('live_map_feed', currentLang)}</span>
            </h3>

            <div className="flex items-center gap-1.5">
              {(['All', 'Reported', 'In Review', 'Dispatched', 'Resolved'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <MapView
            center={[currentCity.lat, currentCity.lng]}
            zoom={13}
            markers={mapMarkers}
            height="440px"
          />
        </div>
      </div>

      {/* Incident Cards Feed */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">
          Reported Issues ({filteredIncidents.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIncidents.map((inc) => {
            const statusColors: Record<IncidentStatus, { bg: string; text: string; icon: any }> = {
              Reported: { bg: 'bg-amber-500/20 border-amber-500/30', text: 'text-amber-300', icon: Clock },
              'In Review': { bg: 'bg-cyan-500/20 border-cyan-500/30', text: 'text-cyan-300', icon: AlertTriangle },
              Dispatched: { bg: 'bg-blue-500/20 border-blue-500/30', text: 'text-blue-300', icon: Truck },
              Resolved: { bg: 'bg-emerald-500/20 border-emerald-500/30', text: 'text-emerald-300', icon: CheckCircle },
            };
            const sc = statusColors[inc.status];
            const StatusIcon = sc.icon;

            return (
              <div
                key={inc.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/30">
                      {inc.category}
                    </span>

                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {inc.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{inc.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{inc.description}</p>

                  <div className="text-xs text-slate-400 space-y-1 bg-black/40 p-2.5 rounded-xl border border-slate-800/80 mb-4">
                    <div><b>Location:</b> {inc.address}</div>
                    <div><b>Responsible Dept:</b> <span className="text-cyan-400">{inc.department}</span></div>
                    {inc.reporterBadge && (
                      <div className="text-[11px] text-slate-500">
                        Reported by: {inc.reporterBadge} • {inc.reportedAt}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">
                      Severity: <b>{inc.severity}/5</b>
                    </span>
                  </div>

                  <button
                    onClick={() => onUpvoteIncident(inc.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 cursor-pointer font-medium transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Confirm / Upvote ({inc.upvotes})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
