import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { DateColumnFilter } from "@/shared/ui/DateColumnFilter";
import { usePrograms } from "../hooks/usePrograms";
import type { Program } from "../types/university.types";
import type { ProgramFilterParams } from "../api/programApi";
import { Edit2, Trash2, Ban, CheckCircle } from "lucide-react";
import { programApi } from "../api/programApi";
import { toaster } from "@/components/ui/toaster";

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
  externalFilters?: ProgramFilterParams;
  trigger?: number;
  onEditProgram?: (program: Program) => void;
}

export function ProgramsGrid({ externalFilters, trigger, onEditProgram }: ProgramsGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchPrograms } = usePrograms(externalFilters || {});

  useEffect(() => {
    if (trigger && trigger > 0) {
      fetchPrograms({
        page: 0,
        pageSize: 10,
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      });
    }
  }, [trigger, fetchPrograms]);

  const handleToggleActivation = async (program: Program) => {
    try {
      await programApi.updateProgram(program.id, { isActive: !program.isActive });
      toaster.create({ title: t("global.updated", "Updated"), type: "success" });
      fetchPrograms({
        page: 0,
        pageSize: 10,
        sorting: [],
        columnFilters: [],
        globalFilter: "",
      });
    } catch (err) {
      toaster.create({ title: t("global.update_failed", "Failed to update"), type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) {
      try {
        await programApi.deleteProgram(id);
        toaster.create({ title: t("global.deleted", "Deleted"), type: "success" });
        fetchPrograms({
          page: 0,
          pageSize: 10,
          sorting: [],
          columnFilters: [],
          globalFilter: "",
        });
      } catch (err) {
        toaster.create({ title: t("global.delete_failed", "Failed to delete"), type: "error" });
      }
    }
  };

  const columns = useMemo<MRT_ColumnDef<Program>[]>(
    () => [
      {
        accessorKey: "code",
        header: t("global.code", "Code"),
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
        header: t("labels.program_name", "Program Name"),
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
        header: t("labels.degree_type", "Degree Type"),
        size: 140,
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'BACHELOR', label: 'BACHELOR' },
          { value: 'MASTER', label: 'MASTER' },
          { value: 'DIPLOMA', label: 'Diploma' },
          { value: 'CERTIFICATE', label: 'Certificate' },
        ],
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "totalCredits",
        header: t("labels.total_credits", "Total Credits"),
        size: 110,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "numberOfSemesters",
        header: t("labels.number_of_semesters", "Semesters"),
        size: 110,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
      },
      {
        accessorKey: "isActive",
        header: t("labels.status", "Status"),
        size: 110,
        filterVariant: 'select',
        filterSelectOptions: [
          { value: 'true', label: t('labels.active', 'Active') },
          { value: 'false', label: t('labels.inactive', 'Inactive') },
        ],
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => <StatusBadge isActive={cell.getValue<boolean>()} />,
      },
      {
        accessorKey: "createdAt",
        header: t("labels.created", "Created"),
        size: 120,
        Filter: DateColumnFilter,
        Cell: ({ cell }) => {
          const val = cell.getValue<string | null>();
          return val ? new Date(val).toLocaleDateString() : "—";
        },
      },
      {
        id: "actions",
        header: t("student.actions", "Actions"),
        size: 100,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditProgram?.(row.original);
              }}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title={t("global.edit", "Edit")}
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original.id);
              }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title={t("global.delete", "Delete")}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleActivation(row.original);
              }}
              className={`p-2 rounded-full transition-colors ${
                row.original.isActive
                  ? "text-orange-400 hover:text-orange-600 hover:bg-orange-50"
                  : "text-green-400 hover:text-green-600 hover:bg-green-50"
              }`}
              title={row.original.isActive ? t("labels.deactivate_account", "Deactivate") : t("labels.reactivate_account", "Activate")}
            >
              {row.original.isActive ? <Ban size={16} /> : <CheckCircle size={16} />}
            </button>
          </div>
        ),
      },
    ],
    [t, onEditProgram]
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
      enableHiding
      enableColumnFilters
    />
  );
}
