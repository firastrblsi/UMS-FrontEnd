import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Stepper from '@/shared/ui/Stepper';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { studentApi } from '../api/studentApi';
import { toaster } from '@/components/ui/toaster';
import { programApi } from '@/modules/structure/api/programApi';
import { classGroupApi } from '@/modules/structure/api/classGroupApi';
import type { ClassGroup } from '@/modules/structure/api/classGroupApi';

// Zod Validation Schema
const studentSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  programId: z.string().min(1, 'Program is required'),
  classGroupId: z.string().optional(),
  nationalId: z.string().min(1, 'National ID is required'),
  studentNumber: z.string().optional(),
  scholarshipType: z.any().optional(),
  status: z.any().optional(),
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
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface AddStudentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddStudentForm = ({ onSuccess, onCancel }: AddStudentFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'User Details', fields: ['firstName', 'lastName', 'nationality', 'email', 'phone', 'gender'] as const },
    { label: 'Academic Profile', fields: ['nationalId', 'programId', 'classGroupId', 'status', 'scholarshipType'] as const },
    { label: 'Enrollment Info', fields: ['enrollmentDate', 'expectedGradDate', 'actualGradDate', 'currentYearNumber', 'transportMode', 'previousInstitution', 'baccalaureateField', 'baccalaureateYear', 'baccalaureateGrade'] as const },
    { label: 'Guardian & Medical', fields: ['guardianName', 'guardianPhone', 'guardianEmail', 'guardianRelation', 'hasMedicalNeeds', 'medicalNotes'] as const },
  ];
  
  const [programs, setPrograms] = useState<{value: string, label: string}[]>([]);
  const [classGroups, setClassGroups] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    programApi.getPrograms({ take: 100 })
      .then(res => setPrograms(res.data.map(p => ({ value: p.id, label: p.name }))))
      .catch(console.error);
    
    classGroupApi.getClassGroups({ take: 100 })
      .then(res => setClassGroups(res.data.map((cg: ClassGroup) => ({ value: cg.id, label: cg.name }))))
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
    trigger,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      status: 'ENROLLED',
      scholarshipType: 'NONE',
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
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
      await studentApi.createStudent(payload);
      toaster.create({
        title: 'Success',
        description: 'Student created successfully.',
        type: 'success',
        duration: 3000,
      });
      onSuccess();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      const description = Array.isArray(errorMessage) 
        ? errorMessage.join(', ') 
        : errorMessage || 'Failed to create student';

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

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    const fields = steps[currentStep].fields;
    const isStepValid = await trigger(fields as unknown as (keyof StudentFormValues)[]);
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Stepper steps={steps} currentStep={currentStep} />

      {currentStep === 0 && (
        <div className="pt-4">
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
                label={t("student.nationality")}
                placeholder="Enter nationality"
                {...register('nationality')}
                error={errors.nationality?.message}
                required
              />
            </div>
            
            <div className="flex flex-col gap-4">
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
                error={errors.gender?.message as string}
                options={[
                  { value: '', label: t("student.gender_enum.select") || 'Select Gender' },
                  { value: 'MALE', label: t("student.gender_enum.MALE") || 'Male' },
                  { value: 'FEMALE', label: t("student.gender_enum.FEMALE") || 'Female' },
                ]}
                required
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Input
                label={t('student.national_id', 'National ID')}
                placeholder="Enter national ID"
                {...register('nationalId')}
                error={errors.nationalId?.message}
                required
              />
              <Select
                label={t("student.program")}
                {...register('programId')}
                error={errors.programId?.message as string}
                options={[{ value: '', label: 'Select Program' }, ...programs]}
                required
              />
              <Select
                label={t("student.class_group")}
                {...register('classGroupId')}
                error={errors.classGroupId?.message as string}
                options={[{ value: '', label: 'Select Class Group' }, ...classGroups]}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Select
                label={t("labels.status")}
                {...register('status')}
                error={errors.status?.message as string}
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
                error={errors.scholarshipType?.message as string}
                options={[
                  { value: 'NONE', label: t("student.scholarship.NONE") },
                  { value: 'PARTIAL', label: t("student.scholarship.PARTIAL") },
                  { value: 'FULL', label: t("student.scholarship.FULL") },
                  { value: 'MERIT', label: t("student.scholarship.MERIT") },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Input
                label={t("student.enrollment_date")}
                type="date"
                {...register('enrollmentDate')}
                error={errors.enrollmentDate?.message}
              />
              <Input
                label={t("student.expected_grad_date")}
                type="date"
                {...register('expectedGradDate')}
                error={errors.expectedGradDate?.message}
              />
              <Input
                label={t("student.actual_grad_date")}
                type="date"
                {...register('actualGradDate')}
                error={errors.actualGradDate?.message}
              />
              <Input
                label={t("student.current_year_number")}
                type="number"
                placeholder="e.g. 1"
                {...register('currentYearNumber')}
                error={errors.currentYearNumber?.message}
              />
              <Input
                label={t("student.transport_mode")}
                placeholder="Enter transport mode"
                {...register('transportMode')}
                error={errors.transportMode?.message}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Input
                label={t("student.previous_institution")}
                placeholder="Enter previous institution"
                {...register('previousInstitution')}
                error={errors.previousInstitution?.message}
              />
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
              <Input
                label={t("student.baccalaureate_grade")}
                placeholder="e.g. 15.5"
                {...register('baccalaureateGrade')}
                error={errors.baccalaureateGrade?.message}
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
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
              <Input
                label={t("student.guardian_email")}
                type="email"
                placeholder="Enter guardian email"
                {...register('guardianEmail')}
                error={errors.guardianEmail?.message}
              />
              <Input
                label={t("student.guardian_relation")}
                placeholder="e.g. Father, Mother"
                {...register('guardianRelation')}
                error={errors.guardianRelation?.message}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mt-8">
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
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t mt-2">
        <Button
          type="button"
          buttonType="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("student.cancel")}
        </Button>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              type="button"
              buttonType="secondary"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              buttonType="primary"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              buttonType="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {t("student.add_student")}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddStudentForm;
