// src/hooks/queries/useUserQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../services/apiClient';
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';
import type { UserDto } from '../../types/api';

// 1. Fetch User Profile
export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: QUERY_KEYS.user.profile(userId || ''),
    queryFn: () => apiClient.getUserInfo(),
    enabled: !!userId,
  });
};

// 2. Mutation: Update User Profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserDto) => apiClient.updateUserProfile(userData),
    onSuccess: () => {
      // Invalidate user profile queries
      queryClient.invalidateQueries({
        queryKey: ['user', 'profile'],
      });
    },
  });
};