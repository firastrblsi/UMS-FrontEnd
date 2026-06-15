import { useTranslation, Trans } from "react-i18next";
import { Bell } from "lucide-react";
import { Avatar } from "@chakra-ui/react";
import { useAppSelector } from "@/core/hooks/useAppSelector";
import { selectDashboardPage } from "@/core/store/selectors/uiSelectors";
import type { ReactNode } from "react";
import dashboardBg from "../../assets/dashboard-bg.jpg";

interface NavbarProps {
  children?: ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const isDashboardPage = useAppSelector(selectDashboardPage);

  const { t } = useTranslation();
  return (
    <div
      className={`${isDashboardPage ? "h-85 text-white justify-between py-3" : "border h-15 justify-center"} w-full rounded-2xl bg-white flex flex-col px-7 transition-all duration-500 ease-in-out `}
      style={
        isDashboardPage
          ? {
              backgroundImage: `url(${dashboardBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : { backgroundColor: "white" }
      }
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-light">
            <Trans
              i18nKey="global.sesame"
              components={{
                highlight: (
                  <span
                    className={`${isDashboardPage ? "" : "primary-text"} font-normal `}
                  />
                ),
              }}
            />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full w-10 h-10 text-black bg-gray-100 hover:bg-gray-200 cursor-pointer">
            <Bell size={15} />
          </div>
          <div className="cursor-pointer">
            <Avatar.Root className="w-10 h-10">
              <Avatar.Fallback name="Segun Adebayo" />
              <Avatar.Image src="https://bit.ly/sage-adebayo" />
            </Avatar.Root>
          </div>
        </div>
      </div>
      <div>{isDashboardPage && children}</div>
    </div>
  );
};

export default Navbar;
