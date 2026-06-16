import { useAppSelector } from "@/core/hooks/useAppSelector";
import { selectUser } from "@/modules/auth/redux/authSelectors";
import StudentDashboard from "../components/StudentDashboard";
import AdminDashboard from "../components/AdminDashboard";
import TeacherDashboard from "../components/TeacherDashboard";
import { useEffect } from "react";
import { useAppDispatch } from "@/core/hooks/useAppDispatch";
import { setDashboardPage } from "@/core/store/slices/uiSlice";

const DASHBOARD_MAP = {
  ADMIN: <AdminDashboard />,
  TEACHER: <TeacherDashboard />,
  STUDENT: <StudentDashboard />,
} as const;

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const role = user?.role as keyof typeof DASHBOARD_MAP | undefined;

  if (!role || !(role in DASHBOARD_MAP)) return null;
  useEffect(() => {
    dispatch(setDashboardPage(true));

    return () => {
      dispatch(setDashboardPage(false));
    };
  }, []);
  return DASHBOARD_MAP[role];
};

export default Dashboard;
