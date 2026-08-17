import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
// import { useTranslation } from 'react-i18next';
import { useTripStore } from '../../stores/tripStore';
import type { Trip } from '../../types/trip';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FlagIcon, HomeIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { renderToStaticMarkup } from 'react-dom/server';
import { locationService } from '../../services/locationService';

// --- Styles Injection ---
// Customizing Leaflet via global styles for specific marker animations and popup overrides
const mapGlobalStyles = `
  /* Reset default marker styling quirks */
  .custom-marker-icon {
    background: transparent !important;
    border: none !important;
  }

  /* Animated Route Line */
  .trip-route-line {
    stroke-dasharray: 10, 10;
    animation: dash 30s linear infinite;
  }
  
  @keyframes dash {
    to {
      stroke-dashoffset: -1000;
    }
  }

  /* Popup Styling - Glassmorphism & Clean Layout */
  .modern-popup .leaflet-popup-content-wrapper {
    padding: 0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.5);
  }
  .modern-popup .leaflet-popup-content {
    margin: 0;
    width: 260px !important;
  }
  .modern-popup .leaflet-popup-tip {
    background: rgba(255, 255, 255, 0.95);
  }
  .modern-popup a.leaflet-popup-close-button {
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    font-size: 20px;
    padding: 8px;
    z-index: 10;
    transition: transform 0.2s;
  }
  .modern-popup a.leaflet-popup-close-button:hover {
    transform: scale(1.1);
    color: #fff;
  }
  
  /* Pulse Animation for Active Marker */
  @keyframes pulse-ring {
    0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(13, 148, 136, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(13, 148, 136, 0); }
    100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(13, 148, 136, 0); }
  }
  .marker-active .marker-ring {
    animation: pulse-ring 2s infinite;
  }
`;

// Inject styles once
if (typeof document !== 'undefined' && !document.getElementById('map-custom-styles')) {
  const style = document.createElement('style');
  style.id = 'map-custom-styles';
  style.textContent = mapGlobalStyles;
  document.head.appendChild(style);
}

// Fix Leaflet default icon issues in React
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Types ---

interface TripMapProps {
  trip: Trip | null;
}

// --- Controller Component ---
// Handles programmatic map moves (Flying to active stops, fitting bounds, or centering on user)
const MapController: React.FC<{ trip: Trip | null; userLocation: [number, number] | null }> = ({ trip, userLocation }) => {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectedStop } = useTripStore();
  
  // Track if we've already done the initial fly-to for the user to prevent fighting with manual drag
  const [hasFlownToUser, setHasFlownToUser] = useState(false);

  // 1. Initial User Location Center (Only if no trip is active)
  useEffect(() => {
    if (!trip && userLocation && !hasFlownToUser) {
      map.flyTo(userLocation, 12, { // Zoom level 12 is good for city/area view
        animate: true,
        duration: 2.0
      });
      setHasFlownToUser(true);
    }
  }, [trip, userLocation, hasFlownToUser, map]);

  // 2. Fit bounds on trip load
  useEffect(() => {
    if (trip && trip.places.length > 0) {
      const allPoints: [number, number][] = [
        ...trip.places.map(p => [p.lat, p.lng] as [number, number]),
      ];
      // Pad the bounds so markers aren't on the edge, especially the bottom where the panel is
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { 
        paddingTopLeft: [50, 50],
        paddingBottomRight: [50, 100], // Extra padding bottom for mobile sheet/desktop panel
        animate: true, 
        duration: 1.5 
      });
    }
  }, [trip, map]);

  // 3. Fly to active stop
  useEffect(() => {
    if (trip && selectedStop) {
      const place = trip.places.find(p => p.name === selectedStop);
      if (place) {
        map.flyTo([place.lat, place.lng], 14, {
          animate: true,
          duration: 2.0, // Slow, cinematic fly
          easeLinearity: 0.25
        });
      }
    }
  }, [selectedStop, trip, map]);

  return null;
};

