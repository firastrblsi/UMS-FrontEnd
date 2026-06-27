import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { programApi } from '../api/programApi';
import { departmentApi } from '../api/departmentApi';
import { toaster } from '@/components/ui/toaster';
import type { Department } from '../types/department.types';

const programSchema = z.object({
  name: z.string().min(2, 'Program name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  degreeType: z.enum(['BACHELOR', 'MASTER', 'DIPLOMA', 'CERTIFICATE']),
  departmentId: z.string().min(1, 'Department is required'),
  totalCredits: z.coerce.number().int().min(1, 'Total credits must be positive'),
  numberOfSemesters: z.coerce.number().int().min(1, 'Number of semesters must be positive'),
  isActive: z.boolean().optional(),
});

type ProgramFormValues = z.infer<typeof programSchema>;

interface AddProgramFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddProgramForm = ({ onSuccess, onCancel }: AddProgramFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<{value: string; label: string}[]>([]);

  useEffect(() => {
    departmentApi.getDepartments({ take: 100 })
      .then(res => {
        setDepartments(res.data.map((d: Department) => ({ value: d.id, label: d.name })));
      })
      .catch(console.error);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema) as any,
    defaultValues: {
      name: '',
      code: '',
      description: '',
      degreeType: 'BACHELOR',
      departmentId: '',
      totalCredits: '' as any,
      numberOfSemesters: '' as any,
      isActive: true,
    },
  });

  const onSubmit = async (data: ProgramFormValues) => {
    try {
      setIsSubmitting(true);
      await programApi.createProgram(data);
      toaster.create({
        title: 'Success',
        description: 'Program created successfully.',
        type: 'success',
      });
      onSuccess();
    } catch (error: any) {
      toaster.create({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to create program',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t("labels.program_name")}
          placeholder="e.g. B.Sc. Computer Science"
          {...register('name')}
          error={errors.name?.message}
          required
        />
        <Input
          label={t("labels.code")}
          placeholder="e.g. BSCS"
          {...register('code')}
          error={errors.code?.message}
          required
        />
        <Select
          label={t("labels.degree_type")}
          {...register('degreeType')}
          error={errors.degreeType?.message as string}
          options={[
            { value: 'BACHELOR', label: t("labels.bachelor") },
            { value: 'MASTER', label: t("labels.master") },
            { value: 'DIPLOMA', label: t("labels.diploma") || "Diploma" },
            { value: 'CERTIFICATE', label: t("labels.certificate") || "Certificate" },
          ]}
          required
        />
        <Select
          label={t("labels.department") || "Department"}
          {...register('departmentId')}
          error={errors.departmentId?.message as string}
          options={[{ value: '', label: t("labels.select_department") || "Select Department" }, ...departments]}
          required
        />
        <Input
          label={t("labels.total_credits") || "Total Credits"}
          type="number"
          placeholder="e.g. 180"
          {...register('totalCredits')}
          error={errors.totalCredits?.message}
          required
        />
        <Input
          label={t("labels.number_of_semesters") || "Number of Semesters"}
          type="number"
          placeholder="e.g. 6"
          {...register('numberOfSemesters')}
          error={errors.numberOfSemesters?.message}
          required
        />
        <div className="md:col-span-2">
          <Input
            label={t("labels.description")}
            placeholder="Optional description"
            {...register('description')}
            error={errors.description?.message}
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="isActive" 
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
            {t("global.is_active")}
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-2">
        <Button type="button" buttonType="secondary" onClick={onCancel} disabled={isSubmitting}>
          {t("global.cancel")}
        </Button>
        <Button
          type="submit"
          buttonType="primary"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {t("global.add_program")}
        </Button>
      </div>
    </form>
  );
};

export default AddProgramForm;
