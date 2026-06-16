import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { studentApi } from '../api/studentApi';
import type { UpdateStudentPayload } from '../api/studentApi';
import type { Student } from '../types/student.types';
import { toaster } from '@/components/ui/toaster';

// Zod Validation Schema
const studentSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  gender: z.string().optional().transform(v => v === '' ? undefined : v as any),
  nationality: z.string().optional(),
  studentNumber: z.string().optional(),
  programId: z.string().optional(),
  nationalId: z.string().optional(),
  scholarshipType: z.string().optional().transform(v => v === '' ? undefined : v as any),
  status: z.string().optional().transform(v => v === '' ? undefined : v as any),
  guardianName: z.string().optional(),
  guardianEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  guardianPhone: z.string().optional(),
  guardianRelation: z.string().optional(),
  hasMedicalNeeds: z.boolean().optional(),
  medicalNotes: z.string().optional(),
  enrollmentDate: z.string().optional(),
  expectedGradDate: z.string().optional(),
  actualGradDate: z.string().optional(),
  previousInstitution: z.string().optional(),
  transportMode: z.string().optional(),
  baccalaureateField: z.string().optional(),
  baccalaureateGrade: z.string().optional(),
  baccalaureateYear: z.string().optional(),
  currentYearNumber: z.string().optional(),
  classGroupId: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface UpdateStudentFormProps {
  student: Student;
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateStudentForm = ({ student, onSuccess, onCancel }: UpdateStudentFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: student.user?.firstName || '',
      lastName: student.user?.lastName || '',
      email: student.user?.email || '',
      phone: student.user?.phone || '',
      gender: student.user?.gender as any || '',
      studentNumber: student.studentNumber || '',
      nationalId: student.nationalId || '',
      status: student.status || 'ENROLLED',
      scholarshipType: student.scholarshipType || 'NONE',
      guardianName: student.guardianName || '',
      guardianEmail: student.guardianEmail || '',
      guardianPhone: student.guardianPhone || '',
      guardianRelation: student.guardianRelation || '',
      hasMedicalNeeds: student.hasMedicalNeeds || false,
      medicalNotes: student.medicalNotes || '',
      enrollmentDate: student.enrollmentDate ? student.enrollmentDate.substring(0, 10) : '',
      currentYearNumber: student.currentYearNumber?.toString() || '',
      previousInstitution: student.previousInstitution || '',
      baccalaureateField: student.baccalaureateField || '',
      baccalaureateYear: student.baccalaureateYear?.toString() || '',
    },
  });
  
  console.log("Current Form Errors:", errors);

  const onSubmit = async (data: StudentFormValues) => {
    try {
      setIsSubmitting(true);
      const payload: UpdateStudentPayload = {
        ...data,
      } as UpdateStudentPayload;
      
      if (student.user) {
        await studentApi.updateStudent(student.id, student.user.id, payload);
      }

      if (avatarFile && student.user) {
        await studentApi.uploadProfilePicture(student.user.id, avatarFile);
      }

      toaster.create({
        title: 'Success',
        description: 'Student updated successfully.',
        type: 'success',
        duration: 3000,
      });
      onSuccess();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      const description = Array.isArray(errorMessage) 
        ? errorMessage.join(', ') 
        : errorMessage || 'Failed to update student';

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

  const onError = (errors: any) => {
    console.log("Form Validation Failed:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Details */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">User Details</h3>
          
          {/* Avatar Upload */}
          <div className="flex flex-col gap-2 items-center">
            <div 
              className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : student.user?.profilePicture ? (
                <img src={student.user.profilePicture.url} alt="Avatar" className="w-full h-full object-cover" />
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
            label={t("student.first_name")}
            placeholder="Enter first name"
            {...register('firstName')}
            error={errors.firstName?.message}
            required
          />
          
          <Input
            label={t("student.last_name")}
            placeholder="Enter last name"
            {...register('lastName')}
            error={errors.lastName?.message}
            required
          />
          
          <Input
            label={t("labels.email")}
            type="email"
            placeholder="Enter email address"
            {...register('email')}
            error={errors.email?.message}
            required
          />
          
          <Input
            label={t("student.phone")}
            placeholder="Enter phone number"
            {...register('phone')}
            error={errors.phone?.message}
          />
          
          <Select
            label={t("student.gender")}
            {...register('gender')}
            error={errors.gender?.message}
            options={[
              { value: '', label: t("student.gender_enum.select") },
              { value: 'MALE', label: t("student.gender_enum.MALE") },
              { value: 'FEMALE', label: t("student.gender_enum.FEMALE") },
              { value: 'OTHER', label: t("student.gender_enum.OTHER") },
            ]}
          />
        </div>

        {/* Student Profile Details */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Academic Profile</h3>
          
          <Input
            label={t("student.student_id")}
            placeholder="Enter student ID"
            {...register('studentNumber')}
            error={errors.studentNumber?.message}
          />

          <Input
            label={t("student.national_id")}
            placeholder="Enter national ID"
            {...register('nationalId')}
            error={errors.nationalId?.message}
          />

          <Select
            label={t("labels.status")}
            {...register('status')}
            error={errors.status?.message}
            options={[
              { value: 'ENROLLED', label: t("student.status.ENROLLED") },
              { value: 'SUSPENDED', label: t("student.status.SUSPENDED") },
              { value: 'GRADUATED', label: t("student.status.GRADUATED") },
              { value: 'WITHDRAWN', label: t("student.status.WITHDRAWN") },
              { value: 'DEFERRED', label: t("student.status.DEFERRED") },
            ]}
          />

          <Select
            label={t("student.scholarship_type")}
            {...register('scholarshipType')}
            error={errors.scholarshipType?.message}
            options={[
              { value: 'NONE', label: t("student.scholarship.NONE") },
              { value: 'PARTIAL', label: t("student.scholarship.PARTIAL") },
              { value: 'FULL', label: t("student.scholarship.FULL") },
              { value: 'MERIT', label: t("student.scholarship.MERIT") },
            ]}
          />
        </div>

        {/* Academic Details (Extended) */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Enrollment & Previous Education</h3>
          
          <Input
            label={t("student.enrollment_date")}
            type="date"
            {...register('enrollmentDate')}
            error={errors.enrollmentDate?.message}
          />

          <Input
            label={t("student.current_year_number")}
            type="number"
            placeholder="e.g. 1"
            {...register('currentYearNumber')}
            error={errors.currentYearNumber?.message}
          />

          <Input
            label={t("student.previous_institution")}
            placeholder="Enter previous institution"
            {...register('previousInstitution')}
            error={errors.previousInstitution?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("student.baccalaureate_field")}
              placeholder="e.g. Science"
              {...register('baccalaureateField')}
              error={errors.baccalaureateField?.message}
            />
            <Input
              label={t("student.baccalaureate_year")}
              type="number"
              placeholder="YYYY"
              {...register('baccalaureateYear')}
              error={errors.baccalaureateYear?.message}
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Guardian & Medical Info</h3>
          
          <Input
            label={t("student.guardian_name")}
            placeholder="Enter guardian name"
            {...register('guardianName')}
            error={errors.guardianName?.message}
          />
          
          <Input
            label={t("student.guardian_phone")}
            placeholder="Enter guardian phone"
            {...register('guardianPhone')}
            error={errors.guardianPhone?.message}
          />

          <div className="flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              id="hasMedicalNeeds" 
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('hasMedicalNeeds')}
            />
            <label htmlFor="hasMedicalNeeds" className="text-sm font-medium text-slate-700">
              {t("student.has_medical_needs")}
            </label>
          </div>

          <Input
            label={t("student.medical_notes")}
            placeholder="Describe any medical conditions"
            {...register('medicalNotes')}
            error={errors.medicalNotes?.message}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t mt-2">
        <Button
          type="button"
          buttonType="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("student.cancel")}
        </Button>
        <Button
          type="submit"
          buttonType="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {t("student.save_changes")}
        </Button>
      </div>
    </form>
  );
};

export default UpdateStudentForm;