// --- Helper to generate custom icons ---
const createCustomIcon = (index: number, isSelected: boolean, type: 'start' | 'stop' | 'end') => {
  let iconContent;
  const size = isSelected ? 56 : 40;
  let color = isSelected ? '#0d9488' : '#ffffff'; // Teal-600 vs White
  let textColor = isSelected ? '#ffffff' : '#0d9488';
  // let zIndex = isSelected ? 1000 : 100;

  if (type === 'start') {
    iconContent = renderToStaticMarkup(<HomeIcon className="w-5 h-5 text-teal-700" />);
    color = '#fff';
    textColor = '#0d9488';
  } else if (type === 'end') {
    iconContent = renderToStaticMarkup(<FlagIcon className="w-5 h-5 text-teal-700" />);
    color = '#fff';
    textColor = '#0d9488';
  } else {
    // Normal Stop Number
    iconContent = `<span style="font-weight: 800; font-size: 14px; font-family: sans-serif;">${index + 1}</span>`;
  }

  const markerHtml = `
    <div class="${isSelected ? 'marker-active' : ''}" style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    ">
      <!-- Pulse Ring (Only visible when active via CSS) -->
      <div class="marker-ring" style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(13, 148, 136, 0.3);
        z-index: 0;
      "></div>
      
      <!-- Pin Body (Teardrop Shape) -->
      <div style="
        position: relative;
        z-index: 1;
        width: ${isSelected ? 48 : 36}px;
        height: ${isSelected ? 48 : 36}px;
        background-color: ${color};
        border: ${isSelected ? '3px' : '2px'} solid ${isSelected ? '#ffffff' : '#0d9488'};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Content (Un-rotated) -->
        <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center; color: ${textColor};">
          ${iconContent}
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-marker-icon',
    html: markerHtml,
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // Tip of the teardrop
    popupAnchor: [0, -size],
  });
};

// Create a simple "You are here" icon
const createUserIcon = () => {
  const iconContent = renderToStaticMarkup(<MapPinIcon className="w-6 h-6 text-white" />);
  
  const markerHtml = `
    <div style="
      position: relative;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(13, 148, 136, 0.2);
        animation: pulse-ring 2s infinite;
      "></div>
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        background-color: #0d9488;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${iconContent}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-user-icon',
    html: markerHtml,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

// --- Main Component ---

const TripMap: React.FC<TripMapProps> = ({ trip }) => {
  // const { t } = useTranslation();
  const { selectedStop, visibleStops } = useTripStore();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Default to Paris fallback if GPS fails
  const defaultCenter: [number, number] = [48.8566, 2.3522]; 
  const defaultZoom = 5;

  // Fetch User Location on Mount
  useEffect(() => {
    locationService.getCurrentLocation()
      .then((loc) => {
        if (loc.latitude && loc.longitude) {
          setUserLocation([loc.latitude, loc.longitude]);
        }
      })
      .catch((err) => console.log("Map: Failed to get user location", err));
  }, []);

  // Memoize visible places to avoid re-renders
  const visiblePlaces = useMemo(() => {
    if (!trip) return [];
    return trip.places.filter(place => visibleStops.includes(place.name));
  }, [trip, visibleStops]);

  // Create route path only for visible stops
  const routePositions: [number, number][] = useMemo(() => {
    return visiblePlaces.map(place => [place.lat, place.lng]);
  }, [visiblePlaces]);

  // --- Render Empty State (The "Globe" view) ---
  if (!trip) {
    return (
      <div className="h-full w-full relative bg-gray-50">
        <MapContainer 
          center={defaultCenter} 
          zoom={4} 
          className="h-full w-full"
          zoomControl={false}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          dragging={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          
          {/* Controls the map view (flyTo) when userLocation is found */}
          <MapController trip={null} userLocation={userLocation} />

          {/* Show a "You are here" marker if location is found */}
          {userLocation && (
             <Marker position={userLocation} icon={createUserIcon()} />
          )}

        </MapContainer>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative group">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          // CartoDB Voyager: Beautiful, clean, good contrast for overlays
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapController trip={trip} userLocation={userLocation} />

        {/* Show User Location even during a trip for context */}
        {userLocation && (
           <Marker position={userLocation} icon={createUserIcon()} zIndexOffset={-10} />
        )}

        {/* Animated Route Line */}
        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: '#0f766e', // Teal-700
              weight: 4,
              opacity: 0.8,
              className: 'trip-route-line', // Triggers CSS animation
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}

        {/* Markers */}
        {visiblePlaces.map((place, index) => {
          const isSelected = selectedStop === place.name;
          const isStart = index === 0;
          const isEnd = index === visiblePlaces.length - 1 && visiblePlaces.length > 1;
          
          let type: 'start' | 'stop' | 'end' = 'stop';
          if (isStart) type = 'start';
          if (isEnd) type = 'end';

          const customIcon = createCustomIcon(index, isSelected, type);

          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={customIcon}
              zIndexOffset={isSelected ? 1000 : 100}
            >
              <Popup className="modern-popup" closeButton={true} maxWidth={280}>
                <div className="flex flex-col select-none">
                  {/* Image Header with Category Badge */}
                  <div className="relative h-36 w-full bg-gray-100 group">
                    <img
                      src={place.image || `https://picsum.photos/400/300?random=${index}`}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-teal-800 shadow-sm uppercase tracking-wide">
                      {index + 1} • {place.category}
                    </div>
                    
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                         <h3 className="text-lg font-bold leading-tight font-serif text-shadow-sm">{place.name}</h3>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 pt-3">
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {place.description}
                    </p>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Estimated Time</span>
                        <span className="text-xs font-bold text-teal-700">~2.5 Hours</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Map Attribution Fade (Cosmetic) */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-linear-to-t from-white/80 to-transparent pointer-events-none z-400" />
    </div>
  );
};

export default TripMap;