import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  Landmark,
  BookOpen,
  Building,
  User,
  Calendar,
  CalendarDays,
  Layers,
  CalendarRange,
  Book,
  FileText,
  Library,
  ClipboardList
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/core/hooks/useAppDispatch";
import { useAppSelector } from "@/core/hooks/useAppSelector";
import { selectSidebarCollapsed } from "@/core/store/selectors/uiSelectors";
import { toggleSidebar } from "@/core/store/slices/uiSlice";
import { useTranslation } from "react-i18next";
import type { Role } from "@/modules/auth/types/auth";
import { selectUser } from "@/modules/auth/redux/authSelectors";
import { logout } from "@/modules/auth/redux/authSlice";

interface NavItem {
  to?: string;
  icon: React.ElementType;
  labelKey: string;
  roles: Role[];
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    icon: House,
    labelKey: "routes.dashboard",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    to: "/attendance",
    icon: ClipboardList,
    labelKey: "routes.attendance",
    roles: ["ADMIN", "TEACHER"],
  },
  {
    to: "/timetable",
    icon: Calendar,
    labelKey: "routes.timetables",
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    icon: Users,
    labelKey: "routes.groups.people",
    roles: ["ADMIN"],
    children: [
      { to: "/students", icon: Users, labelKey: "routes.students", roles: ["ADMIN"] },
      { to: "/teachers", icon: GraduationCap, labelKey: "routes.teachers", roles: ["ADMIN"] },
    ]
  },
  {
    icon: BookOpen,
    labelKey: "routes.groups.curriculum",
    roles: ["ADMIN"],
    children: [
      { to: "/programs", icon: BookOpen, labelKey: "routes.programs", roles: ["ADMIN"] },
      { to: "/curriculums", icon: Library, labelKey: "routes.curriculums", roles: ["ADMIN"] },
      { to: "/teaching-modules", icon: Book, labelKey: "routes.teaching_modules", roles: ["ADMIN"] },
      { to: "/courses", icon: FileText, labelKey: "routes.courses", roles: ["ADMIN"] },
      { to: "/courses-sections", icon: FileText, labelKey: "routes.course_sections", roles: ["ADMIN"] },
    ]
  },
  {
    icon: Layers,
    labelKey: "routes.groups.structure",
    roles: ["ADMIN"],
    children: [
      { to: "/academic-years", icon: Calendar, labelKey: "routes.academic_years", roles: ["ADMIN"] },
      { to: "/semesters", icon: CalendarRange, labelKey: "routes.semesters", roles: ["ADMIN"] },
      { to: "/class-groups", icon: Layers, labelKey: "routes.class_groups", roles: ["ADMIN"] },
      { to: "/holidays", icon: CalendarDays, labelKey: "routes.holidays", roles: ["ADMIN"] },
    ]
  },
  {
    icon: Building,
    labelKey: "routes.groups.infrastructure",
    roles: ["ADMIN"],
    children: [
      { to: "/departments", icon: Landmark, labelKey: "routes.departments", roles: ["ADMIN"] },
      { to: "/rooms", icon: Building, labelKey: "routes.rooms", roles: ["ADMIN"] },
    ]
  },
  {
    to: "/profile",
    icon: User,
    labelKey: "routes.my_profile",
    roles: ["TEACHER", "STUDENT", "ADMIN"],
  },
  {
    to: "/my-attendance",
    icon: ClipboardList,
    labelKey: "routes.my_attendance",
    roles: ["STUDENT"],
  },
];

