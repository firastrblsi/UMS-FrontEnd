import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { DateColumnFilter } from "@/shared/ui/DateColumnFilter";
import { useAcademicYears } from "../hooks/useAcademicYears";
import type { AcademicYear } from "../api/academicYearApi";
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { academicYearApi } from "../api/academicYearApi";
import { toaster } from "@/components/ui/toaster";

interface AcademicYearsGridProps {
  trigger?: number;
  onEditAcademicYear?: (academicYear: AcademicYear) => void;
}

export function AcademicYearsGrid({ trigger, onEditAcademicYear }: AcademicYearsGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchAcademicYears } = useAcademicYears();

  useEffect(() => {
    if (trigger && trigger > 0) {
      fetchAcademicYears({ page: 0, pageSize: 10, sorting: [], columnFilters: [], globalFilter: "" });
    }
  }, [trigger, fetchAcademicYears]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) {
      try {
        await academicYearApi.deleteAcademicYear(id);
        toaster.create({ title: t("global.deleted", "Deleted"), type: "success" });
        fetchAcademicYears({ page: 0, pageSize: 10, sorting: [], columnFilters: [], globalFilter: "" });
      } catch (err) {
        toaster.create({ title: t("global.delete_failed", "Failed to delete"), type: "error" });
      }
    }
  };

  const columns = useMemo<MRT_ColumnDef<AcademicYear>[]>(() => [
    {
      accessorKey: "name",
      header: t("labels.name", "Name"),
      size: 150,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ cell }) => (
        <span style={{ fontWeight: 600, color: "#1E293B" }}>
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "isCurrent",
      header: t("labels.is_current", "Is Current"),
      size: 110,
      filterVariant: 'select',
      filterSelectOptions: [
        { value: 'true', label: t('student.yes', 'Yes') },
        { value: 'false', label: t('student.no', 'No') },
      ],
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ cell }) => (
        cell.getValue<boolean>() ? (
          <span className="inline-flex items-center justify-center text-green-600 gap-1 font-medium bg-green-50 px-2 py-1 rounded-full text-xs">
            <CheckCircle2 size={14} /> {t("student.yes", "Yes")}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center text-slate-400 gap-1 font-medium bg-slate-50 px-2 py-1 rounded-full text-xs">
            <XCircle size={14} /> {t("student.no", "No")}
          </span>
        )
      ),
    },
    {
      accessorKey: "startDate",
      header: t("labels.start_date", "Start Date"),
      size: 120,
      Filter: DateColumnFilter,
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
    },
    {
      accessorKey: "endDate",
      header: t("labels.end_date", "End Date"),
      size: 120,
      Filter: DateColumnFilter,
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
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
            onClick={(e) => { e.stopPropagation(); onEditAcademicYear?.(row.original); }}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title={t("global.edit", "Edit")}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.original.id); }}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title={t("global.delete", "Delete")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [t, onEditAcademicYear]);

  return (
    <DataTable<AcademicYear>
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchAcademicYears}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
      enableColumnFilters
    />
  );
}
