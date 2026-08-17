import { apiClient } from './apiClient';
import { type UserLocation, type LocationStrategy, type LocationStrategyType } from '../types/location';

// --- Strategies ---

/**
 * Strategy 1: Browser Geolocation (High Accuracy)
 * Requires User Permission.
 * Tries: OpenStreetMap -> Custom Backend -> Fail (triggers IP strategy)
 */
class BrowserGeolocationStrategy implements LocationStrategy {
  name: LocationStrategyType = 'gps';

  getLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // 1. Try OpenStreetMap (Nominatim) first
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            // Extract city (can be under city, town, village, or county)
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.village || addr.county || 'Unknown Location';
            const country = addr.country || '';

            resolve({
              latitude,
              longitude,
              city,
              country,
              address: data.display_name
            });
            return;
          } catch (osmError) {
            console.warn('OpenStreetMap geocoding failed, trying Custom Backend...', osmError);
          }

          // 2. Try Custom Backend as fallback
          try {
            const info = await apiClient.getLocationInfo(latitude, longitude);
            if (!info.city) throw new Error('Backend returned empty city');

            resolve({
              latitude,
              longitude,
              city: info.city,
              country: info.country || '',
              address: info.address
            });
          } catch (error) {
            console.warn('Custom Backend geocoding failed', error);
            // 3. Reject so the LocationService moves to the IP Strategy
            reject(new Error('All GPS reverse geocoding failed'));
          }
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  }
}

/**
 * Strategy 2: IP-Based Location (Low Accuracy, No Permission)
 * Useful as a fallback.
 */
class IpLocationStrategy implements LocationStrategy {
  name: LocationStrategyType = 'ip';

  async getLocation(): Promise<UserLocation> {
    try {
      // Using a public IP-to-Geo API
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('IP Location failed');
      const data = await response.json();

      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city || 'Unknown City',
        country: data.country_name || '',
      };
    } catch (error) {
      console.error('IP Strategy failed', error);
      // Final fallback if everything fails
      return {
        latitude: 0,
        longitude: 0,
        city: 'Earth',
        country: '',
      };
    }
  }
}

// --- Main Service ---

class LocationService {
  private strategies: Record<LocationStrategyType, LocationStrategy>;
  private preferredOrder: LocationStrategyType[];

  constructor() {
    this.strategies = {
      gps: new BrowserGeolocationStrategy(),
      ip: new IpLocationStrategy(),
      manual: { 
        name: 'manual', 
        getLocation: () => Promise.reject('Manual selection not implemented') 
      }
    };
    
    // Configuration: Try GPS first, then IP
    this.preferredOrder = ['gps', 'ip'];
  }

  setStrategyOrder(order: LocationStrategyType[]) {
    this.preferredOrder = order;
  }

  async getCurrentLocation(): Promise<UserLocation> {
    for (const strategyName of this.preferredOrder) {
      const strategy = this.strategies[strategyName];
      try {
        const location = await strategy.getLocation();
        return location;
      } catch {
        console.log(`Strategy ${strategyName} failed, trying next...`);
        // Continue to next strategy
      }
    }
    throw new Error('All location strategies failed');
  }
}

export const locationService = new LocationService();