import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { AcademicYearsGrid } from "../components/AcademicYearsGrid";
import AddAcademicYearForm from "../components/AddAcademicYearForm";
import UpdateAcademicYearForm from "../components/UpdateAcademicYearForm";
import type { AcademicYear } from "../api/academicYearApi";

const AcademicYears = () => {
  const { t } = useTranslation();
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicYear | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div className="flex flex-col gap-10 md:gap-15">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl mb-3 md:mb-0">{t("routes.academic_years", "Academic Years")}</h1>
        <div className="flex gap-2 justify-center">
          <Button
            buttonType="secondary"
            height={30}
            radius={10}
            className="flex items-center justify-center p-2"
            onClick={handleRefresh}
            title="Refresh List"
          >
            <RefreshCw size={16} />
          </Button>
          <Button
            height={30}
            radius={10}
            className="flex gap-3"
            onClick={() => setShowAdd(true)}
          >
            <span className="font-light">{t("global.add_academic_year", "Add Academic Year")}</span>
            <Plus size={16} />
          </Button>
        </div>
      </div>

      <AcademicYearsGrid 
        trigger={refreshTrigger}
        onEditAcademicYear={(item) => setEditingItem(item)}
      />

      <Dialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title={t("global.add_academic_year", "Add Academic Year")}
        size="lg"
      >
        <AddAcademicYearForm 
          onSuccess={() => {
            setShowAdd(false);
            handleRefresh();
          }}
          onCancel={() => setShowAdd(false)}
        />
      </Dialog>

      <Dialog
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={t("global.update_academic_year", "Update Academic Year")}
        size="lg"
      >
        {editingItem && (
          <UpdateAcademicYearForm 
            academicYear={editingItem}
            onSuccess={() => {
              setEditingItem(null);
              handleRefresh();
            }}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default AcademicYears;
