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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "@/core/hooks/useAppDispatch";
import { useAppSelector } from "@/core/hooks/useAppSelector";
import { selectSidebarCollapsed } from "@/core/store/selectors/uiSelectors";
import { toggleSidebar } from "@/core/store/slices/uiSlice";
import { useTranslation } from "react-i18next";
import type { Role } from "@/modules/auth/types/auth";
import { selectUser } from "@/modules/auth/redux/authSelectors";

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
        : "w-[90%] rounded-lg ps-5"
    } ${
      isActive ? "active-route" : "text-black bg-gray-100 hover:bg-gray-200"
    }`;
  return (
    <div
      className={`border transition-all duration-300 ease-in-out relative py-6 rounded-2xl bg-white flex-col justify-between items-center ${isCollapsed ? "md:w-23 md:flex hidden" : "md:w-70  flex"}`}
    >
      <div
        className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 hidden md:block"
        onClick={() => dispatch(toggleSidebar())}
      >
        {isCollapsed ? (
          <ChevronRight className="collapse-button" />
        ) : (
          <ChevronLeft className="collapse-button" />
        )}
      </div>

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
                ` flex items-center   ${isCollapsed ? "w-10 rounded-full justify-center" : "w-[90%] rounded-lg ps-5"} h-10   transition-colors ${
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
              className={`flex items-center cursor-pointer  ${isCollapsed ? "w-10 rounded-full justify-center" : "w-[90%] rounded-lg ps-5"} h-10   transition-colors text-black bg-gray-100 hover:bg-gray-200`}
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
