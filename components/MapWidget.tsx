
import React, { useEffect, useRef } from 'react';
import { Icons } from './Icons';

interface MapWidgetProps {
  environment?: string; // e.g., 'Mer / Plage', 'Sud / Sahara'
  wilayaCode?: string | null;
  communeName?: string | null;
  listingCount: number;
  price?: number; // Optional specific price for single listing detail view
}

// Coordinates for Environments
const ENV_COORDS: Record<string, { lat: number; lng: number; zoom: number; label: string }> = {
  'Mer / Plage (Littoral)': { lat: 36.8, lng: 5.1, zoom: 8, label: 'Littoral' },
  'Sud / Sahara (Désert)': { lat: 30.5, lng: 2.8, zoom: 6, label: 'Sahara' },
  'Montagne (Kabylie, Aurès...)': { lat: 36.45, lng: 4.2, zoom: 9, label: 'Montagne' },
  'Hauts Plateaux': { lat: 35.5, lng: 5.0, zoom: 8, label: 'Hauts Plateaux' },
  'Ville / Urbain': { lat: 36.75, lng: 3.05, zoom: 10, label: 'Urbain' },
  'Campagne': { lat: 36.0, lng: 2.0, zoom: 8, label: 'Intérieur' },
  'default': { lat: 36.0, lng: 3.0, zoom: 6, label: 'Algérie' }
};

// Approximate Coordinates for Major Wilayas (Mock Data)
const WILAYA_COORDS: Record<string, { lat: number; lng: number; zoom: number }> = {
  '01': { lat: 27.87, lng: -0.29, zoom: 8 }, // Adrar
  '02': { lat: 36.16, lng: 1.33, zoom: 9 }, // Chlef
  '03': { lat: 33.80, lng: 2.86, zoom: 8 }, // Laghouat
  '04': { lat: 35.87, lng: 7.11, zoom: 9 }, // Oum El Bouaghi
  '05': { lat: 35.55, lng: 6.17, zoom: 9 }, // Batna
  '06': { lat: 36.75, lng: 5.08, zoom: 10 }, // Bejaia
  '07': { lat: 34.85, lng: 5.72, zoom: 9 }, // Biskra
  '08': { lat: 31.62, lng: -2.22, zoom: 8 }, // Bechar
  '09': { lat: 36.47, lng: 2.83, zoom: 10 }, // Blida
  '10': { lat: 36.37, lng: 3.90, zoom: 9 }, // Bouira
  '11': { lat: 22.78, lng: 5.52, zoom: 6 }, // Tamanrasset
  '12': { lat: 35.40, lng: 8.12, zoom: 9 }, // Tebessa
  '13': { lat: 34.87, lng: -1.31, zoom: 10 }, // Tlemcen
  '14': { lat: 35.37, lng: 1.31, zoom: 9 }, // Tiaret
  '15': { lat: 36.71, lng: 4.05, zoom: 10 }, // Tizi Ouzou
  '16': { lat: 36.75, lng: 3.04, zoom: 11 }, // Alger
  '17': { lat: 34.67, lng: 3.25, zoom: 8 }, // Djelfa
  '18': { lat: 36.82, lng: 5.76, zoom: 10 }, // Jijel
  '19': { lat: 36.19, lng: 5.41, zoom: 10 }, // Setif
  '20': { lat: 34.83, lng: 0.15, zoom: 9 }, // Saida
  '21': { lat: 36.87, lng: 6.90, zoom: 10 }, // Skikda
  '22': { lat: 35.19, lng: -0.63, zoom: 9 }, // Sidi Bel Abbes
  '23': { lat: 36.90, lng: 7.76, zoom: 11 }, // Annaba
  '24': { lat: 36.46, lng: 7.43, zoom: 9 }, // Guelma
  '25': { lat: 36.36, lng: 6.61, zoom: 11 }, // Constantine
  '26': { lat: 36.26, lng: 2.75, zoom: 9 }, // Medea
  '27': { lat: 35.93, lng: 0.09, zoom: 10 }, // Mostaganem
  '28': { lat: 35.70, lng: 4.54, zoom: 8 }, // M'Sila
  '29': { lat: 35.39, lng: 0.14, zoom: 9 }, // Mascara
  '30': { lat: 31.95, lng: 5.32, zoom: 8 }, // Ouargla
  '31': { lat: 35.69, lng: -0.63, zoom: 11 }, // Oran
  '32': { lat: 33.68, lng: 1.02, zoom: 8 }, // El Bayadh
  '33': { lat: 26.48, lng: 8.46, zoom: 6 }, // Illizi
  '34': { lat: 36.07, lng: 4.62, zoom: 9 }, // BBA
  '35': { lat: 36.76, lng: 3.47, zoom: 10 }, // Boumerdes
  '36': { lat: 36.76, lng: 8.31, zoom: 10 }, // El Tarf
  '37': { lat: 27.67, lng: -8.14, zoom: 7 }, // Tindouf
  '38': { lat: 35.60, lng: 1.81, zoom: 9 }, // Tissemsilt
  '39': { lat: 33.36, lng: 6.85, zoom: 8 }, // El Oued
  '40': { lat: 35.43, lng: 7.14, zoom: 9 }, // Khenchela
  '41': { lat: 36.28, lng: 7.95, zoom: 9 }, // Souk Ahras
  '42': { lat: 36.59, lng: 2.40, zoom: 10 }, // Tipaza
  '43': { lat: 36.45, lng: 6.26, zoom: 9 }, // Mila
  '44': { lat: 36.26, lng: 1.96, zoom: 9 }, // Ain Defla
  '45': { lat: 32.75, lng: -0.30, zoom: 8 }, // Naama
  '46': { lat: 35.30, lng: -1.14, zoom: 10 }, // Ain Temouchent
  '47': { lat: 32.49, lng: 3.67, zoom: 9 }, // Ghardaia
  '48': { lat: 35.74, lng: 0.55, zoom: 9 }, // Relizane
};

