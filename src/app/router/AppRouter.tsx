import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "../../core/hooks/useAppDispatch";
import { useAppSelector } from "../../core/hooks/useAppSelector";
import { restoreSession } from "../../modules/auth/redux/authSlice";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsInitialized,
} from "../../modules/auth/redux/authSelectors";
import { ProtectedRoute } from "./ProtectedRoute";
import { authRoutes } from "../../modules/auth/routes/AuthRoutes";
import { AuthGate } from "./AuthGate";

function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <span style={{ color: "var(--color-neutral-400)", fontSize: 14 }}>
        Loading…
      </span>
    </div>
  );
}

function RootRedirect() {
  const isInitialized = useAppSelector(selectIsInitialized);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  if (!isInitialized) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const dashboards = {
    ADMIN: "/admin/dashboard",
    TEACHER: "/teacher/dashboard",
    STUDENT: "/student/dashboard",
  };
  return <Navigate to={dashboards[user!.role]} replace />;
}

export function AppRouter() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AuthGate>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<RootRedirect />} />

            {authRoutes}

            {/* ── Admin (protected) ─────────────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              {/* <Route path="admin/*" element={<AdminShell />} /> */}
              <Route
                path="admin/*"
                element={
                  <div style={{ padding: 32 }}>
                    Admin shell — coming in Sprint 2
                  </div>
                }
              />
            </Route>

            {/* ── Teacher (protected) ───────────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
              {/* <Route path="teacher/*" element={<TeacherShell />} /> */}
              <Route
                path="teacher/*"
                element={
                  <div style={{ padding: 32 }}>
                    Teacher shell — coming in Sprint 2
                  </div>
                }
              />
            </Route>

            {/* ── Student (protected) ───────────────────────────── */}
            <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
              {/* <Route path="student/*" element={<StudentShell />} /> */}
              <Route
                path="student/*"
                element={
                  <div style={{ padding: 32 }}>
                    Student shell — coming in Sprint 2
                  </div>
                }
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
