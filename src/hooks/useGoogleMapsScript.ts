// src/hooks/useGoogleMapsScript.ts
// ✅ Load Google Maps once globally via script tag

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    initGoogleMaps: () => void;
  }
}

let isLoading = false;
let isLoaded = false;
const callbacks: Array<() => void> = [];

export const useGoogleMapsScript = () => {
  const [loaded, setLoaded] = useState(isLoaded);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Already loaded
    if (isLoaded) {
      setLoaded(true);
      return;
    }

    // Currently loading
    if (isLoading) {
      callbacks.push(() => setLoaded(true));
      return;
    }

    // Start loading
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      const err = new Error('VITE_GOOGLE_MAPS_API_KEY not found in environment variables');
      setError(err);
      console.error(err);
      return;
    }

    // Check if already loaded (by script tag or previous load)
    if (window.google?.maps) {
      console.log('✅ Google Maps already loaded');
      isLoaded = true;
      setLoaded(true);
      return;
    }

    console.log('🔄 Loading Google Maps...');
    isLoading = true;

    // Create callback function
    window.initGoogleMaps = () => {
      console.log('✅ Google Maps loaded via callback');
      isLoaded = true;
      isLoading = false;
      setLoaded(true);
      
      // Execute all waiting callbacks
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };

    // Load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      const err = new Error('Failed to load Google Maps script');
      console.error(err);
      setError(err);
      isLoading = false;
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount - we want it to persist
    };
  }, []);

  return { loaded, error };
};
