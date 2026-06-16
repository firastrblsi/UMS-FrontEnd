import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Funnel } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import TeachersFilterForm from "../components/TeachersFilterForm";
import { TeachersGrid } from "../components/TeachersGrid";
import type { TeacherFilterParams } from "../types/teacher.types";
import { Dialog } from "@/shared/ui/Dialog";

const Teachers = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TeacherFilterParams>({});
  const [showAddTeacher, setShowAddTeacher] = useState(false);

  return (
    <div className="flex flex-col gap-10 md:gap-15">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl mb-3 md:mb-0">{t("routes.teachers")}</h1>
        <div className="flex gap-2 justify-center ">
          <Button
            height={30}
            radius={10}
            buttonType="secondary"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Funnel />
            <span>{t("global.filters")}</span>
          </Button>
          <Button
            height={30}
            radius={10}
            className="flex gap-3"
            onClick={() => setShowAddTeacher(true)}
          >
            <span className="font-light">{t("global.add_teacher")}</span>
            <Plus />
          </Button>
          <Dialog
            open={showAddTeacher}
            onClose={() => setShowAddTeacher(false)}
            title={t("global.add_teacher")}
            size="xl"
          >
            {/* form goes here */}
            <p>Add teacher form — coming next</p>
          </Dialog>
        </div>
      </div>
      {showFilters && (
        <div>
          <TeachersFilterForm onFilter={setFilters} />
        </div>
      )}
      <TeachersGrid externalFilters={filters} />
    </div>
  );
};

export default Teachers;
