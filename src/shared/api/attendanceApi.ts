import { axiosInstance } from '@/core/api/axios';

export interface AttendanceRecord {
  id: string;
  timetableSessionId: string;
  studentId: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'JUSTIFIED';
  remarks?: string;
  student?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface AbsenceJustification {
  id: string;
  attendanceRecordId: string;
  reason: string;
  documentUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  attendanceRecord?: {
    student: {
      user: {
        firstName: string;
        lastName: string;
      }
    };
    timetableSession: {
      date: string;
      startTime: string;
      endTime: string;
      courseSection: {
        course: {
          name: string;
        }
      }
    }
  }
}

export const attendanceApi = {
  getSessionAttendance: async (sessionId: string): Promise<AttendanceRecord[]> => {
    const response = await axiosInstance.get(`/attendance/session/${sessionId}`);
    return response.data;
  },

  getStudentAttendance: async (studentId: string, skip: number = 0, take: number = 10): Promise<{ data: AttendanceRecord[], total: number }> => {
    const response = await axiosInstance.get(`/attendance/student/${studentId}`, { params: { skip, take } });
    return response.data;
  },

  bulkRecordAttendance: async (sessionId: string, records: { studentId: string; status: string; remarks?: string }[]) => {
    const response = await axiosInstance.put(`/attendance/bulk`, {
      timetableSessionId: sessionId,
      records
    });
    return response.data;
  },

  submitJustification: async (data: { attendanceRecordId: string; reason: string; documentUrl?: string }) => {
    const response = await axiosInstance.post(`/attendance/justifications`, data);
    return response.data;
  },

  getPendingJustifications: async (skip: number = 0, take: number = 10): Promise<{ data: AbsenceJustification[], total: number }> => {
    const response = await axiosInstance.get(`/attendance/justifications/pending`, { params: { skip, take } });
    return response.data;
  },

  getStudentJustifications: async (studentId: string): Promise<AbsenceJustification[]> => {
    const response = await axiosInstance.get(`/attendance/justifications/student/${studentId}`);
    return response.data;
  },

  reviewJustification: async (justificationId: string, status: 'APPROVED' | 'REJECTED') => {
    const response = await axiosInstance.put(`/attendance/justifications/${justificationId}/review`, { status });
    return response.data;
  },
};
