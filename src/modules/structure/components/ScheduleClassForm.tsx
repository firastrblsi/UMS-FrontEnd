import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';
import { AsyncSearchableSelect } from '@/shared/ui/AsyncSearchableSelect';
import { DatePicker } from '@/shared/ui/DatePicker';
import { TimePicker } from '@/shared/ui/TimePicker';
import { timetableSessionApi } from '../api/timetableSessionApi';
import type { GenerateTimetableDto } from '../api/timetableSessionApi';
import { roomApi } from '../api/roomApi';
import { courseSectionApi } from '../api/courseSectionApi';
import { classGroupApi } from '../api/classGroupApi';
import { courseApi } from '../api/courseApi';
import { teacherApi } from '../../teachers/api/teacherApi';
import { toaster } from '@/components/ui/toaster';
import type { Room, CourseSection } from '../types/university.types';

const generateSchema = z.object({
  courseSectionId: z.string().min(1, 'Course Section is required'),
  roomId: z.string().min(1, 'Room is required'),
  type: z.enum(['LECTURE', 'TUTORIAL', 'PRACTICAL', 'EXAM', 'SEMINAR']),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().min(1, 'End Date is required'),
  startTime: z.string().min(1, 'Start Time is required'),
  endTime: z.string().min(1, 'End Time is required'),
  daysOfWeek: z.array(z.number()).min(1, 'Select at least one day'),
});

type GenerateFormValues = z.infer<typeof generateSchema>;

interface ScheduleClassFormProps {
  initialCourseSectionId?: string;
  classGroupIdFilter?: string; // If we want to filter sections by group
  onSuccess: () => void;
  onCancel: () => void;
}

const DAYS = [
  { label: 'mon', value: 1 },
  { label: 'tue', value: 2 },
  { label: 'wed', value: 3 },
  { label: 'thu', value: 4 },
  { label: 'fri', value: 5 },
  { label: 'sat', value: 6 },
];

