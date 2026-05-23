import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../core/hooks/useAppSelector";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../modules/auth/redux/authSelectors";
import type { Role } from "../../modules/auth/types/auth";

interface Props {
  allowedRoles?: Role[];
}

export function ProtectedRoute({ allowedRoles }: Props) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const dashboardByRole: Record<Role, string> = {
      ADMIN: "/admin/dashboard",
      TEACHER: "/teacher/dashboard",
      STUDENT: "/student/dashboard",
    };
    return <Navigate to={dashboardByRole[user.role]} replace />;
  }

  return <Outlet />;
}
