import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { classGroupApi } from '../api/classGroupApi';
import type { ClassGroup, UpdateClassGroupPayload } from '../api/classGroupApi';
import { programApi } from '../api/programApi';
import { academicYearApi } from '../api/academicYearApi';
import { toaster } from '@/components/ui/toaster';

interface UpdateClassGroupFormProps {
  classGroup: ClassGroup;
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateClassGroupForm = ({ classGroup, onSuccess, onCancel }: UpdateClassGroupFormProps) => {
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

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateClassGroupPayload>({
    defaultValues: {
      name: classGroup.name,
      capacity: classGroup.capacity,
      programId: classGroup.programId,
      academicYearId: classGroup.academicYearId,
    }
  });

  const onSubmit = async (data: UpdateClassGroupPayload) => {
    try {
      setIsSubmitting(true);
      await classGroupApi.updateClassGroup(classGroup.id, {
        ...data,
        capacity: data.capacity ? Number(data.capacity) : undefined,
      });
      toaster.create({ title: 'Success', description: 'Class Group updated successfully', type: 'success' });
      onSuccess();
    } catch (error: any) {
      toaster.create({ title: 'Error', description: error?.response?.data?.message || 'Failed to update class group', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Input label={t("labels.name", "Name")} {...register('name', { required: 'Name is required' })} error={errors.name?.message} required />
      
      <Input type="number" label={t("labels.capacity", "Capacity")} {...register('capacity', { required: 'Required', min: 1 })} error={errors.capacity?.message} required />

      <Select label={t("labels.program", "Program")} {...register('programId', { required: 'Required' })} error={errors.programId?.message} options={[{ value: '', label: 'Select Program' }, ...programs]} />
      <Select label={t("labels.academic_year", "Academic Year")} {...register('academicYearId', { required: 'Required' })} error={errors.academicYearId?.message} options={[{ value: '', label: 'Select Year' }, ...academicYears]} />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" buttonType="secondary" onClick={onCancel} disabled={isSubmitting}>{t("global.cancel", "Cancel")}</Button>
        <Button type="submit" buttonType="primary" disabled={isSubmitting} loading={isSubmitting}>{t("global.update_class_group", "Update Class Group")}</Button>
      </div>
    </form>
  );
};

export default UpdateClassGroupForm;
