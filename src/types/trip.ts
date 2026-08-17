export interface TripSettings {
  destination: string;
  duration: number; // in days
  budget: number;
  travelers: number;
  preferences: string[]; // e.g., ['adventure', 'relaxation']
  vehicle: 'car' | 'bike';
}

export interface RouteInfo {
  distance: number; // in km
  duration: number; // in minutes
  distanceText: string; // e.g., "150 km"
  durationText: string; // e.g., "2h 30min"
}

export interface TripStop {
  name: string;
  lat: number;
  lng: number;
  type: string; // e.g., "museum", "park", "restaurant"
  rating?: number;
  photos?: string[];
  description?: string;
}

export interface GeneratedTrip {
  route: RouteInfo;
  stops: TripStop[];
  departure: {
    city: string;
    lat: number;
    lng: number;
  };
  destination: {
    city: string;
    lat: number;
    lng: number;
  };
}


export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  category: string; // e.g., 'attraction', 'restaurant'
  image?: string; // URL to touristic image
}

export interface WeatherDay {
  date: string;
  temp: number;
  condition: string;
}

export interface ClothingSuggestion {
  name: string;
  icon: string; // SVG string for the clothing icon
}

export interface Weather {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  forecast: WeatherDay[];
  clothing?: ClothingSuggestion[]; // add this line
}

export interface Route {
  waypoints: { lat: number; lng: number }[];
  distance: number; // in km
  duration: number; // in minutes
}

export interface Trip {
  id: string;
  settings: TripSettings;
  places: Place[];
  route: Route;
  weather: Weather;
  createdAt: Date;
}