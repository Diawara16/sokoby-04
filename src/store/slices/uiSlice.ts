import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: string;
}

const initialState: UIState = {
  isSidebarOpen: false,
  theme: 'light',
  language: 'fr'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    }
  }
});

export const { toggleSidebar, setTheme, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;