const NavGroup = ({ item, isCollapsed, t, role }: any) => {
  const { pathname } = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFlyout, setShowFlyout] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item.children?.some((child: NavItem) => child.to && pathname.startsWith(child.to))) {
      setIsExpanded(true);
    }
  }, [pathname, item.children]);

  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
        setShowFlyout(false);
      }
    };
    if (showFlyout) {
      document.addEventListener("pointerdown", handleClickOutside);
    }
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [showFlyout]);

  const visibleChildren = item.children?.filter((child: NavItem) => role && child.roles.includes(role)) || [];
  if (visibleChildren.length === 0) return null;

  const isActive = item.children?.some((child: NavItem) => child.to && pathname.startsWith(child.to));

  return (
    <li className="flex flex-col w-full relative items-center">
      <div
        className={`flex items-center cursor-pointer h-10 transition-colors ${
          isCollapsed
            ? "w-10 rounded-full justify-center"
            : "w-56 rounded-lg ps-5"
        } ${isActive ? "active-route" : "text-black bg-gray-100 hover:bg-gray-200"}`}
        onClick={() => {
          if (isCollapsed) {
            setShowFlyout(!showFlyout);
          } else {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <item.icon size={15} />
        {!isCollapsed && (
          <>
            <span className="text-sm ms-4 flex-1 select-none">{t(item.labelKey)}</span>
            <ChevronDown size={14} className={`mr-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </>
        )}
      </div>

      {/* Expanded Accordion (only when not collapsed) */}
      {!isCollapsed && (
        <div className={`overflow-hidden transition-all duration-300 w-full flex justify-center ${isExpanded ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
          <ul className="flex flex-col gap-2 w-56">
            {visibleChildren.map((child: NavItem) => (
              <li key={child.to} className="w-full">
                <NavLink
                  to={child.to!}
                  title={t(child.labelKey)}
                  className={({ isActive: childActive }) =>
                    `flex items-center h-10 w-full rounded-lg ps-9 text-sm transition-colors ${
                      childActive ? "text-blue-600 bg-blue-50 font-medium" : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <child.icon size={14} className="mr-3" />
                  {t(child.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hover/Click Flyout (only when collapsed) */}
      {isCollapsed && showFlyout && (
        <div 
          ref={flyoutRef}
          className="absolute left-[64px] top-0 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-left-2"
        >
          <div className="px-4 py-2 border-b border-gray-50 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t(item.labelKey)}</span>
          </div>
          <ul className="flex flex-col gap-2 px-3">
            {visibleChildren.map((child: NavItem) => (
              <li key={child.to} className="w-full">
                <NavLink
                  to={child.to!}
                  title={t(child.labelKey)}
                  onClick={() => setShowFlyout(false)}
                  className={({ isActive: childActive }) =>
                    `flex items-center h-10 w-full rounded-lg px-3 text-sm transition-colors ${
                      childActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <child.icon size={14} className="mr-3" />
                  <span className="truncate">{t(child.labelKey)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

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
      className={`border transition-all duration-300 ease-in-out relative z-50 py-6 rounded-2xl bg-white flex-col justify-between items-center ${isCollapsed ? "md:w-23 md:flex hidden" : "md:w-70  flex"}`}
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
      <div className={`w-full scrollbar-hide ${isCollapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"}`}>
        <ul className="flex flex-col gap-3">
          {visibleItems.map((item) => (
            item.children ? (
              <NavGroup 
                key={item.labelKey} 
                item={item} 
                isCollapsed={isCollapsed} 
                t={t} 
                role={role} 
              />
            ) : (
              <li
                key={item.to}
                className="flex justify-center gap-2 items-center w-full"
              >
                <NavLink
                  to={item.to!}
                  title={t(item.labelKey)}
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  <item.icon size={15} />
                  {!isCollapsed && (
                    <span className="text-sm ms-4">{t(item.labelKey)}</span>
                  )}
                </NavLink>
              </li>
            )
          ))}
        </ul>
      </div>
      <div className="mb-2 w-full">
        <ul className="flex flex-col gap-3">
          <li className="flex justify-center gap-2 items-center w-full">
            <NavLink
              to="/settings"
              title="settings"
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? "w-10 rounded-full justify-center" : "w-56 rounded-lg ps-5"} h-10 transition-colors ${
                  isActive
                    ? "active-route"
                    : "text-black bg-gray-100 hover:bg-gray-200"
                }`
              }
            >
              <Settings size={15} />
              {!isCollapsed && (
                <span className="text-sm ms-4">{t("routes.settings")}</span>
              )}
            </NavLink>
          </li>
          <li className="flex justify-center gap-2 items-center w-full">
            <span
              onClick={() => dispatch(logout())}
              className={`flex items-center cursor-pointer ${isCollapsed ? "w-10 rounded-full justify-center" : "w-56 rounded-lg ps-5"} h-10 transition-colors text-black bg-gray-100 hover:bg-gray-200`}
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
