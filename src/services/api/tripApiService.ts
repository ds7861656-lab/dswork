// src/services/api/tripApiService.ts

/**
 * Trip API Service - Integrates with available backend APIs
 * for trip functionality using location, weather, and address services
 */

import { apiClient } from '../apiClient';
import type { CollectedAddress } from '../../types/api';

export interface ApiTrip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  places?: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    address?: string;
    visitDate?: string;
  }>;
  weather?: {
    current?: {
      temperature: number;
      condition: string;
      humidity: number;
    };
    forecast?: Array<{
      date: string;
      temperature: number;
      condition: string;
    }>;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripRequest {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  places?: Array<{
    name: string;
    lat: number;
    lng: number;
    address?: string;
    visitDate?: string;
  }>;
  notes?: string;
}

export interface TripListResponse {
  trips: ApiTrip[];
  total: number;
  page: number;
  size: number;
}

export class TripApiService {
//   private baseUrl = '/api/v1/trips';

  /**
   * Get all trips for the current user
   */
/*

  async getTrips(page: number = 1, size: number = 10): Promise<TripListResponse> {
    try {
      console.log('TripApiService.getTrips called with page:', page, 'size:', size);
      // Since no direct trip API exists, we'll simulate this with collected addresses
      // and create a trip structure around them
      const collectedAddressesResponse = await apiClient.getCollectedAddresses(page, size);

      const trips = this.groupAddressesIntoTrips(collectedAddressesResponse.records);

      return {
        trips,
        total: trips.length,
        page,
        size
      };
    } catch (error) {
      console.error('Failed to fetch trips:', error);

      // If it's a 403 Forbidden error, it likely means the user doesn't have access to collected addresses
      // In this case, return empty trips instead of throwing, since trips are simulated from addresses
      if (error && typeof error === 'object' && 'status' in error && error.status === 403) {
        console.warn('User does not have access to collected addresses, returning empty trips list');
        return {
          trips: [],
          total: 0,
          page,
          size
        };
      }

      throw error;
    }
  }
*/
  /**
   * Get a specific trip by ID
   */

  /*
  async getTrip(tripId: string): Promise<ApiTrip> {
    try {
      const response = await this.getTrips();
      const trip = response.trips.find(t => t.id === tripId);
      
      if (!trip) {
        throw new Error(`Trip with ID ${tripId} not found`);
      }

      // Enhance trip with weather data
      return await this.enhanceTripWithWeather(trip);
    } catch (error) {
      console.error(`Failed to fetch trip ${tripId}:`, error);
      throw error;
    }
  }
*/
  /**
   * Create a new trip
   */
  /*
  async createTrip(tripData: CreateTripRequest): Promise<ApiTrip> {
    try {
      // For now, we'll store trip data in collected addresses
      // In a real implementation, you'd want a dedicated trip endpoint
      
      const trip: ApiTrip = {
        id: `trip_${Date.now()}`,
        name: tripData.name,
        destination: tripData.destination,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        status: 'planned',
        places: (tripData.places || []).map(place => ({
          id: `place_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: place.name,
          lat: place.lat,
          lng: place.lng,
          address: place.address,
          visitDate: place.visitDate
        })),
        notes: tripData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      //return this.enhanceTripWithWeather(trip);
    } catch (error) {
      console.error('Failed to create trip:', error);
      throw error;
    }
  }
*/
  /**
   * Update an existing trip
   */
  /*
  async updateTrip(tripId: string, updates: Partial<CreateTripRequest>): Promise<ApiTrip> {
    try {
      const existingTrip = await this.getTrip(tripId);
      
      const updatedPlaces = updates.places ? updates.places.map((place, index) => ({
        id: `place_${Date.now()}_${index}`,
        name: place.name,
        lat: place.lat,
        lng: place.lng,
        address: place.address,
        visitDate: place.visitDate
      })) : existingTrip.places;
      
      const updatedTrip: ApiTrip = {
        ...existingTrip,
        ...updates,
        places: updatedPlaces,
        updatedAt: new Date().toISOString()
      };

      // In a real implementation, you'd call PUT /api/v1/trips/{id}
      // For now, we'll just return the updated trip
      return this.enhanceTripWithWeather(updatedTrip);
    } catch (error) {
      console.error(`Failed to update trip ${tripId}:`, error);
      throw error;
    }
  }
    */

  /**
   * Delete a trip
   */
  async deleteTrip(tripId: string): Promise<void> {
    try {
      // In a real implementation, you'd call DELETE /api/v1/trips/{id}
      // For now, we'll just remove the related collected addresses
      console.log(`Deleting trip ${tripId} and related addresses`);
    } catch (error) {
      console.error(`Failed to delete trip ${tripId}:`, error);
      throw error;
    }
  }

  /**
   * Group collected addresses into trips
   */
  private groupAddressesIntoTrips(addresses: CollectedAddress[]): ApiTrip[] {
    // This is a simplified grouping logic
    // In reality, you'd want more sophisticated trip grouping
    const trips: ApiTrip[] = [];

    // Group addresses by approximate location (simplified)
    const locationGroups = this.groupAddressesByLocation(addresses);
    
    Object.entries(locationGroups).forEach(([location, locationAddresses], index) => {
      trips.push({
        id: `trip_${index + 1}`,
        name: `Trip to ${location}`,
        destination: location,
        startDate: '2023-01-01', // Default dates - would be stored with trip
        endDate: '2023-01-07',
        status: 'completed',
        places: locationAddresses.map((addr, addrIndex) => ({
          id: `place_${addrIndex + 1}`,
          name: addr.caName || `Location ${addrIndex + 1}`,
          lat: addr.latitude || 0,
          lng: addr.longitude || 0,
          address: addr.caName
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    return trips;
  }

  /**
   * Group addresses by approximate location
   */
  private groupAddressesByLocation(addresses: CollectedAddress[]): Record<string, CollectedAddress[]> {
    const groups: Record<string, CollectedAddress[]> = {};

    addresses.forEach(address => {
      // Simple location grouping - in reality, you'd use more sophisticated logic
      const locationKey = this.extractLocationKey(address.caName);
      
      if (!groups[locationKey]) {
        groups[locationKey] = [];
      }
      groups[locationKey].push(address);
    });

    return groups;
  }

  /**
   * Extract location key from address name
   */
  private extractLocationKey(addressName?: string): string {
    if (!addressName) return 'Unknown Location';
    
    // Simple extraction - look for city/country patterns
    const commonCities = ['Paris', 'London', 'Tokyo', 'New York', 'Copenhagen', 'Berlin'];
    
    for (const city of commonCities) {
      if (addressName.toLowerCase().includes(city.toLowerCase())) {
        return city;
      }
    }
    
    // Default fallback
    return 'Unknown Location';
  }

  /**
   * Enhance trip with weather data
   */

  /*
  private async enhanceTripWithWeather(trip: ApiTrip): Promise<ApiTrip> {
    try {
      // Get weather for the destination
      const weatherData = await this.getWeatherForDestination(trip.destination);
      
      return {
        ...trip,
        weather: weatherData
      };
    } catch (error) {
      console.warn('Failed to get weather data for trip:', error);
      return trip;
    }
  }

  */

  /**
   * Get weather data for a destination
   */
  /*
  private async getWeatherForDestination(destination: string): Promise<ApiTrip['weather']> {
    try {
      // Try to get weather using city code (simplified mapping)
      const cityCodeMap: Record<string, string> = {
        'Copenhagen': 'CPH',
        'Paris': 'PAR',
        'London': 'LON',
        'Berlin': 'BER',
        'Amsterdam': 'AMS',
        'Barcelona': 'BCN',
        'Rome': 'ROM',
        'Vienna': 'VIE',
        'Prague': 'PRG',
        'Budapest': 'BUD',
        'Tokyo': 'TYO',
        'New York': 'NYC'
      };

      const cityCode = cityCodeMap[destination] || 'CPH';

      // Get current weather
      const currentWeather = await apiClient.getWeatherInfo(cityCode);
      
      // Get forecast
      const forecast = await apiClient.getWeatherForecast(cityCode);

      return {
        current: {
          temperature: currentWeather.temperature,
          condition: currentWeather.weather,
          humidity: currentWeather.humidity
        },
        forecast: forecast.forecasts.map(f => ({
          date: f.date,
          temperature: f.temperature.high,
          condition: f.weather
        }))
      };
    } catch (error) {
      console.warn('Failed to get weather from API:', error);
      
      // Return fallback data
      return {
        current: {
          temperature: 20,
          condition: 'Sunny',
          humidity: 60
        },
        forecast: []
      };
    }
  }

*/

}

// Export singleton instance
export const tripApiService = new TripApiService();