export default function ScheduleClassForm({ initialCourseSectionId, classGroupIdFilter, onSuccess, onCancel }: ScheduleClassFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Cascading filters state
  const [selectedClassGroupId, setSelectedClassGroupId] = useState<string>(classGroupIdFilter || "");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema) as any,
    defaultValues: {
      courseSectionId: initialCourseSectionId || '',
      type: 'LECTURE',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '08:30',
      endTime: '10:00',
      daysOfWeek: [],
    }
  });

  const selectedDays = watch('daysOfWeek');

  // Fetch functions for AsyncSearchableSelect components
  const fetchClassGroups = async (query: string) => {
    const res = await classGroupApi.getClassGroups({ search: query, skip: 0, take: 20 });
    return res.data.map((cg: any) => ({ value: cg.id, label: cg.name }));
  };

  const fetchCourses = async (query: string) => {
    const res = await courseApi.getCourses({ search: query, skip: 0, take: 20 });
    return res.data.map((c: any) => ({ value: c.id, label: `${c.code} - ${c.name}` }));
  };

  const fetchTeachers = async (query: string) => {
    const res = await teacherApi.getTeachers({ search: query, skip: 0, take: 20 });
    return res.data.map((tc: any) => ({ value: tc.id, label: `${tc.user?.firstName || ''} ${tc.user?.lastName || ''}` }));
  };

  const fetchSections = async (query: string) => {
    let filtersArray = [];
    if (selectedClassGroupId) filtersArray.push({ id: "classGroupId", value: selectedClassGroupId });
    if (selectedCourseId) filtersArray.push({ id: "courseId", value: selectedCourseId });
    if (selectedTeacherId) filtersArray.push({ id: "teacherId", value: selectedTeacherId });
    
    const filters = filtersArray.length > 0 ? JSON.stringify(filtersArray) : undefined;
    const res = await courseSectionApi.getCourseSections({ search: query, skip: 0, take: 20, filters });
    
    return res.data.map((s: CourseSection) => ({
      value: s.id,
      label: `${s.course?.name || 'Unknown'} - ${s.teacher?.user?.lastName || 'TBA'} (${s.classGroup?.name || 'No Group'})`
    }));
  };

  const fetchRooms = async (query: string) => {
    const res = await roomApi.getRooms({ search: query, skip: 0, take: 20 });
    return res.data.map((r: Room) => ({ value: r.id, label: `${r.name} (${r.capacity} seats)` }));
  };

  const toggleDay = (val: number) => {
    if (selectedDays.includes(val)) {
      setValue('daysOfWeek', selectedDays.filter(d => d !== val), { shouldValidate: true });
    } else {
      setValue('daysOfWeek', [...selectedDays, val].sort(), { shouldValidate: true });
    }
  };

  const onSubmit = async (data: GenerateFormValues) => {
    try {
      setIsLoading(true);
      const payload: GenerateTimetableDto = {
        courseSectionId: data.courseSectionId,
        roomId: data.roomId,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        daysOfWeek: data.daysOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type,
      };

      const res = await timetableSessionApi.generateTimetableSessions(payload);
      toaster.create({ title: `Successfully scheduled ${res.generated || 'multiple'} sessions!`, type: "success" });
      onSuccess();
    } catch (error: any) {
      toaster.create({ 
        title: error?.response?.data?.message || t("global.error", "An error occurred (conflict detected)"), 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Filtering Section - Soft rounded box to differentiate it */}
      {!initialCourseSectionId && (
        <div className="bg-slate-50/50 border border-slate-100 rounded-[20px] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('timetables.filter_course_sections')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AsyncSearchableSelect
              label={t('global.class_group')}
              loadOptions={fetchClassGroups}
              value={selectedClassGroupId}
              onChange={setSelectedClassGroupId}
              placeholder={t('labels.search_group')}
            />
            <AsyncSearchableSelect
              label={t('global.course')}
              loadOptions={fetchCourses}
              value={selectedCourseId}
              onChange={setSelectedCourseId}
              placeholder={t('labels.search_course')}
            />
            <AsyncSearchableSelect
              label={t('global.teacher')}
              loadOptions={fetchTeachers}
              value={selectedTeacherId}
              onChange={setSelectedTeacherId}
              placeholder={t('labels.search_teacher')}
            />
          </div>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="bg-white rounded-[20px] space-y-5">
        {!initialCourseSectionId && (
          <div className="grid grid-cols-1 gap-5">
            <AsyncSearchableSelect
              label={t("routes.course_sections", "Course Section")}
              loadOptions={fetchSections}
              error={errors.courseSectionId?.message}
              value={watch("courseSectionId")}
              onChange={(val) => setValue('courseSectionId', val, { shouldValidate: true })}
              placeholder="Search Section..."
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AsyncSearchableSelect
            label={t("routes.rooms", "Room")}
            loadOptions={fetchRooms}
            error={errors.roomId?.message}
            value={watch("roomId")}
            onChange={(val) => setValue('roomId', val, { shouldValidate: true })}
            placeholder={t('labels.search_room')}
          />
          <Select
            label={t("labels.room_type", "Session Type")}
            options={[
              { value: 'LECTURE', label: 'Lecture' },
              { value: 'TUTORIAL', label: 'Tutorial' },
              { value: 'PRACTICAL', label: 'Practical' },
              { value: 'SEMINAR', label: 'Seminar' },
              { value: 'EXAM', label: 'Exam' }
            ]}
            error={errors.type?.message}
            value={watch("type")}
            {...register('type')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DatePicker
            label={t("labels.start_date", "Start Date")}
            error={errors.startDate?.message}
            {...register("startDate")}
          />
          <DatePicker
            label={t("labels.end_date", "End Date")}
            error={errors.endDate?.message}
            {...register("endDate")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TimePicker
            label={t('labels.start_time')}
            error={errors.startTime?.message}
            {...register("startTime")}
          />
          <TimePicker
            label={t('labels.end_time')}
            error={errors.endTime?.message}
            {...register("endTime")}
          />
        </div>

        <div className="bg-slate-50/30 p-4 border border-slate-100 rounded-[18px]">
          <label className="block text-sm font-medium text-slate-700 mb-3">{t('labels.days_of_week')}</label>
          <div className="flex flex-wrap gap-2.5">
            {DAYS.map(day => {
              const isSelected = selectedDays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                    isSelected 
                      ? 'bg-slate-800 border-slate-800 text-white shadow-md shadow-slate-500/20 scale-105' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {t(`labels.${day.label}`)}
                </button>
              );
            })}
          </div>
          {errors.daysOfWeek && <p className="text-red-500 text-xs mt-2 ms-2">{errors.daysOfWeek.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <Button
          type="button"
          buttonType="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-[12px] px-6"
        >
          {t("global.cancel", "Cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-[12px] px-8 bg-blue-600 hover:bg-blue-700"
        >
          {t("global.add_timetable", "Schedule Class")}
        </Button>
      </div>
    </form>
  );
}