export const MapWidget: React.FC<MapWidgetProps> = ({ environment, wilayaCode, communeName, listingCount, price }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  // Determine target coordinates logic
  let target = ENV_COORDS['default'];
  let currentLabel = 'Algérie';

  if (wilayaCode && WILAYA_COORDS[wilayaCode]) {
    // 1. Priority: Wilaya
    target = { ...WILAYA_COORDS[wilayaCode], label: `Wilaya ${wilayaCode}` };
    currentLabel = `Wilaya ${wilayaCode}`;
    
    if (communeName) {
        // 2. Priority: Commune (Zoom in more on Wilaya center as approximation)
        // In a real app, we would need a database of commune lat/lng
        target.zoom = 13; 
        target.label = communeName;
        currentLabel = communeName;
    }
  } else if (environment && ENV_COORDS[environment]) {
    // 3. Priority: Environment (if no specific location selected)
    target = ENV_COORDS[environment];
    currentLabel = target.label;
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Initialize map if not already done
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([target.lat, target.lng], target.zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    } else {
      // Smooth fly to new target
      mapInstance.current.flyTo([target.lat, target.lng], target.zoom, {
        duration: 1.5
      });
    }

    // Clear existing layers
    mapInstance.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Add Markers
    // If price is provided, we assume single listing mode -> 1 marker at center
    const isSingleMode = price !== undefined;
    const markersToRender = isSingleMode ? 1 : Math.min(listingCount, 15);

    for (let i = 0; i < markersToRender; i++) {
      // Random offset radius based on zoom level (tighter for higher zoom)
      // If single mode, use 0 offset
      const spread = isSingleMode ? 0 : 0.5 / Math.pow(2, target.zoom - 8); 
      
      const latOffset = (Math.random() - 0.5) * spread;
      const lngOffset = (Math.random() - 0.5) * spread;
      
      const displayPrice = isSingleMode ? price : Math.floor(Math.random() * 50 + 5) * 1000;

      const iconHtml = `
        <div style="background-color: white; padding: 4px 8px; border-radius: 12px; border: 1px solid #3b82f6; font-weight: bold; font-size: 10px; color: #1d4ed8; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap;">
          ${displayPrice?.toLocaleString()} DA
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-price-marker',
        html: iconHtml,
        iconSize: [60, 20],
        iconAnchor: [30, 20]
      });

      L.marker([target.lat + latOffset, target.lng + lngOffset], { icon: customIcon })
        .addTo(mapInstance.current)
        .bindPopup(`<b>${currentLabel}</b><br>${displayPrice?.toLocaleString()} DA`);
    }

    return () => {};
  }, [environment, wilayaCode, communeName, listingCount, price]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all duration-300">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
                <Icons.Map className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-800 text-sm">
                Localisation : {currentLabel}
            </span>
         </div>
         <span className="text-xs text-gray-500">{price ? 'Emplacement approximatif' : `${listingCount} biens trouvés`}</span>
      </div>
      <div className="h-48 md:h-64 w-full relative z-0">
         <div ref={mapRef} className="w-full h-full" />
         
         <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] text-gray-500 z-[400] shadow-sm pointer-events-none">
            © OpenStreetMap
         </div>
      </div>
    </div>
  );
};
