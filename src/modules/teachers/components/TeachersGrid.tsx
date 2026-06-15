import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { useTeachers } from "../hooks/useTeachers";
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
  externalFilters: TeacherFilterParams;
}

export function TeachersGrid({ externalFilters }: TeachersGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchTeachers } =
    useTeachers(externalFilters);

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
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
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
        accessorKey: "departmentName",
        header: t("labels.department"),
        minSize: 140,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
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
        accessorKey: "email",
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
        accessorKey: "isActive",
        header: t("labels.status"),
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => <StatusBadge isActive={cell.getValue<boolean>()} />,
      },
      {
        accessorKey: "createdAt",
        header: t("labels.created"),
        size: 120,
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }),
      },
    ],
    [t],
  );

  return (
    <DataTable<Teacher>
      key={JSON.stringify(externalFilters)}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchTeachers}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
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
