import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarCollapsed: boolean;
  dashboardPage: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: true,
  dashboardPage: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    collapseSidebar: (state) => {
      state.sidebarCollapsed = true;
    },
    expandSidebar: (state) => {
      state.sidebarCollapsed = false;
    },
    setDashboardPage: (state, action: PayloadAction<boolean>) => {
      state.dashboardPage = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  collapseSidebar,
  expandSidebar,
  setDashboardPage,
} = uiSlice.actions;
export default uiSlice.reducer;
