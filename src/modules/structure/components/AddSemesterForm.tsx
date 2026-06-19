import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { semesterApi } from '../api/semesterApi';
import type { CreateSemesterPayload } from '../api/semesterApi';
import { academicYearApi } from '../api/academicYearApi';
import { toaster } from '@/components/ui/toaster';

interface AddSemesterFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddSemesterForm = ({ onSuccess, onCancel }: AddSemesterFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [academicYears, setAcademicYears] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    academicYearApi.getAcademicYears({ take: 100 })
      .then(res => setAcademicYears(res.data.map(y => ({ value: y.id, label: y.name }))))
      .catch(console.error);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateSemesterPayload>();

  const onSubmit = async (data: CreateSemesterPayload) => {
    try {
      setIsSubmitting(true);
      await semesterApi.createSemester({
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        registrationDeadline: new Date(data.registrationDeadline).toISOString(),
        examStartDate: new Date(data.examStartDate).toISOString(),
      });
      toaster.create({ title: 'Success', description: 'Semester added successfully', type: 'success' });
      onSuccess();
    } catch (error: any) {
      toaster.create({ title: 'Error', description: error?.response?.data?.message || 'Failed to add semester', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Input label={t("labels.name", "Name")} placeholder="e.g. S1" {...register('name', { required: 'Name is required' })} error={errors.name?.message} required />
      
      <Select label={t("labels.academic_year", "Academic Year")} {...register('academicYearId', { required: 'Academic Year is required' })} error={errors.academicYearId?.message} options={[{ value: '', label: 'Select Year' }, ...academicYears]} />

      <div className="grid grid-cols-2 gap-4">
        <Input type="date" label={t("labels.start_date", "Start Date")} {...register('startDate', { required: 'Required' })} error={errors.startDate?.message} required />
        <Input type="date" label={t("labels.end_date", "End Date")} {...register('endDate', { required: 'Required' })} error={errors.endDate?.message} required />
        <Input type="date" label={t("labels.registration_deadline", "Registration Deadline")} {...register('registrationDeadline', { required: 'Required' })} error={errors.registrationDeadline?.message} required />
        <Input type="date" label={t("labels.exam_start_date", "Exam Start Date")} {...register('examStartDate', { required: 'Required' })} error={errors.examStartDate?.message} required />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" buttonType="secondary" onClick={onCancel} disabled={isSubmitting}>{t("global.cancel", "Cancel")}</Button>
        <Button type="submit" buttonType="primary" disabled={isSubmitting} loading={isSubmitting}>{t("global.add_semester", "Add Semester")}</Button>
      </div>
    </form>
  );
};

export default AddSemesterForm;
