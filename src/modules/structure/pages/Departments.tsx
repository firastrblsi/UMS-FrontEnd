import { Button } from "@/shared/ui/Button";
import { useTranslation } from "react-i18next";
import { Plus, Funnel } from "lucide-react";
import DepartmentsFilterForm from "../components/DepartmentsFilterForm";
import { useState } from "react";
import { DepartmentsGrid } from "../components/DepartmentsGrid";

const Departments = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div className="flex flex-col gap-15">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl ">{t("routes.departments")}</h1>
        <div className="flex gap-2 ">
          <Button
            height={30}
            radius={10}
            buttonType="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Funnel />
            <span className="">{t("global.filters")}</span>
          </Button>
          <Button height={30} radius={10} className="flex gap-3">
            <span className="font-light">{t("global.add_department")}</span>
            <Plus />
          </Button>
        </div>
      </div>
      {showFilters && (
        <div>
          <DepartmentsFilterForm />
        </div>
      )}
      <DepartmentsGrid />
    </div>
  );
};

export default Departments;
