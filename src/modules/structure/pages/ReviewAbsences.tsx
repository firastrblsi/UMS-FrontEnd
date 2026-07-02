import { useEffect, useState } from 'react';
import type { AbsenceJustification } from '@/shared/api/attendanceApi';
import { attendanceApi } from '@/shared/api/attendanceApi';
import { Loader2, CheckCircle, FileText, Check, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export default function ReviewAbsences() {
  const [justifications, setJustifications] = useState<AbsenceJustification[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPending();
  }, [page]);

  const loadPending = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const res = await attendanceApi.getPendingJustifications(skip, limit);
      setJustifications(res.data || (Array.isArray(res) ? res : []));
      setTotal(res.total || (Array.isArray(res) ? res.length : 0));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    try {
      await attendanceApi.reviewJustification(id, status);
      // Remove from list or update state
      setJustifications(prev => prev.filter(j => j.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h1 className="text-2xl font-medium">Review Absences</h1>
        <p className="text-slate-500 mt-1">Review and approve or reject student absence justifications.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : justifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mb-3" />
            <p className="text-lg font-medium text-gray-800">All caught up!</p>
            <p>There are no pending absence justifications to review.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {justifications.map((justification) => {
              const studentName = `${justification.attendanceRecord?.student?.user?.firstName} ${justification.attendanceRecord?.student?.user?.lastName}`;
              const courseName = justification.attendanceRecord?.timetableSession?.courseSection?.course?.name;
              const sessionDate = new Date(justification.attendanceRecord?.timetableSession?.date || '').toLocaleDateString();
              
              return (
                <div key={justification.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900 text-lg">{studentName}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-medium border border-amber-200/50">
                        Pending Review
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4 mb-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">Session</span>
                        <span className="text-gray-900 font-medium">{courseName}</span>
                        <span className="text-gray-500">{sessionDate} ({justification.attendanceRecord?.timetableSession?.startTime} - {justification.attendanceRecord?.timetableSession?.endTime})</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">Submitted</span>
                        <span className="text-gray-900">{new Date(justification.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <span className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-2 block">Reason Provided</span>
                      <p className="text-gray-700 italic">"{justification.reason}"</p>
                    </div>

                    {justification.documentUrl && (
                      <div className="mt-4">
                        <a href={justification.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                          <FileText className="w-4 h-4" /> View Medical Certificate / Document
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-3 md:w-32 shrink-0">
                    <Button 
                      className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"
                      onClick={() => handleReview(justification.id, 'APPROVED')}
                      disabled={processingId === justification.id}
                    >
                      {processingId === justification.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => handleReview(justification.id, 'REJECTED')}
                      disabled={processingId === justification.id}
                    >
                      {processingId === justification.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
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
    </div>
  );
}
