import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { academicYearApi } from '../api/academicYearApi';
import type { CreateAcademicYearPayload } from '../api/academicYearApi';
import { toaster } from '@/components/ui/toaster';

interface AddAcademicYearFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddAcademicYearForm = ({ onSuccess, onCancel }: AddAcademicYearFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAcademicYearPayload>();

  const onSubmit = async (data: CreateAcademicYearPayload) => {
    try {
      setIsSubmitting(true);
      await academicYearApi.createAcademicYear({
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      });
      toaster.create({ title: 'Success', description: 'Academic year added successfully', type: 'success' });
      onSuccess();
    } catch (error: any) {
      toaster.create({ title: 'Error', description: error?.response?.data?.message || 'Failed to add academic year', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Input
        label={t("labels.name", "Name")}
        placeholder="e.g. 2025-2026"
        {...register('name', { required: 'Name is required' })}
        error={errors.name?.message}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label={t("labels.start_date", "Start Date")}
          {...register('startDate', { required: 'Start Date is required' })}
          error={errors.startDate?.message}
          required
        />
        <Input
          type="date"
          label={t("labels.end_date", "End Date")}
          {...register('endDate', { required: 'End Date is required' })}
          error={errors.endDate?.message}
          required
        />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input 
          type="checkbox" 
          id="isCurrent" 
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          {...register('isCurrent')}
        />
        <label htmlFor="isCurrent" className="text-sm font-medium text-slate-700">
          {t("labels.is_current", "Is Current Year")}
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" buttonType="secondary" onClick={onCancel} disabled={isSubmitting}>
          {t("global.cancel", "Cancel")}
        </Button>
        <Button type="submit" buttonType="primary" disabled={isSubmitting} loading={isSubmitting}>
          {t("global.add_academic_year", "Add Academic Year")}
        </Button>
      </div>
    </form>
  );
};

export default AddAcademicYearForm;
