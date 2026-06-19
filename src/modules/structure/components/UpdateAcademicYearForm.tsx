import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { academicYearApi } from '../api/academicYearApi';
import type { AcademicYear, UpdateAcademicYearPayload } from '../api/academicYearApi';
import { toaster } from '@/components/ui/toaster';

interface UpdateAcademicYearFormProps {
  academicYear: AcademicYear;
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateAcademicYearForm = ({ academicYear, onSuccess, onCancel }: UpdateAcademicYearFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateAcademicYearPayload>({
    defaultValues: {
      name: academicYear.name,
      isCurrent: academicYear.isCurrent,
      startDate: formatDate(academicYear.startDate),
      endDate: formatDate(academicYear.endDate),
    }
  });

  const onSubmit = async (data: UpdateAcademicYearPayload) => {
    try {
      setIsSubmitting(true);
      await academicYearApi.updateAcademicYear(academicYear.id, {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      });
      toaster.create({ title: 'Success', description: 'Academic year updated successfully', type: 'success' });
      onSuccess();
    } catch (error: any) {
      toaster.create({ title: 'Error', description: error?.response?.data?.message || 'Failed to update academic year', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Input
        label={t("labels.name", "Name")}
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
          {t("global.update_academic_year", "Update Academic Year")}
        </Button>
      </div>
    </form>
  );
};

export default UpdateAcademicYearForm;
