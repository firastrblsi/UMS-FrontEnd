import { useState } from "react";
import { useTranslation } from "react-i18next";
import StudentsFilterForm from "../components/StudentsFilterForm";
import { StudentsGrid } from "../components/StudentsGrid";
import AddStudentForm from "../components/AddStudentForm";
import UpdateStudentForm from "../components/UpdateStudentForm";
import type { StudentFilterParams, Student } from "../types/student.types";
import { Dialog } from "@/shared/ui/Dialog";
import { Button } from "@/shared/ui/Button";
import { Plus, RefreshCw, Funnel } from "lucide-react";
import { studentApi } from "../api/studentApi";
import { toaster } from "@/components/ui/toaster";

const Students = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<StudentFilterParams>({});
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeactivate = async (userId: string) => {
    try {
      await studentApi.deactivateUser(userId);
      toaster.create({ title: t("student.account_deactivated"), type: "success" });
      handleRefresh();
    } catch {
      toaster.create({ title: t("student.failed_deactivate"), type: "error" });
    }
  };

  const handleReactivate = async (userId: string) => {
    try {
      await studentApi.reactivateUser(userId);
      toaster.create({ title: t("student.account_reactivated"), type: "success" });
      handleRefresh();
    } catch {
      toaster.create({ title: t("student.failed_reactivate"), type: "error" });
    }
  };

  return (
    <div className="flex flex-col gap-15">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl ">{t("nav.students", "Students")}</h1>
        <div className="flex gap-2 ">
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
            buttonType="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Funnel />
            <span className="">{t("global.filters")}</span>
          </Button>
          <Button height={30} radius={10} className="flex gap-3" onClick={() => setShowAddStudent(true)}>
            <span className="font-light">{t("student.add_student")}</span>
            <Plus />
          </Button>
          <Dialog
            open={showAddStudent}
            onClose={() => setShowAddStudent(false)}
            title={t("student.add_new_student")}
            size="xl"
          >
            <AddStudentForm 
              onSuccess={() => {
                setShowAddStudent(false);
                handleRefresh();
              }}
              onCancel={() => setShowAddStudent(false)}
            />
          </Dialog>
        </div>
      </div>

      {showFilters && (
        <div>
          <StudentsFilterForm onFilter={setFilters} />
        </div>
      )}

      <StudentsGrid 
        filters={filters} 
        trigger={refreshTrigger}
        onEditStudent={(student) => setEditingStudent(student)}
        onToggleActivation={(userId, currentStatus) => {
          if (currentStatus) {
            handleDeactivate(userId);
          } else {
            handleReactivate(userId);
          }
        }}
      />

      <Dialog
        open={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        title={t("student.edit_student")}
        size="xl"
      >
        {editingStudent && (
          <UpdateStudentForm 
            student={editingStudent}
            onSuccess={() => {
              setEditingStudent(null);
              handleRefresh();
            }}
            onCancel={() => setEditingStudent(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Students;
