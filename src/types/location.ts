export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  address?: string;
}

export type LocationStrategyType = 'gps' | 'ip' | 'manual';

export interface LocationStrategy {
  name: LocationStrategyType;
  getLocation(): Promise<UserLocation>;
}