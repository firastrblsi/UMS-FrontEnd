import { useTranslation } from 'react-i18next';
import { Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { TimetableSession } from '../types/university.types';

interface SessionDetailsModalProps {
  session: TimetableSession;
  onClose: () => void;
}

export default function SessionDetailsModal({ session, onClose }: SessionDetailsModalProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-5 text-sm p-2">
      <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col gap-4">
        <div>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1.5">{t('global.course', 'Course')}</p>
          <p className="font-semibold text-slate-800 text-lg">{session.courseSection?.course?.name}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{session.courseSection?.course?.code}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex text-[10px] px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold uppercase tracking-wider border border-blue-100/50">
            {session.type}
          </span>
          <span className="inline-flex text-[10px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
            {session.courseSection?.classGroup?.name || t('global.no_group', 'No Group')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-slate-100">
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {t('global.teacher', 'Teacher')}
          </p>
          <p className="font-medium text-slate-700">
            {session.courseSection?.teacher?.user?.firstName} {session.courseSection?.teacher?.user?.lastName}
          </p>
        </div>
        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-slate-100">
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {t('global.room', 'Room')}
          </p>
          <p className="font-medium text-slate-700">
            {session.room?.name}
            {session.room?.capacity && <span className="text-xs text-slate-400 ml-1">({session.room.capacity})</span>}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white border border-slate-100">
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {t('global.time', 'Time')}
        </p>
        <p className="font-medium text-slate-700">
          {new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })} • {session.startTime.slice(0, 5)} - {session.endTime.slice(0, 5)}
        </p>
      </div>
      
      <div className="mt-2 flex justify-end">
        <Button onClick={onClose} buttonType="secondary" className="px-6">
          {t('global.close', 'Close')}
        </Button>
      </div>
    </div>
  );
}
