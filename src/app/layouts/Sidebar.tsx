import Logo from "../../assets/sesame-logo-min.png";
import sesame from "../../assets/logo-sesame.png";
import {
  House,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Landmark,
  BookOpen,
  Building,
  User,
  Calendar,
  CalendarDays,
  Layers,
  CalendarRange
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "@/core/hooks/useAppDispatch";
import { useAppSelector } from "@/core/hooks/useAppSelector";
import { selectSidebarCollapsed } from "@/core/store/selectors/uiSelectors";
import { toggleSidebar } from "@/core/store/slices/uiSlice";
import { useTranslation } from "react-i18next";
import type { Role } from "@/modules/auth/types/auth";
import { selectUser } from "@/modules/auth/redux/authSelectors";
import { logout } from "@/modules/auth/redux/authSlice";

interface NavItem {
  to: string;
  icon: React.ElementType;
  labelKey: string;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    icon: House,
    labelKey: "routes.dashboard",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    to: "/students",
    icon: Users,
    labelKey: "routes.students",
    roles: ["ADMIN"],
  },
  {
    to: "/teachers",
    icon: GraduationCap,
    labelKey: "routes.teachers",
    roles: ["ADMIN"],
  },
  {
    to: "/departments",
    icon: Landmark,
    labelKey: "routes.departments",
    roles: ["ADMIN"],
  },
  {
    to: "/programs",
    icon: BookOpen,
    labelKey: "routes.programs",
    roles: ["ADMIN"],
  },
  {
    to: "/rooms",
    icon: Building,
    labelKey: "routes.rooms",
    roles: ["ADMIN"],
  },
  {
    to: "/academic-years",
    icon: Calendar,
    labelKey: "routes.academic_years",
    roles: ["ADMIN"],
  },
  {
    to: "/semesters",
    icon: CalendarRange,
    labelKey: "routes.semesters",
    roles: ["ADMIN"],
  },
  {
    to: "/class-groups",
    icon: Layers,
    labelKey: "routes.class_groups",
    roles: ["ADMIN"],
  },
  {
    to: "/holidays",
    icon: CalendarDays,
    labelKey: "routes.holidays",
    roles: ["ADMIN"],
  },
  {
    to: "/profile",
    icon: User,
    labelKey: "routes.my_profile",
    roles: ["TEACHER", "STUDENT", "ADMIN"],
  },
];

const Sidebar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector(selectSidebarCollapsed);
  const user = useAppSelector(selectUser);
  const role = user?.role as Role | undefined;

  const visibleItems = NAV_ITEMS.filter(
    (item) => role && item.roles.includes(role),
  );

  const navLinkClass = (isActive: boolean) =>
    `flex items-center h-10 transition-colors ${
      isCollapsed
        ? "w-10 rounded-full justify-center"
        : "w-56 rounded-lg ps-5"
    } ${
      isActive ? "active-route" : "text-black bg-gray-100 hover:bg-gray-200"
    }`;
  return (
    <div
      className={`border transition-all duration-300 ease-in-out relative py-6 rounded-2xl bg-white flex-col justify-between items-center ${isCollapsed ? "md:w-23 md:flex hidden" : "md:w-70  flex"}`}
    >
      {/* Symmetric Bridge SVG Notch */}
      <div className="absolute -right-[25px] top-1/2 -translate-y-1/2 hidden md:block pointer-events-none z-10">
        <svg width="40" height="64" viewBox="0 0 40 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Fill the symmetric notch background perfectly */}
          <path d="M 15.5 0 L 15.5 8 C 15.5 16, 2 16, 2 32 C 2 48, 15.5 48, 15.5 56 L 15.5 64 L 24.5 64 L 24.5 56 C 24.5 48, 38 48, 38 32 C 38 16, 24.5 16, 24.5 8 L 24.5 0 Z" fill="#f3f4f6" />
          {/* Stroke the left curve */}
          <path d="M 15.5 0 L 15.5 8 C 15.5 16, 2 16, 2 32 C 2 48, 15.5 48, 15.5 56 L 15.5 64" fill="none" stroke="#e5e7eb" strokeWidth="1" />
          {/* Stroke the right curve */}
          <path d="M 24.5 0 L 24.5 8 C 24.5 16, 38 16, 38 32 C 38 48, 24.5 48, 24.5 56 L 24.5 64" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        </svg>
      </div>

      {/* Perfectly Centered Toggle Button */}
      <button
        className="absolute -right-[19px] top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-sm border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors focus:outline-none"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? (
          <ChevronRight size={16} strokeWidth={2.5} className="ml-0.5" />
        ) : (
          <ChevronLeft size={16} strokeWidth={2.5} className="mr-0.5" />
        )}
      </button>

      <div className={`px-1 ${isCollapsed ? "w-[85%]" : "w-[75%]"}`}>
        <img src={isCollapsed ? Logo : sesame} alt="Logo" className="" />
      </div>
      <div className="w-full">
        <ul className="flex flex-col gap-3">
          {visibleItems.map(({ to, icon: Icon, labelKey }) => (
            <li
              key={to}
              className="flex justify-center gap-2 items-center w-full"
            >
              <NavLink
                to={to}
                title={t(labelKey)}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                <Icon size={15} />
                {!isCollapsed && (
                  <span className="text-sm ms-4">{t(labelKey)}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-2 w-full">
        <ul className="flex flex-col gap-3 ">
          <li className="flex justify-center gap-2 items-center w-full">
            <NavLink
              to="/settings"
              title="settings"
              className={({ isActive }) =>
                ` flex items-center   ${isCollapsed ? "w-10 rounded-full justify-center" : "w-56 rounded-lg ps-5"} h-10   transition-colors ${
                  isActive
                    ? "active-route"
                    : "text-black bg-gray-100 hover:bg-gray-200 "
                }`
              }
            >
              <Settings size={15} />
              {!isCollapsed && (
                <span className=" text-sm ms-4">{t("routes.settings")}</span>
              )}
            </NavLink>
          </li>
          <li className="flex justify-center gap-2 items-center w-full">
            <span
              onClick={() => dispatch(logout())}
              className={`flex items-center cursor-pointer  ${isCollapsed ? "w-10 rounded-full justify-center" : "w-56 rounded-lg ps-5"} h-10   transition-colors text-black bg-gray-100 hover:bg-gray-200`}
            >
              <LogOut size={15} />
              {!isCollapsed && (
                <span className="text-sm ms-4">{t("routes.logout")}</span>
              )}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
