import type { RootState } from "../../../app/store/store";

export const selectSidebarCollapsed = (state: RootState) =>
  state.ui.sidebarCollapsed;

export const selectDashboardPage = (state: RootState) => state.ui.dashboardPage;
