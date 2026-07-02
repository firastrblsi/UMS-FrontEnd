import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Select from '@/shared/ui/Select';
import { AsyncSearchableSelect } from '@/shared/ui/AsyncSearchableSelect';
import { Plus, RefreshCw } from 'lucide-react';
import { useAppSelector } from '@/core/hooks/useAppSelector';
import { selectUser } from '@/modules/auth/redux/authSelectors';
import { Dialog } from '@/shared/ui/Dialog';
import { TimetableGrid } from '../components/TimetableGrid';
import ScheduleClassForm from '../components/ScheduleClassForm';
import { classGroupApi } from '../api/classGroupApi';
import { roomApi } from '../api/roomApi';
import { teacherApi } from '../../teachers/api/teacherApi';
import type { Room } from '../types/university.types';

export default function Timetables() {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const isAdmin = user?.role === 'ADMIN';

  const [showGenerate, setShowGenerate] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [filterType, setFilterType] = useState<'classGroupId' | 'teacherId' | 'roomId'>('classGroupId');
  const [filterValue, setFilterValue] = useState<string>('');

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Reset filter value when filter type changes
  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value as any);
    setFilterValue('');
  };

  const fetchFilterOptions = async (query: string) => {
    if (filterType === 'classGroupId') {
      const res = await classGroupApi.getClassGroups({ search: query, skip: 0, take: 20 });
      return res.data.map((cg: any) => ({ value: cg.id, label: cg.name }));
    } else if (filterType === 'roomId') {
      const res = await roomApi.getRooms({ search: query, skip: 0, take: 20 });
      return res.data.map((r: Room) => ({ value: r.id, label: `${r.name} (${r.capacity} seats)` }));
    } else if (filterType === 'teacherId') {
      const res = await teacherApi.getTeachers({ search: query, skip: 0, take: 20 });
      return res.data.map((tc: any) => ({ value: tc.id, label: `${tc.user?.firstName || ''} ${tc.user?.lastName || ''}` }));
    }
    return [];
  };

  return (
    <div className="flex flex-col gap-10 md:gap-15 w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl mb-3 md:mb-0 font-medium">
            {t('routes.timetables', 'Timetables')}
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            {t('global.timetable_sessions', 'Manage Timetable Sessions')}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center mt-3 md:mt-0">
          <div className="flex gap-3 w-full md:w-auto items-center">
            <div className="w-40">
              <Select
                options={[
                  { value: 'classGroupId', label: t('global.class_group') },
                  { value: 'teacherId', label: t('global.teacher') },
                  { value: 'roomId', label: t('global.room') },
                ]}
                value={filterType}
                onChange={handleFilterTypeChange}
              />
            </div>
            <div className="w-64">
              <AsyncSearchableSelect
                key={filterType}
                loadOptions={fetchFilterOptions}
                value={filterValue}
                onChange={setFilterValue}
                placeholder={
                  filterType === 'classGroupId' ? t('labels.search_group') :
                  filterType === 'teacherId' ? t('labels.search_teacher') :
                  t('labels.search_room')
                }
              />
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              buttonType="secondary"
              className="flex items-center justify-center p-3"
              onClick={handleRefresh}
              title={t("global.refresh", "Refresh List")}
            >
              <RefreshCw size={18} />
            </Button>

            {isAdmin && (
              <Button className="flex items-center gap-2 px-5" onClick={() => setShowGenerate(true)}>
                <span className="font-medium">{t("global.schedule_class", "Schedule Class")}</span>
                <Plus size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={showGenerate}
        onClose={() => setShowGenerate(false)}
        title={t("global.schedule_class", "Schedule Class")}
        size="lg"
      >
        <ScheduleClassForm 
          classGroupIdFilter={filterType === 'classGroupId' ? filterValue : undefined}
          onSuccess={() => {
            setShowGenerate(false);
            handleRefresh();
          }}
          onCancel={() => setShowGenerate(false)}
        />
      </Dialog>

      <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white">
        <div className="p-0 sm:p-6 bg-slate-50/50">
          <TimetableGrid 
            trigger={refreshTrigger} 
            filterKey={filterValue ? filterType : undefined}
            filterValue={filterValue ? filterValue : undefined}
          />
        </div>
      </div>
    </div>
  );
}
