import { Button } from "@/shared/ui/Button";
import { useTranslation } from "react-i18next";
import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { DepartmentsGrid } from "../components/DepartmentsGrid";
import AddDepartmentForm from "../components/AddDepartmentForm";
import UpdateDepartmentForm from "../components/UpdateDepartmentForm";
import { Dialog } from "@/shared/ui/Dialog";
import type { Department } from "../types/department.types";

const Departments = () => {
  const { t } = useTranslation();

  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-10 md:gap-15">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl mb-3 md:mb-0">{t("routes.departments")}</h1>
        
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

          <Button height={30} radius={10} className="flex gap-3" onClick={() => setShowAddDepartment(true)}>
            <span className="font-light">{t("global.add_department")}</span>
            <Plus />
          </Button>
        </div>
      </div>

      <Dialog
        open={showAddDepartment}
        onClose={() => setShowAddDepartment(false)}
        title={t("global.add_department")}
        size="md"
      >
        <AddDepartmentForm 
          onSuccess={() => {
            setShowAddDepartment(false);
            handleRefresh();
          }}
          onCancel={() => setShowAddDepartment(false)}
        />
      </Dialog>



      <DepartmentsGrid 
        trigger={refreshTrigger}
        onEditDepartment={(dept) => setEditingDepartment(dept)}
      />

      <Dialog
        open={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        title={t("global.update_department") || "Update Department"}
        size="md"
      >
        {editingDepartment && (
          <UpdateDepartmentForm 
            department={editingDepartment}
            onSuccess={() => {
              setEditingDepartment(null);
              handleRefresh();
            }}
            onCancel={() => setEditingDepartment(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Departments;
