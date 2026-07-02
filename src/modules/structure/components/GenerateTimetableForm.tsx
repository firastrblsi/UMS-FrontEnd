import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { timetableSessionApi } from '../api/timetableSessionApi';
import { classGroupApi } from '../api/classGroupApi';
import { toaster } from '@/components/ui/toaster';

const generateSchema = z.object({
  classGroupId: z.string().min(1, 'Class Group is required'),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().min(1, 'End Date is required'),
});

type GenerateFormValues = z.infer<typeof generateSchema>;

interface GenerateTimetableFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function GenerateTimetableForm({ onSuccess, onCancel }: GenerateTimetableFormProps) {
  const { t } = useTranslation();
  const [classGroups, setClassGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema) as any,
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await classGroupApi.getClassGroups({ skip: 0, take: 500 });
        setClassGroups(res.data);
      } catch (error) {
        toaster.create({ title: "Failed to load class groups", type: "error" });
      }
    };
    fetchGroups();
  }, []);

  const onSubmit = async (formData: GenerateFormValues) => {
    try {
      setIsLoading(true);
      await timetableSessionApi.generateTimetableSessions({
        classGroupId: formData.classGroupId,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      } as any);
      toaster.create({ title: t("global.success", "Timetable generated successfully"), type: "success" });
      onSuccess();
    } catch (error) {
      toaster.create({ title: t("global.error", "An error occurred"), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Select
          label={t("routes.class_groups", "Class Group")}
          options={classGroups.map(cg => ({ value: cg.id, label: cg.name }))}
          error={errors.classGroupId?.message}
          value={watch("classGroupId")}
          {...register('classGroupId')}
          placeholder="Select Class Group"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          error={errors.startDate?.message}
          {...register("startDate")}
        />
        <Input
          label="End Date"
          type="date"
          error={errors.endDate?.message}
          {...register("endDate")}
        />
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
          {t("global.save", "Generate")}
        </Button>
      </div>
    </form>
  );
}
