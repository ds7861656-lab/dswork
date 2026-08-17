// src/components/trip/GoogleTripMap.tsx
// ✅ FIXED: Centers on current location, better re-rendering

import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import type { RouteInfo, TripStop } from '../../types/trip';

interface GoogleTripMapProps {
  departureCoords: { lat: number; lng: number } | null;
  destinationCoords: { lat: number; lng: number } | null;
  transport: 'car' | 'bike';
  tripType: 'one' | 'return';
  interests: string[];
  isGenerating: boolean;
  onRouteCalculated: (info: RouteInfo, stops: TripStop[]) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 39.9042, // Beijing
  lng: 116.4074
};

const GoogleTripMap: React.FC<GoogleTripMapProps> = ({
  departureCoords,
  destinationCoords,
  transport,
  tripType,
  interests,
  isGenerating,
  onRouteCalculated
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [placesMarkers, setPlacesMarkers] = useState<TripStop[]>([]);
  const [center, setCenter] = useState(defaultCenter);
  const hasCalculatedRoute = useRef(false);

  // Update center when departure coordinates change
  useEffect(() => {
    if (departureCoords) {
      console.log('🗺️ Centering map on:', departureCoords);
      setCenter(departureCoords);
    }
  }, [departureCoords]);

  // Calculate route when coordinates change and isGenerating is true
  useEffect(() => {
    if (!departureCoords || !destinationCoords || !isGenerating || hasCalculatedRoute.current) {
      return;
    }

    console.log('🚗 Calculating route from', departureCoords, 'to', destinationCoords);

    const calculateRoute = async () => {
      const directionsService = new google.maps.DirectionsService();
      
      try {
        const result = await directionsService.route({
          origin: departureCoords,
          destination: destinationCoords,
          travelMode: transport === 'car' 
            ? google.maps.TravelMode.DRIVING 
            : google.maps.TravelMode.BICYCLING,
        });

        console.log('✅ Route calculated:', result);
        setDirectionsResponse(result);
        hasCalculatedRoute.current = true;

        // Extract route info
        const leg = result.routes[0].legs[0];
        const routeInfo: RouteInfo = {
          distance: (leg.distance?.value || 0) / 1000, // Convert to km
          duration: Math.round((leg.duration?.value || 0) / 60), // Convert to minutes
          distanceText: leg.distance?.text || '0 km',
          durationText: leg.duration?.text || '0 min'
        };

        console.log('📊 Route info:', routeInfo);

        // Find places along the route
        if (map) {
          await findPlacesAlongRoute(result.routes[0], routeInfo);
        } else {
          // No places found, still return route info
          onRouteCalculated(routeInfo, []);
        }
        
      } catch (error) {
        console.error('❌ Error calculating route:', error);
        hasCalculatedRoute.current = false;
      }
    };

    calculateRoute();
  }, [departureCoords, destinationCoords, transport, isGenerating, map, onRouteCalculated]);

  // Reset route calculation flag when destination changes
  useEffect(() => {
    hasCalculatedRoute.current = false;
  }, [destinationCoords]);

  // Find interesting places along the route
  const findPlacesAlongRoute = async (
    route: google.maps.DirectionsRoute,
    routeInfo: RouteInfo
  ) => {
    if (!map) {
      console.log('⚠️ Map not ready for places search');
      onRouteCalculated(routeInfo, []);
      return;
    }

    const placesService = new google.maps.places.PlacesService(map);
    const stops: TripStop[] = [];

    // Get interest types for Google Places
    const placeTypes = getPlaceTypes(interests);
    
    console.log('🔍 Searching for places of type:', placeTypes);
    
    // Sample points along the route (every 20% of the route)
    const path = route.overview_path;
    const sampleIndices = [
      Math.floor(path.length * 0.2),
      Math.floor(path.length * 0.4),
      Math.floor(path.length * 0.6),
      Math.floor(path.length * 0.8)
    ];

    for (const index of sampleIndices) {
      const point = path[index];
      
      for (const placeType of placeTypes.slice(0, 2)) { // Max 2 types to avoid too many requests
        try {
          const results = await searchNearbyPlaces(placesService, point, placeType);
          
          if (results && results.length > 0) {
            const place = results[0]; // Take first result
            stops.push({
              name: place.name || 'Unknown Place',
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
              type: placeType,
              rating: place.rating,
              photos: place.photos?.slice(0, 1).map(photo => photo.getUrl()) || []
            });
            break; // Found a place at this point, move to next point
          }
        } catch (error) {
          console.error('❌ Error searching places:', error);
        }
      }
    }

    console.log('✅ Found', stops.length, 'stops along route');
    setPlacesMarkers(stops);
    onRouteCalculated(routeInfo, stops);
  };

  // Search nearby places at a specific location
  const searchNearbyPlaces = (
    service: google.maps.places.PlacesService,
    location: google.maps.LatLng,
    type: string
  ): Promise<google.maps.places.PlaceResult[]> => {
    return new Promise((resolve, reject) => {
      service.nearbySearch(
        {
          location,
          radius: 5000, // 5km radius
          type: type as any
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(status);
          }
        }
      );
    });
  };

  // Map interest categories to Google Places types
  const getPlaceTypes = (interests: string[]): string[] => {
    const typeMap: Record<string, string[]> = {
      outdoorsSport: ['park', 'natural_feature', 'campground'],
      cultureMuseum: ['museum', 'art_gallery', 'tourist_attraction'],
      fjordsMountains: ['natural_feature', 'park', 'point_of_interest']
    };

    const types = new Set<string>();
    interests.forEach(interest => {
      const mappedTypes = typeMap[interest] || [];
      mappedTypes.forEach(type => types.add(type));
    });

    return Array.from(types);
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('✅ Map loaded');
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    console.log('🗺️ Map unmounted');
    setMap(null);
  }, []);

  // Fit bounds to show entire route
  useEffect(() => {
    if (map && directionsResponse) {
      const bounds = new google.maps.LatLngBounds();
      directionsResponse.routes[0].legs[0].steps.forEach(step => {
        bounds.extend(step.start_location);
        bounds.extend(step.end_location);
      });
      map.fitBounds(bounds);
      console.log('🔍 Fitted map bounds to route');
    }
  }, [map, directionsResponse]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      }}
    >
      {/* Departure Marker */}
      {departureCoords && (
        <Marker
          position={departureCoords}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
          }}
          label={{
            text: 'A',
            color: 'white',
            fontWeight: 'bold'
          }}
          title="Departure"
        />
      )}

      {/* Destination Marker */}
      {destinationCoords && (
        <Marker
          position={destinationCoords}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }}
          label={{
            text: 'B',
            color: 'white',
            fontWeight: 'bold'
          }}
          title="Destination"
        />
      )}

      {/* Route Polyline */}
      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{
            polylineOptions: {
              strokeColor: '#0d9488', // Teal color
              strokeWeight: 5,
              strokeOpacity: 0.8
            },
            suppressMarkers: true, // We use custom markers
          }}
        />
      )}

      {/* Places Markers */}
      {placesMarkers.map((stop, index) => (
        <Marker
          key={index}
          position={{ lat: stop.lat, lng: stop.lng }}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }}
          title={stop.name}
        />
      ))}
    </GoogleMap>
  );
};

export default GoogleTripMap;
