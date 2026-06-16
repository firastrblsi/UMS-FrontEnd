import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppSelector } from "@/core/hooks/useAppSelector";
import { selectSidebarCollapsed } from "@/core/store/selectors/uiSelectors";

const DashboardLayout = () => {
  const isCollapsed = useAppSelector(selectSidebarCollapsed);

  return (
    <div className="flex  gap-2 p-2 bg-gray-100 h-screen w-screen overflow-hidden ">
      <Sidebar />
      <div
        className={`${isCollapsed ? "" : "md:flex hidden"} w-full flex flex-col gap-2`}
      >
        <Navbar />
        <div className="border flex-1 bg-white overflow-auto rounded-2xl p-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
