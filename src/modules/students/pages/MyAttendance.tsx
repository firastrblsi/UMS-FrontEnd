import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AttendanceRecord, AbsenceJustification } from '@/shared/api/attendanceApi';
import { attendanceApi } from '@/shared/api/attendanceApi';
import { useAppSelector } from '@/core/hooks/useAppSelector';
import { selectUser } from '@/modules/auth/redux/authSelectors';
import { Loader2, FileText, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Dialog } from '@/shared/ui/Dialog';

export default function MyAttendance() {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(true);
  const [justificationModalOpen, setJustificationModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [user, page]);

  const loadRecords = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const res = await attendanceApi.getStudentAttendance(user.id, skip, limit);
      setRecords(res.data || (Array.isArray(res) ? res : []));
      setTotal(res.total || (Array.isArray(res) ? res.length : 0));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitJustification = async () => {
    if (!selectedRecordId || !reason) return;
    setSubmitting(true);
    try {
      await attendanceApi.submitJustification({
        attendanceRecordId: selectedRecordId,
        reason
      });
      setJustificationModalOpen(false);
      setReason('');
      setSelectedRecordId(null);
      // Reload records to show PENDING state
      loadRecords();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string, justification?: AbsenceJustification) => {
    if (status === 'PRESENT') return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5"/> Present</span>;
    if (status === 'LATE') return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-medium"><AlertCircle className="w-3.5 h-3.5"/> Late</span>;
    
    if (status === 'JUSTIFIED' || (justification && justification.status === 'APPROVED')) {
      return <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5"/> Justified</span>;
    }
    if (justification && justification.status === 'PENDING') {
      return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md text-xs font-medium"><Loader2 className="w-3.5 h-3.5 animate-spin"/> Reviewing</span>;
    }
    
    return <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md text-xs font-medium"><XCircle className="w-3.5 h-3.5"/> Absent</span>;
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h1 className="text-2xl font-medium">{t('routes.my_attendance', 'My Attendance')}</h1>
        <p className="text-slate-500 mt-1">View your attendance records and submit absence justifications.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                records.map(record => {
                  const session = (record as any).timetableSession;
                  const just = (record as any).justification;
                  const dateObj = new Date(session.date);
                  
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{dateObj.toLocaleDateString()}</div>
                        <div className="text-gray-500">{session.startTime} - {session.endTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        {session.courseSection?.course?.name}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {session.type}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(record.status, just)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {record.status === 'ABSENT' && !just && (
                          <Button 
                            variant="outline" 
                            className="text-xs h-8"
                            onClick={() => {
                              setSelectedRecordId(record.id);
                              setJustificationModalOpen(true);
                            }}
                          >
                            <FileText className="w-3.5 h-3.5 mr-1" /> Justify
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {!loading && total > 0 && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <div className="flex items-center px-4 text-sm text-gray-600">
              Page {page} of {Math.ceil(total / limit)}
            </div>
            <Button
              variant="outline"
              disabled={page >= Math.ceil(total / limit)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog 
        open={justificationModalOpen} 
        onClose={() => setJustificationModalOpen(false)}
        title="Submit Absence Justification"
        size="md"
        requireConfirmOnClose={false}
      >
          <div className="py-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
              rows={4}
              placeholder="Explain the reason for your absence..."
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical Certificate / Document URL</label>
              <input 
                type="text" 
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all"
                placeholder="https://link-to-document.pdf (Optional for now)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setJustificationModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitJustification} disabled={!reason || submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Submit
            </Button>
          </div>
      </Dialog>
    </div>
  );
}
