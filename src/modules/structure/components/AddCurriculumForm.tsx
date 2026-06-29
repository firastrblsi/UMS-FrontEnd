import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { curriculumApi } from '../api/curriculumApi';
import { programApi } from '../api/programApi';
import { teachingModuleApi } from '../api/teachingModuleApi';
import { toaster } from '@/components/ui/toaster';
import type { Program, TeachingModule } from '../types/university.types';
import { Trash2, Plus } from 'lucide-react';

const curriculumSchema = z.object({
  programId: z.string().min(1, 'Program is required'),
  yearNumber: z.coerce.number().int().min(1, 'Year number must be positive'),
  termNumber: z.coerce.number().int().min(1, 'Term number must be positive'),
  modules: z.array(z.object({
    teachingModuleId: z.string().min(1, 'Module is required'),
    isMandatory: z.boolean().default(true),
  })).optional(),
});

type CurriculumFormValues = z.infer<typeof curriculumSchema>;

interface AddCurriculumFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddCurriculumForm({ onSuccess, onCancel }: AddCurriculumFormProps) {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [teachingModules, setTeachingModules] = useState<TeachingModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<CurriculumFormValues>({
    resolver: zodResolver(curriculumSchema) as any,
    defaultValues: {
      yearNumber: 1,
      termNumber: 1,
      modules: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "modules"
  });

  useEffect(() => {
    Promise.all([
      programApi.getPrograms({ skip: 0, take: 100 }),
      teachingModuleApi.getTeachingModules({ skip: 0, take: 500 })
    ]).then(([progRes, modRes]) => {
      setPrograms(progRes.data);
      setTeachingModules(modRes.data);
    }).catch(() => {
      toaster.create({ title: "Failed to load data", type: "error" });
    });
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await curriculumApi.createCurriculum(data);
      toaster.create({ title: t("global.created", "Created successfully"), type: "success" });
      onSuccess();
    } catch (error: any) {
      toaster.create({ title: error.response?.data?.message || t("global.error", "An error occurred"), type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label={t("labels.program_name", "Program")}
          options={programs.map(p => ({ value: p.id, label: p.name }))}
          error={errors.programId?.message}
          value={watch("programId")}
          {...register('programId')}
          placeholder="Select Program"
        />
        <Input
          label={t("labels.year_number", "Year Number")}
          type="number"
          error={errors.yearNumber?.message}
          {...register("yearNumber")}
        />
        <Input
          label={t("labels.term_number", "Term Number")}
          type="number"
          error={errors.termNumber?.message}
          {...register("termNumber")}
        />
      </div>

      <div className="border-t border-slate-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800">{t("routes.teaching_modules", "Teaching Modules")}</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ teachingModuleId: '', isMandatory: true })}
            className="flex items-center gap-1"
          >
            <Plus size={16} /> Add Module
          </Button>
        </div>

        <div className="space-y-3">
          {fields.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              No modules added yet. Click "Add Module" to start building this curriculum.
            </p>
          )}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex-1">
                <Select
                  label="Select Teaching Module"
                  options={teachingModules.map(m => ({ value: m.id, label: `${m.code} - ${m.name}` }))}
                  error={errors.modules?.[index]?.teachingModuleId?.message}
                  value={watch(`modules.${index}.teachingModuleId` as const)}
                  {...register(`modules.${index}.teachingModuleId` as const)}
                  placeholder="Select Module"
                />
              </div>
              <div className="flex items-center gap-2 h-[43px] px-2">
                <input
                  type="checkbox"
                  id={`mandatory-${index}`}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register(`modules.${index}.isMandatory` as const)}
                />
                <label htmlFor={`mandatory-${index}`} className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Is Mandatory
                </label>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors h-[43px]"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("global.cancel", "Cancel")}
        </Button>
        <Button type="submit" loading={isLoading}>
          {t("global.save", "Save")}
        </Button>
      </div>
    </form>
  );
}
