import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Trash2, Loader2, Edit2, ClipboardList } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useTimetableSessions } from '../hooks/useTimetableSessions';
import { timetableSessionApi } from '../api/timetableSessionApi';
import type { TimetableSession } from '../types/university.types';
import { useAuth } from '../../auth/hooks/useAuth';
import { Dialog } from '@/shared/ui/Dialog';
import SessionDetailsModal from './SessionDetailsModal';
import EditTimetableSessionForm from './EditTimetableSessionForm';
import { TakeAttendanceModal } from './TakeAttendanceModal';

const DAYS_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

// Helper to generate a consistent color based on string
const getSessionColor = (str: string) => {
  const colors = [
    'bg-blue-100 border-blue-300 text-blue-800',
    'bg-emerald-100 border-emerald-300 text-emerald-800',
    'bg-purple-100 border-purple-300 text-purple-800',
    'bg-orange-100 border-orange-300 text-orange-800',
    'bg-indigo-100 border-indigo-300 text-indigo-800',
    'bg-rose-100 border-rose-300 text-rose-800',
    'bg-cyan-100 border-cyan-300 text-cyan-800',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

interface TimetableGridProps {
  trigger?: number;
  filterKey?: string;
  filterValue?: string;
  maxHeightClass?: string;
}

export function TimetableGrid({ trigger, filterKey, filterValue, maxHeightClass = "max-h-[70vh]" }: TimetableGridProps) {
  const { t, i18n } = useTranslation();
  const { isAdmin, user } = useAuth();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<TimetableSession | null>(null);
  const [takingAttendanceSession, setTakingAttendanceSession] = useState<TimetableSession | null>(null);

  // Compute the current week's Monday and Saturday based on offset
  const { monday, saturday } = React.useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const m = new Date(now);
    m.setDate(now.getDate() + diffToMonday + (currentWeekOffset * 7));
    m.setHours(0, 0, 0, 0);

    const s = new Date(m);
    s.setDate(m.getDate() + 5);
    s.setHours(23, 59, 59, 999);

    return { monday: m, saturday: s };
  }, [currentWeekOffset]);

  const { data: sessions, isLoading, isFetching, fetchSessions } = useTimetableSessions(
    { 
      filters: JSON.stringify([
        ...(filterKey && filterValue ? [{ id: filterKey, value: filterValue }] : []),
        { id: 'startDate', value: monday.toISOString() },
        { id: 'endDate', value: saturday.toISOString() }
      ])
    }
  );

  useEffect(() => {
    fetchSessions();
  }, [trigger, fetchSessions, monday, saturday]);

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) return;
    
    try {
      await timetableSessionApi.deleteTimetableSession(sessionId);
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null);
      }
      fetchSessions();
    } catch (error) {
      console.error("Failed to delete session", error);
      alert(t("global.error", "An error occurred"));
    }
  };

  // Transform backend sessions to UI sessions
  const uiSessions = (sessions || []).map((session: any) => {
    if (!session || !session.date || !session.startTime || !session.endTime) return null;

    const sessionDate = new Date(session.date);
    if (isNaN(sessionDate.getTime())) return null;

    const dayIndex = sessionDate.getDay() === 0 ? 6 : sessionDate.getDay() - 1; // 0=Mon, 5=Sat
    if (dayIndex < 0 || dayIndex > 5) return null;
    
    const [startH, startM] = session.startTime.split(':').map(Number);
    const [endH, endM] = session.endTime.split(':').map(Number);
    
    const startTimeDecimal = startH + (startM / 60);
    const endTimeDecimal = endH + (endM / 60);
    const duration = endTimeDecimal - startTimeDecimal;

    const courseName = session.courseSection?.course?.name || 'Unknown Course';
    const teacherName = session.courseSection?.teacher?.user 
      ? `${session.courseSection.teacher.user.firstName} ${session.courseSection.teacher.user.lastName}` 
      : 'TBA';
    const roomName = session.room?.name || 'TBA';

    return {
      id: session.id,
      day: DAYS_KEYS[dayIndex],
      startTime: startTimeDecimal,
      duration,
      title: courseName,
      room: roomName,
      teacher: teacherName,
      type: session.type,
      color: getSessionColor(courseName),
      original: session
    };
  }).filter(s => s !== null && s.day !== undefined);

  return (
    <div className="flex flex-col bg-white w-full rounded-xl">
      {/* Header controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentWeekOffset === 0 ? t('timetables.this_week') : `${t('timetables.week')} ${currentWeekOffset > 0 ? '+' : ''}${currentWeekOffset}`}
          </h2>
          <span className="bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5 text-xs font-semibold text-slate-500 hidden sm:inline-flex">
            {monday.toLocaleDateString(i18n.language || 'en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCurrentWeekOffset(prev => prev - 1)} className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentWeekOffset(0)} className="h-8 rounded-full px-4 text-xs font-medium">
            {t('timetables.today')}
          </Button>
          <Button variant="outline" onClick={() => setCurrentWeekOffset(prev => prev + 1)} className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid Wrapper */}
      <div className={`mt-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-auto relative ${maxHeightClass}`}>
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}
        <div className="min-w-[800px] w-full border-collapse">
          {/* Days Header */}
          <div className="grid grid-cols-[80px_repeat(6,1fr)] bg-slate-50/80 sticky top-0 z-20 border-b border-gray-200 backdrop-blur-sm shadow-sm">
            <div className="p-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider border-r border-gray-100">
              {t('timetables.time')}
            </div>
            {DAYS_KEYS.map((dayKey, index) => {
              const columnDate = new Date(monday);
              columnDate.setDate(monday.getDate() + index);
              const formattedDate = columnDate.toLocaleDateString(i18n.language || 'en-US', { month: 'short', day: 'numeric' });

              return (
                <div key={dayKey} className="p-3 text-center border-r border-gray-100 last:border-r-0">
                  <div className="text-sm font-semibold text-slate-700">{t(`labels.${dayKey}`)}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{formattedDate}</div>
                </div>
              );
            })}
          </div>

          {/* Time Slots & Content */}
          <div className="relative bg-white">
            {/* Background horizontal lines for hours */}
            <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
              {HOURS.map((hour) => (
                <div key={`bg-${hour}`} className="h-20 border-b border-gray-100 w-full flex">
                  <div className="w-[80px] border-r border-gray-100 shrink-0 bg-slate-50/30"></div>
                  <div className="flex-1 grid grid-cols-6">
                    {DAYS_KEYS.map((d) => (
                      <div key={`bg-cell-${hour}-${d}`} className="border-r border-gray-50 border-dashed last:border-r-0 h-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Foreground content wrapper */}
            <div className="relative z-10 flex">
              {/* Hour labels (left axis) */}
              <div className="w-[80px] shrink-0 flex flex-col">
                {HOURS.map((hour) => (
                  <div key={`label-${hour}`} className="h-20 border-r border-transparent flex items-start justify-center pt-2">
                    <span className="text-xs font-medium text-slate-400">
                      {hour}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns for absolute positioning */}
              <div className="flex-1 grid grid-cols-6 relative h-[960px]">
                {DAYS_KEYS.map((dayKey) => {
                  const daySessions = uiSessions.filter(s => s && s.day === dayKey);
                  return (
                    <div key={`col-${dayKey}`} className="relative h-full px-1">
                      {daySessions.map((session: any) => {
                        const top = (session.startTime - 8) * 80; // 80px per hour
                        const height = session.duration * 80;
                        return (
                          <div 
                            key={session.id} 
                            className={`absolute w-[calc(100%-8px)] left-1 rounded-lg border shadow-sm p-3 flex flex-col gap-1.5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group overflow-hidden ${session.color}`}
                            style={{ top: `${top}px`, height: `${height}px` }}
                            onClick={() => setSelectedSessionId(session.id)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-sm font-bold leading-tight group-hover:underline decoration-1 underline-offset-2">
                                {session.title}
                              </h3>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/50 text-slate-800 font-medium uppercase">
                                  {session.type}
                                </span>
                                {isAdmin && (
                                  <button
                                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white hover:text-blue-600 transition-opacity text-slate-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingSession(session.original);
                                    }}
                                    title={t("global.edit", "Edit")}
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {(isAdmin || user?.role === 'TEACHER') && (
                                  <button
                                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white hover:text-emerald-600 transition-opacity text-slate-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTakingAttendanceSession(session.original);
                                    }}
                                    title="Take Attendance"
                                  >
                                    <ClipboardList className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {isAdmin && (
                                  <button
                                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white hover:text-red-600 transition-opacity text-slate-600"
                                    onClick={(e) => handleDeleteSession(session.id, e)}
                                    title={t("global.delete", "Delete")}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 mt-auto">
                              <div className="flex items-center text-xs opacity-90 gap-1.5">
                                <Clock className="w-3 h-3 shrink-0" />
                                <span>{Math.floor(session.startTime)}:{session.startTime % 1 === 0 ? '00' : '30'} - {Math.floor(session.startTime + session.duration)}:{(session.startTime + session.duration) % 1 === 0 ? '00' : '30'}</span>
                              </div>
                              <div className="flex items-center text-xs opacity-90 gap-1.5">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span>{session.room}</span>
                              </div>
                              <div className="flex items-center text-xs opacity-90 gap-1.5">
                                <User className="w-3 h-3 shrink-0" />
                                <span className="truncate">{session.teacher}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedSessionId}
        onClose={() => setSelectedSessionId(null)}
        title={t("global.timetable_details", "Class Details")}
        requireConfirmOnClose={false}
      >
        {selectedSessionId && (
          <SessionDetailsModal 
            session={sessions.find((s: any) => s.id === selectedSessionId)!} 
            onClose={() => setSelectedSessionId(null)}
          />
        )}
      </Dialog>

      <Dialog
        open={!!editingSession}
        onClose={() => setEditingSession(null)}
        title={t("global.edit", "Edit Session")}
        size="md"
      >
        {editingSession && (
          <EditTimetableSessionForm 
            session={editingSession}
            onSuccess={() => {
              setEditingSession(null);
              fetchSessions();
            }}
            onCancel={() => setEditingSession(null)}
          />
        )}
      </Dialog>

      <TakeAttendanceModal
        isOpen={!!takingAttendanceSession}
        onClose={() => setTakingAttendanceSession(null)}
        session={takingAttendanceSession}
      />
    </div>
  );
}
