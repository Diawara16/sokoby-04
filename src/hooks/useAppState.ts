import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { setLoading, setError, clearError } from '@/store/slices/appStateSlice';

export const useAppState = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.appState);

  return {
    isLoading: state.isLoading,
    error: state.error,
    startLoading: () => dispatch(setLoading(true)),
    stopLoading: () => dispatch(setLoading(false)),
    handleError: (error: Error) => dispatch(setError(error.message)),
    clearError: () => dispatch(clearError()),
  };
};