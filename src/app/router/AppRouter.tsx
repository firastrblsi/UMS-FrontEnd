import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "../../core/hooks/useAppDispatch";
import { useAppSelector } from "../../core/hooks/useAppSelector";
import { restoreSession } from "../../modules/auth/redux/authSlice";
import {
  selectIsAuthenticated,
  selectIsInitialized,
} from "../../modules/auth/redux/authSelectors";
import { ProtectedRoute } from "./ProtectedRoute";
import { authRoutes } from "../../modules/auth/routes/AuthRoutes";
import { AuthGate } from "./AuthGate";
import Loader from "@/shared/ui/Loader";

function RootRedirect() {
  const isInitialized = useAppSelector(selectIsInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (!isInitialized) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

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

            <Route element={<ProtectedRoute />}>
              {/* Dashboard — every role sees this URL; content differs by role */}
              <Route
                path="/dashboard"
                element={<div className="p-8">Dashboard — Sprint 2</div>}
                // element={<DashboardPage />}
              />

              {/* ── Admin + Teacher only ─────────────────────────── */}
              <Route
                element={<ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]} />}
              >
                <Route
                  path="/attendance"
                  element={<div className="p-8">Attendance — Sprint 3</div>}
                  // element={<AttendancePage />}
                />
                <Route
                  path="/grades"
                  element={<div className="p-8">Grades — Sprint 4</div>}
                  // element={<GradesPage />}
                />
                <Route
                  path="/timetable"
                  element={<div className="p-8">Timetable — Sprint 3</div>}
                  // element={<TimetablePage />}
                />
              </Route>

              {/* ── Admin only ───────────────────────────────────── */}
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route
                  path="/students"
                  element={<div className="p-8">Students — Sprint 2</div>}
                  // element={<StudentsPage />}
                />
                <Route
                  path="/students/:id"
                  element={<div className="p-8">Student detail — Sprint 2</div>}
                />
                <Route
                  path="/courses"
                  element={<div className="p-8">Courses — Sprint 2</div>}
                  // element={<CoursesPage />}
                />
                <Route
                  path="/structure"
                  element={<div className="p-8">Structure — Sprint 2</div>}
                  // element={<StructurePage />}
                />
                <Route
                  path="/finance"
                  element={<div className="p-8">Finance — Sprint 4</div>}
                  // element={<FinancePage />}
                />
              </Route>

              {/* ── Student only ─────────────────────────────────── */}
              <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
                <Route
                  path="/my-grades"
                  element={<div className="p-8">My grades — Sprint 4</div>}
                />
                <Route
                  path="/my-attendance"
                  element={<div className="p-8">My attendance — Sprint 3</div>}
                />
                <Route
                  path="/my-finance"
                  element={<div className="p-8">My finance — Sprint 4</div>}
                />
              </Route>

              {/* ── All authenticated roles ───────────────────────── */}
              <Route
                path="/requests"
                element={<div className="p-8">Requests — Sprint 4</div>}
                // element={<RequestsPage />}
              />
              <Route
                path="/profile"
                element={<div className="p-8">Profile</div>}
              />
            </Route>

            {/* ── 404 ──────────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthGate>
    </BrowserRouter>
  );
}
