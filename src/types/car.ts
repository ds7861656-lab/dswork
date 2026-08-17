// src/types/car.ts

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: 'Sedan' | 'SUV' | 'Van' | 'Electric' | 'Luxury' | 'Compact';
  seats: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  images: string[];
  features: string[];
  location: string;
  availability: boolean;
  description: string;
  specifications: {
    mileage: string;
    engineSize: string;
    luggage: number;
    doors: number;
  };
  insurance: {
    basic: number;
    premium: number;
  };
  hostName?: string;
  hostImage?: string;
  cancellationPolicy?: string;
}

export interface CarSearchParams {
  location: string;
  pickupDate: Date | null;
  dropoffDate: Date | null;
  pickupTime: string;
  dropoffTime: string;
}

export interface CarFilters {
  type?: string[];
  transmission?: string[];
  seats?: number[];
  priceRange?: [number, number];
  fuelType?: string[];
  rating?: number;
}
