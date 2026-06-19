import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { holidayApi } from '../api/holidayApi';
import type { Holiday, UpdateHolidayPayload } from '../api/holidayApi';
import { toaster } from '@/components/ui/toaster';

interface UpdateHolidayFormProps {
  holiday: Holiday;
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateHolidayForm = ({ holiday, onSuccess, onCancel }: UpdateHolidayFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  };

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateHolidayPayload>({
    defaultValues: {
      name: holiday.name,
      date: formatDate(holiday.date),
    }
  });

  const onSubmit = async (data: UpdateHolidayPayload) => {
    try {
      setIsSubmitting(true);
      await holidayApi.updateHoliday(holiday.id, {
        ...data,
        date: data.date ? new Date(data.date).toISOString() : undefined,
      });
      toaster.create({ title: 'Success', description: 'Holiday updated successfully', type: 'success' });
      onSuccess();
    } catch (error: any) {
      toaster.create({ title: 'Error', description: error?.response?.data?.message || 'Failed to update holiday', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Input label={t("labels.name", "Name")} {...register('name', { required: 'Name is required' })} error={errors.name?.message} required />
      
      <Input type="date" label={t("labels.date", "Date")} {...register('date', { required: 'Required' })} error={errors.date?.message} required />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" buttonType="secondary" onClick={onCancel} disabled={isSubmitting}>{t("global.cancel", "Cancel")}</Button>
        <Button type="submit" buttonType="primary" disabled={isSubmitting} loading={isSubmitting}>{t("global.update_holiday", "Update Holiday")}</Button>
      </div>
    </form>
  );
};

export default UpdateHolidayForm;
