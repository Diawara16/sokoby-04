import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  [key: string]: boolean;
}

interface ErrorState {
  [key: string]: string | null;
}

interface AppState {
  loading: LoadingState;
  errors: ErrorState;
  lastUpdated: {
    [key: string]: number;
  };
}

const initialState: AppState = {
  loading: {},
  errors: {},
  lastUpdated: {},
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.isLoading;
    },
    setError: (state, action: PayloadAction<{ key: string; error: string | null }>) => {
      state.errors[action.payload.key] = action.payload.error;
    },
    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },
    updateCache: (state, action: PayloadAction<{ key: string; timestamp: number }>) => {
      state.lastUpdated[action.payload.key] = action.payload.timestamp;
    },
    clearCache: (state, action: PayloadAction<string>) => {
      delete state.lastUpdated[action.payload];
    },
  },
});

export const { setLoading, setError, clearError, updateCache, clearCache } = appStateSlice.actions;
export default appStateSlice.reducer;