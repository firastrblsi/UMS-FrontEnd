import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Tabs } from "@chakra-ui/react";
import { Button } from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import { userApi } from "@/modules/auth/api/userApi";
import { studentApi } from "@/modules/students/api/studentApi";
import { teacherApi } from "@/modules/teachers/api/teacherApi";
import { toaster } from "@/components/ui/toaster";
import { useAppDispatch } from "@/core/hooks/useAppDispatch";
import { setUser } from "@/modules/auth/redux/authSlice";
import type { User } from "@/modules/auth/types/auth";
import type { Student } from "@/modules/students/types/student.types";
import type { Teacher } from "@/modules/teachers/types/teacher.types";

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  firstName: z.string().min(1, "Required").max(50).optional(),
  lastName: z.string().min(1, "Required").max(50).optional(),
  phone: z.string().max(20).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  nationality: z.string().max(100).optional(),

  // Student guardian
  guardianName: z.string().optional(),
  guardianRelation: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email().optional().or(z.literal("")),

  // Student medical
  hasMedicalNeeds: z.boolean().optional(),
  medicalNotes: z.string().optional(),
  transportMode: z.string().optional(),
  nationalId: z.string().optional(),
  previousInstitution: z.string().optional(),

  // Teacher professional
  title: z.string().optional(),
  specialization: z.string().optional(),
  officeRoom: z.string().optional(),
  officeHours: z.string().optional(),
  professionalEmail: z.string().email().optional().or(z.literal("")),
  bio: z.string().optional(),

  // Teacher education
  highestDegree: z.string().optional(),
  degreeField: z.string().optional(),
  degreeInstitution: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  user: User;
  profile: Student | Teacher | null;
  onSuccess: (updatedUser: User) => void;
  onCancel: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const isStudent = (profile: any, role: string): profile is Student =>
  role === "STUDENT" && !!profile;
const isTeacher = (profile: any, role: string): profile is Teacher =>
  role === "TEACHER" && !!profile;

// ── Component ─────────────────────────────────────────────────────────────────

