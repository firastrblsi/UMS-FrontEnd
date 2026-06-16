import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "../../core/hooks/useAppDispatch";
import { useAppSelector } from "../../core/hooks/useAppSelector";
import { restoreSession } from "../../modules/auth/redux/authSlice";
import {
  selectIsAuthenticated,
  selectIsInitialized,
  selectUser,
} from "../../modules/auth/redux/authSelectors";
import { ProtectedRoute } from "./ProtectedRoute";
import { authRoutes } from "../../modules/auth/routes/AuthRoutes";
import { AuthGate } from "./AuthGate";
import AuthLayout from "@/app/layouts/AuthLayout";
import Loader from "@/shared/ui/Loader";
import Activate from "@/modules/auth/pages/Activate";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "@/modules/dashboard/pages/Dashboard";
import Departments from "@/modules/structure/pages/Departments";
import Teachers from "@/modules/teachers/pages/Teachers";
import Students from "@/modules/students/pages/Students";
import Programs from "@/modules/structure/pages/Programs";
import Rooms from "@/modules/structure/pages/Rooms";
import Settings from "@/modules/dashboard/pages/Settings";

function NoAuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  if (isAuthenticated && user) {
    const dashboards: Record<string, string> = {
      ADMIN: "/dashboard",
      TEACHER: "/attendance",
      STUDENT: "/my-grades",
    };
    return <Navigate to={dashboards[user.role] || "/dashboard"} replace />;
  }

  return <>{children}</>;
}

function RootRedirect() {
  const isInitialized = useAppSelector(selectIsInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (!isInitialized) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <Navigate to="/dashboard" replace />;
}

export function AppRouter() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AuthGate>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            {authRoutes}
            <Route element={<NoAuthGuard><AuthLayout /></NoAuthGuard>}>
              <Route path="/activate" element={<Activate />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/requests"
                  element={<div className="p-8">Requests — Sprint 4</div>}
                />
                <Route
                  path="/profile"
                  element={<div className="p-8">Profile</div>}
                />
                <Route
                  path="/settings"
                  element={<Settings />}
                />

                <Route
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]} />
                  }
                >
                  <Route
                    path="/attendance"
                    element={<div className="p-8">Attendance — Sprint 3</div>}
                  />
                  <Route
                    path="/grades"
                    element={<div className="p-8">Grades — Sprint 4</div>}
                  />
                  <Route
                    path="/timetable"
                    element={<div className="p-8">Timetable — Sprint 3</div>}
                  />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                  <Route path="/students" element={<Students />} />
                  <Route path="/teachers" element={<Teachers />} />

                  <Route
                    path="/students/:id"
                    element={
                      <div className="p-8">Student detail — Sprint 2</div>
                    }
                  />
                  <Route
                    path="/courses"
                    element={<div className="p-8">Courses — Sprint 2</div>}
                  />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route
                    path="/finance"
                    element={<div className="p-8">Finance — Sprint 4</div>}
                  />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
                  <Route
                    path="/my-grades"
                    element={<div className="p-8">My grades — Sprint 4</div>}
                  />
                  <Route
                    path="/my-attendance"
                    element={
                      <div className="p-8">My attendance — Sprint 3</div>
                    }
                  />
                  <Route
                    path="/my-finance"
                    element={<div className="p-8">My finance — Sprint 4</div>}
                  />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthGate>
    </BrowserRouter>
  );
}
