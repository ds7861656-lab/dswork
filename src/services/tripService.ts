// src/services/tripService.ts

/**
 * TRIP SERVICE - Backend Integration for Trip Planning
 *
 * This service integrates with backend APIs to provide real trip planning functionality
 * using location, weather, and address services.
 */

import { apiClient } from './apiClient';
import type { TripSettings, Trip, Place, Weather, Route } from '../types/trip';

export class TripService {
  /**
   * Generate a trip using backend location and weather services
   */


  /**
   * Get weather data for a destination
   */
static async getWeatherForDestination(location: string): Promise<Weather> {
  return {
    location,
    temperature: 24,
    condition: 'Sunny',
    humidity: 60,

    forecast: [
      { date: 'Mon', temp: 24, condition: 'Sunny' },
      { date: 'Tue', temp: 22, condition: 'Cloudy' },
      { date: 'Wed', temp: 26, condition: 'Sunny' }
    ]
  };
}



 async getWeatherData(location: string): Promise<Weather> {
  return TripService.getWeatherForDestination(location);
}

  /**
   * Generate places based on trip settings and interests
   */
  private async generatePlaces(settings: TripSettings): Promise<Place[]> {
    const places: Place[] = [];
    const { preferences, destination } = settings;

    // Base coordinates for different cities (simplified)
    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
      'Copenhagen': { lat: 55.6761, lng: 12.5683 },
      'Paris': { lat: 48.8566, lng: 2.3522 },
      'London': { lat: 51.5074, lng: -0.1278 },
      'Berlin': { lat: 52.5200, lng: 13.4050 },
      'Amsterdam': { lat: 52.3676, lng: 4.9041 },
      'Barcelona': { lat: 41.3851, lng: 2.1734 },
      'Rome': { lat: 41.9028, lng: 12.4964 },
      'Vienna': { lat: 48.2082, lng: 16.3738 },
      'Prague': { lat: 50.0755, lng: 14.4378 },
      'Budapest': { lat: 47.4979, lng: 19.0402 },
    };

    const baseCoords = cityCoordinates[destination] || cityCoordinates['Copenhagen'];

    // Generate places based on interests
    const interestPlaceMap: Record<string, Array<{ name: string; description: string; category: Place['category'] }>> = {
      'outdoorsSport': [
        { name: 'Central Park', description: 'Beautiful park perfect for outdoor activities', category: 'park' },
        { name: 'City Beach', description: 'Urban beach area for sports and relaxation', category: 'beach' },
        { name: 'Mountain Trail', description: 'Scenic hiking trail with city views', category: 'nature' },
      ],
      'cultureMuseum': [
        { name: 'National Museum', description: 'World-class museum showcasing local history', category: 'museum' },
        { name: 'Art Gallery', description: 'Contemporary art collection', category: 'museum' },
        { name: 'Historic Cathedral', description: 'Ancient cathedral with stunning architecture', category: 'attraction' },
      ],
      'fjordsMountains': [
        { name: 'Mountain Viewpoint', description: 'Panoramic mountain views', category: 'nature' },
        { name: 'Lake District', description: 'Scenic lake area for outdoor activities', category: 'nature' },
        { name: 'Valley Trail', description: 'Beautiful valley hiking trail', category: 'nature' },
      ],
    };

    let selectedPlaces: Array<{ name: string; description: string; category: Place['category'] }> = [];

    // Collect places based on selected interests
    preferences.forEach(interest => {
      const placesForInterest = interestPlaceMap[interest as keyof typeof interestPlaceMap] || [];
      selectedPlaces = selectedPlaces.concat(placesForInterest);
    });

    // If no interests selected, use defaults
    if (selectedPlaces.length === 0) {
      selectedPlaces = [
        ...interestPlaceMap['outdoorsSport'].slice(0, 1),
        ...interestPlaceMap['cultureMuseum'].slice(0, 1),
        ...interestPlaceMap['fjordsMountains'].slice(0, 1),
      ];
    }

    // Limit to reasonable number and shuffle
    const shuffledPlaces = selectedPlaces.sort(() => 0.5 - Math.random());
    const finalPlaces = shuffledPlaces.slice(0, Math.min(6, shuffledPlaces.length));

    // Convert to Place objects with coordinates
    finalPlaces.forEach((place, index) => {
      const latOffset = (Math.random() - 0.5) * 0.02; // ±0.01 degrees
      const lngOffset = (Math.random() - 0.5) * 0.02;

      places.push({
        id: `place_${index + 1}`,
        name: place.name,
        lat: baseCoords.lat + latOffset,
        lng: baseCoords.lng + lngOffset,
        description: place.description,
        category: place.category,
        image: `https://picsum.photos/400/300?random=${index + 1}`,
      });
    });

    return places;
  }

  /**
   * Calculate a simple route between places
   */
  private calculateRoute(places: Place[]): Route {
    if (places.length < 2) {
      return {
        waypoints: places.map(p => ({ lat: p.lat, lng: p.lng })),
        distance: 0,
        duration: 0,
      };
    }

    let totalDistance = 0;
    const waypoints = places.map(p => ({ lat: p.lat, lng: p.lng }));

    // Calculate distances between consecutive points
    for (let i = 1; i < waypoints.length; i++) {
      const prev = waypoints[i - 1];
      const curr = waypoints[i];
      const distance = this.calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
      totalDistance += distance;
    }

    // Assume average speed of 15 km/h for walking/biking
    const duration = Math.round((totalDistance / 15) * 60); // in minutes

    return {
      waypoints,
      distance: Math.round(totalDistance * 10) / 10,
      duration,
    };
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get weather forecast for a location
   */


  /**
   * Get weather data for a location (public method)
   */


  /**
   * Get location information from coordinates
   */


}

// Export singleton instance
export const tripService = new TripService();