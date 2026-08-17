// src/components/trip/LeafletTripMap.tsx
// ✅ FULL UPDATED VERSION — Smooth + Animated + Zoomed Out

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RouteInfo, TripStop } from '../../types/trip';

interface LeafletTripMapProps {
  departureCoords: { lat: number; lng: number } | null;
  destinationCoords: { lat: number; lng: number } | null;
  transport: 'car' | 'bike';
  onRouteCalculated?: (info: RouteInfo, stops: TripStop[]) => void;
}

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LeafletTripMap: React.FC<LeafletTripMapProps> = ({
  departureCoords,
  destinationCoords,
  transport,
  onRouteCalculated,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const departureMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const lastCalculatedRef = useRef<string>('');

  // ===============================
  // Initialize Map
  // ===============================
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const center = departureCoords || { lat: 30.2741, lng: 120.1551 };

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView([center.lat, center.lng], 11); // ⬅ slightly zoomed out

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }
    ).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ===============================
  // Smooth fly to departure
  // ===============================
  useEffect(() => {
    if (!mapRef.current || !departureCoords) return;

    mapRef.current.flyTo(
      [departureCoords.lat, departureCoords.lng],
      12,
      {
        duration: 1.5,
        easeLinearity: 0.25,
      }
    );
  }, [departureCoords]);

  // ===============================
  // Departure Marker
  // ===============================
  useEffect(() => {
    if (!mapRef.current || !departureCoords) return;

    if (departureMarkerRef.current) {
      departureMarkerRef.current.setLatLng([
        departureCoords.lat,
        departureCoords.lng,
      ]);
      return;
    }

    const tealIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          background-color:#0d9488;
          width:28px;
          height:28px;
          border-radius:50%;
          border:3px solid white;
          box-shadow:0 4px 10px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    departureMarkerRef.current = L.marker(
      [departureCoords.lat, departureCoords.lng],
      { icon: tealIcon }
    )
      .addTo(mapRef.current)
      .bindPopup('Departure');
  }, [departureCoords]);

  // ===============================
  // Destination Marker
  // ===============================
  useEffect(() => {
    if (!mapRef.current || !destinationCoords) return;

    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setLatLng([
        destinationCoords.lat,
        destinationCoords.lng,
      ]);
      return;
    }

    const redIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          background-color:#ef4444;
          width:32px;
          height:32px;
          border-radius:50%;
          border:3px solid white;
          box-shadow:0 4px 10px rgba(0,0,0,0.3);
          animation:pulse 1.5s infinite;
        "></div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });

    destinationMarkerRef.current = L.marker(
      [destinationCoords.lat, destinationCoords.lng],
      { icon: redIcon }
    )
      .addTo(mapRef.current)
      .bindPopup('Destination');
  }, [destinationCoords]);

  // ===============================
  // Animated Route Drawing
  // ===============================
  useEffect(() => {
    if (!mapRef.current || !departureCoords || !destinationCoords) return;

    const routeKey = `${departureCoords.lat},${departureCoords.lng}-${destinationCoords.lat},${destinationCoords.lng}-${transport}`;
    if (lastCalculatedRef.current === routeKey) return;
    lastCalculatedRef.current = routeKey;

    // Remove old route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
    }

    const animatedLine = L.polyline([], {
      color: '#0d9488',
      weight: 5,
      opacity: 0.9,
    }).addTo(mapRef.current);

    routeLayerRef.current = animatedLine;

    // Animate drawing
    let progress = 0;
    const steps = 60;

    const interval = setInterval(() => {
      progress++;

      const lat =
        departureCoords.lat +
        (destinationCoords.lat - departureCoords.lat) *
          (progress / steps);

      const lng =
        departureCoords.lng +
        (destinationCoords.lng - departureCoords.lng) *
          (progress / steps);

      animatedLine.addLatLng([lat, lng]);

      if (progress >= steps) {
        clearInterval(interval);

        // Smooth fit bounds
        mapRef.current?.flyToBounds(animatedLine.getBounds(), {
          padding: [80, 80],
          duration: 1.5,
        });
      }
    }, 16);

    // Distance calculation
    const distance =
      mapRef.current.distance(
        [departureCoords.lat, departureCoords.lng],
        [destinationCoords.lat, destinationCoords.lng]
      ) / 1000;

    const speed = transport === 'car' ? 60 : 20;
    const duration = Math.round((distance / speed) * 60);

    const routeInfo: RouteInfo = {
      distance,
      duration,
      distanceText: `${distance.toFixed(1)} km`,
      durationText:
        duration > 60
          ? `${Math.floor(duration / 60)}h ${duration % 60}min`
          : `${duration}min`,
    };

    if (onRouteCalculated) {
      onRouteCalculated(routeInfo, []);
    }
  }, [departureCoords, destinationCoords, transport]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ borderRadius: '16px' }}
    />
  );
};

export default LeafletTripMap;
