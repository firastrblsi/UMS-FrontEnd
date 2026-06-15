import { useMemo } from "react";
import { type MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { useDepartments } from "../hooks/useDepartments";
import type { Department } from "../types/department.types";

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<
  Department["status"],
  { bg: string; color: string; label: string }
> = {
  active: { bg: "#F0FDF4", color: "#15803D", label: "Active" },
  inactive: { bg: "#FFF1F2", color: "#BE123C", label: "Inactive" },
};

function StatusBadge({ status }: { status: Department["status"] }) {
  const { bg, color, label } = STATUS_STYLES[status];
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

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: MRT_ColumnDef<Department>[] = [
  {
    accessorKey: "code",
    header: "Code",
    size: 90,
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
    accessorKey: "name",
    header: "Department Name",
    minSize: 200,
    muiTableHeadCellProps: { align: "center" },
    muiTableBodyCellProps: { align: "center" },
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 500, color: "#1E293B" }}>
        {cell.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "chief",
    header: "Department Chief",
    size: 180,
    muiTableHeadCellProps: { align: "center" },
    muiTableBodyCellProps: { align: "center" },
  },
  {
    accessorKey: "studentsCount",
    header: "Students",
    size: 100,
    muiTableHeadCellProps: { align: "center" },
    muiTableBodyCellProps: { align: "center" },
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 500 }}>
        {cell.getValue<number>().toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "teachersCount",
    header: "Teachers",
    size: 100,
    muiTableHeadCellProps: { align: "right" },
    muiTableBodyCellProps: { align: "right" },
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 500 }}>
        {cell.getValue<number>().toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 110,
    muiTableHeadCellProps: { align: "center" },
    muiTableBodyCellProps: { align: "center" },
    Cell: ({ cell }) => (
      <StatusBadge status={cell.getValue<Department["status"]>()} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    size: 120,
    Cell: ({ cell }) =>
      new Date(cell.getValue<string>()).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
  },
];

// ─── Grid ─────────────────────────────────────────────────────────────────────

export function DepartmentsGrid() {
  const { data, rowCount, isLoading, isFetching, fetchDepartments } =
    useDepartments();

  // columns is defined outside — memoize reference only to satisfy the prop type
  const memoColumns = useMemo(() => columns, []);

  return (
    <DataTable<Department>
      columns={memoColumns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchDepartments}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
    />
  );
}
