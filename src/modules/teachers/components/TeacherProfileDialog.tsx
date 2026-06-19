import { Dialog as ChakraDialog, CloseButton, Avatar } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import type { Teacher } from "../types/teacher.types";

interface TeacherProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
}

export function TeacherProfileDialog({
  open,
  onOpenChange,
  teacher,
}: TeacherProfileDialogProps) {
  const { t } = useTranslation();

  // Cache the teacher so the dialog can animate out gracefully without throwing errors or unmounting instantly
  const [cachedTeacher, setCachedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (teacher) {
      setCachedTeacher(teacher);
    }
  }, [teacher]);

  const displayTeacher = teacher || cachedTeacher;

  const getAvatarUrl = () => {
    if (!displayTeacher?.user?.profilePicture?.url) return undefined;
    if (displayTeacher.user.profilePicture.url.startsWith("http"))
      return displayTeacher.user.profilePicture.url;
    return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${
      displayTeacher.user.profilePicture.url
    }`;
  };

  return (
    <ChakraDialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} size="lg">
      <ChakraDialog.Backdrop />
      <ChakraDialog.Positioner>
        <ChakraDialog.Content className="p-0 overflow-hidden bg-white rounded-2xl max-h-[85vh] overflow-y-auto">
          {displayTeacher && (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex items-start gap-6 border-b border-gray-100 relative">
                <Avatar.Root className="w-24 h-24 rounded-2xl shadow-sm border-4 border-white bg-white">
                  <Avatar.Fallback
                    name={`${displayTeacher.user?.firstName} ${displayTeacher.user?.lastName}`}
                    className="rounded-2xl text-2xl font-medium bg-blue-100 text-blue-700"
                  />
                  <Avatar.Image src={getAvatarUrl()} className="rounded-2xl object-cover" />
                </Avatar.Root>
                <div className="pt-2 flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {displayTeacher.title ? t(`teacher.title.${displayTeacher.title}`, displayTeacher.title) + " " : ""}
                    {displayTeacher.user?.firstName} {displayTeacher.user?.lastName}
                  </h2>
                  <p className="text-gray-500 font-medium">{displayTeacher.employeeId || "-"}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {displayTeacher.department?.name || t("labels.department")}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                      {displayTeacher.contractType ? t(`teacher.contract.${displayTeacher.contractType}`, displayTeacher.contractType) : "-"}
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
                <ChakraDialog.Title>Teacher Profile</ChakraDialog.Title>
              </ChakraDialog.Header>

              <ChakraDialog.Body className="p-6">
                {displayTeacher.bio && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                      {t("labels.description", "Biography")}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{displayTeacher.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                        Personal Information
                      </h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("labels.email")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayTeacher.user?.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.phone", "Phone")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayTeacher.user?.phone || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">{t("student.gender", "Gender")}</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">
                            {displayTeacher.user?.gender ? t(`student.gender_enum.${displayTeacher.user.gender}`, displayTeacher.user.gender) : "-"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                        Professional Contact
                      </h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Professional Email</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayTeacher.professionalEmail || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Office Room</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayTeacher.officeRoom || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Office Hours</dt>
                          <dd className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap">{displayTeacher.officeHours || "-"}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                        Academic Details
                      </h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Specialization</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayTeacher.specialization || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Highest Degree</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayTeacher.highestDegree || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Degree Field</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayTeacher.degreeField || "-"}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Institution</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">{displayTeacher.degreeInstitution || "-"}</dd>
                        </div>
                    </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                        Employment Info
                      </h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">
                            {displayTeacher.hireDate ? new Date(displayTeacher.hireDate).toLocaleDateString() : "-"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">End Date</dt>
                          <dd className="text-sm text-gray-900 mt-0.5">
                            {displayTeacher.endDate ? new Date(displayTeacher.endDate).toLocaleDateString() : "-"}
                          </dd>
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
