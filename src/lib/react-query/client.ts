// src/lib/react-query/client.ts
import { QueryClient, MutationCache, QueryCache } from '@tanstack/react-query';
import { i18nErrorHandler } from '../../utils/i18nErrorHandler';
import i18n from '../../i18n';

// Global error handler hooked into your existing i18n system
const handleError = (error: unknown) => {
  i18nErrorHandler.showErrorToUser(
    error,
    { component: 'GlobalQuery', action: 'fetch' },
    [],
    i18n.t.bind(i18n)
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      retry: 1, // Retry once on failure
      refetchOnWindowFocus: false, // Optional: customize based on UX preference
    },
  },
  // Hook into your existing Snackbar/Error handling context
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: handleError,
  }),
});