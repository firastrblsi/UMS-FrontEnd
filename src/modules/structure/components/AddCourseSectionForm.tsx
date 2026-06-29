import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';

import { AsyncSearchableSelect } from '@/shared/ui/AsyncSearchableSelect';
import { courseSectionApi } from '../api/courseSectionApi';
import { courseApi } from '../api/courseApi';
import { semesterApi } from '../api/semesterApi';
import { classGroupApi } from '../api/classGroupApi';
import { teacherApi } from '../../teachers/api/teacherApi';
import { toaster } from '@/components/ui/toaster';

const courseSectionSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  semesterId: z.string().min(1, 'Semester is required'),
  classGroupId: z.string().min(1, 'Class Group is required'),
  teacherId: z.string().optional(),
});

type CourseSectionFormValues = z.infer<typeof courseSectionSchema>;

interface AddCourseSectionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddCourseSectionForm({ onSuccess, onCancel }: AddCourseSectionFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, control, formState: { errors } } = useForm<CourseSectionFormValues>({
    resolver: zodResolver(courseSectionSchema),
    defaultValues: {
      courseId: "",
      semesterId: "",
      classGroupId: "",
      teacherId: "",
    }
  });

  const onSubmit = async (data: CourseSectionFormValues) => {
    setIsLoading(true);
    try {
      await courseSectionApi.createCourseSection({
        ...data,
        teacherId: data.teacherId || undefined,
      });
      toaster.create({
        title: t("global.created", "Created successfully"),
        type: "success"
      });
      onSuccess();
    } catch (error: any) {
      toaster.create({
        title: t("global.create_failed", "Failed to create"),
        description: error.response?.data?.message || error.message,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourses = async (inputValue: string) => {
    try {
      const res = await courseApi.getCourses({ skip: 0, take: 10, search: inputValue });
      return res.data.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` }));
    } catch { return []; }
  };

  const loadSemesters = async (inputValue: string) => {
    try {
      const res = await semesterApi.getSemesters({ skip: 0, take: 10, search: inputValue });
      return res.data.map(s => ({ value: s.id, label: s.name }));
    } catch { return []; }
  };

  const loadClassGroups = async (inputValue: string) => {
    try {
      const res = await classGroupApi.getClassGroups({ skip: 0, take: 10, search: inputValue });
      return res.data.map(cg => ({ value: cg.id, label: cg.name }));
    } catch { return []; }
  };

  const loadTeachers = async (inputValue: string) => {
    try {
      const res = await teacherApi.getTeachers({
        skip: 0,
        take: 10,
        search: inputValue,
      });
      return res.data.map(t => ({
        value: t.id,
        label: `${t.user?.firstName} ${t.user?.lastName}`
      }));
    } catch {
      return [];
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Controller
          name="courseId"
          control={control}
          render={({ field }) => (
            <AsyncSearchableSelect
              label={t("routes.courses", "Course")}
              loadOptions={loadCourses}
              placeholder={t("global.select_course", "Search course...")}
              error={errors.courseId?.message}
              value={field.value || ""}
              onChange={(val) => field.onChange(val)}
            />
          )}
        />

        <Controller
          name="semesterId"
          control={control}
          render={({ field }) => (
            <AsyncSearchableSelect
              label={t("routes.semesters", "Semester")}
              loadOptions={loadSemesters}
              placeholder={t("global.select_semester", "Search semester...")}
              error={errors.semesterId?.message}
              value={field.value || ""}
              onChange={(val) => field.onChange(val)}
            />
          )}
        />

        <Controller
          name="classGroupId"
          control={control}
          render={({ field }) => (
            <AsyncSearchableSelect
              label={t("routes.class_groups", "Class Group")}
              loadOptions={loadClassGroups}
              placeholder={t("global.select_class_group", "Search class group...")}
              error={errors.classGroupId?.message}
              value={field.value || ""}
              onChange={(val) => field.onChange(val)}
            />
          )}
        />

        <Controller
          name="teacherId"
          control={control}
          render={({ field }) => (
            <AsyncSearchableSelect
              label={t("routes.teachers", "Teacher (Optional)")}
              loadOptions={loadTeachers}
              placeholder={t("global.select_teacher", "Search teacher by name...")}
              error={errors.teacherId?.message}
              value={field.value || ""}
              onChange={(val) => field.onChange(val)}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="button"
          buttonType="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t("global.cancel", "Cancel")}
        </Button>
        <Button
          type="submit"
          buttonType="primary"
          loading={isLoading}
        >
          {t("global.save", "Save")}
        </Button>
      </div>
    </form>
  );
}
