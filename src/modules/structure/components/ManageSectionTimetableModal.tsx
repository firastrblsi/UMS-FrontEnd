import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CourseSection } from "../types/university.types";
import { Button } from "@/shared/ui/Button";
import { CalendarPlus, CalendarDays } from "lucide-react";
import ScheduleClassForm from "./ScheduleClassForm";
import { TimetableGrid } from "./TimetableGrid";

interface ManageSectionTimetableModalProps {
  section: CourseSection;
  onClose: () => void;
}

export function ManageSectionTimetableModal({ section, onClose }: ManageSectionTimetableModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'schedule' | 'list'>('schedule');

  return (
    <div className="flex flex-col min-h-[500px] w-full min-w-0">
      <div className="flex border-b mb-4 shrink-0">
        <button
          className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'schedule' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('schedule')}
        >
          <div className="flex items-center justify-center gap-2">
            <CalendarPlus size={18} />
            {t("global.add_timetable", "Schedule Class")}
          </div>
        </button>
        <button
          className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'list' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('list')}
        >
          <div className="flex items-center justify-center gap-2">
            <CalendarDays size={18} />
            {t("global.timetable_sessions", "Scheduled Classes")}
          </div>
        </button>
      </div>

      <div className="flex-1 pr-2 relative min-w-0">
        {activeTab === 'schedule' && (
          <div className="pt-2">
            <ScheduleClassForm
              initialCourseSectionId={section.id}
              onSuccess={() => setActiveTab('list')}
              onCancel={onClose}
            />
          </div>
        )}

        {activeTab === 'list' && (
          <div className="flex flex-col h-full min-w-0">
            <div className="flex-1 mb-4 min-w-0">
              <TimetableGrid filterKey="courseSectionId" filterValue={section.id} maxHeightClass="max-h-[45vh]" />
            </div>
            <div className="flex justify-end pt-4 border-t shrink-0">
              <Button buttonType="secondary" onClick={onClose}>
                {t("global.close", "Close")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