export default function EditMyProfileForm({ user, profile, onSuccess, onCancel }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const student = isStudent(profile, user.role) ? profile : null;
  const teacher = isTeacher(profile, user.role) ? profile : null;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      gender: user.gender ?? undefined,
      nationality: user.nationality ?? "",

      guardianName: student?.guardianName ?? "",
      guardianRelation: student?.guardianRelation ?? "",
      guardianPhone: student?.guardianPhone ?? "",
      guardianEmail: student?.guardianEmail ?? "",
      hasMedicalNeeds: (student as any)?.hasMedicalNeeds ?? false,
      medicalNotes: (student as any)?.medicalNotes ?? "",
      transportMode: (student as any)?.transportMode ?? "",
      nationalId: (student as any)?.nationalId ?? "",
      previousInstitution: (student as any)?.previousInstitution ?? "",

      title: (teacher as any)?.title ?? "",
      specialization: teacher?.specialization ?? "",
      officeRoom: teacher?.officeRoom ?? "",
      officeHours: teacher?.officeHours ?? "",
      professionalEmail: teacher?.professionalEmail ?? "",
      bio: teacher?.bio ?? "",
      highestDegree: teacher?.highestDegree ?? "",
      degreeField: teacher?.degreeField ?? "",
      degreeInstitution: teacher?.degreeInstitution ?? "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const updatedUser = await userApi.updateMe({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        gender: data.gender,
        nationality: data.nationality,
      });

      if (student) {
        await studentApi.updateMyStudentProfile({
          guardianName: data.guardianName,
          guardianRelation: data.guardianRelation,
          guardianPhone: data.guardianPhone,
          guardianEmail: data.guardianEmail,
          hasMedicalNeeds: data.hasMedicalNeeds,
          medicalNotes: data.medicalNotes,
          transportMode: data.transportMode,
          nationalId: data.nationalId,
          previousInstitution: data.previousInstitution,
        });
      }

      if (teacher) {
        await teacherApi.updateMyTeacherProfile({
          title: data.title,
          specialization: data.specialization,
          officeRoom: data.officeRoom,
          officeHours: data.officeHours,
          professionalEmail: data.professionalEmail,
          bio: data.bio,
          highestDegree: data.highestDegree,
          degreeField: data.degreeField,
          degreeInstitution: data.degreeInstitution,
        });
      }

      if (avatarFile) {
        await userApi.uploadProfilePicture(user.id, avatarFile);
      }

      dispatch(setUser(updatedUser));

      toaster.create({
        type: "success",
        title: t("profile.update_success", "Profile updated successfully"),
        duration: 3000,
      });

      onSuccess(updatedUser);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toaster.create({
        type: "error",
        title: Array.isArray(msg) ? msg.join(", ") : msg ?? "Update failed",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const AvatarField = (
    <div className="flex flex-col items-center gap-2 mb-4">
      <div
        className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => document.getElementById("edit-avatar-upload")?.click()}
      >
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
        ) : user.profilePicture?.url ? (
          <img src={user.profilePicture.url} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-indigo-400">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </span>
        )}
      </div>
      <input id="edit-avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <span className="text-xs text-slate-400">{t("profile.click_to_change_avatar", "Click to change avatar")}</span>
    </div>
  );

  const PersonalInfoTab = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
      {AvatarField}
      <Input label={t("labels.first_name", "First Name")} error={errors.firstName?.message} {...register("firstName")} />
      <Input label={t("labels.last_name", "Last Name")} error={errors.lastName?.message} {...register("lastName")} />
      <Input label={t("labels.phone_number", "Phone")} error={errors.phone?.message} {...register("phone")} />
      <Select
        label={t("labels.gender", "Gender")}
        error={errors.gender?.message}
        options={[
          { value: "MALE", label: t("labels.male", "Male") },
          { value: "FEMALE", label: t("labels.female", "Female") },
          { value: "OTHER", label: t("labels.other", "Other") },
        ]}
        {...register("gender")}
      />
      <Input label={t("labels.nationality", "Nationality")} error={errors.nationality?.message} {...register("nationality")} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {user.role === "ADMIN" && (
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {t("profile.personal_info", "Personal Information")}
          </h3>
          {PersonalInfoTab}
        </div>
      )}

      {user.role === "STUDENT" && (
        <Tabs.Root defaultValue="personal" variant="enclosed" colorPalette="blue">
          <Tabs.List>
            <Tabs.Trigger value="personal">{t("profile.personal_info", "Personal Info")}</Tabs.Trigger>
            <Tabs.Trigger value="guardian">{t("profile.guardian_info", "Guardian Info")}</Tabs.Trigger>
            <Tabs.Trigger value="medical">{t("profile.medical_info", "Medical")}</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="personal">{PersonalInfoTab}</Tabs.Content>

          <Tabs.Content value="guardian">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Input label={t("student.guardian_name", "Guardian Name")} {...register("guardianName")} />
              <Input label={t("student.guardian_relation", "Relation")} {...register("guardianRelation")} />
              <Input label={t("student.guardian_phone", "Guardian Phone")} {...register("guardianPhone")} />
              <Input label={t("student.guardian_email", "Guardian Email")} error={errors.guardianEmail?.message} {...register("guardianEmail")} />
            </div>
          </Tabs.Content>

          <Tabs.Content value="medical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="hasMedicalNeeds" {...register("hasMedicalNeeds")} className="w-4 h-4 accent-indigo-600" />
                <label htmlFor="hasMedicalNeeds" className="text-sm font-medium text-slate-700">
                  {t("student.has_medical_needs", "Has Medical Needs")}
                </label>
              </div>
              <Input label={t("student.medical_notes", "Medical Notes")} {...register("medicalNotes")} />
              <Input label={t("student.transport_mode", "Transport Mode")} {...register("transportMode")} />
              <Input label={t("student.national_id", "National ID")} {...register("nationalId")} />
              <Input label={t("student.previous_institution", "Previous Institution")} {...register("previousInstitution")} />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      )}

      {user.role === "TEACHER" && (
        <Tabs.Root defaultValue="personal" variant="enclosed" colorPalette="blue">
          <Tabs.List>
            <Tabs.Trigger value="personal">{t("profile.personal_info", "Personal Info")}</Tabs.Trigger>
            <Tabs.Trigger value="professional">{t("profile.professional", "Professional")}</Tabs.Trigger>
            <Tabs.Trigger value="education">{t("profile.education", "Education")}</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="personal">{PersonalInfoTab}</Tabs.Content>

          <Tabs.Content value="professional">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Select
                label={t("labels.title", "Title")}
                options={[
                  { value: "", label: "—" },
                  { value: "MR", label: "Mr." },
                  { value: "DR", label: "Dr." },
                  { value: "PROF", label: "Prof." },
                  { value: "MRS", label: "Mrs." },
                  { value: "MS", label: "Ms." },
                ]}
                {...register("title")}
              />
              <Input label={t("labels.specialization", "Specialization")} {...register("specialization")} />
              <Input label={t("labels.office", "Office Room")} {...register("officeRoom")} />
              <Input label={t("labels.office_hours", "Office Hours")} {...register("officeHours")} />
              <Input label={t("labels.professional_email", "Professional Email")} error={errors.professionalEmail?.message} {...register("professionalEmail")} />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">{t("labels.bio", "Bio")}</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  rows={4}
                  {...register("bio")}
                />
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="education">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Select
                label={t("labels.highest_degree", "Highest Degree")}
                options={[
                  { value: "", label: "—" },
                  { value: "BACHELOR", label: "Bachelor's" },
                  { value: "MASTER", label: "Master's" },
                  { value: "PHD", label: "PhD" },
                  { value: "OTHER", label: "Other" },
                ]}
                {...register("highestDegree")}
              />
              <Input label={t("labels.degree_field", "Degree Field")} {...register("degreeField")} />
              <Input label={t("labels.degree_institution", "Institution")} {...register("degreeInstitution")} />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" buttonType="secondary" onClick={onCancel}>
          {t("profile.cancel", "Cancel")}
        </Button>
        <Button type="submit" buttonType="primary" disabled={isSubmitting}>
          {isSubmitting ? t("labels.saving", "Saving…") : t("labels.save", "Save Changes")}
        </Button>
      </div>
    </form>
  );
}
