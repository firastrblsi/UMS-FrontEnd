import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";

import { Edit2, Eye, UserX, UserCheck } from "lucide-react";
import { DataTable } from "@/shared/ui/DataTable";
import { useTeachers } from "../hooks/useTeachers";
import { DateColumnFilter } from "@/shared/ui/DateColumnFilter";
import type {
  Teacher,
  TeacherFilterParams,
  TeacherTitle,
  ContractType,
} from "../types/teacher.types";

// ─── Badges ──────────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  active: { bg: "#F0FDF4", color: "#15803D" },
  inactive: { bg: "#FFF1F2", color: "#BE123C" },
};

function StatusBadge({ isActive }: { isActive: boolean }) {
  const { t } = useTranslation();
  const { bg, color } = isActive
    ? STATUS_STYLES.active
    : STATUS_STYLES.inactive;
  const label = isActive ? t("labels.active") : t("labels.inactive");
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: bg,
        color,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.03em",
        padding: "2px 10px",
        borderRadius: "999px",
      }}
    >
      {label}
    </span>
  );
}

const CONTRACT_STYLES: Record<ContractType, { bg: string; color: string }> = {
  PERMANENT: { bg: "#EFF6FF", color: "#1D4ED8" },
  CONTRACT: { bg: "#FFFBEB", color: "#B45309" },
  PART_TIME: { bg: "#F5F3FF", color: "#6D28D9" },
  VISITING: { bg: "#F0FDFA", color: "#0F766E" },
};

function ContractBadge({ type }: { type: ContractType }) {
  const { t } = useTranslation();
  const { bg, color } = CONTRACT_STYLES[type];
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: bg,
        color,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.03em",
        padding: "2px 10px",
        borderRadius: "999px",
      }}
    >
      {t(`teacher.contract.${type}`)}
    </span>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

interface TeachersGridProps {
  filters?: TeacherFilterParams;
  trigger: number;
  onEditTeacher?: (teacher: Teacher) => void;
  onViewTeacher?: (teacher: Teacher) => void;
  onToggleActivation?: (userId: string, isActive: boolean) => void;
}

export function TeachersGrid({
  filters,
  trigger,
  onEditTeacher,
  onViewTeacher,
  onToggleActivation,
}: TeachersGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchTeachers } =
    useTeachers(filters || {});

  const columns = useMemo<MRT_ColumnDef<Teacher>[]>(
    () => [
      {
        accessorKey: "employeeId",
        header: t("labels.employee_id"),
        size: 120,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
          return val ? (
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
              {val}
            </span>
          ) : (
            <span style={{ color: "#94A3B8" }}>—</span>
          );
        },
      },
      {
        id: "name",
        header: t("labels.name"),
        minSize: 160,
        accessorFn: (row) => `${row.user?.firstName || ""} ${row.user?.lastName || ""}`,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row, cell }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <span style={{ fontWeight: 600, color: "#1E293B" }}>
              {row.original.title
                ? `${t(`teacher.title.${row.original.title as TeacherTitle}`)} `
                : ""}
              {cell.getValue<string>()}
            </span>
            {row.original.specialization && (
              <span style={{ fontSize: "11px", color: "#64748B" }}>
                {row.original.specialization}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "departmentName",
        accessorFn: (row) => row.department?.name,
        header: t("labels.department"),
        minSize: 140,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null | undefined>();
          return val ? (
            <span
              style={{ fontSize: "12px", color: "#1E293B", fontWeight: 500 }}
            >
              {val}
            </span>
          ) : (
            <span style={{ color: "#94A3B8" }}>—</span>
          );
        },
      },
      {
        id: "email",
        accessorFn: (row) => row.user?.email,
        header: t("labels.email"),
        minSize: 200,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#475569",
            }}
          >
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "contractType",
        header: t("labels.contract"),
        size: 120,
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'PERMANENT', label: t('teacher.contract.PERMANENT', 'Permanent') },
          { value: 'CONTRACT', label: t('teacher.contract.CONTRACT', 'Contract') },
          { value: 'PART_TIME', label: t('teacher.contract.PART_TIME', 'Part-time') },
          { value: 'VISITING', label: t('teacher.contract.VISITING', 'Visiting') },
        ],
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const val = cell.getValue<ContractType | null>();
          return val ? (
            <ContractBadge type={val} />
          ) : (
            <span style={{ color: "#94A3B8" }}>—</span>
          );
        },
      },
      {
        accessorKey: "highestDegree",
        header: t("labels.degree"),
        size: 100,
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'PHD', label: t('teacher.degree.PHD', 'PhD') },
          { value: 'MASTER', label: t('teacher.degree.MASTER', 'Master') },
          { value: 'BACHELOR', label: t('teacher.degree.BACHELOR', 'Bachelor') },
          { value: 'OTHER', label: t('teacher.degree.OTHER', 'Other') },
        ],
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
          return val ? (
            <span style={{ fontSize: "12px", color: "#1E293B" }}>
              {t(`teacher.degree.${val}`)}
            </span>
          ) : (
            <span style={{ fontSize: "12px", color: "#94A3B8" }}>—</span>
          );
        },
      },
      {
        accessorKey: "hireDate",
        header: t("labels.hire_date"),
        size: 120,
        Filter: DateColumnFilter,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
          return val ? (
            new Date(val).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
          ) : (
            <span style={{ color: "#94A3B8" }}>—</span>
          );
        },
      },
      {
        id: "isActive",
        accessorFn: (row) => row.user?.isActive,
        header: t("labels.status"),
        size: 100,
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'true', label: t('labels.active', 'Active') },
          { value: 'false', label: t('labels.inactive', 'Inactive') },
        ],
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => <StatusBadge isActive={!!cell.getValue<boolean | undefined>()} />,
      },
      {
        accessorKey: "createdAt",
        header: t("labels.created"),
        size: 120,
        Filter: DateColumnFilter,
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }),
      },
      {
        id: "actions",
        header: t("global.actions", "Actions"),
        size: 150,
        muiTableHeadCellProps: { align: "right" },
        muiTableBodyCellProps: { align: "right" },
        Cell: ({ row }) => (
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewTeacher?.(row.original);
              }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title={t("labels.view_profile", "View Profile")}
            >
              <Eye size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditTeacher?.(row.original);
              }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title={t("global.edit", "Edit")}
            >
              <Edit2 size={16} />
            </button>
            {row.original.user && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleActivation?.(row.original.userId, !!row.original.user?.isActive);
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
    [t, onEditTeacher, onViewTeacher, onToggleActivation],
  );

  useEffect(() => {
    if (trigger > 0) {
      fetchTeachers({
        page: 0,
        pageSize: 10,
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      });
    }
  }, [trigger, fetchTeachers]);

  return (
    <DataTable<Teacher>
      key={JSON.stringify(filters)}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchTeachers}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
      enableColumnFilters
      initialState={{
        columnVisibility: {
          employeeId: false,
          isActive: false,
          createdAt: false,
        },
      }}
    />
  );
}
