import { useQuery } from '@tanstack/react-query';
import { locationService } from '../services/locationService';
import type { UserLocation } from '../types/location';

export const useCurrentLocation = () => {
  const {
    data: location,
    isLoading: loading,
    error,
  } = useQuery<UserLocation>({
    queryKey: ['currentLocation'],
    queryFn: () => locationService.getCurrentLocation(),
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });

  return {
    location,
    loading,
    error: error ? (error as Error).message : null,
  };
};