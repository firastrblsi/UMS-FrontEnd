import React, { useEffect, useState } from 'react';
import { Dialog } from '@/shared/ui/Dialog';
import { Button } from '@/shared/ui/Button';
import { Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { attendanceApi } from '@/shared/api/attendanceApi';
import { studentEnrollmentApi } from '@/modules/structure/api/studentEnrollmentApi';

interface TakeAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: any; // The timetable session
}

export const TakeAttendanceModal: React.FC<TakeAttendanceModalProps> = ({ isOpen, onClose, session }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // List of { studentId, name, status }
  const [roster, setRoster] = useState<{ studentId: string; name: string; status: 'PRESENT' | 'LATE' | 'ABSENT' | 'JUSTIFIED' }[]>([]);

  useEffect(() => {
    if (isOpen && session) {
      loadData();
    }
  }, [isOpen, session]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!session) return;
      
      // 1. Get existing attendance records for the session
      const existingRecords = await attendanceApi.getSessionAttendance(session.id);
      
      const enrollmentsRes = await studentEnrollmentApi.getEnrollments({
        filters: JSON.stringify([{ id: 'courseSectionId', value: session.courseSectionId }])
      });
      const enrollments = enrollmentsRes.data;

      // 3. Create a map of existing records for quick lookup
      const existingMap = new Map();
      existingRecords.forEach((record: any) => {
        existingMap.set(record.studentId, record);
      });

      // 4. Map enrollments to roster, falling back to existing records if any
      const mergedRoster = enrollments.map((enrollment: any) => {
        const existing = existingMap.get(enrollment.studentId);
        return {
          studentId: enrollment.studentId,
          name: enrollment.student?.user ? `${enrollment.student.user.firstName} ${enrollment.student.user.lastName}` : 'Unknown Student',
          status: existing ? existing.status : 'PRESENT'
        };
      });
      
      setRoster(mergedRoster);
    } catch (error) {
      console.error('Failed to load attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'LATE' | 'ABSENT' | 'JUSTIFIED') => {
    setRoster(prev => prev.map(s => s.studentId === studentId ? { ...s, status } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const records = roster.map(r => ({ studentId: r.studentId, status: r.status }));
      await attendanceApi.bulkRecordAttendance(session.id, records);
      onClose();
    } catch (error) {
      console.error('Failed to save attendance:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'LATE': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'ABSENT': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'JUSTIFIED': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      default: return 'bg-gray-100 text-gray-500';
    }
  };


  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      title="Take Attendance" 
      size="lg"
      requireConfirmOnClose={false}
    >
      <div className="flex flex-col h-full max-h-[60vh]">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b">
          {session?.courseSection?.course?.name} - {new Date(session?.date).toLocaleDateString()} ({session?.startTime} - {session?.endTime})
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
            {roster.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No students enrolled in this section.
              </div>
            ) : (
              roster.map((student) => (
                <div key={student.studentId} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 shadow-sm hover:shadow-md transition-all">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {student.name}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(student.studentId, 'PRESENT')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${student.status === 'PRESENT' ? getStatusColor('PRESENT') : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Present
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.studentId, 'LATE')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${student.status === 'LATE' ? getStatusColor('LATE') : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                      <AlertCircle className="w-4 h-4" /> Late
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.studentId, 'ABSENT')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${student.status === 'ABSENT' ? getStatusColor('ABSENT') : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                      <XCircle className="w-4 h-4" /> Absent
                    </button>
                    {student.status === 'JUSTIFIED' && (
                      <button
                        disabled
                        className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border ${getStatusColor('JUSTIFIED')}`}
                      >
                        Justified
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
          <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || loading} className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Attendance
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
