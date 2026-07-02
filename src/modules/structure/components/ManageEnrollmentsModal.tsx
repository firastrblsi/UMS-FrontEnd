import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CourseSection } from "../types/university.types";
import { studentEnrollmentApi } from "../api/studentEnrollmentApi";
import type { StudentEnrollment } from "../api/studentEnrollmentApi";
import { studentApi } from "../../students/api/studentApi";
import { Button } from "@/shared/ui/Button";
import { AsyncSearchableSelect } from "@/shared/ui/AsyncSearchableSelect";
import { Users, UserPlus, Trash2, CheckCircle } from "lucide-react";

interface ManageEnrollmentsModalProps {
  section: CourseSection;
  onClose: () => void;
}

export function ManageEnrollmentsModal({ section, onClose }: ManageEnrollmentsModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'enrolled' | 'add'>('enrolled');
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (activeTab === 'enrolled') {
      fetchEnrollments();
    }
  }, [activeTab, section.id]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await studentEnrollmentApi.getEnrollments({
        filters: JSON.stringify([{ id: 'courseSectionId', value: section.id }]),
        take: 1000 // Get all for now
      });
      setEnrollments(res.data);
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    if (!confirm(t("enrollments.confirm_unenroll", "Are you sure you want to unenroll this student?"))) return;
    try {
      await studentEnrollmentApi.unenrollStudent(enrollmentId);
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
    } catch (error) {
      console.error("Failed to unenroll", error);
    }
  };

  const handleBulkEnroll = async () => {
    if (!confirm(t("enrollments.confirm_bulk_enroll", "Enroll all students from the assigned class group?"))) return;
    setEnrolling(true);
    try {
      const res = await studentEnrollmentApi.bulkEnrollClassGroup({ courseSectionId: section.id });
      alert(res.message);
      setActiveTab('enrolled');
    } catch (error: any) {
      alert(error.response?.data?.message || "Bulk enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const handleIndividualEnroll = async () => {
    if (!selectedStudentId) return;
    setEnrolling(true);
    try {
      await studentEnrollmentApi.enrollStudent({
        studentId: selectedStudentId,
        courseSectionId: section.id
      });
      alert(t("enrollments.enroll_success", "Student enrolled successfully"));
      setSelectedStudentId("");
      setActiveTab('enrolled');
    } catch (error: any) {
      alert(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const loadStudents = async (search: string) => {
    const res = await studentApi.getStudents({ search, take: 20 });
    const enrolledIds = enrollments.map(e => e.studentId);
    
    return res.data
      .filter((student: any) => !enrolledIds.includes(student.id))
      .map((student: any) => ({
        value: student.id,
        label: `${student.user?.firstName} ${student.user?.lastName} (${student.studentNumber || "No ID"})`
      }));
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex border-b mb-4">
        <button
          className={`flex-1 py-2 font-medium ${activeTab === 'enrolled' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('enrolled')}
        >
          <div className="flex items-center justify-center gap-2">
            <Users size={18} />
            {t("enrollments.enrolled_students", "Enrolled Students")}
          </div>
        </button>
        <button
          className={`flex-1 py-2 font-medium ${activeTab === 'add' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('add')}
        >
          <div className="flex items-center justify-center gap-2">
            <UserPlus size={18} />
            {t("enrollments.add_students", "Add Students")}
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'enrolled' && (
          <div>
            {loading ? (
              <div className="flex justify-center p-10">{t("global.loading", "Loading...")}</div>
            ) : enrollments.length === 0 ? (
              <div className="text-center text-gray-500 p-10 bg-gray-50 rounded-lg border border-dashed">
                {t("enrollments.no_students", "No students enrolled yet.")}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="text-sm text-gray-500 mb-2">
                  {t("enrollments.total_enrolled", "Total Enrolled")}: {enrollments.length}
                </div>
                {enrollments.map(e => (
                  <div key={e.id} className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <div className="font-medium text-gray-900">
                        {e.student?.user?.firstName} {e.student?.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500 font-mono">
                        {e.student?.studentNumber || t("enrollments.no_id", "No ID")}
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      height={32}
                      className="px-2"
                      onClick={() => handleUnenroll(e.id)}
                      title={t("enrollments.unenroll", "Unenroll")}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="flex flex-col gap-8">
            {/* Bulk Enroll Section */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
                <Users size={20} />
                {t("enrollments.bulk_enroll", "Bulk Enroll Class Group")}
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                {t("enrollments.bulk_enroll_desc", "Automatically enroll all students belonging to this section's designated class group.")}
              </p>
              
              {section.classGroup ? (
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                  <span className="font-medium">{section.classGroup.name}</span>
                  <Button 
                    onClick={handleBulkEnroll} 
                    disabled={enrolling}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    {t("enrollments.enroll_all", "Enroll All")}
                  </Button>
                </div>
              ) : (
                <div className="text-red-500 text-sm">
                  {t("enrollments.no_class_group", "This section has no class group assigned.")}
                </div>
              )}
            </div>

            {/* Individual Enroll Section */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <UserPlus size={20} />
                {t("enrollments.individual_enroll", "Enroll Individual Student")}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t("enrollments.individual_enroll_desc", "Search and enroll a specific student by name or matricule number.")}
              </p>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("enrollments.search_student", "Search Student")}
                  </label>
                  <AsyncSearchableSelect
                    loadOptions={loadStudents}
                    onChange={(val) => setSelectedStudentId(val as string)}
                    value={selectedStudentId}
                    placeholder={t("enrollments.search_placeholder", "Type to search...")}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleIndividualEnroll} 
                    disabled={!selectedStudentId || enrolling}
                  >
                    {t("global.add", "Add")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end pt-4 mt-2 border-t">
        <Button buttonType="secondary" onClick={onClose}>
          {t("global.close", "Close")}
        </Button>
      </div>
    </div>
  );
}
