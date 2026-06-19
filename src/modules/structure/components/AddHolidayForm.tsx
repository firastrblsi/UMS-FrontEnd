import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { holidayApi } from '../api/holidayApi';
import type { CreateHolidayPayload } from '../api/holidayApi';
import { toaster } from '@/components/ui/toaster';

interface AddHolidayFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddHolidayForm = ({ onSuccess, onCancel }: AddHolidayFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateHolidayPayload>();

  const onSubmit = async (data: CreateHolidayPayload) => {
    try {
      setIsSubmitting(true);
      await holidayApi.createHoliday({
        ...data,
        date: new Date(data.date).toISOString(),
      });
      toaster.create({ title: 'Success', description: 'Holiday added successfully', type: 'success' });
      onSuccess();
    } catch (error: any) {
      toaster.create({ title: 'Error', description: error?.response?.data?.message || 'Failed to add holiday', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Input label={t("labels.name", "Name")} placeholder="e.g. New Year" {...register('name', { required: 'Name is required' })} error={errors.name?.message} required />
      
      <Input type="date" label={t("labels.date", "Date")} {...register('date', { required: 'Required' })} error={errors.date?.message} required />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" buttonType="secondary" onClick={onCancel} disabled={isSubmitting}>{t("global.cancel", "Cancel")}</Button>
        <Button type="submit" buttonType="primary" disabled={isSubmitting} loading={isSubmitting}>{t("global.add_holiday", "Add Holiday")}</Button>
      </div>
    </form>
  );
};

export default AddHolidayForm;
