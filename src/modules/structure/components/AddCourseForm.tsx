import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { courseApi } from '../api/courseApi';
import { teachingModuleApi } from '../api/teachingModuleApi';
import { toaster } from '@/components/ui/toaster';
import type { TeachingModule } from '../types/university.types';

const courseSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  teachingModuleId: z.string().min(1, 'Teaching Module is required'),
  credits: z.coerce.number().int().min(1, 'Credits must be positive'),
  coefficient: z.coerce.number().min(0, 'Coefficient must be positive'),
  lectureHours: z.coerce.number().min(0, 'Must be positive'),
  tutorialHours: z.coerce.number().min(0, 'Must be positive'),
  practicalHours: z.coerce.number().min(0, 'Must be positive'),
  isActive: z.boolean().optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface AddCourseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddCourseForm({ onSuccess, onCancel }: AddCourseFormProps) {
  const { t } = useTranslation();
  const [teachingModules, setTeachingModules] = useState<TeachingModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      isActive: true,
      credits: 3,
      coefficient: 1,
      lectureHours: 0,
      tutorialHours: 0,
      practicalHours: 0,
    }
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await teachingModuleApi.getTeachingModules({ skip: 0, take: 500 });
        setTeachingModules(res.data);
      } catch (error) {
        toaster.create({ title: "Failed to load teaching modules", type: "error" });
      }
    };
    fetchModules();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await courseApi.createCourse(data);
      toaster.create({ title: t("global.created", "Created successfully"), type: "success" });
      onSuccess();
    } catch (error) {
      toaster.create({ title: t("global.error", "An error occurred"), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t("labels.course_name", "Course Name")}
          placeholder="e.g. Intro to Programming"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label={t("global.code", "Code")}
          placeholder="e.g. PROG101"
          error={errors.code?.message}
          {...register("code")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input
          label={t("global.description", "Description")}
          placeholder="Optional description"
          error={errors.description?.message}
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={t("routes.teaching_modules", "Teaching Module (UE)")}
          options={teachingModules.map(m => ({ value: m.id, label: `${m.code} - ${m.name}` }))}
          error={errors.teachingModuleId?.message}
          value={watch("teachingModuleId")}
          {...register('teachingModuleId')}
          placeholder="Select Teaching Module"
        />
        <Input
          label={t("labels.coefficient", "Coefficient")}
          type="number"
          step="0.5"
          error={errors.coefficient?.message}
          {...register("coefficient")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label={t("labels.lecture_hours", "Lecture (H)")}
          type="number"
          error={errors.lectureHours?.message}
          {...register("lectureHours")}
        />
        <Input
          label={t("labels.tutorial_hours", "Tutorial (H)")}
          type="number"
          error={errors.tutorialHours?.message}
          {...register("tutorialHours")}
        />
        <Input
          label={t("labels.practical_hours", "Practical (H)")}
          type="number"
          error={errors.practicalHours?.message}
          {...register("practicalHours")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t("labels.credits", "Credits")}
          type="number"
          error={errors.credits?.message}
          {...register("credits")}
        />
        
        <div className="flex items-center mt-8 space-x-2">
          <input
            type="checkbox"
            id="isActive"
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            {...register("isActive")}
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            {t("labels.active", "Active")}
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
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
          disabled={isLoading}
        >
          {t("global.save", "Save")}
        </Button>
      </div>
    </form>
  );
}
