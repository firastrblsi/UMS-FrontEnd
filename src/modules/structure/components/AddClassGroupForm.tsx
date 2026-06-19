import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { classGroupApi } from '../api/classGroupApi';
import type { CreateClassGroupPayload } from '../api/classGroupApi';
import { programApi } from '../api/programApi';
import { academicYearApi } from '../api/academicYearApi';
import { toaster } from '@/components/ui/toaster';

interface AddClassGroupFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddClassGroupForm = ({ onSuccess, onCancel }: AddClassGroupFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState<{value: string, label: string}[]>([]);
  const [academicYears, setAcademicYears] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    programApi.getPrograms({ take: 100 })
      .then(res => setPrograms(res.data.map(p => ({ value: p.id, label: p.name }))))
      .catch(console.error);
    academicYearApi.getAcademicYears({ take: 100 })
      .then(res => setAcademicYears(res.data.map(y => ({ value: y.id, label: y.name }))))
      .catch(console.error);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateClassGroupPayload>();

  const onSubmit = async (data: CreateClassGroupPayload) => {
    try {
      setIsSubmitting(true);
      await classGroupApi.createClassGroup({
        ...data,
        capacity: Number(data.capacity),
      });
      toaster.create({ title: 'Success', description: 'Class Group added successfully', type: 'success' });
      onSuccess();
    } catch (error: any) {
      toaster.create({ title: 'Error', description: error?.response?.data?.message || 'Failed to add class group', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Input label={t("labels.name", "Name")} placeholder="e.g. GL-1" {...register('name', { required: 'Name is required' })} error={errors.name?.message} required />
      
      <Input type="number" label={t("labels.capacity", "Capacity")} {...register('capacity', { required: 'Required', min: 1 })} error={errors.capacity?.message} required />

      <Select label={t("labels.program", "Program")} {...register('programId', { required: 'Required' })} error={errors.programId?.message} options={[{ value: '', label: 'Select Program' }, ...programs]} />
      <Select label={t("labels.academic_year", "Academic Year")} {...register('academicYearId', { required: 'Required' })} error={errors.academicYearId?.message} options={[{ value: '', label: 'Select Year' }, ...academicYears]} />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" buttonType="secondary" onClick={onCancel} disabled={isSubmitting}>{t("global.cancel", "Cancel")}</Button>
        <Button type="submit" buttonType="primary" disabled={isSubmitting} loading={isSubmitting}>{t("global.add_class_group", "Add Class Group")}</Button>
      </div>
    </form>
  );
};

export default AddClassGroupForm;
