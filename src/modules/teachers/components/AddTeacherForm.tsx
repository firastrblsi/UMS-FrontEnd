import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@chakra-ui/react';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { teacherApi } from '../api/teacherApi';
import { departmentApi } from '@/modules/structure/api/departmentApi';
import type { Department } from '@/modules/structure/types/department.types';
import { toaster } from '@/components/ui/toaster';

const teacherSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional().or(z.literal('')),
  nationality: z.string().optional(),
  employeeId: z.string().optional(),
  title: z.any().optional(),
  departmentId: z.string().min(1, 'Department is required'),
  specialization: z.string().optional(),
  highestDegree: z.string().min(1, 'Highest degree is required'),
  degreeField: z.string().optional(),
  degreeInstitution: z.string().optional(),
  contractType: z.string().min(1, 'Contract type is required'),
  hireDate: z.string().optional(),
  endDate: z.string().optional(),
  officeRoom: z.string().optional(),
  officeHours: z.string().optional(),
  professionalEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  bio: z.string().optional(),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

interface AddTeacherFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddTeacherForm = ({ onSuccess, onCancel }: AddTeacherFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<{value: string; label: string}[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    departmentApi.getDepartments({ take: 100 })
      .then(res => {
        setDepartments(res.data.map((d: Department) => ({ value: d.id, label: d.name })));
      })
      .catch(console.error);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      contractType: 'FULL_TIME',
    },
  });

  const onSubmit = async (data: TeacherFormValues) => {
    try {
      setIsSubmitting(true);
      const payload: any = {
        ...data,
        profilePictureFile: avatarFile || undefined,
      };

      Object.keys(payload).forEach(key => {
        if (payload[key] === '') {
          payload[key] = null;
        }
      });
      await teacherApi.createTeacher(payload);
      toaster.create({
        title: 'Success',
        description: 'Teacher created successfully.',
        type: 'success',
      });
      onSuccess();
    } catch (error: any) {
      toaster.create({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to create teacher',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Tabs.Root defaultValue="user" variant="enclosed" colorPalette="blue">
        <Tabs.List>
          <Tabs.Trigger value="user">User Details</Tabs.Trigger>
          <Tabs.Trigger value="professional">Professional</Tabs.Trigger>
          <Tabs.Trigger value="education">Education & Contract</Tabs.Trigger>
          <Tabs.Trigger value="office">Office Info</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="user" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 items-center">
                <div 
                  className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">Upload</span>
                  )}
                </div>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </div>

              <Input
                label={t("teacher.first_name") || "First Name"}
                placeholder="Enter first name"
                {...register('firstName')}
                error={errors.firstName?.message}
                required
              />
              
              <Input
                label={t("teacher.last_name") || "Last Name"}
                placeholder="Enter last name"
                {...register('lastName')}
                error={errors.lastName?.message}
                required
              />
            </div>
            
            <div className="flex flex-col gap-4">
              <Input
                label={t("labels.email") || "Email"}
                type="email"
                placeholder="Enter email address"
                {...register('email')}
                error={errors.email?.message}
                required
              />
              <Input
                label={t("teacher.phone") || "Phone"}
                placeholder="Enter phone number"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <Select
                label={t("teacher.gender") || "Gender"}
                {...register('gender')}
                error={errors.gender?.message as string}
                options={[
                  { value: '', label: t("student.gender_enum.select") || 'Select Gender' },
                  { value: 'MALE', label: t("student.gender_enum.MALE") || 'Male' },
                  { value: 'FEMALE', label: t("student.gender_enum.FEMALE") || 'Female' },
                ]}
                required
              />
              <Input
                label="Nationality"
                placeholder="Enter nationality"
                {...register('nationality')}
                error={errors.nationality?.message}
                required
              />
              <Input
                label="Bio"
                placeholder="Enter brief biography"
                {...register('bio')}
                error={errors.bio?.message}
              />
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="professional" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Select
                label="Title"
                {...register('title')}
                error={errors.title?.message as string}
                options={[
                  { value: '', label: 'Select Title' },
                  { value: 'PROF', label: 'Professor' },
                  { value: 'DR', label: 'Doctor' },
                  { value: 'MR', label: 'Mr.' },
                  { value: 'MRS', label: 'Mrs.' },
                  { value: 'MS', label: 'Ms.' },
                ]}
              />
              <Select
                label="Department"
                {...register('departmentId')}
                error={errors.departmentId?.message as string}
                options={[{ value: '', label: 'Select Department' }, ...departments]}
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <Input
                label="Specialization"
                placeholder="e.g. Artificial Intelligence"
                {...register('specialization')}
                error={errors.specialization?.message}
              />
              <Input
                label="Professional Email"
                type="email"
                placeholder="Enter professional email"
                {...register('professionalEmail')}
                error={errors.professionalEmail?.message}
              />
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="education" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Select
                label="Highest Degree"
                {...register('highestDegree')}
                error={errors.highestDegree?.message as string}
                options={[
                  { value: '', label: 'Select Degree' },
                  { value: 'PHD', label: 'Ph.D.' },
                  { value: 'MASTER', label: 'Master' },
                  { value: 'BACHELOR', label: 'Bachelor' },
                  { value: 'OTHER', label: 'Other' },
                ]}
                required
              />
              <Input
                label="Degree Field"
                placeholder="e.g. Computer Science"
                {...register('degreeField')}
                error={errors.degreeField?.message}
              />
              <Input
                label="Degree Institution"
                placeholder="Enter institution name"
                {...register('degreeInstitution')}
                error={errors.degreeInstitution?.message}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Select
                label="Contract Type"
                {...register('contractType')}
                error={errors.contractType?.message as string}
                options={[
                  { value: '', label: 'Select Type' },
                  { value: 'PERMANENT', label: 'Permanent' },
                  { value: 'CONTRACT', label: 'Contract' },
                  { value: 'PART_TIME', label: 'Part Time' },
                  { value: 'VISITING', label: 'Visiting' },
                ]}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Hire Date"
                  type="date"
                  {...register('hireDate')}
                  error={errors.hireDate?.message}
                />
                <Input
                  label="End Date"
                  type="date"
                  {...register('endDate')}
                  error={errors.endDate?.message}
                />
              </div>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="office" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Input
                label="Office Room"
                placeholder="e.g. A-102"
                {...register('officeRoom')}
                error={errors.officeRoom?.message}
              />
              <Input
                label="Office Hours"
                placeholder="e.g. Mon-Wed 10:00-12:00"
                {...register('officeHours')}
                error={errors.officeHours?.message}
              />
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Action Buttons */}
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
          {t("global.add_teacher") || "Add Teacher"}
        </Button>
      </div>
    </form>
  );
};

export default AddTeacherForm;
