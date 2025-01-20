import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { setLoading, setError, clearError, updateCache, clearCache } from '@/store/slices/appStateSlice';
import { useToast } from './use-toast';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

export const useAppState = (key: string) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const isLoading = useAppSelector(state => state.appState.loading[key] ?? false);
  const error = useAppSelector(state => state.appState.errors[key]);
  const lastUpdated = useAppSelector(state => state.appState.lastUpdated[key]);

  const startLoading = useCallback(() => {
    dispatch(setLoading({ key, isLoading: true }));
  }, [dispatch, key]);

  const stopLoading = useCallback(() => {
    dispatch(setLoading({ key, isLoading: false }));
  }, [dispatch, key]);

  const handleError = useCallback((error: any) => {
    const errorMessage = error?.message || 'Une erreur est survenue';
    dispatch(setError({ key, error: errorMessage }));
    toast({
      title: "Erreur",
      description: errorMessage,
      variant: "destructive",
    });
  }, [dispatch, key, toast]);

  const clearCurrentError = useCallback(() => {
    dispatch(clearError(key));
  }, [dispatch, key]);

  const updateCacheTimestamp = useCallback(() => {
    dispatch(updateCache({ key, timestamp: Date.now() }));
  }, [dispatch, key]);

  const isCacheValid = useCallback(() => {
    if (!lastUpdated) return false;
    return Date.now() - lastUpdated < CACHE_DURATION;
  }, [lastUpdated]);

  const clearCacheEntry = useCallback(() => {
    dispatch(clearCache(key));
  }, [dispatch, key]);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    handleError,
    clearError: clearCurrentError,
    isCacheValid,
    updateCache: updateCacheTimestamp,
    clearCache: clearCacheEntry,
  };
};