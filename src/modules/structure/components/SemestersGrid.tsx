import { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { DateColumnFilter } from "@/shared/ui/DateColumnFilter";
import { useSemesters } from "../hooks/useSemesters";
import type { Semester } from "../api/semesterApi";
import { Edit2, Trash2 } from "lucide-react";
import { semesterApi } from "../api/semesterApi";
import { toaster } from "@/components/ui/toaster";

interface SemestersGridProps {
  trigger?: number;
  onEditSemester?: (semester: Semester) => void;
  externalFilters?: any;
}

export function SemestersGrid({ trigger, onEditSemester, externalFilters }: SemestersGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchSemesters } = useSemesters(externalFilters || {});
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  useEffect(() => {
    import("../api/academicYearApi").then(({ academicYearApi }) => {
      academicYearApi.getAcademicYears({ skip: 0, take: 100 }).then(res => setAcademicYears(res.data)).catch(console.error);
    });
  }, []);

  useEffect(() => {
    if (trigger && trigger > 0) {
      fetchSemesters({ page: 0, pageSize: 10, sorting: [], columnFilters: [], globalFilter: "" });
    }
  }, [trigger, fetchSemesters]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) {
      try {
        await semesterApi.deleteSemester(id);
        toaster.create({ title: t("global.deleted", "Deleted"), type: "success" });
        fetchSemesters({ page: 0, pageSize: 10, sorting: [], columnFilters: [], globalFilter: "" });
      } catch (err) {
        toaster.create({ title: t("global.delete_failed", "Failed to delete"), type: "error" });
      }
    }
  };

  const columns = useMemo<MRT_ColumnDef<Semester>[]>(() => [
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
      accessorKey: "academicYear.name",
      header: t("labels.academic_year", "Academic Year"),
      size: 150,
      filterVariant: 'autocomplete',
      filterSelectOptions: academicYears.map(y => ({ value: y.name, label: y.name })),
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
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
            onClick={(e) => { e.stopPropagation(); onEditSemester?.(row.original); }}
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
  ], [t, onEditSemester]);

  return (
    <DataTable<Semester>
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchSemesters}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
      enableColumnFilters
    />
  );
}
