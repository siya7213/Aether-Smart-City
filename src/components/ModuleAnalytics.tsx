import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Sliders, 
  Download, 
  ArrowUpDown, 
  Shield, 
  TreePine, 
  Bus, 
  HeartPulse, 
  Building,
  Wind
} from 'lucide-react';
import { CityInfo, LanguageCode, Neighborhood } from '../types';
import { t } from '../utils/i18n';

interface ModuleAnalyticsProps {
  currentCity: CityInfo;
  neighborhoods: Neighborhood[];
  currentLang: LanguageCode;
}

export const ModuleAnalytics: React.FC<ModuleAnalyticsProps> = ({
  currentCity,
  neighborhoods,
  currentLang,
}) => {
  // Weights State
  const [wSafety, setWSafety] = useState<number>(0.35);
  const [wGreenery, setWGreenery] = useState<number>(0.20);
  const [wMobility, setWMobility] = useState<number>(0.20);
  const [wHealth, setWHealth] = useState<number>(0.15);
  const [wCivic, setWCivic] = useState<number>(0.10);

  // Sorting State
  const [sortBy, setSortBy] = useState<string>('livability');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Calculate Livability Score for each neighborhood
  const scoredNeighborhoods = useMemo(() => {
    return neighborhoods.map((nh) => {
      const totalWeight = wSafety + wGreenery + wMobility + wHealth + wCivic || 1;
      const li =
        ((wSafety * nh.safetyScore +
          wGreenery * nh.greeneryScore +
          wMobility * nh.mobilityScore +
          wHealth * nh.healthcareScore +
          wCivic * nh.civicScore) /
          totalWeight);

      return {
        ...nh,
        livabilityScore: parseFloat(li.toFixed(1)),
      };
    }).sort((a, b) => {
      let valA = a.livabilityScore;
      let valB = b.livabilityScore;
      if (sortBy === 'safety') { valA = a.safetyScore; valB = b.safetyScore; }
      else if (sortBy === 'greenery') { valA = a.greeneryScore; valB = b.greeneryScore; }
      else if (sortBy === 'mobility') { valA = a.mobilityScore; valB = b.mobilityScore; }
      else if (sortBy === 'health') { valA = a.healthcareScore; valB = b.healthcareScore; }
      else if (sortBy === 'civic') { valA = a.civicScore; valB = b.civicScore; }
      else if (sortBy === 'aqi') { valA = a.aqi; valB = b.aqi; }

      return sortAsc ? valA - valB : valB - valA;
    });
  }, [neighborhoods, wSafety, wGreenery, wMobility, wHealth, wCivic, sortBy, sortAsc]);

  const handleExportCsv = () => {
    const headers = ['Neighborhood', 'Livability Score', 'Safety', 'Greenery', 'Mobility', 'Health', 'Civic Services', 'AQI', 'Population Density'];
    const rows = scoredNeighborhoods.map((n) => [
      `"${n.name}"`,
      n.livabilityScore,
      n.safetyScore,
      n.greeneryScore,
      n.mobilityScore,
      n.healthcareScore,
      n.civicScore,
      n.aqi,
      n.populationDensity,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentCity.id}_livability_scores.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                Quality of Life
              </span>
              <span className="text-xs text-slate-400">
                {currentCity.name}, {currentCity.state}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {t('analytics_title', currentLang)}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Compare different areas in {currentCity.name} across safety, greenery, public transit, healthcare availability, and civic infrastructure.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-500 hover:bg-indigo-400 text-white shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* Priorities Sliders Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>{t('weights_config', currentLang)}</span>
          </h3>
          <span className="text-xs text-slate-400">
            Adjust sliders to personalize rankings based on what matters most to you.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Safety */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                {t('weight_safety', currentLang)}
              </span>
              <span className="text-cyan-300 font-bold">{Math.round(wSafety * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={wSafety}
              onChange={(e) => setWSafety(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-900 rounded"
            />
          </div>

          {/* Greenery */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                {t('weight_greenery', currentLang)}
              </span>
              <span className="text-emerald-300 font-bold">{Math.round(wGreenery * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={wGreenery}
              onChange={(e) => setWGreenery(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-900 rounded"
            />
          </div>

          {/* Mobility */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Bus className="w-3.5 h-3.5 text-blue-400" />
                {t('weight_mobility', currentLang)}
              </span>
              <span className="text-blue-300 font-bold">{Math.round(wMobility * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={wMobility}
              onChange={(e) => setWMobility(Number(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer h-1.5 bg-slate-900 rounded"
            />
          </div>

          {/* Health */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                {t('weight_health', currentLang)}
              </span>
              <span className="text-rose-300 font-bold">{Math.round(wHealth * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={wHealth}
              onChange={(e) => setWHealth(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-900 rounded"
            />
          </div>

          {/* Civic */}
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                {t('weight_civic', currentLang)}
              </span>
              <span className="text-amber-300 font-bold">{Math.round(wCivic * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={wCivic}
              onChange={(e) => setWCivic(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-900 rounded"
            />
          </div>
        </div>
      </div>

      {/* Neighborhood Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>{t('rank_neighborhoods', currentLang)}</span>
          </h3>
          <span className="text-xs text-slate-400">
            Click column headers to sort rankings
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                  <th className="p-3.5 pl-5">#</th>
                  <th className="p-3.5">Area / Neighborhood</th>
                  <th 
                    className="p-3.5 cursor-pointer hover:text-white"
                    onClick={() => { setSortBy('livability'); setSortAsc(!sortAsc); }}
                  >
                    <span className="flex items-center gap-1 text-cyan-300 font-bold">
                      Livability Score <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th 
                    className="p-3.5 cursor-pointer hover:text-white"
                    onClick={() => { setSortBy('safety'); setSortAsc(!sortAsc); }}
                  >
                    Safety <ArrowUpDown className="w-3 h-3 inline" />
                  </th>
                  <th 
                    className="p-3.5 cursor-pointer hover:text-white"
                    onClick={() => { setSortBy('greenery'); setSortAsc(!sortAsc); }}
                  >
                    Green Spaces <ArrowUpDown className="w-3 h-3 inline" />
                  </th>
                  <th 
                    className="p-3.5 cursor-pointer hover:text-white"
                    onClick={() => { setSortBy('mobility'); setSortAsc(!sortAsc); }}
                  >
                    Transport <ArrowUpDown className="w-3 h-3 inline" />
                  </th>
                  <th className="p-3.5">Air Quality (AQI)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {scoredNeighborhoods.map((nh, idx) => (
                  <tr key={nh.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 pl-5 text-slate-400">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                        idx === 0 ? 'bg-amber-400 text-black shadow-sm' :
                        idx === 1 ? 'bg-slate-300 text-black' :
                        idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{nh.name}</div>
                      <div className="text-[11px] text-slate-400">
                        Density: {nh.populationDensity.toLocaleString()} / km²
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-cyan-300">
                          {nh.livabilityScore}
                        </span>
                        <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="bg-cyan-400 h-full rounded-full" 
                            style={{ width: `${nh.livabilityScore}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-200">
                      {nh.safetyScore} / 100
                    </td>
                    <td className="p-3.5 text-emerald-400">
                      {nh.greeneryScore} / 100
                    </td>
                    <td className="p-3.5 text-blue-400">
                      {nh.mobilityScore} / 100
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border ${
                        nh.aqi < 80 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        <Wind className="w-3 h-3" />
                        AQI {nh.aqi}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
