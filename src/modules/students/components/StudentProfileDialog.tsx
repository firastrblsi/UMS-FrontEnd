import { Dialog as ChakraDialog, CloseButton, Avatar } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import type { Student } from "../types/student.types";

interface StudentProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

export function StudentProfileDialog({
  open,
  onOpenChange,
  student,
}: StudentProfileDialogProps) {
  const { t } = useTranslation();
  
  // Cache the student so the dialog can animate out gracefully without throwing errors or unmounting instantly
  const [cachedStudent, setCachedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (student) {
      setCachedStudent(student);
    }
  }, [student]);

  const displayStudent = student || cachedStudent;

  const getAvatarUrl = () => {
    if (!displayStudent?.user?.profilePicture?.url) return undefined;
    if (displayStudent.user.profilePicture.url.startsWith("http"))
      return displayStudent.user.profilePicture.url;
    return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${
      displayStudent.user.profilePicture.url
    }`;
  };

  return (
    <ChakraDialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} size="lg">
      <ChakraDialog.Backdrop />
      <ChakraDialog.Positioner>
        <ChakraDialog.Content className="p-0 overflow-hidden bg-white rounded-2xl max-h-[85vh] overflow-y-auto">
          {displayStudent && (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex items-start gap-6 border-b border-gray-100 relative">
                <Avatar.Root className="w-24 h-24 rounded-2xl shadow-sm border-4 border-white bg-white">
                  <Avatar.Fallback
                    name={`${displayStudent.user?.firstName} ${displayStudent.user?.lastName}`}
                    className="rounded-2xl text-2xl font-medium bg-blue-100 text-blue-700"
                  />
                  <Avatar.Image src={getAvatarUrl()} className="rounded-2xl object-cover" />
                </Avatar.Root>
                <div className="pt-2 flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {displayStudent.user?.firstName} {displayStudent.user?.lastName}
                  </h2>
                  <p className="text-gray-500 font-medium">{displayStudent.studentNumber}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {t(`student.status.${displayStudent.status}`, displayStudent.status)}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                      {displayStudent.program?.name || "No Program"}
                    </span>
                  </div>
                </div>
                <CloseButton 
                  className="absolute top-4 right-4" 
                  size="md" 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)} 
                />
              </div>

              <ChakraDialog.Header className="sr-only">
                <ChakraDialog.Title>Student Profile</ChakraDialog.Title>
              </ChakraDialog.Header>

              <ChakraDialog.Body className="p-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                        Personal Information
                      </h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("labels.email")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayStudent.user?.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.phone")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayStudent.user?.phone || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.national_id")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayStudent.nationalId || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.gender")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">
                            {displayStudent.user?.gender ? t(`student.gender_enum.${displayStudent.user.gender}`, displayStudent.user.gender) : "-"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                        Emergency Contact
                      </h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.guardian_name")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayStudent.guardianName || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.guardian_phone")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayStudent.guardianPhone || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.guardian_relation")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayStudent.guardianRelation || "-"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                        Academic Information
                      </h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.enrollment_date")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">
                            {displayStudent.enrollmentDate ? new Date(displayStudent.enrollmentDate).toLocaleDateString() : "-"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.scholarship_type")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">
                            {displayStudent.scholarshipType ? t(`student.scholarship.${displayStudent.scholarshipType}`, displayStudent.scholarshipType) : "-"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.baccalaureate_field")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayStudent.baccalaureateField || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.baccalaureate_grade", "Baccalaureate Grade")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayStudent.baccalaureateScore || "-"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </ChakraDialog.Body>
            </>
          )}
        </ChakraDialog.Content>
      </ChakraDialog.Positioner>
    </ChakraDialog.Root>
  );
}
