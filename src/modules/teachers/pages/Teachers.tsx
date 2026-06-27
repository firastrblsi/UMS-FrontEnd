import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { TeachersGrid } from "../components/TeachersGrid";
import type { Teacher } from "../types/teacher.types";
import { Dialog } from "@/shared/ui/Dialog";
import AddTeacherForm from "../components/AddTeacherForm";
import UpdateTeacherForm from "../components/UpdateTeacherForm";
import { TeacherProfileDialog } from "../components/TeacherProfileDialog";
import { teacherApi } from "../api/teacherApi";
import { toaster } from "@/components/ui/toaster";

const Teachers = () => {
  const { t } = useTranslation();

  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeactivate = async (userId: string) => {
    try {
      await teacherApi.deactivateUser(userId);
      toaster.create({ title: "Account deactivated", type: "success" });
      handleRefresh();
    } catch {
      toaster.create({ title: "Failed to deactivate", type: "error" });
    }
  };

  const handleReactivate = async (userId: string) => {
    try {
      await teacherApi.reactivateUser(userId);
      toaster.create({ title: "Account reactivated", type: "success" });
      handleRefresh();
    } catch {
      toaster.create({ title: "Failed to reactivate", type: "error" });
    }
  };

  return (
    <div className="flex flex-col gap-10 md:gap-15">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl mb-3 md:mb-0">{t("routes.teachers")}</h1>
        <div className="flex gap-2 justify-center ">
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
            onClick={() => setShowAddTeacher(true)}
          >
            <span className="font-light">{t("global.add_teacher") || "Add Teacher"}</span>
            <Plus />
          </Button>
          <Dialog
            open={showAddTeacher}
            onClose={() => setShowAddTeacher(false)}
            title={t("global.add_teacher") || "Add Teacher"}
            size="xl"
          >
            <AddTeacherForm 
              onSuccess={() => {
                setShowAddTeacher(false);
                handleRefresh();
              }}
              onCancel={() => setShowAddTeacher(false)}
            />
          </Dialog>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-4">
        <TeachersGrid 
          trigger={refreshTrigger}
          onEditTeacher={(teacher) => setEditingTeacher(teacher)}
          onViewTeacher={(teacher) => setViewingTeacher(teacher)}
          onToggleActivation={(userId, currentStatus) => {
            if (currentStatus) {
              handleDeactivate(userId);
            } else {
              handleReactivate(userId);
            }
          }}
        />
      </div>

      <TeacherProfileDialog
        open={!!viewingTeacher}
        onOpenChange={(open) => !open && setViewingTeacher(null)}
        teacher={viewingTeacher}
      />

      <Dialog
        open={!!editingTeacher}
        onClose={() => setEditingTeacher(null)}
        title={t("global.edit_teacher") || "Edit Teacher"}
        size="xl"
      >
        {editingTeacher && (
          <UpdateTeacherForm 
            teacher={editingTeacher}
            onSuccess={() => {
              setEditingTeacher(null);
              handleRefresh();
            }}
            onCancel={() => setEditingTeacher(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Teachers;
