import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { teachingModuleApi } from '../api/teachingModuleApi';
import { departmentApi } from '../api/departmentApi';
import { toaster } from '@/components/ui/toaster';
import type { Department } from '../types/department.types';
import type { TeachingModule } from '../types/university.types';

const teachingModuleSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  departmentId: z.string().min(1, 'Department is required'),
  coefficient: z.coerce.number().min(0, 'Coefficient must be positive'),
  totalCredits: z.coerce.number().int().min(1, 'Credits must be positive'),
  isActive: z.boolean().optional(),
});

type TeachingModuleFormValues = z.infer<typeof teachingModuleSchema>;

interface UpdateTeachingModuleFormProps {
  module: TeachingModule;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdateTeachingModuleForm({ module, onSuccess, onCancel }: UpdateTeachingModuleFormProps) {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<TeachingModuleFormValues>({
    resolver: zodResolver(teachingModuleSchema) as any,
    defaultValues: {
      name: module.name,
      code: module.code,
      description: module.description || '',
      departmentId: module.departmentId,
      coefficient: module.coefficient,
      totalCredits: module.totalCredits,
      isActive: module.isActive,
    }
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentApi.getDepartments({ skip: 0, take: 100 });
        setDepartments(res.data);
      } catch (error) {
        toaster.create({ title: "Failed to load departments", type: "error" });
      }
    };
    fetchDepartments();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await teachingModuleApi.updateTeachingModule(module.id, data);
      toaster.create({ title: t("global.updated", "Updated successfully"), type: "success" });
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
          label={t("labels.module_name", "Module Name")}
          placeholder="e.g. Computer Science Fundamentals"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label={t("global.code", "Code")}
          placeholder="e.g. CS101"
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
          label={t("routes.departments", "Department")}
          options={departments.map(d => ({ value: d.id, label: d.name }))}
          error={errors.departmentId?.message}
          value={watch("departmentId")}
          {...register('departmentId')}
          placeholder="Select Department"
        />
        <Input
          label={t("labels.coefficient", "Coefficient")}
          type="number"
          step="0.5"
          error={errors.coefficient?.message}
          {...register("coefficient")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t("labels.total_credits", "Total Credits")}
          type="number"
          error={errors.totalCredits?.message}
          {...register("totalCredits")}
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
