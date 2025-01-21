import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

export const useAppState = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.appState.loading);
  const errors = useAppSelector((state) => state.appState.errors);

  const startLoading = (key: string) => 
    dispatch({ type: 'appState/setLoading', payload: { key, isLoading: true } });

  const stopLoading = (key: string) => 
    dispatch({ type: 'appState/setLoading', payload: { key, isLoading: false } });

  const handleError = (key: string, error: Error) => 
    dispatch({ type: 'appState/setError', payload: { key, error: error.message } });

  const clearError = (key: string) => 
    dispatch({ type: 'appState/clearError', payload: { key } });

  return {
    loading,
    errors,
    startLoading,
    stopLoading,
    handleError,
    clearError
  };
};