import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Navigation, 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Sliders, 
  Share2,
  Check
} from 'lucide-react';
import { CityInfo, LanguageCode, PathNode, IncidentReport } from '../types';
import { t } from '../utils/i18n';
import { computeAStarRoutes } from '../utils/geoAlgorithms';
import { MapView } from './MapView';

interface ModuleSafeNavProps {
  currentCity: CityInfo;
  nodes: PathNode[];
  incidents: IncidentReport[];
  currentLang: LanguageCode;
}

export const ModuleSafeNav: React.FC<ModuleSafeNavProps> = ({
  currentCity,
  nodes,
  incidents,
  currentLang,
}) => {
  const [incidentWeightB, setIncidentWeightB] = useState<number>(0.7);
  const [activeRouteType, setActiveRouteType] = useState<'safe' | 'standard'>('safe');
  const [copiedShare, setCopiedShare] = useState(false);

  // Compute A* path routes dynamically
  const { standardRoute, safeRoute } = useMemo(() => {
    return computeAStarRoutes(nodes, incidentWeightB);
  }, [nodes, incidentWeightB]);

  const activeRoute = activeRouteType === 'safe' ? safeRoute : standardRoute;

  // Construct Map Paths
  const mapPaths = [
    {
      id: 'standard-path',
      coordinates: standardRoute.path,
      color: activeRouteType === 'standard' ? '#f59e0b' : '#64748b',
      dashArray: activeRouteType === 'standard' ? undefined : '6, 8',
      weight: activeRouteType === 'standard' ? 5 : 3,
    },
    {
      id: 'safe-path',
      coordinates: safeRoute.path,
      color: activeRouteType === 'safe' ? '#00f3ff' : '#0369a1',
      weight: activeRouteType === 'safe' ? 5 : 3,
    },
  ];

  // Construct Map Markers
  const mapMarkers = [
    {
      id: 'start-marker',
      lat: nodes[0].lat,
      lng: nodes[0].lng,
      title: `Starting Point: ${nodes[0].name}`,
      type: 'safe_node' as const,
    },
    {
      id: 'end-marker',
      lat: nodes[nodes.length - 1].lat,
      lng: nodes[nodes.length - 1].lng,
      title: `Destination: ${nodes[nodes.length - 1].name}`,
      type: 'safe_node' as const,
    },
    ...incidents.map((inc) => ({
      id: inc.id,
      lat: inc.lat,
      lng: inc.lng,
      title: `${inc.title} (Urgency: ${inc.severity}/5)`,
      type: 'hazard' as const,
      severity: inc.severity,
      category: inc.category,
      popupHtml: `
        <div style="font-family: sans-serif; font-size: 12px;">
          <b style="color: #ef4444;">Reported Issue:</b><br/>
          <strong>${inc.title}</strong><br/>
          <small>Status: ${inc.status} | Wing: ${inc.department}</small>
        </div>
      `,
    })),
  ];

  const emergencySmsText = `Emergency Location Alert: Traveling in ${currentCity.name}. Coordinates: (${currentCity.lat.toFixed(4)}, ${currentCity.lng.toFixed(4)}). Police: ${currentCity.emergency.police}.`;
  const smsHref = `sms:${currentCity.emergency.police}?body=${encodeURIComponent(emergencySmsText)}`;

  const handleShareRoute = () => {
    navigator.clipboard.writeText(`Safe Route in ${currentCity.name}: From ${nodes[0].name} to ${nodes[nodes.length - 1].name} (${safeRoute.distanceKm} km, ${safeRoute.safetyScore}% Safety Rating).`);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                Safe Navigation
              </span>
              <span className="text-xs text-slate-400">
                {currentCity.name}, {currentCity.state}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {t('nav_title', currentLang)}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Automatically directs pedestrians and commuters through well-lit streets, active transit hubs, and avoids unlit lanes or roadwork.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareRoute}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer shadow-sm transition-all"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Route Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Share Route</span>
                </>
              )}
            </button>
            <a
              href={smsHref}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t('send_sms_alert', currentLang)}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls & Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Route Selector & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Route Options Toggle */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span>Select Route Preference</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveRouteType('safe')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  activeRouteType === 'safe'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-cyan-300">Safe Route</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    Best
                  </span>
                </div>
                <div className="text-xs text-white font-bold">{safeRoute.estimatedMinutes} mins • {safeRoute.distanceKm} km</div>
                <div className="text-[11px] text-slate-400 mt-1">Well-lit streets, avoids hazards</div>
              </button>

              <button
                onClick={() => setActiveRouteType('standard')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  activeRouteType === 'standard'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-amber-300">Direct Route</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Faster
                  </span>
                </div>
                <div className="text-xs text-white font-bold">{standardRoute.estimatedMinutes} mins • {standardRoute.distanceKm} km</div>
                <div className="text-[11px] text-slate-400 mt-1">Passes through unlit lanes</div>
              </button>
            </div>

            {/* Safety Preference Slider */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-300">{t('incident_weight_slider', currentLang)}</span>
                <span className="text-cyan-300 font-bold">
                  {incidentWeightB >= 0.7 ? 'Maximum Safety' : incidentWeightB >= 0.4 ? 'Balanced' : 'Direct'}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={incidentWeightB}
                onChange={(e) => setIncidentWeightB(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Active Route Metrics Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Active Route Summary
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeRouteType === 'safe'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {activeRouteType === 'safe' ? 'High Safety Rating' : 'Caution Advised'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">SAFETY</span>
                <span className="text-base font-bold text-cyan-300">{activeRoute.safetyScore}%</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">DISTANCE</span>
                <span className="text-base font-bold text-white">{activeRoute.distanceKm} km</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">DURATION</span>
                <span className="text-base font-bold text-white">{activeRoute.estimatedMinutes} mins</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <MapPin className="w-3.5 h-3.5" />
                <span><b>From:</b> {nodes[0].name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <MapPin className="w-3.5 h-3.5" />
                <span><b>To:</b> {nodes[nodes.length - 1].name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Map (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                <span className="w-3 h-1 bg-cyan-400 rounded-full"></span>
                Safe Route (Recommended)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <span className="w-3 h-1 bg-slate-500 rounded-full"></span>
                Direct Route
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {incidents.length} Reported Incidents Monitored
            </span>
          </div>

          <MapView
            center={[currentCity.lat, currentCity.lng]}
            zoom={13}
            markers={mapMarkers}
            paths={mapPaths}
            height="460px"
          />

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Route passes via <b>Heritage Promenade</b>, <b>Civic Boulevard</b>, and <b>Metro Skywalk</b>.
            </span>
            <span className="text-emerald-400 font-medium">Safe Corridor Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
