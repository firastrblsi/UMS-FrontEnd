import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { Edit2, UserX, UserCheck } from "lucide-react";
import { DataTable } from "@/shared/ui/DataTable";
import { useStudents } from "../hooks/useStudents";
import type { Student, StudentFilterParams } from "../types/student.types";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: "#F0FDF4", color: "#15803D" },
  INACTIVE: { bg: "#FFF1F2", color: "#BE123C" },
  GRADUATED: { bg: "#EFF6FF", color: "#1D4ED8" },
  SUSPENDED: { bg: "#FFFBEB", color: "#B45309" },
  DROPPED_OUT: { bg: "#F3F4F6", color: "#374151" },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.INACTIVE;
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: style.bg,
        color: style.color,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.03em",
        padding: "2px 10px",
        borderRadius: "999px",
      }}
    >
      {status}
    </span>
  );
}

interface StudentsGridProps {
  filters: StudentFilterParams;
  trigger: number;
  onEditStudent?: (student: Student) => void;
  onDeactivateUser?: (userId: string) => void;
  onReactivateUser?: (userId: string) => void;
}

export const StudentsGrid = ({
  filters,
  trigger,
  onEditStudent,
  onDeactivateUser,
  onReactivateUser,
}: StudentsGridProps) => {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchStudents } = useStudents(filters);

  const columns = useMemo<MRT_ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: "studentNumber",
        header: t("student.student_id"),
        size: 120,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#004371",
              fontWeight: 600,
              backgroundColor: "#E6EEF4",
              padding: "2px 8px",
              borderRadius: "6px",
            }}
          >
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        id: "name",
        header: t("labels.name"),
        minSize: 160,
        accessorFn: (row) => `${row.user?.firstName || ""} ${row.user?.lastName || ""}`,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ cell }) => (
          <span style={{ fontWeight: 600, color: "#1E293B" }}>
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        id: "email",
        accessorFn: (row) => row.user?.email,
        header: t("labels.email"),
        minSize: 200,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "status",
        header: t("labels.status", "Status"),
        size: 120,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => <StatusBadge status={cell.getValue<string>()} />,
      },
      {
        accessorKey: "enrollmentDate",
        header: t("student.enrollment_date"),
        size: 120,
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
          return val ? new Date(val).toLocaleDateString() : "—";
        },
      },
      {
        id: "phone",
        accessorFn: (row) => row.user?.phone,
        header: t("student.phone"),
        size: 130,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        id: "gender",
        accessorFn: (row) => row.user?.gender,
        header: t("student.gender"),
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          if (!val) return "—";
          return val.charAt(0) + val.slice(1).toLowerCase();
        }
      },
      {
        accessorKey: "nationalId",
        header: t("student.national_id"),
        size: 130,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "scholarshipType",
        header: t("student.scholarship_type"),
        size: 120,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          if (!val || val === "NONE") return "—";
          return val.charAt(0) + val.slice(1).toLowerCase();
        }
      },
      {
        accessorKey: "currentYearNumber",
        header: t("student.current_year_number"),
        size: 80,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "hasMedicalNeeds",
        header: t("student.medical_needs"),
        size: 130,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => (
          <span style={{ color: cell.getValue<boolean>() ? "#BE123C" : "#64748B", fontWeight: cell.getValue<boolean>() ? 600 : 400 }}>
            {cell.getValue<boolean>() ? t("student.yes") : t("student.no")}
          </span>
        ),
      },
      {
        id: "actions",
        header: t("student.actions"),
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditStudent?.(row.original);
              }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title={t("student.edit_student")}
            >
              <Edit2 size={16} />
            </button>
            {row.original.user && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (row.original.user?.isActive) {
                    onDeactivateUser?.(row.original.user.id);
                  } else {
                    onReactivateUser?.(row.original.user.id);
                  }
                }}
                className={`p-2 rounded-full transition-colors ${
                  row.original.user.isActive
                    ? "text-red-400 hover:text-red-600 hover:bg-red-50"
                    : "text-green-400 hover:text-green-600 hover:bg-green-50"
                }`}
                title={row.original.user.isActive ? t("labels.deactivate_account") : t("labels.reactivate_account")}
              >
                {row.original.user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
              </button>
            )}
          </div>
        ),
      },
    ],
    [t, onEditStudent, onDeactivateUser, onReactivateUser]
  );

  return (
    <DataTable<Student>
      refetchTrigger={trigger}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchStudents}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
      initialState={{
        columnVisibility: {
          gender: false,
          nationalId: false,
          scholarshipType: false,
          currentYearNumber: false,
          hasMedicalNeeds: false,
        }
      }}
    />
  );
}
