import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { departmentApi } from '../api/departmentApi';
import { toaster } from '@/components/ui/toaster';

const departmentSchema = z.object({
  name: z.string().min(2, 'Department name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.any().optional(),
  isActive: z.any().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface AddDepartmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddDepartmentForm = ({ onSuccess, onCancel }: AddDepartmentFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const onSubmit = async (data: DepartmentFormValues) => {
    try {
      setIsSubmitting(true);
      await departmentApi.createDepartment(data);
      toaster.create({
        title: 'Success',
        description: 'Department created successfully.',
        type: 'success',
        duration: 3000,
      });
      onSuccess();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      const description = Array.isArray(errorMessage) 
        ? errorMessage.join(', ') 
        : errorMessage || 'Failed to create department';

      toaster.create({
        title: 'Error',
        description,
        type: 'error',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit, (errs) => {
        console.error("Form Validation Errors:", errs);
        toaster.create({ title: "Validation Error", description: "Check form fields", type: "error" });
      })} 
      className="flex flex-col gap-6" 
      noValidate
    >
      <div className="flex flex-col gap-4">
        <Input
          label={t("global.department_name") || "Department Name"}
          placeholder="e.g. Computer Science"
          {...register('name')}
          error={errors.name?.message}
          required
        />
        
        <Input
          label={t("global.code") || "Code"}
          placeholder="e.g. CS"
          {...register('code')}
          error={errors.code?.message}
          required
        />
        
        <Input
          label={t("global.description") || "Description"}
          placeholder="Optional description"
          {...register('description')}
          error={errors.description?.message as string}
        />
        
        <div className="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="isActive" 
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
            {t("global.is_active") || "Is Active"}
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-2">
        <Button
          type="button"
          buttonType="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("global.cancel") || "Cancel"}
        </Button>
        <Button
          type="submit"
          buttonType="primary"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {t("global.add_department") || "Add Department"}
        </Button>
      </div>
    </form>
  );
};

export default AddDepartmentForm;
