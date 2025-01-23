import { DefaultOptions } from '@tanstack/react-query';
import { useErrorHandler } from './useErrorHandler';

export const useQueryConfig = () => {
  const { handleError } = useErrorHandler();

  const defaultOptions: DefaultOptions = {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      meta: {
        errorHandler: handleError,
      },
    },
    mutations: {
      meta: {
        errorHandler: handleError,
      },
    },
  };

  return defaultOptions;
};