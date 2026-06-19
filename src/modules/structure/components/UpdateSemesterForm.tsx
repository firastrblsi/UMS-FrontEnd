import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { semesterApi } from '../api/semesterApi';
import type { Semester, UpdateSemesterPayload } from '../api/semesterApi';
import { academicYearApi } from '../api/academicYearApi';
import { toaster } from '@/components/ui/toaster';

interface UpdateSemesterFormProps {
  semester: Semester;
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateSemesterForm = ({ semester, onSuccess, onCancel }: UpdateSemesterFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [academicYears, setAcademicYears] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    academicYearApi.getAcademicYears({ take: 100 })
      .then(res => setAcademicYears(res.data.map(y => ({ value: y.id, label: y.name }))))
      .catch(console.error);
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  };

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateSemesterPayload>({
    defaultValues: {
      name: semester.name,
      academicYearId: semester.academicYearId,
      startDate: formatDate(semester.startDate),
      endDate: formatDate(semester.endDate),
      registrationDeadline: formatDate(semester.registrationDeadline),
      examStartDate: formatDate(semester.examStartDate),
    }
  });

  const onSubmit = async (data: UpdateSemesterPayload) => {
    try {
      setIsSubmitting(true);
      await semesterApi.updateSemester(semester.id, {
        ...data,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString() : undefined,
        examStartDate: data.examStartDate ? new Date(data.examStartDate).toISOString() : undefined,
      });
      toaster.create({ title: 'Success', description: 'Semester updated successfully', type: 'success' });
      onSuccess();
    } catch (error: any) {
      toaster.create({ title: 'Error', description: error?.response?.data?.message || 'Failed to update semester', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Input label={t("labels.name", "Name")} {...register('name', { required: 'Name is required' })} error={errors.name?.message} required />
      
      <Select label={t("labels.academic_year", "Academic Year")} {...register('academicYearId', { required: 'Academic Year is required' })} error={errors.academicYearId?.message} options={[{ value: '', label: 'Select Year' }, ...academicYears]} />

      <div className="grid grid-cols-2 gap-4">
        <Input type="date" label={t("labels.start_date", "Start Date")} {...register('startDate', { required: 'Required' })} error={errors.startDate?.message} required />
        <Input type="date" label={t("labels.end_date", "End Date")} {...register('endDate', { required: 'Required' })} error={errors.endDate?.message} required />
        <Input type="date" label={t("labels.registration_deadline", "Registration Deadline")} {...register('registrationDeadline', { required: 'Required' })} error={errors.registrationDeadline?.message} required />
        <Input type="date" label={t("labels.exam_start_date", "Exam Start Date")} {...register('examStartDate', { required: 'Required' })} error={errors.examStartDate?.message} required />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" buttonType="secondary" onClick={onCancel} disabled={isSubmitting}>{t("global.cancel", "Cancel")}</Button>
        <Button type="submit" buttonType="primary" disabled={isSubmitting} loading={isSubmitting}>{t("global.update_semester", "Update Semester")}</Button>
      </div>
    </form>
  );
};

export default UpdateSemesterForm;
