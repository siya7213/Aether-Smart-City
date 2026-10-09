import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: 'landmark' | 'hazard' | 'safe_node' | 'neighborhood';
  severity?: number;
  category?: string;
  popupHtml?: string;
}

interface MapPath {
  id: string;
  coordinates: [number, number][];
  color: string;
  dashArray?: string;
  weight?: number;
}

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  paths?: MapPath[];
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  center,
  zoom = 13,
  markers = [],
  paths = [],
  height = '420px',
  onMarkerClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map with Dark Matter tiles (keyless!)
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: false,
      });

      // Free CartoDB Dark Matter tiles (zero API key)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
      layersGroupRef.current = L.featureGroup().addTo(map);
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers & paths whenever data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // Render paths
    paths.forEach((p) => {
      const polyline = L.polyline(p.coordinates, {
        color: p.color,
        weight: p.weight || 4,
        dashArray: p.dashArray,
        opacity: 0.9,
      }).addTo(group);

      // Glow effect polyline underneath
      L.polyline(p.coordinates, {
        color: p.color,
        weight: (p.weight || 4) + 6,
        opacity: 0.3,
      }).addTo(group);
    });

    // Render markers
    markers.forEach((m) => {
      let iconHtml = '';
      if (m.type === 'hazard') {
        const color = m.severity && m.severity >= 4 ? '#ef4444' : '#f59e0b';
        iconHtml = `
          <div style="
            background: ${color};
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 14px ${color};
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-size: 11px;
            font-weight: 800;
          ">!</div>
        `;
      } else if (m.type === 'landmark') {
        iconHtml = `
          <div style="
            background: #ffb700;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 14px #ffb700;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-size: 11px;
            font-weight: 800;
          ">🏛</div>
        `;
      } else if (m.type === 'safe_node') {
        iconHtml = `
          <div style="
            background: #00f3ff;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 12px #00f3ff;
          "></div>
        `;
      } else {
        iconHtml = `
          <div style="
            background: #10b981;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            border: 2px solid #ffffff;
            box-shadow: 0 0 12px #10b981;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-size: 10px;
            font-weight: 800;
          ">📍</div>
        `;
      }

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-map-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(group);

      if (m.popupHtml) {
        marker.bindPopup(m.popupHtml);
      } else {
        marker.bindPopup(`<b>${m.title}</b><br/><small>${m.category || m.type}</small>`);
      }

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(m));
      }
    });
  }, [markers, paths, onMarkerClick]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_25px_rgba(0,243,255,0.1)]">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      <div className="absolute bottom-2 left-2 z-[400] bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-slate-400 border border-slate-700/50">
        © OpenStreetMap
      </div>
    </div>
  );
};
