import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import { DatePicker } from '@/shared/ui/DatePicker';
import { TimePicker } from '@/shared/ui/TimePicker';
import Select from '@/shared/ui/Select';
import { AsyncSearchableSelect } from '@/shared/ui/AsyncSearchableSelect';
import { timetableSessionApi } from '../api/timetableSessionApi';
import { roomApi } from '../api/roomApi';
import type { TimetableSession, Room } from '../types/university.types';

interface EditTimetableSessionFormProps {
  session: TimetableSession;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditTimetableSessionForm({ session, onSuccess, onCancel }: EditTimetableSessionFormProps) {
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [dateStr, setDateStr] = useState<string>(new Date(session.date).toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(session.startTime?.slice(0, 5) || '');
  const [endTime, setEndTime] = useState(session.endTime?.slice(0, 5) || '');
  const [roomId, setRoomId] = useState(session.roomId);
  const [type, setType] = useState(session.type);

  const fetchRooms = async (query: string) => {
    const res = await roomApi.getRooms({ search: query, skip: 0, take: 20 });
    return res.data.map((r: Room) => ({ value: r.id, label: `${r.name} (${r.capacity} seats)` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !startTime || !endTime || !dateStr) {
      setError(t('global.error_fill_fields', 'Please fill in all required fields'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await timetableSessionApi.updateTimetableSession(session.id, {
        roomId,
        date: dateStr + 'T00:00:00.000Z',
        startTime,
        endTime,
        type,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || t('global.error_occurred', 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Date & Time */}
      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-5">
        <h3 className="text-sm font-semibold text-slate-800">{t('global.time', 'Time & Date')}</h3>
        
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('global.date', 'Date')} *</label>
          <DatePicker value={dateStr} onChange={(e: any) => setDateStr(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('labels.start_time', 'Start Time')} *</label>
            <TimePicker value={startTime} onChange={(e: any) => setStartTime(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('labels.end_time', 'End Time')} *</label>
            <TimePicker value={endTime} onChange={(e: any) => setEndTime(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Room & Type */}
      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-5">
        <h3 className="text-sm font-semibold text-slate-800">{t('global.room', 'Location')} & {t('global.type', 'Type')}</h3>

        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('global.room', 'Room')} *</label>
          <AsyncSearchableSelect
            loadOptions={fetchRooms}
            value={roomId}
            onChange={setRoomId}
            placeholder={t('labels.search_room', 'Search Room...')}
            defaultOption={{ value: session.roomId, label: session.room?.name || 'Current Room' }}
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('global.type', 'Session Type')} *</label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            options={[
              { value: 'LECTURE', label: 'Lecture' },
              { value: 'TUTORIAL', label: 'Tutorial' },
              { value: 'PRACTICAL', label: 'Practical (Lab)' },
              { value: 'SEMINAR', label: 'Seminar' },
              { value: 'EXAM', label: 'Exam' }
            ]}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-2 border-t border-slate-100 pt-4">
        <Button type="button" buttonType="secondary" onClick={onCancel} disabled={loading}>
          {t('global.cancel', 'Cancel')}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? t('global.saving', 'Saving...') : t('global.save_changes', 'Save Changes')}
        </Button>
      </div>
    </form>
  );
}
