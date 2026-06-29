import { useState } from "react";
import { CoursesGrid } from "../components/CoursesGrid";
import { Button } from "@/shared/ui/Button";
import { Plus, RefreshCw, FileText } from "lucide-react";
import { Dialog } from "@/shared/ui/Dialog";
import AddCourseForm from "../components/AddCourseForm";
import UpdateCourseForm from "../components/UpdateCourseForm";
import type { Course } from "../types/university.types";
import { useTranslation } from "react-i18next";

const Courses = () => {

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { t } = useTranslation();

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-10 md:gap-15">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl mb-3 md:mb-0 flex items-center gap-3">
          <FileText className="text-blue-600" />
          {t("routes.courses", "Courses (ECUE)")}
        </h1>
        
        <div className="flex gap-2 justify-center">
          <Button
            buttonType="secondary"
            height={30}
            radius={10}
            className="flex items-center justify-center p-2"
            onClick={handleRefresh}
            title={t("global.refresh", "Refresh List")}
          >
            <RefreshCw size={16} />
          </Button>

          <Button height={30} radius={10} className="flex gap-3" onClick={() => setShowAddCourse(true)}>
            <span className="font-light">{t("global.add_course", "Add Course")}</span>
            <Plus />
          </Button>
        </div>
      </div>

      <Dialog
        open={showAddCourse}
        onClose={() => setShowAddCourse(false)}
        title={t("global.add_course", "Add Course")}
        size="lg"
      >
        <AddCourseForm 
          onSuccess={() => {
            setShowAddCourse(false);
            handleRefresh();
          }}
          onCancel={() => setShowAddCourse(false)}
        />
      </Dialog>

      <CoursesGrid 
        trigger={refreshTrigger}
        onEditCourse={(course) => setEditingCourse(course)}
      />

      <Dialog
        open={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        title={t("global.update_course", "Update Course")}
        size="lg"
      >
        {editingCourse && (
          <UpdateCourseForm 
            course={editingCourse}
            onSuccess={() => {
              setEditingCourse(null);
              handleRefresh();
            }}
            onCancel={() => setEditingCourse(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Courses;
