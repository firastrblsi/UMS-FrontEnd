import { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { DataTable } from "@/shared/ui/DataTable";
import { useClassGroups } from "../hooks/useClassGroups";
import type { ClassGroup } from "../api/classGroupApi";
import { Edit2, Trash2 } from "lucide-react";
import { classGroupApi } from "../api/classGroupApi";
import { toaster } from "@/components/ui/toaster";

interface ClassGroupsGridProps {
  trigger?: number;
  onEditClassGroup?: (classGroup: ClassGroup) => void;
  externalFilters?: any;
}

export function ClassGroupsGrid({ trigger, onEditClassGroup, externalFilters }: ClassGroupsGridProps) {
  const { t } = useTranslation();
  const { data, rowCount, isLoading, isFetching, fetchClassGroups } = useClassGroups(externalFilters || {});
  const [programs, setPrograms] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  useEffect(() => {
    import("../api/programApi").then(({ programApi }) => {
      programApi.getPrograms({ skip: 0, take: 500 }).then(res => setPrograms(res.data)).catch(console.error);
    });
    import("../api/academicYearApi").then(({ academicYearApi }) => {
      academicYearApi.getAcademicYears({ skip: 0, take: 100 }).then(res => setAcademicYears(res.data)).catch(console.error);
    });
  }, []);

  useEffect(() => {
    if (trigger && trigger > 0) {
      fetchClassGroups({ page: 0, pageSize: 10, sorting: [], columnFilters: [], globalFilter: "" });
    }
  }, [trigger, fetchClassGroups]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t("global.confirm_delete", "Are you sure you want to delete this?"))) {
      try {
        await classGroupApi.deleteClassGroup(id);
        toaster.create({ title: t("global.deleted", "Deleted"), type: "success" });
        fetchClassGroups({ page: 0, pageSize: 10, sorting: [], columnFilters: [], globalFilter: "" });
      } catch (err) {
        toaster.create({ title: t("global.delete_failed", "Failed to delete"), type: "error" });
      }
    }
  };

  const columns = useMemo<MRT_ColumnDef<ClassGroup>[]>(() => [
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
      accessorKey: "capacity",
      header: t("labels.capacity", "Capacity"),
      size: 100,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
    },
    {
      accessorKey: "program.name",
      header: t("labels.program", "Program"),
      size: 150,
      filterVariant: 'autocomplete',
      filterSelectOptions: programs.map(p => ({ value: p.name, label: p.name })),
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
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
      id: "actions",
      header: t("student.actions", "Actions"),
      size: 100,
      muiTableHeadCellProps: { align: "center" },
      muiTableBodyCellProps: { align: "center" },
      Cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEditClassGroup?.(row.original); }}
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
  ], [t, onEditClassGroup]);

  return (
    <DataTable<ClassGroup>
      columns={columns}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      rowCount={rowCount}
      onFetchData={fetchClassGroups}
      initialPageSize={10}
      pageSizeOptions={[5, 10, 25, 50]}
      enableHiding
      enableColumnFilters
    />
  );
}
