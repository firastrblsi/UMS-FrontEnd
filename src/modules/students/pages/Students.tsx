import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StudentsGrid } from "../components/StudentsGrid";
import AddStudentForm from "../components/AddStudentForm";
import UpdateStudentForm from "../components/UpdateStudentForm";
import { StudentProfileDialog } from "../components/StudentProfileDialog";
import type { Student } from "../types/student.types";
import { Dialog } from "@/shared/ui/Dialog";
import { Button } from "@/shared/ui/Button";
import { Plus, RefreshCw } from "lucide-react";
import { studentApi } from "../api/studentApi";
import { toaster } from "@/components/ui/toaster";

const Students = () => {
  const { t } = useTranslation();

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);


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



      <div className="w-full overflow-x-auto pb-4">
        <StudentsGrid 
          trigger={refreshTrigger}
          onEditStudent={(student) => setEditingStudent(student)}
          onViewStudent={(student) => setViewingStudent(student)}
          onToggleActivation={(userId, currentStatus) => {
            if (currentStatus) {
              handleDeactivate(userId);
            } else {
              handleReactivate(userId);
            }
          }}
        />
      </div>

      <StudentProfileDialog
        open={!!viewingStudent}
        onOpenChange={(open) => !open && setViewingStudent(null)}
        student={viewingStudent}
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
