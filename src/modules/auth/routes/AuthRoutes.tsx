import { Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import { useAppSelector } from "../../../core/hooks/useAppSelector";
import { selectIsAuthenticated, selectUser } from "../redux/authSelectors";
import type { Role } from "../types/auth";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import AuthLayout from "@/app/layouts/AuthLayout";

function NoAuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  if (isAuthenticated && user) {
    const dashboards: Record<Role, string> = {
      ADMIN: "/admin/dashboard",
      TEACHER: "/teacher/dashboard",
      STUDENT: "/student/dashboard",
    };
    return <Navigate to={dashboards[user.role as Role]} replace />;
  }

  return <>{children}</>;
}

export const authRoutes = (
  <Route path="auth">
    <Route index element={<Navigate to="login" replace />} />
    <Route
      element={
        <NoAuthGuard>
          <AuthLayout />
        </NoAuthGuard>
      }
    >
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Route>
  </Route>
);
