// src/lib/react-query/queryKeys.ts
export const QUERY_KEYS = {
  subscription: {
    all: ['subscription'] as const,
    plans: () => [...QUERY_KEYS.subscription.all, 'plans'] as const,
    currentUser: (userId: string) => [...QUERY_KEYS.subscription.all, 'user', userId] as const,
    orders: (userId: string) => [...QUERY_KEYS.subscription.all, 'orders', userId] as const,
  },
  user: {
    profile: (userId: string) => ['user', 'profile', userId] as const,
  }
};