import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { usePrograms } from "../hooks/usePrograms";
import type { Program } from "../types/university.types";
import type { ProgramFilterParams } from "../api/programApi";

function StatusBadge({ isActive }: { isActive: boolean }) {
  const { t } = useTranslation();
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: isActive ? "#F0FDF4" : "#FFF1F2",
        color: isActive ? "#15803D" : "#BE123C",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.03em",
        padding: "2px 10px",
        borderRadius: "999px",
      }}
    >
      {isActive ? t("labels.active") : t("labels.inactive")}
    </span>
  );
}

interface ProgramsGridProps {
  externalFilters: ProgramFilterParams;
}

export function ProgramsGrid({ externalFilters }: ProgramsGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchPrograms } = usePrograms(externalFilters);

  const columns = useMemo<MRT_ColumnDef<Program>[]>(
    () => [
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
        header: t("labels.name"),
        minSize: 200,
        muiTableHeadCellProps: { align: "left" },
        muiTableBodyCellProps: { align: "left" },
        Cell: ({ cell }) => (
          <span style={{ fontWeight: 600, color: "#1E293B" }}>
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "degreeType",
        header: "Degree Type",
        size: 140,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "isActive",
        header: t("labels.status", "Status"),
        size: 110,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => <StatusBadge isActive={cell.getValue<boolean>()} />,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        size: 120,
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
          return val ? new Date(val).toLocaleDateString() : "—";
        },
      },
    ],
    [t]
  );

  return (
    <DataTable<Program>
      key={JSON.stringify(externalFilters)}
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchPrograms}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
    />
  );
}
