import { useState } from "react";
import { CourseSectionsGrid } from "../components/CourseSectionsGrid";
import { Button } from "@/shared/ui/Button";
import { Plus, RefreshCw } from "lucide-react";
import { Dialog } from "@/shared/ui/Dialog";
import { AddCourseSectionForm } from "../components/AddCourseSectionForm";
import { UpdateCourseSectionForm } from "../components/UpdateCourseSectionForm";
import { ManageEnrollmentsModal } from "../components/ManageEnrollmentsModal";
import { ManageSectionTimetableModal } from "../components/ManageSectionTimetableModal";
import type { CourseSection } from "../types/university.types";
import { useTranslation } from "react-i18next";

export function CourseSections() {
  const { t } = useTranslation();
  const [trigger, setTrigger] = useState(0);

  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<CourseSection | null>(null);
  const [managingStudentsSection, setManagingStudentsSection] = useState<CourseSection | null>(null);
  const [schedulingSection, setSchedulingSection] = useState<CourseSection | null>(null);

  const handleSuccess = () => {
    setShowAddSection(false);
    setEditingSection(null);
    setTrigger(prev => prev + 1);
  };

  const handleRefresh = () => {
    setTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-10 md:gap-15">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl mb-3 md:mb-0">
          {t("routes.course_sections", "Course Sections")}
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

          <Button height={30} radius={10} className="flex gap-3" onClick={() => setShowAddSection(true)}>
            <span className="font-light">{t("global.add", "Add")}</span>
            <Plus />
          </Button>
        </div>
      </div>

      <div>
        <CourseSectionsGrid 
          trigger={trigger} 
          onEditSection={(section) => setEditingSection(section)}
          onManageStudents={(section) => setManagingStudentsSection(section)}
          onScheduleSection={(section) => setSchedulingSection(section)}
        />
      </div>

      <Dialog
        open={showAddSection}
        onClose={() => setShowAddSection(false)}
        title={t("global.add_course_section", "Add Course Section")}
        bodyOverflow="visible"
      >
        <AddCourseSectionForm
          onSuccess={handleSuccess}
          onCancel={() => setShowAddSection(false)}
        />
      </Dialog>

      <Dialog
        open={!!editingSection}
        onClose={() => setEditingSection(null)}
        title={t("global.update_course_section", "Update Course Section")}
        bodyOverflow="visible"
      >
        {editingSection && (
          <UpdateCourseSectionForm
            section={editingSection}
            onSuccess={handleSuccess}
            onCancel={() => setEditingSection(null)}
          />
        )}
      </Dialog>

      <Dialog
        open={!!managingStudentsSection}
        onClose={() => setManagingStudentsSection(null)}
        title={t("enrollments.manage_students_title", "Manage Student Enrollments")}
        bodyOverflow="visible"
      >
        {managingStudentsSection && (
          <ManageEnrollmentsModal
            section={managingStudentsSection}
            onClose={() => setManagingStudentsSection(null)}
          />
        )}
      </Dialog>

      <Dialog
        open={!!schedulingSection}
        onClose={() => setSchedulingSection(null)}
        title={schedulingSection ? `${schedulingSection.course?.name || ''} - ${schedulingSection.classGroup?.name || ''}` : t("global.timetable_sessions", "Scheduled Classes")}
        size="xl"
      >
        {schedulingSection && (
          <ManageSectionTimetableModal
            section={schedulingSection}
            onClose={() => setSchedulingSection(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
