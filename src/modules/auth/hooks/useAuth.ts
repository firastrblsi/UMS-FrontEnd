import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../core/hooks/useAppDispatch";
import { useAppSelector } from "../../../core/hooks/useAppSelector";
import { login as loginThunk, clearError } from "../redux/authSlice";
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
  selectUserFullName,
  selectUserInitials,
  selectIsAdmin,
  selectIsTeacher,
  selectIsStudent,
} from "../redux/authSelectors";
import type { Role } from "../types/auth";

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────────
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const role = useAppSelector(selectUserRole);
  const fullName = useAppSelector(selectUserFullName);
  const initials = useAppSelector(selectUserInitials);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isTeacher = useAppSelector(selectIsTeacher);
  const isStudent = useAppSelector(selectIsStudent);

  // ── Actions ──────────────────────────────────────────────────

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await dispatch(loginThunk({ email, password }));

      if (loginThunk.fulfilled.match(result)) {
        const userRole: Role = result.payload.user.role;
        const dashboards: Record<Role, string> = {
          ADMIN: "/admin/dashboard",
          TEACHER: "/teacher/dashboard",
          STUDENT: "/student/dashboard",
        };
        navigate(dashboards[userRole], { replace: true });
      }
    },
    [dispatch, navigate],
  );

  const dismissError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    // state
    user,
    isAuthenticated,
    isLoading,
    error,
    role,
    fullName,
    initials,
    isAdmin,
    isTeacher,
    isStudent,
    // actions
    login,
    dismissError,
  };
}
