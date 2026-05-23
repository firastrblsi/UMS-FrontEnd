import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store/store";

// ── Primitive selectors (no memoization needed — just field access) ─

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsInitialized = (state: RootState) =>
  state.auth.isInitialized;
// ── Derived selectors (memoized) ──────────────────────────────────

export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role ?? null,
);

export const selectUserFullName = createSelector(selectUser, (user) =>
  user ? `${user.firstName} ${user.lastName}` : "",
);

export const selectUserInitials = createSelector(selectUser, (user) => {
  if (!user) return "";
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
});

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === "ADMIN",
);
export const selectIsTeacher = createSelector(
  selectUserRole,
  (role) => role === "TEACHER",
);
export const selectIsStudent = createSelector(
  selectUserRole,
  (role) => role === "STUDENT",
);
